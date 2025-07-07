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
  const [showCommentsModal, setShowCommentsModal] = useState<boolean>(false);
  const [selectedTaskComments, setSelectedTaskComments] = useState<any>(null);

  useGetCurrentAdminTasks({ setCurrentAdminTasks, setLoading });

  // استخدم بيانات currentAdminTasks بدلاً من mockBeneficiaries
  const beneficiariesToShow = currentAdminTasks.length > 0 ? currentAdminTasks : [];
  const currentAdmin = JSON.parse(localStorage.getItem("admin") || "{}");
  console.log(currentAdmin)
  const handleSearch = () => {
    // هنا يمكن إضافة منطق البحث حسب التاريخ والسنة
    console.log("Searching with date:", searchDate, "and year:", searchYear);
  };

  const handleCommentsClick = (e: React.MouseEvent, task: any) => {
    e.stopPropagation(); // منع انتشار الحدث للكارد
    setSelectedTaskComments(task.comments);
    setShowCommentsModal(true);
  };

  const closeCommentsModal = () => {
    setShowCommentsModal(false);
    setSelectedTaskComments(null);
  };

  const hasComments = (comments: any) => {
    return comments?.reviewer?.comment || 
           comments?.committee?.comment || 
           comments?.manager?.comment;
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
    
   console.log(status)
      switch (status) {
      case "accepted":
        return "مقبول";
      case "rejected":
        return "مرفوض";
      case "pending":
        return "في انتظار المراجعة";
      case "under_review":
        return "قيد المراجعة";
      case "under_committee":
        return "في انتظار اللجنة";
        case "accepted_manager":
          return "مقبول";
      default:
        return "غير محدد";
    }
    
    
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
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
                          {getStatusIcon(currentAdmin?.rule == "manager" ? task.reportStatus : task.status)}
                        </span>
                        {getStatusText(currentAdmin?.rule == "manager" ? task.reportStatus : task.status)}
                      </span>
                    </div>

                    {/* زر التعليقات للمدير واللجنة */}
                    {(currentAdmin?.rule === "manager" || currentAdmin?.rule === "committee") && hasComments(task.comments) && (
                      <div className="pt-2">
                        <button
                          onClick={(e) => handleCommentsClick(e, task)}
                          className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-md"
                        >
                          <span className="text-base">💬</span>
                          عرض التعليقات
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* تأثير الـ hover - خط متحرك */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* نافذة التعليقات المنبثقة */}
      {showCommentsModal && selectedTaskComments && (
        <div className="!fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">التعليقات</h3>
                <button
                  onClick={closeCommentsModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {/* تعليق المراجع */}
                {selectedTaskComments.reviewer?.comment && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-600 text-lg">👤</span>
                      <span className="font-semibold text-gray-800">المراجع</span>
                      {selectedTaskComments.reviewer.name && (
                        <span className="text-sm text-gray-600">({selectedTaskComments.reviewer.name})</span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedTaskComments.reviewer.comment}
                    </p>
                  </div>
                )}

                {/* تعليق اللجنة */}
                {selectedTaskComments.committee?.comment && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-600 text-lg">🏛️</span>
                      <span className="font-semibold text-gray-800">اللجنة</span>
                      {selectedTaskComments.committee.name && (
                        <span className="text-sm text-gray-600">({selectedTaskComments.committee.name})</span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedTaskComments.committee.comment}
                    </p>
                  </div>
                )}

                {/* تعليق المدير */}
                {selectedTaskComments.manager?.comment && (
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-600 text-lg">👨‍💼</span>
                      <span className="font-semibold text-gray-800">المدير</span>
                      {selectedTaskComments.manager.name && (
                        <span className="text-sm text-gray-600">({selectedTaskComments.manager.name})</span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedTaskComments.manager.comment}
                    </p>
                  </div>
                )}

                {/* رسالة إذا لم توجد تعليقات */}
                {!hasComments(selectedTaskComments) && (
                  <div className="text-center py-8 text-gray-500">
                    <span className="text-4xl mb-2 block">💬</span>
                    <p>لا توجد تعليقات متاحة</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={closeCommentsModal}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-300"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeneficiariesList;