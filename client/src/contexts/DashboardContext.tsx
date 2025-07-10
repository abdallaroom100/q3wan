import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DashboardState {
  activeTab: string;
  processFlowState: {
    currentPage: number;
    filters: any;
  };
  acceptedRecordsState: {
    currentPage: number;
    filters: any;
    viewMode: 'beneficiaries' | 'familyMembers';
  };
  beneficiariesListState: {
    currentPage: number;
    filters: any;
  };
  reportsState: {
    currentPage: number;
    filters: any;
  };
}

interface DashboardContextType {
  dashboardState: DashboardState;
  setActiveTab: (tab: string) => void;
  setProcessFlowState: (state: Partial<DashboardState['processFlowState']>) => void;
  setAcceptedRecordsState: (state: Partial<DashboardState['acceptedRecordsState']>) => void;
  setBeneficiariesListState: (state: Partial<DashboardState['beneficiariesListState']>) => void;
  setReportsState: (state: Partial<DashboardState['reportsState']>) => void;
  resetAllStates: () => void;
}

const initialState: DashboardState = {
  activeTab: 'beneficiaries',
  processFlowState: {
    currentPage: 1,
    filters: {},
  },
  acceptedRecordsState: {
    currentPage: 1,
    filters: {
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
    },
    viewMode: 'beneficiaries',
  },
  beneficiariesListState: {
    currentPage: 1,
    filters: {},
  },
  reportsState: {
    currentPage: 1,
    filters: {},
  },
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dashboardState, setDashboardState] = useState<DashboardState>(() => {
    // محاولة استرجاع الحالة من localStorage
    const savedState = localStorage.getItem('dashboardState');
    if (savedState) {
      try {
        return JSON.parse(savedState);
      } catch (error) {
        console.error('Error parsing saved dashboard state:', error);
      }
    }
    return initialState;
  });

  // حفظ الحالة في localStorage عند كل تغيير
  React.useEffect(() => {
    localStorage.setItem('dashboardState', JSON.stringify(dashboardState));
  }, [dashboardState]);

  const setActiveTab = (tab: string) => {
    setDashboardState(prev => ({ ...prev, activeTab: tab }));
  };

  const setProcessFlowState = (newState: Partial<DashboardState['processFlowState']>) => {
    setDashboardState(prev => ({
      ...prev,
      processFlowState: { ...prev.processFlowState, ...newState }
    }));
  };

  const setAcceptedRecordsState = (newState: Partial<DashboardState['acceptedRecordsState']>) => {
    setDashboardState(prev => ({
      ...prev,
      acceptedRecordsState: { ...prev.acceptedRecordsState, ...newState }
    }));
  };

  const setBeneficiariesListState = (newState: Partial<DashboardState['beneficiariesListState']>) => {
    setDashboardState(prev => ({
      ...prev,
      beneficiariesListState: { ...prev.beneficiariesListState, ...newState }
    }));
  };

  const setReportsState = (newState: Partial<DashboardState['reportsState']>) => {
    setDashboardState(prev => ({
      ...prev,
      reportsState: { ...prev.reportsState, ...newState }
    }));
  };

  const resetAllStates = () => {
    setDashboardState(initialState);
    localStorage.removeItem('dashboardState');
  };

  return (
    <DashboardContext.Provider value={{
      dashboardState,
      setActiveTab,
      setProcessFlowState,
      setAcceptedRecordsState,
      setBeneficiariesListState,
      setReportsState,
      resetAllStates,
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}; 