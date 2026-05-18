import { Link, NavLink } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useEffect, useState } from "react";
import axios from "axios";

import "swiper/css";
import "swiper/css/pagination";

interface Feature {
  feature: string;
}

interface CreditCard {
  id: string;
  title: string;
  yearlyFee: string;
  detailYearlyFee: string;
  benefitId: string;
  benefitName: string;
  redirectLink: string | null;
  imageLink: string;
  features: Feature[];
}

interface ApiResponse {
  code: number;
  message: string;
  data: {
    creditCards: CreditCard[];
  };
}

const RekomendasiCreditCard = () => {
  const [apps, setApps] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const limit = 10;
  const page = 1;

  useEffect(() => {
    const fetchCreditCards = async () => {
      try {
        setLoading(true);

        const response = await axios.get<ApiResponse>(`${process.env.REACT_APP_API_BASE_URL}/api/credit-card/search?limit=${limit}&offset=${page}`);

        setApps(response.data.data.creditCards);
      } catch (error) {
        console.error("Failed fetch credit cards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreditCards();
  }, []);

  return (
    <section className="w-full pt-10 md:pt-14 max-w-6xl mx-auto px-1 md:px-3">
      {/* HEADER */}
      <div className="px-6 flex items-center justify-between mb-8">
        <h2 className="text-lg md:text-2xl font-bold text-gray-900">Rekomendasi Credit Card</h2>

        <NavLink to="/kartukredit" className="text-sm font-medium text-gray-700 hover:text-red-500 transition">
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
                  to={`/creditcarddetail/${app.id}`}
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
                      src={`${process.env.REACT_APP_API_BASE_URL}/api${app.imageLink}`}
                      alt={app.title}
                      className="
                        w-24 h-24 object-contain
                        transition-transform duration-300
                        group-hover:scale-110
                      "
                    />
                  </div>

                  <div className="mt-4 text-center">
                    <p className="text-sm font-semibold text-gray-800 line-clamp-1">{app.title}</p>

                    {/* <p className="text-xs text-gray-500 mt-1">{app.benefitName}</p> */}
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

export default RekomendasiCreditCard;
