import axios from "axios";
import { useState } from "react";

export const useRejectCommitteeToReport = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isRejected, setIsRejected] = useState<boolean>(false);
  
  let token = "";

  try {
    const admin = JSON.parse(localStorage.getItem("admin") || "");
    if (admin.token) {
      token = admin.token;
    }
  } catch (error) {
    console.log(error);
  }
  
  const rejectCommitteeToReport = async ({userId,comment}: {userId:string,comment:string}) => {
    setLoading(true);
    setError(null); // إعادة تعيين الخطأ
    setIsRejected(false); // إعادة تعيين حالة الرفض
    
    await axios
      .post(
        `/admin/rejectc/${userId}`,
        {comment},
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
  
  return { rejectCommitteeLoading: loading, rejectCommitteeToReport, isRejected, rejectCommitteeError: error };
};
