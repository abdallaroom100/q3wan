import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import BeneficiariesList from "./components/BeneficiariesList";
import Reports from "./components/Reports";
import EditReports from "./components/EditReports";
import Settings from "./components/Settings";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutAdmin } from "../../store/slices/dashboard/AdminSlice";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("beneficiaries");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [admin, setAdmin] = useState<any>(null);
  const history = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    try {
      const adminData = JSON.parse(localStorage.getItem("admin") || "null");
      setAdmin(adminData);
    } catch (e) {
      setAdmin(null);
    }
  }, []);

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
          
          <div className="pt-2">
            <button
              className="w-full p-4 rounded-xl text-lg font-semibold text-right bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 transition-all duration-300 transform hover:scale-105 hover:from-red-600 hover:to-red-700"
              onClick={() => {
                setIsMenuOpen(false);
                localStorage.removeItem("admin")
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
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto pt-20 lg:pt-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;