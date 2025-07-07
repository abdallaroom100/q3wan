


 import axios from "axios"
import { useState } from "react";
import { ReportData } from "../types";

export const useSearchForReport = ()=>{

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ReportData[]>([]);
  
    let token = ""
    const admin = JSON.parse(localStorage.getItem("admin") || "{}")
    if(admin?.token){
      token = admin.token
    }

   const searchForReport = async(identifier:string) =>{
  
       setLoading(true)
       setError(null)
  
          await axios.post("/admin/search",{identifier},{
              headers:{
                  "Content-Type":"application/json",
                  "authorization":`Bearer ${token}`
              }
          }).then((res)=>{
              if(res.data.success){
                  // تحويل البيانات إلى الشكل المطلوب للجدول
                  const report = res.data.report;
                  
                  const mappedData: ReportData = {
                    id: 1, // يمكن تغييره حسب الحاجة
                    beneficiaryName: report.user?.fullName || `${report.user?.firstName || ''} ${report.user?.lastName || ''}`.trim(),
                    identityNumber: report.user?.identityNumber || '',
                    email: report.user?.email || '',
                    requestDate: report.createdAt ? new Date(report.createdAt).toLocaleDateString('ar-EG') : '',
                    status: report.reportStatus || 'pending',
                    executor: report.comments?.committee?.name || report.comments?.manager?.name || report.comments?.reviewer?.name || '',
                    actionType: report.reportStatus === 'accepted' ? 'قبول' : report.reportStatus === 'rejected' ? 'رفض' : 'مراجعة',
                    actionDate: report.updatedAt ? new Date(report.updatedAt).toLocaleDateString('ar-EG') : '',
                    rejectionReason: '', // سنستخدم التعليقات الأصلية في popup
                    reportId: report._id, // إضافة معرف التقرير للانتقال
                    comments: report.comments // إضافة التعليقات الأصلية
                  };
                  setReportData([mappedData]);
              }
          }).catch(error=>{
              setError(error.response?.data?.error || "حدث خطأ في البحث")
              setReportData([]);
          }).finally(()=>setLoading(false))

   }
 return {loading,error,reportData,searchForReport}
}