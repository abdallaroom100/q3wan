import Slider from "./components/Slider";
import NewsSection from "./components/NewsSection";
import StatsSection from "./components/StatsSection";
import Projects from "./components/Projects";
import SeasonalProjectsSection from "./components/SeasonalProjects";
import StrategicPartners from "./components/StrategicPartners";
import Footer from "../../components/Footer";

import SocialMediaIcons from "../../common/SocialIcom";
import { Helmet } from "react-helmet";

const Home = () => {
  return (
    <>
   <Helmet>
  <title>مبرة القعوان الخيرية</title>
  <link rel="icon" type="image/png" href="https://store.alqawan.com/img/logo.png" />
  <link rel="canonical" href="https://store.alqawan.com/" />
  
  <meta name="description" content="مبرة القعوان الخيرية: مبرة خيرية سعودية تهدف إلى دعم الأسر المحتاجة، كفالة الأيتام، وتنمية المجتمع من خلال مشاريع إنسانية وتنموية متنوعة في منطقة القعوان وما حولها." />
  <meta name="keywords" content="جمعية خيرية, مبرة القعوان, كفالة أيتام, دعم الأسر, مشاريع خيرية, السعودية, العمل الخيري, التنمية المجتمعية, تبرع, صدقة, مشاريع موسمية, مشاريع تنموية, مبرة القعوان, q3wan charity, q3wan, q3wan.org" />
  <meta name="author" content=" مبرة القعوان الخيرية" />

  <meta property="og:title" content=" مبرة القعوان الخيرية" />
  <meta property="og:description" content="جمعية سعودية غير ربحية تهدف إلى تقديم الدعم والرعاية للأسر المحتاجة والأيتام وتنفيذ مشاريع خيرية وتنموية في منطقة القعوان." />
  <meta property="og:image" content="https://store.alqawan.com/img/logo.png" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="مبرة القعوان الخيرية" />
  <meta property="og:locale" content="ar_SA" />
  <meta property="og:url" content="https://store.alqawan.com/" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="مبرة القعوان الخيرية" />
  <meta name="twitter:description" content="مبرة سعودية غير ربحية تهدف إلى تقديم الدعم والرعاية للأسر المحتاجة والأيتام وتنفيذ مشاريع خيرية وتنموية في منطقة القعوان." />
  <meta name="twitter:image" content="https://store.alqawan.com/img/logo.png" />
  <meta name="twitter:site" content="@q3wan_charity" />

  <script type="application/ld+json">
    {`
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "مبرة القعوان",
        "url": "https://store.alqawan.com",
        "logo": "https://store.alqawan.com/img/logo.png",
        "sameAs": [
          "https://twitter.com/q3wan_charity",
          "https://facebook.com/q3wan_charity"
        ],
        "description": "مبرة سعودية غير ربحية تهدف إلى دعم الأسر المحتاجة وتنمية المجتمع في منطقة القعوان."
      }
    `}
  </script>
</Helmet>

      <div>
        <img
          src="/img/logo.webp"
          alt="Main Image"
          loading="eager"
          style={{ display: "none" }}
        />
        <img
          src="/img/بنر.webp"
          alt="Main Image"
          loading="eager"
          style={{ display: "none" }}
        />
        <img
          src="/img/بنرر.webp"
          alt="Main Image"
          loading="eager"
          style={{ display: "none" }}
        />
        <img
          src="/img/بنر3.webp"
          alt="Main Image"
          loading="eager"
          style={{ display: "none" }}
        />
        <img
          src="/img/q3wan1.webp"
          alt="Main Image"
          loading="eager"
          style={{ display: "none" }}
        />
        <SocialMediaIcons />
        <Slider />
        <NewsSection />
        <StatsSection />
        <Projects />
        <SeasonalProjectsSection />
        <StrategicPartners />
        <Footer />
      </div>
    </>
  );
};

// Add display name for better debugging
Home.displayName = "Home";

export default Home;
