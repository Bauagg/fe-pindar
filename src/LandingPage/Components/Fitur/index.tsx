import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const fiturData = [
  {
    title: "Contact Us",
    description: "Get in touch with us for more information, questions, or feedback. We are here to help you anytime.",
    image: "/images/kontak.jpg",
    cards: [{ image: "/images/bg-hantara.jpg" }, { image: "/images/bg-hantara2.jpg" }, { image: "/images/hantaraisue.jpg" }],
  },
  {
    title: "Select Product",
    description: "Choose from a wide range of Nusantara’s natural products. We provide the best selection with guaranteed quality.",
    image: "/images/select.jpg",
    cards: [{ image: "/images/bg-hantara.jpg" }, { image: "/images/bg-hantara2.jpg" }, { image: "/images/hantaraisue.jpg" }],
  },
  {
    title: "Delivery",
    description: "Enjoy fast and secure delivery services straight to your location, ensuring your products arrive in perfect condition.",
    image: "/images/kirim.jpg",
    cards: [{ image: "/images/bg-hantara.jpg" }, { image: "/images/bg-hantara2.jpg" }, { image: "/images/hantaraisue.jpg" }],
  },
];

const Fitur = () => {
  return (
    <section className="bg-white mt-16 mb-10">
      <div className="relative px-5 xl:px-10">
        {/* Title */}
        <div className="flex gap-5 items-center mb-10">
          <h1 className="lg:text-[28px]  font-semibold text-[24px]  text-[#cfa84d] w-96">HOW TO ORDER ?</h1>
          <div className="w-full h-[4px] bg-secondary text-secondary"></div>
        </div>

        <div className="flex justify-center w-full mb-5">
          <img src="/images/order.png" alt="" className="w-full p-3 hidden lg:block" />
          <img src="/images/orderhp.png" alt="" className="w-full p-3 block lg:hidden" />
        </div>

        {/* Swiper Content */}
        <Swiper modules={[Navigation, Autoplay]} autoplay={{ delay: 3000, disableOnInteraction: false }}>
          {fiturData.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                {/* Left Image */}
                <div>
                  <img src={item.image} alt={item.title} className="w-full h-80 rounded-2xl object-cover shadow-lg" />
                </div>

                {/* Right Content */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-secondary mb-4">{item.title}</h3>

                  <p className="text-gray-500 text-base leading-relaxed mb-8 text-justify">{item.description}</p>

                  <div className="flex  gap-2 lg:gap-5">
                    {item.cards.map((card, idx) => (
                      <div key={idx} className="relative rounded-xl overflow-hidden shadow-md cursor-pointer group flex-1">
                        <img src={card.image} alt="tujuan" className="w-full h-28 lg:h-40 object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-green-600/60 to-transparent transition-opacity group-hover:opacity-80" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Fitur;
