import Footer from "../components/Footer";
import React from "react";

const testimonials = [
  {
    name: "الشيخ أحمد بن حمدان الشمراني (رحمه الله)",
    text:
      "ميزة الإحسان بذرة وتأسيس وتدشين وفكرة جيدة ومتميزة . أسأل الله أن تكون باكورة ميراث أخرى تعنى بالوقف الذي نحتاج أن ننشر فكره وثقافته بين أهل الخير في هذا المجتمع المبارك. وجزاكم الله خيراً..",
      image: "/shiekh/seif.webp",
    stars: 5,
    nameColor: "#7ed957",
  },
  {
    name: "أ. بندر بن محمد آل مساعد",
    text:
      "رأينا في فكرة ميزة الإحسان تجسيداً للبذرة التي نثرت في جامع الرضا بحي الصحيفة، وكيف أنه بدأ هذا المشروع صغيراً وكيف انتهى بهذا المشروع الوقفي الكبير والتنوع في تعدده ومجالاته..",
    image: "/shiekh/kamel.webp",
    stars: 5,
    nameColor: "#7ed957",
  },
  {
    name: "الشيخ عبدالله بن خليل الله المحمدي",
    text:
      "فلقد تشرفت بزيارة ميزة الإحسان الوقفية واطلعت على مايقوم به الزملاء القائمون عليها من جهود وأعمال جليلة وتنظيم طيب، وكان ذلك ثمرة عمل مميز من رجال مخلصين. أسأل الله أن يتقبل منهم.",
    image: "/shiekh/nahian.webp",
    stars: 5,
    nameColor: "#7ed957",
  },
];

const Says: React.FC = () => {
  return (
    <>
      <div style={{ background: "white", color: "#fff", padding: "40px 0", direction: "rtl" }}>
      <h2 style={{ textAlign: "center", fontSize: 48, fontWeight: "bold", marginBottom: 50 }}>قالوا عنا</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            style={{
              background: "none",
              width: 380,
              textAlign: "center",
              marginBottom: 30,
            }}
          >
            <div style={{
              background: "#323666",
              borderRadius: "0 100% 100% 100%/0 100% 0 100%",
              width: 220,
              height: 220,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}>
              <img
                src={t.image}
                alt={t.name}
                style={{ width: 190, height: 190, borderRadius: "50%", objectFit: "cover", border: "0px solid #444340" }}
              />
            </div>
            <div style={{ margin: "16px 0",display:"flex",justifyContent:"center", gap:"1rem" }}>
              {Array.from({ length: t.stars }).map((_, i) => (
                <span key={i} style={{ color: "#ffe44d", fontSize: 28 }}>★</span>
              ))}
            </div>
            <div style={{ fontSize: 20, marginBottom: 18,color:"black", minHeight: 120 }}>{t.text}</div>
            <div style={{ color: "#323666", fontWeight: "bold", fontSize: 21 }}>{t.name}</div>
          </div>
        ))}
      </div>

    </div>
    <Footer />
    </>
  
  );
};

export default Says;

