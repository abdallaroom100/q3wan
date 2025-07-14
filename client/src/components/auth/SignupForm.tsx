import React from 'react';

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
          type="password"
          placeholder="كلمة المرور"
          value={signupData.password}
          onChange={(e) => onSignupChange('password', e.target.value)}
          className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[rgb(58,61,108)] focus:ring-2 focus:ring-[rgb(58,61,108)]/20 transition-all duration-300 shadow-sm"
        />
      </div>
      <div className="relative">
        <input
          type="password"
          placeholder="تاكيد كلمة المرور"
          value={signupData.confirmPassword}
          onChange={(e) => onSignupChange('confirmPassword', e.target.value)}
          className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[rgb(58,61,108)] focus:ring-2 focus:ring-[rgb(58,61,108)]/20 transition-all duration-300 shadow-sm"
        />
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