import styles from "../Dashboard.module.css";
import { Beneficiary, RequestHistory } from "../types";

interface BeneficiaryDetailsProps {
  beneficiary: Beneficiary;
  onClose: () => void;
}

const mockRequestHistory: RequestHistory[] = [
  {
    id: 1,
    userId: "1826",
    name: "مامون علي حارث",
    role: "مراجع",
    decision: "",
    date: "27/05/2025 05:36:04 م"
  },
  {
    id: 2,
    userId: "1826",
    name: "علي صقر المطيري",
    role: "اللجنه",
    decision: "اعتمد",
    date: "27/05/2025 05:36:04 م"
  },
  {
    id: 3,
    userId: "1825",
    name: "علي عبدالـمحسن المطيري",
    role: "مدير عام",
    decision: "اعتمد",
    date: "27/05/2025 05:36:36 م"
  }
];

const BeneficiaryDetails = ({ beneficiary, onClose }: BeneficiaryDetailsProps) => {
  const handlePrint = () => {
    window.print();
  };

  const handleApprove = () => {
    console.log("Approving beneficiary:", beneficiary.id);
    alert("تم اعتماد المستفيد بنجاح!");
  };

  const handleReject = () => {
    console.log("Rejecting beneficiary:", beneficiary.id);
    alert("تم رفض المستفيد!");
  };

  const formatDate = (dateString: string) => {
    return dateString;
  };

  const getStatusColor = (decision: string) => {
    if (decision === 'اعتمد') return styles.statusApproved;
    if (decision === 'رفض') return styles.statusRejected;
    return styles.statusPending;
  };

  return (
    <div className={styles.detailsSection}>
      {/* Header Section - Responsive */}
      <div className={styles.detailsHeader}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <h2 className={styles.detailsTitle}>
              تفاصيل المستفيد
            </h2>
            <p className={styles.beneficiaryName}>{beneficiary.fullName}</p>
            <span className={styles.beneficiaryId}>رقم الهوية: {beneficiary.identityNumber}</span>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.printButton} onClick={handlePrint} title="حفظ كملف PDF">
              <span className={styles.buttonIcon}>💾</span>
              <span className={styles.buttonText}>حفظ PDF</span>
            </button>
            <button className={styles.closeButton} onClick={onClose} title="إغلاق التفاصيل">
              <span className={styles.buttonIcon}>✕</span>
              <span className={styles.buttonText}>إغلاق</span>
            </button>
          </div>
        </div>
      </div>

      {/* Personal Information Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>
            <span className={styles.cardIcon}>👤</span>
            البيانات الشخصية
          </h3>
        </div>
        <div className={styles.detailsGrid}>
          <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
              <img
                src={beneficiary.idImagePath}
                alt={beneficiary.fullName}
                className={styles.detailsImage}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/img/logo.png";
                }}
                loading="lazy"
              />
            </div>
          </div>
          <div className={styles.detailsInfo}>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>الاسم الكامل</span>
                <span className={styles.infoValue}>{beneficiary.fullName}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>رقم الهوية</span>
                <span className={styles.infoValue}>{beneficiary.identityNumber}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>الجنسية</span>
                <span className={styles.infoValue}>{beneficiary.nationality}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>الجنس</span>
                <span className={styles.infoValue}>{beneficiary.gender}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>رقم الجوال</span>
                <span className={styles.infoValue}>
                  <a href={`tel:${beneficiary.phone}`} className={styles.fileLink}>
                    <span className={styles.linkIcon}>📞</span>
                    {beneficiary.phone}
                  </a>
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>البريد الإلكتروني</span>
                <span className={styles.infoValue}>
                  <a href={`mailto:${beneficiary.email}`} className={styles.fileLink}>
                    <span className={styles.linkIcon}>📧</span>
                    {beneficiary.email}
                  </a>
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>تاريخ الميلاد</span>
                <span className={styles.infoValue}>{formatDate(beneficiary.birthDate)} ({beneficiary.dateType})</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>الحالة الاجتماعية</span>
                <span className={styles.infoValue}>{beneficiary.maritalStatus}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>المهنة</span>
                <span className={styles.infoValue}>{beneficiary.jobStatus}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>الحالة الصحية</span>
                <span className={styles.infoValue}>{beneficiary.healthStatus}</span>
              </div>
              {beneficiary.disabilityType && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>نوع الإعاقة</span>
                  <span className={styles.infoValue}>{beneficiary.disabilityType}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Housing Information Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>
            <span className={styles.cardIcon}>🏠</span>
            بيانات السكن
          </h3>
        </div>
        <div className={styles.detailsInfo}>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>المدينة</span>
              <span className={styles.infoValue}>{beneficiary.cityOfResidence}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>الحي</span>
              <span className={styles.infoValue}>{beneficiary.district}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>نوع السكن</span>
              <span className={styles.infoValue}>{beneficiary.housingType}</span>
            </div>
            {beneficiary.housingType === "إيجار" && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>مبلغ الإيجار</span>
                <span className={styles.infoValue}>{beneficiary.rentAmount} ريال</span>
              </div>
            )}
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>عقد الإيجار</span>
              <span className={styles.infoValue}>
                {beneficiary.rentContractFile ? (
                  <a href={beneficiary.rentContractFile} target="_blank" rel="noopener noreferrer" className={styles.fileLink}>
                    <span className={styles.linkIcon}>📄</span>
                    عرض العقد
                  </a>
                ) : (
                  <span className={styles.noFile}>غير متوفر</span>
                )}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>كارت العائلة</span>
              <span className={styles.infoValue}>
                {beneficiary.familyCardFile ? (
                  <a href={beneficiary.familyCardFile} target="_blank" rel="noopener noreferrer" className={styles.fileLink}>
                    <span className={styles.linkIcon}>🆔</span>
                    عرض الكارت
                  </a>
                ) : (
                  <span className={styles.noFile}>غير متوفر</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Information Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>
            <span className={styles.cardIcon}>🏦</span>
            بيانات البنك
          </h3>
        </div>
        <div className={styles.detailsInfo}>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>اسم البنك</span>
              <span className={styles.infoValue}>{beneficiary.bankName}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>صورة الآيبان</span>
              <span className={styles.infoValue}>
                {beneficiary.ibanImage ? (
                  <a href={beneficiary.ibanImage} target="_blank" rel="noopener noreferrer" className={styles.fileLink}>
                    <span className={styles.linkIcon}>🏦</span>
                    عرض الصورة
                  </a>
                ) : (
                  <span className={styles.noFile}>غير متوفر</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Housemates Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>
            <span className={styles.cardIcon}>👨‍👩‍👧‍👦</span>
            المرافقين ({beneficiary.housemates.length} أشخاص)
          </h3>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>الاسم</th>
                <th>رقم الهوية</th>
                <th>تاريخ الميلاد</th>
                <th>الجنس</th>
                <th>صلة القرابة</th>
                <th>المرحلة الدراسية</th>
                <th>الحالة الصحية</th>
                <th>نوع الإعاقة</th>
              </tr>
            </thead>
            <tbody>
              {beneficiary.housemates.map((housemate, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{housemate.name}</td>
                  <td>{housemate.identityNumber}</td>
                  <td>{formatDate(housemate.birthDate)} ({housemate.dateType})</td>
                  <td>{housemate.gender}</td>
                  <td>{housemate.kinship}</td>
                  <td>{housemate.studyLevel || "-"}</td>
                  <td>{housemate.healthStatus || "-"}</td>
                  <td>{housemate.disabilityType || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Income Sources Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>
            <span className={styles.cardIcon}>💰</span>
            مصادر الدخل
          </h3>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>نوع المصدر</th>
                <th>المبلغ</th>
                <th>صورة الدخل</th>
              </tr>
            </thead>
            <tbody>
              {beneficiary.incomeSources.map((source, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{source.sourceType}</td>
                  <td>{source.sourceAmount} ريال</td>
                  <td>
                    {source.sourceImage ? (
                      <a href={source.sourceImage} target="_blank" rel="noopener noreferrer" className={styles.fileLink}>
                        <span className={styles.linkIcon}>📷</span>
                        عرض الصورة
                      </a>
                    ) : (
                      <span className={styles.noFile}>غير متوفر</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>
            <span className={styles.cardIcon}>⚡</span>
            الإجراءات
          </h3>
        </div>
        <div className={styles.actionButtons}>
          <button className={styles.approveButton} onClick={handleApprove} title="اعتماد المستفيد">
            <span className={styles.buttonIcon}>✔</span>
            <span className={styles.buttonText}>اعتماد</span>
          </button>
          <button className={styles.rejectButton} onClick={handleReject} title="رفض المستفيد">
            <span className={styles.buttonIcon}>✖</span>
            <span className={styles.buttonText}>رفض</span>
          </button>
        </div>
      </div>

      {/* Request History Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>
            <span className={styles.cardIcon}>📋</span>
            سير الطلب
          </h3>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>رقم المستخدم</th>
                <th>الاسم</th>
                <th>الدور</th>
                <th>القرار</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {mockRequestHistory.map((history) => (
                <tr key={history.id}>
                  <td>{history.id}</td>
                  <td>{history.userId}</td>
                  <td>{history.name}</td>
                  <td>{history.role}</td>
                  <td>
                    {history.decision ? (
                      <span className={`${styles.statusBadge} ${getStatusColor(history.decision)}`}>
                        {history.decision}
                      </span>
                    ) : (
                      <span className={`${styles.statusBadge} ${styles.statusPending}`}>قيد المراجعة</span>
                    )}
                  </td>
                  <td>{formatDate(history.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryDetails; 