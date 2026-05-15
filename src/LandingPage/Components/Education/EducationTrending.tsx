// pages/TrendingEducation.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Flame, ArrowRight, CalendarDays, Eye, BookOpen, TrendingUp } from "lucide-react";

import Navbar from "../../Components/Navbar";

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

const TrendingEducation = () => {
  const navigate = useNavigate();

  const baseURL = process.env.REACT_APP_API_BASE_URL;

  const [loading, setLoading] = useState(true);

  const [contents, setContents] = useState<ContentItem[]>([]);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${baseURL}/api/content/list?limit=24&offset=0&search=&sortBy=createdDate&sortDirection=desc&requestType=`);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-signika">
        <Navbar />

        <div className="flex items-center justify-center h-[70vh]">
          <div className="flex flex-col items-center gap-5">
            <div className="w-14 md:w-16 h-14 md:h-16 border-[6px] border-red-200 border-t-red-500 rounded-full animate-spin"></div>

            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-black text-gray-800 ">Memuat Trending</h2>

              <p className="text-gray-500 mt-2">Sedang mengambil edukasi trending...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-white font-signika">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-800 via-red-500 to-red-600"></div>

        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl max-sm:mt-12 mt-12">
            <div
              className="
                inline-flex items-center gap-2
                bg-white/20 border border-white/20
                backdrop-blur-md
                px-4 py-2 rounded-full
                text-white font-semibold mb-6 text-sm md:text-base
              ">
              <Flame className="w-4 h-4" />
              Trending Education
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-6xl font-black text-white leading-tight">
              Edukasi Trending
              <span className="block">Paling Populer</span>
            </h1>

            <p className="mt-6 text-white/90 text-sm md:text-lg leading-relaxed">Kumpulan edukasi finansial dan pinjaman daring yang sedang ramai dibaca pengguna untuk membantu Anda tetap aman dan cerdas secara finansial.</p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="relative -mt-8 lg:-mt-10 px-4 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div
            className="
              bg-white rounded-[2rem]
              border border-gray-100
              shadow-xl
              p-6 lg:p-8 mb-8
            ">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <div className="flex items-center gap-3">
                  <div
                    className="
                      w-14 h-14 rounded-2xl
                      bg-red-100
                      flex items-center justify-center
                    ">
                    <TrendingUp className="w-6 h-6 text-red-500" />
                  </div>

                  <div>
                    <p className="text-red-500 font-bold uppercase text-sm">Most Popular</p>

                    <h2 className="text-xl md:text-3xl font-black text-gray-800">Trending Hari Ini</h2>
                  </div>
                </div>
              </div>

              <div
                className="
                  inline-flex items-center gap-2
                  bg-red-50 border border-red-100
                  text-red-600
                  px-5 py-3 rounded-2xl
                  font-bold text-sm md:text-base
                ">
                <BookOpen className="w-3 md:w-5 h-3 md:h-5" />
                {contents.length} Edukasi Trending
              </div>
            </div>
          </div>

          {/* GRID */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {contents.map((item, index) => (
              <div
                key={item.id}
                onClick={() => navigate(`/education/${item.id}`)}
                className="
                  group
                  bg-white rounded-[2rem]
                  overflow-hidden
                  border border-gray-100
                  shadow-lg hover:shadow-2xl
                  cursor-pointer
                  transition-all duration-300
                  hover:-translate-y-1
                ">
                {/* IMAGE */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={`${baseURL}/api${item.imageLink}`}
                    alt={item.title}
                    className="
                      w-full h-full object-cover
                      group-hover:scale-105
                      transition duration-500
                    "
                  />

                  <div
                    className="
                      absolute inset-0
                      bg-gradient-to-t
                      from-black/70
                      via-black/10
                      to-transparent
                    "
                  />

                  {/* TRENDING BADGE */}
                  <div className="absolute top-4 left-4">
                    <div
                      className="
                        flex items-center gap-2
                        bg-red-500 text-white
                        px-4 py-2 rounded-full
                        text-sm font-black
                        shadow-lg
                      ">
                      <Flame className="w-4 h-4" />#{index + 1} Trending
                    </div>
                  </div>

                  {/* CATEGORY */}
                  <div className="absolute bottom-4 left-4">
                    <div
                      className="
                        bg-white/20 backdrop-blur-md
                        border border-white/20
                        text-white
                        px-4 py-2 rounded-full
                        text-sm font-bold
                      ">
                      {item.category}
                    </div>
                  </div>
                </div>

                {/* BODY */}
                <div className="p-6">
                  <h2
                    className="
                      text-xl md:text-2xl font-black text-gray-800
                      leading-snug line-clamp-2
                    ">
                    {item.title}
                  </h2>

                  {/* META */}
                  <div
                    className="
                      flex flex-wrap items-center gap-4
                      mt-5 text-sm text-gray-500
                    ">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      {formatDate(item.createdDate)}
                    </div>

                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      {item.viewCount} views
                    </div>
                  </div>

                  {/* BUTTON */}
                  <button
                    className="
                      mt-6 w-full
                      py-3 md:py-4 rounded-2xl
                      bg-gradient-to-r
                      from-red-800 via-red-500 to-red-600
                      text-white font-black
                      flex items-center justify-center gap-2
                      shadow-lg
                      group-hover:scale-[1.02]
                      transition-all duration-300 
                    ">
                    Baca Edukasi
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrendingEducation;
