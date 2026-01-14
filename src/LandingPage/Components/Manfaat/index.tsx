import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const manfaatData = [
  {
    image: "/images/gambar1.png",
    title: "Menekan harga di Tingkat Konsumen",
  },
  {
    image: "/images/gambar2.png",
    title: "Menciptakan Lapangan Kerja",
  },
  {
    image: "/images/gambar3.png",
    title: "Memberi Pelayanan Secara Sistematis dan Cepat",
  },
  {
    image: "/images/gambar4.png",
    title: "Meningkatkan Inklusi Keuangan",
  },
  {
    image: "/images/gambar5.png",
    title: "Modernisasi Manajemen Sistem Perkoprasian",
  },
  {
    image: "/images/gambar6.png",
    title: "Meningkatkan Inklusi Keuangan",
  },
  {
    image: "/images/gambar7.png",
    title: "Menekan Inflasi",
  },
  {
    image: "/images/gambar4.png",
    title: "Meningkatkan Inklusi Keuangan",
  },
  {
    image: "/images/gambar3.png",
    title: "Memberi Pelayanan Secara Sistematis dan Cepat",
  },
];

const ManfaatSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="bg-[#F9FDF7] py-10 px-4 lg:px-20 mx-3">
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Kiri - Teks */}
        <div className="md:w-1/2">
          <h2 className="text-[#005662] text-2xl md:text-3xl lg:text-4xl font-bold leading-snug">13 Manfaat Koperasi Desa/Kelurahan Merah Putih Sebagai Pusat Produksi & Distribusi</h2>
        </div>

        {/* Kanan - Slider */}
        <div className="md:w-1/2 w-full">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 1.2 },
              1024: { slidesPerView: 2 },
            }}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            onSlideChange={(swiper: any) => setActiveIndex(swiper.realIndex)}
            onSwiper={(swiper: any) => setActiveIndex(swiper.realIndex)}>
            {manfaatData.map((item, index) => (
              <SwiperSlide key={index}>
                <div className={`transition-all duration-500 bg-white rounded-2xl overflow-hidden ${index === activeIndex ? "shadow-md scale-100" : "shadow-md scale-100"}`}>
                  <img src={item.image} alt={item.title} className="w-full h-[220px] md:h-[220px] lg:h-[250px] object-cover" />
                  <div className="p-4">
                    <p className="text-[#005662] text-[14px] md:text-base font-medium">{item.title}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default ManfaatSlider;
