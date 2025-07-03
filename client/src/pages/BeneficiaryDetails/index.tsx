import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./BeneficiaryDetails.module.css";
import { Beneficiary, RequestHistory } from "../Dashboard/types";
import { useGetCurrentReportData } from "../Dashboard/hooks/useGetCurrentReportData";
import { MoonLoader } from "react-spinners";

// بيانات تجريبية - في المستقبل ستأتي من API
const mockBeneficiaries: Beneficiary[] = [
  {
    id: "1",
    firstName: "أحمد",
    secondName: "محمد",
    thirdName: "علي",
    lastName: "الصمد",
    fullName: "أحمد محمد علي الصمد",
    email: "ahmad@email.com",
    identityNumber: "1030304050",
    nationality: "سعودي",
    gender: "ذكر",
    phone: "0501234567",
    birthDate: "15/03/1985",
    dateType: "ميلادي",
    maritalStatus: "متزوج",
    idImagePath: "/img/logo.png",
    cityOfResidence: "الرياض",
    district: "حي الياسمين",
    housingType: "ملك",
    jobStatus: "موظف",
    healthStatus: "سليم",
    bankName: "البنك الأهلي السعودي",
    ibanImage: "/img/logo.png",
    numberOfFacilities: 2,
    numberOfMales: 1,
    housemates: [
      {
        name: "أسماء علي الصمد",
        birthDate: "20/05/1990",
        identityNumber: "1030304051",
        gender: "أنثى",
        kinship: "زوجة",
        studyLevel: "جامعي",
        healthStatus: "سليم",
        dateType: "ميلادي"
      },
      {
        name: "سالم محمد الصمد",
        birthDate: "10/08/2015",
        identityNumber: "1030304052",
        gender: "ذكر",
        kinship: "ابن",
        studyLevel: "ابتدائي",
        healthStatus: "سليم",
        dateType: "ميلادي"
      }
    ],
    incomeSources: [
      {
        sourceType: "راتب وظيفي",
        sourceAmount: "8000",
        sourceImage: "/img/logo.png"
      },
      {
        sourceType: "عمل إضافي",
        sourceAmount: "2000",
        sourceImage: "/img/logo.png"
      }
    ],
    requestDate: "12 يونيو 2025",
    status: "pending",
    companions: "أسماء علي - زوجة، سالم محمد - ابن"
  },
  {
    id: "2",
    firstName: "نورة",
    secondName: "عبدالله",
    thirdName: "محمد",
    lastName: "العنزي",
    fullName: "نورة عبدالله محمد العنزي",
    email: "noura@email.com",
    identityNumber: "1076543210",
    nationality: "سعودية",
    gender: "أنثى",
    phone: "0551234567",
    birthDate: "22/07/1988",
    dateType: "ميلادي",
    maritalStatus: "متزوجة",
    idImagePath: "/img/logo.png",
    cityOfResidence: "جدة",
    district: "حي الشاطئ",
    housingType: "إيجار",
    rentAmount: "3000",
    rentContractFile: "/img/logo.png",
    jobStatus: "عاطل",
    healthStatus: "غير سليم",
    disabilityType: "مريض",
    bankName: "بنك الراجحي",
    ibanImage: "/img/logo.png",
    numberOfFacilities: 3,
    numberOfMales: 2,
    housemates: [
      {
        name: "محمد العنزي",
        birthDate: "05/01/1985",
        identityNumber: "1076543211",
        gender: "ذكر",
        kinship: "زوج",
        studyLevel: "جامعي",
        healthStatus: "سليم",
        dateType: "ميلادي"
      },
      {
        name: "فاطمة العنزي",
        birthDate: "15/09/2012",
        identityNumber: "1076543212",
        gender: "أنثى",
        kinship: "ابنة",
        studyLevel: "متوسط",
        healthStatus: "سليم",
        dateType: "ميلادي"
      }
    ],
    incomeSources: [
      {
        sourceType: "مساعدة اجتماعية",
        sourceAmount: "1500",
        sourceImage: "/img/logo.png"
      }
    ],
    requestDate: "06 يونيو 2025",
    status: "rejected",
    companions: "محمد العنزي - زوج، فاطمة العنزي - ابنة"
  },
  {
    id: "3",
    firstName: "سعاد",
    secondName: "علي",
    thirdName: "عبدالله",
    lastName: "المطيري",
    fullName: "سعاد علي عبدالله المطيري",
    email: "suaad@email.com",
    identityNumber: "1099931122",
    nationality: "سعودية",
    gender: "أنثى",
    phone: "0533334444",
    birthDate: "30/11/1992",
    dateType: "ميلادي",
    maritalStatus: "متزوجة",
    idImagePath: "/img/logo.png",
    cityOfResidence: "الدمام",
    district: "حي الشاطئ",
    housingType: "ملك",
    jobStatus: "موظف",
    healthStatus: "سليم",
    bankName: "البنك السعودي الفرنسي",
    ibanImage: "/img/logo.png",
    numberOfFacilities: 1,
    numberOfMales: 1,
    housemates: [
      {
        name: "عبدالله المطيري",
        birthDate: "12/04/1988",
        identityNumber: "1099931123",
        gender: "ذكر",
        kinship: "زوج",
        studyLevel: "جامعي",
        healthStatus: "سليم",
        dateType: "ميلادي"
      }
    ],
    incomeSources: [
      {
        sourceType: "راتب وظيفي",
        sourceAmount: "6000",
        sourceImage: "/img/logo.png"
      }
    ],
    requestDate: "10 يونيو 2025",
    status: "approved",
    companions: "عبدالله المطيري - زوج"
  }
];

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

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
};

const BeneficiaryDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  
   const {error,loading,reportDetails} = useGetCurrentReportData(id || "")
  const navigate = useNavigate();
  const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null);
  // const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(false);
  // Popup state
  const [popupImage, setPopupImage] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // دالة لتحويل بيانات reportDetails إلى Beneficiary
  const mapReportDetailsToBeneficiary = (data: any): Beneficiary => {
    return {
      id: data._id || "",
      firstName: data.firstName || "",
      secondName: data.secondName || "",
      thirdName: data.thirdName || "",
      lastName: data.lastName || "",
      fullName: `${data.firstName || ''} ${data.secondName || ''} ${data.thirdName || ''} ${data.lastName || ''}`.trim(),
      email: data.email || "",
      identityNumber: data.identityNumber?.toString() || "",
      nationality: data.nationality || "",
      gender: data.gender || "",
      phone: data.phone?.toString() || "",
      birthDate: data.birthDate || "",
      dateType: data.birthDatetype || data.dateType || "ميلادي",
      maritalStatus: data.maritalStatus || "",
      idImagePath: data.idImagePath || "",
      cityOfResidence: data.cityOfResidence || "",
      district: data.district || "",
      housingType: data.housingType || "ملك",
      rentAmount: data.rentAmount?.toString() || "",
      rentContractFile: data.rentImage || data.rentContractFile || "",
      familyCardFile: data.familyCardFile || "",
      jobStatus: data.jobStatus || "",
      healthStatus: data.healthStatus || "",
      disabilityType: data.disabilityType || "",
      bankName: data.bankName || "",
      ibanImage: data.ibanImage || "",
      numberOfFacilities: data.numberOfFacilities || 0,
      numberOfMales: data.numberOfMales || 0,
      housemates: (data.facilitiesInfo || []).map((h: any) => ({
        name: h.name || "",
        birthDate: h.birthDate || "",
        identityNumber: h.identityNumber?.toString() || "",
        gender: h.gender || "",
        kinship: h.kinship || "",
        studyLevel: h.studyLevel || "",
        healthStatus: h.healthStatus || "",
        disabilityType: h.disabilityType || "",
        dateType: h.dateType || "ميلادي",
      })),
      incomeSources: (data.incomeSources || []).map((s: any) => ({
        sourceType: s.sourceType || "",
        sourceAmount: s.sourceAmount?.toString() || "",
        sourceImage: s.sourceImage || null,
      })),
      requestDate: data.requestDate || data.createdAt || "",
      status: data.status || "pending",
      companions: (data.facilitiesInfo || []).map((h: any) => `${h.name} - ${h.kinship}`).join("، ") || "",
    };
  };

  useEffect(() => {
    if (reportDetails) {
      setBeneficiary(mapReportDetailsToBeneficiary(reportDetails));
    }
  }, [reportDetails]);

  useEffect(() => {
    // عند انتهاء الطباعة، أرجع العناصر
    const handleAfterPrint = () => setPrinting(false);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
    }, 100); // أعطي فرصة للـ state أن تتغير قبل الطباعة
  };

  const handleApprove = () => {
    console.log("Approving beneficiary:", beneficiary?.id);
    alert("تم اعتماد المستفيد بنجاح!");
    // هنا يمكن إضافة منطق اعتماد المستفيد
  };

  const handleReject = () => {
    console.log("Rejecting beneficiary:", beneficiary?.id);
    alert("تم رفض المستفيد!");
    // هنا يمكن إضافة منطق رفض المستفيد
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const formatDate = (dateString: string) => {
    return dateString;
  };

  const getStatusColor = (decision: string) => {
    if (decision === 'اعتمد') return styles.statusApproved;
    if (decision === 'رفض') return styles.statusRejected;
    return styles.statusPending;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>جاري التحميل...</div>
      </div>
    );
  }

  if (!beneficiary) {
    setTimeout(() => {
     return <div className={styles.errorContainer}>
        <h2>لم يتم العثور على المستفيد</h2>
        <button onClick={handleBack} className={styles.backButton}>
          العودة للوحة التحكم
        </button>
      </div>
    }, 200);
    return (
           <div className="w-full h-screen flex justify-center items-center ">
        <MoonLoader />
      </div>
      
      
     
    );
  }

  return (
    <div className={styles.pageWrapper}>
      {/* Popup for image */}
      {popupImage && (
        <div className={styles.popupOverlay} onClick={() => setPopupImage(null)}>
          <div className={styles.popupContent} onClick={e => e.stopPropagation()}>
            <img src={popupImage} alt="مصدر الدخل" className={styles.popupImage} />
            <button className={styles.closePopupButton} onClick={() => setPopupImage(null)}>إغلاق</button>
          </div>
        </div>
      )}
      {/* Header */}
      {!printing && (
        <header className={styles.header}>
          <div className={styles.headerContent}>
            {isMobile ? (
              <>
                <h1 className={styles.pageTitle}>تفاصيل المستفيد</h1>
                <div className={styles.headerButtons}>
                  <button onClick={handleBack} className={styles.backButton}>
                    <span className={styles.buttonIcon}>←</span>
                    <span className={styles.buttonText}>العودة للوحة التحكم</span>
                  </button>
                  <button className={styles.printButton} onClick={handlePrint}>
                    <span className={styles.buttonIcon}>💾</span>
                    <span className={styles.buttonText}>حفظ PDF</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <button onClick={handleBack} className={styles.backButton}>
                  <span className={styles.buttonIcon}>←</span>
                  <span className={styles.buttonText}>العودة للوحة التحكم</span>
                </button>
                <h1 className={styles.pageTitle}>تفاصيل المستفيد</h1>
                <button className={styles.printButton} onClick={handlePrint}>
                  <span className={styles.buttonIcon}>💾</span>
                  <span className={styles.buttonText}>حفظ PDF</span>
                </button>
              </>
            )}
          </div>
        </header>
      )}
      <div className={styles.content}>
        {/* البيانات الشخصية */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>
              <span className={styles.cardIcon}>👤</span>
              البيانات الشخصية
            </h3>
          </div>
          <div className={styles.detailsGrid}>
            {/* صورة المستفيد */}
            <div className={styles.imageContainer}>
              <img
                src={beneficiary.idImagePath}
                alt={beneficiary.fullName}
                className={styles.detailsImage}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/img/logo.png";
                }}
              />
            </div>
            
            {/* بيانات المستفيد */}
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

        {/* بيانات السكن */}
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
              {beneficiary.familyCardFile && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>كارت العائلة</span>
                  <span className={styles.infoValue}>
                    <button
                      type="button"
                      className={styles.fileLink}
                      onClick={() => setPopupImage(beneficiary.familyCardFile!)}
                    >
                      <span className={styles.linkIcon}>📄</span>
                      عرض الكارت
                    </button>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* بيانات البنك */}
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
                    <button
                      type="button"
                      className={styles.fileLink}
                      onClick={() => setPopupImage(beneficiary.ibanImage!)}
                    >
                      <span className={styles.linkIcon}>📷</span>
                      عرض الصورة
                    </button>
                  ) : (
                    <span className={styles.noFile}>غير متوفر</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* المرافقين */}
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

        {/* مصادر الدخل */}
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
                        <button
                          type="button"
                          className={styles.fileLink}
                          onClick={() => setPopupImage(source.sourceImage!)}
                        >
                          <span className={styles.linkIcon}>📷</span>
                          عرض الصورة
                        </button>
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

        {/* أزرار الإجراءات */}
        {!printing && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                <span className={styles.cardIcon}>⚡</span>
                الإجراءات
              </h3>
            </div>
            <div className={styles.actionButtons}>
              <button className={styles.approveButton} onClick={handleApprove}>
                <span className={styles.buttonIcon}>✔</span>
                <span className={styles.buttonText}>اعتماد</span>
              </button>
              <button className={styles.rejectButton} onClick={handleReject}>
                <span className={styles.buttonIcon}>✖</span>
                <span className={styles.buttonText}>رفض</span>
              </button>
            </div>
          </div>
        )}

        {/* سير الطلب */}
        {!printing && (
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
        )}
      </div>
    </div>
  );
};

export default BeneficiaryDetailsPage; 