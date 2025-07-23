import React, { useState } from 'react';

interface SignupFormProps {
  signupData: {
    fullName: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
    identityNumber: string;
  };
  onSignupChange: (field: string, value: string) => void;
  onSignup: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ signupData, onSignupChange, onSignup }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="relative">
        <input
          type="text"
          placeholder="الاسم رباعي"
          value={signupData.fullName}
          onChange={(e) => onSignupChange('fullName', e.target.value)}
          className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[rgb(58,61,108)] focus:ring-2 focus:ring-[rgb(58,61,108)]/20 transition-all duration-300 shadow-sm"
        />
      </div>
      <div className="relative">
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={signupData.email}
          required
          onChange={(e) => onSignupChange('email', e.target.value)}
          className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[rgb(58,61,108)] focus:ring-2 focus:ring-[rgb(58,61,108)]/20 transition-all duration-300 shadow-sm"
        />
      </div>
      <div className="relative flex gap-2 items-center justify-center ">
        <input
          type="tel"
          placeholder="رقم الجوال"
          style={{direction:'rtl'}}
          value={signupData.phone}
          onChange={(e) => onSignupChange('phone', e.target.value)}
          className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[rgb(58,61,108)] focus:ring-2 focus:ring-[rgb(58,61,108)]/20 transition-all duration-300 shadow-sm"
        />
        <span className='disabled text-gray-600 bg-gray-100 border border-gray-200   px-2 py-3 rounded-lg '> 966+</span>
      </div>
      <div className="relative">
        <input
          type="tel"
          placeholder="رقم الهوية"
          style={{direction:'rtl'}}
          value={signupData.identityNumber}
          onChange={(e) => onSignupChange('identityNumber', e.target.value)}
          className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[rgb(58,61,108)] focus:ring-2 focus:ring-[rgb(58,61,108)]/20 transition-all duration-300 shadow-sm"
        />
      </div>

    

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="كلمة المرور"
          value={signupData.password}
          onChange={(e) => onSignupChange('password', e.target.value)}
          className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[rgb(58,61,108)] focus:ring-2 focus:ring-[rgb(58,61,108)]/20 transition-all duration-300 shadow-sm pr-12"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none"
          tabIndex={-1}
        >
          {showPassword ? (
            // Eye open SVG
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ) : (
            // Eye closed SVG
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95m3.249-2.568A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.973 9.973 0 01-4.043 5.306M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 6L6 6" />
            </svg>
          )}
        </button>
      </div>
      <div className="relative">
        <input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="تاكيد كلمة المرور"
          value={signupData.confirmPassword}
          onChange={(e) => onSignupChange('confirmPassword', e.target.value)}
          className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[rgb(58,61,108)] focus:ring-2 focus:ring-[rgb(58,61,108)]/20 transition-all duration-300 shadow-sm pr-12"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword((prev) => !prev)}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none"
          tabIndex={-1}
        >
          {showConfirmPassword ? (
            // Eye open SVG
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ) : (
            // Eye closed SVG
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95m3.249-2.568A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.973 9.973 0 01-4.043 5.306M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 6L6 6" />
            </svg>
          )}
        </button>
      </div>

      <button
        onClick={onSignup}
        className="w-full py-4 px-6 bg-[#323665] text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
      >
        إنشاء الحساب
      </button>

      <div className="text-center">
        <p className="text-gray-500 text-xs">
          بالتسجيل، أنت توافق على 
          <button className="text-[rgb(58,61,108)] transition-colors duration-300 underline mx-1 hover:text-[rgb(149,122,77)]">
            الشروط والأحكام
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm; 