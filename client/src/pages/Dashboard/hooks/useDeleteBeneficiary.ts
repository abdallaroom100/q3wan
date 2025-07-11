

import axios from "axios";
import { useState } from "react";

export const useDeleteBeneficiary = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  
  let token = "";
  try {
    const admin = JSON.parse(localStorage.getItem("admin") || "");
    if (admin.token) {
      token = admin.token;
    }
  } catch (error) {
    console.log(error);
  }
  
  const deleteBeneficiary = async (userId: string| undefined) => {
    setLoading(true);
    setError(null); // إعادة تعيين الخطأ
    setIsDeleted(false); // إعادة تعيين حالة الحذف
    
    await axios
      .delete(
        `/admin/delete/${userId}`,
       
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      ).then((res)=>{
          
            setIsDeleted(true)
         
      })
      .catch((error) => {
        setError(error.response.data.error);
      })
      .finally(() => setLoading(false));
  };
  
  return { deleteLoading: loading, deleteBeneficiary, isDeleted, deleteBeneficiaryError: error };
};

export const useDeleteTemporaryBeneficiary = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  
  let token = "";
  try {
    const admin = JSON.parse(localStorage.getItem("admin") || "");
    if (admin.token) {
      token = admin.token;
    }
  } catch (error) {
    console.log(error);
  }
  
  const deleteTemporaryBeneficiary = async (userId: string | undefined) => {
    setLoading(true);
    setError(null); // إعادة تعيين الخطأ
    setIsDeleted(false); // إعادة تعيين حالة الحذف
    
    await axios
      .post(
        `/admin/trash/${userId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      ).then((res)=>{
            setIsDeleted(true)
      })
      .catch((error) => {
        setError(error.response?.data?.error || "فشل في حذف المستفيد مؤقتا");
      })
      .finally(() => setLoading(false));
  };
  
  return { deleteTemporaryLoading: loading, deleteTemporaryBeneficiary, isTemporaryDeleted: isDeleted, deleteTemporaryError: error };
};
 