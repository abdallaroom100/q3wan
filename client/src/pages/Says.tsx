import Footer from "../components/Footer";
import React from "react";

const testimonials = [
  {
    name: "الشيخ / عبدالله بن ثواب القعياني",
    text: " سعدت بزيارة للأخوة في مبرة القعوان الخيرية وسررت بما رأيت من جهود تذكر فتشكر وبرامج حقيقية تسر الخاطر من رعاية واهتمام بالمحتاجين وسد حاجتهم ورعاية الأيتام وهذا من صور التكافل الاجتماعي ووقعها في أنفس من ترعاهم هذه المبرة",
    image: "/shiekh/1.jpg",
    stars: 5,
    nameColor: "#7ed957",
  },
  {
    name: "القاضي / عمرو  بن عوض السلمي",
    text: "سعدت بما شاهدته من انجازات وأعمال ومشاريع تقوم بها مبرة قبيلة القعوان من قبيلة مطير ، نسأل الله أن يوفق القائمين عليها وجميع أعضائها ويبارك في جهودهم والله يوفقهم ويعينهم",
    image: "/shiekh/2.jpg",
    stars: 5,
    nameColor: "#7ed957",
  },
  {
    name: "الشيخ / عبدالله باحداد",
    text: "شُرفت بزيارة الإخوة الفضلاء في إدارة مبرة القعوان الخيرية للاطلاع على مشاريعهم الخيرية ومبادراتهم المجتمعية والاستفادة من تجربتهم في خدمة المستفيدين ولقد سرَّ خاطري وأثلج صدري وأبهج نفسي ما رأيته من حسن إدارة وتنظيم قاعدة المعلومات وتوظيف للتطوع والكوادر البشرية فأهيب بكل من لديه القدرة استثمار الفرصة للشراكة معهم بتقديم المال أو نفعهم بالعلاقات",
    image: "/shiekh/3.jpg",
    stars: 5,
    nameColor: "#7ed957",
  },
];

const Says: React.FC = () => {
  return (
    <>
      <div
        style={{
          background: "white",
          color: "#fff",
          padding: "40px 0",
          direction: "rtl",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: 48,
            fontWeight: "bold",
            marginBottom: 50,
          }}
        >
          قالوا عنا
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 40,
            flexWrap: "wrap",
          }}
        >
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              style={{
                background: "none",
                width: idx == 2 ? 420 : 380,
                textAlign: "center",
                marginBottom: 30,
                display:"flex",
                justifyContent:"space-between",
                flexDirection:"column"
              }}
            >
            
              <div>
  <div
                style={{
                  background: "#323666",
                  borderRadius: "0 100% 100% 100%/0 100% 0 100%",
                  width: 220,
                  height: 220,
                  margin: "0 auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <img
                  src={t.image}
                  alt={t.name}
                  style={{
                    width: 190,
                    height: 190,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "0px solid #444340",
                    objectPosition:`${idx == 1 ? "top": idx == 2 ?"38% -3px":""}`
                  }}
                />
              </div>
              <div
                style={{
                  margin: "16px 0",
                  display: "flex",
                  justifyContent: "center",
                  gap: "1rem",
                }}
              >
                {Array.from({ length: t.stars }).map((_, i) => (
                  <span key={i} style={{ color: "#ffe44d", fontSize: 28 }}>
                    ★
                  </span>
                ))}
              </div>
              <div
                style={{
                  fontSize: idx === 2 ? 15.5:18,
                  marginBottom: 18,
                  color: "black",
                  minHeight: 120,
                  
                }}
              >
                {t.text}
              </div>

              </div>
              <div>
                <div
                style={{ color: "#323666", fontWeight: "bold", fontSize: 21 }}
              >
                {idx !== 0 ? "":<p className="bg-[#323666] w-fit mx-auto text-[16px]  px-4 text-white rounded-xl">شيخ قبيلة الفعوان</p>}
                {t.name}
              </div>
              </div>
              
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Says;
