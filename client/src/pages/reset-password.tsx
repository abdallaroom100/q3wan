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
          <input
            type="password"
            className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">تأكيد كلمة المرور الجديدة</label>
          <input
            type="password"
            className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
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