import React from 'react';
import GoalsSection from '../components/GoalsSection';
import Footer from '../components/Footer';

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50" style={{ direction: 'rtl' }}>
      {/* Header Section */}
      {/* <div className="bg-gradient-to-r from-[rgb(58,61,108)] to-[rgb(78,81,128)] text-white py-16">
        <div className="max-w-6xl mx-auto px-5 text-center">
          <h1 className="text-4xl font-bold mb-4">نبذة عن الجمعية</h1>
          <p className="text-xl opacity-90">وقف مبرة القعوان الخيرية</p>
        </div>
      </div> */}

      <div className="max-w-[1200px] mx-auto px-2 py-4 !mt-3">
        {/* نبذة عن الجمعية */}
        <section className="mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6 gap-3 ">
              <div className="w-12 h-12 bg-[rgb(58,61,108)] rounded-full flex items-center justify-center ">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-[rgb(58,61,108)] !mb-[20px]">
                نبذة عن الجمعية
              </h2>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-8 text-gray-700 mb-6">
                نحن <strong className="text-[rgb(58,61,108)]">وقف مبرة القعوان الخيرية</strong>، مسجل تحت إشراف الهيئة العامة للأوقاف بتصريح رقم <span className="bg-yellow-100 px-2 py-1 rounded">(١١٥٧)</span> أنشئ وقف مبرة بتاريخ <span className="bg-blue-100 px-2 py-1 rounded">١٤٣٨/٧/٢٩هـ</span> بمبادرة من أبناء قبيلة القعوان.
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-6">
                <h3 className="text-xl font-semibold text-[rgb(58,61,108)] mb-4">هدفنا</h3>
                <p className="text-lg leading-8 text-gray-700">
                  يهدف وقف مبرة القعوان الخيرية إلى خدمة وتنمية المجتمع من خلال مبادرات وبرامج نوعية عبر شراكات فعالة وكفاءات متميزة وفق أفضل الممارسات.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-green-50 p-6 rounded-xl">
                  <h4 className="text-lg font-semibold text-green-800 mb-3">من نخدم</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full ml-2"></span>
                      الأسر الفقيرة 
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full ml-2"></span>
                      الأسر  المتعففة
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full ml-2"></span>
                      الأيتام والأرامل
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full ml-2"></span>
                      المطلقات
                    </li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-xl">
                  <h4 className="text-lg font-semibold text-purple-800 mb-3">مشاريعنا</h4>
                  <div className="space-y-2 text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full ml-2"></span>
                        كفالة الأيتام
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full ml-2"></span>
                        السلة الغذائية
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full ml-2"></span>
                        سقيا الماء
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full ml-2"></span>
                        كسوة العيد
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full ml-2"></span>
                        الكسوة والحقيبة المدرسية
                      </li>
                    </ul>
                    <ul className="space-y-2 text-gray-700 ">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full ml-2"></span>
                        كسوة الشتاء
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full ml-2"></span>
                        توزيع التمور
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full ml-2"></span>
                        توزيع اللحوم
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full ml-2"></span>
                        توزيع المكيفات وصيانتها
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full ml-2"></span>
                        زكاة الفطر
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 p-6 rounded-xl">
                <h4 className="text-lg font-semibold text-orange-800 mb-3">رؤيتنا المستقبلية</h4>
                <p className="text-lg leading-8 text-gray-700">
                  تحويل المستفيدين من الحاجة إلى الاكتفاء ومن الاحتياج إلى الإنتاج، وتحقيق التألف والتكاتف بالمجتمع ورفع الوعي المجتمعي بأهمية الدعم لتحقيق أعلى عائد للمستفيدين.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* إحصائيات سريعة */}
        <section className="mb-12">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[rgb(58,61,108)] mb-2">١١٥٧</h3>
              <p className="text-gray-600">رقم التصريح</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[rgb(58,61,108)] mb-2">١٤٣٨</h3>
              <p className="text-gray-600">سنة التأسيس</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[rgb(58,61,108)] mb-2">متعدد</h3>
              <p className="text-gray-600">البرامج الخيرية</p>
            </div>
          </div>
        </section>

        {/* رسالة إضافية */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-[rgb(58,61,108)] to-[rgb(78,81,128)] rounded-2xl p-8 text-white">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">رسالة الجسد الواحد</h3>
              <p className="text-lg leading-8 opacity-90">
                تحرص المبرة على عمل شراكات ناجحة مع جهات ربحية وغير ربحية وأفراد لخدمة مشاريع المبرة وتنميتها وإشراك المجتمع في تبني رسالة الجسد الواحد
              </p>
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