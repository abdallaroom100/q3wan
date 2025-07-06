import axios from "axios";
import { useState } from "react";

export const useAcceptManagerReport = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isManagerAccept, setIsAccepted] = useState<boolean>(false);
  
  let token = "";

  try {
    const admin = JSON.parse(localStorage.getItem("admin") || "");
    if (admin.token) {
      token = admin.token;
    }
  } catch (error) {
    console.log(error);
  }
  
  const acceptManagerReport = async ({userId}: {userId:string}) => {
    setLoading(true);
    setError(null); // إعادة تعيين الخطأ
    setIsAccepted(false); // إعادة تعيين حالة القبول
    
    await axios
      .post(
        `/admin/acceptm/${userId}`,
        {},
        {   
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      ).then((res)=>{
           
            setIsAccepted(true)
          
      })
      .catch((error) => {
        setError(error.response.data.error);
      })
      .finally(() => setLoading(false));
  };
  
  return { acceptManagerLoading: loading, acceptManagerReport, isManagerAccept, acceptManagerError: error };
};
