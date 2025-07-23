import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logOut } from "../store/slices/user";
import hotToast from "../common/hotToast";
import { RiMenu3Line, RiCloseLine, RiArrowDownSLine, RiInformationLine, RiFlag2Line } from "react-icons/ri";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [aboutDropdown, setAboutDropdown] = useState(false);
  const [aboutDropdownVisible, setAboutDropdownVisible] = useState(false);
  const aboutDropdownRef = useRef<HTMLDivElement>(null);
  const aboutDropdownTimeout = useRef<number | null>(null);
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const history = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle dropdown open/close with animation
  useEffect(() => {
    if (aboutDropdown) {
      if (aboutDropdownTimeout.current) {
        clearTimeout(aboutDropdownTimeout.current);
      }
      setAboutDropdownVisible(true);
    } else if (aboutDropdownVisible) {
      aboutDropdownTimeout.current = window.setTimeout(() => setAboutDropdownVisible(false), 380);
    }
    return () => {
      if (aboutDropdownTimeout.current) {
        clearTimeout(aboutDropdownTimeout.current);
      }
    };
  }, [aboutDropdown]);

  // عند unmount امسح التايمر
  useEffect(() => {
    return () => {
      if (aboutDropdownTimeout.current) {
        clearTimeout(aboutDropdownTimeout.current);
      }
    };
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(event.target as Node)) {
        setAboutDropdown(false);
      }
    }
    if (aboutDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [aboutDropdown]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

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
    localstorageList.forEach((item) => localStorage.removeItem(item));
    hotToast({ type: "success", message: "تم تسجيل الخروج" });
    history("/login");
    closeMenu(); 
  };

  // navItems without 'عن الجمعية'
  const navItems = [
    { href: "/", label: "الرئيسية" },
    { href: "/about", label: "معلومات عنا" },
    { href: "/goals", label: "أهدافنا" },
    { href: "/says", label: "قالو عنا" },
    { href: "/album", label: "معرض الصور" },
  ];
  const navItemsMobile = [
    { href: "/", label: "الرئيسية" },
    { href: "/says", label: "قالو عنا" },
    { href: "/album", label: "معرض الصور" },

  ];

  // Dropdown items
  const aboutDropdownItems = [
    { href: "/about", label: "معلومات عنا", icon: <RiInformationLine className="ml-2 text-lg" /> },
    { href: "/goals", label: "أهدافنا", icon: <RiFlag2Line className="ml-2 text-lg" /> },
  ];

  return (
    <>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 `}
        style={{ direction: "rtl" }}
      >
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 lg:h-20 w-full justify-between">
            {/* Logo - Right */}
            <div className="flex items-center w-full lg:w-auto  justify-between">
              <button
                onClick={() => {
                  history("/");
                  closeMenu();
                }}
                className="group flex items-center"
              >
                <div className="lg:w-[110px] xl:!w-[180px]">
                <picture>
                  <source srcSet="img/logo.webp" type="image/webp" />
                  <img
                    src="img/logo.webp"
                    className="h-10  lg:h-12 transition-transform duration-300  scale-[1.77]"
                    alt="شعار الجمعية"
                  />
                </picture> 
                </div>
              </button>
              {/* زر الموبايل */}
              <div className="lg:hidden ml-2">
                <button
                  onClick={toggleMenu}
                  className="p-2 rounded-lg text-gray-700 hover:text-[rgb(58,61,108)] hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[rgb(58,61,108)] focus:ring-offset-2"
                  aria-label="فتح القائمة"
                >
                  <RiMenu3Line size={28} />
                </button>
              </div>
            </div>

            {/* Links - Center */}
            <nav className="hidden lg:!flex items-center gap-10 flex-1 justify-center">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className="relative text-gray-700 font-bold transition-all duration-300 px-4 py-2 rounded-lg group"
                  style={{ fontSize: '1.15rem', fontFamily: 'inherit' }}
                >
                  {item.label}
                  <span
                    className="absolute right-0 left-0 -bottom-1 h-1 bg-gradient-to-l from-[rgb(149,122,77)] to-[rgb(58,61,108)] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"
                  ></span>
                </Link>
              ))}
            </nav>

            {/* Buttons - Left */}
            <div className="hidden lg:!flex items-center gap-3">
              {user && (
                <Link
                  to="/sign-family"
                  className="relative overflow-hidden bg-gradient-to-r from-[rgb(58,61,108)] to-[rgb(58,61,108)] hover:from-[rgb(149,122,77)] hover:to-[rgb(149,122,77)] text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <span className="relative z-10">تسجيل مستفيد</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[rgb(149,122,77)] to-[rgb(58,61,108)] opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              )}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="relative overflow-hidden cursor-pointer bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <span className="relative z-10">تسجيل الخروج</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="relative overflow-hidden bg-gradient-to-r from-[rgb(58,61,108)] to-[rgb(58,61,108)] hover:from-[rgb(149,122,77)] hover:to-[rgb(149,122,77)] text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <span className="relative z-10">تسجيل الدخول</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[rgb(149,122,77)] to-[rgb(58,61,108)] opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              )}
            </div>
          </div>
          
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[100]  transition-all duration-300` + (isMenuOpen ? '' : ' pointer-events-none') }>
        {/* Slide-in menu */}
        <div className={`fixed top-0 right-0 w-full h-full bg-white flex flex-col items-center justify-center transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Close Button */}
          <button
            onClick={closeMenu}
            className="absolute top-6 left-6 text-3xl text-gray-700 p-2 rounded hover:bg-gray-100 transition"
            aria-label="إغلاق القائمة"
          >
            <RiCloseLine size={36} />
          </button>
          {/* Centered Menu Content */}
          <div className="flex flex-col items-center  w-full h-full gap-8 mt-[11.5vh] p-5">
            <nav className="flex flex-col gap-4 w-full max-w-90 !flex-[0] relative">
              {/* الرئيسية */}
              {navItemsMobile.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  onClick={closeMenu}
                  className="block bg-[#f4f3fb] text-center text-gray-700 hover:text-[rgb(58,61,108)] hover:underline hover:underline-offset-4 px-6 py-4 rounded-lg font-bold text-lg transition-all duration-200 cursor-pointer"
                  style={{ fontSize: '1.125rem', fontFamily: 'inherit' }}
                >
                  {item.label}
                </Link>
              ))}
              {/* About Dropdown in mobile menu - تحت الرئيسية مباشرة */}
              <div className="relative w-full flex flex-col items-center rounded-none " style={{ overflow: 'hidden' }}>
                <button
                  onClick={() => setAboutDropdown((v) => !v)}
                  className="flex items-center justify-between w-full text-gray-700 bg-[#f4f3fb] hover:text-[rgb(58,61,108)] hover:underline hover:underline-offset-4 font-bold text-lg transition-all duration-300 px-6 py-4  hover:bg-gray-50 focus:outline-none border border-gray-100 cursor-pointer z-10 relative"
                  style={{ fontSize: '1.125rem', fontFamily: 'inherit', zIndex: 10, position: 'relative' }}
                >
                  <span>عن المبرة</span>
                  <RiArrowDownSLine className={`transition-transform duration-200 ${aboutDropdown ? 'rotate-180' : ''}`} size={24} />
                </button>
                {aboutDropdownVisible && (
                  <div className={`w-full flex flex-col items-center bg-[#f4f3fb]    border-x border-b border-gray-100 overflow-visible  z-0 ${aboutDropdown ? 'animate-dropdownOpenSoft' : 'animate-dropdownCloseSoft'}`}>
                    {aboutDropdownItems.map((item, idx) => (
                      <Link
                        key={idx}
                        to={item.href}
                        className="flex items-center w-full px-5 py-4 text-gray-700 hover:bg-[rgb(58,61,108)] hover:text-white transition-all duration-200 text-base font-semibold  mb-1 last:mb-0 group"
                        style={{ fontFamily: 'inherit' }}
                        onClick={() => { setAboutDropdown(false); closeMenu(); }}
                      >
                        {item.icon}
                        <span className="flex-1 text-right">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>
            <div className="flex flex-col gap-3 w-full max-w-[370px] mt-4">
              {user && (
                <Link
                  to="/sign-family"
                  onClick={closeMenu}
                  className="block w-full text-center bg-[rgb(58,61,108)] hover:bg-[rgb(149,122,77)] text-white px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300"
                >
                  تسجيل مستفيد
                </Link>
              )}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="block w-full text-center bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300"
                >
                  تسجيل الخروج
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="block w-full text-center bg-[rgb(58,61,108)] hover:bg-[rgb(149,122,77)] text-white px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300"
                >
                  تسجيل الدخول
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from hiding under fixed header */}
      
    </>
  );
};

export default Header;