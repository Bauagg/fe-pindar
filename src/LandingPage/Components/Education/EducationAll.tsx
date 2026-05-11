// pages/EducationList.tsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Flame, BookOpen, ArrowRight, Search, CalendarDays, Eye } from "lucide-react";

import Navbar from "../../Components/Navbar";

interface CategoryItem {
  id: string;
  name: string;
}

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

const EducationList = () => {
  const navigate = useNavigate();

  const baseURL = process.env.REACT_APP_API_BASE_URL;

  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<CategoryItem[]>([]);

  const [contents, setContents] = useState<ContentItem[]>([]);

  const [activeCategory, setActiveCategory] = useState("All");

  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // CATEGORY
        const categoryResponse = await fetch(`${baseURL}/api/content/content-category`);

        const categoryResult = await categoryResponse.json();

        setCategories(categoryResult.data.categories || []);

        // CONTENT LIST
        const contentResponse = await fetch(`${baseURL}/api/content/list?limit=53&offset=0&search=&sortBy=createdDate&sortDirection=desc&requestType=`);

        const contentResult = await contentResponse.json();

        setContents(contentResult.data.contents || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseURL]);

  const filteredContents = useMemo(() => {
    let filtered = contents;

    // CATEGORY
    if (activeCategory !== "All") {
      filtered = filtered.filter((item) => item.category === activeCategory);
    }

    // SEARCH
    if (search.trim()) {
      filtered = filtered.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()));
    }

    return filtered;
  }, [contents, activeCategory, search]);

  const trendingContents = useMemo(() => {
    return [...contents].slice(0, 5);
  }, [contents]);

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
            <div className="w-16 h-16 border-[6px] border-red-200 border-t-red-600 rounded-full animate-spin"></div>

            <div className="text-center">
              <h2 className="text-2xl font-black text-gray-800">Memuat Edukasi</h2>

              <p className="text-gray-500 mt-2">Sedang mengambil data edukasi...</p>
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
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-700"></div>

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
                text-white font-semibold mb-6
              ">
              <BookOpen className="w-4 h-4" />
              Edukasi Finansial
            </div>

            <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight">
              Belajar Finansial
              <span className="block">Lebih Aman & Cerdas</span>
            </h1>

            <p className="mt-6 text-white/90 text-lg leading-relaxed">Kumpulan edukasi mengenai pinjaman daring, fintech, keamanan digital, dan tips finansial untuk membantu Anda mengambil keputusan yang lebih bijak.</p>

            {/* SEARCH */}
            <div
              className="
                mt-8
                bg-white rounded-3xl
                p-2 flex items-center
                shadow-2xl
              ">
              <div className="px-4 text-gray-400">
                <Search className="w-5 h-5" />
              </div>

              <input
                type="text"
                placeholder="Cari edukasi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full bg-transparent
                  outline-none
                  py-3 text-gray-700
                "
              />
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="relative -mt-8 lg:-mt-10 px-4 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_360px] gap-6">
          {/* LEFT */}
          <div>
            {/* CATEGORY */}
            <div
              className="
                bg-white rounded-[2rem]
                border border-gray-100
                shadow-xl
                p-4 mb-6
              ">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveCategory("All")}
                  className={`
                    px-5 py-3 rounded-2xl
                    font-bold transition-all duration-300
                    ${activeCategory === "All" ? "bg-gradient-to-r from-red-500 to-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
                  `}>
                  All
                </button>

                {categories.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveCategory(item.name)}
                    className={`
                      px-5 py-3 rounded-2xl
                      font-bold transition-all duration-300
                      ${activeCategory === item.name ? "bg-gradient-to-r from-red-500 to-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
                    `}>
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* GRID */}
            <div className="grid sm:grid-cols-2 gap-5">
              {filteredContents.map((item) => (
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
                  ">
                  {/* IMAGE */}
                  <div className="relative overflow-hidden h-60">
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

                    <div className="absolute top-4 left-4">
                      <div
                        className="
                          bg-red-500 text-white
                          px-4 py-2 rounded-full
                          text-xs font-bold
                        ">
                        {item.category}
                      </div>
                    </div>
                  </div>

                  {/* BODY */}
                  <div className="p-5">
                    <h2
                      className="
                        text-xl font-black text-gray-800
                        leading-snug line-clamp-2
                      ">
                      {item.title}
                    </h2>

                    <div
                      className="
                        flex items-center justify-between
                        mt-5 text-sm text-gray-500
                      ">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4" />
                        {formatDate(item.createdDate)}
                      </div>

                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {item.viewCount}
                      </div>
                    </div>

                    <button
                      className="
                        mt-5 w-full
                        py-3 rounded-2xl
                        bg-gradient-to-r
                        from-red-500 to-red-600
                        text-white font-bold
                        flex items-center justify-center gap-2
                      ">
                      Baca Selengkapnya
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            {/* TRENDING */}
            <div
              className="
                bg-white rounded-[2rem]
                border border-gray-100
                shadow-xl
                p-6 sticky top-24
              ">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="
                    w-12 h-12 rounded-2xl
                    bg-orange-100
                    flex items-center justify-center
                  ">
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>

                <div>
                  <p className="text-orange-500 font-bold uppercase text-xs">Trending</p>

                  <h2 className="text-2xl font-black text-gray-800">Populer Hari Ini</h2>
                </div>
              </div>

              <div className="space-y-4">
                {trendingContents.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/education/${item.id}`)}
                    className="
                      group
                      flex gap-4
                      cursor-pointer
                      bg-gray-50 hover:bg-red-50
                      border border-gray-100 hover:border-red-100
                      rounded-3xl
                      p-3 transition-all duration-300
                    ">
                    <div className="relative w-28 h-24 rounded-2xl overflow-hidden shrink-0">
                      <img
                        src={`${baseURL}/api${item.imageLink}`}
                        alt={item.title}
                        className="
                          w-full h-full object-cover
                          group-hover:scale-105
                          transition duration-300
                        "
                      />

                      <div
                        className="
                          absolute top-2 left-2
                          w-7 h-7 rounded-full
                          bg-red-500 text-white
                          flex items-center justify-center
                          text-xs font-black
                        ">
                        {index + 1}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div
                        className="
                          inline-flex
                          px-3 py-1 rounded-full
                          bg-red-100 text-red-600
                          text-[10px] font-bold mb-2
                        ">
                        {item.category}
                      </div>

                      <h3
                        className="
                          text-sm font-black text-gray-800
                          leading-snug line-clamp-3
                        ">
                        {item.title}
                      </h3>

                      <div className="mt-2 text-xs text-gray-500">{formatDate(item.createdDate)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EducationList;
