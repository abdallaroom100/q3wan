
import Slider from "./components/Slider";
import NewsSection from "./components/NewsSection";
import StatsSection from "./components/StatsSection";
import Projects from "./components/Projects";
import SeasonalProjectsSection from "./components/SeasonalProjects";
import StrategicPartners from "./components/StrategicPartners";
import Footer from "../../components/Footer";

import SocialMediaIcons from "../../common/SocialIcom";


const Home = () => {

  return (
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
  );
};

// Add display name for better debugging
Home.displayName = 'Home';

export default Home;