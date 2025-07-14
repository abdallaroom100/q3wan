import React from 'react';

interface LoginFormProps {
  loginData: {
    loginDetails: string;
    password: string;
  };
  onLoginChange: (field: string, value: string) => void;
  onLogin: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ loginData, onLoginChange, onLogin }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="relative">
        <input
          type="text"
          placeholder="رقم الجوال أو الإيميل"
          value={loginData.loginDetails}
          onChange={(e) => onLoginChange('loginDetails', e.target.value)}
          className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[rgb(58,61,108)] focus:ring-2 focus:ring-[rgb(58,61,108)]/20 transition-all duration-300 shadow-sm"
        />
      </div>
      
      <div className="relative">
        <input
          type="password"
          placeholder="كلمة المرور"
          value={loginData.password}
          onChange={(e) => onLoginChange('password', e.target.value)}
          className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[rgb(58,61,108)] focus:ring-2 focus:ring-[rgb(58,61,108)]/20 transition-all duration-300 shadow-sm"
        />
      </div>

      <button
        onClick={onLogin}
        className="w-full py-4 px-6 bg-[#323665] text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
      >
        دخول
      </button>

      <div className="text-center">
        {/* <button className="text-gray-500 hover:text-[rgb(58,61,108)] text-sm transition-colors duration-300 hover:underline">
          نسيت كلمة المرور؟
        </button> */}
      </div>
    </div>
  );
};

export default LoginForm; 