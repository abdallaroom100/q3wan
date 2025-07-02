import React from 'react';

interface AuthTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AuthTabs: React.FC<AuthTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="relative flex mx-6 mb-8 bg-white/10 rounded-2xl p-1 backdrop-blur-sm">
      <div 
        className={`absolute top-1 bottom-1 bg-gradient-to-r from-[#2c3e50] to-[#1a1a2e] rounded-xl shadow-lg transition-all duration-500 ease-out ${
          activeTab === 'login' ? 'right-1 left-1/2' : 'left-1 right-1/2'
        }`}
      ></div>
      <button
        onClick={() => onTabChange('login')}
        className={`flex-1 py-3 px-6 text-center font-medium rounded-xl transition-all duration-300 relative z-10 ${
          activeTab === 'login' 
            ? 'text-white' 
            : 'text-white/70 hover:text-white'
        }`}
      >
        تسجيل الدخول
      </button>
      <button
        onClick={() => onTabChange('signup')}
        className={`flex-1 py-3 px-6 text-center font-medium rounded-xl transition-all duration-300 relative z-10 ${
          activeTab === 'signup' 
            ? 'text-white' 
            : 'text-white/70 hover:text-white'
        }`}
      >
        إنشاء حساب
      </button>
    </div>
  );
};

export default AuthTabs; 