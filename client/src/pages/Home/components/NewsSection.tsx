import { Heading2 } from "lucide-react";
import styles from "./NewsSection.module.css";

const NewsSection = () => (
  <section className={styles.newsSection}>
    <div className={styles.container}>
      {/* <h2 className={styles.sectionTitle + ' ' + styles.centerTitle}>احدث الاخبار </h2> */}
      <h2 className="my-section-title !text-3xl md:!text-4xl !mb-12 text-center mx-auto !flex !justify-center !items-center !w-fit"> أحدث الأخبار </h2>
      <div className={styles.cards} style={{direction:"rtl"}}>
        {[
          {
            img: "/img/aytam.jpg",
            title:"بفضل الله ثم بدعمكم تم تحويل مبلغ كفالة الايتام لشهر يوليو 2026م",
            // text: "ضاعف الله أجر كل من أنفق وبذل",
          },
          {
            img: "/img/salla.jpg",
            // title: "تم توزيع السلال الغذائية",
            title: "مشروع الحقيبة المدرسية لنرتقي بأيتامنا في سلم العلم",
            // text: "لشهر  رمضان ١٤٤٧هـ",
          }, 
          {
            img: "/img/nama.jpeg",
            title:"دعمكم نماء وعطاء وصدقة وصله",
            text: "ضاعف الله أجر كل من أنفق وبذل",
          },
        ].map(({ img, title, text }, i) => (
          <div className={styles.card} key={i}>
            <span className={styles.badge}>{i == 1  ? "جديدنا" : "جديدنا"}</span>
            <img style={{objectFit: i == 0  ?'fill':"unset"}} className={styles.cardImg} src={img} alt={`خبر ${i + 1}`}  />
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle + ' ' + styles.centerCardTitle}>{title}</h2>
   
              <p className={styles.cardText + ' ' + styles.centerCardText}>{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default NewsSection;
