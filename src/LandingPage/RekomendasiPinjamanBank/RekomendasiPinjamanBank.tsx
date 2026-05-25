import { Link, NavLink } from "react-router-dom";
import { dummyPinjamanBank } from "../../types/dummyPinjamanBank";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const RekomendasiPinjamanBank = () => {
  return (
    <section className="w-full pt-10 md:pt-14 max-w-6xl mx-auto px-1 md:px-3">
      <div
        className="
          relative overflow-hidden
          bg-gradient-to-br
          from-red-500
          via-red-600
          to-red-700
          rounded-[1rem] md:rounded-[2rem]
          py-8 md:py-10
          shadow-2xl
        ">
        {/* BACKGROUND EFFECT */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

        {/* HEADER */}
        <div className="relative z-10 px-6 flex items-center justify-between mb-8">
          <h2 className="text-lg md:text-2xl font-bold text-white">Pinjaman Bank</h2>

          <NavLink to="/pinjaman-bank" className="text-sm font-medium text-white/90 hover:text-white transition">
            View all →
          </NavLink>
        </div>

        {/* SWIPER */}
        <div className="relative z-10 px-6">
          <Swiper
            modules={[Pagination, Autoplay]}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            loop={dummyPinjamanBank.length > 5}
            spaceBetween={14}
            slidesPerView={2.15}
            breakpoints={{
              640: {
                slidesPerView: 3.2,
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: 4.5,
                spaceBetween: 18,
              },
            }}
            pagination={{
              clickable: true,
            }}
            className="
              !pb-10
              !overflow-visible

              [&_.swiper-pagination-bullet]:!bg-white/40
              [&_.swiper-pagination-bullet-active]:!bg-white
            ">
            {dummyPinjamanBank.map((item) => (
              <SwiperSlide key={item.id} className="pb-6 !h-auto">
                <Link
                  to={`/pinjaman-bank/${item.id}`}
                  className="
                    group block bg-white
                    rounded-2xl md:rounded-3xl
                    p-4 md:p-6
                    min-h-[180px] md:min-h-[220px]
                    shadow-lg
                    hover:shadow-2xl
                    transition-all duration-300
                    hover:-translate-y-1
                    overflow-hidden
                  ">
                  {/* IMAGE */}
                  <div className="w-full h-24 md:h-28 flex items-center justify-center">
                    <img
                      src={item.imageLink}
                      alt={item.namaBank}
                      className="
                        w-20 h-20 md:w-24 md:h-24
                        object-contain
                        transition-transform duration-300
                        group-hover:scale-110
                      "
                    />
                  </div>

                  {/* TITLE */}
                  <div className="mt-4 text-center">
                    <p className="text-xs md:text-sm font-semibold text-gray-800 line-clamp-1">{item.namaBank}</p>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default RekomendasiPinjamanBank;
