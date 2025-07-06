import axios from "axios";
import { useState } from "react";

export const useAcceptCommitteeReport = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  
  let token = "";

  try {
    const admin = JSON.parse(localStorage.getItem("admin") || "");
    if (admin.token) {
      token = admin.token;
    }
  } catch (error) {
    console.log(error);
  }
  
  const acceptCommitteeToReport = async ({userId,comment}: {userId:string,comment:string}) => {
    setLoading(true);
    setError(null); // إعادة تعيين الخطأ
    setIsAccepted(false); // إعادة تعيين حالة القبول
    
    await axios
      .post(
        `/admin/acceptc/${userId}`,
        {comment},
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
  
  return { acceptCommitteeLoading: loading, acceptCommitteeToReport, isAccepted, acceptCommitteeError: error };
};
