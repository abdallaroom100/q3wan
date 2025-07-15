import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./BeneficiaryDetails.module.css";
import { Beneficiary, RequestHistory } from "../Dashboard/types";
import { useGetCurrentReportData } from "../Dashboard/hooks/useGetCurrentReportData";
import { MoonLoader } from "react-spinners";
import Select from 'react-select';
import hotToast from "../../common/hotToast";
import { useEditReportData } from "../Dashboard/hooks/useEditReportData";
import { useConfirmCurrentReport } from "../Dashboard/hooks/useConfirmCurrentReport";
import { useAcceptCommitteeReport } from "../Dashboard/hooks/useAcceptCommitteeReport";
import { useRejectCommitteeToReport } from "../Dashboard/hooks/useRejectCommitteeToReport";
import { useDeleteBeneficiary } from "../Dashboard/hooks/useDeleteBeneficiary";
import { useRejectManagerReport } from "../Dashboard/hooks/useRejectManagerReport";
import { useAcceptManagerReport } from "../Dashboard/hooks/useAcceptManagerReport";
import { useDeleteTemporaryBeneficiary } from "../Dashboard/hooks/useDeleteBeneficiary";



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
   const history = useNavigate()
  const { id } = useParams<{ id: string }>();
  const { error, loading, reportDetails,fullReport } = useGetCurrentReportData(id || "");
  const navigate = useNavigate();
  const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null);
  const [editedBeneficiary, setEditedBeneficiary] = useState<Beneficiary | null>(null);
  const [printing, setPrinting] = useState(false);
  const [popupImage, setPopupImage] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);
  const [approveComment, setApproveComment] = useState('');
  const [rejectComment, setRejectComment] = useState('');
  
  // جميع hooks يجب أن تكون في أعلى الكومبوننت
  const {confirmCurrentReport,confirmLoading,isConfirmed,confirmReportError} = useConfirmCurrentReport()
  const {reportLoading,reportError, editedUser,editReport} = useEditReportData()
  const {acceptCommitteeToReport,isAccepted,acceptCommitteeError} = useAcceptCommitteeReport()
  const {rejectCommitteeToReport,isRejected,rejectCommitteeError} = useRejectCommitteeToReport()
  const {deleteBeneficiary,isDeleted,deleteBeneficiaryError} = useDeleteBeneficiary()
  const {rejectManagerReport,rejectManagerError,isManagerReject,rejectManagerLoading} = useRejectManagerReport()
  const {acceptManagerLoading,acceptManagerReport,isManagerAccept,acceptManagerError} = useAcceptManagerReport()
  const { deleteTemporaryLoading, deleteTemporaryBeneficiary, isTemporaryDeleted, deleteTemporaryError } = useDeleteTemporaryBeneficiary();
  const [showTempDeletePopup, setShowTempDeletePopup] = useState(false);
  
  // الحصول على دور المستخدم الحالي
  useEffect(() => {
    try {
      const adminData = JSON.parse(localStorage.getItem("admin") || "{}");
      setCurrentAdmin(adminData);
    } catch (e) {
      setCurrentAdmin(null);
    }  
  }, []);



  // مراقبة حالة الاعتماد
  useEffect(() => {
    if (isConfirmed) {
      const successMessage = currentAdmin?.rule === 'committee'
        ? "تم قبول المستفيد بنجاح!" 
        : "تم اعتماد المستفيد بنجاح!";
      hotToast({type: "success", message: successMessage});
      setTimeout(() => {
        history("/dashboard")
      }, 250);
    }
  }, [isConfirmed, currentAdmin?.rule, history]);

  // مراقبة أخطاء الاعتماد
  useEffect(() => {
    if (confirmReportError) {
      hotToast({type: "error", message: confirmReportError});
    }
  }, [confirmReportError]);

  // مراقبة حالة القبول من اللجنة
  useEffect(() => {
    if (isAccepted) {
      hotToast({type:"success",message:"تم قبول المستفيد بنجاح"})
      navigate("/dashboard")
    }
  }, [isAccepted, navigate]);

  // مراقبة حالة الرفض من اللجنة
  useEffect(() => {
    if (isRejected) {
      hotToast({type:"success",message:"تم رفض المستفيد بنجاح"})
      navigate("/dashboard")
    }
  }, [isRejected, navigate]);

  // مراقبة حالة الحذف
  useEffect(() => {
    if (isDeleted) {
      hotToast({type:"success",message:"تم حذف المستفيد بنجاح"})
      setTimeout(() => {
        navigate("/dashboard")
      }, 300);
    }
  }, [isDeleted, navigate]);

  // مراقبة أخطاء اللجنة
  useEffect(() => {
    if (acceptCommitteeError) {
      hotToast({type:"error",message:acceptCommitteeError})
    }
  }, [acceptCommitteeError]);

  useEffect(() => {
    if (rejectCommitteeError) {
      hotToast({type:"error",message:rejectCommitteeError})
    }
  }, [rejectCommitteeError]);

  // مراقبة أخطاء الحذف
  useEffect(() => {
    if (deleteBeneficiaryError) {
      hotToast({type:"error",message:deleteBeneficiaryError})
    }
  }, [deleteBeneficiaryError]);

  // مراقبة حالة الاعتماد من المدير
  useEffect(() => {
    if (isManagerAccept) {
      hotToast({type:"success",message:"تم الاعتماد الكلي بنجاح"})
      setTimeout(() => {
        navigate("/dashboard")
      }, 300);
    }
  }, [isManagerAccept, navigate]);

  // مراقبة حالة الرفض من المدير
  useEffect(() => {
    if (isManagerReject) {
      hotToast({type:"success",message:"تم الرفض الكلي بنجاح"})
      setTimeout(() => {
        navigate("/dashboard")
      }, 300);
    }
  }, [isManagerReject, navigate]);

  // مراقبة أخطاء المدير
  useEffect(() => {
    if (acceptManagerError) {
      hotToast({type:"error",message:acceptManagerError})
    }
  }, [acceptManagerError]);

  useEffect(() => {
    if (rejectManagerError) {
      hotToast({type:"error",message:rejectManagerError})
    }
  }, [rejectManagerError]);

  useEffect(() => {
    if (isTemporaryDeleted) {
      hotToast({type:"success",message:"تم حذف المستفيد مؤقتا"})
      setTimeout(() => {
        navigate("/dashboard")
      }, 260);
    }
  }, [isTemporaryDeleted, navigate]);

  useEffect(() => {
    if (deleteTemporaryError) {
      hotToast({type:"error",message:deleteTemporaryError})
    }
  }, [deleteTemporaryError]);

  // تحديد أسماء الأزرار حسب الدور
  const getButtonLabels = () => {
    if (currentAdmin?.rule === 'reviewer') {
      return {
        approveButton: 'اعتماد',
        rejectButton: 'حذف',
        approveIcon: '✔',
        rejectIcon: '🗑️'
      };
    } else if (currentAdmin?.rule === 'committee') {
      return {
        approveButton: 'قبول',
        rejectButton: 'رفض',
        approveIcon: '📤',
        rejectIcon: '✖'
      };
    } else {
      return {
        approveButton: 'اعتماد',
        rejectButton: 'رفض',
        approveIcon: '✔',
        rejectIcon: '✖'
      };
    }
  };

  const buttonLabels = getButtonLabels();

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

  const handleApprove = useCallback(() => {
    setConfirmAction('approve');
    setShowConfirmPopup(true);
    // مسح التعليقات عند فتح popup جديد
    setApproveComment('');
    setRejectComment('');
  }, []);

  const handleReject = useCallback(() => {
    setConfirmAction('reject');
    setShowConfirmPopup(true);
    // مسح التعليقات عند فتح popup جديد
    setApproveComment('');
    setRejectComment('');
      }, []);
  // const handleConfirmAction = async () => {
  //   // التحقق من وجود تعليقات للجنة في حالة الرفض

  //   if (confirmAction === 'approve') {
  //     console.log("Approving beneficiary:", beneficiary?.id);
  //     console.log("Comments:", approveComment);
  //     await confirmCurrentReport({reportId:beneficiary?.id,comment:approveComment})
  //   } 
  //   setShowConfirmPopup(false);
  //   setConfirmAction(null);
  //   if (confirmAction === 'approve') {
  //     setApproveComment('');
  //   } else {
  //     setRejectComment('');
  //   }
  // };

  const handleCancelAction = () => {
    setShowConfirmPopup(false);
    setConfirmAction(null);
    // مسح التعليقات عند الإلغاء
    setApproveComment('');
    setRejectComment('');
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

  const handleSaveEdits = async () => {
    console.log(editedBeneficiary)
    const error = validateEdits();
    if (error) {
      hotToast({type:"error",message:error})
      return;
    }
    setSaveError(null);
    await editReport({beneficiaryData:editedBeneficiary,reportId:id})
    
    // تحديث البيانات المحلية بعد الحفظ الناجح
    if (!reportError && editedBeneficiary) {
      setTimeout(() => {
        setBeneficiary(editedBeneficiary)
      }, 350);
    }
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

  // 1. أضف الدوال الجديدة للأكشنات في أعلى الكومبوننت
  const handleApproveReviewer = async () => {
    console.log('اعتماد من المراجع', beneficiary?.id, approveComment);
    
    // استخدام الدالة الأصلية للاعتماد
    await confirmCurrentReport({reportId:beneficiary?.id,comment:approveComment})
    
    setShowConfirmPopup(false);
    setConfirmAction(null);
    setApproveComment('');
  };
  const handleDeleteReviewer = async () => {
    console.log('حذف من المراجع', beneficiary?.id);
    
    // استخدام الدالة الأصلية للحذف
    await deleteBeneficiary(beneficiary?.id)
    
    setShowConfirmPopup(false);
    setConfirmAction(null);
    setApproveComment('');
  };

  const handleAcceptCommittee = async () => {
    console.log('=== handleAcceptCommittee EXECUTED ===');
    console.log('قبول من اللجنة', beneficiary?.id, approveComment);
    await acceptCommitteeToReport({userId:beneficiary?.id,comment:approveComment})
    
    setShowConfirmPopup(false);
    setConfirmAction(null);
    setApproveComment('');
  };

  const handleRejectCommittee = async () => {
    console.log('=== handleRejectCommittee EXECUTED ===');
    console.log('رفض من اللجنة', beneficiary?.id, rejectComment);
    await rejectCommitteeToReport({userId:beneficiary?.id,comment:rejectComment})
    
    setShowConfirmPopup(false);
    setConfirmAction(null);
    setRejectComment('');
  };

  const handleApproveManager = async () => {
    console.log('اعتماد كلي من المدير', beneficiary?.id);
    if (beneficiary?.id) {
      await acceptManagerReport({userId: beneficiary.id})
    }
    if(acceptManagerError){
      hotToast({type:"error",message:acceptManagerError})
        
      }
   if(isManagerAccept){
    hotToast({type:"success",message:"تم اعتماد المتسفيد كليا"})
    navigate("/dashboard")
    }
    setShowConfirmPopup(false);
    setConfirmAction(null);
    setApproveComment('');
  };

  const handleRejectManager = async () => {
    console.log('رفض كلي من المدير', beneficiary?.id);
    if (beneficiary?.id) {
      await rejectManagerReport({userId: beneficiary.id})
    }
    if(rejectManagerError){
    hotToast({type:"error",message:rejectManagerError})
      
    }
    if(isManagerReject){
    hotToast({type:"success",message:"تم رفض المتسفيد كليا"})
    navigate("/dashboard")
    }
    setShowConfirmPopup(false);
    setConfirmAction(null);
    setRejectComment('');
  };
  // ... existing code ...
  // 2. منطق اختيار الدالة المناسبة عند التأكيد في popup
  const handleConfirmPopup = async () => {
    console.log('handleConfirmPopup called with:', {
      currentAdminRule: currentAdmin?.rule,
      confirmAction: confirmAction
    });
    
    if(currentAdmin?.rule === 'reviewer') {
      console.log(confirmAction)
      if(confirmAction === 'approve') {
        console.log('Calling handleApproveReviewer for reviewer approve');
        return await handleApproveReviewer();
      }
      if(confirmAction === 'reject') {
        console.log('Calling handleDeleteReviewer for reviewer reject/delete');
        return await handleDeleteReviewer();
      }
    }
    if(currentAdmin?.rule === 'committee') {
      if(confirmAction === 'approve') {
        console.log('Calling handleAcceptCommittee for committee approve');
        return await handleAcceptCommittee();
      }
      if(confirmAction === 'reject') {
        console.log('Calling handleRejectCommittee for committee reject');
        return await handleRejectCommittee();
      }
    }
    if(currentAdmin?.rule === 'manager') {
      if(confirmAction === 'approve') {
        console.log('Calling handleApproveManager for manager approve');
        return await handleApproveManager();
      }
      if(confirmAction === 'reject') {
        console.log('Calling handleRejectManager for manager reject');
        return await handleRejectManager();
      }
    }
  };

  // ... existing code ...
  // في زر التأكيد في popup استبدل onClick={handleConfirmAction} بـ onClick={handleConfirmPopup}
  // ... existing code ...

  // زر الحذف المؤقت للمراجع فقط
  const handleTemporaryDelete = () => {
    setShowTempDeletePopup(true);
  };
  const confirmTemporaryDelete = async () => {
    await deleteTemporaryBeneficiary(beneficiary?.id);
    setShowTempDeletePopup(false);
  };

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
      {showConfirmPopup && (
        <div className={styles.confirmPopupOverlay} onClick={handleCancelAction}>
          <div className={styles.confirmPopupContent} onClick={e => e.stopPropagation()}>
            <h3 className={styles.confirmPopupTitle}>
              {confirmAction === 'approve' 
                ? (currentAdmin?.rule === 'committee' ? 'تأكيد  قبول المستفيد' : currentAdmin?.rule === 'manager' ? 'تأكيد الاعتماد الكلي' : 'تأكيد الاعتماد')
                : (currentAdmin?.rule === 'reviewer' ? 'تأكيد الحذف' : currentAdmin?.rule === 'manager' ? 'تأكيد الرفض الكلي' : 'تأكيد الرفض')
              }
            </h3>
            <p className={styles.confirmPopupMessage}>
              {confirmAction === 'approve' 
                ? (currentAdmin?.rule === 'committee'
                    ? 'هل أنت متأكد من قبول هذا المستفيد ؟' 
                    : currentAdmin?.rule === 'manager'
                    ? 'هل أنت متأكد من الاعتماد الكلي لهذا المستفيد؟'
                    : 'هل أنت متأكد من اعتماد هذا المستفيد؟')
                : (currentAdmin?.rule === 'reviewer' 
                    ? 'هل أنت متأكد من حذف هذا المستفيد ؟' 
                    : currentAdmin?.rule === 'manager'
                    ? 'هل أنت متأكد من الرفض الكلي لهذا المستفيد ؟'
                    : 'هل أنت متأكد من رفض هذا المستفيد ؟')
              }
            </p>
            
            {/* حقل التعليقات - يظهر للجنة في جميع الحالات وللمراجع في حالة الاعتماد فقط */}
            {(currentAdmin?.rule === 'committee' || (currentAdmin?.rule === 'reviewer' && confirmAction === 'approve')) && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500', 
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  {currentAdmin?.rule === 'committee' 
                    ? (confirmAction === 'reject' ? 'التعليقات (مطلوب)' : 'التعليقات (اختياري)')
                    : 'التعليقات (اختياري)'
                  }
                </label>
                <textarea
                  value={
                    confirmAction === 'approve' 
                      ? approveComment 
                      : rejectComment
                  }
                  onChange={e => {
                    if (confirmAction === 'approve') {
                      setApproveComment(e.target.value);
                    } else {
                      setRejectComment(e.target.value);
                    }
                  }}
                  placeholder={
                    currentAdmin?.rule === 'committee' 
                      ? (confirmAction === 'reject' 
                          ? 'اكتب سبب الرفض هنا (مطلوب)...' 
                          : 'اكتب تعليقاتك هنا (اختياري)...')
                      : 'اكتب ملاحظاتك هنا (اختياري)...'
                  }
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    direction: 'rtl',
                    textAlign: 'right'
                  }}
                />
                {/* رسالة خطأ للجنة في حالة الرفض بدون تعليقات */}
                {currentAdmin?.rule === 'committee' && confirmAction === 'reject' && !rejectComment.trim() && (
                  <div style={{ 
                    color: '#dc2626', 
                    fontSize: '12px', 
                    marginTop: '4px',
                    fontWeight: '500'
                  }}>
                    يجب كتابة سبب الرفض
                  </div>
                )}
              </div>
            )}
            
            <div className={styles.confirmPopupButtons}>
              <button 
                onClick={async () => await handleConfirmPopup()}
                disabled={confirmLoading || acceptManagerLoading || rejectManagerLoading || (currentAdmin?.rule === 'committee' && confirmAction === 'reject' && !rejectComment.trim())}
                className={`${styles.confirmButton} ${
                  confirmAction === 'approve' ? styles.confirmButtonApprove : styles.confirmButtonReject
                }`}
              >
                {confirmLoading || acceptManagerLoading || rejectManagerLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ 
                      width: '16px', 
                      height: '16px', 
                      border: '2px solid transparent', 
                      borderTop: '2px solid white', 
                      borderRadius: '50%', 
                      animation: 'spin 1s linear infinite' 
                    }}></div>
                    جاري...
                  </div>
                ) : (
                  confirmAction === 'approve' 
                    ? (currentAdmin?.rule === 'committee' ? 'قبول' : currentAdmin?.rule === 'manager' ? 'اعتماد كلي' : 'اعتماد')
                    : (currentAdmin?.rule === 'reviewer' ? 'حذف' : currentAdmin?.rule === 'manager' ? 'رفض كلي' : 'رفض')
                )}
              </button>
              <button 
                onClick={handleCancelAction}
                disabled={confirmLoading}
                className={styles.cancelButton}
              >
                إلغاء
              </button>
            </div>
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
        {/* كارت الإجراءات يظهر فقط إذا كان هناك إجراء متاح لهذا الدور */}
        {(
          (currentAdmin?.rule === 'reviewer' && fullReport?.status === 'under_review') ||
          (currentAdmin?.rule === 'committee' && fullReport?.status === 'under_committee') ||
          (currentAdmin?.rule === 'manager')
        ) && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                <span className={styles.cardIcon}>⚡</span>
                الإجراءات
              </h3>
            </div>
            <div className={styles.actionButtons}>
              {hasEdits && (
                <button 
                  className={styles.saveButton} 
                  onClick={async () => await handleSaveEdits()}
                  disabled={reportLoading}
                >
                  {reportLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '16px', 
                        height: '16px', 
                        border: '2px solid transparent', 
                        borderTop: '2px solid white', 
                        borderRadius: '50%', 
                        animation: 'spin 1s linear infinite' 
                      }}></div>
                      جاري الحفظ...
                    </div>
                  ) : (
                    <>
                      <span className={styles.buttonIcon}>💾</span>
                      <span className={styles.buttonText}>حفظ التعديلات</span>
                    </>
                  )}
                </button>
              )}
              {/* أزرار الإجراءات حسب الدور والحالة */}
              {currentAdmin?.rule === 'reviewer' && fullReport?.status === 'under_review' && (
                <>
                  <button className={styles.approveButton} style={{background:'#22c55e'}} onClick={() => {setConfirmAction('approve'); setShowConfirmPopup(true);}}>
                    <span className={styles.buttonIcon}>✔</span>
                    <span className={styles.buttonText}>اعتماد</span>
                  </button>
                  <button className={styles.rejectButton} style={{background:'#991b1b'}} onClick={() => {setConfirmAction('reject'); setShowConfirmPopup(true);}}>
                    <span className={styles.buttonIcon}>🗑️</span>
                    <span className={styles.buttonText}>حذف</span>
                  </button>
                  <button className={styles.tempDeleteButton} onClick={handleTemporaryDelete} title="حذف مؤقت للمستفيد" disabled={deleteTemporaryLoading}>
                    <span className={styles.buttonIcon}>🗑️</span>
                    <span className={styles.buttonText}>حذف مؤقت</span>
                  </button>
                </>
              )}
              {currentAdmin?.rule === 'committee' && fullReport?.status === 'under_committee' && (
                <>
                  <button className={styles.approveButton} style={{background:'#10b981', color:'#fff'}} onClick={() => {setConfirmAction('approve'); setShowConfirmPopup(true);}}>
                    <span className={styles.buttonIcon}>✔</span>
                    <span className={styles.buttonText}>قبول</span>
                  </button>
                  <button className={styles.rejectButton} style={{background:'#ef4444'}} onClick={() => {setConfirmAction('reject'); setShowConfirmPopup(true);}}>
                    <span className={styles.buttonIcon}>✖</span>
                    <span className={styles.buttonText}>رفض</span>
                  </button>
                </>
              )}
              {currentAdmin?.rule === 'manager' && (
                <>
                  <button className={styles.approveButton} style={{background:'#22c55e'}} onClick={() => {setConfirmAction('approve'); setShowConfirmPopup(true);}}>
                    <span className={styles.buttonIcon}>✔</span>
                    <span className={styles.buttonText}>اعتماد كلي</span>
                  </button>
                  <button className={styles.rejectButton} style={{background:'#ef4444'}} onClick={() => {setConfirmAction('reject'); setShowConfirmPopup(true);}}>
                    <span className={styles.buttonIcon}>✖</span>
                    <span className={styles.buttonText}>رفض كلي</span>
                  </button>
                </>
              )}
            </div>
            {saveError && (
              <div style={{ color: 'red', marginTop: 8, textAlign: 'center' }}>{saveError}</div>
            )}
          </div>
        )}
        {/* {!printing && (
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
        )} */}
      </div>
      {/* Popup حذف مؤقت */}
      {showTempDeletePopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <h4>هل أنت متأكد من حذف المستفيد مؤقتا؟</h4>
            {deleteTemporaryError && <div className={styles.errorMsg}>{deleteTemporaryError}</div>}
            <div className={styles.popupActions}>
              <button onClick={confirmTemporaryDelete} disabled={deleteTemporaryLoading} className={styles.confirmButton}>
                نعم، حذف مؤقت
              </button>
              <button onClick={() => setShowTempDeletePopup(false)} className={styles.cancelButton}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeneficiaryDetailsPage;