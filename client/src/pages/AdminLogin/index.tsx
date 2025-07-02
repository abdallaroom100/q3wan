import { useNavigate } from "react-router-dom";
import hotToast from "../../common/hotToast";
import useLoginAdmin from "../../hooks/admin/useLoginAdmin";
import { useState } from "react";
import { assignAdmin } from "../../store/slices/dashboard/AdminSlice";
import { useDispatch } from "react-redux";

const fadeInStyle: React.CSSProperties = {
  animation: 'fadeIn 0.7s',
};

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()
   const {loginAdmin} = useLoginAdmin()
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
   
     const {admin,error} = await loginAdmin(email,password)
     setLoading(false)
     if(error){
      hotToast({type:"error",message:error})
      return;
     }
     if(admin){
      hotToast({type:"success",message:"تم تسجيل الدخول بنجاح"})
      dispatch(assignAdmin(admin))
      navigate("/dashboard")
     }
      
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0e7ff] to-[#f3f4f6]" style={{ direction: 'rtl' }}>
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white/90 shadow-2xl rounded-3xl px-10 py-10 flex flex-col items-center animate-fadeIn"
        style={fadeInStyle}
      >
        <img src="/img/logo.png" alt="شعار الشركة" className="mb-6 w-32 h-32 object-contain drop-shadow-lg" />
        <h2 className="mb-6 text-3xl font-extrabold text-[#3a3d6c]">تسجيل دخول الأدمن</h2>
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border border-[#3a3d6c]/30 focus:border-[#3a3d6c] transition rounded-xl p-4 mb-4 w-full text-lg bg-white/70 placeholder-[#3a3d6c]/40 focus:outline-none shadow-sm"
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="كلمة السر"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border border-[#3a3d6c]/30 focus:border-[#3a3d6c] transition rounded-xl p-4 mb-6 w-full text-lg bg-white/70 placeholder-[#3a3d6c]/40 focus:outline-none shadow-sm"
          autoComplete="current-password"
        />
        <button
          type="submit"
          className={`w-full py-3 text-white text-lg font-bold rounded-xl cursor-pointer shadow-lg flex items-center justify-center gap-2
            bg-[#3a3d6c] transition-all duration-300
            ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#23244a] active:bg-[#18192e] hover:scale-105 active:scale-95'}`}
          disabled={loading}
          style={{ minHeight: 48 }}
        >
          {loading ? (
            <span className="inline-block w-6 h-6 border-4 border-white border-t-[#3a3d6c] rounded-full animate-spin"></span>
          ) : (
            <span className="tracking-wide">دخول</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin; 