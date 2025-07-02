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
          className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:border-[#2c3e50] transition-all duration-300"
        />
      </div>
      <div className="relative">
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={signupData.email}
          required
          onChange={(e) => onSignupChange('email', e.target.value)}
          className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:border-[#2c3e50] transition-all duration-300"
        />
      </div>
      <div className="relative flex gap-2 items-center justify-center ">
        <input
          type="tel"
          placeholder="رقم الجوال"
          style={{direction:'rtl'}}
          value={signupData.phone}
          onChange={(e) => onSignupChange('phone', e.target.value)}
          className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:border-[#2c3e50] transition-all duration-300"
        />
        <span className='disabled text-white  bg-white/10 border border-white/20 !h-1/2 rounded-2xl px-2 py-1'> 966+</span>
      </div>
      <div className="relative">
        <input
          type="tel"
          placeholder="رقم الهوية"
          style={{direction:'rtl'}}
          value={signupData.identityNumber}
          onChange={(e) => onSignupChange('identityNumber', e.target.value)}
          className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:border-[#2c3e50] transition-all duration-300"
        />
      </div>

    

      <div className="relative">
        <input
          type="password"
          placeholder="كلمة المرور"
          value={signupData.password}
          onChange={(e) => onSignupChange('password', e.target.value)}
          className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:border-[#2c3e50] transition-all duration-300"
        />
      </div>
      <div className="relative">
        <input
          type="password"
          placeholder="تاكيد كلمة المرور"
          value={signupData.confirmPassword}
          onChange={(e) => onSignupChange('confirmPassword', e.target.value)}
          className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:border-[#2c3e50] transition-all duration-300"
        />
      </div>

      <button
        onClick={onSignup}
        className="w-full py-4 px-6 bg-gradient-to-r from-[#2c3e50] to-[#1a1a2e] text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
      >
        إنشاء الحساب
      </button>

      <div className="text-center">
        <p className="text-white/70 text-xs">
          بالتسجيل، أنت توافق على 
          <button className=" transition-colors duration-300 underline mx-1">
            الشروط والأحكام
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm; 