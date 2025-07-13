import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Dashboard.module.css";
import { useGetAllFinalAccepted } from "../hooks/useGetAllFinalAccepted";
import Modal from "../../../components/Modal";
import { usePersistentState } from "../../../hooks/usePersistentState";
import { ChevronDown, Check } from "lucide-react";

// Custom Select Component
interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  label?: string;
  className?: string;
}

const CustomSelect = ({ value, onChange, options, placeholder = "اختر...", label, className = "" }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<{ value: string; label: string } | null>(
    options.find(opt => opt.value === value) || null
  );

  useEffect(() => {
    setSelectedOption(options.find(opt => opt.value === value) || null);
  }, [value, options]);

  const handleSelect = (option: { value: string; label: string }) => {
    setSelectedOption(option);
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-2 text-right text-gray-700 font-medium shadow-sm hover:border-blue-300 focus:border-blue-500 focus:outline-none transition-all duration-200 flex items-center justify-between"
        >
          <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown 
            size={20} 
            className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
        
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-20 max-h-60 overflow-y-auto">
              {options.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full px-4 py-3 text-right text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150 flex items-center justify-between ${
                    option.value === value ? 'bg-blue-50 text-blue-700 font-medium' : ''
                  } ${index === 0 ? 'rounded-t-xl' : ''} ${index === options.length - 1 ? 'rounded-b-xl' : ''}`}
                >
                  <span>{option.label}</span>
                  {option.value === value && (
                    <Check size={16} className="text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const AcceptedRecords = () => {
  const navigate = useNavigate();
  const [finalAcceptedReports, setFinalAcceptedReports] = useState<any[]>([]);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  const [familyMembersData, setFamilyMembersData] = useState<any[]>([]);
  const [filteredFamilyMembers, setFilteredFamilyMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedComments, setSelectedComments] = useState<any>(null);
  const [showFilters, setShowFilters] = usePersistentState('acceptedRecords_showFilters', false);
  const [identitySearch, setIdentitySearch] = useState(""); // إضافة state للبحث بالرقم القومي
  // Remove this line as viewMode is now from context
  
  // Pagination states
  const [itemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = usePersistentState('acceptedRecords_currentPage', 1);
  const [filters, setFilters] = usePersistentState('acceptedRecords_filters', {
    cityOfResidence: "",
    district: "",
    familyMemberStudyLevel: "",
    familyMemberStudyGrade: "",
    familyMemberHealthStatus: "",
    maritalStatus: "",
    jobStatus: "",
    healthStatus: "",
    dateRange: "all",
    status: "",
    incomeSource: "",
  });
  const [viewMode, setViewMode] = usePersistentState<'beneficiaries' | 'familyMembers'>('acceptedRecords_viewMode', 'beneficiaries');

  useGetAllFinalAccepted({ setFinalAcceptedReports, setLoading });

  // Reset to first page when filters or view mode changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, viewMode, setCurrentPage, identitySearch]);

  // Process family members data
  useEffect(() => {
    if (finalAcceptedReports.length > 0) {
      const familyMembers: any[] = [];
      
      finalAcceptedReports.forEach(report => {
        const user = report.user;
        if (!user || !user.facilitiesInfo) return;

        user.facilitiesInfo.forEach((member: any) => {
          familyMembers.push({
            _id: member._id,
            // Family member info
            name: member.name,
            identityNumber: member.identityNumber,
            birthDate: member.birthDate,
            dateType: member.dateType,
            studyLevel: member.studyLevel,
            studyGrade: member.studyGrade,
            familyMemberHealthStatus: member.healthStatus,
            disabilityType: member.disabilityType,
            kinship: member.kinship,
            // Essential beneficiary info
            beneficiaryName: `${user.firstName || ""} ${user.secondName || ""} ${user.thirdName || ""} ${user.lastName || ""}`.trim(),
            beneficiaryIdentityNumber: user.identityNumber,
            beneficiaryEmail: user.email,
            beneficiaryPhone: user.phone,
            cityOfResidence: user.cityOfResidence,
            district: user.district,
            nationality: user.nationality,
            maritalStatus: user.maritalStatus,
            jobStatus: user.jobStatus,
            healthStatus: user.healthStatus,
            // Report info
            reportStatus: report.reportStatus || report.status,
            createdAt: report.createdAt,
            updatedAt: report.updatedAt,
            comments: report.comments,
          });
        });
      });
      
      setFamilyMembersData(familyMembers);
    }
  }, [finalAcceptedReports]);

  // Apply filters for beneficiaries
  useEffect(() => {
    if (viewMode === 'beneficiaries' && finalAcceptedReports.length > 0) {
      const filtered = finalAcceptedReports.filter(report => {
        const user = report.user;
        if (!user) return false;

        // Identity Number Search Filter
        if (identitySearch && !user.identityNumber?.includes(identitySearch)) {
          return false;
        }

        // Location Filters
        if (filters.cityOfResidence && user.cityOfResidence !== filters.cityOfResidence) {
          return false;
        }
        if (filters.district && user.district !== filters.district) {
          return false;
        }

        // Social Status Filters
        if (filters.maritalStatus && user.maritalStatus !== filters.maritalStatus) {
          return false;
        }
        if (filters.jobStatus && user.jobStatus !== filters.jobStatus) {
          return false;
        }
        if (filters.healthStatus && user.healthStatus !== filters.healthStatus) {
          return false;
        }

        // Date Range Filter
        if (filters.dateRange && filters.dateRange !== 'all') {
          const reportDate = new Date(report.createdAt);
          const now = new Date();
          let fromDate: Date | null = null;
          if (filters.dateRange === 'week') {
            fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
          } else if (filters.dateRange === 'month') {
            fromDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          } else if (filters.dateRange === 'year') {
            fromDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          }
          if (fromDate && reportDate < fromDate) {
            return false;
          }
        }

        // Status Filter
        if (filters.status && (report.reportStatus || report.status) !== filters.status) {
          return false;
        }

        // Income Filters
        if (filters.incomeSource) {
          const hasMatchingIncome = user.incomeSources?.some((income: any) => {
            return income.sourceType === filters.incomeSource;
          });
          if (!hasMatchingIncome) return false;
        }

        return true;
      });
      setFilteredReports(filtered);
    }
  }, [filters, finalAcceptedReports, viewMode, identitySearch]);

  // Apply filters for family members
  useEffect(() => {
    if (viewMode === 'familyMembers' && familyMembersData.length > 0) {
      const filtered = familyMembersData.filter(member => {
        // Identity Number Search Filter (for both member and beneficiary)
        if (identitySearch && 
            !member.identityNumber?.includes(identitySearch) && 
            !member.beneficiaryIdentityNumber?.includes(identitySearch)) {
          return false;
        }

        // Location Filters (based on beneficiary location)
        if (filters.cityOfResidence && member.cityOfResidence !== filters.cityOfResidence) {
          return false;
        }
        if (filters.district && member.district !== filters.district) {
          return false;
        }

        // Family Member Filters
        if (filters.familyMemberStudyLevel && member.studyLevel !== filters.familyMemberStudyLevel) {
          return false;
        }
        if (filters.familyMemberStudyGrade && member.studyGrade?.toString() !== filters.familyMemberStudyGrade) {
          return false;
        }
        if (filters.familyMemberHealthStatus && member.familyMemberHealthStatus !== filters.familyMemberHealthStatus) {
          return false;
        }

        // Social Status Filters (based on beneficiary)
        if (filters.maritalStatus && member.maritalStatus !== filters.maritalStatus) {
          return false;
        }
        if (filters.jobStatus && member.jobStatus !== filters.jobStatus) {
          return false;
        }
        if (filters.healthStatus && member.healthStatus !== filters.healthStatus) {
          return false;
        }

        // Date Range Filter
        if (filters.dateRange && filters.dateRange !== 'all') {
          const reportDate = new Date(member.createdAt);
          const now = new Date();
          let fromDate: Date | null = null;
          if (filters.dateRange === 'week') {
            fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
          } else if (filters.dateRange === 'month') {
            fromDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          } else if (filters.dateRange === 'year') {
            fromDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          }
          if (fromDate && reportDate < fromDate) {
            return false;
          }
        }

        // Status Filter
        if (filters.status && member.reportStatus !== filters.status) {
          return false;
        }

        // Income Filters (based on beneficiary)
        if (filters.incomeSource) {
          // This would need to be handled differently since we don't have income data in family members
          // For now, we'll skip this filter for family members
        }

        return true;
      });
      setFilteredFamilyMembers(filtered);
    }
  }, [filters, familyMembersData, viewMode, identitySearch]);

  // Pagination calculations
  const getCurrentData = () => {
    if (viewMode === 'beneficiaries') {
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      return filteredReports.slice(indexOfFirstItem, indexOfLastItem);
    } else {
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      return filteredFamilyMembers.slice(indexOfFirstItem, indexOfLastItem);
    }
  };

  const getTotalPages = () => {
    if (viewMode === 'beneficiaries') {
      return Math.ceil(filteredReports.length / itemsPerPage);
    } else {
      return Math.ceil(filteredFamilyMembers.length / itemsPerPage);
    }
  };

  const getTotalItems = () => {
    if (viewMode === 'beneficiaries') {
      return filteredReports.length;
    } else {
      return filteredFamilyMembers.length;
    }
  };

  const getTotalAllItems = () => {
    if (viewMode === 'beneficiaries') {
      return finalAcceptedReports.length;
    } else {
      return familyMembersData.length;
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "accepted_manager":
      case "approved":
      case "accepted":
        return "اعتماد كلي";
      case "rejected_manager":
      case "rejected":
        return "رفض كلي";
      default:
        return "قيد المراجعة";
    }
  };

  const getStatusButtonClass = (status: string) => {
    switch (status) {
      case "accepted_manager":
      case "approved":
      case "accepted":
        return "bg-green-600 text-white px-3 py-1 rounded-full font-bold text-sm border-none";
      case "rejected_manager":
      case "rejected":
        return "bg-red-600 text-white px-3 py-1 rounded-full font-bold text-sm border-none";
      default:
        return "bg-gray-300 text-gray-700 px-3 py-1 rounded-full font-bold text-sm border-none";
    }
  };

  const hasComments = (comments: any) => {
    return comments?.reviewer?.comment || comments?.committee?.comment || comments?.manager?.comment;
  };

  const closeCommentsModal = () => {
    setShowCommentsModal(false);
    setSelectedComments(null);
  };

  const clearFilters = () => {
    setFilters({
      cityOfResidence: "",
      district: "",
      familyMemberStudyLevel: "",
      familyMemberStudyGrade: "",
      familyMemberHealthStatus: "",
      maritalStatus: "",
      jobStatus: "",
      healthStatus: "",
      dateRange: "all",
      status: "",
      incomeSource: "",
    });
    setIdentitySearch(""); // Clear identity search when filters are cleared
  };

  const handleRowClick = (reportId: string) => {
    if (reportId) {
      navigate(`/dashboard/beneficiary/${reportId}`);
    }
  };

  // Get unique values for dropdowns
  const getUniqueValues = (field: string) => {
    const values = new Set();
    
    if (viewMode === 'beneficiaries') {
      finalAcceptedReports.forEach(report => {
        const user = report.user;
        if (!user) return;

        if (field === 'cityOfResidence' && user.cityOfResidence) {
          values.add(user.cityOfResidence);
        } else if (field === 'district' && user.district) {
          values.add(user.district);
        } else if (field === 'maritalStatus' && user.maritalStatus) {
          values.add(user.maritalStatus);
        } else if (field === 'jobStatus' && user.jobStatus) {
          values.add(user.jobStatus);
        } else if (field === 'healthStatus' && user.healthStatus) {
          values.add(user.healthStatus);
        } else if (field === 'status') {
          values.add(report.reportStatus || report.status);
        } else if (field === 'incomeSource') {
          user.incomeSources?.forEach((income: any) => {
            if (income.sourceType) values.add(income.sourceType);
          });
        }
      });
    } else {
      familyMembersData.forEach(member => {
        if (field === 'cityOfResidence' && member.cityOfResidence) {
          values.add(member.cityOfResidence);
        } else if (field === 'district' && member.district) {
          values.add(member.district);
        } else if (field === 'maritalStatus' && member.maritalStatus) {
          values.add(member.maritalStatus);
        } else if (field === 'jobStatus' && member.jobStatus) {
          values.add(member.jobStatus);
        } else if (field === 'healthStatus' && member.healthStatus) {
          values.add(member.healthStatus);
        } else if (field === 'status') {
          values.add(member.reportStatus);
        } else if (field === 'studyLevel') {
          if (member.studyLevel) values.add(member.studyLevel);
        } else if (field === 'studyGrade') {
          if (member.studyGrade) values.add(member.studyGrade.toString());
        } else if (field === 'familyMemberHealthStatus') {
          if (member.familyMemberHealthStatus) values.add(member.familyMemberHealthStatus);
        }
      });
    }
    
    return Array.from(values).sort();
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const totalPages = getTotalPages();
    const currentPageNum = currentPage;
    const pageNumbers = [];

    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show first page, last page, current page, and 2 pages around current
      if (currentPageNum <= 4) {
        // Near the beginning
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPageNum >= totalPages - 3) {
        // Near the end
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // In the middle
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPageNum - 1; i <= currentPageNum + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <>
     <div className={styles.card}>
      <div className="flex justify-between items-center mb-6 flex-col md:flex-row gap-4">
        <div>
          <h1 className={styles.detailsTitle + " !text-black xl:text-3xl font-bold"}>السجل</h1>
          <p className="text-gray-600 mt-2">عرض جميع المستفيدين المقبولين والمرافقين</p>
        </div>
        
        <div className="flex flex-col gap-4">
          {/* Identity Search - Above other buttons */}
          <div className="flex items-center gap-2 justify-end">
            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
              🔍 بحث برقم الهوية:
            </label>
            <input
              type="text"
              value={identitySearch}
              onChange={(e) => setIdentitySearch(e.target.value)}
              placeholder="اكتب رقم الهوية..."
              className="w-48 bg-white border-2 border-gray-200 rounded-xl px-3 py-2 text-gray-700 font-medium shadow-sm hover:border-blue-300 focus:border-blue-500 focus:outline-none transition-all duration-200"
            />
          </div>

          {/* View Mode Toggle and Filters Button */}
          <div className="flex items-center gap-4 justify-center md:justify-end">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-200  rounded-lg">
              <button
                onClick={() => setViewMode('beneficiaries')}
                className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                  viewMode === 'beneficiaries' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                المستفيدين ({finalAcceptedReports.length})
              </button>
              <button
                onClick={() => setViewMode('familyMembers')} 
                className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                  viewMode === 'familyMembers' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                المرافقين ({familyMembersData.length})
              </button>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 !hidden  hover:from-blue-700 hover:to-blue-800 md:!block text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105  items-center gap-2"
            >
              <span>{showFilters ? "👁️ " : "🔍 "}</span>
              {showFilters ? "إخفاء الفلاتر" : "عرض الفلاتر"}
            </button>
          </div>
        </div>
        <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 mt-5  md:!hidden text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 !flex items-center justify-center gap-2"
          >
            <span>{showFilters ? "👁️ " : "🔍 "}</span>
            {showFilters ? "إخفاء الفلاتر" : "عرض الفلاتر"}
          </button>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 px-8 py-4 rounded-2xl mb-8 border border-blue-200 shadow-lg">
          {/* <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🔍</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">فلاتر البحث</h3>
          </div> */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {/* Status Filter */}
             <CustomSelect
               value={filters.status}
               onChange={(value) => setFilters({...filters, status: value})}
               options={[
                 { value: "", label: "الكل" },
                 ...getUniqueValues('status').map((value: any) => ({
                   value: value,
                   label: getStatusText(value)
                 }))
               ]}
               label="الحالة النهائية"
               placeholder="اختر الحالة"
             />
             
             {/* Date Range Filter */}
             <CustomSelect
               value={filters.dateRange}
               onChange={(value) => setFilters({ ...filters, dateRange: value })}
               options={[
                 { value: "all", label: "كل الأوقات" },
                 { value: "week", label: "آخر أسبوع" },
                 { value: "month", label: "آخر شهر" },
                 { value: "year", label: "آخر سنة" }
               ]}
               label="المدة"
               placeholder="اختر المدة"
             />
             
            {/* Location Filters */}
            <CustomSelect
              value={filters.cityOfResidence}
              onChange={(value) => setFilters({...filters, cityOfResidence: value})}
              options={[
                { value: "", label: "الكل" },
                ...getUniqueValues('cityOfResidence').map((value: any) => ({
                  value: value,
                  label: value
                }))
              ]}
              label="المدينة"
              placeholder="اختر المدينة"
            />
          
            <CustomSelect
              value={filters.district}
              onChange={(value) => setFilters({...filters, district: value})}
              options={[
                { value: "", label: "الكل" },
                ...getUniqueValues('district').map((value: any) => ({
                  value: value,
                  label: value
                }))
              ]}
              label="الحي"
              placeholder="اختر الحي"
            />

            {/* Family Members Filters - Only show when viewing family members */}
            {viewMode === 'familyMembers' && (
              <>
                <CustomSelect
                  value={filters.familyMemberStudyLevel}
                  onChange={(value) => setFilters({...filters, familyMemberStudyLevel: value})}
                  options={[
                    { value: "", label: "الكل" },
                    ...getUniqueValues('studyLevel').map((value: any) => ({
                      value: value,
                      label: value
                    }))
                  ]}
                  label="المستوى الدراسي"
                  placeholder="اختر المستوى"
                />
                <CustomSelect
                  value={filters.familyMemberStudyGrade}
                  onChange={(value) => setFilters({...filters, familyMemberStudyGrade: value})}
                  options={[
                    { value: "", label: "الكل" },
                    ...getUniqueValues('studyGrade').map((value: any) => ({
                      value: value,
                      label: value
                    }))
                  ]}
                  label="الصف الدراسي"
                  placeholder="اختر الصف"
                />
                <CustomSelect
                  value={filters.familyMemberHealthStatus}
                  onChange={(value) => setFilters({...filters, familyMemberHealthStatus: value})}
                  options={[
                    { value: "", label: "الكل" },
                    ...getUniqueValues('familyMemberHealthStatus').map((value: any) => ({
                      value: value,
                      label: value
                    }))
                  ]}
                  label="الحالة الصحية للمرافق"
                  placeholder="اختر الحالة"
                />
              </>
            )}
           

            {/* Social Status Filters - Only show when viewing beneficiaries */}
            {viewMode === 'beneficiaries' && (
              <>
                <CustomSelect
                  value={filters.maritalStatus}
                  onChange={(value) => setFilters({...filters, maritalStatus: value})}
                  options={[
                    { value: "", label: "الكل" },
                    ...getUniqueValues('maritalStatus').map((value: any) => ({
                      value: value,
                      label: value
                    }))
                  ]}
                  label="الحالة الزوجية"
                  placeholder="اختر الحالة"
                />
                <CustomSelect
                  value={filters.jobStatus}
                  onChange={(value) => setFilters({...filters, jobStatus: value})}
                  options={[
                    { value: "", label: "الكل" },
                    ...getUniqueValues('jobStatus').map((value: any) => ({
                      value: value,
                      label: value
                    }))
                  ]}
                  label="الوضع الوظيفي"
                  placeholder="اختر الوضع"
                />
                <CustomSelect
                  value={filters.healthStatus}
                  onChange={(value) => setFilters({...filters, healthStatus: value})}
                  options={[
                    { value: "", label: "الكل" },
                    ...getUniqueValues('healthStatus').map((value: any) => ({
                      value: value,
                      label: value
                    }))
                  ]}
                  label="الحالة الصحية للمستفيد"
                  placeholder="اختر الحالة"
                />
              </>
            )}

            {/* Income Filters - Only show when viewing beneficiaries */}
            {viewMode === 'beneficiaries' && (
              <CustomSelect
                value={filters.incomeSource}
                onChange={(value) => setFilters({...filters, incomeSource: value})}
                options={[
                  { value: "", label: "الكل" },
                  ...getUniqueValues('incomeSource').map((value: any) => ({
                    value: value,
                    label: value
                  }))
                ]}
                label="مصدر الدخل"
                placeholder="اختر المصدر"
              />
            )}
          </div>

          {/* Filter Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt- pt-3 border-t border-blue-200">
            <button
              onClick={clearFilters}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center  text-[15px] md:text-[18px] justify-center gap-2"
            >
              <span>🗑️</span>
              مسح جميع الفلاتر
            </button>
            <div className="bg-white px-6 py-3 rounded-xl border border-blue-200 shadow-sm flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                النتائج: <span className="text-blue-600 font-bold">{getTotalItems()}</span> من <span className="text-gray-900 font-bold">{getTotalAllItems()}</span>
              </span>
            </div>
          </div>
        </div>
      )}

      <div className={styles.tableContainer}>
        {loading ? (
          <div className="text-center py-8">جاري تحميل البيانات...</div>
        ) : viewMode === 'beneficiaries' ? (
          filteredReports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {finalAcceptedReports.length === 0 ? "لا توجد بيانات تقارير مقبولة" : "لا توجد نتائج تطابق الفلاتر المحددة"}
            </div>
          ) : (
            <>
              <table className={styles.table}>
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-nowrap font-semibold text-gray-700">اسم المستفيد</th>
                    <th className="text-nowrap font-semibold text-gray-700">رقم الهوية</th>
                    <th className="text-nowrap font-semibold text-gray-700">البريد الإلكتروني</th>
                    <th className="text-nowrap font-semibold text-gray-700">تاريخ الطلب</th>
                    <th className="text-nowrap font-semibold text-gray-700">الحالة النهائية</th>
                    <th className="text-nowrap font-semibold text-gray-700">التعليقات</th>
                    <th className="text-nowrap font-semibold text-gray-700">تاريخ آخر إجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentData().map((item, idx) => (
                    <tr
                      key={item._id || idx}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleRowClick(item._id)}
                      className="hover:bg-blue-50 transition-colors duration-200 border-b border-gray-200"
                    >
                                              <td className="text-nowrap py-3">
                          <span className="font-medium text-gray-900">
                            {`${item.user?.firstName || ""} ${item.user?.secondName || ""}`.trim() || "-"}
                          </span>
                        </td>
                        <td className="text-nowrap py-3">
                          <span className="font-mono text-gray-700">{item.user?.identityNumber || "-"}</span>
                        </td>
                        <td className="text-nowrap py-3">
                          <span className="text-blue-600 hover:text-blue-800">{item.user?.email || "-"}</span>
                        </td>
                        <td className="text-nowrap py-3">
                          <span className="text-gray-600">
                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString("ar-EG") : "-"}
                          </span>
                        </td>
                                              <td className="text-nowrap py-3">
                          <button
                            className={getStatusButtonClass(item.reportStatus || item.status)}
                            style={{ pointerEvents: "none" }}
                          >
                            {getStatusText(item.reportStatus || item.status)}
                          </button>
                        </td>
                        <td className="text-nowrap py-3">
                          {hasComments(item.comments) ? (
                            <button
                              className={styles.searchButton}
                              style={{ fontSize: 12, padding: "4px 10px" }}
                              onClick={e => {
                                e.stopPropagation();
                                setSelectedComments(item.comments);
                                setShowCommentsModal(true);
                              }}
                            >
                              عرض التعليقات
                            </button>
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                        <td className="text-nowrap py-3">
                          <span className="text-gray-600">
                            {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString("ar-EG") : "-"}
                          </span>
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
           
            </>
          )
        ) : (
          // Family Members View
          filteredFamilyMembers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {familyMembersData.length === 0 ? "لا توجد بيانات مرافقين" : "لا توجد نتائج تطابق الفلاتر المحددة"}
            </div>
          ) : (
            <>
              <table className={styles.table}>
                <thead>
                  <tr className="bg-gray-50">
                    <th className="font-semibold text-gray-700">اسم المرافق</th>
                    <th className="font-semibold text-gray-700">رقم الهوية</th>
                    <th className="font-semibold text-gray-700">صلة القرابة</th>
                    <th className="font-semibold text-gray-700">المستوى الدراسي</th>
                    <th className="font-semibold text-gray-700">الصف</th>
                    <th className="font-semibold text-gray-700">الحالة الصحية</th>
                    <th className="font-semibold text-gray-700">اسم المستفيد</th>
                    <th className="font-semibold text-gray-700">رقم هوية المستفيد</th>
                    <th className="font-semibold text-gray-700">المدينة</th>
                    <th className="font-semibold text-gray-700">الحي</th>
                    <th className="font-semibold text-gray-700">الحالة النهائية</th>
                    <th className="font-semibold text-gray-700">التعليقات</th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentData().map((member, idx) => (
                    <tr
                      key={member._id || idx}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleRowClick(member._id)}
                      className="hover:bg-blue-50 transition-colors duration-200 border-b border-gray-200"
                    >
                      <td className="!text-nowrap py-3">
                        <span className="font-medium text-gray-900">{member.name || "-"}</span>
                      </td>
                      <td className="!text-nowrap py-3">
                        <span className="font-mono text-gray-700">{member.identityNumber || "-"}</span>
                      </td>
                      <td className="!text-nowrap py-3">
                        <span className="text-gray-700">{member.kinship || "-"}</span>
                      </td>
                      <td className="!text-nowrap py-3">
                        <span className="text-gray-700">{member.studyLevel || "-"}</span>
                      </td>
                      <td className="!text-nowrap py-3">
                        <span className="text-gray-700">{member.studyGrade || "-"}</span>
                      </td>
                      <td className="!text-nowrap py-3">
                        <span className="text-gray-700">{member.familyMemberHealthStatus || "-"}</span>
                      </td>
                      <td className="!text-nowrap py-3">
                        <span className="font-medium text-blue-600">{member.beneficiaryName || "-"}</span>
                      </td>
                      <td className="!text-nowrap py-3">
                        <span className="font-mono text-gray-700">{member.beneficiaryIdentityNumber || "-"}</span>
                      </td>
                      <td className="!text-nowrap py-3">
                        <span className="text-gray-700">{member.cityOfResidence || "-"}</span>
                      </td>
                      <td className="!text-nowrap py-3">
                        <span className="text-gray-700">{member.district || "-"}</span>
                      </td>
                      <td className="!text-nowrap py-3">
                        <button
                          className={getStatusButtonClass(member.reportStatus)}
                          style={{ pointerEvents: "none" }}
                        >
                          {getStatusText(member.reportStatus)}
                        </button>
                      </td>
                      <td className="py-3">
                        {hasComments(member.comments) ? (
                          <button
                            className={styles.searchButton}
                            style={{ fontSize: 12, padding: "4px 10px" }}
                            onClick={e => {
                              e.stopPropagation();
                              setSelectedComments(member.comments);
                              setShowCommentsModal(true);
                            }}
                          >
                            عرض التعليقات
                          </button>
                        ) : (
                          <span>-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {getTotalPages() > 1 && (
                <div className="flex justify-between items-center mt-6 px-4">
                  <div className="text-sm text-gray-600">
                    عرض {((currentPage - 1) * itemsPerPage) + 1} إلى {Math.min(currentPage * itemsPerPage, getTotalItems())} من {getTotalItems()} نتيجة
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      السابق
                    </button>
                    
                    {getPageNumbers().map((pageNumber, index) => (
                      <button
                        key={index}
                        onClick={() => typeof pageNumber === 'number' ? handlePageChange(pageNumber) : null}
                        disabled={pageNumber === '...'}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          pageNumber === currentPage
                            ? 'bg-blue-600 text-white'
                            : pageNumber === '...'
                            ? 'text-gray-400 cursor-default'
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === getTotalPages()}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      التالي
                    </button>
                  </div>
                </div>
              )}
            </>
          )
        )}
      </div>
      <Modal isOpen={showCommentsModal && !!selectedComments} onClose={closeCommentsModal}>
        <span className="text-5xl mb-2">💬</span>
        <h3 className="text-2xl font-bold text-gray-800 mb-6">التعليقات</h3>
        <div className="space-y-6 w-full">
          {selectedComments?.reviewer?.comment && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-600 text-lg">👤</span>
                <span className="font-semibold text-gray-800">المراجع</span>
                {selectedComments.reviewer.name && (
                  <span className="text-sm text-gray-600">({selectedComments.reviewer.name})</span>
                )}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {selectedComments.reviewer.comment}
              </p>
            </div>
          )}
          {selectedComments?.committee?.comment && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-600 text-lg">🏛️</span>
                <span className="font-semibold text-gray-800">اللجنة</span>
                {selectedComments.committee.name && (
                  <span className="text-sm text-gray-600">({selectedComments.committee.name})</span>
                )}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {selectedComments.committee.comment}
              </p>
            </div>
          )}
          {selectedComments?.manager?.comment && (
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-600 text-lg">👨‍💼</span>
                <span className="font-semibold text-gray-800">المدير</span>
                {selectedComments.manager.name && (
                  <span className="text-sm text-gray-600">({selectedComments.manager.name})</span>
                )}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {selectedComments.manager.comment}
              </p>
            </div>
          )}
          {!hasComments(selectedComments) && (
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl mb-2 block">💬</span>
              <p>لا توجد تعليقات متاحة</p>
            </div>
          )}
        </div>
        <button
          onClick={closeCommentsModal}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-300"
        >
          إغلاق
        </button>
      </Modal>
    </div>
    {getTotalPages() > 1 && (
                <div className="flex justify-between items-center mt-6 px-4 flex-col-reverse  md:flex-row">
                  <div className="text-sm text-gray-600 my-5">
                    عرض {((currentPage - 1) * itemsPerPage) + 1} إلى {Math.min(currentPage * itemsPerPage, getTotalItems())} من {getTotalItems()} نتيجة
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      السابق
                    </button>
                    
                    {getPageNumbers().map((pageNumber, index) => (
                      <button
                        key={index}
                        onClick={() => typeof pageNumber === 'number' ? handlePageChange(pageNumber) : null}
                        disabled={pageNumber === '...'}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          pageNumber === currentPage
                            ? 'bg-blue-600 text-white'
                            : pageNumber === '...'
                            ? 'text-gray-400 cursor-default'
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === getTotalPages()}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      التالي
                    </button>
                  </div>
                </div>
              )}
    </>
   
  );
};

export default AcceptedRecords; 