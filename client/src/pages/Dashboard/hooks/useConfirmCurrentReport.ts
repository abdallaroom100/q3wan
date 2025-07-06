import axios from "axios";
import { useState } from "react";

export const useConfirmCurrentReport = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  
  let token = "";
  try {
    const admin = JSON.parse(localStorage.getItem("admin") || "");
    if (admin.token) {
      token = admin.token;
    }
  } catch (error) {
    console.log(error);
  }
  
  const confirmCurrentReport = async (reportId: string| undefined) => {
    setLoading(true);
    setError(null); // إعادة تعيين الخطأ
    setIsConfirmed(false); // إعادة تعيين حالة التأكيد
    
    await axios
      .post(
        `/admin/confirm/${reportId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      ).then((res)=>{
        console.log(res.data)
           if(res.data.success){
            setIsConfirmed(true)
           }
      })
      .catch((error) => {
        setError(error.response.data.error);
      })
      .finally(() => setLoading(false));
  };
  
  return { confirmLoading: loading, confirmCurrentReport, isConfirmed, confirmReportError: error };
};
