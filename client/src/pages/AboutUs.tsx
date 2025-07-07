import React from 'react';
import GoalsSection from '../components/GoalsSection';
import Footer from '../components/Footer';
const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50" style={{ direction: 'rtl' }}>
      {/* Header Section */}
    

      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* نبذة عن الجمعية */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[rgb(58,61,108)] mb-6 border-b-2 border-[rgb(58,61,108)] inline-block pb-2">
            نبذة عن الجمعية
          </h2>
          <p className="text-lg leading-8 text-gray-700 mb-8">
            جمعية مبرة القعوان الخيرية هي جمعية أهلية غير ربحية تأسست عام 2012م في المملكة العربية السعودية بترخيص رسمي من وزارة الموارد البشرية والتنمية الاجتماعية. تهدف الجمعية إلى تقديم الدعم والمساندة للأسر المحتاجة وكفالة الأيتام وتنفيذ المبادرات والمشاريع التنموية المستدامة.
          </p>

          {/* Gallery */}
          <div className="flex gap-4 flex-wrap justify-center mb-8">
            <img 
              src="/img/مشروع السله الغذائية.jpg" 
              alt="مشروع السلة الغذائية" 
              className="w-44 h-28 object-cover rounded-lg shadow-md"
            />
            <img 
              src="/img/كسوة الشتاء.jpg" 
              alt="مشروع كسوة الشتاء" 
              className="w-44 h-28 object-cover rounded-lg shadow-md"
            />
            <img 
              src="/img/مشروع سقيا الماء.jpg" 
              alt="مشروع سقيا الماء" 
              className="w-44 h-28 object-cover rounded-lg shadow-md"
            />
          </div>
        </section>

        {/* الرؤية والرسالة */}
        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[rgb(58,61,108)] mb-4 border-b-2 border-[rgb(58,61,108)] inline-block pb-2">
                رؤيتنا
              </h2>
              <p className="text-lg leading-8 text-gray-700">
                الريادة والتميز في العمل الخيري وتحقيق أثر اجتماعي مستدام يخدم المستفيدين والمجتمع.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[rgb(58,61,108)] mb-4 border-b-2 border-[rgb(58,61,108)] inline-block pb-2">
                رسالتنا
              </h2>
              <p className="text-lg leading-8 text-gray-700">
                تقديم خدمات ومشاريع نوعية تحقق حياة كريمة للأسر المستحقة، بالتعاون مع الشركاء والداعمين.
              </p>
            </div>
          </div>
        </section>

        {/* أهداف الجمعية */}
        <GoalsSection />

        {/* تواصل معنا */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[rgb(58,61,108)] mb-6 border-b-2 border-[rgb(58,61,108)] inline-block pb-2">
            تواصل معنا
          </h2>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="space-y-3">
              <p className="text-lg">📞 الهاتف: 1234 567 050</p>
              <p className="text-lg">📧 البريد الإلكتروني: info@alqawan.org</p>
              <p className="text-lg">📍 العنوان: المملكة العربية السعودية</p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUs; 