import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// كائن لحفظ مواضع التمرير لكل صفحة
const scrollPositions: { [key: string]: number } = {};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const prevPath = useRef(pathname);

  useEffect(() => {
    // عند مغادرة الصفحة: احفظ الموضع الحالي
    scrollPositions[prevPath.current] = window.scrollY;

    // عند الدخول: إذا كان هناك موضع محفوظ، استرجعه
    if (scrollPositions[pathname] !== undefined) {
      window.scrollTo(0, scrollPositions[pathname]);
    } else {
      window.scrollTo(0, 0);
    }

    prevPath.current = pathname;
  }, [pathname]);

  return null;
};

export default ScrollToTop;