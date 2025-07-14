import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Dashboard.module.css";
import { useGetDeletedReports } from "../hooks/useGetDeletedReports";
import axios from "axios";
import hotToast from "../../../common/hotToast";

const DeletedList = () => {
  const navigate = useNavigate();
  const [deletedReports, setDeletedReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  
  // Pagination states
  const [itemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useGetDeletedReports({ setDeletedReports, setLoading });

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [deletedReports]);

  const handleRestore = async (userId: string) => {
    setRestoringId(userId);
    try {
      const admin = JSON.parse(localStorage.getItem("admin") || "");
      if (!admin.token) {
        hotToast({ type: "error", message: "غير مصرح لك بهذا الإجراء" });
        return;
      }

      const response = await axios.post(
        `/admin/back/${userId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${admin.token}`,
          },
        }
      );

      if (response.data.success) {
        hotToast({ type: "success", message: "تم إرجاع المستفيد بنجاح" });
        // Refresh the list
        const updatedReports = deletedReports.filter(report => report.user._id !== userId);
        setDeletedReports(updatedReports);
      }
    } catch (error: any) {
      hotToast({ 
        type: "error", 
        message: error.response?.data?.error || "حدث خطأ أثناء إرجاع المستفيد" 
      });
    } finally {
      setRestoringId(null);
    }
  };

  const handleRowClick = (reportId: string) => {
    if (reportId) {
      navigate(`/dashboard/beneficiary/${reportId}`);
    }
  };

  // Pagination calculations
  const getCurrentData = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return deletedReports.slice(indexOfFirstItem, indexOfLastItem);
  };

  const getTotalPages = () => {
    return Math.ceil(deletedReports.length / itemsPerPage);
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
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>
          <span className={styles.cardIcon}>🗑️</span>
          قائمة المحذوفين مؤقتا
        </h3>
      </div>
      <div className={styles.tableContainer}>
        {loading ? (
          <div className="text-center py-8">جاري تحميل البيانات...</div>
        ) : !Array.isArray(deletedReports) || deletedReports.length === 0 ? (
          <div className="text-center py-8 text-gray-500">لا توجد بيانات محذوفة مؤقتا</div>
        ) : (
          <>
            <table className={styles.table}>
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-nowrap font-semibold text-gray-700">اسم المستفيد</th>
                  <th className="text-nowrap font-semibold text-gray-700">رقم الهوية</th>
                  <th className="text-nowrap font-semibold text-gray-700">رقم الجوال</th>
                  <th className="text-nowrap font-semibold text-gray-700">المدينة</th>
                  <th className="text-nowrap font-semibold text-gray-700">الحالة</th>
                  <th className="text-nowrap font-semibold text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentData().map((item, idx) => {
                  if (!item.user) return null;
                  return (
                    <tr 
                      key={item._id || idx} 
                      className="hover:bg-blue-50 transition-colors duration-200 border-b border-gray-200 cursor-pointer"
                      onClick={() => handleRowClick(item._id)}
                    >
                      <td className="text-nowrap py-3">
                        <span className="font-medium text-gray-900">
                          {`${item.user.firstName || ""} ${item.user.secondName || ""} ${item.user.thirdName || ""} ${item.user.lastName || ""}`.trim() || "-"}
                        </span>
                      </td>
                      <td className="text-nowrap py-3">
                        <span className="font-mono text-gray-700">{item.user.identityNumber || "-"}</span>
                      </td>
                      <td className="text-nowrap py-3">
                        <span className="text-gray-700">{item.user.phone || "-"}</span>
                      </td>
                      <td className="text-nowrap py-3">
                        <span className="text-gray-700">{item.user.cityOfResidence || "-"}</span>
                      </td>
                      <td className="text-nowrap py-3">
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                          محذوف مؤقتا
                        </span>
                      </td>
                      <td className="text-nowrap py-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRestore(item.user._id);
                          }}
                          disabled={restoringId === item.user._id}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {restoringId === item.user._id ? "جاري الإرجاع..." : "إرجاع"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            {getTotalPages() > 1 && (
              <div className="flex justify-between items-center mt-6 px-4 flex-col-reverse md:flex-row">
                <div className="text-sm text-gray-600 my-5">
                  عرض {((currentPage - 1) * itemsPerPage) + 1} إلى {Math.min(currentPage * itemsPerPage, deletedReports.length)} من {deletedReports.length} نتيجة
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
    </div>
  );
};

export default DeletedList; 