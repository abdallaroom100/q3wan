const projects = [
  {
    img: "img/كفالة.png",
    title: "كفالة الأيتام ",
    cost: "معدل 3600 ريال سنويا",
    beneficiaries: "فئة الأيتام حسب المعايير",
    card: "تحويل بنكي",
    period: "فترة الصرف شهرياً",
    bgColor: "bg-amber-600",
    bgGradient: "from-amber-600 to-orange-500"
  },
  {
    img: "img/سلة.png",
    title: "السلة الغذائية",
    cost: "معدل 60 الف ريال كل شهرين",
    beneficiaries: "جميع الأسر",
    card: "بطاقات العثيم",
    period: "فترة الصرف كل شهرين",
    bgColor: "bg-emerald-600",
    bgGradient: "from-emerald-600 to-emerald-500"
  },
  
  {
    img: "img/ماء.jpg",
    title: "مشروع سقيا الماء",
    cost: "معدل 40 الف ريال سنويا",
    beneficiaries: "المناطق المحتاجة",
    card: "تنفيذ مباشر",
    period: "يومي",
    bgColor: "bg-cyan-600",
    bgGradient: "from-cyan-600 to-blue-500"
  },
  {
    img: "img/مشروع الحقيبة المدرسية.jpg",
    title: "الكسوة و الحقيبة المدرسية",
  cost: "معدل 500 ريال",
  beneficiaries: "الطلاب المحتاجين",
  card: "توزيع مباشر",
  period: "بداية العام الدراسي",
  bgColor: "bg-rose-600",
  bgGradient: "from-rose-600 to-pink-500"
  },
  {
    img: "img/مشروع توزيع اللحوم.jpg",
    title: "توزيع اللحوم",
    cost: "معدل 700 ذبيحة سنويا ",
    beneficiaries: " الأسر المحتاجة",
    card: "توزيع مباشر",
    period: "كل شهرين",
    bgColor: "bg-rose-600",
    bgGradient: "from-rose-600 to-pink-500"
  },
  {
    img: "img/كسوة الشتاء.jpg",
    title: "كسوة الشتاء",
      cost: "معدل 20 الف ريال سنويا",
      beneficiaries: " الأسر المحتاجة",
      card: "توزيع مباشر",
      period: "مرة واحدة سنوياً",
      bgColor: "bg-purple-600",
      bgGradient: "from-purple-600 to-purple-500"
    },
  {
    img: "img/SLID 2.jpg",
    title: "كسوة العيد",
    cost: "معدل 500 ريال لكل يتيم",
    beneficiaries: "الأيتام",
    card: "الحوالة البنكية",
    period: "مرة واحدة سنوياً",
    bgColor: "bg-purple-600",
    bgGradient: "from-purple-600 to-purple-500"
  },
    {
      img: "img/مشروع توزيع التمور.jpg",
      title: "توزيع التمور",
      cost: "كمية التمور الموزعة: 5600 كيلو جرام",
      beneficiaries: "الأسر المحتاجة ",
      card: "تنفيذ مباشر",
      period: "مرة واحدة سنوياً",
      bgColor: "bg-cyan-600",
      bgGradient: "from-cyan-600 to-blue-500"
    },
    {
      img: "img/condition.jpg",
      title: "توزيع الأجهزة الكهربائية وصيانتها",
      cost: "معدل 30 الف ريال سنويا",
      beneficiaries: "الأسر المحتاجة",
      card: "تنفيذ مباشر",
      period: "مرة واحدة سنوياً",
      bgColor: "bg-cyan-600",
      bgGradient: "from-cyan-600 to-blue-500"
    },
  ];
  
  const ProjectsSection = () => {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4" dir="rtl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="my-section-title !text-4xl font-bold text-gray-800 mb-4">مشاريعنا</h2>
            {/* <div className="w-24 h-1 bg-[#4a548dfc] mx-auto rounded-full"></div> */}
          </div>
          
          {/* Grid responsive: 1 column on mobile, 2 on tablet, 3 on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Top section with image and gradient overlay */}
                <div className={` h-64 relative overflow-hidden rounded-t-2xl`}>
                  <img 
                  loading="lazy"
                    src={project.img} 
                    alt={project.title}
                    className="w-full h-full  "
                  />
                  
                  {/* Logo in top right corner */}
                  <div className="absolute top-4 right-4 text-white text-center">
                    {/* <div className=" bg-[#4a8d56fc] rounded-lg p-2 mb-2">
                      <svg className="w-6 h-6 mx-auto text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9l-5 4.87 1.18 6.88L12 17.77l-6.18 2.98L7 14.87 2 9l6.91-0.74L12 2z"/>
                      </svg>
                    </div> */}
                    {/* <div className="text-xs leading-tight font-medium">
                      <div>ميــــــــــرة</div>
                      <div>الخيرية</div>
                      <div>الوقفية</div>
                    </div> */}
                  </div>
                </div>
                
                {/* Bottom section with content - matching the mint green color from image */}
                <div className=" p-6">
                  {/* Title */}
                  <h3 className=" text-xl lg:text-2xl font-bold text-gray-800 text-center mb-4 ">
                    {project.title}
                  </h3>
                  
                  {/* Decorative divider - golden ornamental design */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="text-yellow-600">
                    <img loading="lazy" decoding="async" width="800" height="88" className="attachment-large size-large wp-image-159" alt="" sizes="(max-width: 800px) 100vw, 800px" src="https://ehsaan.sa/wp-content/uploads/2024/09/فاصل1-1-1024x113.png"/>
                    </div>
                  </div>
                  
                  {/* Info items with colored icons */}
                  <div className="space-y-3  gap-4 ">
                    <div className="flex items-center text-sm">
                      <div className="w-6 h-6 bg-red-500 rounded-sm flex items-center justify-center ml-3 flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>
                      <span className=" text-[16px] text-[#31236f] font-bold">{project.cost}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <div className="w-6 h-6 bg-blue-500 rounded-sm flex items-center justify-center ml-3 flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-6h2.5l6 6H4zm16-10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM12.5 11H11v5.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V13h2.5c.83 0 1.5-.67 1.5-1.5S17.33 10 16.5 10h-4z"/>
                        </svg>
                      </div>
                      <span className=" text-[16px] text-[#31236f] font-bold">{project.beneficiaries}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <div className="w-6 h-6 bg-yellow-500 rounded-sm flex items-center justify-center ml-3 flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                        </svg>
                      </div>
                      <span className=" text-[16px] text-[#31236f] font-bold">{project.card}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <div className="w-6 h-6 bg-green-500 rounded-sm flex items-center justify-center ml-3 flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                        </svg>
                      </div>
                      <span className=" text-[16px] text-[#31236f] font-bold">{project.period}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default ProjectsSection;