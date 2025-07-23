import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import hotToast from '../common/hotToast';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // استخراج token و email من الرابط
  const params = new URLSearchParams(location.search);
  const token = params.get('token') || '';
  const email = params.get('email') || '';

  useEffect(() => {
    // تحقق من صلاحية التوكن
    const checkToken = async () => {
      setChecking(true);
      try {
        const res = await fetch('/user/checkforget', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, email }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setValid(true);
        } else {
          hotToast({ type: 'error', message: data.message || 'الرابط غير صالح أو منتهي الصلاحية' });
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch {
        hotToast({ type: 'error', message: 'حدث خطأ أثناء التحقق من الرابط' });
        setTimeout(() => navigate('/login'), 2000);
      } finally {
        setChecking(false);
      }
    };
    if (token && email) checkToken();
    else {
      hotToast({ type: 'error', message: 'رابط غير صالح' });
      navigate('/login');
    }
  }, [token, email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      hotToast({ type: 'error', message: 'يرجى ملء جميع الحقول' });
      return;
    }
    if (password.length < 6) {
      hotToast({ type: 'error', message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
      return;
    }
    if (password !== confirmPassword) {
      hotToast({ type: 'error', message: 'كلمتا المرور غير متطابقتين' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/user/updatePassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        hotToast({ type: 'success', message: 'تم تغيير كلمة المرور بنجاح' });
        setTimeout(() => navigate('/login'), 800);
      } else {
        hotToast({ type: 'error', message: data.message || 'حدث خطأ، حاول مرة أخرى' });
      }
    } catch {
      hotToast({ type: 'error', message: 'حدث خطأ أثناء تغيير كلمة المرور' });
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return <div className="min-h-[89vh] flex items-center justify-center bg-gray-50"><div>جاري التحقق من الرابط...</div></div>;
  }

  if (!valid) return null;

  return (
    <div className="min-h-[89vh] flex items-center justify-center bg-gray-50 p-4" dir="rtl">
      <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full border border-gray-100 animate-fadeIn">
        <h2 className="text-2xl font-bold mb-6 text-center">تغيير كلمة المرور</h2>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">كلمة المرور الجديدة</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 pr-12"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
            >
              {showPassword ? (
                // Eye Off SVG
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.234.938-4.675m2.122 2.122A7.963 7.963 0 004 9c0 4.418 3.582 8 8 8 1.657 0 3.234-.336 4.675-.938m2.122-2.122A7.963 7.963 0 0020 15c0-4.418-3.582-8-8-8-1.657 0-3.234.336-4.675.938m2.122 2.122A10.05 10.05 0 0112 5c5.523 0 10 4.477 10 10 0 1.657-.336 3.234-.938 4.675" /></svg>
              ) : (
                // Eye SVG
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">تأكيد كلمة المرور الجديدة</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 pr-12"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
            >
              {showConfirmPassword ? (
                // Eye Off SVG
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.234.938-4.675m2.122 2.122A7.963 7.963 0 004 9c0 4.418 3.582 8 8 8 1.657 0 3.234-.336 4.675-.938m2.122-2.122A7.963 7.963 0 0020 15c0-4.418-3.582-8-8-8-1.657 0-3.234.336-4.675.938m2.122 2.122A10.05 10.05 0 0112 5c5.523 0 10 4.477 10 10 0 1.657-.336 3.234-.938 4.675" /></svg>
              ) : (
                // Eye SVG
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-[#323665] text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          disabled={loading}
        >
          {loading ? 'جاري الحفظ...' : 'حفظ كلمة المرور الجديدة'}
        </button>
        <div className="text-center mt-4">
          <button type="button" className="text-gray-500 hover:text-blue-700 text-sm" onClick={() => navigate('/login')}>العودة لتسجيل الدخول</button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword; 