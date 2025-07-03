import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { config } from "@fortawesome/fontawesome-svg-core";
import Layout from "./Layout";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Login from "./pages/Login";
import axios from "axios";
import { MoonLoader } from "react-spinners";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Suspense, lazy, useEffect, useState } from "react";

// Import all components directly
import Home from "./pages/Home";
import Slider from "./pages/Home/components/Slider";
import NewsSection from "./pages/Home/components/NewsSection";
import StatsSection from "./pages/Home/components/StatsSection";
import Projects from "./pages/Home/components/Projects";
import SeasonalProjectsSection from "./pages/Home/components/SeasonalProjects";
import StrategicPartners from "./pages/Home/components/StrategicPartners";
import CircularGallery from "../yes/CircularSlider";
import Footer from "./components/Footer";
import SignFamily from "./pages/SignFamily/testIndex";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import useFetchCurrentUser from "./hooks/Auth/useFetchCurrentUser";
import { UserData } from "./pages/SignFamily/useFamilyForm";

// Lazy load Dashboard, AdminLogin, and BeneficiaryDetails
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const BeneficiaryDetails = lazy(() => import("./pages/BeneficiaryDetails"));

axios.defaults.withCredentials = true;   
config.autoAddCss = false;

function App() {



    
    
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* User Layout */}
          <Route element={<Layout><UserLayout /></Layout>}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path='/sign-family' element={<SignFamily />} />
          </Route>
          {/* Admin Layout: No Header, No Layout */}
          <Route element= {<Layout>
            <AdminLayout />
          </Layout>}>

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/login" element={<AdminLogin />} />
          <Route path="/dashboard/beneficiary/:id" element={<BeneficiaryDetails />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
