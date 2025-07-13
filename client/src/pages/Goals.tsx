import React from 'react';
import GoalsSection from '../components/GoalsSection';
import Footer from '../components/Footer';

const Goals: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50" style={{ direction: 'rtl' }}>
      {/* Header Section */}
    

      <div className="w-screen mx-auto px-5 py-12">
        {/* مقدمة */}
        {/* <div className='contianer mx-auto w-full'>
            <img src="/goals.png" alt="" className="w-[89%] md:h-[80vh] mx-auto rounded-xl mt-2 " />
           </div> */}
      

        {/* أهداف المبرة */}
        <section className="mb-16 w-full max-w-5xl mx-auto">
          <div className="flex flex-col items-center mb-10">
           <span className='flex items-center justify-center'>
           <h2 className="text-4xl md:text-5xl font-extrabold text-yellow-400 text-center mb-2 tracking-tight drop-shadow">أهداف المبرة</h2>
           {/* <span className="text-5xl md:text-6xl mb-2">🎯</span> */}
           </span>
            <div className="border-t-4 border-yellow-400 w-24 mx-auto mb-4"></div>
            <p className="text-lg leading-8 text-black max-w-2xl text-center mb-2">
              تسعى  مبرة القعوان الخيرية إلى تحقيق مجموعة من الأهداف الاستراتيجية التي تهدف إلى خدمة المجتمع وتقديم الدعم للمحتاجين من خلال برامج ومشاريع متنوعة ومستدامة.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 md:gap-8 px-2">
            <div className="bg-gradient-to-br from-[rgb(24,29,44)] to-[rgb(34,39,59)] border border-yellow-400 rounded-xl p-6 shadow-lg flex items-start gap-4 ">
              <span className="text-yellow-400 text-3xl mt-1">&#x27A4;</span>
              <span className="text-lg text-gray-100">إشاعة التكافل بين أفراد المجتمع ونشر الرحمة والأخوة بينهم.</span>
            </div>
            <div className="bg-gradient-to-br from-[rgb(24,29,44)] to-[rgb(34,39,59)] border border-yellow-400 rounded-xl p-6 shadow-lg flex items-start gap-4">
              <span className="text-yellow-400 text-3xl mt-1">&#x27A4;</span>
              <span className="text-lg text-gray-100">الإسهام في سد حاجات الناس وتفريج كربهم وتحسين معيشتهم وإدخال السرور على قلوبهم</span>
            </div>
            <div className="bg-gradient-to-br from-[rgb(24,29,44)] to-[rgb(34,39,59)] border border-yellow-400 rounded-xl p-6 shadow-lg flex items-start gap-4">
              <span className="text-yellow-400 text-3xl mt-1">&#x27A4;</span>
              <span className="text-lg text-gray-100">الحرص على إيصال الصدقات والزكوات لأكثر الناس حاجة وذلك من خلال لجان متخصصة تقوم بدراسة أحوال واحتياج الأسر بما يتناسب مع خصوصيتها، ويرعى كرامتها وعفّتها</span>
            </div>
            <div className="bg-gradient-to-br from-[rgb(24,29,44)] to-[rgb(34,39,59)] border border-yellow-400 rounded-xl p-6 shadow-lg flex items-start gap-4">
              <span className="text-yellow-400 text-3xl mt-1">&#x27A4;</span>
              <span className="text-lg text-gray-100">الاهتمام بالجيل الثاني من أبناء الأسر المستفيدة لتطويرهم وإزالة فكر ثقافة الفقر عنهم</span>
            </div>
          </div>
        </section>

        {/* أهداف الجمعية */}
        {/* <GoalsSection /> */}

        {/* معلومات إضافية */}
        {/* <section className="mb-12">
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
        </section> */}

        {/* دعوة للعمل */}
        {/* <section className="text-center">
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
        </section> */}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Goals; 