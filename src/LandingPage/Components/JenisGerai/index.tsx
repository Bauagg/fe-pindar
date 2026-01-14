import { NavLink } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "./style.css";

import "swiper/css";
import "swiper/css/pagination";

const apps = [
  { logo: "/images/deal1.png", link: "/" },
  { logo: "/images/deal2.png", link: "/" },
  { logo: "/images/deal3.png", link: "/" },
  { logo: "/images/deal4.png", link: "/" },
  { logo: "/images/deal2.png", link: "/" },
];

const RekomendasiApp = () => {
  return (
    <section className="w-full max-w-6xl mx-auto px-1 md:px-3 pt-10">
      {/* HEADER */}
      <div className="px-6 flex items-center justify-between mb-6">
        <h2 className="text-lg md:text-2xl font-bold text-gray-900">Popular Deal</h2>
      </div>

      {/* SWIPER */}
      <div className="relative px-6">
        <Swiper
          modules={[Pagination, Autoplay]}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop
          pagination={{ clickable: true }}
          slidesPerView={2}
          spaceBetween={12}
          centeredSlides={false}
          breakpoints={{
            768: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
          }}
          className="pb-12">
          {apps.map((app, index) => (
            <SwiperSlide key={index}>
              <NavLink to={app.link} className="block rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-105">
                <img src={app.logo} alt="Pamflet" className="w-full h-[180px] md:h-[200px] lg:h-[300px] object-cover" />
              </NavLink>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default RekomendasiApp;
