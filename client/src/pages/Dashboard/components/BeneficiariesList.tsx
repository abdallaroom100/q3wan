import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Dashboard.module.css";
import { useGetCurrentAdminTasks } from "../hooks/useGetCurrentAdminTasks";
import { MoonLoader } from "react-spinners";

const BeneficiariesList = () => {
  const navigate = useNavigate();
  const [searchDate, setSearchDate] = useState("2025-06-12");
  const [searchYear, setSearchYear] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentAdminTasks, setCurrentAdminTasks] = useState<any[]>([]);

  useGetCurrentAdminTasks({ setCurrentAdminTasks, setLoading });

  // استخدم بيانات currentAdminTasks بدلاً من mockBeneficiaries
  const beneficiariesToShow = currentAdminTasks.length > 0 ? currentAdminTasks : [];

  const handleSearch = () => {
    // هنا يمكن إضافة منطق البحث حسب التاريخ والسنة
    console.log("Searching with date:", searchDate, "and year:", searchYear);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-100";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200 shadow-red-100";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200 shadow-amber-100";
      case "under_review":
        return "bg-blue-50 text-blue-700 border-blue-200 shadow-blue-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 shadow-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "مقبول";
      case "rejected":
        return "مرفوض";
      case "pending":
        return "في انتظار المراجعة";
      case "under_review":
        return "قيد المراجعة";
      default:
        return "غير محدد";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return "✅";
      case "rejected":
        return "❌";
      case "pending":
        return "⏳";
      case "under_review":
        return "🔍";
      default:
        return "📋";
    }
  };

  const handleCardClick = (taskId: string) => {
    // يمكن إضافة navigation للتفاصيل
    navigate(`/dashboard/beneficiary/${taskId}`);
  };
 
  return (
    <div className=" md:p-6 max-w-7xl mx-auto">
      {/* شريط البحث */}
      {/* <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-2 min-w-48">
            <label className="text-sm font-semibold text-gray-700">التاريخ</label>
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none"
            />
          </div>
          <div className="flex flex-col gap-2 min-w-48">
            <label className="text-sm font-semibold text-gray-700">السنة</label>
            <input
              type="number"
              value={searchYear}
              onChange={(e) => setSearchYear(e.target.value)}
              placeholder="أدخل السنة"
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none placeholder-gray-400"
            />
          </div>
          <button 
            onClick={handleSearch} 
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            بحث
          </button>
        </div>
      </div> */}

      {/* حالة التحميل */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <MoonLoader color="#3b82f6" size={40} />
          <p className="mt-4 text-gray-600 font-medium">جاري تحميل البيانات...</p>
        </div>
      )}

      {/* قائمة المستفيدين */}
      <section>
        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 flex-col md:flex-row border-gray-100">
          <h2 className="text-3xl font-bold  bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
            قائمة المستفيدين
          </h2>
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold border border-blue-200">
            {beneficiariesToShow.length} مستفيد
          </div>
        </div>

        {beneficiariesToShow.length === 0 && !loading ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="text-6xl mb-4 opacity-50">📋</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد بيانات</h3>
            <p className="text-gray-500">لم يتم العثور على أي مستفيدين في الوقت الحالي</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-4">
            {beneficiariesToShow.map((task) => (
              <div
                key={task._id}
                onClick={() => handleCardClick(task._id)}
                className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer transition-all duration-200 ease-in-out hover:shadow-xl hover:-translate-y-1"
              >
                {/* شريط الحالة العلوي */}
                <div className={`h-1 transition-all duration-200 ${
                  task.status === 'approved' ? 'bg-emerald-400' :
                  task.status === 'rejected' ? 'bg-red-400' :
                  task.status === 'pending' ? 'bg-amber-400' :
                  'bg-blue-400'
                }`}></div>
                
                {/* محتوى الكارد */}
                <div className="p-4 sm:p-6">
                  {/* الصورة */}
                  <div className="relative mb-6 flex justify-center">
                    <div className="relative w-full">
                      <img
                        src={task.user?.idImagePath || "/img/logo.png"}
                        alt={task.user?.identityNumber || "صورة الهوية"}
                        className="w-full h-48 sm:h-[300px] rounded-2xl border-4 border-gray-200 shadow-lg object-fill object-center bg-gray-100 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:border-blue-300"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/img/logo.png";
                        }}
                      />
                      {/* دائرة الحالة */}
                      {/* <div className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-base sm:text-lg transition-all duration-300 group-hover:scale-125 ${
                        task.status === 'approved' ? 'bg-emerald-500' :
                        task.status === 'rejected' ? 'bg-red-500' :
                        task.status === 'pending' ? 'bg-amber-500 animate-pulse' :
                        'bg-blue-500'
                      }`}>
                        <span className="text-white font-bold">
                          {getStatusIcon(task.status)}
                        </span>
                      </div> */}
                    </div>
                  </div>

                  {/* الاسم */}
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-1 leading-tight group-hover:text-blue-700 transition-colors duration-300">
                      {`${task.user?.firstName || ''} ${task.user?.secondName || ''} ${task.user?.thirdName || ''}`.trim() || 'غير محدد'}
                    </h3>
                  </div>
                  
                  {/* المعلومات */}
                  <div className="space-y-3">
                    {/* رقم الهوية */}
                    <div className="bg-gray-50 rounded-xl p-3 group-hover:bg-blue-50 transition-colors duration-300">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 font-medium">رقم الهوية</span>
                        <span className="text-sm font-mono font-bold text-blue-700">
                          {task.user?.identityNumber || 'غير محدد'}
                        </span>
                      </div>
                    </div>
                    
                    {/* تاريخ الطلب */}
                    <div className="bg-gray-50 rounded-xl p-3 group-hover:bg-blue-50 transition-colors duration-300">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 font-medium">تاريخ الطلب</span>
                        <span className="text-sm text-gray-700 font-medium flex items-center gap-1">
                          <span>📅</span>
                          {task.createdAt ? new Date(task.createdAt).toLocaleDateString("ar-EG") : "غير محدد"}
                        </span>
                      </div>
                    </div>
                    
                    {/* الحالة */}
                    <div className="pt-2">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border shadow-sm w-full justify-center transition-all duration-300 group-hover:shadow-md ${getStatusColor(task.status)}`}>
                        <span className="text-base">
                          {getStatusIcon(task.status)}
                        </span>
                        {getStatusText(task.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* تأثير الـ hover - خط متحرك */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default BeneficiariesList;