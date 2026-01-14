import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import axios from "axios";
import "swiper/css";
import "swiper/css/pagination";
import "../Program/index.css";
import { Link } from "react-router-dom";

type NewsItem = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
};

const Editorial = () => {
  const [data, setData] = useState<NewsItem[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const toggleExpand = (index: number) => {
    setExpanded(expanded === index ? null : index);
  };

  const truncateTextTitle = (text: string, index: number) => {
    if (expanded === index) return text;
    return text?.length > 20 ? text?.substring(0, 20) + "..." : text;
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/news`)
      .then((res) => {
        setData(res.data.data || []);
      })
      .catch((err) => {
        console.error("Gagal mengambil data news:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  function truncateHTML(html: string, maxLength: number): string {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }

  if (loading) return <div className="p-5">Memuat data editorial...</div>;

  return (
    <div className="bg-white py-7 px-5 lg:px-10">
      <div className="flex gap-5 items-center mb-7">
        <div className="w-full h-[4px] bg-[#144470] text-[#144470]"></div>

        <h1 className="lg:text-[25px]  font-semibold text-[18px]  text-[#cfa84d] w-52 lg:w-56">Editorial NIW</h1>
      </div>

      <Swiper
        slidesPerView={1.2} // default: untuk mobile
        centeredSlides={true}
        spaceBetween={10}
        loop={true}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
          bulletClass: "custom-bullet",
          bulletActiveClass: "custom-bullet-active",
        }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        modules={[Pagination, Autoplay]}
        breakpoints={{
          640: { slidesPerView: 1.5, spaceBetween: 20 },
          768: { slidesPerView: 2.2, spaceBetween: 20 },
          1024: { slidesPerView: 2.8, spaceBetween: 30 }, // desktop: 3 kartu
        }}>
        {data.map((item: any, index: any) => (
          <div className="px-5 md:px-10 lg:px-20">
            <SwiperSlide key={index}>
              <div>
                <div className="rounded-md border-2 border-[#144470]">
                  <div className="">
                    <img src={item.image_url} alt="" className="w-full h-48" />
                  </div>

                  <div className="px-2 py-3">
                    <h3 className="font-bold text-xl mb-3 mt-2">{truncateTextTitle(item.title, index)}</h3>

                    <div
                      dangerouslySetInnerHTML={{
                        __html: truncateHTML(item?.description || "", 80),
                      }}
                      className="text-sm mb-4"
                    />

                    <div className="flex items-center justify-between">
                      <Link to={`/detail-editorial/${item.id}`}>
                        <button onClick={() => toggleExpand(index)} className="font-semibold text-sm underline underline-offset-2">
                          {expanded === index ? "Tutup" : "Selengkapnya →"}
                        </button>
                      </Link>

                      <div className="text-[#cfa84d] italic">{new Date(item.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </div>
        ))}
      </Swiper>

      {/* Custom Pagination di sini */}
      <div className="custom-pagination flex justify-center mt-6" />
    </div>
  );
};

export default Editorial;
