import { NavLink } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const apps = [
  { name: "UKU", logo: "/images/duit4.png", link: "/" },
  { name: "Samir", logo: "/images/duit2.png", link: "/" },
  { name: "Toko Modal", logo: "/images/duit3.png", link: "/" },
  { name: "Rupiah Cepat", logo: "/images/duit4.png", link: "/" },
  { name: "UangMe", logo: "/images/duit2.png", link: "/" },
  { name: "UangMe", logo: "/images/duit3.png", link: "/" },
];

const RekomendasiApp = () => {
  return (
    <section className="w-full pt-10 md:pt-14 max-w-6xl mx-auto px-1 md:px-3">
      {/* HEADER */}
      <div className="px-6 flex items-center justify-between mb-8">
        <h2 className="text-lg md:text-2xl font-bold text-gray-900">Aplikasi Rekomendasi</h2>

        <NavLink to="/apps" className="text-sm font-medium text-gray-700 hover:text-red-500 transition">
          View all →
        </NavLink>
      </div>

      {/* SWIPER WRAPPER */}
      <div className="relative px-6">
        <Swiper
          modules={[Pagination, Autoplay]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          spaceBetween={20}
          slidesPerView={2.3}
          breakpoints={{
            640: { slidesPerView: 3.3 },
            1024: { slidesPerView: 5 },
          }}
          className="overflow-visible">
          {apps.map((app, index) => (
            <SwiperSlide key={index} className="pb-6">
              <NavLink
                to={app.link}
                className="
                  group block bg-white
                  rounded-3xl
                  p-6
                  shadow-lg
                  hover:shadow-2xl
                  transition-all duration-300
                  hover:-translate-y-1
                  overflow-hidden
                ">
                <div className="w-full aspect-square flex items-center justify-center">
                  <img
                    src={app.logo}
                    alt={app.name}
                    className="
                      w-24 h-24 object-contain
                      transition-transform duration-300
                      group-hover:scale-110
                    "
                  />
                </div>

                <p className="mt-4 text-center text-sm font-semibold text-gray-800">{app.name}</p>
              </NavLink>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* PAGINATION DI BAWAH CARD */}
      </div>
    </section>
  );
};

export default RekomendasiApp;
