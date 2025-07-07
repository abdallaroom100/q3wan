import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthTabs from "../../components/auth/AuthTabs";
import LoginForm from "../../components/auth/LoginForm";
import SignupForm from "../../components/auth/SignupForm";
import hotToast from "../../common/hotToast";
import validator from "validator";
import useSignUpUser from "../../hooks/Auth/UseSignUpUser";
import useLoginUser from "../../hooks/Auth/useLoignUser";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/slices/user";



export default function ArabicAuthForm() {
  
  const history = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [loginData, setLoginData] = useState({
    loginDetails: "",
    password: "",
  });
  const [signupData, setSignupData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    identityNumber: "",
  });
   
  const currentUser = useSelector((state:any)=>state.user.user)
  useEffect(() => {
    
    if(currentUser){
    history("/")
    }
  }, [currentUser]);


  const dispatch = useDispatch()

  const { SignUpUser } = useSignUpUser();

  const { loginUser } = useLoginUser();

  const handleLogin = async () => {
    if (!loginData.loginDetails || !loginData.password) {
      return hotToast({
        type: "error",
        message: "يرجي ملئ جميع الحقول المطلوبة",
      });
    }

    const { error, userData } = await loginUser(loginData);
    if (error) return hotToast({ type: "error", message: error });

    if (userData) {
      hotToast({ type: "success", message: "تم تسجيل الدخول بنجاح!" });
      localStorage.setItem("user", JSON.stringify(userData))
      // dispatch(setUser(userData))
        // window.location.reload();
    
    }
    return;
  };

  const handleLoginChange = (field: string, value: string) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignup = async () => {
    const does_user_filled_all_fields = Object.values(signupData).every(
      (_) => _
    );
    if (!does_user_filled_all_fields)
      return hotToast({
        type: "error",
        message: "يرجي ملئ جميع الحقول المطلوبة",
      });

    const checkFullName = signupData.fullName.split(" ").filter((_) => _ != "");
    if (checkFullName.length != 4)
      return hotToast({ type: "error", message: "يرجي إدخال الاسم رباعي" });

    signupData.fullName = checkFullName.join(" ");

    if (!validator.isEmail(signupData.email)) {
      return hotToast({
        type: "error",
        message: "يرجي إدخال بريد إلكتروني صالح",
      });
    }

    if (signupData.phone.length !== 9) {
      return hotToast({ type: "error", message: "يرجي إدخال رقم هاتف صالح" });
    }

    if (signupData.identityNumber.length !== 10) {
      return hotToast({ type: "error", message: "يرجي إدخال رقم هوية صالح" });
    }

    if (signupData.password.length < 8) {
      return hotToast({
        type: "error",
        message: "كلمة المرور يجب أن تكون على الأقل 8 أحرف",
      });
    }

    if (signupData.password !== signupData.confirmPassword) {
      return hotToast({
        type: "error",
        message: "يرجي إدخال كلمة مرور مطابقة للتأكيد",
      });
    }
    const { error, userData } = await SignUpUser(signupData);
    console.log(error);
    if (error) return hotToast({ type: "error", message: error });
    console.log(userData);

    setTimeout(() => {
      setActiveTab("login");
    }, 1000);
    return hotToast({ type: "success", message: "تم إنشاء الحساب بنجاح!" });
  };

  const handleSignupChange = (field: string, value: string) => {
    setSignupData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div
      className="min-h-[89vh] bg-gradient-to-br from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6] flex items-center justify-center p-4"
      dir="rtl"
    >
      <Toaster />
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
          <AuthHeader />
          <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="px-8 pb-8">
            {activeTab === "login" ? (
              <LoginForm
                loginData={loginData}
                onLoginChange={handleLoginChange}
                onLogin={handleLogin}
              />
            ) : (
              <SignupForm
                signupData={signupData}
                onSignupChange={handleSignupChange}
                onSignup={handleSignup}
              />
            )}
          </div> 
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">© 2025 جميع الحقوق محفوظة</p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
