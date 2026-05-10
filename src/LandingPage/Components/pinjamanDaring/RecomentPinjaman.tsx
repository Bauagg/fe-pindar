import { Link, NavLink } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useEffect, useState } from "react";
import axios from "axios";

import "swiper/css";
import "swiper/css/pagination";

interface Lender {
  id: string;
  lendername: string;
  imagelink: string;
  maxtenor: number;
  maxloan: string;
  ispin: boolean;
  directlink: string;
}

interface ApiResponse {
  code: number;
  message: string;
  data: {
    lenders: Lender[];
    pagination: {
      total: number;
      totalPages: number;
      currentPage: number;
      size: number;
    };
  };
}

const RekomendasiApp = () => {
  const [apps, setApps] = useState<Lender[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const limit = 8;
  const page = 1;

  useEffect(() => {
    const fetchLenders = async () => {
      try {
        setLoading(true);

        const response = await axios.get<ApiResponse>(`${process.env.REACT_APP_API_BASE_URL}/api/lender/list-pinned?limit=${limit}&offset=${page}`);

        setApps(response.data.data.lenders);
      } catch (error) {
        console.error("Failed fetch lenders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLenders();
  }, []);

  return (
    <section className="w-full pt-10 md:pt-14 max-w-6xl mx-auto px-1 md:px-3">
      {/* HEADER */}
      <div className="px-6 flex items-center justify-between mb-8">
        <h2 className="text-lg md:text-2xl font-bold text-gray-900">Aplikasi Rekomendasi</h2>

        <NavLink to="/pindar" className="text-sm font-medium text-gray-700 hover:text-red-500 transition">
          View all →
        </NavLink>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 px-6">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="bg-white rounded-3xl p-6 animate-pulse">
              <div className="w-full aspect-square bg-gray-200 rounded-2xl" />

              <div className="h-4 bg-gray-200 rounded mt-4" />
            </div>
          ))}
        </div>
      ) : (
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
            {apps.map((app) => (
              <SwiperSlide key={app.id} className="pb-6">
                <Link
                  to={`pindardetail/${app.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
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
                      src={`${process.env.REACT_APP_API_BASE_URL}${app.imagelink}`}
                      alt={app.lendername}
                      className="
                        w-24 h-24 object-contain
                        transition-transform duration-300
                        group-hover:scale-110
                      "
                    />
                  </div>

                  <div className="mt-4 text-center">
                    <p className="text-sm font-semibold text-gray-800 line-clamp-1">{app.lendername}</p>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </section>
  );
};

export default RekomendasiApp;
