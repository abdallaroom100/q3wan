import { useState } from "react";
import styles from "../Dashboard.module.css";
import { ReportData } from "../types";

const mockReportData: ReportData[] = [
  {
    id: 1,
    beneficiaryName: "أحمد الصمد",
    identityNumber: "1030304050",
    requestDate: "12/06/2025",
    status: "approved",
    executor: "علي المطيري",
    actionType: "اعتماد",
    actionDate: "13/06/2025",
    rejectionReason: "-"
  },
  {
    id: 2,
    beneficiaryName: "نورة العنزي",
    identityNumber: "1076543210",
    requestDate: "06/06/2025",
    status: "rejected",
    executor: "علي المطيري",
    actionType: "رفض",
    actionDate: "07/06/2025",
    rejectionReason: "عدم استيفاء الشروط المطلوبة"
  },
  {
    id: 3,
    beneficiaryName: "سعاد المطيري",
    identityNumber: "1099931122",
    requestDate: "10/06/2025",
    status: "pending",
    executor: "-",
    actionType: "-",
    actionDate: "-",
    rejectionReason: "-"
  }
];

const Reports = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredData, setFilteredData] = useState(mockReportData);

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    if (status === "all") {
      setFilteredData(mockReportData);
    } else {
      const filtered = mockReportData.filter(item => item.status === status);
      setFilteredData(filtered);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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
      case "approved":
        return "مقبول";
      case "rejected":
        return "مرفوض";
      case "pending":
        return "قيد المراجعة";
      default:
        return "غير محدد";
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.detailsHeader}>
        <h1 className={styles.detailsTitle}>تقرير حالة المستفيدين</h1>
        <div className={styles.searchForm}>
          <select
            className={styles.searchInput}
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
          >
            <option value="all">كل الحالات</option>
            <option value="approved">مقبول</option>
            <option value="rejected">مرفوض</option>
            <option value="pending">قيد المراجعة</option>
          </select>
          <button className={styles.printButton} onClick={handlePrint}>
            🖨️ طباعة
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>اسم المستفيد</th>
              <th>رقم الهوية</th>
              <th>تاريخ الطلب</th>
              <th>الحالة</th>
              <th>منفذ الإجراء</th>
              <th>نوع الإجراء</th>
              <th>تاريخ الإجراء</th>
              <th>سبب الرفض</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.beneficiaryName}</td>
                <td>{item.identityNumber}</td>
                <td>{item.requestDate}</td>
                <td className={getStatusColor(item.status)}>
                  {getStatusText(item.status)}
                </td>
                <td>{item.executor}</td>
                <td>{item.actionType}</td>
                <td>{item.actionDate}</td>
                <td>{item.rejectionReason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports; 