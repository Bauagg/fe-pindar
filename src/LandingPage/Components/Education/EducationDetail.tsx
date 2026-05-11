// pages/EducationDetail.tsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CalendarDays, Eye, ArrowRight, BookOpen, ShieldAlert } from "lucide-react";

import Navbar from "../../Components/Navbar";

interface ContentItem {
  id: string;
  title: string;
  category: string;
  linkPath: string;
  createdDate: string;
  imageLink: string;
  viewCount: number;
}

interface ContentDetail {
  id: string;
  title: string;
  categoryName: string;
  contentDetail: string;
  imageLink: string;
}

const EducationDetail = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const baseURL = process.env.REACT_APP_API_BASE_URL;

  const [loading, setLoading] = useState(true);

  const [detail, setDetail] = useState<ContentDetail | null>(null);

  const [otherContents, setOtherContents] = useState<ContentItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // DETAIL
        const detailResponse = await fetch(`${baseURL}/api/content/detail/${id}`);

        const detailResult = await detailResponse.json();

        setDetail(detailResult.data);

        // LIST CONTENT
        const listResponse = await fetch(`${baseURL}/api/content/list?limit=6`);

        const listResult = await listResponse.json();

        setOtherContents(listResult.data.contents || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, baseURL]);

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

              <p className="text-gray-500 mt-2">Sedang mengambil detail konten...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-screen bg-gray-50 font-signika">
        <Navbar />

        <div className="flex items-center justify-center h-[70vh] px-4">
          <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-10 max-w-lg text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-red-100 flex items-center justify-center">
              <ShieldAlert className="w-12 h-12 text-red-500" />
            </div>

            <h2 className="mt-6 text-3xl font-black text-gray-800">Konten Tidak Ditemukan</h2>

            <button
              onClick={() => navigate(-1)}
              className="
                mt-8 w-full py-4 rounded-2xl
                bg-gradient-to-r from-red-500 to-red-600
                text-white font-bold
              ">
              Kembali
            </button>
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

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-14 lg:py-20">
          <div className="max-w-4xl max-sm:mt-12 mt-12">
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

            <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight">{detail.title}</h1>

            <div className="flex flex-wrap items-center gap-5 mt-6 text-white/90">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                {detail.categoryName}
              </div>

              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Artikel Edukasi
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="relative -mt-8 lg:-mt-10 px-4 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_350px] gap-6">
          {/* MAIN CONTENT */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
            {/* IMAGE */}
            <div className="w-full h-[250px] md:h-[400px] overflow-hidden">
              <img src={`${baseURL}/api${detail.imageLink}`} alt={detail.title} className="w-full h-full object-cover" />
            </div>

            {/* BODY */}
            <div className="p-6 lg:p-10">
              <div
                className="
                  prose prose-lg max-w-none
                  prose-headings:font-black
                  prose-headings:text-gray-800
                  prose-p:text-gray-700
                  prose-p:leading-relaxed
                  prose-li:text-gray-700
                  prose-strong:text-gray-900
                  prose-blockquote:border-red-500
                  prose-blockquote:bg-red-50
                  prose-blockquote:p-4
                  prose-blockquote:rounded-2xl
                  prose-ul:pl-5
                  prose-ol:pl-5
                  prose-li:marker:text-red-500
                  prose-code:text-red-500
                "
                dangerouslySetInnerHTML={{
                  __html: detail.contentDetail,
                }}
              />
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-5">
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-red-500" />
                </div>

                <div>
                  <p className="text-red-500 font-bold uppercase text-xs">Edukasi</p>

                  <h2 className="text-2xl font-black text-gray-800">Edukasi Lainnya</h2>
                </div>
              </div>

              <div className="space-y-4">
                {otherContents
                  .filter((item) => item.id !== detail.id)
                  .map((item) => (
                    <div
                      key={item.id}
                      onClick={() => navigate(`/education/${item.id}`)}
                      className="
                        group
                        bg-gray-50 hover:bg-red-50
                        border border-gray-100 hover:border-red-100
                        rounded-3xl
                        overflow-hidden
                        cursor-pointer
                        transition-all duration-300
                      ">
                      <div className="h-40 overflow-hidden">
                        <img
                          src={`${baseURL}/api${item.imageLink}`}
                          alt={item.title}
                          className="
                            w-full h-full object-cover
                            group-hover:scale-105
                            transition duration-300
                          "
                        />
                      </div>

                      <div className="p-4">
                        <div
                          className="
                            inline-flex items-center
                            px-3 py-1 rounded-full
                            bg-red-100 text-red-600
                            text-xs font-bold mb-3
                          ">
                          {item.category}
                        </div>

                        <h3
                          className="
                            text-gray-800 font-black
                            leading-snug line-clamp-2
                          ">
                          {item.title}
                        </h3>

                        <div
                          className="
                            flex items-center justify-between
                            mt-4 text-sm text-gray-500
                          ">
                          <span>{formatDate(item.createdDate)}</span>

                          <ArrowRight className="w-4 h-4 text-red-500" />
                        </div>
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

export default EducationDetail;
