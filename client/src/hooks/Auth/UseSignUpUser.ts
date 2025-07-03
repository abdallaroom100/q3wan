import axios from "axios";
import { useState } from "react";

const useSignUpUser = () => {
  const [userData, setUserData] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const SignUpUser = async (signupData: any): Promise<{
    success: boolean;
    userData?: any;
    error?: string;
  }> => {
    setIsLoading(true);
    setError(null);
    setUserData(null);
    
    try {
      // const res = await axios.post(`${import.meta.env.VITE_NODE_ENV  == 'development' ? "http://localhost:5000":"https://children-khaki.vercel.app"}/user/signup`, signupData);
      const res = await axios.post("/user/signup", signupData);
      setUserData(res.data); // ✅ تحديث state
      return { success: true, userData: res.data };
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || "حدث خطأ أثناء التسجيل";
      setError(errorMessage); // ✅ تحديث state
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { userData, error, isLoading, SignUpUser };
}

export default useSignUpUser;
