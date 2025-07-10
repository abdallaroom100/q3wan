import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../Dashboard.module.css";
import { useNavigate } from "react-router-dom";
import Modal from "../../../components/Modal";
import { usePersistentState } from "../../../hooks/usePersistentState";

const EditReports = () => {
  const [finalReports, setFinalReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedComments, setSelectedComments] = useState<any>(null);
  const navigate = useNavigate();
  
  // Pagination states
  const [currentPage, setCurrentPage] = usePersistentState('editReports_currentPage', 1);
  const [itemsPerPage] = useState(5);

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
      .then((res) => {
        setFinalReports(res.data.reports);
        // Reset to first page when data changes
        setCurrentPage(1);
      })
      .catch((err) => console.log(err?.response?.data?.error))
      .finally(() => setLoading(false));
  }, [setCurrentPage]);

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

  // Pagination calculations
  const getCurrentData = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return finalReports.slice(indexOfFirstItem, indexOfLastItem);
  };

  const getTotalPages = () => {
    return Math.ceil(finalReports.length / itemsPerPage);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const totalPages = getTotalPages();
    const currentPageNum = currentPage;
    const pageNumbers = [];

    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show first page, last page, current page, and 2 pages around current
      if (currentPageNum <= 4) {
        // Near the beginning
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPageNum >= totalPages - 3) {
        // Near the end
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // In the middle
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPageNum - 1; i <= currentPageNum + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <div className={styles.card}>
      <div className="flex justify-between items-center mb-6 flex-col md:flex-row gap-4">
        <div>
          <h2 className={styles.detailsTitle + " !text-black xl:text-3xl font-bold"}>
            تعديل التقارير
          </h2>
          <p className="text-gray-600 mt-2">تقرير المستفيدين مع إمكانية التعديل</p>
        </div>
        <div className="text-center md:text-right">
          <div className="text-2xl mb-1">📝</div>
          <div className="text-sm text-gray-500">إجمالي التقارير</div>
          <div className="text-xl font-bold text-purple-600">{finalReports.length}</div>
        </div>
      </div>
      <div className={styles.tableContainer}>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-600">جاري تحميل البيانات...</p>
          </div>
        ) : finalReports.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-lg font-semibold mb-2">لا توجد تقارير نهائية</p>
            <p className="text-sm">جميع التقارير قيد المعالجة</p>
          </div>
        ) : (
          <>
            <table className={styles.table}>
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-nowrap font-semibold text-gray-700">اسم المستفيد</th>
                  <th className="text-nowrap font-semibold text-gray-700">رقم الهوية</th>
                  <th className="text-nowrap font-semibold text-gray-700">البريد الإلكتروني</th>
                  <th className="text-nowrap font-semibold text-gray-700">تاريخ الطلب</th>
                  <th className="text-nowrap font-semibold text-gray-700">الحالة النهائية</th>
                  <th className="text-nowrap font-semibold text-gray-700">التعليقات</th>
                  <th className="text-nowrap font-semibold text-gray-700">تاريخ آخر إجراء</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentData().map((item, idx) => (
                <tr
                  key={item._id || idx}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (item.user?._id) {
                      navigate(`/dashboard/beneficiary/${item._id}`);
                    }
                  }}
                  className="hover:bg-blue-50 transition-colors duration-200 border-b border-gray-200"
                >
                  <td className="text-nowrap py-3">
                    <span className="font-medium text-gray-900">
                      {`${item.user?.firstName || ""} ${item.user?.secondName || ""}`.trim() || "-"}
                    </span>
                  </td>
                  <td className="text-nowrap py-3">
                    <span className="font-mono text-gray-700">{item.user?.identityNumber || "-"}</span>
                  </td>
                  <td className="text-nowrap py-3">
                    <span className="text-blue-600 hover:text-blue-800">{item.user?.email || "-"}</span>
                  </td>
                  <td className="text-nowrap py-3">
                    <span className="text-gray-600">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString("ar-EG") : "-"}
                    </span>
                  </td>
                  <td className="text-nowrap py-3">
                    <button
                      className={getStatusButtonClass(item.reportStatus || item.status)}
                      style={{ pointerEvents: "none" }}
                    >
                      {getStatusText(item.reportStatus || item.status)}
                    </button>
                  </td>
                  <td className="text-nowrap py-3">
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
                  <td className="text-nowrap py-3">
                    <span className="text-gray-600">
                      {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString("ar-EG") : "-"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {getTotalPages() > 1 && (
            <div className="flex justify-between items-center mt-6 px-4 flex-col-reverse md:flex-row">
              <div className="text-sm text-gray-600 my-5">
                عرض {((currentPage - 1) * itemsPerPage) + 1} إلى {Math.min(currentPage * itemsPerPage, finalReports.length)} من {finalReports.length} نتيجة
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  السابق
                </button>
                
                {getPageNumbers().map((pageNumber, index) => (
                  <button
                    key={index}
                    onClick={() => typeof pageNumber === 'number' ? handlePageChange(pageNumber) : null}
                    disabled={pageNumber === '...'}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      pageNumber === currentPage
                        ? 'bg-blue-600 text-white'
                        : pageNumber === '...'
                        ? 'text-gray-400 cursor-default'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === getTotalPages()}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  التالي
                </button>
              </div>
            </div>
          )}
        </>
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

export default EditReports; 