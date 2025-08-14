import { useState, useRef, useEffect } from "react";
import styles from "./SignFamily.module.css";
import hotToast from "../../common/hotToast";
import useUpdateUserData from "../../hooks/Auth/update/useUpdateUserData";
import React from "react";
import { FaUser, FaHome, FaUsers, FaCheckCircle } from 'react-icons/fa';
import ProgressSteps from '../../components/ProgressSteps';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// تعريف سنوات وشهور وأيام الهجري
const hijriYears: number[] = Array.from({length: 151}, (_, i) => 1350 + i); // 1350-1500
const hijriMonths: string[] = [
  "محرم", "صفر", "ربيع الأول", "ربيع الآخر", "جمادى الأولى", "جمادى الآخرة", "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"
];
const hijriDays: number[] = Array.from({length: 30}, (_, i) => i + 1);

// الميلادي
const FIXED_CURRENT_YEAR = 2025;
const currentGregorianYear = FIXED_CURRENT_YEAR;
const gregorianYears: number[] = Array.from({length: currentGregorianYear - 1949}, (_, i) => 1950 + i); // 1950-2025
const gregorianMonths: number[] = Array.from({length: 12}, (_, i) => i + 1); // 1-12
const gregorianDays: number[] = Array.from({length: 31}, (_, i) => i + 1); // 1-31

const steps = ["البيانات الشخصية", "بيانات عامة", " بيانات المرافقين"];

type StudyLevel =
  | "رضيع"
  | "ابتدائي"
  | "متوسط"
  | "ثانوي"
  | "جامعي"
  | "متخرج"
  | "غير متعلم";

type Housemate = {
  name: string;
  birthDate: string;
  identityNumber: string;
  gender: "ذكر" | "أنثى";
  kinship: string;
  studyLevel?: StudyLevel;
  studyGrade?: string;
  healthStatus?: "سليم" | "غير سليم";
  disabilityType?: "مريض" | "ذوي احتياجات خاصة";
  dateType?: 'هجري' | 'ميلادي';
};

type Home = {
  homeNickname: string;
  city: string;
  district: string;
  housemates: Housemate[];
  addtionalHomes?: {
    homeNickname: string;
    city: string;
    district: string;
    housemates: Housemate[];
  }[];
};

interface UserData {
  firstName: string;
  secondName: string;
  thirdName: string;
  lastName: string;
  email: string;
  identityNumber: string;
  nationality: string;
  gender: "ذكر" | "أنثى";
  phone: string;
  birthDate: string;
  maritalStatus: string;
  idImagePath: string | File | null;
  cityOfResidence: string;
  jobStatus?: "عاطل" | "موظف";
  healthStatus?: "سليم" | "غير سليم";
  disabilityType?: "مريض" | "ذوي احتياجات خاصة";
  home: Home;
  district?: string;
  housingType?: "ملك" | "إيجار";
  rentAmount?: string;
  familyCardFile?: string | File | null;
  rentContractFile?: File | null;
  incomeSources?: { [key: string]: string };
  bankName?: string;
  ibanImage?: string | File | null;
  numberOfFacilities?: number;
  numberOfMales?: number;
  housemate?: Housemate[];
  birthDatetype?: string;
}

// تعريف نوع مصدر الدخل
interface IncomeSource {
  sourceType: string;
  sourceAmount: string;
  sourceImage: File | null;
}

// دالة تقريبية لتحويل السنة الميلادية إلى هجرية والعكس
function getCurrentHijriYear() {
  // معادلة تقريبية: الهجري = الميلادي - 622 + (الميلادي-622)/33
  const gYear = FIXED_CURRENT_YEAR;
  return Math.floor((gYear - 622) + ((gYear - 622) / 33));
}

// --- LocalStorage Keys ---
const FORM_KEY = 'signFamilyFormData';
const COMPANIONS_KEY = 'signFamilyCompanions';
const COMPANIONS_COUNT_KEY = 'signFamilyCompanionsCount';
const MALE_COUNT_KEY = 'signFamilyMaleCount';
const FAMILY_CARD_KEY = 'signFamilyFamilyCardFile';
const STEP_KEY = 'signFamilyStep';
const DATETYPE_KEY = 'signFamilyDateType';
const BIRTHDATE_KEY = 'signFamilyBirthDate';

// LocalStorage Keys للبيانات المؤقتة (التعديلات الحالية) - لها الأولوية
const TEMP_COMPANIONS_KEY = 'signFamilyTempCompanions';
const TEMP_COMPANIONS_COUNT_KEY = 'signFamilyTempCompanionsCount';
const TEMP_MALE_COUNT_KEY = 'signFamilyTempMaleCount';

// دالة التحقق التفصيلية مع رسائل مخصصة
const fieldLabels: {[key: string]: string} = {
  firstName: "الاسم الأول",
  secondName: "الاسم الثاني",
  thirdName: "الاسم الثالث",
  lastName: "اسم العائلة",
  phone: "رقم الجوال",
  gender: "الجنس",
  birthDate: "تاريخ الميلاد",
  maritalStatus: "الحالة الاجتماعية",
  nationality: "الجنسية",
  identityNumber: "رقم الهوية",
  cityOfResidence: "مدينة السكن",
  jobStatus: "المهنة",
  healthStatus: "الحالة الصحية",
  disabilityType: "نوع الإعاقة",
  district: "الحي",
  housingType: "نوع السكن",
  rentAmount: "مبلغ الإيجار",
  bankName: "البنك"
};

// دالة التحقق من المرحلة الأولى (البيانات الشخصية)
function validateStep1(formData: UserData, dateType: string) {
  if (!formData.firstName) return { valid: false, message: 'يرجى ملء الاسم الأول' };
  if (!formData.secondName) return { valid: false, message: 'يرجى ملء الاسم الثاني' };
  if (!formData.thirdName) return { valid: false, message: 'يرجى ملء الاسم الثالث' };
  if (!formData.lastName) return { valid: false, message: 'يرجى ملء اسم العائلة' };
  if (!formData.email) return { valid: false, message: 'يرجى ملء البريد الإلكتروني' };
  if (!formData.gender) return { valid: false, message: 'يرجى اختيار الجنس' };
  if (!formData.nationality) return { valid: false, message: 'يرجى ملء الجنسية' };
  if (!formData.identityNumber) return { valid: false, message: 'يرجى ملء رقم الهوية' };
  
  // التحقق من وجود صورة الهوية (إما ملف جديد أو صورة محفوظة مسبقاً)
  const userStr = localStorage.getItem('user');
  let userIdImagePath = '';
  if (userStr) {
    try {
      const userObj = JSON.parse(userStr);
      if (userObj.idImagePath) userIdImagePath = userObj.idImagePath;
    } catch {}
  }
  if (!formData.idImagePath && !userIdImagePath) return { valid: false, message: 'يرجى إرفاق صورة الهوية' };
  if (!formData.maritalStatus) return { valid: false, message: 'يرجى اختيار الحالة الاجتماعية' };
  if (!formData.birthDate) return { valid: false, message: 'يرجى ملء تاريخ الميلاد' };
  if (!dateType) return { valid: false, message: 'يرجى اختيار نوع تاريخ الميلاد' };
  if (!formData.phone) return { valid: false, message: 'يرجى ملء رقم الجوال' };
  if (!formData.jobStatus) return { valid: false, message: 'يرجى اختيار المهنة' };
  if (!formData.healthStatus) return { valid: false, message: 'يرجى اختيار الحالة الصحية' };
  if (formData.healthStatus === 'غير سليم' && !formData.disabilityType) return { valid: false, message: 'يرجى اختيار نوع الإعاقة' };
  
  return { valid: true };
}

// دالة التحقق من المرحلة الثانية (بيانات عامة)
function validateStep2(formData: UserData, incomeSources: IncomeSource[]) {
  if (!formData.cityOfResidence) return { valid: false, message: 'يرجى ملء مدينة السكن' };
  if (!formData.district) return { valid: false, message: 'يرجى ملء الحي' };
  if (!formData.housingType) return { valid: false, message: 'يرجى اختيار نوع السكن' };
  if (formData.housingType === 'إيجار') {
    if (!formData.rentAmount) return { valid: false, message: 'يرجى ملء مبلغ الإيجار' };
    
    // التحقق من وجود عقد الإيجار (إما ملف جديد أو صورة محفوظة مسبقاً)
    const userStr = localStorage.getItem('user');
    let userRentImage = '';
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj.rentImage) userRentImage = userObj.rentImage;
      } catch {}
    }
    if (!formData.rentContractFile && !userRentImage) return { valid: false, message: 'يرجى إرفاق صورة عقد الإيجار' };
  }
  // مصادر الدخل
  if (!incomeSources || incomeSources.length === 0) return { valid: false, message: 'يرجى اختيار مصدر دخل واحد على الأقل' };
  for (let i = 0; i < incomeSources.length; i++) {
    const src = incomeSources[i];
    if (!src.sourceAmount) return { valid: false, message: `يرجى ملء مبلغ الدخل لمصدر الدخل (${src.sourceType})` };
    
    // التحقق من وجود صورة الدخل (إما ملف جديد أو صورة محفوظة مسبقاً)
    const userStr = localStorage.getItem('user');
    let userIncomeImage = '';
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj.incomeSources && Array.isArray(userObj.incomeSources)) {
          const userIncomeSource = userObj.incomeSources.find((s: any) => s.sourceType === src.sourceType);
          if (userIncomeSource && userIncomeSource.sourceImage) {
            userIncomeImage = userIncomeSource.sourceImage;
          }
        }
      } catch {}
    }
    if (!src.sourceImage && !userIncomeImage) return { valid: false, message: `يرجى إرفاق صورة الدخل لمصدر الدخل (${src.sourceType})` };
  }
  if (!formData.bankName) return { valid: false, message: 'يرجى اختيار البنك' };
  
  // التحقق من وجود صورة الآيبان (إما ملف جديد أو صورة محفوظة مسبقاً)
  const userStr = localStorage.getItem('user');
  let userIbanImage = '';
  if (userStr) {
    try {
      const userObj = JSON.parse(userStr);
      if (userObj.ibanImage) userIbanImage = userObj.ibanImage;
    } catch {}
  }
  if (!formData.ibanImage && !userIbanImage) return { valid: false, message: 'يرجى إرفاق صورة الآيبان' };
  
  return { valid: true };
}

// دالة التحقق من المرحلة الثالثة (بيانات المرافقين)
function validateStep3(formData: UserData, companions: any[], companionsCount: number) {
  // شرط كارت العائلة إذا يوجد مرافقين
  if (companionsCount > 0) {
    // التحقق من وجود كارت العائلة (إما ملف جديد أو صورة محفوظة مسبقاً)
    const userStr = localStorage.getItem('user');
    let userFamilyCardImage = '';
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj.familyCardFile) userFamilyCardImage = userObj.familyCardFile;
      } catch {}
    }
    if (!formData.familyCardFile && !userFamilyCardImage) {
      return { valid: false, message: 'يرجى إرفاق كارت العائلة' };
    }
  }
  
  // التحقق من بيانات المرافقين إذا كان عددهم أكبر من 0
  if (companionsCount > 0) {
    for (let i = 0; i < companionsCount; i++) {
      const companion = companions[i];
      if (!companion.name) return { valid: false, message: `يرجى ملء الاسم الرباعي للمرافق ${i + 1}` };
      // دمج "بن" و "عبد" مع الكلمة التالية في الأجزاء
      let nameParts = companion.name.trim().split(/\s+/).filter((name: string) => name !== "");
      const finalNameParts = [];
      for (let j = 0; j < nameParts.length; j++) {
        if ((nameParts[j] === 'بن' || nameParts[j] === 'عبد') && j + 1 < nameParts.length) {
          finalNameParts.push(nameParts[j] + ' ' + nameParts[j + 1]);
          j++; // تخطي الكلمة التالية لأنها تم دمجها
        } else {
          finalNameParts.push(nameParts[j]);
        }
      }
      if (finalNameParts.length < 4) return { valid: false, message: `اسم المرافق ${i + 1} يجب أن يكون رباعي` };
      
      const idValue = (companion?.identityNumber && (String(companion?.identityNumber))) || (companion.id && companion.id.trim());
      if (!idValue) return { valid: false, message: `يرجى ملء رقم الهوية للمرافق ${i + 1}` };
      if (!companion.birthDate) return { valid: false, message: `يرجى ملء تاريخ الميلاد للمرافق ${i + 1}` };
      if (!companion.dateType) return { valid: false, message: `يرجى اختيار نوع تاريخ الميلاد للمرافق ${i + 1}` };
      if (companion.studyLevel && !['جامعي','رضيع','متخرج','غير متعلم'].includes(companion.studyLevel as string) && !companion.studyGrade) {
        return { valid: false, message: `يرجى اختيار الصف للمرافق ${i + 1}` };
      }
      if (!companion.healthStatus) return { valid: false, message: `يرجى اختيار الحالة الصحية للمرافق ${i + 1}` };
      if (companion.healthStatus === 'غير سليم' && !companion.disabilityType) {
        return { valid: false, message: `يرجى اختيار نوع الإعاقة للمرافق ${i + 1}` };
      }
      if (!companion.kinship) return { valid: false, message: `يرجى ملء صلة القرابة للمرافق ${i + 1}` };
    }
  }
  
  return { valid: true };
}

// دالة التحقق الكاملة (للإرسال النهائي)
function validateForm(formData: UserData, companions: any[], incomeSources: IncomeSource[], dateType: string, companionsCount: number) {
  const step1Validation = validateStep1(formData, dateType);
  if (!step1Validation.valid) return step1Validation;
  
  const step2Validation = validateStep2(formData, incomeSources);
  if (!step2Validation.valid) return step2Validation;
  
  const step3Validation = validateStep3(formData, companions, companionsCount);
  if (!step3Validation.valid) return step3Validation;
  
  return { valid: true };
}

const SignFamily = () => {
  const [companions, setCompanions] = useState<any[]>([]);
  const [showAlreadyRegistered, setShowAlreadyRegistered] = useState(false);
  const userData = useSelector((state:any)=>state.user.user)
  const isLoading = useSelector((state:any)=>state.user.isLoading)
  
  // Safely parse signFamilyFormData from localStorage, fallback to empty object if not present or invalid
  const singfamily = (() => {
    try {
      const data = localStorage.getItem("signFamilyFormData");
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  })();
   console.log(singfamily.facilitiesInfo)
  const navigate = useNavigate()
  
  useEffect(() => {
    // لا تتحقق من userData إلا بعد انتهاء التحميل
    if(!isLoading && !userData){
      navigate("/login")
    }
  }, [userData, isLoading]);

  // التحقق من hasAFamily عند تحميل الصفحة
  useEffect(() => {
    if (!isLoading && userData) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          if (userObj.hasAFamily === true) {
            setShowAlreadyRegistered(true);
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
  }, [userData, isLoading]);

  const {updateUserData} = useUpdateUserData()
  const [step, setStep] = useState(() => {
    const saved = localStorage.getItem(STEP_KEY);
    return saved ? Number(saved) : 1;
  });
  const [animDir, setAnimDir] = useState<"left" | "right">("right");
  const [isMobile, setIsMobile] = useState(false);
  const [dateType, setDateType] = useState<'هجري' | 'ميلادي'>(() => {
    const saved = localStorage.getItem(DATETYPE_KEY);
    if (saved === 'هجري' || saved === 'ميلادي') return saved;
    return 'هجري';
  });
  const [age, setAge] = useState("");
  const currentHijriYear = getCurrentHijriYear();
  const [companionsCount, setCompanionsCount] = useState<number>(0);
  const [maleCount, setMaleCount] = useState<number>(0);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>(() => {
    // جلب من user في localStorage أولاً
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        // استخدم فقط incomeSources (الجمع)
        if (userObj?.incomeSources && Array.isArray(userObj.incomeSources)) {
          return userObj.incomeSources;
        }
      } catch {}
    }
    // ثم من signFamilyIncomeSources
    const saved = localStorage.getItem('signFamilyIncomeSources');
    if (saved) return JSON.parse(saved);
    // ثم من userData
    if (userData?.incomeSources && Array.isArray(userData.incomeSources)) {
      return userData.incomeSources;
    }
    return [];
  });
  const [incomeFiles, setIncomeFiles] = useState<{ [key: string]: File | null }>({});

  const [formData, setFormData] = useState<UserData>(() => {
    const saved = localStorage.getItem(FORM_KEY);
    if (saved) return { ...JSON.parse(saved) };
    return {
      firstName: userData?.firstName  || "",
      secondName: userData?.secondName || "",
      thirdName: userData?.thirdName || "",
      lastName: userData?.lastName || "",
      email: userData?.email || "",
      identityNumber: userData?.identityNumber || "",
      nationality: userData?.nationality || "",
      gender: userData?.gender || "ذكر",
      phone: userData?.phone || "",
      birthDate: userData?.birthDate ? new Date(userData.birthDate).toISOString().split('T')[0] : "",
      maritalStatus: userData?.maritalStatus || "",
      idImagePath: userData?.idImagePath || null,
      cityOfResidence: userData?.cityOfResidence || "",
      jobStatus: userData?.jobStatus || undefined,
      healthStatus: userData?.healthStatus || undefined,
      disabilityType: userData?.disabilityType || undefined,
      home: {
        homeNickname: userData?.home?.homeNickname || "",
        city: userData?.home?.city || "",
        district: userData?.home?.district || "",
        housemates: userData?.home?.housemates?.map((housemate: Housemate) => ({
          name: housemate.name || "",
          identityNumber: housemate.identityNumber || "",
          birthDate: housemate.birthDate ? new Date(housemate.birthDate).toISOString().split('T')[0] : "",
          gender: housemate.gender || "ذكر",
          kinship: housemate.kinship || "",
          studyLevel: housemate.studyLevel,
          studyGrade: housemate.studyGrade,
          healthStatus: housemate.healthStatus,
          disabilityType: housemate.disabilityType,
          dateType: housemate.dateType
        })) || [],
        addtionalHomes: userData?.home?.addtionalHomes?.map((home: Home) => ({
          homeNickname: home.homeNickname || "",
          city: home.city || "",
          district: home.district || "",
          housemates: home.housemates?.map((housemate: Housemate) => ({
            name: housemate.name || "",
            identityNumber: housemate.identityNumber || "",
            birthDate: housemate.birthDate ? new Date(housemate.birthDate).toISOString().split('T')[0] : "",
            gender: housemate.gender || "ذكر",
            kinship: housemate.kinship || "",
            studyLevel: housemate.studyLevel,
            studyGrade: housemate.studyGrade,
            healthStatus: housemate.healthStatus,
            disabilityType: housemate.disabilityType,
            dateType: housemate.dateType
          })) || []
        })) || [],
      },
      district: userData?.district || "",
      housingType: userData?.housingType || undefined,
      rentAmount: userData?.rentAmount || "",
      rentContractFile: null,
      familyCardFile: userData?.familyCardFile || null,
      incomeSources: userData?.incomeSources || [],
      bankName: userData?.bankName || "",
      ibanImage: null,
    };
  });
  
 
  const formContainerRef = useRef<HTMLDivElement>(null);
  const [fixedHeight, setFixedHeight] = useState<number | undefined>(undefined);

  const stepIcons = [<FaUser />, <FaHome />, <FaUsers />];

  // --- Load from localStorage on mount ---
  useEffect(() => {
    // step
    const savedStep = localStorage.getItem(STEP_KEY);
    if (savedStep) setStep(Number(savedStep));
    // dateType
    const savedDateType = localStorage.getItem(DATETYPE_KEY);
    if (savedDateType === 'هجري' || savedDateType === 'ميلادي') setDateType(savedDateType);
    // formData
    const savedForm = localStorage.getItem(FORM_KEY);
    if (savedForm) {
      try {
        setFormData(prev => ({ ...prev, ...JSON.parse(savedForm) }));
      } catch {}
    }
    // companions - اقرأ من localStorage المؤقت أولاً، ثم من localStorage العادي، ثم من user
    const tempCompanions = localStorage.getItem(TEMP_COMPANIONS_KEY);
    const savedCompanions = localStorage.getItem(COMPANIONS_KEY);
    if (tempCompanions) {
      try {
        const parsedCompanions = JSON.parse(tempCompanions);
        if (Array.isArray(parsedCompanions) && parsedCompanions.length > 0) {
          // ضمان التوافق بين id و identityNumber
          const normalizedCompanions = parsedCompanions.map((companion: any) => ({
            ...companion,
            identityNumber: companion.identityNumber || companion.id || "",
            id: companion.identityNumber || companion.id || ""
          }));
          setCompanions(normalizedCompanions);
          setCompanionsCount(normalizedCompanions.length);
        }
      } catch {}
    } else if (savedCompanions) {
      try {
        const parsedCompanions = JSON.parse(savedCompanions);
        if (Array.isArray(parsedCompanions) && parsedCompanions.length > 0) {
          // ضمان التوافق بين id و identityNumber
          const normalizedCompanions = parsedCompanions.map((companion: any) => ({
            ...companion,
            identityNumber: companion.identityNumber || companion.id || "",
            id: companion.identityNumber || companion.id || ""
          }));
          setCompanions(normalizedCompanions);
          setCompanionsCount(normalizedCompanions.length);
        } else {
          // إذا companions فاضي، اقرأ من user
          const userStr = localStorage.getItem('user');
          if (userStr) {
            try {
              const userObj = JSON.parse(userStr);
              if (Array.isArray(userObj.facilitiesInfo) && userObj.facilitiesInfo.length > 0) {
                // ضمان التوافق بين id و identityNumber
                const normalizedCompanions = userObj.facilitiesInfo.map((companion: any) => ({
                  ...companion,
                  identityNumber: companion.identityNumber || companion.id || "",
                  id: companion.identityNumber || companion.id || ""
                }));
                setCompanions(normalizedCompanions);
                setCompanionsCount(userObj.numberOfFacilities || userObj.facilitiesInfo.length);
              }
            } catch {}
          }
        }
      } catch {}
    } else {
      // إذا لا يوجد companions محفوظ، اقرأ من user
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          if (Array.isArray(userObj.facilitiesInfo) && userObj.facilitiesInfo.length > 0) {
            // ضمان التوافق بين id و identityNumber
            const normalizedCompanions = userObj.facilitiesInfo.map((companion: any) => ({
              ...companion,
              identityNumber: companion.identityNumber || companion.id || "",
              id: companion.identityNumber || companion.id || ""
            }));
            setCompanions(normalizedCompanions);
            setCompanionsCount(userObj.numberOfFacilities || userObj.facilitiesInfo.length);
          }
        } catch {}
      }
    }
    // companionsCount - اقرأ من localStorage المؤقت أولاً
    const tempCount = localStorage.getItem(TEMP_COMPANIONS_COUNT_KEY);
    const savedCount = localStorage.getItem(COMPANIONS_COUNT_KEY);
    if (tempCount && Number(tempCount) > 0) {
      setCompanionsCount(Number(tempCount));
    } else if (savedCount && Number(savedCount) > 0) {
      setCompanionsCount(Number(savedCount));
    } else {
      // إذا لا يوجد companionsCount محفوظ أو يساوي 0، اقرأ من user
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          // استخدم numberOfFacilities إذا كان موجود وأكبر من 0، وإلا استخدم طول facilitiesInfo
          if (typeof userObj.numberOfFacilities === 'number' && userObj.numberOfFacilities > 0) {
            setCompanionsCount(userObj.numberOfFacilities);
          } else if (Array.isArray(userObj.facilitiesInfo) && userObj.facilitiesInfo.length > 0) {
            setCompanionsCount(userObj.facilitiesInfo.length);
          }
        } catch {}
      }
    }
    // maleCount - اقرأ من localStorage المؤقت أولاً
    const tempMale = localStorage.getItem(TEMP_MALE_COUNT_KEY);
    const savedMale = localStorage.getItem(MALE_COUNT_KEY);
    if (tempMale) {
      setMaleCount(Number(tempMale));
    } else if (savedMale) {
      setMaleCount(Number(savedMale));
    } else {
      // إذا لا يوجد maleCount محفوظ، اقرأ من user
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          if (typeof userObj.numberOfMales === 'number') {
            setMaleCount(userObj.numberOfMales);
          }
        } catch {}
      }
    }
    // incomeSources
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj?.incomeSources && Array.isArray(userObj.incomeSources)) {
          setIncomeSources(userObj.incomeSources);
        }
      } catch {}
    }
  }, []);

  // عند أول تحميل: إذا كانت بيانات المرافقين موجودة في signFamilyFormData، عبئها في companions
  useEffect(() => {
    if (
      Array.isArray(singfamily.facilitiesInfo) &&
      singfamily.facilitiesInfo.length > 0 &&
      (!companions || companions.length === 0)
    ) {
      // تحويل identityNumber إلى id
      const companionsWithId = singfamily.facilitiesInfo.map((c: any) => ({
        ...c,
        id: c.identityNumber || c.id || ""
      }));
      setCompanions(companionsWithId);
      setCompanionsCount(singfamily.facilitiesInfo.length);
    }
  }, []);

  // --- Save to localStorage on change ---
  useEffect(() => {
    localStorage.setItem(FORM_KEY, JSON.stringify(formData));
    localStorage.setItem(BIRTHDATE_KEY, formData.birthDate || "");
  }, [formData]);
  useEffect(() => {
    localStorage.setItem(COMPANIONS_KEY, JSON.stringify(companions));
    // حفظ في localStorage المؤقت (له الأولوية)
    localStorage.setItem(TEMP_COMPANIONS_KEY, JSON.stringify(companions));
    // تحديث user.facilitiesInfo في localStorage فورًا
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        userObj.facilitiesInfo = companions;
        localStorage.setItem('user', JSON.stringify(userObj));
      } catch {}
    }
  }, [companions]);
  useEffect(() => {
    localStorage.setItem(COMPANIONS_COUNT_KEY, companionsCount.toString());
    // حفظ في localStorage المؤقت (له الأولوية)
    localStorage.setItem(TEMP_COMPANIONS_COUNT_KEY, companionsCount.toString());
    // تحديث user.numberOfFacilities في localStorage فورًا
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        userObj.numberOfFacilities = companionsCount;
        localStorage.setItem('user', JSON.stringify(userObj));
      } catch {}
    }
  }, [companionsCount]);
  useEffect(() => {
    localStorage.setItem(MALE_COUNT_KEY, maleCount.toString());
    // حفظ في localStorage المؤقت (له الأولوية)
    localStorage.setItem(TEMP_MALE_COUNT_KEY, maleCount.toString());
    // تحديث user.numberOfMales في localStorage فورًا
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        userObj.numberOfMales = maleCount;
        localStorage.setItem('user', JSON.stringify(userObj));
      } catch {}
    }
  }, [maleCount]);
  useEffect(() => {
    if (
      formData.familyCardFile &&
      typeof formData.familyCardFile === 'object' &&
      formData.familyCardFile !== null &&
      'name' in formData.familyCardFile
    ) {
      localStorage.setItem(FAMILY_CARD_KEY, (formData.familyCardFile as File).name);
    } else {
      localStorage.removeItem(FAMILY_CARD_KEY);
    }
  }, [formData.familyCardFile]);
  useEffect(() => {
    localStorage.setItem(STEP_KEY, step.toString());
  }, [step]);
  useEffect(() => {
    localStorage.setItem(DATETYPE_KEY, dateType);
  }, [dateType]);
  useEffect(() => {
    localStorage.setItem('signFamilyIncomeSources', JSON.stringify(incomeSources));
  }, [incomeSources]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 991);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // حساب السن تلقائيًا عند تغيير التاريخ أو نوع التاريخ
    if (formData.birthDate) {
      let ageNum = 0;
      if (dateType === 'ميلادي') {
        const birthDateObj = new Date(formData.birthDate);
        const [yearStr, monthStr, dayStr] = formData.birthDate.split('-');
        const year = Number(yearStr);
        const month = Number(monthStr);
        const day = Number(dayStr);
        if (!yearStr || !monthStr || !dayStr) return;
        const todayYear = FIXED_CURRENT_YEAR;
        const todayMonth = 7; // أغسطس (شهر 8، صفر-مبني)
        const todayDay = 7;
        ageNum = todayYear - birthDateObj.getFullYear();
        const m = todayMonth - birthDateObj.getMonth();
        if (m < 0 || (m === 0 && todayDay < birthDateObj.getDate())) {
          ageNum--;
        }
        setAge(ageNum > 0 ? ageNum.toString() : "");
      } else {
        // هجري: birthDate بصيغة yyyy-mm-dd
        const [hYear] = formData.birthDate.split('-').map(Number);
        if (hYear && !isNaN(hYear)) {
          ageNum = currentHijriYear - hYear;
          setAge(ageNum > 0 ? ageNum.toString() : "");
        } else {
          setAge("");
        }
      }
    } else {
      setAge("");
    }
  }, [formData.birthDate, dateType, currentHijriYear]);

  // دالة لحساب العمر
  const calculateAge = (birthDate: string, dateType: string) => {
    if (!birthDate || !dateType) return '';

    const parts = birthDate.split('-');
    if (parts.length < 3) return '';
    const [yearStr, monthStr, dayStr] = parts;
    if (!yearStr || !monthStr || !dayStr) return '';
    const year = Number(yearStr);
    const month = Number(monthStr);
    const day = Number(dayStr);

    // تحقق أن كل جزء رقم صحيح وموجب
    if (
      (dateType === 'ميلادي' && (
        !Number.isInteger(year) || year < 1900 || year > FIXED_CURRENT_YEAR ||
        !Number.isInteger(month) || month < 1 || month > 12 ||
        !Number.isInteger(day) || day < 1 || day > 31
      )) ||
      (dateType === 'هجري' && (
        !Number.isInteger(year) || year < 1300 || year > getCurrentHijriYear() ||
        !Number.isInteger(month) || month < 1 || month > 12 ||
        !Number.isInteger(day) || day < 1 || day > 30
      ))
    ) {
      return '';
    }

    let years = 0, months = 0, days = 0;

    if (dateType === 'ميلادي') {
      const birth = new Date(year, month - 1, day);
      const today = new Date(FIXED_CURRENT_YEAR, 7, 7); // أغسطس (شهر 8 = index 7)، يوم 7
      if (birth > today) return 'عمر غير صالح';
      if (birth > today) return '';
      years = today.getFullYear() - birth.getFullYear();
      months = today.getMonth() - birth.getMonth();
      days = today.getDate() - birth.getDate();
      if (days < 0) {
        months--;
        // احسب عدد الأيام في الشهر السابق
        const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += prevMonth.getDate();
      }
      if (months < 0) {
        years--;
        months += 12;
      }
    } else {
      // هجري: نفس المنطق لكن بدون تحويل حقيقي للتقويم، فقط طرح مباشر
      const hijriNow = 1447; // السنة الهجرية الحالية ثابتة
      const hijriMonth = 1;
      const hijriDay = 13;
      // تحقق المستقبل في الهجري
      if (
        year > hijriNow ||
        (year === hijriNow && month > hijriMonth) ||
        (year === hijriNow && month === hijriMonth && day > hijriDay)
      ) {
        return 'عمر غير صالح';
      }
      years = hijriNow - year;
      months = hijriMonth - month;
      days = hijriDay - day;
      if (days < 0) {
        months--;
        days += 30;
      }
      if (months < 0) {
        years--;
        months += 12;
      }
    }
    let result = '';
    if (years > 0) result += `${years} سنة`;
    if (months > 0) result += (result ? '، ' : '') + `${months} شهر`;
    if (days > 0) result += (result ? '، ' : '') + `${days} يوم`;
    if (!result) result = 'أقل من يوم';
    return result;
  };

  // تحديث العمر للمرافقين عند تغيير أي تاريخ
  useEffect(() => {
    console.log('تحديث العمر للمرافقين:', companions);
    setCompanions(prev => {
      const updatedCompanions = prev.map(companion => {
        const calculatedAge = calculateAge(companion.birthDate, companion.dateType);
        console.log(`المرافق: ${companion.name}, تاريخ الميلاد: ${companion.birthDate}, نوع التاريخ: ${companion.dateType}, العمر المحسوب: ${calculatedAge}`);
        return {
          ...companion,
          age: calculatedAge
        };
      });
      console.log('المرافقين المحدثين:', updatedCompanions);
      return updatedCompanions;
    });
  }, [companionsCount, dateType]); // تغيير dependencies لتجنب الحلقة اللانهائية

  // useEffect منفصل لحساب العمر عند تغيير التاريخ
  useEffect(() => {
    const hasBirthDate = companions.some(companion => companion.birthDate && companion.dateType);
    if (hasBirthDate) {
      console.log('إعادة حساب العمر بسبب تغيير التاريخ');
      setCompanions(prev => 
        prev.map(companion => ({
          ...companion,
          age: calculateAge(companion.birthDate, companion.dateType)
        }))
      );
    }
  }, [companions.map(c => `${c.birthDate}-${c.dateType}`).join(',')]); // مراقبة تغييرات التاريخ

  // إضافة كروت فارغة جديدة عند زيادة عدد المرافقين
  useEffect(() => {
    if (companionsCount > companions.length) {
      const newCompanions = [...companions];
      for (let i = companions.length; i < companionsCount; i++) {
        newCompanions.push({
          name: '',
          id: '',
          identityNumber: '', // إضافة identityNumber للتوافق
          birthDate: '',
          dateType: 'هجري',
          age: '',
          studyLevel: '',
          studyGrade: '',
          healthStatus: '',
          disabilityType: '',
          kinship: ''
        });
      }
      setCompanions(newCompanions);
    } else if (companionsCount < companions.length) {
      setCompanions(companions.slice(0, companionsCount));
    }
  }, [companionsCount]);

  useEffect(() => {
    if (userData) {
      setFormData({
        ...userData,
        // أي تحويلات إضافية تحتاجها هنا
      });
    }
  }, [userData]);

  useEffect(() => {
    if (userData?.facilitiesInfo && Array.isArray(userData.facilitiesInfo)) {
      setCompanions(userData.facilitiesInfo);
    }
  }, [userData]);

  // عند تحميل بيانات userData لا تعيد تعيين dateType إلى 'هجري' تلقائياً
  useEffect(() => {
    if (userData) {
      setFormData({
        ...userData,
        // أي تحويلات إضافية تحتاجها هنا
      });
      // لا تعيد تعيين dateType هنا! فقط إذا كان موجود في userData أو localStorage
      // إذا أردت استرجاع dateType من userData:
      if (userData.birthDatetype && (userData.birthDatetype === 'هجري' || userData.birthDatetype === 'ميلادي')) {
        setDateType(userData.birthDatetype);
      }
    }
  }, [userData]);

  const handleSubmit = async () => {
    // تحقق من صحة البيانات أولاً برسالة دقيقة
    const validation = validateForm(formData, companions, incomeSources, dateType, companionsCount);
    if (!validation.valid) {
      hotToast({ type: "error", message: validation.message || "حدث خطأ غير متوقع" });
      return;
    }

    // لوج توضيحي لقيمة dateType عند الإرسال
    console.log("[إرسال المستفيد الرئيسي] نوع التاريخ:", dateType);
    console.log("[إرسال المستفيد الرئيسي] قيمة birthDate:", formData.birthDate);

    // تحقق أن birthDate متوافقة مع نوع التاريخ
    if (dateType === 'ميلادي') {
      // تحقق أن السنة في الميلادي ضمن النطاق الصحيح
      const [year, month, day] = (formData.birthDate || '').split('-');
      if (!year || !month || !day || Number(year) < 1950 || Number(year) > FIXED_CURRENT_YEAR) {
        hotToast({ type: "error", message: "يرجى اختيار تاريخ ميلاد ميلادي صحيح" });
        return;
      }
    } else if (dateType === 'هجري') {
      const [year, month, day] = (formData.birthDate || '').split('-');
      if (!year || !month || !day || Number(year) < 1350 || Number(year) > 1447) {
        hotToast({ type: "error", message: "يرجى اختيار تاريخ ميلاد هجري صحيح" });
        return;
      }
    }

    // إنشاء FormData وإضافة البيانات
    const formDataToSend = new FormData();

    // أضف بيانات المرافقين مباشرة في housemate (فقط الحقول المطلوبة)
    const housemateToSend = companions.map((h: any) => {
      const base = {
        name: String(h.name ?? ''),
        identityNumber: String(h.identityNumber ?? h.id ?? ''),
        birthDate: String(h.birthDate ?? ''),
        kinship: String(h.kinship ?? ''),
        dateType: String(h.dateType ?? ''),
        studyLevel: String(h.studyLevel ?? ''),
        healthStatus: String(h.healthStatus ?? ''),
        disabilityType: String(h.disabilityType ?? '')
      };
      if (h.studyLevel && h.studyLevel !== 'جامعي') {
        return { ...base, studyGrade: String(h.studyGrade ?? '') };
      }
      return base;
    });
    formDataToSend.append('housemate', JSON.stringify(housemateToSend));
    // أضف عدد المرافقين وعدد الذكور مع الفورم بالأسماء المطلوبة
    formDataToSend.append('numberOfFacilities', companionsCount.toString());
    formDataToSend.append('numberOfMales', maleCount.toString());

    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'home') {
        // لا ترسل home نهائيًا
        return;
      } else if (key === 'birthDatetype') {
        // تجاهل birthDatetype من formData/userData، سنضيفها يدويًا لاحقًا
        return;
      } else if (key === 'idImagePath' && value instanceof File) {
        formDataToSend.append('idImagePath', value);
      } else if (key === 'familyCardFile' && value instanceof File) {
        formDataToSend.append('familyCardFile', value);
      } else if (key === 'rentContractFile' && value instanceof File) {
        formDataToSend.append('rentContractFile', value);
      } else if (key === 'ibanImage' && value instanceof File) {
        formDataToSend.append('ibanImage', value);
      } else if (key !== 'incomeSources') {
        // فقط أضف إذا القيمة ليست undefined أو null أو File
        if (typeof value === 'string') {
          formDataToSend.append(key, value);
        } else if (typeof value === 'number') {
          formDataToSend.append(key, value.toString());
        }
      }
    });
    // أضف birthDatetype مع البيانات مرة واحدة فقط
    formDataToSend.append('birthDatetype', dateType);

    // تجهيز incomeSources كمصفوفة كاملة (بما في ذلك الصور)
    const incomeSourcesData = incomeSources.map((src, idx) => {
      let sourceImagePath = '';
      if (src.sourceImage && src.sourceImage instanceof File) {
        sourceImagePath = src.sourceImage.name;
      } else if (typeof src.sourceImage === 'string') {
        sourceImagePath = src.sourceImage;
      }
      return {
        sourceType: src.sourceType,
        sourceAmount: src.sourceAmount,
        sourceImage: sourceImagePath
      };
    });
    formDataToSend.append('incomeSources', JSON.stringify(incomeSourcesData));
    // أضف كل صورة باسم incomeSources[<index>][sourceImage] مع sourceType
    incomeSources.forEach((src, idx) => {
      if (src.sourceImage && src.sourceType) {
        formDataToSend.append(`incomeSources[${idx}][sourceImage]`, src.sourceImage);
        formDataToSend.append(`incomeSources[${idx}][sourceType]`, src.sourceType);
      }
    });

    try {
      const result = await updateUserData(formDataToSend);
      if (result.success) {
        hotToast({ type: "success", message: result.message as string });
        // حذف البيانات من localStorage عند النجاح
        localStorage.removeItem(FORM_KEY);
        localStorage.removeItem(COMPANIONS_KEY);
        localStorage.removeItem(COMPANIONS_COUNT_KEY);
        localStorage.removeItem(MALE_COUNT_KEY);
        localStorage.removeItem(FAMILY_CARD_KEY);
        localStorage.removeItem(DATETYPE_KEY);
        localStorage.removeItem(BIRTHDATE_KEY);
        localStorage.removeItem('signFamilyIncomeSources');
        
        // إعادة التوجيه للصفحة الرئيسية ثم عمل refresh
        navigate("/");
        setTimeout(() => {
          window.location.reload();
        }, 250); // انتظار نصف ثانية ثم عمل refresh
      } else {
        hotToast({ type: "error", message: result.error as string });
      }
    } catch (error) {
      hotToast({ type: "error", message: "حدث خطأ أثناء تحديث البيانات" });
    }
  };
  // تحديث البيانات
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "file" && e.target instanceof HTMLInputElement) {
      const input = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: input.files && input.files[0] ? input.files[0] : null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleNext = () => {
    // التحقق من صحة البيانات حسب المرحلة الحالية
    let validation;
    
    if (step === 1) {
      validation = validateStep1(formData, dateType);
    } else if (step === 2) {
      validation = validateStep2(formData, incomeSources);
    } else {
      // لا نحتاج validation للمرحلة الأخيرة لأنها للإرسال فقط
      validation = { valid: true };
    }
    
    if (!validation.valid) {
      hotToast({ type: "error", message: validation.message || "حدث خطأ غير متوقع" });
      return;
    }
    
    setAnimDir("right");
    setStep((s) => {
      const next = Math.min(s + 1, 3);
      localStorage.setItem(STEP_KEY, next.toString());
      return next;
    });
  };
  const handleBack = () => {
    setAnimDir("left");
    setStep((s) => {
      const prev = Math.max(s - 1, 1);
      localStorage.setItem(STEP_KEY, prev.toString());
      return prev;
    });
  };

  // محتوى كل خطوة
  const renderStep = () => {
    if (step === 1) {
      return (
        <div className={styles.card}>
          <h2 className={styles.title}>البيانات الأساسية</h2>
          {isMobile && (
            <div className="mb-6" style={{ textAlign: 'center' }}>
              <ProgressSteps step={step} steps={steps} isMobile={isMobile} stepIcons={stepIcons} />
            </div>
          )}
          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label>الاسم الأول</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>الاسم الثاني</label>
              <input
                name="secondName"
                value={formData.secondName}
                onChange={handleChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>الاسم الثالث</label>
              <input
                name="thirdName"
                value={formData.thirdName}
                onChange={handleChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>اسم العائلة</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>البريد الإلكتروني</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>الجنس</label>
              <div className={styles.radioGroup}>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="ذكر"
                    checked={formData.gender === "ذكر"}
                    onChange={handleChange}
                  />{" "}
                  ذكر
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="أنثى"
                    checked={formData.gender === "أنثى"}
                    onChange={handleChange}
                  />{" "}
                  أنثى
                </label>
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>الجنسية</label>
              <input
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>رقم الهوية</label>
              <input
                name="identityNumber"
                value={formData.identityNumber}
                onChange={handleChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>إرفاق صورة الهوية (JPG أو PNG فقط)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <input
                    type="file"
                    name="idImagePath"
                    accept=".jpg,.jpeg,.png"
                    style={{ display: 'none' }}
                    id="idImagePathInput"
                    onChange={handleChange}
                  />
                <label htmlFor="idImagePathInput" className={styles.fileInputLabel} style={{
                  cursor: 'pointer',
                  background: '#e2e8f0',
                  padding: '6px 16px',
                  borderRadius: 6,
                  minWidth: 90,
                  fontSize: 13,
                  textAlign: 'center',
                  display: 'inline-block',
                  fontWeight: 500,
                }}>
                  {(formData.idImagePath || userIdImagePath) ? 'تحديث' : 'رفع ملف'}
                </label>
                {(formData.idImagePath || userIdImagePath) && (
                  <button
                    type="button"
                    style={{
                      fontSize: 13,
                      padding: '6px 16px',
                      minWidth: 90,
                      borderRadius: 6,
                      border: 'none',
                      cursor: 'pointer',
                      marginRight: 4,
                      background: '#3182ce', // أزرق
                      color: '#fff',
                      fontWeight: 500,
                      textAlign: 'center',
                      display: 'inline-block',
                    }}
                    onClick={() => {
                      if (typeof formData.idImagePath === 'string' && formData.idImagePath) {
                        setImagePreview(formData.idImagePath);
                      } else if (formData.idImagePath instanceof File) {
                        setImagePreview(URL.createObjectURL(formData.idImagePath));
                      } else if (userIdImagePath) {
                        setImagePreview(userIdImagePath);
                      }
                      setImagePreviewLabel('صورة الهوية');
                    }}
                  >عرض</button>
                )}
                {!formData.idImagePath && <span style={{ color: '#a0aec0', fontSize: 13 }}>لا يوجد ملف</span>}
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>الحالة الاجتماعية</label>
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
              >
                <option value="">اختر الحالة الاجتماعية</option>
                <option value="أعزب">أعزب</option>
                <option value="متزوج">متزوج</option>
                <option value="مطلق">مطلق</option>
                <option value="أرمل">أرمل</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label>تاريخ الميلاد</label>
              <div className={styles.dateRow}>
                <select
                  value={dateType}
                  onChange={e => {
                    setDateType(e.target.value as 'هجري' | 'ميلادي');
                    setFormData(prev => ({ ...prev, birthDate: '' })); // إعادة ضبط التاريخ عند تغيير النوع
                  }}
                >
                  <option value="هجري">هجري</option>
                  <option value="ميلادي">ميلادي</option>
                </select>
                {dateType === 'ميلادي' ? (
                  <>
                    <select
                      value={formData.birthDate ? formData.birthDate.split('-')[0] : ''}
                      onChange={e => {
                        const year = e.target.value;
                        const [_, m, d] = formData.birthDate ? formData.birthDate.split('-') : [undefined, '', ''];
                        setFormData(prev => ({
                          ...prev,
                          birthDate: `${year}-${m || ''}-${d || ''}`
                        }));
                      }}
                    >
                      <option value="">سنة</option>
                      {gregorianYears.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <select
                      value={formData.birthDate ? formData.birthDate.split('-')[1] : ''}
                      onChange={e => {
                        const month = e.target.value;
                        const [y, _, d] = formData.birthDate ? formData.birthDate.split('-') : ['', undefined, ''];
                        setFormData(prev => ({
                          ...prev,
                          birthDate: `${y || ''}-${month}-${d || ''}`
                        }));
                      }}
                    >
                      <option value="">شهر</option>
                      {gregorianMonths.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select
                      value={formData.birthDate ? formData.birthDate.split('-')[2] : ''}
                      onChange={e => {
                        const day = e.target.value;
                        const [y, m, _] = formData.birthDate ? formData.birthDate.split('-') : ['', '', undefined];
                        setFormData(prev => ({
                          ...prev,
                          birthDate: `${y || ''}-${m || ''}-${day}`
                        }));
                      }}
                    >
                      <option value="">يوم</option>
                      {gregorianDays.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </>
                ) : (
                  <>
                    <select
                      value={formData.birthDate ? formData.birthDate.split('-')[0] : ''}
                      onChange={e => {
                        const year = e.target.value;
                        const [_, m, d] = formData.birthDate ? formData.birthDate.split('-') : [undefined, '', ''];
                        setFormData(prev => ({
                          ...prev,
                          birthDate: `${year}-${m || ''}-${d || ''}`
                        }));
                      }}
                    >
                      <option value="">سنة</option>
                      {Array.from({length: 99}, (_, i) => 1350 + i).map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <select
                      value={formData.birthDate ? formData.birthDate.split('-')[1] : ''}
                      onChange={e => {
                        const month = e.target.value;
                        const [y, _, d] = formData.birthDate ? formData.birthDate.split('-') : ['', undefined, ''];
                        setFormData(prev => ({
                          ...prev,
                          birthDate: `${y || ''}-${month}-${d || ''}`
                        }));
                      }}
                    >
                      <option value="">شهر</option>
                      {hijriMonths.map((m, i) => <option key={m} value={i+1}>{m}</option>)}
                    </select>
                    <select
                      value={formData.birthDate ? formData.birthDate.split('-')[2] : ''}
                      onChange={e => {
                        const day = e.target.value;
                        const [y, m, _] = formData.birthDate ? formData.birthDate.split('-') : ['', '', undefined];
                        setFormData(prev => ({
                          ...prev,
                          birthDate: `${y || ''}-${m || ''}-${day}`
                        }));
                      }}
                    >
                      <option value="">يوم</option>
                      {hijriDays.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </>
                )}
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>السن</label>
              <input type="text" value={calculateAge(formData.birthDate, dateType)} disabled />
            </div>
            <div className={styles.inputGroup}>
              <label>رقم الجوال</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>المهنة</label>
              <select
                name="jobStatus"
                value={formData.jobStatus || ""}
                onChange={handleChange}
                required
              >
                <option value="" disabled hidden>اختر المهنة</option>
                <option value="عاطل">عاطل</option>
                <option value="موظف">موظف</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label>الحالة الصحية</label>
              <select
                name="healthStatus"
                value={formData.healthStatus || ""}
                onChange={handleChange}
                required
              >
                <option value="" disabled hidden>اختر الحالة الصحية</option>
                <option value="سليم">سليم</option>
                <option value="غير سليم">غير سليم</option>
              </select>
            </div>
            {formData.healthStatus === "غير سليم" && (
              <div className={styles.inputGroup}>
                <label>نوع الإعاقة</label>
                <select
                  name="disabilityType"
                  value={formData.disabilityType || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled hidden>اختر نوع الإعاقة</option>
                  <option value="مريض">مريض</option>
                  <option value="ذوي احتياجات خاصة">ذوي احتياجات خاصة</option>
                </select>
              </div>
            )}
          </div>
        </div>
      );
    }
    if (step === 2) {
      const totalIncome = incomeSources.reduce((acc: number, src: IncomeSource) => acc + (parseFloat(src.sourceAmount) || 0), 0);
      return (
        <div className={styles.card}>
          <h2 className={styles.title}>بيانات عامة</h2>
          {isMobile && (
            <div className="mb-6" style={{ textAlign: 'center' }}>
              <ProgressSteps step={step} steps={steps} isMobile={isMobile} stepIcons={stepIcons} />
            </div>
          )}
          <div className={styles.grid} style={{ 
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? '16px' : '20px'
          }}>
            {/* مدينة السكن */}
            <div className={styles.inputGroup} style={{ 
              gridColumn: isMobile ? 'span 1' : 'span 1',
              marginBottom: isMobile ? '8px' : '0'
            }}>
              <label>مدينة السكن</label>
              <input
                name="cityOfResidence"
                value={formData.cityOfResidence}
                onChange={handleChange}
                placeholder="ما هي مدينة سكنك الحالية؟"
                style={{
                  width: '100%',
                  padding: isMobile ? '12px 16px' : '10px 12px',
                  fontSize: isMobile ? '16px' : '14px'
                }}
              />
            </div>
            {/* الحي */}
            <div className={styles.inputGroup} style={{ 
              gridColumn: isMobile ? 'span 1' : 'span 1',
              marginBottom: isMobile ? '8px' : '0'
            }}>
              <label>الحي</label>
              <input
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="اسم الحي"
                style={{
                  width: '100%',
                  padding: isMobile ? '12px 16px' : '10px 12px',
                  fontSize: isMobile ? '16px' : '14px'
                }}
              />
            </div>
            {/* نوع السكن */}
            <div className={styles.inputGroup} style={{ 
              gridColumn: isMobile ? 'span 1' : 'span 1',
              marginBottom: isMobile ? '8px' : '0'
            }}>
              <label>نوع السكن</label>
              <select
                name="housingType"
                value={formData.housingType || ""}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: isMobile ? '12px 16px' : '10px 12px',
                  fontSize: isMobile ? '16px' : '14px'
                }}
              >
                <option value="" disabled hidden>اختر نوع السكن</option>
                <option value="ملك">ملك</option>
                <option value="إيجار">إيجار</option>
              </select>
            </div>
            {/* مبلغ الإيجار ورفع العقد */}
            {formData.housingType === "إيجار" && (
              <>
                <div className={styles.inputGroup} style={{ 
                  gridColumn: isMobile ? 'span 1' : 'span 1',
                  marginBottom: isMobile ? '8px' : '0'
                }}>
                  <label>مبلغ الإيجار السنوي</label>
                  <input
                    type="number"
                    name="rentAmount"
                    value={formData.rentAmount}
                    min={0}
                    onChange={handleChange}
                    placeholder="أدخل مبلغ الإيجار بالريال"
                    style={{
                      width: '100%',
                      padding: isMobile ? '12px 16px' : '10px 12px',
                      fontSize: isMobile ? '16px' : '14px'
                    }}
                  />
                </div>
                <div className={styles.inputGroup} style={{ 
                  gridColumn: isMobile ? 'span 1' : 'span 1',
                  marginBottom: isMobile ? '8px' : '0'
                }}>
                  <label>إرفاق عقد الإيجار (JPG أو PNG فقط)</label>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: isMobile ? '4px' : '8px',
                    flexWrap: isMobile ? 'wrap' : 'nowrap'
                  }}>
                    <input
                      type="file"
                      name="rentContractFile"
                      accept=".jpg,.jpeg,.png"
                      style={{ display: 'none' }}
                      id="rentContractFileInput"
                      onChange={handleChange}
                    />
                    <label htmlFor="rentContractFileInput" className={styles.fileInputLabel} style={{
                      cursor: 'pointer',
                      background: '#e2e8f0',
                      padding: isMobile ? '8px 12px' : '6px 16px',
                      borderRadius: 6,
                      minWidth: isMobile ? '80px' : '90px',
                      fontSize: isMobile ? '12px' : '13px',
                      textAlign: 'center',
                      display: 'inline-block',
                      fontWeight: 500,
                    }}>
                      {(formData.rentContractFile || userRentImage) ? 'تحديث' : 'رفع ملف'}
                    </label>
                    {(formData.rentContractFile || userRentImage) && (
                      <button
                        type="button"
                        style={{
                          fontSize: isMobile ? '12px' : '13px',
                          padding: isMobile ? '8px 12px' : '6px 16px',
                          minWidth: isMobile ? '80px' : '90px',
                          borderRadius: 6,
                          border: 'none',
                          cursor: 'pointer',
                          marginRight: isMobile ? '2px' : '4px',
                          background: '#3182ce', // أزرق
                          color: '#fff',
                          fontWeight: 500,
                          textAlign: 'center',
                          display: 'inline-block',
                        }}
                        onClick={() => {
                          if (typeof formData.rentContractFile === 'string' && formData.rentContractFile) {
                            setImagePreview(formData.rentContractFile);
                          } else if (formData.rentContractFile instanceof File) {
                            setImagePreview(URL.createObjectURL(formData.rentContractFile));
                          } else if (userRentImage) {
                            setImagePreview(userRentImage);
                          }
                          setImagePreviewLabel('عقد الإيجار');
                        }}
                      >عرض</button>
                    )}
                  </div>
                </div>
              </>
            )}
            {/* مصادر الدخل */}
            <div className={styles.inputGroup} style={{ 
              gridColumn: isMobile ? 'span 1' : 'span 3',
              marginBottom: isMobile ? '8px' : '0'
            }}>
              <label style={{ 
                fontWeight: 'bold', 
                fontSize: isMobile ? '15px' : '17px', 
                color: '#2c5282', 
                marginBottom: isMobile ? '8px' : '10px', 
                display: 'block' 
              }}>
                اختر مصادر الدخل السنوية
              </label>
              <div className={styles.incomeSourcesRow} style={{ 
                marginBottom: isMobile ? '16px' : '20px',
                display: 'flex',
                flexWrap: isMobile ? 'wrap' : 'wrap',
                gap: isMobile ? '8px' : '8px'
              }}>
                {incomeOptions.map((opt) => {
                  const isActive = !!incomeSources.find(src => src.sourceType === opt.key);
                  return (
                    <button
                      type="button"
                      key={opt.key}
                      className={`${styles.incomeSource} ${isActive ? styles.active : ''}`}
                      style={{
                        outline: isActive ? '2px solid #7ed957' : 'none',
                        border: isActive ? '2px solid #7ed957' : '1.5px solid #e5e7eb',
                        background: isActive ? '#eaffea' : '#f3f4f6',
                        color: isActive ? '#222' : '#4a5a7a',
                        minWidth: isMobile ? '120px' : '140px',
                        marginBottom: isMobile ? '4px' : '8px',
                        marginLeft: isMobile ? '0' : '8px',
                        cursor: 'pointer',
                        borderRadius: 10,
                        padding: isMobile ? '10px 14px' : '12px 18px',
                        fontWeight: 500,
                        fontSize: isMobile ? '13px' : '15px',
                        transition: 'all 0.2s',
                        position: 'relative',
                        flex: isMobile ? '1 1 calc(50% - 4px)' : '0 0 auto'
                      }}
                      onClick={() => toggleIncomeSource(opt.key)}
                    >
                      <span>{opt.label}</span>
                      {isActive && (
                        <span
                          style={{
                            position: 'absolute',
                            top: isMobile ? '2px' : '4px',
                            left: isMobile ? '6px' : '8px',
                            color: '#7ed957',
                            fontWeight: 'bold',
                            fontSize: isMobile ? '16px' : '18px',
                            cursor: 'pointer',
                            background: 'transparent',
                            border: 'none',
                            zIndex: 2
                          }}
                          title="إلغاء هذا المصدر"
                          onClick={e => {
                            e.stopPropagation();
                            toggleIncomeSource(opt.key);
                          }}
                        >
                          ×
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {/* خانات إدخال المبالغ والصور للمصادر المختارة فقط */}
              {incomeSources.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: isMobile ? '12px' : '16px',
                  marginTop: isMobile ? '12px' : '16px',
                  padding: isMobile ? '12px' : '16px',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  {incomeSources.map((src: IncomeSource) => (
                    <div key={src.sourceType} style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      marginBottom: isMobile ? '8px' : '12px',
                      padding: isMobile ? '12px' : '0',
                      background: isMobile ? '#fff' : 'transparent',
                      borderRadius: isMobile ? '8px' : '0',
                      border: isMobile ? '1px solid #e5e7eb' : 'none'
                    }}>
                      <label style={{ 
                        fontSize: isMobile ? '13px' : '14px', 
                        color: '#4a5a7a', 
                        marginBottom: isMobile ? '6px' : '8px', 
                        fontWeight: '500', 
                        textAlign: 'right' 
                      }}>
                        نوع الدخل
                      </label>
                      <input
                        type="text"
                        value={src.sourceType}
                        disabled
                        style={{ 
                          background: '#f3f4f6', 
                          color: '#222', 
                          fontWeight: 600,
                          padding: isMobile ? '10px 12px' : '8px 10px',
                          fontSize: isMobile ? '14px' : '13px'
                        }}
                      />
                      <label style={{ 
                        fontSize: isMobile ? '13px' : '14px', 
                        color: '#4a5a7a', 
                        margin: isMobile ? '6px 0 3px' : '8px 0 4px', 
                        fontWeight: '500', 
                        textAlign: 'right' 
                      }}>
                        مبلغ الدخل (سنويًا)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="أدخل المبلغ بالريال سنويًا"
                        value={src.sourceAmount}
                        onChange={e => updateIncomeSource(src.sourceType, 'sourceAmount', e.target.value)}
                        style={{
                          padding: isMobile ? '10px 12px' : '8px 10px',
                          fontSize: isMobile ? '14px' : '13px'
                        }}
                      />
                      <label style={{ 
                        fontSize: isMobile ? '12px' : '13px', 
                        color: '#2c5282', 
                        fontWeight: 500, 
                        margin: isMobile ? '6px 0 3px' : '8px 0 4px' 
                      }}>
                        إرفاق صورة مستند الدخل (JPG أو PNG فقط)
                      </label>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: isMobile ? '4px' : '8px',
                        flexWrap: isMobile ? 'wrap' : 'nowrap'
                      }}>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          id={`incomeSourceFile_${src.sourceType}`}
                          onChange={e => {
                            const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                            updateIncomeSource(src.sourceType, 'sourceImage', file);
                          }}
                        />
                        <label htmlFor={`incomeSourceFile_${src.sourceType}`} className={styles.fileInputLabel} style={{ 
                          cursor: 'pointer', 
                          background: '#e2e8f0', 
                          padding: isMobile ? '8px 12px' : '6px 16px', 
                          borderRadius: 6, 
                          marginTop: isMobile ? '2px' : '4px',
                          fontSize: isMobile ? '12px' : '13px',
                          minWidth: isMobile ? '80px' : '90px'
                        }}>
                          {(src.sourceImage && (typeof src.sourceImage === 'string' || src.sourceImage instanceof File)) ? 'تحديث' : 'رفع ملف'}
                        </label>
                        {src.sourceImage && (
                          <button
                            type="button"
                            style={{
                              fontSize: isMobile ? '12px' : '13px',
                              padding: isMobile ? '8px 12px' : '6px 16px',
                              minWidth: isMobile ? '80px' : '90px',
                              borderRadius: 6,
                              border: 'none',
                              cursor: 'pointer',
                              marginRight: isMobile ? '2px' : '4px',
                              background: '#3182ce',
                              color: '#fff',
                              fontWeight: 500,
                              textAlign: 'center',
                              display: 'inline-block',
                            }}
                            onClick={() => {
                              if (typeof src.sourceImage === 'string' && src.sourceImage) {
                                setImagePreview(src.sourceImage);
                              } else if (src.sourceImage instanceof File) {
                                setImagePreview(URL.createObjectURL(src.sourceImage));
                              }
                              setImagePreviewLabel(`مستند دخل: ${src.sourceType}`);
                            }}
                          >عرض</button>
                        )}
                        {src.sourceImage && src.sourceImage instanceof File && (
                          <>
                            <span style={{ 
                              color: '#2c5282', 
                              fontWeight: 500, 
                              fontSize: isMobile ? '11px' : '13px',
                              wordBreak: 'break-all'
                            }}>{(src.sourceImage as File).name}</span>
                            <button type="button" style={{ 
                              fontSize: isMobile ? '11px' : '12px', 
                              padding: isMobile ? '4px 8px' : '2px 10px' 
                            }} onClick={() => {
                              if (src.sourceImage) {
                                setImagePreview(URL.createObjectURL(src.sourceImage as File));
                                setImagePreviewLabel(`مستند دخل: ${src.sourceType}`);
                              }
                            }}>عرض</button>
                          </>
                        )}
                        {!src.sourceImage && <span style={{ 
                          color: '#a0aec0', 
                          fontSize: isMobile ? '11px' : '13px' 
                        }}>لا يوجد ملف</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* عرض إجمالي الدخل */}
              {incomeSources.length > 0 && (
                <div style={{
                  display: 'flex',
                  justifyContent: isMobile ? 'center' : 'flex-end',
                  alignItems: 'center',
                  marginTop: isMobile ? '12px' : '16px',
                  padding: isMobile ? '10px 12px' : '12px 16px',
                  background: '#e8f4f8',
                  borderRadius: '8px',
                  border: '1px solid #b3d9e6',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? '8px' : '0'
                }}>
                  <span style={{
                    fontSize: isMobile ? '14px' : '16px',
                    fontWeight: 'bold',
                    color: '#2c5282',
                    marginLeft: isMobile ? '0' : '12px',
                    textAlign: isMobile ? 'center' : 'right'
                  }}>
                    إجمالي الدخل السنوي:
                  </span>
                  <span style={{
                    fontSize: isMobile ? '16px' : '18px',
                    fontWeight: 'bold',
                    color: '#1a365d',
                    background: 'white',
                    padding: isMobile ? '8px 16px' : '6px 12px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e0',
                    textAlign: 'center'
                  }}>
                    {totalIncome.toLocaleString()} ريال
                  </span>
                </div>
              )}
            </div>
            {/* اختيار البنك */}
            <div className={styles.inputGroup} style={{ 
              gridColumn: isMobile ? 'span 1' : 'span 1',
              marginBottom: isMobile ? '8px' : '0'
            }}>
              <label>البنك</label>
              <select
                name="bankName"
                value={formData.bankName || ""}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: isMobile ? '12px 16px' : '10px 12px',
                  fontSize: isMobile ? '16px' : '14px'
                }}
              >
                <option value="" disabled hidden>اختر البنك</option>
                {saudiBanks.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            {/* رفع صورة الآيبان */}
            <div className={styles.inputGroup} style={{ 
              gridColumn: isMobile ? 'span 1' : 'span 1',
              marginBottom: isMobile ? '8px' : '0'
            }}>
              <label>إرفاق صورة الآيبان (JPG أو PNG فقط)</label>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: isMobile ? '4px' : '8px',
                flexWrap: isMobile ? 'wrap' : 'nowrap'
              }}>
                <input
                  type="file"
                  name="ibanImage"
                  accept=".jpg,.jpeg,.png"
                  style={{ display: 'none' }}
                  id="ibanImageInput"
                  onChange={handleChange}
                />
                <label htmlFor="ibanImageInput" className={styles.fileInputLabel} style={{
                  cursor: 'pointer',
                  background: '#e2e8f0',
                  padding: isMobile ? '8px 12px' : '6px 16px',
                  borderRadius: 6,
                  minWidth: isMobile ? '80px' : '90px',
                  fontSize: isMobile ? '12px' : '13px',
                  textAlign: 'center',
                  display: 'inline-block',
                  fontWeight: 500,
                }}>
                  {(formData.ibanImage || userIbanImage) ? 'تحديث' : 'رفع ملف'}
                </label>
                {(formData.ibanImage || userIbanImage) && (
                  <button
                    type="button"
                    style={{
                      fontSize: isMobile ? '12px' : '13px',
                      padding: isMobile ? '8px 12px' : '6px 16px',
                      minWidth: isMobile ? '80px' : '90px',
                      borderRadius: 6,
                      border: 'none',
                      cursor: 'pointer',
                      marginRight: isMobile ? '2px' : '4px',
                      background: '#3182ce', // أزرق
                      color: '#fff',
                      fontWeight: 500,
                      textAlign: 'center',
                      display: 'inline-block',
                    }}
                    onClick={() => {
                      if (typeof formData.ibanImage === 'string' && formData.ibanImage) {
                        setImagePreview(formData.ibanImage);
                      } else if (formData.ibanImage instanceof File) {
                        setImagePreview(URL.createObjectURL(formData.ibanImage));
                      } else if (userIbanImage) {
                        setImagePreview(userIbanImage);
                      }
                      setImagePreviewLabel('صورة الآيبان');
                    }}
                  >عرض</button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (step === 3) {
      return (
        <div className={styles.card}>
          <h2 className={styles.title}>بيانات المرافقين</h2>
          <div className={styles.grid} style={{ 
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? '16px' : '20px'
          }}>
            {/* عدد المرافقين */}
            <div className={styles.inputGroup} style={{ 
              gridColumn: isMobile ? 'span 1' : 'span 1',
              marginBottom: isMobile ? '8px' : '0'
            }}>
              <label>عدد المرافقين</label>
              <select
                value={companionsCount}
                onChange={e => {
                  const val = parseInt(e.target.value) || 0;
                  setCompanionsCount(val);
                  setMaleCount(val);
                }}
                style={{
                  width: '100%',
                  padding: isMobile ? '12px 16px' : '10px 12px',
                  fontSize: isMobile ? '16px' : '14px'
                }}
              >
                {Array.from({ length: 16 }, (_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            {/* عدد الذكور */}
            {companionsCount > 0 && (
              <div className={styles.inputGroup} style={{ 
                gridColumn: isMobile ? 'span 1' : 'span 1',
                marginBottom: isMobile ? '8px' : '0'
              }}>
                <label>عدد الذكور</label>
                <select
                  value={maleCount}
                  onChange={e => setMaleCount(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: isMobile ? '12px 16px' : '10px 12px',
                    fontSize: isMobile ? '16px' : '14px'
                  }}
                >
                  {Array.from({ length: companionsCount + 1 }, (_, i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
            )}
            {/* عدد الإناث */}
            {companionsCount > 0 && (
              <div className={styles.inputGroup} style={{ 
                gridColumn: isMobile ? 'span 1' : 'span 1',
                marginBottom: isMobile ? '8px' : '0'
              }}>
                <label>عدد الإناث</label>
                <input
                  type="number"
                  value={companionsCount - maleCount}
                  disabled
                  style={{
                    width: '100%',
                    padding: isMobile ? '12px 16px' : '10px 12px',
                    fontSize: isMobile ? '16px' : '14px',
                    background: '#f3f4f6',
                    color: '#6b7280'
                  }}
                />
              </div>
            )}
            {/* رفع كارت العائلة */}
            {companionsCount > 0 && (
              <div className={styles.inputGroup} style={{ 
                gridColumn: isMobile ? 'span 1' : 'span 3',
                marginBottom: isMobile ? '8px' : '0'
              }}>
                <label>إرفاق كارت العائلة (JPG أو PNG فقط)</label>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: isMobile ? '4px' : '8px',
                  flexWrap: isMobile ? 'wrap' : 'nowrap'
                }}>
                  <input
                    type="file"
                    name="familyCardFile"
                    accept=".jpg,.jpeg,.png"
                    style={{ display: 'none' }}
                    id="familyCardFileInput"
                    onChange={handleChange}
                  />
                  <label htmlFor="familyCardFileInput" className={styles.fileInputLabel} style={{
                    cursor: 'pointer',
                    background: '#e2e8f0',
                    padding: isMobile ? '8px 12px' : '6px 16px',
                    borderRadius: 6,
                    minWidth: isMobile ? '80px' : '90px',
                    fontSize: isMobile ? '12px' : '13px',
                    textAlign: 'center',
                    display: 'inline-block',
                    fontWeight: 500,
                  }}>
                    {formData.familyCardFile ? 'تحديث' : 'رفع ملف'}
                  </label>
                  {formData.familyCardFile && (
                    <>
                      {/* <span style={{ color: '#2c5282', fontWeight: 500, fontSize: 13 }}>يوجد ملف</span> */}
                      <button
                        type="button"
                        style={{
                          fontSize: isMobile ? '12px' : '13px',
                          padding: isMobile ? '8px 12px' : '6px 16px',
                          minWidth: isMobile ? '80px' : '90px',
                          borderRadius: 6,
                          border: 'none',
                          cursor: 'pointer',
                          marginRight: isMobile ? '2px' : '4px',
                          background: '#3182ce', // أزرق
                          color: '#fff',
                          fontWeight: 500,
                          textAlign: 'center',
                          display: 'inline-block',
                        }}
                        onClick={() => {
                          if (typeof formData.familyCardFile === 'string' && formData.familyCardFile != null) {
                            setImagePreview(formData.familyCardFile);
                          } else if (formData.familyCardFile instanceof File) {
                            setImagePreview(URL.createObjectURL(formData.familyCardFile));
                          }
                          setImagePreviewLabel('كارت العائلة');
                        }}
                      >عرض</button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* بيانات المرافقين */}
          {companionsCount > 0 && companions.length > 0 && (
            <div className={styles.companionsScrollBox} style={{ 
              marginTop: isMobile ? '16px' : '24px',
              padding: isMobile ? '0 8px' : '0'
            }}>
              {companions.map((companion, idx) => (
                <div key={idx} className={styles.card} style={{ 
                  marginBottom: isMobile ? '12px' : '18px', 
                  background: '#f9f9fb',
                  padding: isMobile ? '16px' : '20px',
                  borderRadius: isMobile ? '12px' : '8px'
                }}>
                  <h3 style={{ 
                    color: '#4a5a7a', 
                    fontWeight: 700, 
                    marginBottom: isMobile ? '8px' : '12px',
                    fontSize: isMobile ? '16px' : '18px',
                    textAlign: isMobile ? 'center' : 'right'
                  }}>بيانات المرافق {idx + 1}</h3>
                  <div className={styles.grid} style={{ 
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                    gap: isMobile ? '12px' : '16px'
                  }}>
                    {/* الاسم الرباعي */}
                    <div className={styles.inputGroup} style={{ 
                      gridColumn: isMobile ? 'span 1' : 'span 1',
                      marginBottom: isMobile ? '8px' : '0'
                    }}>
                      <label>الاسم الرباعي</label>
                      <input
                        value={companion.name}
                        onChange={e => {
                          const arr = [...companions];
                          arr[idx].name = e.target.value;
                          setCompanions(arr);
                        }}
                        style={{
                          width: '100%',
                          padding: isMobile ? '10px 12px' : '8px 10px',
                          fontSize: isMobile ? '14px' : '13px'
                        }}
                      />
                    </div>
                    {/* رقم الهوية */}
                    <div className={styles.inputGroup} style={{ 
                      gridColumn: isMobile ? 'span 1' : 'span 1',
                      marginBottom: isMobile ? '8px' : '0'
                    }}>
                      <label>رقم الهوية</label>
                      <input
                        value={companion.identityNumber || companion.id || ""}
                        onChange={e => {
                          const arr = [...companions];
                          arr[idx].identityNumber = e.target.value;
                          arr[idx].id = e.target.value; // حفظ في كلا الحقلين للتوافق
                          setCompanions(arr);
                        }}
                        style={{
                          width: '100%',
                          padding: isMobile ? '10px 12px' : '8px 10px',
                          fontSize: isMobile ? '14px' : '13px'
                        }}
                      />
                    </div>
                  
                    <div className={styles.inputGroup} style={{ 
                      gridColumn: isMobile ? 'span 1' : 'span 1',
                      marginBottom: isMobile ? '8px' : '0'
                    }}>
                      <label>تاريخ الميلاد</label>
                      <div className={styles.dateRow} style={{
                        display: 'flex',
                        gap: isMobile ? '4px' : '8px',
                        flexWrap: isMobile ? 'wrap' : 'nowrap'
                      }}>
                        <select
                          value={companion.dateType}
                          onChange={e => {
                            const arr = [...companions];
                            arr[idx].dateType = e.target.value;
                            arr[idx].birthDate = '';
                            arr[idx].age = '';
                            setCompanions([...arr]); // إجبار التحديث
                          }}
                          style={{ 
                            minWidth: isMobile ? '70px' : '80px',
                            padding: isMobile ? '8px 6px' : '6px 8px',
                            fontSize: isMobile ? '12px' : '13px'
                          }}
                        >
                          <option value="هجري">هجري</option>
                          <option value="ميلادي">ميلادي</option>
                        </select>
                        {companion.dateType === 'ميلادي' ? (
                          <>
                            <select
                              value={companion.birthDate ? companion.birthDate.split('-')[0] : ''}
                              onChange={e => {
                                const year = e.target.value;
                                const [_, m, d] = companion.birthDate ? companion.birthDate.split('-') : [undefined, '', ''];
                                const newBirthDate = `${year}-${m || ''}-${d || ''}`;
                                const calculatedAge = calculateAge(newBirthDate, 'ميلادي');
                                const arr = [...companions];
                                arr[idx].birthDate = newBirthDate;
                                arr[idx].age = calculatedAge;
                                setCompanions(arr);
                              }}
                              style={{ minWidth: isMobile ? '70px' : '80px', padding: isMobile ? '8px 6px' : '6px 8px', fontSize: isMobile ? '12px' : '13px' }}
                            >
                              <option value="">سنة</option>
                              {gregorianYears.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                            <select
                              value={companion.birthDate ? companion.birthDate.split('-')[1] : ''}
                              onChange={e => {
                                const month = e.target.value;
                                const [y, _, d] = companion.birthDate ? companion.birthDate.split('-') : ['', undefined, ''];
                                const newBirthDate = `${y || ''}-${month}-${d || ''}`;
                                const calculatedAge = calculateAge(newBirthDate, 'ميلادي');
                                const arr = [...companions];
                                arr[idx].birthDate = newBirthDate;
                                arr[idx].age = calculatedAge;
                                setCompanions(arr);
                              }}
                              style={{ minWidth: isMobile ? '70px' : '80px', padding: isMobile ? '8px 6px' : '6px 8px', fontSize: isMobile ? '12px' : '13px' }}
                            >
                              <option value="">شهر</option>
                              {gregorianMonths.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <select
                              value={companion.birthDate ? companion.birthDate.split('-')[2] : ''}
                              onChange={e => {
                                const day = e.target.value;
                                const [y, m, _] = companion.birthDate ? companion.birthDate.split('-') : ['', '', undefined];
                                const newBirthDate = `${y || ''}-${m || ''}-${day}`;
                                const calculatedAge = calculateAge(newBirthDate, 'ميلادي');
                                const arr = [...companions];
                                arr[idx].birthDate = newBirthDate;
                                arr[idx].age = calculatedAge;
                                setCompanions(arr);
                              }}
                              style={{ minWidth: isMobile ? '50px' : '60px', padding: isMobile ? '8px 6px' : '6px 8px', fontSize: isMobile ? '12px' : '13px' }}
                            >
                              <option value="">يوم</option>
                              {gregorianDays.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                          </>
                        ) : (
                          <>
                            <select
                              value={companion.birthDate ? companion.birthDate.split('-')[0] : ''}
                              onChange={e => {
                                const year = e.target.value;
                                const [_, m, d] = companion.birthDate ? companion.birthDate.split('-') : [undefined, '', ''];
                                const newBirthDate = `${year}-${m || ''}-${d || ''}`;
                                const calculatedAge = calculateAge(newBirthDate, 'هجري');
                                const arr = [...companions];
                                arr[idx].birthDate = newBirthDate;
                                arr[idx].age = calculatedAge;
                                setCompanions(arr);
                              }}
                              style={{ minWidth: isMobile ? '70px' : '80px', padding: isMobile ? '8px 6px' : '6px 8px', fontSize: isMobile ? '12px' : '13px' }}
                            >
                              <option value="">سنة</option>
                              {Array.from({length: 100}, (_, i) => 1350 + i).map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                            <select
                              value={companion.birthDate ? companion.birthDate.split('-')[1] : ''}
                              onChange={e => {
                                const month = e.target.value;
                                const [y, _, d] = companion.birthDate ? companion.birthDate.split('-') : ['', undefined, ''];
                                const newBirthDate = `${y || ''}-${month}-${d || ''}`;
                                const calculatedAge = calculateAge(newBirthDate, 'هجري');
                                const arr = [...companions];
                                arr[idx].birthDate = newBirthDate;
                                arr[idx].age = calculatedAge;
                                setCompanions(arr);
                              }}
                              style={{ minWidth: isMobile ? '70px' : '80px', padding: isMobile ? '8px 6px' : '6px 8px', fontSize: isMobile ? '12px' : '13px' }}
                            >
                              <option value="">شهر</option>
                              {hijriMonths.map((m, i) => <option key={m} value={i+1}>{m}</option>)}
                            </select>
                            <select
                              value={companion.birthDate ? companion.birthDate.split('-')[2] : ''}
                              onChange={e => {
                                const day = e.target.value;
                                const [y, m, _] = companion.birthDate ? companion.birthDate.split('-') : ['', '', undefined];
                                const newBirthDate = `${y || ''}-${m || ''}-${day}`;
                                const calculatedAge = calculateAge(newBirthDate, 'هجري');
                                const arr = [...companions];
                                arr[idx].birthDate = newBirthDate;
                                arr[idx].age = calculatedAge;
                                setCompanions(arr);
                              }}
                              style={{ minWidth: isMobile ? '50px' : '60px', padding: isMobile ? '8px 6px' : '6px 8px', fontSize: isMobile ? '12px' : '13px' }}
                            >
                              <option value="">يوم</option>
                              {hijriDays.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                          </>
                        )}
                      </div>
                    </div>
                    {/* العمر */}
                    <div className={styles.inputGroup} style={{ 
                      gridColumn: isMobile ? 'span 1' : 'span 1',
                      marginBottom: isMobile ? '8px' : '0'
                    }}>
                      <label>العمر</label>
                      <input 
                        type="text" 
                        value={calculateAge(companion.birthDate, companion.dateType)} 
                        disabled 
                        style={{
                          width: '100%',
                          padding: isMobile ? '10px 12px' : '8px 10px',
                          fontSize: isMobile ? '14px' : '13px',
                          background: '#f3f4f6',
                          color: '#6b7280'
                        }}
                      />
                    </div>
                    {/* المرحلة الدراسية */}
                    <div className={styles.inputGroup} style={{ 
                      gridColumn: isMobile ? 'span 1' : 'span 1',
                      marginBottom: isMobile ? '8px' : '0'
                    }}>
                      <label>المرحلة الدراسية</label>
                      <select
                        value={companion.studyLevel}
                        onChange={e => {
                          const arr = [...companions];
                          arr[idx].studyLevel = e.target.value as StudyLevel;
                          arr[idx].studyGrade = '';
                          setCompanions(arr);
                        }}
                        style={{
                          width: '100%',
                          padding: isMobile ? '10px 12px' : '8px 10px',
                          fontSize: isMobile ? '14px' : '13px'
                        }}
                      >
                        <option value="">اختر المرحلة</option>
                        <option value="رضيع">رضيع</option>
                        <option value="ابتدائي">ابتدائي</option>
                        <option value="متوسط">متوسط</option>
                        <option value="ثانوي">ثانوي</option>
                        <option value="جامعي">جامعي</option>
                        <option value="متخرج">متخرج</option>
                        <option value="غير متعلم">غير متعلم</option>
                      </select>
                    </div>
                    {/* تفاصيل الصف */}
                    {(companion.studyLevel === 'ابتدائي' || companion.studyLevel === 'متوسط' || companion.studyLevel === 'ثانوي') && (
                      <div className={styles.inputGroup} style={{ 
                        gridColumn: isMobile ? 'span 1' : 'span 1',
                        marginBottom: isMobile ? '8px' : '0'
                      }}>
                        <label>الصف</label>
                        <select
                          value={companion.studyGrade}
                          onChange={e => {
                            const arr = [...companions];
                            arr[idx].studyGrade = e.target.value;
                            setCompanions(arr);
                          }}
                          style={{
                            width: '100%',
                            padding: isMobile ? '10px 12px' : '8px 10px',
                            fontSize: isMobile ? '14px' : '13px'
                          }}
                        >
                          <option value="">اختر الصف</option>
                          {companion.studyLevel === 'ابتدائي' && Array.from({ length: 6 }, (_, i) => (
                            <option key={i+1} value={i+1}>{i+1}</option>
                          ))}
                          {companion.studyLevel === 'متوسط' && Array.from({ length: 3 }, (_, i) => (
                            <option key={i+1} value={i+1}>{i+1}</option>
                          ))}
                          {companion.studyLevel === 'ثانوي' && Array.from({ length: 3 }, (_, i) => (
                            <option key={i+1} value={i+1}>{i+1}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    {/* الحالة الصحية */}
                    <div className={styles.inputGroup} style={{ 
                      gridColumn: isMobile ? 'span 1' : 'span 1',
                      marginBottom: isMobile ? '8px' : '0'
                    }}>
                      <label>الحالة الصحية</label>
                      <select
                        value={companion.healthStatus}
                        onChange={e => {
                          const arr = [...companions];
                          arr[idx].healthStatus = e.target.value;
                          if (e.target.value !== 'غير سليم') arr[idx].disabilityType = '';
                          setCompanions(arr);
                        }}
                        style={{
                          width: '100%',
                          padding: isMobile ? '10px 12px' : '8px 10px',
                          fontSize: isMobile ? '14px' : '13px'
                        }}
                      >
                        <option value="">اختر الحالة الصحية</option>
                        <option value="سليم">سليم</option>
                        <option value="غير سليم">غير سليم</option>
                      </select>
                    </div>
                    {/* نوع الإعاقة */}
                    {companion.healthStatus === 'غير سليم' && (
                      <div className={styles.inputGroup} style={{ 
                        gridColumn: isMobile ? 'span 1' : 'span 1',
                        marginBottom: isMobile ? '8px' : '0'
                      }}>
                        <label>نوع الإعاقة</label>
                        <select
                          value={companion.disabilityType}
                          onChange={e => {
                            const arr = [...companions];
                            arr[idx].disabilityType = e.target.value;
                            setCompanions(arr);
                          }}
                          style={{
                            width: '100%',
                            padding: isMobile ? '10px 12px' : '8px 10px',
                            fontSize: isMobile ? '14px' : '13px'
                          }}
                        >
                          <option value="">اختر نوع الإعاقة</option>
                          <option value="مريض">مريض</option>
                          <option value="ذوي احتياجات خاصة">ذوي احتياجات خاصة</option>
                        </select>
                      </div>
                    )}
                    {/* صلة القرابة */}
                    <div className={styles.inputGroup} style={{ 
                      gridColumn: isMobile ? 'span 1' : 'span 1',
                      marginBottom: isMobile ? '8px' : '0'
                    }}>
                      <label>صلة القرابة</label>
                      <input
                        value={companion.kinship}
                        onChange={e => {
                          const arr = [...companions];
                          arr[idx].kinship = e.target.value;
                          setCompanions(arr);
                        }}
                        style={{
                          width: '100%',
                          padding: isMobile ? '10px 12px' : '8px 10px',
                          fontSize: isMobile ? '14px' : '13px'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
  };

  // قائمة البنوك السعودية
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
    // "بنك التنمية",
    "بنك الخليج الدولي",
    "بنك الأول"
  ];

  // مصادر الدخل
  const incomeOptions = [
    { key: "راتب عادي", label: "راتب عادي" },
    { key: "راتب تقاعدي", label: "راتب تقاعدي" },
    { key: "ضمان اجتماعي", label: "ضمان اجتماعي" },
    { key: "حساب مواطن", label: "حساب مواطن" },
  ];

  // دوال مساعدة
  const toggleIncomeSource = (sourceType: string) => { 
    setIncomeSources((prev: IncomeSource[]) => {
      const exists = prev.find((src: IncomeSource) => src.sourceType === sourceType);
      if (exists) {
        return prev.filter((src: IncomeSource) => src.sourceType !== sourceType);
      } else {
        return [...prev, { sourceType, sourceAmount: '', sourceImage: null }];
      }
    });
    setIncomeFiles(files => {
      const newFiles = { ...files };
      if (files[sourceType]) delete newFiles[sourceType];
      return newFiles;
    });
  };
  const updateIncomeSource = (sourceType: string, field: string, value: any) => {
    setIncomeSources((prev: IncomeSource[]) => prev.map((src: IncomeSource) =>
      src.sourceType === sourceType ? { ...src, [field]: value } : src
    ));
  };

  // دالة مسح البيانات المؤقتة من localStorage
  const clearTempData = () => {
    localStorage.removeItem(TEMP_COMPANIONS_KEY);
    localStorage.removeItem(TEMP_COMPANIONS_COUNT_KEY);
    localStorage.removeItem(TEMP_MALE_COUNT_KEY);
  };

  // دالة حفظ البيانات المؤقتة (للاستخدام عند الحاجة)
  const saveTempData = () => {
    localStorage.setItem(TEMP_COMPANIONS_KEY, JSON.stringify(companions));
    localStorage.setItem(TEMP_COMPANIONS_COUNT_KEY, companionsCount.toString());
    localStorage.setItem(TEMP_MALE_COUNT_KEY, maleCount.toString());
  };

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imagePreviewLabel, setImagePreviewLabel] = useState<string>("");

  // --- جلب صور من localStorage.user إذا لم تكن موجودة في formData ---
  const userStr = localStorage.getItem('user');
  let userIbanImage = '';
  let userRentImage = '';
  let userIdImagePath = '';
  if (userStr) {
    try {
      const userObj = JSON.parse(userStr);
      if (userObj.ibanImage) userIbanImage = userObj.ibanImage;
      if (userObj.rentImage) userRentImage = userObj.rentImage;
      if (userObj.idImagePath) userIdImagePath = userObj.idImagePath;
    } catch {}
  }

  // دالة للعودة للصفحة الرئيسية
  const handleGoHome = () => {
    navigate("/");
  };

  // دالة للمتابعة لتحديث البيانات
  const handleUpdateData = () => {
    setShowAlreadyRegistered(false);
  };

  // إذا كان المستخدم قد سجل بالفعل، اعرض popup
  if (showAlreadyRegistered) {
    return (
      <div className="h-[90vh] sm:h-[85vh] flex items-center justify-center bg-gray-50" style={{ direction: 'rtl' }}>
        <div className="bg-white sm:rounded-2xl shadow-2xl p-10 max-w-lg w-full md:mx-6 text-center border border-gray-100 sm:h-auto  h-full mx-0">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" className="text-green-500 text-7xl relative z-10" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.248-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
              </svg>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold  mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            لقد قمت بالتسجيل بالفعل
          </h2>
          
          <p className="text-gray-600 mb-8 text-xl leading-relaxed">   
            تم تسجيل بياناتك بنجاح في النظام
          </p>
          
          <div className="bg-blue-50 rounded-xl p-4 mb-10 border border-blue-100">
            <span className="text-blue-700 text-base font-medium">هل تريد تحديث البيانات؟</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGoHome}
              className="px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              الرجوع للرئيسية
            </button>
            <button
              onClick={handleUpdateData}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              تحديث البيانات
            </button>
          </div>
          
          <div className="mt-10 pt-6 border-t border-gray-200">
            <img alt="شعار الجمعية" src="img/logo.png" className="h-12 mx-auto opacity-60" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:!mt-10  container mx-auto  lg:px-5" style={{ display: 'flex', direction: 'rtl', flexDirection: isMobile ? 'column' : 'row', alignItems: 'stretch', width: '100%' }}>
      {/* Progress Stepper */}
      <div className="flex flex-col items-center justify-start h-fit sticky top-[120px]" style={{ 
        width: isMobile ? '100%' : '350px', 
        minWidth: isMobile ? 'auto' : '350px', 
        padding: isMobile ? '1rem 0' : '2rem 0',
        display: isMobile ? 'none' : 'flex'
      }}>
        <a href="#" className="logo mb-12"><img alt="شعار الجمعية" src="img/logo.png" style={{ width: '180px' }}/></a>
        <div className={styles.progressSteps} style={{ height: '100%', justifyContent: 'flex-start', gap: '1.5rem' }}>
          {steps.map((label, idx) => (
            <React.Fragment key={label}>
              <div className={styles.progressStep} style={{ transform: 'scale(1.1)' }}>
                <div
                  className={
                    styles.progressCircle +
                    (step > idx + 1
                      ? ' ' + styles.completed
                      : step === idx + 1
                      ? ' ' + styles.active
                      : '')
                  }
                  style={{ width: '45px', height: '45px', fontSize: '1.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {step > idx + 1 ? (
                    <span>&#10003;</span>
                  ) : (
                    React.cloneElement(stepIcons[idx], { style: { transform: 'scale(1.3)' } })
                  )}
                </div>
                <span className={styles.stepLabel} style={{ fontSize: '1.1rem', marginTop: '0.5rem' }}>{label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={
                    styles.stepConnector +
                    (step > idx + 1 ? ' ' + styles.completed : '')
                  }
                  style={{ height: '50px' }}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Form Wrapper */}
      <div className={styles.wrapper} style={{ flex: 1 }}>
        {/* Steps with animation */}
        <div
          ref={formContainerRef}
          className={ 
            styles.animatedStep +
            " " +
            (animDir === "right" ? styles.slideInRight : styles.slideInLeft)
          }
          style={
            fixedHeight
              ? {
                  height: fixedHeight,
                  transition: "height 0.3s cubic-bezier(.4,2,.6,1)",
                }
              : {}
          }
        > 
          {renderStep()}
        </div>
        {/* Navigation Buttons */}
        <div className={styles.buttonRow}>
          {step > 1 && (
            <button className={styles.navBtn} onClick={handleBack}>
              الرجوع
            </button>
          )} 
          {step < 3 && (
            <button className={styles.navBtn} onClick={handleNext}>
              التالي
            </button>
          )}
          {step === 3 && (
            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              type="submit"
            >
              تسجيل
            </button>
          )}
        </div>
      </div>
      {imagePreview && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.7)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }} onClick={() => setImagePreview(null)}>
          <div style={{ background: '#fff', padding: 20, borderRadius: 8, maxWidth: '90vw', maxHeight: '90vh', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setImagePreview(null)} style={{ position: 'absolute', top: 10, right: 10, fontSize: 18, background: 'transparent', border: 'none', cursor: 'pointer' }}>×</button>
            <div style={{ marginBottom: 10, fontWeight: 'bold', textAlign: 'center' }}>{imagePreviewLabel}</div>
            <img src={imagePreview} alt={imagePreviewLabel} style={{ maxWidth: '80vw', maxHeight: '70vh', display: 'block', margin: '0 auto' }} />
          </div>
        </div>
      )}
    </div> 
  );
};

export default SignFamily;
 