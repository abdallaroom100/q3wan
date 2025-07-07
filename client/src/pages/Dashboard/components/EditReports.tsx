import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../Dashboard.module.css";
import { useNavigate } from "react-router-dom";

const EditReports = () => {
  const [finalReports, setFinalReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedComments, setSelectedComments] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

  const getStatusText = (status: string) => {
    switch (status) {
      case "accepted_manager":
      case "approved":
      case "accepted":
        return "اعتماد كلي";
      case "rejected_manager":
      case "rejected":
        return "رفض كلي";
      default:
        return "قيد المراجعة";
    }
  };

  const getStatusButtonClass = (status: string) => {
    switch (status) {
      case "accepted_manager":
      case "approved":
      case "accepted":
        return "bg-green-600 text-white px-3 py-1 rounded-full font-bold text-sm border-none";
      case "rejected_manager":
      case "rejected":
        return "bg-red-600 text-white px-3 py-1 rounded-full font-bold text-sm border-none";
      default:
        return "bg-gray-300 text-gray-700 px-3 py-1 rounded-full font-bold text-sm border-none";
    }
  };

  const hasComments = (comments: any) => {
    return comments?.reviewer?.comment || comments?.committee?.comment || comments?.manager?.comment;
  };

  const closeCommentsModal = () => {
    setShowCommentsModal(false);
    setSelectedComments(null);
  };

  return (
    <div className={styles.card}>
      <div className={styles.detailsHeader}>
        <h2 className={styles.detailsTitle}>تقرير المستفيدين مع إمكانية التعديل</h2>
      </div>
      <div className={styles.tableContainer}>
        {loading ? (
          <div className="text-center py-8">جاري تحميل البيانات...</div>
        ) : finalReports.length === 0 ? (
          <div className="text-center py-8 text-gray-500">لا توجد بيانات تقارير نهائية</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>اسم المستفيد</th>
                <th>رقم الهوية</th>
                <th>البريد الإلكتروني</th>
                <th>تاريخ الطلب</th>
                <th>الحالة النهائية</th>
                <th>التعليقات</th>
                <th>تاريخ آخر إجراء</th>
              </tr>
            </thead>
            <tbody>
              {finalReports.map((item, idx) => (
                <tr
                  key={item._id || idx}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (item.user?._id) {
                      navigate(`/dashboard/beneficiary/${item._id}`);
                    }
                  }}
                >
                  <td>{`${item.user?.firstName || ""} ${item.user?.secondName || ""}`.trim() || "-"}</td>
                  <td>{item.user?.identityNumber || "-"}</td>
                  <td>{item.user?.email || "-"}</td>
                  <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString("ar-EG") : "-"}</td>
                  <td>
                    <button
                      className={getStatusButtonClass(item.reportStatus || item.status)}
                      style={{ pointerEvents: "none" }}
                    >
                      {getStatusText(item.reportStatus || item.status)}
                    </button>
                  </td>
                  <td>
                    {hasComments(item.comments) ? (
                      <button
                        className={styles.searchButton}
                        style={{ fontSize: 12, padding: "4px 10px" }}
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedComments(item.comments);
                          setShowCommentsModal(true);
                        }}
                      >
                        عرض التعليقات
                      </button>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td>{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString("ar-EG") : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Popup للتعليقات */}
      {showCommentsModal && selectedComments && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">التعليقات</h3>
                <button
                  onClick={closeCommentsModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                {selectedComments.reviewer?.comment && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-600 text-lg">👤</span>
                      <span className="font-semibold text-gray-800">المراجع</span>
                      {selectedComments.reviewer.name && (
                        <span className="text-sm text-gray-600">({selectedComments.reviewer.name})</span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedComments.reviewer.comment}
                    </p>
                  </div>
                )}
                {selectedComments.committee?.comment && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-600 text-lg">🏛️</span>
                      <span className="font-semibold text-gray-800">اللجنة</span>
                      {selectedComments.committee.name && (
                        <span className="text-sm text-gray-600">({selectedComments.committee.name})</span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedComments.committee.comment}
                    </p>
                  </div>
                )}
                {selectedComments.manager?.comment && (
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-600 text-lg">👨‍💼</span>
                      <span className="font-semibold text-gray-800">المدير</span>
                      {selectedComments.manager.name && (
                        <span className="text-sm text-gray-600">({selectedComments.manager.name})</span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedComments.manager.comment}
                    </p>
                  </div>
                )}
                {!hasComments(selectedComments) && (
                  <div className="text-center py-8 text-gray-500">
                    <span className="text-4xl mb-2 block">💬</span>
                    <p>لا توجد تعليقات متاحة</p>
                  </div>
                )}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={closeCommentsModal}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-300"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditReports; 