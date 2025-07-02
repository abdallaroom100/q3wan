import React from 'react';

const AuthHeader = () => {
  return (
    <div className="text-center py-12 px-8 bg-gradient-to-b from-white/5 to-transparent">
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#2c3e50] to-[#1a1a2e] rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">مرحباً بك</h1>
      <p className="text-white/70 text-sm">تسجيل الدخول للمتابعة</p>
    </div>
  );
};

export default AuthHeader; 