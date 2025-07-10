import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import BeneficiariesList from "./components/BeneficiariesList";
import Reports from "./components/Reports";
import EditReports from "./components/EditReports";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutAdmin } from "../../store/slices/dashboard/AdminSlice";
import FinalReportsTable from "./components/FinalReportsTable";
import AcceptedRecords from "./components/AcceptedRecords";
import ProcessFlow from "./components/ProcessFlow";
import { usePersistentState } from "../../hooks/usePersistentState";

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [admin, setAdmin] = useState<any>(null);
  const history = useNavigate()
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = usePersistentState('dashboard_activeTab', 'beneficiaries');
  useEffect(() => {
    try {
      const adminData = JSON.parse(localStorage.getItem("admin") || "null");
      setAdmin(adminData);
      
      // If user is not manager and current tab is processFlow, redirect to beneficiaries
      if (adminData && adminData.rule !== "manager" && activeTab === "processFlow") {
        setActiveTab("beneficiaries");
      }
    } catch (e) {
      setAdmin(null);
    }
  }, [activeTab, setActiveTab]);

  const handleTabClick = (tab:string) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "beneficiaries":
        return <BeneficiariesList />;
      case "reports":
        return <Reports />;
      case "editReports":
        return <EditReports />;
      case "acceptedRecords":
        return <AcceptedRecords />;
      case "processFlow":
        // Only allow access to ProcessFlow if user is manager
        if (admin && admin.rule === "manager") {
          return <ProcessFlow />;
        } else {
          // Redirect to beneficiaries if not manager
          setActiveTab("beneficiaries");
          return <BeneficiariesList />;
        }
      default:
        return <BeneficiariesList />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-blue-50 flex" dir="rtl">
      
      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Hamburger button for mobile */}
      <button
        className="fixed top-4 right-4 z-50 p-3 rounded-lg bg-slate-800 text-white shadow-lg hover:bg-slate-700 transition-colors lg:hidden"
        onClick={() => setIsMenuOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 right-0  w-80 h-screen bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800 shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
          lg:sticky lg:top-0 lg:translate-x-0 lg:w-80 lg:h-screen
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold !text-white">لوحة التحكم</h2>
            {/* Close button for mobile */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-slate-700 transition-colors text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-green-400 rounded-full mt-3"></div>
        </div>

        {/* Navigation */}
        <nav className="p-6 space-y-3  overflow-y-auto pb-24">
          <button
            className={`w-full p-4 rounded-xl text-lg font-semibold text-right transition-all duration-300 transform hover:scale-105 ${
              activeTab === "beneficiaries"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "text-slate-300 hover:text-white hover:bg-slate-700/50 hover:shadow-md"
            }`}
            onClick={() => handleTabClick("beneficiaries")}
          >
            المهام
          </button>
          
          <button
            className={`w-full p-4 rounded-xl text-lg font-semibold text-right transition-all duration-300 transform hover:scale-105 ${
              activeTab === "reports"
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30"
                : "text-slate-300 hover:text-white hover:bg-slate-700/50 hover:shadow-md"
            }`}
            onClick={() => handleTabClick("reports")}
          >
            التقارير
          </button>

          <button
            className={`w-full p-4 rounded-xl text-lg font-semibold text-right transition-all duration-300 transform hover:scale-105 ${
              activeTab === "acceptedRecords"
                ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/30"
                : "text-slate-300 hover:text-white hover:bg-slate-700/50 hover:shadow-md"
            }`}
            onClick={() => handleTabClick("acceptedRecords")}
          >
            السجل 
          </button>

          {/* Only show Process Flow button if admin.rule === 'manager' */}
          {admin && admin.rule === "manager" && (
            <button
              className={`w-full p-4 rounded-xl text-lg font-semibold text-right transition-all duration-300 transform hover:scale-105 ${
                activeTab === "processFlow"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50 hover:shadow-md"
              }`}
              onClick={() => handleTabClick("processFlow")}
            >
              سير العمليات
            </button>
          )}

          {/* Only show this button if admin.rule === 'manager' */}
          {admin && admin.rule === "manager" && (
            <button
              className={`w-full p-4 rounded-xl text-lg font-semibold text-right transition-all duration-300 transform hover:scale-105 ${
                activeTab === "editReports"
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50 hover:shadow-md"
              }`}
              onClick={() => handleTabClick("editReports")}
            >
              تعديل التقارير
            </button>
          )}
          
          <div className="pt-2 space-y-3">
            {/* <button
              className="w-full p-3 rounded-xl text-sm font-semibold text-right bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 transition-all duration-300 transform hover:scale-105 hover:from-orange-600 hover:to-orange-700"
                             onClick={() => {
                 // Clear all persistent states
                 localStorage.removeItem('dashboard_activeTab');
                 localStorage.removeItem('processFlow_currentPage');
                 localStorage.removeItem('acceptedRecords_currentPage');
                 localStorage.removeItem('acceptedRecords_filters');
                 localStorage.removeItem('acceptedRecords_viewMode');
                 localStorage.removeItem('acceptedRecords_showFilters');
                 localStorage.removeItem('editReports_currentPage');
                 // Reset to default tab
                 setActiveTab('beneficiaries');
                 setIsMenuOpen(false);
                 // Show success message
                 alert('تم إعادة تعيين جميع الإعدادات بنجاح!');
               }}
            >
              إعادة تعيين الإعدادات
            </button> */}
            <button
              className="w-full p-4 rounded-xl text-lg font-semibold text-right bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 transition-all duration-300 transform hover:scale-105 hover:from-red-600 hover:to-red-700"
              onClick={() => {
                setIsMenuOpen(false);
                
                // Clear all admin-related localStorage items
                localStorage.removeItem("admin");
                localStorage.removeItem('dashboard_activeTab');
                localStorage.removeItem('processFlow_currentPage');
                localStorage.removeItem('acceptedRecords_currentPage');
                localStorage.removeItem('acceptedRecords_filters');
                localStorage.removeItem('acceptedRecords_viewMode');
                localStorage.removeItem('acceptedRecords_showFilters');
                localStorage.removeItem('editReports_currentPage');
                localStorage.removeItem('editReports_filters');
                localStorage.removeItem('editReports_showFilters');
                localStorage.removeItem('beneficiaries_currentPage');
                localStorage.removeItem('beneficiaries_filters');
                localStorage.removeItem('beneficiaries_showFilters');
                localStorage.removeItem('reports_currentPage');
                localStorage.removeItem('reports_filters');
                localStorage.removeItem('reports_showFilters');
                
                dispatch(logoutAdmin())
                history("/dashboard/login")
              }}
            >
              تسجيل الخروج
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1  md:p-6 lg:p-8 overflow-y-auto pt-20 lg:pt-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
          {/* تم حذف سيكشن القرارات النهائية من هنا */}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;