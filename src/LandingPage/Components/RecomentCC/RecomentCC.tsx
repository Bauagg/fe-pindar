import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

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

const getItemsByDevice = (width: number) => {
  if (width >= 1024) return 10; // desktop / laptop
  if (width >= 768) return 8; // tablet
  return 6; // hp
};

const RekomendasiCreditCard = () => {
  const [apps, setApps] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [itemsToShow, setItemsToShow] = useState<number>(6);

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

  // detect device resize
  useEffect(() => {
    const handleResize = () => {
      setItemsToShow(getItemsByDevice(window.innerWidth));
    };

    handleResize(); // initial set
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="w-full pt-10 md:pt-14 max-w-6xl mx-auto px-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg md:text-2xl font-bold text-gray-900">Kartu Kredit</h2>

        <NavLink to="/kartukredit" className="text-sm font-medium text-gray-700 hover:text-red-500 transition">
          Lihat Semua
        </NavLink>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(9)].map((_, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 animate-pulse">
              <div className="w-full aspect-square bg-gray-200 rounded-xl" />
              <div className="h-3 bg-gray-200 rounded mt-3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {apps.slice(0, itemsToShow).map((app) => (
            <Link
              key={app.id}
              to={`/creditcarddetail/${app.id}`}
              className="
                group bg-white
                rounded-2xl
                p-3 md:p-5
                shadow-xl
                transition-all duration-300
                hover:-translate-y-1
              ">
              <div className="w-full aspect-square flex items-center justify-center">
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}/api${app.imageLink}`}
                  alt={app.title}
                  className="
                    w-24 h-24 md:w-24 md:h-24
                    object-contain
                    transition-transform duration-300
                    group-hover:scale-110
                  "
                />
              </div>

              <div className="mt-3 text-center">
                <p className="text-xs md:text-sm font-semibold text-gray-800 line-clamp-2">{app.title}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default RekomendasiCreditCard;
