import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

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

  const limit = 9;
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
    <section className="w-full pt-10 md:pt-14 max-w-6xl mx-auto px-3">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg md:text-2xl font-bold text-gray-900">Aplikasi Rekomendasi</h2>

        <NavLink to="/pindar" className="text-sm font-medium text-gray-700 hover:text-red-500 transition">
          View all →
        </NavLink>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(9)].map((_, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 animate-pulse">
              <div className="w-full aspect-square bg-gray-200 rounded-xl" />

              <div className="h-3 bg-gray-200 rounded mt-3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {apps.map((app) => (
            <Link
              key={app.id}
              to={`pindardetail/${app.id}`}
              rel="noopener noreferrer"
              className="
                group bg-white
                rounded-2xl
                p-3 md:p-5
                shadow-xl
                hover:shadow-xl
                transition-all duration-300
                hover:-translate-y-1
              ">
              <div className="w-full aspect-square flex items-center justify-center">
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}${app.imagelink}`}
                  alt={app.lendername}
                  className="
                    w-16 h-16 md:w-24 md:h-24
                    object-contain
                    transition-transform duration-300
                    group-hover:scale-110
                  "
                />
              </div>

              <div className="mt-3 text-center">
                <p className="text-xs md:text-sm font-semibold text-gray-800 line-clamp-2">{app.lendername}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default RekomendasiApp;
