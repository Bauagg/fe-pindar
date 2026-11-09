import { useEffect, useRef, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

type VideoType = {
  id: string; // ID video YouTube
  title: string;
};

// Tambah video lain di sini kalau mau
const VIDEOS: VideoType[] = [{ id: "y2pTRfnOmtE", title: "Popular Plus Video" }];

const VideoPindar = () => {
  const paginationRef = useRef<HTMLDivElement>(null);
  const [activeVideo, setActiveVideo] = useState<VideoType | null>(null);

  // Tutup modal pakai tombol ESC + kunci scroll body saat modal terbuka
  useEffect(() => {
    if (!activeVideo) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveVideo(null);
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeVideo]);

  const isMulti = VIDEOS.length > 1;

  return (
    <section className="w-full max-w-6xl mx-auto">
      <div className="relative px-4 sm:px-6">
        <Swiper
          modules={[Pagination, Autoplay]}
          autoplay={isMulti ? { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
          loop={VIDEOS.length > 2}
          pagination={{
            clickable: true,
            el: paginationRef.current,
          }}
          onBeforeInit={(swiper) => {
            if (swiper.params.pagination && typeof swiper.params.pagination !== "boolean") {
              swiper.params.pagination.el = paginationRef.current;
            }
          }}
          slidesPerView={1}
          spaceBetween={16}
          centeredSlides={false}
          breakpoints={{
            1024: {
              slidesPerView: isMulti ? 1.5 : 1,
              spaceBetween: 24,
              centeredSlides: isMulti,
            },
          }}
          className="overflow-visible">
          {VIDEOS.map((video) => (
            <SwiperSlide key={video.id}>
              {({ isActive }) => (
                <button
                  type="button"
                  onClick={() => setActiveVideo(video)}
                  aria-label={`Putar video: ${video.title}`}
                  className={`group relative block w-full rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-500 ${isActive ? "lg:scale-100 lg:opacity-100" : "lg:scale-90 lg:opacity-60"}`}>
                  {/* Thumbnail YouTube */}
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                    onError={(e) => {
                      // fallback kalau maxres tidak tersedia
                      e.currentTarget.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                    }}
                    alt={video.title}
                    className="w-full aspect-video max-h-[420px] object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Overlay gelap + tombol play */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <span className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-red-600 shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 ml-1">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </div>
                </button>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* PAGINATION */}
        <div ref={paginationRef} className="custom-pagination mt-3 flex justify-center gap-2" />
      </div>

      {/* MODAL VIDEO */}
      {activeVideo && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-6" onClick={() => setActiveVideo(null)} role="dialog" aria-modal="true" aria-label={activeVideo.title}>
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            {/* Tombol close */}
            <button type="button" onClick={() => setActiveVideo(null)} aria-label="Tutup video" className="absolute -top-10 right-0 sm:-top-12 text-white hover:text-gray-300 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-8 h-8">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            {/* Iframe responsif 16:9 */}
            <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-black shadow-2xl">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default VideoPindar;
