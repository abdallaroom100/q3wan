import { useState, useEffect, useCallback } from 'react';

// Types (copy from your main file or import if available)
export type Housemate = {
  name: string;
  birthDate: string;
  identityNumber: string;
  gender: 'ذكر' | 'أنثى';
  kinship: string;
};

export type Home = {
  homeNickname: string;
  city: string;
  district: string;
  housemates: Housemate[];
  addtionalHomes?: Home[];
};

export interface UserData {
  firstName: string;
  secondName: string;
  thirdName: string;
  lastName: string;
  email: string;
  identityNumber: string;
  nationality: string;
  gender: 'ذكر' | 'أنثى';
  phone: string;
  birthDate: string;
  maritalStatus: string;
  idImagePath: string | File | null;
  cityOfResidence: string;
  jobStatus?: 'عاطل' | 'موظف';
  healthStatus?: 'سليم' | 'غير سليم';
  disabilityType?: 'مريض' | 'ذوي احتياجات خاصة';
  home?: Home;
  district?: string;
  housingType?: 'ملك' | 'إيجار';
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
  rentImage?: string;
  facilitiesInfo?: any[];
}

export interface IncomeSource {
  sourceType: string;
  sourceAmount: string;
  sourceImage: File | null;
}

const FORM_KEY = 'signFamilyFormData';
const COMPANIONS_KEY = 'signFamilyCompanions';
const STEP_KEY = 'signFamilyStep';

export function useFamilyForm(userData?: UserData) {
  // --- State ---
  const [formData, setFormData] = useState<UserData>(() => {
    const saved = localStorage.getItem(FORM_KEY);
    if (saved) return JSON.parse(saved);
    if (userData) {
      return {
        ...userData,
        housemate: Array.isArray(userData.facilitiesInfo) && userData.facilitiesInfo.length > 0 ? userData.facilitiesInfo : null,
      };
    }
    return {} as UserData;
  });
  const [companions, setCompanions] = useState<any[]>(() => {
    const saved = localStorage.getItem(COMPANIONS_KEY);
    if (saved) return JSON.parse(saved);
    return [];
  });
  const [step, setStep] = useState(() => {
    const saved = localStorage.getItem(STEP_KEY);
    return saved ? Number(saved) : 1;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);

  // --- Effects: Save to localStorage ---
  useEffect(() => {
    localStorage.setItem(FORM_KEY, JSON.stringify(formData));
  }, [formData]);
  useEffect(() => {
    localStorage.setItem(COMPANIONS_KEY, JSON.stringify(companions));
  }, [companions]);
  useEffect(() => {
    localStorage.setItem(STEP_KEY, String(step));
  }, [step]);

  // تحديث formData عند تغير userData (لو المستخدم لم يعدل بعد)
  useEffect(() => {
    const saved = localStorage.getItem(FORM_KEY);
    if (!saved && userData) {
      setFormData({
        ...userData,
        housemate: Array.isArray(userData.facilitiesInfo) && userData.facilitiesInfo.length > 0 ? userData.facilitiesInfo : null,
      });
    }
  }, [userData]);

  // --- Handlers ---
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;
    setFormData(prev => ({
      ...prev,
      [name]: files[0],
    }));
  }, []);

  const handleNext = useCallback(() => setStep(s => Math.min(s + 1, 3)), []);
  const handleBack = useCallback(() => setStep(s => Math.max(s - 1, 1)), []);

  // --- Validation ---
  const validateForm = useCallback((userDataArg?: UserData) => {
    // يمكنك تخصيص الحقول المطلوبة هنا
    const requiredFields = [
      'firstName', 'secondName', 'thirdName', 'lastName', 'identityNumber', 'nationality', 'gender', 'phone', 'birthDate', 'maritalStatus',
      'cityOfResidence', 'jobStatus', 'healthStatus', 'district', 'housingType', 'bankName'
    ];
    for (const key of requiredFields) {
      const value = formData[key as keyof UserData] ?? userDataArg?.[key as keyof UserData] ?? '';
      if (!value || value === '') {
        return `يرجى ملء حقل ${key}`;
      }
    }
    // تحقق إضافي لنوع الإعاقة
    if ((formData.healthStatus ?? userDataArg?.healthStatus) === 'غير سليم') {
      if (!formData.disabilityType && !userDataArg?.disabilityType) {
        return 'يرجى اختيار نوع الإعاقة';
      }
    }
    // تحقق مبلغ الإيجار إذا كان نوع السكن إيجار
    if ((formData.housingType ?? userDataArg?.housingType) === 'إيجار') {
      if (!formData.rentAmount && !userDataArg?.rentAmount) {
        return 'يرجى إدخال مبلغ الإيجار';
      }
    }
    return null;
  }, [formData]);

  // --- Submit ---
  const handleSubmit = useCallback(async (onSubmit: (data: UserData) => Promise<any>) => {
    setIsLoading(true);
    setErrors(null);
    const error = validateForm(userData);
    if (error) {
      setErrors(error);
      setIsLoading(false);
      return false;
    }
    try {
      await onSubmit(formData);
      // يمكن هنا مسح localStorage أو إعادة تعيين النموذج
      // localStorage.removeItem(FORM_KEY);
      // localStorage.removeItem(COMPANIONS_KEY);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      setErrors(err.message || 'حدث خطأ');
      setIsLoading(false);
      return false;
    }
  }, [formData, userData, validateForm]);

  // --- Reset ---
  const resetForm = useCallback(() => {
    setFormData(userData ? { ...userData } : ({} as UserData));
    setCompanions([]);
    setStep(1);
    setErrors(null);
    localStorage.removeItem(FORM_KEY);
    localStorage.removeItem(COMPANIONS_KEY);
    localStorage.removeItem(STEP_KEY);
  }, [userData]);

  // --- File/Image Preview Helper ---
  const getFilePreview = useCallback((field: keyof UserData) => {
    const file = formData[field];
    if (file && typeof file !== 'string') {
      return URL.createObjectURL(file as File);
    }
    if (typeof file === 'string') {
      return file;
    }
    return null;
  }, [formData]);

  return {
    formData, setFormData,
    companions, setCompanions,
    step, setStep,
    isLoading, errors,
    handleInputChange, handleFileChange,
    handleNext, handleBack,
    handleSubmit, validateForm,
    resetForm,
    getFilePreview,
  };
} 