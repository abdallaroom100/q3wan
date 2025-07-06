import axios from "axios";
import { useState } from "react";

export const useRejectManagerReport = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isManagerReject, setIsRejected] = useState<boolean>(false);
  
  let token = "";

  try {
    const admin = JSON.parse(localStorage.getItem("admin") || "");
    if (admin.token) {
      token = admin.token;
    }
  } catch (error) {
    console.log(error);
  }
  
  const rejectManagerReport = async ({userId}: {userId:string}) => {
    setLoading(true);
    setError(null); // إعادة تعيين الخطأ
    setIsRejected(false); // إعادة تعيين حالة القبول
    
    await axios
      .post(
        `/admin/rejectm/${userId}`,
        {},
        {   
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      ).then((res)=>{
           
        setIsRejected(true)
          
      })
      .catch((error) => {
        setError(error.response.data.error);
      })
      .finally(() => setLoading(false));
  };
  
  return { rejectManagerLoading: loading, rejectManagerReport, isManagerReject, rejectManagerError: error };
};
