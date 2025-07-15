// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export const useGetCurrentReportData = (reportId: string) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [reportDetails, setReportDetails] = useState<Record<string, any>>();
//  const history = useNavigate()
//   let token: string = "";
//   try {
//     const adminStr = localStorage.getItem("admin");
//     if (adminStr) {
//       token = JSON.parse(adminStr).token
//     }
//   } catch (error) {
//     console.log(error);
//   }
//   const getReportDetails = async (reportId: string) => {
//     setLoading(true);
//     await axios
//       .get(`/admin/reportDetails/${reportId}`, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: `Bearer ${token}`,
//         },
//       })
//       .then((res) => {
//         setReportDetails(res.data?.user);
//       })
//       .catch((error) => {
//         setError(error.response.data.error)
//         history("/dashboard")
//       })
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => {
//     getReportDetails(reportId);
//   }, []);

//   return {getReportDetails,loading,error,reportDetails}
// };
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { IoMdRepeat } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export const useGetCurrentReportData = (reportId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reportDetails, setReportDetails] = useState<Record<string, any>>();
  const [fullReport, setFullReport] = useState<Record<string, any>>();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  const getReportDetails = async (id: string) => {
    if (!id || loading) return; // منع الطلبات المتكررة
    setLoading(true);
    setError(""); // إعادة تعيين الخطأ قبل الطلب

    let token: string = "";
    try {
      const adminStr = localStorage.getItem("admin");
      if (adminStr) {
        token = JSON.parse(adminStr).token;
      }
    } catch (error) {
      console.error("Error parsing admin token:", error);
      setError("فشل في استرجاع بيانات التوثيق");
      setLoading(false);
      navigate("/dashboard");
      return;
    }

    try {
      const res = await axios.get(`/admin/reportDetails/${id}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      if (isMounted.current) {
        setReportDetails(res.data?.user);
        setFullReport(res.data)
      }
    } catch (error: any) {
      if (isMounted.current) {
        setError(error.response?.data?.error || "فشل في جلب بيانات التقرير");
        navigate("/dashboard");
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;
    if (reportId) {
      getReportDetails(reportId);
    }

    return () => {
      isMounted.current = false; // منع تحديث الحالة بعد إلغاء تحميل الكومبوننت
    };
  }, [reportId]);

  return { getReportDetails, loading, error,fullReport, reportDetails };
};