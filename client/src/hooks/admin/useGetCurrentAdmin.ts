import hotToast from "../../common/hotToast";
import { assignAdmin } from "../../store/slices/dashboard/AdminSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const useGetCurrentAdmin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string |null>(null);
  const [admin, setAdmin] = useState<Record<string,any> | null>(null);
  const navigate = useNavigate()
  const dispatch = useDispatch();
  let token = ""
  

       try {
         const adminData = JSON.parse(localStorage.getItem("admin") || "");
         token = adminData?.token || "";
       } catch (e) {
         token = "";
       }
   
  const getCurrentAdmin = async () => {
    setIsLoading(true);
    await axios
      .get("http://localhost:5000/admin/me",{
        headers:{
            "Content-Type":"application/json",
            "authorization":`Bearer ${token}`
        }
      })
      .then((res) => {
      
        dispatch(assignAdmin(res.data.admin));
        setAdmin(res.data.admin)
      })
      .catch((error) => {
        setError(error.response.data.error)
        console.log(error.response.data.error)
        navigate("/admin-login")
        // hotToast({ type: "error", message: error.response.data.error });
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    getCurrentAdmin();
  }, []);
  return {isLoading,admin,error}
};

export default useGetCurrentAdmin;
