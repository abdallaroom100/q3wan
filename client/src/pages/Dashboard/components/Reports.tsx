import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Dashboard.module.css";
import { ReportData } from "../types";
import { useSearchForReport } from "../hooks/useSearchForReport";

const Reports = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingSearch, setPendingSearch] = useState("");
  const [showCommentsModal, setShowCommentsModal] = useState<boolean>(false);
  const [selectedTaskComments, setSelectedTaskComments] = useState<any>(null);
  const navigate = useNavigate();
 
  const {loading, error, reportData, searchForReport} = useSearchForReport()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPendingSearch(e.target.value);
  };

  const handleSearchClick = () => {
    setSearchQuery(pendingSearch);
    performSearch(pendingSearch);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      return;
    }
    searchForReport(query);
  };

  const handleRowClick = (reportId: string) => {
    // الانتقال إلى صفحة عرض التقرير
    navigate(`/dashboard/beneficiary/${reportId}`);
  };

  const handleCommentsClick = (e: React.MouseEvent, comments: any) => {
    e.stopPropagation(); // منع الانتقال للصف عند الضغط على الزر
    setSelectedTaskComments(comments);
    setShowCommentsModal(true);
  };

  const closeCommentsModal = () => {
    setShowCommentsModal(false);
    setSelectedTaskComments(null);
  };

  const hasComments = (comments: any) => {
    return comments?.reviewer?.comment || 
           comments?.committee?.comment || 
           comments?.manager?.comment;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
      case "approved":
        return styles.statusApproved;
      case "rejected":
        return styles.statusRejected;
      case "pending":
        return styles.statusPending;
      default:
        return "";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "accepted":
        return " مقبول من اللحنة";
      case "rejected":
        return "مرفوض من اللجنه";
      case "accepted_manager":
        return "مقبول من المدير";
      case "rejected_manager":
        return "مرفوض من المدير";
      default:
        return "قيد المراجعة";
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: 1100, margin: "0 auto", padding: "2rem 0", background: "#f8fafc", minHeight: "100vh" }}>
      {/* العنوان الرئيسي */}
      <h2 style={{ textAlign: "center", color: "#185a9d", fontWeight: 700, fontSize: 22, marginBottom: 28, letterSpacing: 0.5 }}>
        تقرير حالة المستفيدين
      </h2>

      {/* Card البحث */}
      <div className={styles.card + " reportCardCustom"} style={{ marginBottom: 24, boxShadow: "0 2px 8px rgba(24,90,157,0.06)", borderRadius: 12, border: "1px solid #e5e7eb", background: "#fff" }}>
        <h4 style={{ marginBottom: 12, color: "#185a9d", fontWeight: 500, textAlign: "right", fontSize: 16 }}>ابحث عن مستفيد</h4>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="ابحث برقم الهوية أو البريد الإلكتروني..."
            value={pendingSearch}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            style={{ minWidth: 250, background: "#fafdff", border: "1px solid #b6c6d7", fontSize: 15 }}
          />
          <button className={styles.searchButton} style={{ background: "#185a9d", color: "#fff", fontWeight: 500, borderRadius: 8, fontSize: 15, padding: "7px 18px" }} onClick={handleSearchClick}>
            بحث
          </button>
        </div>
        {error && (
          <div style={{ marginTop: 12, color: "#dc2626", fontSize: 14, textAlign: "right" }}>
            {error}
          </div>
        )}
      </div>

      {/* Card الجدول */}
      <div className={styles.card + " reportCardCustom"} style={{ boxShadow: "0 2px 8px rgba(24,90,157,0.06)", borderRadius: 12, border: "1px solid #e5e7eb", background: "#fff" }}>
        <div className={styles.tableContainer}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
              <div style={{ fontSize: "18px", marginBottom: "12px", fontWeight: "500" }}>
                🔄 جاري البحث...
              </div>
              <div style={{ fontSize: "14px", color: "#9ca3af" }}>
                يرجى الانتظار قليلاً
              </div>
            </div>
          ) : reportData.length === 0 && searchQuery ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
              <div style={{ fontSize: "18px", marginBottom: "12px", fontWeight: "500" }}>
                ❌ لا توجد نتائج للبحث
              </div>
              <div style={{ fontSize: "14px", color: "#9ca3af" }}>
                لم يتم العثور على مستفيد بالبيانات: "{searchQuery}"
              </div>
            </div>
          ) : reportData.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  
                  <th style={{textWrap:"nowrap"}}>اسم المستفيد</th>
                  <th style={{textWrap:"nowrap"}}>رقم الهوية</th>
                  <th style={{textWrap:"nowrap"}}>البريد الإلكتروني</th>
                  <th style={{textWrap:"nowrap"}}>تاريخ الطلب</th>
                  <th style={{textWrap:"nowrap"}}>الحالة</th>
                  <th style={{textWrap:"nowrap"}}>تاريخ الإجراء</th>
                  <th style={{textWrap:"nowrap"}}>التعليق</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((item, index) => (
                  <tr 
                    key={item.id} 
                    onClick={() => handleRowClick(item.reportId || item.identityNumber)}
                    style={{ cursor: "pointer", transition: "background-color 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}
                  >
                    {/* <td style={{textWrap:"nowrap"}}>{index + 1}</td> */}
                    <td style={{textWrap:"nowrap"}}>{item.beneficiaryName}</td>
                    <td style={{textWrap:"nowrap"}}>{item.identityNumber}</td>
                    <td style={{textWrap:"nowrap"}}>{item.email || "-"}</td>
                    <td style={{textWrap:"nowrap"}}>{item.requestDate}</td>
                    <td  style={{textWrap:"nowrap"}} className={getStatusColor(item.status)}>
                      {getStatusText(item.status)}
                    </td>
                    <td style={{textWrap:"nowrap"}}>{item.actionDate || "-"}</td>
                    <td style={{ maxWidth: 200 }}>
                      {hasComments(item.comments) ? (
                        <button
                          onClick={(e) => handleCommentsClick(e, item.comments)}
                          style={{
                            background: "#185a9d",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            padding: "6px 12px",
                            fontSize: "12px",
                            cursor: "pointer",
                            fontWeight: "500",
                            transition: "background-color 0.2s",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#134a7d"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#185a9d"}
                        >
                          
                          <span style={{textWrap:"nowrap"}}>عرض التعليقات</span>
                        </button>
                      ) : (
                        <div style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: "6px",
                          color: "#9ca3af",
                          fontSize: "12px"
                        }}>
                         
                          <span>لا توجد تعليقات</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
              <div style={{ fontSize: "18px", marginBottom: "12px", fontWeight: "500" }}>
                🔍 ابحث عن مستفيد لعرض تقريره
              </div>
              <div style={{ fontSize: "14px", color: "#9ca3af" }}>
                يمكنك البحث برقم الهوية أو البريد الإلكتروني
              </div>
            </div>
          )}
        </div>
      </div>

      {/* نافذة التعليقات المنبثقة */}
      {showCommentsModal && (
        <div className="!fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                {/* تعليق المراجع */}
                {selectedTaskComments?.reviewer?.comment && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-600 text-lg">👤</span>
                      <span className="font-semibold text-gray-800">المراجع</span>
                      {selectedTaskComments.reviewer.name && (
                        <span className="text-sm text-gray-600">({selectedTaskComments.reviewer.name})</span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedTaskComments.reviewer.comment}
                    </p>
                  </div>
                )}

                {/* تعليق اللجنة */}
                {selectedTaskComments?.committee?.comment && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-600 text-lg">🏛️</span>
                      <span className="font-semibold text-gray-800">اللجنة</span>
                      {selectedTaskComments.committee.name && (
                        <span className="text-sm text-gray-600">({selectedTaskComments.committee.name})</span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedTaskComments.committee.comment}
                    </p>
                  </div>
                )}

                {/* تعليق المدير */}
                {selectedTaskComments?.manager?.comment && (
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-600 text-lg">👨‍💼</span>
                      <span className="font-semibold text-gray-800">المدير</span>
                      {selectedTaskComments.manager.name && (
                        <span className="text-sm text-gray-600">({selectedTaskComments.manager.name})</span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedTaskComments.manager.comment}
                    </p>
                  </div>
                )}

                {/* رسالة إذا لم توجد تعليقات */}
                {!selectedTaskComments?.reviewer?.comment && !selectedTaskComments?.committee?.comment && !selectedTaskComments?.manager?.comment && (
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

export default Reports; 