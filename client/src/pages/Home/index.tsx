import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "./components/Slider";
import NewsSection from "./components/NewsSection";
import StatsSection from "./components/StatsSection";
import Projects from "./components/Projects";
import SeasonalProjectsSection from "./components/SeasonalProjects";
import StrategicPartners from "./components/StrategicPartners";
import Footer from "../../components/Footer";
import CircularGallery from "../../../yes/CircularSlider";
import { RootState } from "../../store/store";
import { setState } from "../../store/slices/home";
import { FaWhatsapp } from "react-icons/fa";
import SocialMediaIcons from "../../common/SocialIcom";
// Skeleton loader for CircularGallery
const GallerySkeleton = () => (
  <div className="animate-pulse">
    <div className="h-[600px] w-full bg-gray-200 rounded-lg flex items-center justify-center">
      <div className="w-32 h-32 rounded-full bg-gray-300"></div>
    </div>
  </div>
);

const Home = () => {
  const dispatch = useDispatch();
  const cachedState = useSelector((state: RootState) => state.home);
  
  // Initialize state from cache or defaults
  const [loadedComponents, setLoadedComponents] = useState(() => {
    if (cachedState?.loadedComponents) {
      return cachedState.loadedComponents;
    }
    return {
      slider: true,
      news: true,
      stats: true,
      projects: true,
      seasonal: true,
      partners: true,
      gallery: true,
      footer: true
    };
  });

  // Memoize the gallery component to prevent unnecessary re-renders
  const galleryComponent = useMemo(() => (
    <CircularGallery bend={5} textColor="#ffffff" borderRadius={0.05} />
  ), []);

  // Save state to Redux whenever it changes
  useEffect(() => {
    dispatch(setState({
      isLoaded: true,
      loadedComponents
    }));
  }, [loadedComponents, dispatch]);

  return (
    <div>
      <SocialMediaIcons />
      {/* <div className="fixed bottom-[2rem] cursor-pointer hover:bg-green-600 transition-colors right-[2rem] w-[80px] h-[80px] rounded-full bg-green-500  z-[100] flex justify-center items-center ">
      <a href="#">
        <FaWhatsapp size={50} color="white"/>
      </a>
      </div> */}
      <Slider />
      <NewsSection />
      <StatsSection />
      <Projects />
      <SeasonalProjectsSection />
      <StrategicPartners />

      {/* <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-800">معرض الصور</h2>
        <div className="w-24 h-1 bg-[#4a548dfc] mx-auto rounded-full"></div>
      </div>
      
      <div style={{ height: '600px', position: 'relative' }}>
        {galleryComponent}
      </div>
       */}
      <Footer />
    </div>
  );
};

// Add display name for better debugging
Home.displayName = 'Home';

export default Home;