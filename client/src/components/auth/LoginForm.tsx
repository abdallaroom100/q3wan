import React, { useState } from 'react';

interface LoginFormProps {
  loginData: {
    loginDetails: string;
    password: string;
  };
  onLoginChange: (field: string, value: string) => void;
  onLogin: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ loginData, onLoginChange, onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="relative">
        <input
          type="text"
          placeholder="الإيميل أو رقم الهوية"
          value={loginData.loginDetails}
          onChange={(e) => onLoginChange('loginDetails', e.target.value)}
          className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[rgb(58,61,108)] focus:ring-2 focus:ring-[rgb(58,61,108)]/20 transition-all duration-300 shadow-sm"
        />
      </div>
      
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="كلمة المرور"
          value={loginData.password}
          onChange={(e) => onLoginChange('password', e.target.value)}
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

      <button
        onClick={onLogin}
        className="w-full py-4 px-6 bg-[#323665] text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
      >
        دخول
      </button>

      <div className="text-center">
        <button
          type="button"
          className="text-gray-500 hover:text-[rgb(58,61,108)] text-sm transition-colors duration-300 hover:underline mt-2"
          onClick={() => window.location.href = '/forgot-password'}
        >
          نسيت كلمة المرور؟
        </button>
      </div>
    </div>
  );
};

export default LoginForm; 