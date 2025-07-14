import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Dashboard.module.css";
import { useGetAllProcess } from "../hooks/useGetAllProcess";
import { usePersistentState } from "../../../hooks/usePersistentState";

const ProcessFlow = () => {
  const [itemsPerPage] = useState(15);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = usePersistentState('processFlow_currentPage', 1);
  
  const { loading, error, reports } = useGetAllProcess();

  // Reset to first page when reports change
  useEffect(() => {
    setCurrentPage(1);
  }, [reports, setCurrentPage]);

  // Pagination calculations
  const getCurrentData = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return reports.slice(indexOfFirstItem, indexOfLastItem);
  };

  const getTotalPages = () => {
    return Math.ceil(reports.length / itemsPerPage);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getStatusText = (status: string) => {
    console.log(status)
    switch (status) {
      case "under_review":
        return "عند المراجع";
      case "under_committee":
        return "عند اللجنة";
      case "under_manager":
      case "accepted":
        return "عند المدير";
      default:
        return "عند المراجعة";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.trim()) {
      case "under_review":
        return " 👀 ";
      case "under_committee":
        return "🏛️";
      case "under_manager":
        case "accepted":
        return "👨‍💼";
      default:
        return "⏳";
    }
  };

  const getStatusButtonClass = (status: string) => {
    switch (status) {
      case "under_review":
        return "bg-blue-500 text-white px-3 py-1 rounded-full font-bold text-sm border-none";
      case "under_committee":
        return "bg-yellow-500 text-white px-3 py-1 rounded-full font-bold text-sm border-none";
      case "under_manager":
        return "bg-purple-500 text-white px-3 py-1 rounded-full font-bold text-sm border-none";
      default:
        return "bg-gray-300 text-gray-700 px-3 py-1 rounded-full font-bold text-sm border-none";
    }
  };

  const handleRowClick = (reportId: string) => {
    if (reportId) {
      navigate(`/dashboard/beneficiary/${reportId}`);
    }
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
          <h1 className={styles.detailsTitle + " !text-black xl:text-3xl font-bold"}>
            سير العمليات
          </h1>
          <p className="text-gray-600 mt-2">عرض جميع العمليات قيد المعالجة (مراجعة - لجنة - مدير)</p>
        </div>
        <div className="text-center md:text-right">
          <div className="text-2xl mb-1">📋</div>
          <div className="text-sm text-gray-500">إجمالي العمليات</div>
          <div className="text-xl font-bold text-blue-600">{reports.length}</div>
          <div className="flex gap-1 mt-2 text-xs flex-wrap justify-center md:justify-end">
            <span className="bg-blue-500 text-white px-2 py-1 rounded">
              {reports.filter(r => (r.status) === 'under_review').length} مراجعة
            </span>
            <span className="bg-yellow-500 text-white px-2 py-1 rounded">
              {reports.filter(r => ( r.status) === 'under_committee').length} لجنة
            </span>
            <span className="bg-purple-500 text-white px-2 py-1 rounded">
              {reports.filter(r => ( r.status) === 'under_manager').length} مدير
            </span>
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">جاري تحميل البيانات...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-lg font-semibold mb-2">حدث خطأ</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-lg font-semibold mb-2">لا توجد عمليات قيد التنفيذ</p>
            <p className="text-sm">جميع التقارير مكتملة أو تم معالجتها</p>
          </div>
        ) : (
          <>
            <table className={styles.table}>
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-nowrap font-semibold text-gray-700">اسم المستفيد</th>
                  <th className="text-nowrap font-semibold text-gray-700">رقم الهوية</th>
                  <th className="text-nowrap font-semibold text-gray-700">البريد الإلكتروني</th>
                  <th className="text-nowrap font-semibold text-gray-700">رقم الجوال</th>
                  <th className="text-nowrap font-semibold text-gray-700">المدينة</th>
                  <th className="text-nowrap font-semibold text-gray-700">الحي</th>
                  <th className="text-nowrap font-semibold text-gray-700">تاريخ الطلب</th>
                  <th className="text-nowrap font-semibold text-gray-700">الحالة</th>
                  <th className="text-nowrap font-semibold text-gray-700">تاريخ آخر إجراء</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentData().map((item, idx) => (
                  <tr
                    key={item._id || idx}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRowClick(item._id)}
                    className="hover:bg-blue-50 transition-colors duration-200 border-b border-gray-200"
                  >
                    <td className="text-nowrap py-3">
                      <span className="font-medium text-gray-900">
                        {`${item.user?.firstName || ""} ${item.user?.secondName || ""} ${item.user?.thirdName || ""} ${item.user?.lastName || ""}`.trim() || "-"}
                      </span>
                    </td>
                    <td className="text-nowrap py-3">
                      <span className="font-mono text-gray-700">{item.user?.identityNumber || "-"}</span>
                    </td>
                    <td className="text-nowrap py-3">
                      <span className="text-blue-600 hover:text-blue-800">{item.user?.email || "-"}</span>
                    </td>
                    <td className="text-nowrap py-3">
                      <span className="text-green-600">{item.user?.phone || "-"}</span>
                    </td>
                    <td className="text-nowrap py-3">
                      <span className="text-gray-700">{item.user?.cityOfResidence || "-"}</span>
                    </td>
                    <td className="text-nowrap py-3">
                      <span className="text-gray-700">{item.user?.district || "-"}</span>
                    </td>
                    <td className="text-nowrap py-3">
                      <span className="text-gray-600">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString("ar-EG") : "-"}
                      </span>
                    </td>
                    <td className="text-nowrap py-3">
                      <button
                        className={getStatusButtonClass( item.status)}
                        style={{ pointerEvents: "none" }}
                      >
                        <span className="mr-1">{getStatusIcon( item.status)}</span>
                        {getStatusText(item.status)}
                      </button>
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
                  عرض {((currentPage - 1) * itemsPerPage) + 1} إلى {Math.min(currentPage * itemsPerPage, reports.length)} من {reports.length} نتيجة
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

export default ProcessFlow; 