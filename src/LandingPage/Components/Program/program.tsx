import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./index.css";

const data = [
  {
    title: "Riset & Penelitian",
    desc: "Melakukan aktivitas Riset/penelitian yang terkait dengan fenomena sosial, ekonomi, politik dan budaya kontemporer di Indonesia dengan perspektif/pendekatan sector pekerja atau tenaga kerja.",
    icon: "/logo/news.png",
    image: "/images/program1.jpg",
  },
  {
    title: "Seminar & Workshop",
    desc: "Melakukan Seminar, Dialog Publik dan Workshop terkait dengan mengarusutamakan pendekatan/perspektif social security.",
    icon: "/logo/news.png",
    image: "/images/program2.jpg",
  },
  {
    title: "Kajian Akademik",
    desc: "Mengembangkan kajian akademik yang bersifat teoritis, praktis dan aplikatif terkait isu-isu sektor pekerja atau tenaga kerja.",
    icon: "/logo/news.png",
    image: "/images/program3.jpg",
  },
  {
    title: "Advokasi Kebijakan",
    desc: "Melakukan advokasi kebijakan di berbagai level untuk mendorong adanya social security dalam setiap bentuk pengambilan kebijakan bagi sektor pekerja.",
    icon: "/logo/news.png",
    image: "/images/program4.jpg",
  },
  {
    title: "Kerjasama Lembaga",
    desc: "Melakukan kerjasama dengan berbagai institusi sosial dan lembaga pemerintahan dalam mengkaji kebijakan terkait pekerja.",
    icon: "/logo/news.png",
    image: "/images/program5.jpg",
  },
  {
    title: "Jasa Konsultan",
    desc: "Menyediakan jasa advokasi dan konsultan profesional dengan pendekatan social security bagi pekerja.",
    icon: "/logo/news.png",
    image: "/images/program6.jpg",
  },
  {
    title: "Publikasi & Penerbitan",
    desc: "Melakukan aktivitas penerbitan, publikasi, iklan layanan masyarakat, dan audiensi publik terkait sektor pekerja.",
    icon: "/logo/news.png",
    image: "/images/program7.jpg",
  },
  {
    title: "Job Fair",
    desc: "Membuat job fair bagi pekerja yang terkena dampak PHK.",
    icon: "/logo/news.png",
    image: "/images/isu2.jpg",
  },
];

const ProgramKerja = () => {
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpanded(expanded === index ? null : index);
  };

  const truncateText = (text: string, index: number) => {
    if (expanded === index) return text;
    return text.length > 20 ? text.substring(0, 20) + "..." : text;
  };

  return (
    <div className="bg-[#144470] py-10 px-10">
      <div className="text-[#cfa84d] text-xl md:text-3xl text-center font-semibold mt-0 md:mt-4 mb-6">
        Program <span className="text-white">Kerja</span>
      </div>

      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
          bulletClass: "custom-bullet",
          bulletActiveClass: "custom-bullet-active",
        }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        modules={[Pagination, Autoplay]}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}>
        {data.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="rounded-md overflow-hidden">
              <div className="relative">
                <img src={item.image} alt={item.title} className="w-full h-48 object-cover -z-50" />
                <div className="absolute -bottom-6 left-5 bg-white w-14 h-14  border-2 border-[#144470] flex items-center justify-center rounded-full shadow-lg">
                  <img src={item.icon} alt="icon" className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-[#cfa84d] text-white p-5 rounded-b-md w-[95%] -mt-10 z-10">
                <h3 className="font-bold text-lg mb-3 mt-14">{item.title}</h3>
                <p className="text-sm mb-4">{truncateText(item.desc, index)}</p>
                <button onClick={() => toggleExpand(index)} className="font-semibold text-sm underline underline-offset-2">
                  {expanded === index ? "Tutup" : "Selengkapnya →"}
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination di sini */}
      <div className="custom-pagination flex justify-center mt-6" />
    </div>
  );
};

export default ProgramKerja;
