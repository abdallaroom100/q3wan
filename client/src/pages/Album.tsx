import React, { Suspense, useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { MoonLoader } from 'react-spinners';

const CircularGallery = React.lazy(() => import('../../yes/CircularSlider'));

const images = [
  { image: "/img/q3wan1.jpg", text: "" },
  { image: "/img/q3wan2.jpg", text: "" },
  { image: "/img/q3wan3.jpg", text: "" },
  { image: "/img/q3wan6.jpg", text: "" },
  { image: "/img/q3wan4.jpg", text: "" },
  { image: "/img/q3wan5.jpg", text: "" },
  { image: "/img/q3wan7.jpg", text: "" },
  // ... باقي الصور
];

function preloadImages(imageList: { image: string,text:string }[]) {
  return Promise.all(
    imageList.map(({ image }) => {
      return new Promise((resolve) => {
        const img = new window.Image();
        img.src = image;
        img.onload = resolve;
        img.onerror = resolve;
      });
    })
  );
}

const Album = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    preloadImages(images).then(() => setReady(true));
  }, []);

  return (
    <div>
      <div className="text-center translate-y-[10vh] lg:translate-y-[5vh]">
        <h2 className="text-4xl font-bold text-gray-800">معرض الصور</h2>
        <div className="w-24 h-1 bg-[#4a548dfc] mx-auto rounded-full"></div>
      </div>
      <div style={{ height: '750px', position: 'relative' }}>
        {ready ? (
          <Suspense fallback={<div className='w-full h-full flex items-center justify-center'>

            <MoonLoader />
          </div>}>
            <CircularGallery
              items={images}
              bend={typeof window !== "undefined" ? (window.innerWidth > 991 ? 4 : 0.2) : 0}
              textColor="#ffffff"
              borderRadius={0.05}
            />
          </Suspense>
        ) : (
          <div className='w-full h-full flex items-center justify-center'>

          <MoonLoader />
        </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Album;