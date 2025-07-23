import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import hotToast from '../common/hotToast';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      hotToast({ type: 'error', message: 'يرجى إدخال البريد الإلكتروني' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/user/forgetPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success !== false) {
        hotToast({ type: 'success', message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني' });
        setTimeout(() => navigate('/login'), 700);
      } else {
        hotToast({ type: 'error', message: data.message || 'حدث خطأ، حاول مرة أخرى' });
      }
    } catch (err) {
      hotToast({ type: 'error', message: 'حدث خطأ أثناء الإرسال' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[89vh] flex items-center justify-center bg-gray-50 p-4" dir="rtl">
      <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full border border-gray-100 animate-fadeIn">
        <h2 className="text-2xl font-bold mb-6 text-center">استعادة كلمة المرور</h2>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">البريد الإلكتروني</label>
          <input
            type="email"
            className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-[#323665] text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          disabled={loading}
        >
          {loading ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}
        </button>
        <div className="text-center mt-4">
          <button type="button" className="text-gray-500 hover:text-blue-700 text-sm" onClick={() => navigate('/login')}>العودة لتسجيل الدخول</button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword; 