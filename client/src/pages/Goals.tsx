import React from 'react';
import GoalsSection from '../components/GoalsSection';
import Footer from '../components/Footer';

const Goals: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50" style={{ direction: 'rtl' }}>
      {/* Header Section */}
    

      <div className="max-w-6xl mx-auto px-5 py-12">
        {/* مقدمة */}
        <section className="mb-12 text-center">
          <p className="text-lg leading-8 text-gray-700 max-w-3xl mx-auto">
            تسعى جمعية مبرة القعوان الخيرية إلى تحقيق مجموعة من الأهداف الاستراتيجية 
            التي تهدف إلى خدمة المجتمع وتقديم الدعم للمحتاجين من خلال برامج ومشاريع 
            متنوعة ومستدامة.
          </p>
        </section>

        {/* أهداف الجمعية */}
        <GoalsSection />

        {/* معلومات إضافية */}
        <section className="mb-12">
          <div className="bg-white rounded-lg p-8 shadow-md">
            <h2 className="text-2xl font-bold text-[rgb(58,61,108)] mb-6 border-b-2 border-[rgb(58,61,108)] inline-block pb-2">
              كيف نحقق أهدافنا؟
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-[rgb(58,61,108)] mb-3">البرامج والمشاريع</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• برامج كفالة الأيتام</li>
                  <li>• مشاريع السلة الغذائية</li>
                  <li>• كسوة الشتاء والصيف</li>
                  <li>• مشاريع سقيا الماء</li>
                  <li>• برامج التنمية المجتمعية</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[rgb(58,61,108)] mb-3">الشراكات والتعاون</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• التعاون مع الجهات الحكومية</li>
                  <li>• الشراكة مع القطاع الخاص</li>
                  <li>• التعاون مع الجمعيات الخيرية</li>
                  <li>• مشاركة المتطوعين</li>
                  <li>• دعم المحسنين والمانحين</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* دعوة للعمل */}
        <section className="text-center">
          <div className="bg-[rgb(58,61,108)] text-white rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4 !text-white">ساعدنا في تحقيق أهدافنا</h2>
            <p className="text-lg mb-6">
              يمكنك المساهمة في تحقيق أهداف الجمعية من خلال التبرع أو التطوع
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button className="bg-white text-[rgb(58,61,108)] px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                تبرع الآن
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-[rgb(58,61,108)] transition-colors">
                تطوع معنا
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Goals; 