import { useEffect, useState } from "react";
import axios from "axios";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "./style.css";

import "swiper/css";
import "swiper/css/pagination";

type DealType = {
  id: string;
  status: string;
  url: string;
  order: number;
  imageLink: string;
  type: string;
};

const PopularDeal = () => {
  const [apps, setApps] = useState<DealType[]>([]);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/announcement/active?type=deal`);

        setApps(response.data.data || []);
      } catch (error) {
        console.error("Gagal mengambil data popular deal:", error);
      }
    };

    fetchDeals();
  }, []);

  return (
    <section className="w-full max-w-6xl mx-auto px-1 md:px-3">
      {/* HEADER */}
      {/* <div className="px-6 flex items-center justify-between mb-6">
        <h2 className="text-lg md:text-2xl font-bold text-gray-900">Popular Deal</h2>
      </div> */}

      {/* SWIPER */}
      <div className="relative px-6">
        <Swiper
          key={apps.length}
          modules={[Pagination, Autoplay]}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          loop={apps.length > 4}
          watchOverflow={false}
          observer={true}
          observeParents={true}
          resizeObserver={true}
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
          onSwiper={(swiper) => {
            setTimeout(() => {
              swiper.update();

              if (swiper.autoplay) {
                swiper.autoplay.start();
              }
            }, 100);
          }}
          className="!pb-12">
          {apps.map((app) => (
            <SwiperSlide key={app.id} className="!h-auto">
              <a href={app.url} target="_blank" rel="noopener noreferrer" className="block rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-105">
                <img src={`${process.env.REACT_APP_API_BASE_URL}/api${app.imageLink}`} alt="Popular Deal" className="w-full h-[180px] md:h-[200px] lg:h-[300px] object-cover" />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default PopularDeal;
