import React from 'react';

interface AuthTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AuthTabs: React.FC<AuthTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="relative flex mx-6 mb-8 bg-gray-100 rounded-2xl p-1">
      <div 
        className={`absolute top-1 bottom-1 bg-[#323665] rounded-xl shadow-lg transition-all duration-500 ease-out ${
          activeTab === 'login' ? 'right-1 left-1/2' : 'left-1 right-1/2'
        }`}
      ></div>
      <button
        onClick={() => onTabChange('login')}
        className={`flex-1 py-3 px-6 text-center font-medium rounded-xl transition-all duration-300 relative z-10 ${
          activeTab === 'login' 
            ? 'text-white' 
            : 'text-gray-600 hover:text-[rgb(58,61,108)]'
        }`}
      >
        تسجيل الدخول
      </button>
      <button
        onClick={() => onTabChange('signup')}
        className={`flex-1 py-3 px-6 text-center font-medium rounded-xl transition-all duration-300 relative z-10 ${
          activeTab === 'signup' 
            ? 'text-white' 
            : 'text-gray-600 hover:text-[rgb(58,61,108)]'
        }`}
      >
        إنشاء حساب
      </button>
    </div>
  );
};

export default AuthTabs; 