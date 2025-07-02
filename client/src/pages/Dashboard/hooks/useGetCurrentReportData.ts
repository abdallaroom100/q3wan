import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useGetCurrentReportData = (reportId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reportDetails, setReportDetails] = useState<Record<string, any>>();
 const history = useNavigate()
  let token: string = "";
  try {
    const adminStr = localStorage.getItem("admin");
    if (adminStr) {
      token = JSON.parse(adminStr).token
    }
  } catch (error) {
    console.log(error);
  }
  const getReportDetails = async (reportId: string) => {
    setLoading(true);
    await axios
      .get(`http://localhost:5000/admin/reportDetails/${reportId}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setReportDetails(res.data?.user);
      })
      .catch((error) => {
        setError(error.response.data.error)
        history("/dashboard")
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getReportDetails(reportId);
  }, []);

  return {getReportDetails,loading,error,reportDetails}
};
