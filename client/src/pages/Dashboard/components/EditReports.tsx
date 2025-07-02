import { useState } from "react";
import styles from "../Dashboard.module.css";
import { EditableReportData } from "../types";

const mockEditableData: EditableReportData[] = [
  {
    id: 1,
    beneficiaryName: "أحمد الصمد",
    identityNumber: "1030304050",
    phone: "0501234567",
    email: "ahmad@email.com",
    status: "approved",
    executor: "-",
    editDate: "-"
  },
  {
    id: 2,
    beneficiaryName: "نورة العنزي",
    identityNumber: "1076543210",
    phone: "0551234567",
    email: "noura@email.com",
    status: "rejected",
    executor: "-",
    editDate: "-"
  },
  {
    id: 3,
    beneficiaryName: "سعاد المطيري",
    identityNumber: "1099931122",
    phone: "0533334444",
    email: "suaad@email.com",
    status: "pending",
    executor: "-",
    editDate: "-"
  }
];

const EditReports = () => {
  const [reportData, setReportData] = useState(mockEditableData);

  const handleStatusChange = (id: number, newStatus: string) => {
    const now = new Date().toLocaleDateString('ar-EG');
    setReportData(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: newStatus as "approved" | "rejected" | "pending",
          executor: "علي المطيري",
          editDate: now
        };
      }
      return item;
    }));
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
        <h2 className={styles.detailsTitle}>تقرير المستفيدين مع إمكانية التعديل</h2>
        <button className={styles.printButton} onClick={handlePrint}>
          🖨️ طباعة
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>اسم المستفيد</th>
              <th>رقم الهوية</th>
              <th>رقم الجوال</th>
              <th>البريد الإلكتروني</th>
              <th>الحالة</th>
              <th>تعديل</th>
              <th>منفذ التعديل</th>
              <th>تاريخ التعديل</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.beneficiaryName}</td>
                <td>{item.identityNumber}</td>
                <td>{item.phone}</td>
                <td>{item.email}</td>
                <td className={getStatusColor(item.status)}>
                  {getStatusText(item.status)}
                </td>
                <td>
                  <select
                    className={styles.searchInput}
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                  >
                    <option value="approved">مقبول</option>
                    <option value="rejected">مرفوض</option>
                    <option value="pending">قيد المراجعة</option>
                  </select>
                </td>
                <td>{item.executor}</td>
                <td>{item.editDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EditReports; 