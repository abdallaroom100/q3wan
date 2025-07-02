import { useState, useRef, useEffect } from "react";
import styles from "./SignFamily.module.css";
import hotToast from "../../common/hotToast";
import useUpdateUserData from "../../hooks/Auth/update/useUpdateUserData";
import React from "react";
import { FaUser, FaHome, FaUsers } from 'react-icons/fa';
import ProgressSteps from '../../components/ProgressSteps';

// تعريف سنوات وشهور وأيام الهجري
const hijriYears: number[] = Array.from({length: 201}, (_, i) => 1300 + i); // 1300-1500
const hijriMonths: string[] = [
  "محرم", "صفر", "ربيع الأول", "ربيع الآخر", "جمادى الأولى", "جمادى الآخرة", "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"
];
const hijriDays: number[] = Array.from({length: 30}, (_, i) => i + 1);

const steps = ["البيانات الشخصية", "بيانات عامة", "بيانات المرافقين"];

type Housemate = {
  name: string;
  birthDate: string;
  identityNumber: string;
  gender: "ذكر" | "أنثى";
  kinship: string;
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
}

// تعريف نوع مصدر الدخل (من الكود القديم)
interface IncomeSource {
  sourceType: string;
  sourceAmount: string;
  sourceImage: File | null;
}

// دالة تقريبية لتحويل السنة الميلادية إلى هجرية
function getCurrentHijriYear() {
  const now = new Date();
  const gYear = now.getFullYear();
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

// LocalStorage Keys للبيانات المؤقتة
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

function validateForm(formData: UserData, companions: any[], dateType: string) {
  // الحقول الأساسية
  for (const key of Object.keys(fieldLabels)) {
    const value = String(formData[key as keyof UserData] ?? '');
    if (!String(value) || String(value) === "") {
      if (key === 'disabilityType' && formData.healthStatus !== 'غير سليم') continue;
      if (key === 'rentAmount' && formData.housingType !== 'إيجار') continue;
      return { valid: false, message: `يرجى ملء حقل ${fieldLabels[key]}` };
    }
  }
  if (!dateType) return { valid: false, message: "يرجى اختيار نوع تاريخ الميلاد" };

  // بيانات المرافقين
  for (let i = 0; i < companions.length; i++) {
    const c = companions[i];
    if (!c.name) return { valid: false, message: `يرجى ملء حقل الاسم في بيانات المرافق رقم ${i+1}` };
    if (!c.identityNumber && !c.id) return { valid: false, message: `يرجى ملء رقم الهوية في بيانات المرافق رقم ${i+1}` };
    if (!c.birthDate) return { valid: false, message: `يرجى ملء تاريخ الميلاد في بيانات المرافق رقم ${i+1}` };
    if (!c.kinship) return { valid: false, message: `يرجى ملء صلة القرابة في بيانات المرافق رقم ${i+1}` };
    if (!c.dateType) return { valid: false, message: `يرجى اختيار نوع تاريخ الميلاد في بيانات المرافق رقم ${i+1}` };
    if (!c.studyLevel) return { valid: false, message: `يرجى اختيار المرحلة الدراسية في بيانات المرافق رقم ${i+1}` };
    if (!c.healthStatus) return { valid: false, message: `يرجى اختيار الحالة الصحية في بيانات المرافق رقم ${i+1}` };
    if (c.healthStatus === "غير سليم" && !c.disabilityType) return { valid: false, message: `يرجى اختيار نوع الإعاقة في بيانات المرافق رقم ${i+1}` };
  }

  return { valid: true };
}

const SignFamily = ({
  userData,
}: {
  userData: UserData | undefined;
}) => {
  const { updateUserData } = useUpdateUserData();
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
  const [companions, setCompanions] = useState<any[]>([]);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>(() => {
    const saved = localStorage.getItem('signFamilyIncomeSources');
    if (saved) return JSON.parse(saved);
    return [];
  });
  const [incomeFiles, setIncomeFiles] = useState<{ [key: string]: File | null }>({});

  const [formData, setFormData] = useState<UserData>(() => {
    const saved = localStorage.getItem(FORM_KEY);
    if (saved) return { ...JSON.parse(saved) };
    return {
      firstName: userData?.firstName || "",
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
          kinship: housemate.kinship || ""
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
            kinship: housemate.kinship || ""
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imagePreviewLabel, setImagePreviewLabel] = useState<string>("");

  const stepIcons = [<FaUser />, <FaHome />, <FaUsers />];

  // --- Load from localStorage on mount ---
  useEffect(() => {
    const savedStep = localStorage.getItem(STEP_KEY);
    if (savedStep) setStep(Number(savedStep));

    const savedDateType = localStorage.getItem(DATETYPE_KEY);
    if (savedDateType === 'هجري' || savedDateType === 'ميلادي') setDateType(savedDateType);

    const savedForm = localStorage.getItem(FORM_KEY);
    if (savedForm) {
      try {
        setFormData(prev => ({ ...prev, ...JSON.parse(savedForm) }));
      } catch {}
    }

    const tempCompanions = localStorage.getItem(TEMP_COMPANIONS_KEY);
    const savedCompanions = localStorage.getItem(COMPANIONS_KEY);
    if (tempCompanions) {
      try {
        const parsedCompanions = JSON.parse(tempCompanions);
        if (Array.isArray(parsedCompanions) && parsedCompanions.length > 0) {
          setCompanions(parsedCompanions);
          setCompanionsCount(parsedCompanions.length);
        }
      } catch {}
    } else if (savedCompanions) {
      try {
        const parsedCompanions = JSON.parse(savedCompanions);
        if (Array.isArray(parsedCompanions) && parsedCompanions.length > 0) {
          setCompanions(parsedCompanions);
          setCompanionsCount(parsedCompanions.length);
        } else {
          const userStr = localStorage.getItem('user');
          if (userStr) {
            try {
              const userObj = JSON.parse(userStr);
              if (Array.isArray(userObj.facilitiesInfo) && userObj.facilitiesInfo.length > 0) {
                setCompanions(userObj.facilitiesInfo);
                setCompanionsCount(userObj.numberOfFacilities || userObj.facilitiesInfo.length);
              }
            } catch {}
          }
        }
      } catch {}
    } else {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          if (Array.isArray(userObj.facilitiesInfo) && userObj.facilitiesInfo.length > 0) {
            setCompanions(userObj.facilitiesInfo);
            setCompanionsCount(userObj.numberOfFacilities || userObj.facilitiesInfo.length);
          }
        } catch {}
      }
    }

    const tempCount = localStorage.getItem(TEMP_COMPANIONS_COUNT_KEY);
    const savedCount = localStorage.getItem(COMPANIONS_COUNT_KEY);
    if (tempCount && Number(tempCount) > 0) {
      setCompanionsCount(Number(tempCount));
    } else if (savedCount && Number(savedCount) > 0) {
      setCompanionsCount(Number(savedCount));
    } else {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          if (typeof userObj.numberOfFacilities === 'number' && userObj.numberOfFacilities > 0) {
            setCompanionsCount(userObj.numberOfFacilities);
          } else if (Array.isArray(userObj.facilitiesInfo) && userObj.facilitiesInfo.length > 0) {
            setCompanionsCount(userObj.facilitiesInfo.length);
          }
        } catch {}
      }
    }

    const tempMale = localStorage.getItem(TEMP_MALE_COUNT_KEY);
    const savedMale = localStorage.getItem(MALE_COUNT_KEY);
    if (tempMale) {
      setMaleCount(Number(tempMale));
    } else if (savedMale) {
      setMaleCount(Number(savedMale));
    } else {
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

    const savedIncomeSources = localStorage.getItem('signFamilyIncomeSources');
    if (savedIncomeSources) {
      try {
        setIncomeSources(JSON.parse(savedIncomeSources));
      } catch {}
    }
  }, []);

  // --- Save to localStorage on change ---
  useEffect(() => {
    localStorage.setItem(FORM_KEY, JSON.stringify(formData));
    localStorage.setItem(BIRTHDATE_KEY, formData.birthDate || "");
  }, [formData]);

  useEffect(() => {
    localStorage.setItem(COMPANIONS_KEY, JSON.stringify(companions));
    localStorage.setItem(TEMP_COMPANIONS_KEY, JSON.stringify(companions));
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
    localStorage.setItem(TEMP_COMPANIONS_COUNT_KEY, companionsCount.toString());
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
    localStorage.setItem(TEMP_MALE_COUNT_KEY, maleCount.toString());
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
    if (formData.birthDate) {
      let ageNum = 0;
      if (dateType === 'ميلادي') {
        const birthDateObj = new Date(formData.birthDate);
        const year = formData.birthDate.split('-')[0];
        if (!isNaN(birthDateObj.getTime()) && year && !isNaN(Number(year))) {
          const today = new Date();
          ageNum = today.getFullYear() - birthDateObj.getFullYear();
          const m = today.getMonth() - birthDateObj.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
            ageNum--;
          }
          setAge(ageNum > 0 ? ageNum.toString() : "");
        } else {
          setAge("");
        }
      } else {
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

  useEffect(() => {
    setCompanions(prev =>
      prev.map(companion => {
        let ageNum = '';
        if (companion.birthDate && companion.dateType) {
          if (companion.dateType === 'ميلادي') {
            const birthDateObj = new Date(companion.birthDate);
            if (!isNaN(birthDateObj.getTime())) {
              const today = new Date();
              let age = today.getFullYear() - birthDateObj.getFullYear();
              const m = today.getMonth() - birthDateObj.getMonth();
              if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
                age--;
              }
              ageNum = age > 0 ? age.toString() : '';
            }
          } else {
            const [hYear] = companion.birthDate.split('-').map(Number);
            if (hYear && !isNaN(hYear)) {
              const hijriYear = getCurrentHijriYear();
              const age = hijriYear - hYear;
              ageNum = age > 0 ? age.toString() : '';
            }
          }
        }
        return { ...companion, age: ageNum };
      })
    );
  }, [companionsCount, companions, dateType]);

  useEffect(() => {
    if (companionsCount > companions.length) {
      const newCompanions = [...companions];
      for (let i = companions.length; i < companionsCount; i++) {
        newCompanions.push({
          name: '',
          id: '',
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

  const handleSubmit = async () => {
    const validation = validateForm(formData, companions, dateType);
    if (!validation.valid) {
      hotToast({ type: "error", message: validation.message || "حدث خطأ غير متوقع" });
      return;
    }

    const formDataToSend = new FormData();
    const housemateToSend = companions.map((h: any) => ({
      name: String(h.name ?? ''),
      identityNumber: String(h.identityNumber ?? h.id ?? ''),
      birthDate: String(h.birthDate ?? ''),
      kinship: String(h.kinship ?? ''),
      dateType: String(h.dateType ?? ''),
      studyLevel: String(h.studyLevel ?? ''),
      healthStatus: String(h.healthStatus ?? ''),
      disabilityType: String(h.disabilityType ?? '')
    }));
    formDataToSend.append('housemate', JSON.stringify(housemateToSend));
    formDataToSend.append('numberOfFacilities', companionsCount.toString());
    formDataToSend.append('numberOfMales', maleCount.toString());

    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'home') {
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
        if (typeof value === 'string') {
          formDataToSend.append(key, value);
        } else if (typeof value === 'number') {
          formDataToSend.append(key, value.toString());
        }
      }
    });
    formDataToSend.append('birthDatetype', dateType);

    const incomeSourcesData = Object.entries(formData.incomeSources || {}).map(([sourceType, sourceAmount]) => ({
      sourceType,
      sourceAmount,
      sourceImage: incomeFiles[sourceType]?.name || ""
    }));
    formDataToSend.append('incomeSources', JSON.stringify(incomeSourcesData));
    Object.entries(incomeFiles).forEach(([sourceType, file]) => {
      if (file) {
        formDataToSend.append(`incomeSources[${sourceType}][sourceImage]`, file);
        formDataToSend.append(`incomeSources[${sourceType}][sourceType]`, sourceType);
      }
    });

    try {
      const result = await updateUserData(formDataToSend);
      if (result.success) {
        hotToast({ type: "success", message: result.message as string });
        localStorage.removeItem(FORM_KEY);
        localStorage.removeItem(COMPANIONS_KEY);
        localStorage.removeItem(COMPANIONS_COUNT_KEY);
        localStorage.removeItem(MALE_COUNT_KEY);
        localStorage.removeItem(FAMILY_CARD_KEY);
        localStorage.removeItem(DATETYPE_KEY);
        localStorage.removeItem(BIRTHDATE_KEY);
        localStorage.removeItem('signFamilyIncomeSources');
        localStorage.removeItem(TEMP_COMPANIONS_KEY);
        localStorage.removeItem(TEMP_COMPANIONS_COUNT_KEY);
        localStorage.removeItem(TEMP_MALE_COUNT_KEY);
      } else {
        hotToast({ type: "error", message: result.error as string });
      }
    } catch (error) {
      hotToast({ type: "error", message: "حدث خطأ أثناء تحديث البيانات" });
    }
  };

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
              <label>ارفاق صورة الهوية</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="file"
                  name="idImagePath"
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
                  {formData.idImagePath ? 'تحديث' : 'رفع ملف'}
                </label>
                {formData.idImagePath && (
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
                      background: '#3182ce',
                      color: '#fff',
                      fontWeight: 500,
                      textAlign: 'center',
                      display: 'inline-block',
                    }}
                    onClick={() => {
                      if (typeof formData.idImagePath === 'string') {
                        setImagePreview(formData.idImagePath);
                      } else if (formData.idImagePath instanceof File) {
                        setImagePreview(URL.createObjectURL(formData.idImagePath));
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
                  onChange={e => setDateType(e.target.value as 'هجري' | 'ميلادي')}
                >
                  <option value="هجري">هجري</option>
                  <option value="ميلادي">ميلادي</option>
                </select>
                {dateType === 'ميلادي' ? (
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                  />
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
                      {Array.from({length: 201}, (_, i) => currentHijriYear - 200 + i).map(y => <option key={y} value={y}>{y}</option>)}
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
              <input type="text" value={age} disabled />
            </div>
            <div className={styles.inputGroup}>
              <label>رقم الجوال</label>
              <input
                type="number"
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
      const totalIncome = Object.values(formData.incomeSources || {}).reduce((acc: number, amount: string) => acc + (parseFloat(amount) || 0), 0);
      return (
        <div className={styles.card}>
          <h2 className={styles.title}>بيانات عامة</h2>
          {isMobile && (
            <div className="mb-6" style={{ textAlign: 'center' }}>
              <ProgressSteps step={step} steps={steps} isMobile={isMobile} stepIcons={stepIcons} />
            </div>
          )}
          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label>مدينة السكن</label>
              <input
                name="cityOfResidence"
                value={formData.cityOfResidence}
                onChange={handleChange}
                placeholder="ما هي مدينة سكنك الحالية؟"
              />
            </div>
            <div className={styles.inputGroup}>
              <label>الحي</label>
              <input
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="اسم الحي"
              />
            </div>
            <div className={styles.inputGroup}>
              <label>نوع السكن</label>
              <select
                name="housingType"
                value={formData.housingType || ""}
                onChange={handleChange}
                required
              >
                <option value="" disabled hidden>اختر نوع السكن</option>
                <option value="ملك">ملك</option>
                <option value="إيجار">إيجار</option>
              </select>
            </div>
            {formData.housingType === "إيجار" && (
              <>
                <div className={styles.inputGroup}>
                  <label>مبلغ الإيجار السنوي</label>
                  <input
                    type="number"
                    name="rentAmount"
                    value={formData.rentAmount}
                    min={0}
                    onChange={handleChange}
                    placeholder="أدخل مبلغ الإيجار بالريال"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>إرفاق عقد الإيجار (صورة أو PDF)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="file"
                      name="rentContractFile"
                      accept="image/*,application/pdf"
                      style={{ display: 'none' }}
                      id="rentContractFileInput"
                      onChange={handleChange}
                    />
                    <label htmlFor="rentContractFileInput" className={styles.fileInputLabel} style={{
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
                      {formData.rentContractFile ? 'تحديث' : 'رفع ملف'}
                    </label>
                    {formData.rentContractFile && (
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
                          background: '#3182ce',
                          color: '#fff',
                          fontWeight: 500,
                          textAlign: 'center',
                          display: 'inline-block',
                        }}
                        onClick={() => {
                          if (typeof formData.rentContractFile === 'string') {
                            setImagePreview(formData.rentContractFile);
                          } else if (formData.rentContractFile instanceof File) {
                            setImagePreview(URL.createObjectURL(formData.rentContractFile));
                          }
                          setImagePreviewLabel('عقد الإيجار');
                        }}
                      >عرض</button>
                    )}
                  </div>
                </div>
              </>
            )}
            <div className={styles.inputGroup} style={{ gridColumn: 'span 3' }}>
              <label style={{ fontWeight: 'bold', fontSize: 17, color: '#2c5282', marginBottom: 10, display: 'block' }}>
                اختر مصادر الدخل السنوية
              </label>
              <div className={styles.incomeSourcesRow} style={{ marginBottom: '20px' }}>
                {incomeOptions.map((opt) => {
                  const isActive = !!formData.incomeSources?.[opt.key];
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
                        minWidth: 140,
                        marginBottom: 8,
                        marginLeft: 8,
                        cursor: 'pointer',
                        borderRadius: 10,
                        padding: '12px 18px',
                        fontWeight: 500,
                        fontSize: 15,
                        transition: 'all 0.2s',
                        position: 'relative'
                      }}
                      onClick={() => toggleIncomeSource(opt.key)}
                    >
                      <span>{opt.label}</span>
                      {isActive && (
                        <span
                          style={{
                            position: 'absolute',
                            top: 4,
                            left: 8,
                            color: '#7ed957',
                            fontWeight: 'bold',
                            fontSize: 18,
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
              {Object.keys(formData.incomeSources || {}).length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '16px',
                  marginTop: '16px',
                  padding: '16px',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  {Object.entries(formData.incomeSources || {}).map(([sourceType, sourceAmount]) => (
                    <div key={sourceType} style={{ display: 'flex', flexDirection: 'column', marginBottom: 12 }}>
                      <label style={{ fontSize: '14px', color: '#4a5a7a', marginBottom: '8px', fontWeight: '500', textAlign: 'right' }}>
                        نوع الدخل
                      </label>
                      <input
                        type="text"
                        value={sourceType}
                        disabled
                        style={{ background: '#f3f4f6', color: '#222', fontWeight: 600 }}
                      />
                      <label style={{ fontSize: '14px', color: '#4a5a7a', margin: '8px 0 4px', fontWeight: '500', textAlign: 'right' }}>
                        مبلغ الدخل (سنويًا)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="أدخل المبلغ بالريال سنويًا"
                        value={sourceAmount}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          incomeSources: { ...prev.incomeSources, [sourceType]: e.target.value }
                        }))}
                      />
                      <label style={{ fontSize: 13, color: '#2c5282', fontWeight: 500, margin: '8px 0 4px' }}>
                        إرفاق مستند الدخل
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          style={{ display: 'none' }}
                          id={`incomeSourceFile_${sourceType}`}
                          onChange={e => {
                            const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                            setIncomeFiles(prev => ({ ...prev, [sourceType]: file }));
                          }}
                        />
                        <label htmlFor={`incomeSourceFile_${sourceType}`} className={styles.fileInputLabel} style={{ cursor: 'pointer', background: '#e2e8f0', padding: '6px 16px', borderRadius: 6, marginTop: 4 }}>
                          {incomeFiles[sourceType] ? 'تحديث' : 'رفع ملف'}
                        </label>
                        {incomeFiles[sourceType] && (
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
                              background: '#3182ce',
                              color: '#fff',
                              fontWeight: 500,
                              textAlign: 'center',
                              display: 'inline-block',
                            }}
                            onClick={() => {
                              if (incomeFiles[sourceType]) {
                                setImagePreview(URL.createObjectURL(incomeFiles[sourceType]!));
                                setImagePreviewLabel(`مستند دخل: ${sourceType}`);
                              }
                            }}
                          >عرض</button>
                        )}
                        {incomeFiles[sourceType] && (
                          <span style={{ color: '#2c5282', fontWeight: 500, fontSize: 13 }}>{incomeFiles[sourceType]!.name}</span>
                        )}
                        {!incomeFiles[sourceType] && <span style={{ color: '#a0aec0', fontSize: 13 }}>لا يوجد ملف</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {Object.keys(formData.incomeSources || {}).length > 0 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  marginTop: '16px',
                  padding: '12px 16px',
                  background: '#e8f4f8',
                  borderRadius: '8px',
                  border: '1px solid #b3d9e6'
                }}>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#2c5282',
                    marginLeft: '12px'
                  }}>
                    إجمالي الدخل السنوي:
                  </span>
                  <span style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#1a365d',
                    background: 'white',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e0'
                  }}>
                    {totalIncome.toLocaleString()} ريال
                  </span>
                </div>
              )}
            </div>
            <div className={styles.inputGroup}>
              <label>البنك</label>
              <select
                name="bankName"
                value={formData.bankName || ""}
                onChange={handleChange}
                required
              >
                <option value="" disabled hidden>اختر البنك</option>
                {saudiBanks.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label>إرفاق صورة الآيبان</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="file"
                  name="ibanImage"
                  accept="image/*,application/pdf"
                  style={{ display: 'none' }}
                  id="ibanImageInput"
                  onChange={handleChange}
                />
                <label htmlFor="ibanImageInput" className={styles.fileInputLabel} style={{
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
                  {formData.ibanImage ? 'تحديث' : 'رفع ملف'}
                </label>
                {formData.ibanImage && (
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
                      background: '#3182ce',
                      color: '#fff',
                      fontWeight: 500,
                      textAlign: 'center',
                      display: 'inline-block',
                    }}
                    onClick={() => {
                      if (typeof formData.ibanImage === 'string') {
                        setImagePreview(formData.ibanImage);
                      } else if (formData.ibanImage instanceof File) {
                        setImagePreview(URL.createObjectURL(formData.ibanImage));
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
          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label>عدد المرافقين</label>
              <select
                value={companionsCount}
                onChange={e => {
                  const val = parseInt(e.target.value) || 0;
                  setCompanionsCount(val);
                  setMaleCount(val);
                }}
              >
                {Array.from({ length: 16 }, (_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            {companionsCount > 0 && (
              <div className={styles.inputGroup}>
                <label>عدد الذكور</label>
                <select
                  value={maleCount}
                  onChange={e => setMaleCount(Number(e.target.value))}
                >
                  {Array.from({ length: companionsCount + 1 }, (_, i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
            )}
            {companionsCount > 0 && (
              <div className={styles.inputGroup}>
                <label>عدد الإناث</label>
                <input
                  type="number"
                  value={companionsCount - maleCount}
                  disabled
                />
              </div>
            )}
            {companionsCount > 0 && (
              <div className={styles.inputGroup} style={{ gridColumn: 'span 3' }}>
                <label>إرفاق كارت العائلة (صورة أو PDF)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="file"
                    name="familyCardFile"
                    accept="image/*,application/pdf"
                    style={{ display: 'none' }}
                    id="familyCardFileInput"
                    onChange={handleChange}
                  />
                  <label htmlFor="familyCardFileInput" className={styles.fileInputLabel} style={{
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
                    {formData.familyCardFile ? 'تحديث' : 'رفع ملف'}
                  </label>
                  {formData.familyCardFile && (
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
                        background: '#3182ce',
                        color: '#fff',
                        fontWeight: 500,
                        textAlign: 'center',
                        display: 'inline-block',
                      }}
                      onClick={() => {
                        if (typeof formData.familyCardFile === 'string') {
                          setImagePreview(formData.familyCardFile);
                        } else if (formData.familyCardFile instanceof File) {
                          setImagePreview(URL.createObjectURL(formData.familyCardFile));
                        }
                        setImagePreviewLabel('كارت العائلة');
                      }}
                    >عرض</button>
                  )}
                </div>
              </div>
            )}
          </div>
          {companionsCount > 0 && companions.length > 0 && (
            <div className={styles.companionsScrollBox} style={{ marginTop: 24 }}>
              {companions.map((companion, idx) => (
                <div key={idx} className={styles.card} style={{ marginBottom: 18, background: '#f9f9fb' }}>
                  <h3 style={{ color: '#4a5a7a', fontWeight: 700, marginBottom: 12 }}>بيانات المرافق {idx + 1}</h3>
                  <div className={styles.grid}>
                    <div className={styles.inputGroup}>
                      <label>الاسم الرباعي</label>
                      <input
                        value={companion.name}
                        onChange={e => {
                          const arr = [...companions];
                          arr[idx].name = e.target.value;
                          setCompanions(arr);
                        }}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>رقم الهوية</label>
                      <input
                        value={companion.id}
                        onChange={e => {
                          const arr = [...companions];
                          arr[idx].id = e.target.value;
                          setCompanions(arr);
                        }}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>تاريخ الميلاد</label>
                      <div className={styles.dateRow}>
                        <select
                          value={companion.dateType}
                          onChange={e => {
                            const arr = [...companions];
                            arr[idx].dateType = e.target.value;
                            arr[idx].birthDate = '';
                            arr[idx].age = '';
                            setCompanions(arr);
                          }}
                          style={{ minWidth: 80 }}
                        >
                          <option value="هجري">هجري</option>
                          <option value="ميلادي">ميلادي</option>
                        </select>
                        {companion.dateType === 'ميلادي' ? (
                          <input
                            type="date"
                            value={companion.birthDate}
                            onChange={e => {
                              const arr = [...companions];
                              arr[idx].birthDate = e.target.value;
                              let ageNum = 0;
                              const birthDateObj = new Date(e.target.value);
                              if (!isNaN(birthDateObj.getTime())) {
                                const today = new Date();
                                ageNum = today.getFullYear() - birthDateObj.getFullYear();
                                const m = today.getMonth() - birthDateObj.getMonth();
                                if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
                                  ageNum--;
                                }
                              }
                              arr[idx].age = ageNum > 0 ? ageNum.toString() : '';
                              setCompanions(arr);
                            }}
                            style={{ flex: 1 }}
                          />
                        ) : (
                          <>
                            <select
                              value={companion.birthDate ? companion.birthDate.split('-')[0] : ''}
                              onChange={e => {
                                const year = e.target.value;
                                const [_, m, d] = companion.birthDate ? companion.birthDate.split('-') : [undefined, '', ''];
                                const arr = [...companions];
                                arr[idx].birthDate = `${year}-${m || ''}-${d || ''}`;
                                let ageNum = 0;
                                if (year) {
                                  const hijriYear = getCurrentHijriYear();
                                  ageNum = hijriYear - parseInt(year);
                                }
                                arr[idx].age = ageNum > 0 ? ageNum.toString() : '';
                                setCompanions(arr);
                              }}
                              style={{ minWidth: 80 }}
                            >
                              <option value="">سنة</option>
                              {Array.from({length: 201}, (_, i) => getCurrentHijriYear() - 200 + i).map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                            <select
                              value={companion.birthDate ? companion.birthDate.split('-')[1] : ''}
                              onChange={e => {
                                const month = e.target.value;
                                const [y, _, d] = companion.birthDate ? companion.birthDate.split('-') : ['', undefined, ''];
                                const arr = [...companions];
                                arr[idx].birthDate = `${y || ''}-${month}-${d || ''}`;
                                setCompanions(arr);
                              }}
                              style={{ minWidth: 80 }}
                            >
                              <option value="">شهر</option>
                              {hijriMonths.map((m, i) => <option key={m} value={i+1}>{m}</option>)}
                            </select>
                            <select
                              value={companion.birthDate ? companion.birthDate.split('-')[2] : ''}
                              onChange={e => {
                                const day = e.target.value;
                                const [y, m, _] = companion.birthDate ? companion.birthDate.split('-') : ['', '', undefined];
                                const arr = [...companions];
                                arr[idx].birthDate = `${y || ''}-${m || ''}-${day}`;
                                setCompanions(arr);
                              }}
                              style={{ minWidth: 60 }}
                            >
                              <option value="">يوم</option>
                              {hijriDays.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                          </>
                        )}
                      </div>
                    </div>
                    <div className={styles.inputGroup}>
                      <label>العمر</label>
                      <input type="text" value={companion.age} disabled />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>المرحلة الدراسية</label>
                      <select
                        value={companion.studyLevel}
                        onChange={e => {
                          const arr = [...companions];
                          arr[idx].studyLevel = e.target.value;
                          arr[idx].studyGrade = '';
                          setCompanions(arr);
                        }}
                      >
                        <option value="">اختر المرحلة</option>
                        <option value="ابتدائي">ابتدائي</option>
                        <option value="متوسط">متوسط</option>
                        <option value="ثانوي">ثانوي</option>
                        <option value="جامعي">جامعي</option>
                      </select>
                    </div>
                    {(companion.studyLevel === 'ابتدائي' || companion.studyLevel === 'متوسط' || companion.studyLevel === 'ثانوي') && (
                      <div className={styles.inputGroup}>
                        <label>الصف</label>
                        <select
                          value={companion.studyGrade}
                          onChange={e => {
                            const arr = [...companions];
                            arr[idx].studyGrade = e.target.value;
                            setCompanions(arr);
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
                    <div className={styles.inputGroup}>
                      <label>الحالة الصحية</label>
                      <select
                        value={companion.healthStatus}
                        onChange={e => {
                          const arr = [...companions];
                          arr[idx].healthStatus = e.target.value;
                          if (e.target.value !== 'غير سليم') arr[idx].disabilityType = '';
                          setCompanions(arr);
                        }}
                      >
                        <option value="">اختر الحالة الصحية</option>
                        <option value="سليم">سليم</option>
                        <option value="غير سليم">غير سليم</option>
                      </select>
                    </div>
                    {companion.healthStatus === 'غير سليم' && (
                      <div className={styles.inputGroup}>
                        <label>نوع الإعاقة</label>
                        <select
                          value={companion.disabilityType}
                          onChange={e => {
                            const arr = [...companions];
                            arr[idx].disabilityType = e.target.value;
                            setCompanions(arr);
                          }}
                        >
                          <option value="">اختر نوع الإعاقة</option>
                          <option value="مريض">مريض</option>
                          <option value="ذوي احتياجات خاصة">ذوي احتياجات خاصة</option>
                        </select>
                      </div>
                    )}
                    <div className={styles.inputGroup}>
                      <label>صلة القرابة</label>
                      <input
                        value={companion.kinship}
                        onChange={e => {
                          const arr = [...companions];
                          arr[idx].kinship = e.target.value;
                          setCompanions(arr);
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

  const incomeOptions = [
    { key: "راتب عادي", label: "راتب عادي" },
    { key: "راتب تقاعدي", label: "راتب تقاعدي" },
    { key: "ضمان اجتماعي", label: "ضمان اجتماعي" },
    { key: "حساب مواطن", label: "حساب مواطن" },
  ];

  const toggleIncomeSource = (sourceType: string) => {
    setFormData((prev) => {
      const newIncomeSources = { ...prev.incomeSources };
      if (newIncomeSources[sourceType]) {
        delete newIncomeSources[sourceType];
      } else {
        newIncomeSources[sourceType] = "";
      }
      return { ...prev, incomeSources: newIncomeSources };
    });
    setIncomeFiles((prev) => {
      const newFiles = { ...prev };
      if (newFiles[sourceType]) {
        delete newFiles[sourceType];
      }
      return newFiles;
    });
  };

  return (
    <div className="lg:!mt-10 container mx-auto lg:px-5" style={{ display: 'flex', direction: 'rtl', flexDirection: isMobile ? 'column' : 'row', alignItems: 'stretch', width: '100%' }}>
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
                    <span>✓</span>
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
      <div className={styles.wrapper} style={{ flex: 1 }}>
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