import { useEffect, useRef, useState } from "react";
import axios from "axios";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

type PopularType = {
  id: string;
  status: string;
  url: string;
  order: number;
  imageLink: string;
  type: string;
};

const PopularPlus = () => {
  const [apps, setApps] = useState<PopularType[]>([]);
  const paginationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/announcement/active?type=popular`);
        setApps((response.data.data || []).slice(0, 5)); // ambil index 0-4
      } catch (error) {
        console.error("Gagal mengambil popular plus:", error);
      }
    };

    fetchPopular();
  }, []);

  // jangan render Swiper sebelum data ada
  if (apps.length === 0) return null;

  return (
    <section className="w-full max-w-6xl mx-auto">
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
            el: paginationRef.current, // elemen milik instance ini
          }}
          onBeforeInit={(swiper) => {
            if (swiper.params.pagination && typeof swiper.params.pagination !== "boolean") {
              swiper.params.pagination.el = paginationRef.current;
            }
          }}
          slidesPerView={1}
          spaceBetween={0}
          centeredSlides={false}
          breakpoints={{
            1024: {
              slidesPerView: 1.5,
              spaceBetween: 24,
              centeredSlides: true,
            },
          }}
          className="overflow-visible">
          {apps.map((app) => (
            <SwiperSlide key={app.id}>
              {({ isActive }) => (
                <a href={app.url} target="_blank" rel="noopener noreferrer" className={`block rounded-3xl overflow-hidden transition-all duration-500 ${isActive ? "lg:scale-100 lg:opacity-100" : "lg:scale-90 lg:opacity-60"}`}>
                  <img src={`${process.env.REACT_APP_API_BASE_URL}/api${app.imageLink}`} alt="Popular Plus" className="w-full h-[150px] md:h-[250px] object-cover" />
                </a>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* PAGINATION: tiap instance punya elemen sendiri */}
        <div ref={paginationRef} className="custom-pagination mt-3 flex justify-center gap-2" />
      </div>
    </section>
  );
};

export default PopularPlus;
