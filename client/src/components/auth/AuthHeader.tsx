import React from 'react';

const AuthHeader = () => {
  return (
    <div className="text-center py-12 px-8 bg-gradient-to-b from-gray-50 to-white pt-[20px]">
      <div className="w-32 h-32 mx-auto mb-6 flex items-center justify-center">
        <img src="/img/logo.png" alt="شعار الموقع" className="w-full h-full object-contain" />
      </div>
      <h1 className="text-2xl font-bold text-[rgb(58,61,108)] mb-2">مرحباً بك</h1>
      <p className="text-gray-600 text-sm">تسجيل الدخول للمتابعة</p>
    </div>
  );
};

export default AuthHeader; 