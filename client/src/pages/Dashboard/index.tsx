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
import DeletedList from "./components/DeletedList";

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
      
      // If user is not manager or committee and current tab is processFlow, redirect to beneficiaries
      if (adminData && adminData.rule !== "manager" && adminData.rule !== "committee" && activeTab === "processFlow") {
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
        // Only allow access to ProcessFlow if user is manager or committee
        if (admin && (admin.rule === "manager" || admin.rule === "committee")) {
          return <ProcessFlow />;
        } else {
          setActiveTab("beneficiaries");
          return <BeneficiariesList />;
        }
      case "deletedList":
        // Only allow access to DeletedList if user is reviewer
        if (admin && admin.rule === "reviewer") {
          return <DeletedList />;
        } else {
          setActiveTab("beneficiaries");
          return <BeneficiariesList />;
        }
      default:
        return <BeneficiariesList />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50" style={{ direction: 'rtl' }}>
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
      <aside className={`fixed lg:static inset-y-0 right-0 z-50 w-80 bg-gradient-to-b from-slate-800 to-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      } flex flex-col h-full`}>
        {/* Header */}
        <div className="px-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold !text-white !mb-[20px] !mt-[19px]">لوحة التحكم</h2>
            {/* Close button for mobile */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-slate-700 transition-colors text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
        
        </div>

        {/* Admin Info Section */}
        {admin && (
          <div className="p-4 border-b border-slate-700 bg-gradient-to-r from-slate-700/50 to-slate-800/50">
            <div className="flex items-center gap-4">
              {/* Admin Avatar */}
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-bold">
                  {admin.name ? admin.name.split(' ')[0]?.charAt(0) : 'أ'}
                </span>
              </div>
              
              {/* Admin Details */}
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg leading-tight">
                  {admin.name || 'غير محدد'}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-slate-300 text-sm">الدور:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    admin.rule === 'manager' 
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white' 
                      : admin.rule === 'committee' 
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                      : admin.rule === 'reviewer'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      : 'bg-slate-600 text-white'
                  }`}>
                    {admin.rule === 'manager' ? 'المدير' : 
                     admin.rule === 'committee' ? 'اللجنة' : 
                     admin.rule === 'reviewer' ? 'المراجع' : 
                     'غير محدد'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Decorative line */}
            <div className="w-full h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 rounded-full mt-4"></div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-3 overflow-y-auto max-h-[calc(100vh-200px)]">
          <button
            className={`w-full p-3 mb-2  md:px-4 md:py-3 rounded-xl text-lg font-semibold text-right transition-all duration-300 transform hover:scale-105 ${
              activeTab === "beneficiaries"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "text-slate-300 hover:text-white hover:bg-slate-700/50 hover:shadow-md"
            }`}
            onClick={() => handleTabClick("beneficiaries")}
          >
            المهام
          </button>
          
          <button
            className={`w-full p-3 mb-1 md:px-4 md:py-3 rounded-xl text-lg font-semibold text-right transition-all duration-300 transform hover:scale-105 ${
              activeTab === "reports"
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30"
                : "text-slate-300 hover:text-white hover:bg-slate-700/50 hover:shadow-md"
            }`}
            onClick={() => handleTabClick("reports")}
          >
            التقارير
          </button>

          <button
            className={`w-full p-3 mb-1 md:px-4 md:py-3 rounded-xl text-lg font-semibold text-right transition-all duration-300 transform hover:scale-105 ${
              activeTab === "acceptedRecords"
                ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/30"
                : "text-slate-300 hover:text-white hover:bg-slate-700/50 hover:shadow-md"
            }`}
            onClick={() => handleTabClick("acceptedRecords")}
          >
            السجل 
          </button>

          {/* Only show Process Flow button if admin.rule === 'manager' */}
          {admin && (admin.rule === "manager" || admin.rule === "committee") && (
            <button
              className={`w-full p-3 mb-1 md:px-4 md:py-3 rounded-xl text-lg font-semibold text-right transition-all duration-300 transform hover:scale-105 ${
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
              className={`w-full p-3  md:px-4 md:py-3 rounded-xl text-lg font-semibold text-right transition-all duration-300 transform hover:scale-105 ${
                activeTab === "editReports"
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50 hover:shadow-md"
              }`}
              onClick={() => handleTabClick("editReports")}
            >
              تعديل التقارير
            </button>
          )}
          {/* قائمة المحذوفين */}
          {admin && admin.rule === "reviewer" && (
            <button
              className={`w-full p-3  md:px-4 md:py-3 mb-0 rounded-xl text-lg font-semibold text-right transition-all duration-300 transform hover:scale-105 ${
                activeTab === "deletedList"
                  ? "bg-gradient-to-r from-red-400 to-red-600 text-white shadow-lg shadow-red-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50 hover:shadow-md"
              }`}
              onClick={() => handleTabClick("deletedList")}
            >
              قائمة المحذوفين
            </button>
          )}
          
          <div className="pt-2 space-y-3">
            {/* External Links Section */}
            <div className="border-t border-slate-700 pt-4 ">
              <h4 className="text-sm font-semibold text-slate-400 mb-3 px-2">روابط خارجية</h4>
              
              <a
                href="https://docs.google.com/spreadsheets/d/1WORSmVcCuDVbGKs2tdMa7y8KTxRfSuJKbgK4WihrnG8/edit?resourcekey=&gid=181545746#gid=181545746"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-3 rounded-xl text-sm font-semibold text-right bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 transition-all duration-300 transform hover:scale-105 hover:from-red-600 hover:to-red-700 flex items-center justify-center gap-2"
              >
                <span>📊</span>
                قائمة المرفوضين
              </a>
              
              <a
                href="https://docs.google.com/spreadsheets/d/1PfXGfu5ByUYymI8qYyd6TG7PDxjbCMqS1NOG0eD1GGc/edit?resourcekey=&gid=1831758013#gid=1831758013"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-3 rounded-xl text-sm font-semibold text-right bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30 transition-all duration-300 transform hover:scale-105 hover:from-green-600 hover:to-green-700 flex items-center justify-center gap-2 mt-3"
              >
                <span>📈</span>
                قائمة المقبولين
              </a>
            </div>
            
            <button
              className="w-full p-3  md:px-4 md:py-3 rounded-xl text-lg font-semibold text-right bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 transition-all duration-300 transform hover:scale-105 hover:from-red-600 hover:to-red-700"
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
      <main className="flex-1 overflow-y-auto h-screen">
        <div className="p-4 md:p-6 lg:p-8 pt-20 lg:pt-8">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;