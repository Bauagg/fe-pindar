import { NavLink } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const apps = [
  { logo: "/images/popular1.png", link: "/" },
  { logo: "/images/popular2.png", link: "/" },
  { logo: "/images/popular3.png", link: "/" },
  { logo: "/images/popular1.png", link: "/" },
  { logo: "/images/popular2.png", link: "/" },
];

const RekomendasiApp = () => {
  return (
    <section className="w-full max-w-6xl mx-auto px-1 md:px-3 ">
      {/* HEADER */}
      <div className="px-6 flex items-center justify-between mb-6">
        <h2 className="text-lg md:text-2xl font-bold text-gray-900">Popular Plus</h2>
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
          pagination={{
            clickable: true,
            el: ".custom-pagination",
          }}
          /* ===== DEFAULT (HP & TABLET) ===== */
          slidesPerView={1}
          spaceBetween={0}
          centeredSlides={false}
          /* ===== DESKTOP ===== */
          breakpoints={{
            1024: {
              slidesPerView: 1.5,
              spaceBetween: 24,
              centeredSlides: true,
            },
          }}
          className="overflow-visible">
          {apps.map((app, index) => (
            <SwiperSlide key={index}>
              {({ isActive }) => (
                <NavLink
                  to={app.link}
                  className={`
                    block rounded-3xl overflow-hidden
                    transition-all duration-500
                    lg:${isActive ? "scale-100 opacity-100" : "scale-90 opacity-60"}
                  `}>
                  <img src={app.logo} alt="Pamflet" className="w-full h-[180px] md:h-[300px] object-cover" />
                </NavLink>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* PAGINATION */}
        <div className="custom-pagination mt-3 flex justify-center gap-2" />
      </div>
    </section>
  );
};

export default RekomendasiApp;
