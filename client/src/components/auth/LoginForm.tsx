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
          className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:border-[#2c3e50] transition-all duration-300"
        />
      </div>
      
      <div className="relative">
        <input
          type="password"
          placeholder="كلمة المرور"
          value={loginData.password}
          onChange={(e) => onLoginChange('password', e.target.value)}
          className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:border-[#2c3e50] transition-all duration-300"
        />
      </div>

      <button
        onClick={onLogin}
        className="w-full py-4 px-6 bg-gradient-to-r from-[#2c3e50] to-[#1a1a2e] text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
      >
        دخول
      </button>

      <div className="text-center">
        <button className="text-white/70 hover:text-white text-sm transition-colors duration-300 hover:underline">
          نسيت كلمة المرور؟
        </button>
      </div>
    </div>
  );
};

export default LoginForm; 