import React from 'react';

interface Goal {
  id: number;
  icon: string;
  title: string;
  description: string;
}

interface GoalsSectionProps {
  title?: string;
  showTitle?: boolean;
  className?: string;
}

const GoalsSection: React.FC<GoalsSectionProps> = ({ 
  title = "أهداف الجمعية", 
  showTitle = true,
  className = ""
}) => {
  const goals: Goal[] = [
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
    },
    {
      id: 4,
      icon: "ri-team-line",
      title: "تعزيز العمل التطوعي",
      description: "غرس ثقافة التطوع وتوسيع قاعدة المتطوعين."
    },
    {
      id: 5,
      icon: "ri-lightbulb-flash-line",
      title: "الابتكار في العمل الخيري",
      description: "تطوير برامج ومبادرات مبتكرة لخدمة المستفيدين."
    },
    {
      id: 6,
      icon: "ri-community-line",
      title: "الشراكات الفعالة",
      description: "بناء علاقات تعاون مع الجهات الحكومية والخاصة."
    }
  ];

  return (
    <section className={`mb-12 ${className}`}>
      {showTitle && (
        <h2 className="text-2xl font-bold text-[rgb(58,61,108)] mb-8 text-center">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <div 
            key={goal.id}
            className="bg-white rounded-lg p-6 shadow-md text-center hover:transform hover:-translate-y-1 transition-transform duration-300"
          >
            <i className={`${goal.icon} text-3xl text-[rgb(58,61,108)] mb-4 block`}></i>
            <h3 className="text-lg font-bold text-[rgb(58,61,108)] mb-3">{goal.title}</h3>
            <p className="text-gray-600">{goal.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GoalsSection; 