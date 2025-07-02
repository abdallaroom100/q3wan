import { setUser } from "../../store/slices/user";
import axios from "axios";
import { useDispatch } from "react-redux";

const useLoginUser = () => {
  const dispatch = useDispatch()
  const loginUser = async (
    loginData: any
  ): Promise<{
    success: boolean;
    userData?: any;
    error?: string;
  }> => {
    try {
      const response = await axios.post(
        "http://localhost:5000/user/login",
        loginData
      );
       dispatch(setUser(response.data))
      return { success: true, userData: response.data };
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error || "حدث خطأ أثناء التسجيل";

      return { success: false, error: errorMessage };
    }
  };
  return { loginUser };
};

export default useLoginUser;
