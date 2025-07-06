import React from 'react';
import { Link } from 'react-router-dom';

const GoalsPreview: React.FC = () => {
  const goals = [
    {
      id: 1,
      icon: "ri-hand-heart-line",
      title: "دعم الأسر المحتاجة",
      description: "تقديم العون المادي والعيني للأسر ذات الدخل المحدود."
    },
    {
      id: 2,
      icon: "ri-empathize-line",
      title: "كفالة الأيتام",
      description: "رعاية الأيتام وتأمين احتياجاتهم التعليمية والصحية."
    },
    {
      id: 3,
      icon: "ri-plant-line",
      title: "تنمية المجتمع",
      description: "تنفيذ مشاريع تنموية تسهم في تحسين جودة الحياة."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[rgb(58,61,108)] mb-4">
            أهداف الجمعية
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            نسعى لتحقيق مجموعة من الأهداف الاستراتيجية لخدمة المجتمع وتقديم الدعم للمحتاجين
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {goals.map((goal) => (
            <div 
              key={goal.id}
              className="bg-white rounded-lg p-6 shadow-md text-center hover:transform hover:-translate-y-2 transition-all duration-300"
            >
              <i className={`${goal.icon} text-4xl text-[rgb(58,61,108)] mb-4 block`}></i>
              <h3 className="text-xl font-bold text-[rgb(58,61,108)] mb-3">{goal.title}</h3>
              <p className="text-gray-600">{goal.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link 
            to="/goals"
            className="inline-flex items-center bg-[rgb(58,61,108)] text-white px-8 py-3 rounded-lg font-bold hover:bg-[rgb(149,122,77)] transition-colors duration-300"
          >
            <span>عرض جميع الأهداف</span>
            <i className="ri-arrow-left-line mr-2 text-lg"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GoalsPreview; 