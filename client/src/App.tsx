import "./App.css";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import { config } from "@fortawesome/fontawesome-svg-core";
import Layout from "./Layout";
// import "@fortawesome/fontawesome-svg-core/styles.css";
import axios from "axios";
import { Suspense, lazy } from "react";
import ScrollToTop from "./pages/ScrollToTop";
// Import all components directly



// // Lazy load Dashboard, AdminLogin, and BeneficiaryDetails
// const Dashboard = lazy(() => import("./pages/Dashboard"));
// const AdminLogin = lazy(() => import("./pages/AdminLogin"));
// const BeneficiaryDetails = lazy(() => import("./pages/BeneficiaryDetails"));

// axios.defaults.withCredentials = true;   
// config.autoAddCss = false;

// function App() {


  
    
//   return (
//     <BrowserRouter>
//       <Suspense fallback={<div>Loading...</div>}>
//         <Routes>
//           {/* User Layout */}
//           <Route element={<Layout><UserLayout /></Layout>}>
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path='/sign-family' element={<SignFamily />} />
//           </Route>
//           {/* Admin Layout: No Header, No Layout */}
//           <Route element= {<Layout>
//             <AdminLayout />
//           </Layout>}>

//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/dashboard/login" element={<AdminLogin />} />
//           <Route path="/dashboard/beneficiary/:id" element={<BeneficiaryDetails />} />
//           </Route>
//         </Routes>
//       </Suspense>
//     </BrowserRouter>
//   );
// }

// export default App;
import "@fortawesome/fontawesome-svg-core/styles.css";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import BeneficiaryDetails from "./pages/BeneficiaryDetails";
import { MoonLoader } from "react-spinners";
import { DashboardProvider } from "./contexts/DashboardContext";
import Says from "./pages/Says";
 
const Login = lazy(() => import("./pages/Login"));
const SignFamily = lazy(() => import("./pages/SignFamily/testIndex"));
const UserLayout = lazy(() => import("./layouts/UserLayout"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AboutUs =   lazy(()=>import("./pages/AboutUs"))
const Goals =   lazy(()=>import("./pages/Goals"))
const Album = lazy(()=>import("./pages/Album"))
const ForgotPassword = lazy(() => import("./pages/forgot-password"));
const ResetPassword = lazy(() => import("./pages/reset-password"));

axios.defaults.withCredentials = true;   
config.autoAddCss = false;

function App() {
  return ( 
    <BrowserRouter>
      <DashboardProvider>
        <Suspense fallback={<div className="w-full h-screen flex justify-center items-center">
          <MoonLoader />
        </div>}>
          <Routes>
          
            <Route element={<Layout ><UserLayout /></Layout>}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/says" element={<Says />} />
              <Route path="/login" element={<Login />} />
              <Route path="/album" element={<Album />} />
              <Route path="/sign-family" element={<SignFamily />} />
              {/* Forgot/Reset Password Routes */}
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>
            <Route element={<Layout><AdminLayout /></Layout>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/login" element={<AdminLogin />} />
              <Route path="/dashboard/beneficiary/:id" element={<BeneficiaryDetails />} />
            </Route>
          </Routes>
        </Suspense>
      </DashboardProvider>
    </BrowserRouter>
  );
}

export default App;