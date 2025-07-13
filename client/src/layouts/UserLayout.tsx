import { Outlet } from "react-router-dom";
import useFetchCurrentUser from "../hooks/Auth/useFetchCurrentUser";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setUser, setIsLoading } from "../store/slices/user";
import { MoonLoader } from "react-spinners";
import Header from "../components/Header";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "../pages/ScrollToTop";

function UserLayout() {
  const dispatch = useDispatch();
  const { isLoading, userData } = useFetchCurrentUser();
  
  
  useEffect(() => {
    // تحديث حالة التحميل في Redux store
    dispatch(setIsLoading(isLoading));
  }, [isLoading, dispatch]);

  useEffect(() => {
    if (userData) {
      const token = JSON.parse(localStorage.getItem("user") || "")?.token;
      userData.token = token;
      dispatch(setUser(userData));
      localStorage.setItem("user", JSON.stringify(userData));
      console.log(userData)
    }
  }, [userData, dispatch]);

  if (isLoading ) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <MoonLoader color="#000" />
      </div>
    );
  }

  return <div>
    <ScrollToTop />
      <Header />
    <Outlet />
    <Toaster />
    </div>
}

export default UserLayout; 