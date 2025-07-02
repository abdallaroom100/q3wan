import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const Slider = () => {
  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      spaceBetween={0}
      slidesPerView={1}
      pagination={{ clickable: true }}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      loop={true}
    >
      <SwiperSlide>
        <img className='!object-fill' src="img/بنر.gif" alt="صورة 1" />
      </SwiperSlide>
      <SwiperSlide>
        <img  className='!object-fill' src="img/بنرر.gif" alt="صورة 2" />
      </SwiperSlide>
      <SwiperSlide>
        <img className='!object-fill'  src="img/بنر3.gif" alt="صورة 3" />
      </SwiperSlide>
    </Swiper>
  );
};

export default Slider;