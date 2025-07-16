
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
        <title>جمعية مبرة القعوان الخيرية</title>
        <link rel="icon" type="image/png" href="/img/logo.png" />
        <link rel="canonical" href="https://store.elqawan.com/" />
        <meta name="description" content="جمعية مبرة القعوان الخيرية: جمعية خيرية سعودية تهدف إلى دعم الأسر المحتاجة، كفالة الأيتام، وتنمية المجتمع من خلال مشاريع إنسانية وتنموية متنوعة في منطقة القعوان وما حولها." />
        <meta name="keywords" content="جمعية خيرية, مبرة القعوان, كفالة أيتام, دعم الأسر, مشاريع خيرية, السعودية, العمل الخيري, التنمية المجتمعية, تبرع, صدقة, مشاريع موسمية, مشاريع تنموية, جمعية القعوان, q3wan charity, q3wan, q3wan.org" />
        <meta name="author" content="جمعية مبرة القعوان الخيرية" />
        <meta property="og:title" content="جمعية مبرة القعوان الخيرية" />
        <meta property="og:description" content="جمعية سعودية غير ربحية تهدف إلى تقديم الدعم والرعاية للأسر المحتاجة والأيتام وتنفيذ مشاريع خيرية وتنموية في منطقة القعوان." />
        <meta property="og:image" content="/img/logo.png" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="جمعية مبرة القعوان الخيرية" />
        <meta property="og:locale" content="ar_SA" />
        <meta property="og:url" content="https://q3wan.org/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="جمعية مبرة القعوان الخيرية" />
        <meta name="twitter:description" content="جمعية سعودية غير ربحية تهدف إلى تقديم الدعم والرعاية للأسر المحتاجة والأيتام وتنفيذ مشاريع خيرية وتنموية في منطقة القعوان." />
        <meta name="twitter:image" content="/img/logo.png" />
        <meta name="twitter:site" content="@q3wan_charity" />
      </Helmet>
      <div>
        <img src="/img/logo.webp" alt="Main Image" loading="eager" style={{ display: "none" }} />
        <img src="/img/بنر.webp" alt="Main Image" loading="eager" style={{ display: "none" }} />
        <img src="/img/بنرر.webp" alt="Main Image" loading="eager" style={{ display: "none" }} />
        <img src="/img/بنر3.webp" alt="Main Image" loading="eager" style={{ display: "none" }} />
        <img src="/img/q3wan1.webp" alt="Main Image" loading="eager" style={{ display: "none" }} />
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
Home.displayName = 'Home';

export default Home;