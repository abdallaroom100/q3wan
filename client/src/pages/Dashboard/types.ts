export interface Housemate {
  name: string;
  birthDate: string;
  identityNumber: string;
  gender: "ذكر" | "أنثى";
  kinship: string;
  studyLevel?: string;
  healthStatus?: "سليم" | "غير سليم";
  disabilityType?: "مريض" | "ذوي احتياجات خاصة";
  dateType?: 'هجري' | 'ميلادي';
}

export interface Home {
  homeNickname: string;
  city: string;
  district: string;
  housemates: Housemate[];
}

export interface IncomeSource {
  sourceType: string;
  sourceAmount: string;
  sourceImage: string | null;
}

export interface Beneficiary {
  id: string;
  firstName: string;
  secondName: string;
  thirdName: string;
  lastName: string;
  fullName: string;
  email: string;
  identityNumber: string;
  nationality: string;
  gender: "ذكر" | "أنثى";
  phone: string;
  birthDate: string;
  dateType: 'هجري' | 'ميلادي';
  maritalStatus: string;
  idImagePath: string;
  cityOfResidence: string;
  district: string;
  housingType: "ملك" | "إيجار";
  rentAmount?: string;
  rentContractFile?: string;
  familyCardFile?: string;
  jobStatus?: "عاطل" | "موظف";
  healthStatus?: "سليم" | "غير سليم";
  disabilityType?: "مريض" | "ذوي احتياجات خاصة";
  bankName?: string;
  ibanImage?: string;
  numberOfFacilities?: number;
  numberOfMales?: number;
  housemates: Housemate[];
  incomeSources: IncomeSource[];
  requestDate: string;
  status: "pending" | "approved" | "rejected";
  companions: string;
}

export interface RequestHistory {
  id: number;
  userId: string;
  name: string;
  role: string;
  decision: string;
  date: string;
}

export interface ReportData {
  id: number;
  beneficiaryName: string;
  identityNumber: string;
  requestDate: string;
  status: "approved" | "rejected" | "pending";
  executor: string;
  actionType: string;
  actionDate: string;
  rejectionReason: string;
}

export interface EditableReportData {
  id: number;
  beneficiaryName: string;
  identityNumber: string;
  phone: string;
  email: string;
  status: "approved" | "rejected" | "pending";
  executor: string;
  editDate: string;
}

export interface AdminData {
  fullName: string;
  phone: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
} 