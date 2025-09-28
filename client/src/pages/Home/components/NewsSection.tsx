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
            img: "/img/q3wan2.webp",
            title: "مشروع توزيع لحوم الأضاحي" ,
            text: "",
          },
          {
            img: "/img/q3wan1.webp",
            title: "دعمكم جعل صيفهم أبرد",
            text: "",
          },
          {
            img: "/img/كفالة_جديد.jpg",
            title:"تم إيداع مبلغ كفالة الأيتام",
            text: "لشهر سبتمبر 2025م ",
          },
        ].map(({ img, title, text }, i) => (
          <div className={styles.card} key={i}>
            <span className={styles.badge}>جديد</span>
            <img style={{objectFit: i == 0 ?'fill':"unset"}} className={styles.cardImg} src={img} alt={`خبر ${i + 1}`}  />
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
