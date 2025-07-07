import React, { useEffect, useState } from "react";
import axios from "axios";

interface FinalReportsTableProps {
  data?: any[];
}

const FinalReportsTable: React.FC<FinalReportsTableProps> = ({ data }) => {
  const [finalReports, setFinalReports] = useState<any[]>(data || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!data) {
      const admin = JSON.parse(localStorage.getItem("admin") || "{}");
      const adminToken = admin?.token;
      if (!adminToken) return;
      setLoading(true);
      axios.get("/admin/final", {
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${adminToken}`,
        },
      })
        .then((res) => setFinalReports(res.data.reports))
        .catch((err) => console.log(err?.response?.data?.error))
        .finally(() => setLoading(false));
    }
  }, [data]);

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
      case "accepted":
        return "مقبول";
      case "rejected":
        return "مرفوض";
      default:
        return "غير محدد";
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">القرارات النهائية (مقبول/مرفوض)</h2>
      {loading ? (
        <div className="text-center py-8">جاري تحميل البيانات...</div>
      ) : finalReports.length === 0 ? (
        <div className="text-center py-8 text-gray-500">لا توجد بيانات تقارير نهائية</div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-right text-xs font-bold text-gray-700">اسم المستفيد</th>
                <th className="px-4 py-2 text-right text-xs font-bold text-gray-700">رقم الهوية</th>
                <th className="px-4 py-2 text-right text-xs font-bold text-gray-700">تاريخ الطلب</th>
                <th className="px-4 py-2 text-right text-xs font-bold text-gray-700">الحالة النهائية</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {finalReports.map((item, idx) => (
                <tr key={item._id || idx} className="hover:bg-blue-50 cursor-pointer">
                  <td className="px-4 py-2 whitespace-nowrap">{item.user?.fullName || item.user?.firstName || "-"}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{item.user?.identityNumber || "-"}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{item.createdAt ? new Date(item.createdAt).toLocaleDateString("ar-EG") : "-"}</td>
                  <td className="px-4 py-2 whitespace-nowrap font-bold">
                    {getStatusText(item.reportStatus || item.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FinalReportsTable; 