import { useEffect, useState } from "react";
import styles from "../Dashboard.module.css";
import { useGetAllFinalAccepted } from "../hooks/useGetAllFinalAccepted";
import Modal from "../../../components/Modal";

const AcceptedRecords = () => {
  const [finalAcceptedReports, setFinalAcceptedReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedComments, setSelectedComments] = useState<any>(null);

  useGetAllFinalAccepted({ setFinalAcceptedReports, setLoading });

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
      <h1 className={styles.detailsTitle}>سجل المقبولين</h1>
      <div className={styles.tableContainer}>
        {loading ? (
          <div className="text-center py-8">جاري تحميل البيانات...</div>
        ) : finalAcceptedReports.length === 0 ? (
          <div className="text-center py-8 text-gray-500">لا توجد بيانات تقارير مقبولة</div>
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
              {finalAcceptedReports.map((item, idx) => (
                <tr
                  key={item._id || idx}
                  style={{ cursor: "pointer" }}
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
      <Modal isOpen={showCommentsModal && !!selectedComments} onClose={closeCommentsModal}>
        <span className="text-5xl mb-2">💬</span>
        <h3 className="text-2xl font-bold text-gray-800 mb-6">التعليقات</h3>
        <div className="space-y-6 w-full">
          {selectedComments?.reviewer?.comment && (
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
          {selectedComments?.committee?.comment && (
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
          {selectedComments?.manager?.comment && (
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
        <button
          onClick={closeCommentsModal}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-300"
        >
          إغلاق
        </button>
      </Modal>
    </div>
  );
};

export default AcceptedRecords; 