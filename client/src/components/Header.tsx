import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logOut } from "../store/slices/user";
import hotToast from "../common/hotToast";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const user = useSelector((state: any) => state.user.user);
  const history = useNavigate();

  const localstorageList = [
    "user",
    "signFamilyTempMaleCount",
    "signFamilyTempCompanionsCount",
    "signFamilyTempCompanions",
    "signFamilyStep",
    "signFamilyMaleCount",
    "signFamilyIncomeSources",
    "signFamilyFormData",
    "signFamilyDateType",
    "signFamilyCompanionsCount",
    "signFamilyCompanions",
    "signFamilyBirthDate",
    "GDPR_REMOVAL_FLAG",
  ];
  const handleLogout = () => {
    dispatch(logOut());
 
     localstorageList.forEach((item)=>localStorage.removeItem(item))
    


    window.location.reload();
  };

  return (
    <header
      style={{ direction: "rtl" }}
      className=" flex justify-between items-center !gap-1 md:gap-6  lg:!px-10 px-4  "
    >
      <button className="logo cursor-pointer" onClick={() => history("/")}>
        <img src="img/logo.png" className="logo" alt="شعار الجمعية" />
      </button>

      <div className="menu-toggle" id="menu-toggle" onClick={toggleMenu}>
        <i className={isMenuOpen ? "ri-close-line" : "ri-menu-line"}></i>
      </div>
      <nav id="navbar" className={isMenuOpen ? "open" : ""}>
        <ul>
          <li>
            <a href="#home" className="active">
              الرئيسية
            </a>
          </li>
          <li>
            <a href="#about">عن الجمعية</a>
          </li>
          <li>
            <a href="#services">مشاريع ثابتة</a>
          </li>
          <li>
            <a href="#season">مشاريع موسمية</a>
          </li>
          <li>
            <a href="#contact">اتصل بنا</a>
          </li>
        </ul>
      </nav>
      <div className="flex items-center gap-4">
        {user && (
          <Link to={"/sign-family"} className="sin ">
            تسجيل مستفيد
          </Link>
        )}
        {user ? (
          <button className="sin " onClick={handleLogout}>
            تسجيل الخروج
          </button>
        ) : (
          <Link to={"/login"} className="sin ">
            تسجيل الدخول
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
