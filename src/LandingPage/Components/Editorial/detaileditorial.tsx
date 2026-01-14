import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
const FaUserAlt = require("react-icons/fa").FaUserAlt;
const HiCalendarDateRange = require("react-icons/hi2").HiCalendarDateRange;
const FaShareAlt = require("react-icons/fa").FaShareAlt;
const FaCopy = require("react-icons/fa6").FaCopy;

const DetailEditorial: React.FC = () => {
  const { id } = useParams();
  const [news, setNews] = useState<any>(null);
  const [relatedNews, setRelatedNews] = useState<any[]>([]);
  const shareUrl = `${process.env.REACT_APP_API_BASE_URL}/share/news/${news?.id}`;

  useEffect(() => {
    const fetchDetail = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/news/${id}`);
      const data = await res.json();
      setNews(data);
    };

    const fetchRelated = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/news`);
      const data = await res.json();
      setRelatedNews(data?.data);
    };

    fetchDetail();
    fetchRelated();
  }, [id]);

  if (!news) return <div className="p-10">Memuat...</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-8 px-4 py-10 max-w-6xl mx-auto text-black">
      {/* Konten Kiri */}
      <div className="flex-1">
        <span className="border bg-blue-950 text-white px-5 py-1 text-sm rounded-lg">{news?.category?.name || "Berita"}</span>
        <h1 className="text-3xl lg:text-4xl font-bold mt-4 leading-snug">{news?.title}</h1>
        <div className="flex flex-wrap items-center text-gray-500 gap-4 mt-2 ">
          <div className="flex items-center gap-2">
            <FaUserAlt />
            {news?.user?.name}
          </div>
          <div className="flex items-center gap-2">
            <HiCalendarDateRange />
            {new Date(news?.created_at).toLocaleDateString("id-ID")}
          </div>
          <div className="flex items-center gap-4 ">
            {/* <div className="flex items-center gap-2">
              <FaShareAlt />
              <a href={`https://wa.me/?text=${encodeURIComponent(news.title + " - " + shareUrl)}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                Share
              </a>
            </div> */}

            <div
              onClick={() => {
                navigator.clipboard.writeText(`${news.title} - ${shareUrl}`);
                alert("Link telah disalin. Tempelkan ke WhatsApp agar tampilannya muncul.");
              }}
              className=" flex gap-2 text-gray-500 cursor-pointer items-center">
              <FaCopy /> <span className="text-blue-700 hover:underline">Salin Link</span>
            </div>
          </div>
        </div>

        <img src={news?.image_url} alt={news?.title} className="mt-6 rounded-lg w-full max-h-[400px] object-cover" />

        <div className="mt-6 text-justify leading-relaxed prose prose-sm sm:prose lg:prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: news?.description }} />
      </div>

      {/* Konten Kanan */}
      <aside className="w-full lg:w-[400px] lg:ps-6 lg:pt-24">
        <h2 className="text-lg font-semibold mb-4">Berita Lainnya</h2>
        <div className="space-y-4">
          {relatedNews
            .filter((item) => item?.id !== parseInt(id || "0")) // Hindari berita yang sedang dibuka
            .slice(0, 5)
            .map((item) => (
              <div key={item?.id} className="flex gap-3 cursor-pointer group hover:opacity-80">
                <Link to={`/detail-editorial/${item.id}`} className="w-full">
                  <img src={item?.image_url} alt={item?.title} className="w-full h-28 object-cover rounded" />
                </Link>
                <div className="text-sm w-full">
                  <h3 className="font-semibold line-clamp-2">{item?.title}</h3>
                  <p className="text-gray-500 text-xs line-clamp-1">{item?.description?.replace(/<[^>]+>/g, "").slice(0, 40)}...</p>

                  <p className="text-xs text-gray-400 mt-1">{new Date(item?.created_at).toLocaleDateString("id-ID")}</p>
                </div>
              </div>
            ))}
        </div>
      </aside>
    </div>
  );
};

export default DetailEditorial;
