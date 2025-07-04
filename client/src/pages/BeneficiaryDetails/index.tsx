import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./BeneficiaryDetails.module.css";
import { Beneficiary, RequestHistory } from "../Dashboard/types";
import { useGetCurrentReportData } from "../Dashboard/hooks/useGetCurrentReportData";
import { MoonLoader } from "react-spinners";
import Select from 'react-select';
import hotToast from "../../common/hotToast";

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
  const { error, loading, reportDetails } = useGetCurrentReportData(id || "");
  const navigate = useNavigate();
  const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null);
  const [editedBeneficiary, setEditedBeneficiary] = useState<Beneficiary | null>(null);
  const [printing, setPrinting] = useState(false);
  const [popupImage, setPopupImage] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [editingField, setEditingField] = useState<string | null>(null);

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
      disabilityType: (data.disabilityType === 'مريض' || data.disabilityType === 'ذوي احتياجات خاصة') ? data.disabilityType : undefined,
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
        studyGrade: h.studyGrade ?? "",
        healthStatus: h.healthStatus || "",
        disabilityType: (h.disabilityType === 'مريض' || h.disabilityType === 'ذوي احتياجات خاصة') ? h.disabilityType : undefined,
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
      const mapped = mapReportDetailsToBeneficiary(reportDetails);
      setBeneficiary(mapped);
      setEditedBeneficiary(mapped);
    }
  }, [reportDetails]);

  useEffect(() => {
    const handleAfterPrint = () => setPrinting(false);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleApprove = () => {
    console.log("Approving beneficiary:", beneficiary?.id);
    alert("تم اعتماد المستفيد بنجاح!");
  };

  const handleReject = () => {
    console.log("Rejecting beneficiary:", beneficiary?.id);
    alert("تم رفض المستفيد!");
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

  const handleEditChange = (field: keyof Beneficiary, value: any) => {
    if (!editedBeneficiary) return;
    setEditedBeneficiary({ ...editedBeneficiary, [field]: value });
  };

  const editableFields: (keyof Beneficiary)[] = [
    'firstName', 'secondName', 'thirdName', 'lastName', 'identityNumber', 'phone', 'gender', 'birthDate',
    'maritalStatus', 'nationality', 'cityOfResidence', 'jobStatus', 'healthStatus', 'disabilityType',
    'district', 'rentAmount', 'bankName'
  ];

  const hasEdits = beneficiary && editedBeneficiary && (
    editableFields.some(
      field => JSON.stringify(beneficiary[field]) !== JSON.stringify(editedBeneficiary[field])
    ) ||
    JSON.stringify(beneficiary.housemates) !== JSON.stringify(editedBeneficiary.housemates)
  );

  const saudiBanks = [
    "الأهلي السعودي",
    "الراجحي",
    "الرياض",
    "البلاد",
    "الجزيرة",
    "الإنماء",
    "سامبا",
    "العربي الوطني",
    "السعودي الفرنسي",
    "ساب",
    "الخليج الدولي",
    "بنك الاستثمار",
    "بنك التنمية",
    "بنك الخليج الدولي",
    "بنك الأول"
  ];

  const [saveError, setSaveError] = useState<string | null>(null);

  const validateEdits = () => {
    if (!editedBeneficiary) return 'حدث خطأ في البيانات.';
    if (!editedBeneficiary.firstName) return 'الاسم الأول مطلوب.';
    if (!editedBeneficiary.secondName) return 'الاسم الثاني مطلوب.';
    if (!editedBeneficiary.thirdName) return 'الاسم الثالث مطلوب.';
    if (!editedBeneficiary.lastName) return 'اسم العائلة مطلوب.';
    if (!/^[0-9]{10}$/.test(editedBeneficiary.identityNumber)) return 'رقم الهوية يجب أن يكون 10 أرقام.';
    if (!/^[0-9]{9}$/.test(editedBeneficiary.phone)) return 'رقم الجوال يجب أن يكون 9 أرقام.';
    if (!editedBeneficiary.gender) return 'الجنس مطلوب.';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(editedBeneficiary.birthDate)) return 'تاريخ الميلاد يجب أن يكون بالشكل yyyy-mm-dd';
    if (!editedBeneficiary.maritalStatus) return 'الحالة الاجتماعية مطلوبة.';
    if (!editedBeneficiary.healthStatus) return 'الحالة الصحية مطلوبة.';
    if (editedBeneficiary.healthStatus === 'غير سليم' && !editedBeneficiary.disabilityType) return 'نوع الإعاقة مطلوب إذا كانت الحالة الصحية غير سليم.';
    if (!editedBeneficiary.cityOfResidence) return 'المدينة مطلوبة.';
    if (!editedBeneficiary.district) return 'الحي مطلوب.';
    if (beneficiary?.housingType === 'إيجار' && !editedBeneficiary.rentAmount) return 'مبلغ الإيجار مطلوب.';
    if (!saudiBanks.includes(editedBeneficiary.bankName || '')) return 'يرجى اختيار اسم البنك من القائمة.';
    // فحص بيانات المرافقين
    for (let i = 0; i < editedBeneficiary.housemates.length; i++) {
      const h = editedBeneficiary.housemates[i];
      if (!h.name) return `اسم المرافق رقم ${i + 1} مطلوب.`;
      if (h.name.trim().split(/\s+/).length < 4) return `اسم المرافق رقم ${i + 1} يجب أن يكون رباعي.`;
      if (!/^[0-9]{10}$/.test(h.identityNumber)) return `رقم هوية المرافق رقم ${i + 1} يجب أن يكون 10 أرقام.`;
      if (!h.kinship) return `صلة القرابة للمرافق رقم ${i + 1} مطلوبة.`;
      if (!h.studyLevel) return `المرحلة الدراسية للمرافق رقم ${i + 1} مطلوبة.`;
      if (h.studyLevel !== 'جامعي' && !h.studyGrade) return `صف المرافق رقم ${i + 1} مطلوب.`;
      if (!h.healthStatus) return `الحالة الصحية للمرافق رقم ${i + 1} مطلوبة.`;
      if (h.healthStatus === 'غير سليم' && !h.disabilityType) return `نوع الإعاقة للمرافق رقم ${i + 1} مطلوب إذا كانت الحالة الصحية غير سليم.`;
    }
    return null;
  };

  const handleSaveEdits = () => {
    console.log(editedBeneficiary)
    const error = validateEdits();
    if (error) {
      // setSaveError(error);
      hotToast({type:"error",message:error})
      return;
    }
    setSaveError(null);
    alert('تم حفظ التعديلات!');
    setBeneficiary(editedBeneficiary);
  };

  const genderOptions = [
    { value: 'ذكر', label: 'ذكر' },
    { value: 'أنثى', label: 'أنثى' }
  ];
  const healthStatusOptions = [
    { value: 'سليم', label: 'سليم' },
    { value: 'غير سليم', label: 'غير سليم' }
  ];
  const disabilityTypeOptions = [
    { value: 'مريض', label: 'مريض' },
    { value: 'ذوي احتياجات خاصة', label: 'ذوي احتياجات خاصة' }
  ];
  const maritalStatusOptions = [
    { value: 'أعزب', label: 'أعزب' },
    { value: 'متزوج', label: 'متزوج' },
    { value: 'مطلق', label: 'مطلق' },
    { value: 'أرمل', label: 'أرمل' }
  ];
  const bankOptions = saudiBanks.map(b => ({ value: b, label: b }));
  const jobStatusOptions = [
    { value: 'موظف', label: 'موظف' },
    { value: 'عاطل', label: 'عاطل' }
  ];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>جاري التحميل...</div>
      </div>
    );
  }

  if (!beneficiary) {
    setTimeout(() => {
      return (
        <div className={styles.errorContainer}>
          <h2>لم يتم العثور على المستفيد</h2>
          <button onClick={handleBack} className={styles.backButton}>
            العودة للوحة التحكم
          </button>
        </div>
      );
    }, 200);
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <MoonLoader />
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      {popupImage && (
        <div className={styles.popupOverlay} onClick={() => setPopupImage(null)}>
          <div className={styles.popupContent} onClick={e => e.stopPropagation()}>
            <img loading="lazy" src={popupImage} alt="مصدر الدخل" className={styles.popupImage} />
            <button className={styles.closePopupButton} onClick={() => setPopupImage(null)}>إغلاق</button>
          </div>
        </div>
      )}
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
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>
              <span className={styles.cardIcon}>👤</span>
              البيانات الشخصية
            </h3>
          </div>
          <div className={styles.detailsGrid}>
            <div className={styles.imageContainer}>
              <img
              loading="lazy"
                src={beneficiary.idImagePath}
                alt={beneficiary.fullName}
                className={styles.detailsImage}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/img/logo.png";
                }}
              />
            </div>
            <div className={styles.detailsInfo}>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem} style={{ position: 'relative' }}>
                  <span className={styles.infoLabel}>الاسم الأول</span>
                  <span
                    className={styles.infoValue}
                    style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
                    onMouseEnter={e => {
                      const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                      if (icon) icon.style.visibility = 'visible';
                    }}
                    onMouseLeave={e => {
                      const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                      if (icon) icon.style.visibility = 'hidden';
                    }}
                  >
                    {editingField === 'firstName' ? (
                      <input
                        type="text"
                        value={editedBeneficiary?.firstName || ''}
                        autoFocus
                        onChange={e => handleEditChange('firstName', e.target.value)}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') setEditingField(null);
                        }}
                        className={styles.editInput}
                      />
                    ) : (
                      <span className={styles.editableField}>{editedBeneficiary?.firstName}</span>
                    )}
                    <span
                      className={`edit-icon ${styles.editIcon}`}
                      style={{
                        marginRight: 8,
                        cursor: 'pointer',
                        visibility: 'hidden',
                        position: 'static',
                        display: 'inline-block',
                      }}
                      onClick={() => setEditingField('firstName')}
                    >
                      ✏️
                    </span>
                  </span>
                </div>
                <div className={styles.infoItem} style={{ position: 'relative' }}>
                  <span className={styles.infoLabel}>الاسم الثاني</span>
                  <span
                    className={styles.infoValue}
                    style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
                    onMouseEnter={e => {
                      const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                      if (icon) icon.style.visibility = 'visible';
                    }}
                    onMouseLeave={e => {
                      const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                      if (icon) icon.style.visibility = 'hidden';
                    }}
                  >
                    {editingField === 'secondName' ? (
                      <input
                        type="text"
                        value={editedBeneficiary?.secondName || ''}
                        autoFocus
                        onChange={e => handleEditChange('secondName', e.target.value)}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') setEditingField(null);
                        }}
                        className={styles.editInput}
                      />
                    ) : (
                      <span className={styles.editableField}>{editedBeneficiary?.secondName}</span>
                    )}
                    <span
                      className={`edit-icon ${styles.editIcon}`}
                      style={{
                        marginRight: 8,
                        cursor: 'pointer',
                        visibility: 'hidden',
                        position: 'static',
                        display: 'inline-block',
                      }}
                      onClick={() => setEditingField('secondName')}
                    >
                      ✏️
                    </span>
                  </span>
                </div>
                <div className={styles.infoItem} style={{ position: 'relative' }}>
                  <span className={styles.infoLabel}>الاسم الثالث</span>
                  <span
                    className={styles.infoValue}
                    style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
                    onMouseEnter={e => {
                      const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                      if (icon) icon.style.visibility = 'visible';
                    }}
                    onMouseLeave={e => {
                      const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                      if (icon) icon.style.visibility = 'hidden';
                    }}
                  >
                    {editingField === 'thirdName' ? (
                      <input
                        type="text"
                        value={editedBeneficiary?.thirdName || ''}
                        autoFocus
                        onChange={e => handleEditChange('thirdName', e.target.value)}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') setEditingField(null);
                        }}
                        className={styles.editInput}
                      />
                    ) : (
                      <span className={styles.editableField}>{editedBeneficiary?.thirdName}</span>
                    )}
                    <span
                      className={`edit-icon ${styles.editIcon}`}
                      style={{
                        marginRight: 8,
                        cursor: 'pointer',
                        visibility: 'hidden',
                        position: 'static',
                        display: 'inline-block',
                      }}
                      onClick={() => setEditingField('thirdName')}
                    >
                      ✏️
                    </span>
                  </span>
                </div>
                <div className={styles.infoItem} style={{ position: 'relative' }}>
                  <span className={styles.infoLabel}>الاسم الأخير</span>
                  <span
                    className={styles.infoValue}
                    style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
                    onMouseEnter={e => {
                      const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                      if (icon) icon.style.visibility = 'visible';
                    }}
                    onMouseLeave={e => {
                      const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                      if (icon) icon.style.visibility = 'hidden';
                    }}
                  >
                    {editingField === 'lastName' ? (
                      <input
                        type="text"
                        value={editedBeneficiary?.lastName || ''}
                        autoFocus
                        onChange={e => handleEditChange('lastName', e.target.value)}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') setEditingField(null);
                        }}
                        className={styles.editInput}
                      />
                    ) : (
                      <span className={styles.editableField}>{editedBeneficiary?.lastName}</span>
                    )}
                    <span
                      className={`edit-icon ${styles.editIcon}`}
                      style={{
                        marginRight: 8,
                        cursor: 'pointer',
                        visibility: 'hidden',
                        position: 'static',
                        display: 'inline-block',
                      }}
                      onClick={() => setEditingField('lastName')}
                    >
                      ✏️
                    </span>
                  </span>
                </div>
                <div className={styles.infoItem} style={{ position: 'relative' }}>
                  <span className={styles.infoLabel}>رقم الهوية</span>
                  <span
                    className={styles.infoValue}
                    style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
                    onMouseEnter={e => {
                      const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                      if (icon) icon.style.visibility = 'visible';
                    }}
                    onMouseLeave={e => {
                      const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                      if (icon) icon.style.visibility = 'hidden';
                    }}
                  >
                    {editingField === 'identityNumber' ? (
                      <input
                        type="text"
                        value={editedBeneficiary?.identityNumber || ''}
                        autoFocus
                        onChange={e => handleEditChange('identityNumber', e.target.value)}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') setEditingField(null);
                        }}
                        className={styles.editInput}
                      />
                    ) : (
                      <span className={styles.editableField}>{editedBeneficiary?.identityNumber}</span>
                    )}
                    <span
                      className={`edit-icon ${styles.editIcon}`}
                      style={{
                        marginRight: 8,
                        cursor: 'pointer',
                        visibility: 'hidden',
                        position: 'static',
                        display: 'inline-block',
                      }}
                      onClick={() => setEditingField('identityNumber')}
                    >
                      ✏️
                    </span>
                  </span>
                </div>
                <div className={styles.infoItem} style={{ position: 'relative' }}>
                  <span className={styles.infoLabel}>رقم الجوال</span>
                  <span
                    className={styles.infoValue}
                    style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
                    onMouseEnter={e => {
                      const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                      if (icon) icon.style.visibility = 'visible';
                    }}
                    onMouseLeave={e => {
                      const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                      if (icon) icon.style.visibility = 'hidden';
                    }}
                  >
                    {editingField === 'phone' ? (
                      <input
                        type="text"
                        value={editedBeneficiary?.phone || ''}
                        autoFocus
                        onChange={e => handleEditChange('phone', e.target.value)}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') setEditingField(null);
                        }}
                        className={styles.editInput}
                      />
                    ) : (
                      <a href={`tel:${editedBeneficiary?.phone}`} className={styles.fileLink}>
                        <span className={styles.linkIcon}>📞</span>
                        <span className={styles.editableField}>{editedBeneficiary?.phone}</span>
                      </a>
                    )}
                    <span
                      className={`edit-icon ${styles.editIcon}`}
                      style={{
                        marginRight: 8,
                        cursor: 'pointer',
                        visibility: 'hidden',
                        position: 'static',
                        display: 'inline-block',
                      }}
                      onClick={() => setEditingField('phone')}
                    >
                      ✏️
                    </span>
                  </span>
                </div>
                <div className={styles.infoItem} style={{ position: 'relative' }}>
                  <span className={styles.infoLabel}>الجنس</span>
                  <span
                    className={styles.infoValue}
                    style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
                    onMouseEnter={e => {
                      const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                      if (icon) icon.style.visibility = 'visible';
                    }}
                    onMouseLeave={e => {
                      const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                      if (icon) icon.style.visibility = 'hidden';
                    }}
                  >
                    {editingField === 'gender' ? (
                      <Select
                        options={genderOptions}
                        value={genderOptions.find(opt => opt.value === editedBeneficiary?.gender)}
                        onChange={option => handleEditChange('gender', option?.value)}
                        onBlur={() => setEditingField(null)}
                        classNamePrefix="customSelect"
                        autoFocus
                        menuPlacement="auto"
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderRadius: 8,
                            borderColor: '#b0c4de',
                            minHeight: 44,
                            fontSize: 16,
                            fontWeight: 500,
                            background: '#f0f6ff',
                            color: '#374151',
                            boxShadow: 'none',
                            '&:hover': { borderColor: 'rgb(58, 61, 108)' }
                          }),
                          option: (base, state) => ({
                            ...base,
                            background: state.isSelected
                              ? '#e8f2ff'
                              : state.isFocused
                              ? '#d1e7ff'
                              : '#fff',
                            color: '#374151',
                            fontSize: 16,
                            fontWeight: 500,
                            direction: 'rtl',
                            textAlign: 'right',
                            cursor: 'pointer',
                          }),
                          menu: (base) => ({
                            ...base,
                            borderRadius: 8,
                            zIndex: 9999,
                            direction: 'rtl',
                            textAlign: 'right'
                          })
                        }}
                        isRtl
                        placeholder="اختر"
                      />
                    ) : (
                      <span className={styles.editableField}>{editedBeneficiary?.gender}</span>
                    )}
                    <span
                      className={`edit-icon ${styles.editIcon}`}
                      style={{
                        marginRight: 8,
                        cursor: 'pointer',
                        visibility: 'hidden',
                        position: 'static',
                        display: 'inline-block',
                      }}
                      onClick={() => setEditingField('gender')}
                    >
                      ✏️
                    </span>
                  </span>
                </div>
                <div className={styles.infoItem} style={{ position: 'relative' }}>
                  <span className={styles.infoLabel}>تاريخ الميلاد</span>
                  <span
                    className={styles.infoValue}
                    style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
                    onMouseEnter={e => {
                      const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                      if (icon) icon.style.visibility = 'visible';
                    }}
                    onMouseLeave={e => {
                      const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                      if (icon) icon.style.visibility = 'hidden';
                    }}
                  >
                    {editingField === 'birthDate' ? (
                      <input
                        type="text"
                        value={editedBeneficiary?.birthDate || ''}
                        autoFocus
                        onChange={e => handleEditChange('birthDate', e.target.value)}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') setEditingField(null);
                        }}
                        className={styles.editInput}
                      />
                    ) : (
                      <span className={styles.editableField}>{formatDate(editedBeneficiary?.birthDate || '')} ({editedBeneficiary?.dateType})</span>
                    )}
                    <span
                      className={`edit-icon ${styles.editIcon}`}
                      style={{
                        marginRight: 8,
                        cursor: 'pointer',
                        visibility: 'hidden',
                        position: 'static',
                        display: 'inline-block',
                      }}
                      onClick={() => setEditingField('birthDate')}
                    >
                      ✏️
                    </span>
                  </span>
                </div>
                <div className={styles.infoItem} style={{ position: 'relative' }}>
                  <span className={styles.infoLabel}>الحالة الصحية</span>
                  <span
                    className={styles.infoValue}
                    style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
                    onMouseEnter={e => {
                      const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                      if (icon) icon.style.visibility = 'visible';
                    }}
                    onMouseLeave={e => {
                      const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                      if (icon) icon.style.visibility = 'hidden';
                    }}
                  >
                    {editingField === 'healthStatus' ? (
                      <Select
                        options={healthStatusOptions}
                        value={healthStatusOptions.find(opt => opt.value === editedBeneficiary?.healthStatus)}
                        onChange={option => handleEditChange('healthStatus', option?.value)}
                        onBlur={() => setEditingField(null)}
                        classNamePrefix="customSelect"
                        autoFocus
                        menuPlacement="auto"
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderRadius: 8,
                            borderColor: '#b0c4de',
                            minHeight: 44,
                            fontSize: 16,
                            fontWeight: 500,
                            background: '#f0f6ff',
                            color: '#374151',
                            boxShadow: 'none',
                            '&:hover': { borderColor: 'rgb(58, 61, 108)' }
                          }),
                          option: (base, state) => ({
                            ...base,
                            background: state.isSelected
                              ? '#e8f2ff'
                              : state.isFocused
                              ? '#d1e7ff'
                              : '#fff',
                            color: '#374151',
                            fontSize: 16,
                            fontWeight: 500,
                            direction: 'rtl',
                            textAlign: 'right',
                            cursor: 'pointer',
                          }),
                          menu: (base) => ({
                            ...base,
                            borderRadius: 8,
                            zIndex: 9999,
                            direction: 'rtl',
                            textAlign: 'right'
                          })
                        }}
                        isRtl
                        placeholder="اختر"
                      />
                    ) : (
                      <span className={styles.editableField}>{editedBeneficiary?.healthStatus}</span>
                    )}
                    <span
                      className={`edit-icon ${styles.editIcon}`}
                      style={{
                        marginRight: 8,
                        cursor: 'pointer',
                        visibility: 'hidden',
                        position: 'static',
                        display: 'inline-block',
                      }}
                      onClick={() => setEditingField('healthStatus')}
                    >
                      ✏️
                    </span>
                  </span>
                </div>
                {editedBeneficiary?.healthStatus === 'غير سليم' && (
                  <div className={styles.infoItem} style={{ position: 'relative' }}>
                    <span className={styles.infoLabel}>نوع الإعاقة</span>
                    <span
                      className={styles.infoValue}
                      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
                      onMouseEnter={e => {
                        const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                        if (icon) icon.style.visibility = 'visible';
                      }}
                      onMouseLeave={e => {
                        const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                        if (icon) icon.style.visibility = 'hidden';
                      }}
                    >
                      {editingField === 'disabilityType' ? (
                        <Select
                          options={disabilityTypeOptions}
                          value={disabilityTypeOptions.find(opt => opt.value === editedBeneficiary?.disabilityType)}
                          onChange={option => handleEditChange('disabilityType', option?.value)}
                          onBlur={() => setEditingField(null)}
                          classNamePrefix="customSelect"
                          autoFocus
                          menuPlacement="auto"
                          styles={{
                            control: (base) => ({
                              ...base,
                              borderRadius: 8,
                              borderColor: '#b0c4de',
                              minHeight: 44,
                              fontSize: 16,
                              fontWeight: 500,
                              background: '#f0f6ff',
                              color: '#374151',
                              boxShadow: 'none',
                              '&:hover': { borderColor: 'rgb(58, 61, 108)' }
                            }),
                            option: (base, state) => ({
                              ...base,
                              background: state.isSelected
                                ? '#e8f2ff'
                                : state.isFocused
                                ? '#d1e7ff'
                                : '#fff',
                              color: '#374151',
                              fontSize: 16,
                              fontWeight: 500,
                              direction: 'rtl',
                              textAlign: 'right',
                              cursor: 'pointer',
                            }),
                            menu: (base) => ({
                              ...base,
                              borderRadius: 8,
                              zIndex: 9999,
                              direction: 'rtl',
                              textAlign: 'right'
                            })
                          }}
                          isRtl
                          placeholder="اختر"
                        />
                      ) : (
                        <span className={styles.editableField}>{editedBeneficiary?.disabilityType}</span>
                      )}
                      <span
                        className={`edit-icon ${styles.editIcon}`}
                        style={{
                          marginRight: 8,
                          cursor: 'pointer',
                          visibility: 'hidden',
                          position: 'static',
                          display: 'inline-block',
                        }}
                        onClick={() => setEditingField('disabilityType')}
                      >
                        ✏️
                      </span>
                    </span>
                  </div>
                )}
                <div className={styles.infoItem} style={{ position: 'relative' }}>
                  <span className={styles.infoLabel}>الحالة الاجتماعية</span>
                  <span
                    className={styles.infoValue}
                    style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
                    onMouseEnter={e => {
                      const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                      if (icon) icon.style.visibility = 'visible';
                    }}
                    onMouseLeave={e => {
                      const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                      if (icon) icon.style.visibility = 'hidden';
                    }}
                  >
                    {editingField === 'maritalStatus' ? (
                      <Select
                        options={maritalStatusOptions}
                        value={maritalStatusOptions.find(opt => opt.value === editedBeneficiary?.maritalStatus)}
                        onChange={option => handleEditChange('maritalStatus', option?.value)}
                        onBlur={() => setEditingField(null)}
                        classNamePrefix="customSelect"
                        autoFocus
                        menuPlacement="auto"
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderRadius: 8,
                            borderColor: '#b0c4de',
                            minHeight: 44,
                            fontSize: 16,
                            fontWeight: 500,
                            background: '#f0f6ff',
                            color: '#374151',
                            boxShadow: 'none',
                            '&:hover': { borderColor: 'rgb(58, 61, 108)' }
                          }),
                          option: (base, state) => ({
                            ...base,
                            background: state.isSelected
                              ? '#e8f2ff'
                              : state.isFocused
                              ? '#d1e7ff'
                              : '#fff',
                            color: '#374151',
                            fontSize: 16,
                            fontWeight: 500,
                            direction: 'rtl',
                            textAlign: 'right',
                            cursor: 'pointer',
                          }),
                          menu: (base) => ({
                            ...base,
                            borderRadius: 8,
                            zIndex: 9999,
                            direction: 'rtl',
                            textAlign: 'right'
                          })
                        }}
                        isRtl
                        placeholder="اختر"
                      />
                    ) : (
                      <span className={styles.editableField}>{editedBeneficiary?.maritalStatus}</span>
                    )}
                    <span
                      className={`edit-icon ${styles.editIcon}`}
                      style={{
                        marginRight: 8,
                        cursor: 'pointer',
                        visibility: 'hidden',
                        position: 'static',
                        display: 'inline-block',
                      }}
                      onClick={() => setEditingField('maritalStatus')}
                    >
                      ✏️
                    </span>
                  </span>
                </div>
                <div className={styles.infoItem} style={{ position: 'relative' }}>
                  <span className={styles.infoLabel}>الجنسية</span>
                  <span
                    className={styles.infoValue}
                    style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
                    onMouseEnter={e => {
                      const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                      if (icon) icon.style.visibility = 'visible';
                    }}
                    onMouseLeave={e => {
                      const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                      if (icon) icon.style.visibility = 'hidden';
                    }}
                  >
                    {editingField === 'nationality' ? (
                      <input
                        type="text"
                        value={editedBeneficiary?.nationality || ''}
                        autoFocus
                        onChange={e => handleEditChange('nationality', e.target.value)}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') setEditingField(null);
                        }}
                        className={styles.editInput}
                      />
                    ) : (
                      <span className={styles.editableField}>{editedBeneficiary?.nationality}</span>
                    )}
                    <span
                      className={`edit-icon ${styles.editIcon}`}
                      style={{
                        marginRight: 8,
                        cursor: 'pointer',
                        visibility: 'hidden',
                        position: 'static',
                        display: 'inline-block',
                      }}
                      onClick={() => setEditingField('nationality')}
                    >
                      ✏️
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>
              <span className={styles.cardIcon}>🏠</span>
              بيانات السكن
            </h3>
          </div>
          <div className={styles.detailsInfo}>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem} style={{ position: 'relative' }}>
                <span className={styles.infoLabel}>المدينة</span>
                <span
                  className={styles.infoValue}
                  style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
                  onMouseEnter={e => {
                    const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                    if (icon) icon.style.visibility = 'visible';
                  }}
                  onMouseLeave={e => {
                    const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                    if (icon) icon.style.visibility = 'hidden';
                  }}
                >
                  {editingField === 'cityOfResidence' ? (
                    <input
                      type="text"
                      value={editedBeneficiary?.cityOfResidence || ''}
                      autoFocus
                      onChange={e => handleEditChange('cityOfResidence', e.target.value)}
                      onBlur={() => setEditingField(null)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') setEditingField(null);
                      }}
                      className={styles.editInput}
                    />
                  ) : (
                    <span className={styles.editableField}>{editedBeneficiary?.cityOfResidence}</span>
                  )}
                  <span
                    className={`edit-icon ${styles.editIcon}`}
                    style={{
                      marginRight: 8,
                      cursor: 'pointer',
                      visibility: 'hidden',
                      position: 'static',
                      display: 'inline-block',
                    }}
                    onClick={() => setEditingField('cityOfResidence')}
                  >
                    ✏️
                  </span>
                </span>
              </div>
              <div className={styles.infoItem} style={{ position: 'relative' }}>
                <span className={styles.infoLabel}>الحي</span>
                <span
                  className={styles.infoValue}
                  style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
                  onMouseEnter={e => {
                    const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                    if (icon) icon.style.visibility = 'visible';
                  }}
                  onMouseLeave={e => {
                    const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                    if (icon) icon.style.visibility = 'hidden';
                  }}
                >
                  {editingField === 'district' ? (
                    <input
                      type="text"
                      value={editedBeneficiary?.district || ''}
                      autoFocus
                      onChange={e => handleEditChange('district', e.target.value)}
                      onBlur={() => setEditingField(null)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') setEditingField(null);
                      }}
                      className={styles.editInput}
                    />
                  ) : (
                    <span className={styles.editableField}>{editedBeneficiary?.district}</span>
                  )}
                  <span
                    className={`edit-icon ${styles.editIcon}`}
                    style={{
                      marginRight: 8,
                      cursor: 'pointer',
                      visibility: 'hidden',
                      position: 'static',
                      display: 'inline-block',
                    }}
                    onClick={() => setEditingField('district')}
                  >
                    ✏️
                  </span>
                </span>
              </div>
              <div className={styles.infoItem} style={{ position: 'relative' }}>
                <span className={styles.infoLabel}>نوع السكن</span>
                <span className={styles.infoValue}>{beneficiary.housingType}</span>
              </div>
              {beneficiary.housingType === "إيجار" && (
                <div className={styles.infoItem} style={{ position: 'relative' }}>
                  <span className={styles.infoLabel}>مبلغ الإيجار</span>
                  <span
                    className={styles.infoValue}
                    style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
                    onMouseEnter={e => {
                      const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                      if (icon) icon.style.visibility = 'visible';
                    }}
                    onMouseLeave={e => {
                      const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                      if (icon) icon.style.visibility = 'hidden';
                    }}
                  >
                    {editingField === 'rentAmount' ? (
                      <input
                        type="text"
                        value={editedBeneficiary?.rentAmount || ''}
                        autoFocus
                        onChange={e => handleEditChange('rentAmount', e.target.value)}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') setEditingField(null);
                        }}
                        className={styles.editInput}
                      />
                    ) : (
                      <span className={styles.editableField}>{editedBeneficiary?.rentAmount} ريال</span>
                    )}
                    <span
                      className={`edit-icon ${styles.editIcon}`}
                      style={{
                        marginRight: 8,
                        cursor: 'pointer',
                        visibility: 'hidden',
                        position: 'static',
                        display: 'inline-block',
                      }}
                      onClick={() => setEditingField('rentAmount')}
                    >
                      ✏️
                    </span>
                  </span>
                </div>
              )}
              <div className={styles.infoItem} style={{ position: 'relative' }}>
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
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>
              <span className={styles.cardIcon}>🏦</span>
              بيانات البنك
            </h3>
          </div>
          <div className={styles.detailsInfo}>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem} style={{ position: 'relative' }}>
                <span className={styles.infoLabel}>اسم البنك</span>
                <span
                  className={styles.infoValue}
                  style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
                  onMouseEnter={e => {
                    const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                    if (icon) icon.style.visibility = 'visible';
                  }}
                  onMouseLeave={e => {
                    const icon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                    if (icon) icon.style.visibility = 'hidden';
                  }}
                >
                  {editingField === 'bankName' ? (
                    <Select
                      options={bankOptions}
                      value={bankOptions.find(opt => opt.value === editedBeneficiary?.bankName)}
                      onChange={option => handleEditChange('bankName', option?.value)}
                      onBlur={() => setEditingField(null)}
                      classNamePrefix="customSelect"
                      autoFocus
                      menuPlacement="auto"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: 8,
                          borderColor: '#b0c4de',
                          minHeight: 44,
                          fontSize: 16,
                          fontWeight: 500,
                          background: '#f0f6ff',
                          color: '#374151',
                          boxShadow: 'none',
                          '&:hover': { borderColor: 'rgb(58, 61, 108)' }
                        }),
                        option: (base, state) => ({
                          ...base,
                          background: state.isSelected
                            ? '#e8f2ff'
                            : state.isFocused
                            ? '#d1e7ff'
                            : '#fff',
                          color: '#374151',
                          fontSize: 16,
                          fontWeight: 500,
                          direction: 'rtl',
                          textAlign: 'right',
                          cursor: 'pointer',
                        }),
                        menu: (base) => ({
                          ...base,
                          borderRadius: 8,
                          zIndex: 9999,
                          direction: 'rtl',
                          textAlign: 'right'
                        })
                      }}
                      isRtl
                      placeholder="اختر البنك"
                    />
                  ) : (
                    <span className={styles.editableField}>{editedBeneficiary?.bankName}</span>
                  )}
                  <span
                    className={`edit-icon ${styles.editIcon}`}
                    style={{
                      marginRight: 8,
                      cursor: 'pointer',
                      visibility: 'hidden',
                      position: 'static',
                      display: 'inline-block',
                    }}
                    onClick={() => setEditingField('bankName')}
                  >
                    ✏️
                  </span>
                </span>
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
                  <th>صلة القرابة</th>
                  <th>المرحلة الدراسية</th>
                  <th>الصف</th>
                  <th>الحالة الصحية</th>
                  <th>نوع الإعاقة</th>
                </tr>
              </thead>
              <tbody>
                {editedBeneficiary && editedBeneficiary.housemates.map((housemate, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td style={{ position: 'relative' }}>
                      {editingField === `name-${index}` ? (
                        <input
                          type="text"
                          value={housemate.name}
                          autoFocus
                          onChange={e => {
                            const newHousematesName = editedBeneficiary.housemates.map((h, i) =>
                              i === index ? { ...h, name: e.target.value } : h
                            );
                            setEditedBeneficiary({ ...editedBeneficiary, housemates: newHousematesName });
                          }}
                          onBlur={() => setEditingField(null)}
                          onKeyDown={e => { if (e.key === 'Enter') setEditingField(null); }}
                          className={styles.editInput}
                        />
                      ) : (
                        <span className={styles.infoValue}>
                          {housemate.name}
                          <span
                            className={`edit-icon ${styles.editIcon}`}
                            onClick={() => setEditingField(`name-${index}`)}
                          >
                            ✏️
                          </span>
                        </span>
                      )}
                    </td>
                    <td style={{ position: 'relative' }}>
                      {editingField === `identityNumber-${index}` ? (
                        <input
                          type="text"
                          value={housemate.identityNumber}
                          autoFocus
                          onChange={e => {
                            const newHousematesIdentityNumber = editedBeneficiary.housemates.map((h, i) =>
                              i === index ? { ...h, identityNumber: e.target.value } : h
                            );
                            setEditedBeneficiary({ ...editedBeneficiary, housemates: newHousematesIdentityNumber });
                          }}
                          onBlur={() => setEditingField(null)}
                          onKeyDown={e => { if (e.key === 'Enter') setEditingField(null); }}
                          className={styles.editInput}
                        />
                      ) : (
                        <span className={styles.infoValue}>
                          {housemate.identityNumber}
                          <span
                            className={`edit-icon ${styles.editIcon}`}
                            onClick={() => setEditingField(`identityNumber-${index}`)}
                          >
                            ✏️
                          </span>
                        </span>
                      )}
                    </td>
                    <td>{formatDate(housemate.birthDate)} ({housemate.dateType})</td>
                    <td style={{ position: 'relative' }}>
                      {editingField === `kinship-${index}` ? (
                        <input
                          type="text"
                          value={housemate.kinship}
                          autoFocus
                          onChange={e => {
                            const newHousematesKinship = editedBeneficiary.housemates.map((h, i) =>
                              i === index ? { ...h, kinship: e.target.value } : h
                            );
                            setEditedBeneficiary({ ...editedBeneficiary, housemates: newHousematesKinship });
                          }}
                          onBlur={() => setEditingField(null)}
                          onKeyDown={e => { if (e.key === 'Enter') setEditingField(null); }}
                          className={styles.editInput}
                        />
                      ) : (
                        <span className={styles.infoValue}>
                          {housemate.kinship}
                          <span
                            className={`edit-icon ${styles.editIcon}`}
                            onClick={() => setEditingField(`kinship-${index}`)}
                          >
                            ✏️
                          </span>
                        </span>
                      )}
                    </td>
                    <td style={{ position: 'relative' }}>
                      {editingField === `studyLevel-${index}` ? (
                        <select
                          value={housemate.studyLevel || ''}
                          autoFocus
                          onChange={e => {
                            const newHousematesStudyLevel = editedBeneficiary.housemates.map((h, i) =>
                              i === index ? { ...h, studyLevel: e.target.value, studyGrade: e.target.value === 'جامعي' ? '' : h.studyGrade } : h
                            );
                            setEditedBeneficiary({ ...editedBeneficiary, housemates: newHousematesStudyLevel });
                          }}
                          onBlur={() => setEditingField(null)}
                          className={styles.editInput}
                        >
                          <option value="">اختر</option>
                          <option value="ابتدائي">ابتدائي</option>
                          <option value="متوسط">متوسط</option>
                          <option value="ثانوي">ثانوي</option>
                          <option value="جامعي">جامعي</option>
                        </select>
                      ) : (
                        <span className={styles.infoValue}>
                          {housemate.studyLevel || "-"}
                          <span
                            className={`edit-icon ${styles.editIcon}`}
                            onClick={() => setEditingField(`studyLevel-${index}`)}
                          >
                            ✏️
                          </span>
                        </span>
                      )}
                    </td>
                    <td style={{ position: 'relative' }}>
                      {housemate.studyLevel === 'جامعي' ? (
                        <span className={styles.infoValue}>-</span>
                      ) : editingField === `studyGrade-${index}` ? (
                        <select
                          value={housemate.studyGrade || ''}
                          autoFocus
                          onChange={e => {
                            const newHousematesStudyGrade = editedBeneficiary.housemates.map((h, i) =>
                              i === index ? { ...h, studyGrade: e.target.value } : h
                            );
                            setEditedBeneficiary({ ...editedBeneficiary, housemates: newHousematesStudyGrade });
                          }}
                          onBlur={() => setEditingField(null)}
                          className={styles.editInput}
                        >
                          <option value="">اختر</option>
                          {housemate.studyLevel === 'ابتدائي' && [1,2,3,4,5,6].map(n => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                          {(housemate.studyLevel === 'متوسط' || housemate.studyLevel === 'ثانوي') && [1,2,3].map(n => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={styles.infoValue}>
                          {housemate.studyLevel === 'جامعي' ? '-' : (housemate.studyGrade || '-')}
                          {housemate.studyLevel !== 'جامعي' && (
                            <span
                              className={`edit-icon ${styles.editIcon}`}
                              onClick={() => setEditingField(`studyGrade-${index}`)}
                            >
                              ✏️
                            </span>
                          )}
                        </span>
                      )}
                    </td>
                    <td style={{ position: 'relative' }}>
                      {editingField === `healthStatus-${index}` ? (
                        <select
                          value={housemate.healthStatus || ''}
                          autoFocus
                          onChange={e => {
                            const newHousematesHealthStatus = editedBeneficiary.housemates.map((h, i) =>
                              i === index ? { ...h, healthStatus: e.target.value as 'سليم' | 'غير سليم', disabilityType: e.target.value === 'سليم' ? undefined : h.disabilityType } : h
                            );
                            setEditedBeneficiary({ ...editedBeneficiary, housemates: newHousematesHealthStatus });
                          }}
                          onBlur={() => setEditingField(null)}
                          className={styles.editInput}
                        >
                          <option value="">اختر</option>
                          <option value="سليم">سليم</option>
                          <option value="غير سليم">غير سليم</option>
                        </select>
                      ) : (
                        <span className={styles.infoValue}>
                          {housemate.healthStatus || "-"}
                          <span
                            className={`edit-icon ${styles.editIcon}`}
                            onClick={() => setEditingField(`healthStatus-${index}`)}
                          >
                            ✏️
                          </span>
                        </span>
                      )}
                    </td>
                    <td style={{ position: 'relative' }}>
                      {housemate.healthStatus === 'غير سليم' ? (
                        editingField === `disabilityType-${index}` ? (
                          <select
                            value={housemate.disabilityType || ''}
                            autoFocus
                            onChange={e => {
                              const newHousematesDisabilityType = editedBeneficiary.housemates.map((h, i) =>
                                i === index ? { ...h, disabilityType: e.target.value as 'مريض' | 'ذوي احتياجات خاصة' } : h
                              );
                              setEditedBeneficiary({ ...editedBeneficiary, housemates: newHousematesDisabilityType });
                            }}
                            onBlur={() => setEditingField(null)}
                            className={styles.editInput}
                          >
                            <option value="">اختر</option>
                            <option value="مريض">مريض</option>
                            <option value="ذوي احتياجات خاصة">ذوي احتياجات خاصة</option>
                          </select>
                        ) : (
                          <span className={styles.infoValue}>
                            {housemate.disabilityType || "-"}
                            <span
                              className={`edit-icon ${styles.editIcon}`}
                              onClick={() => setEditingField(`disabilityType-${index}`)}
                            >
                              ✏️
                            </span>
                          </span>
                        )
                      ) : (
                        <span className={styles.infoValue}>-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
            {hasEdits && (
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <button className={styles.saveButton} onClick={handleSaveEdits}>
                  حفظ التعديلات
                </button>
                {saveError && (
                  <div style={{ color: 'red', marginTop: 8 }}>{saveError}</div>
                )}
              </div>
            )}
          </div>
        )}
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