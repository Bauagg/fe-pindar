import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ArrowUpRight, CalendarDays } from "lucide-react";

interface ContentItem {
  id: string;
  title: string;
  category: string;
  linkPath: string;
  createdDate: string;
  imageLink: string;
  isPin: boolean;
  viewCount: number;
}

const EducationLanding = () => {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const baseURL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const response = await fetch(`${baseURL}/api/content/list?limit=3`);

        const result = await response.json();

        setContents(result.data.contents || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, [baseURL]);

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <section className="bg-gradient-to-b from-white to-red-50/40 py-14">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg md:text-2xl font-bold text-gray-900">Education Product</h2>

          <NavLink to="/education" className="text-sm font-medium text-gray-700 hover:text-red-500 transition">
            View all →
          </NavLink>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-[2rem] overflow-hidden shadow-lg animate-pulse">
                <div className="h-60 bg-gray-200"></div>

                <div className="p-6">
                  <div className="h-5 bg-gray-200 rounded w-24 mb-4"></div>

                  <div className="h-6 bg-gray-200 rounded w-full mb-3"></div>

                  <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* CARD GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contents.map((item) => (
                <NavLink
                  key={item.id}
                  to={`/education/${item.id}`}
                  className="
                    group
                    bg-white
                    rounded-[2rem]
                    overflow-hidden
                    border border-gray-100
                    shadow-lg
                    hover:shadow-2xl
                    transition-all duration-500
                    hover:-translate-y-2
                  ">
                  {/* IMAGE */}
                  <div className="relative h-44 md:h-64 overflow-hidden">
                    <img
                      src={`${baseURL}/api${item.imageLink}`}
                      alt={item.title}
                      className="
                        w-full h-44 md:h-full object-cover
                        group-hover:scale-110
                        transition-transform duration-700
                      "
                    />

                    {/* OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    {/* CATEGORY */}
                    <div
                      className="
                        absolute top-4 left-4
                        px-4 py-2 rounded-full
                        bg-red-500/90 backdrop-blur-md
                        text-white text-xs font-bold
                        shadow-lg
                      ">
                      {item.category}
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-6">
                    {/* DATE */}
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-4">
                      <CalendarDays className="w-4 h-4" />
                      {formatDate(item.createdDate)}
                    </div>

                    {/* TITLE */}
                    <h3
                      className="
                        text-lg font-black text-gray-800
                        leading-snug
                        line-clamp-2
                        group-hover:text-red-600
                        transition-colors duration-300
                      ">
                      {item.title}
                    </h3>

                    {/* BUTTON */}
                    <div className="mt-6 flex items-center justify-between text-sm">
                      <span className="text-red-500 font-bold">Baca Selengkapnya</span>

                      <div
                        className="
                          w-11 h-11 rounded-2xl
                          bg-red-50
                          flex items-center justify-center
                          group-hover:bg-red-500
                          transition-all duration-300
                        ">
                        <ArrowUpRight
                          className="
                            w-5 h-5 text-red-500
                            group-hover:text-white
                            transition-colors duration-300
                          "
                        />
                      </div>
                    </div>
                  </div>
                </NavLink>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default EducationLanding;
