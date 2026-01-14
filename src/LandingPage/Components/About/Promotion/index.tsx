// import React from "react";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { ImageBanner } from "../../../Assets/Images";

// const Promotion: React.FC = () => {
//   const slidesData = [
//     {
//       title: "Cash Back Sampai dengan 20% Setiap transaksi",
//       period: "Periode 1 - 18 Agustus 2024",
//       linkText: "Lihat selengkapnya",
//       image: ImageBanner,
//     },
//     {
//       title: "Diskon 15% untuk pembelian pertama",
//       period: "Periode 5 - 20 Agustus 2024",
//       linkText: "Pelajari lebih lanjut",
//       image: ImageBanner,
//     },
//     {
//       title: "Bonus hadiah langsung dengan setiap pembelian",
//       period: "Periode 10 - 25 Agustus 2024",
//       linkText: "Dapatkan hadiah",
//       image: ImageBanner,
//     },
//     {
//       title: "Cash Back Sampai dengan 20% Setiap transaksi",
//       period: "Periode 1 - 18 Agustus 2024",
//       linkText: "Lihat selengkapnya",
//       image: ImageBanner,
//     },
//     {
//       title: "Diskon 15% untuk pembelian pertama",
//       period: "Periode 5 - 20 Agustus 2024",
//       linkText: "Pelajari lebih lanjut",
//       image: ImageBanner,
//     },
//     {
//       title: "Bonus hadiah langsung dengan setiap pembelian",
//       period: "Periode 10 - 25 Agustus 2024",
//       linkText: "Dapatkan hadiah",
//       image: ImageBanner,
//     },
//   ];

//   const settings = {
//     dots: false,
//     infinite: false,
//     speed: 500,
//     slidesToShow: 2.5, // Use 2.5 to make the first slide half visible
//     slidesToScroll: 1,
//     arrows: false,
//     centerMode: false, // Disable center mode
//     centerPadding: "0px", // No padding needed
//     focusOnSelect: true,
//     responsive: [
//       {
//         breakpoint: 1024,
//         settings: {
//           slidesToShow: 2.5,
//           slidesToScroll: 1,
//           centerPadding: "0px",
//         },
//       },
//       {
//         breakpoint: 768,
//         settings: {
//           slidesToShow: 1.5,
//           slidesToScroll: 1,
//           centerPadding: "0px",
//         },
//       },
//     ],
//   };

//   return (
//     <div className="w-full h-auto text-left mb-[90px] md:mb-[70px] lg:mb-[80px] lg:px-[10px] px-[16px]">
//       <div className="text-black pl-4 sm:pl-8 lg:pl-10 text-2xl sm:text-3xl lg:text-4xl font-bold font-inter">
//         Promosi saat ini
//       </div>
//       <Slider {...settings} className="md:mt-8 mt-[20px]">
//         {slidesData.map((data, index) => (
//           <div key={index} className={`flex-shrink-0 px-2 lg:pl-[35px]`}>
//             <div className="flex flex-col justify-start items-start rounded-lg w-full">
//               <img
//                 className="w-full h-auto rounded-lg object-cover"
//                 src={data.image}
//                 alt={`Promotion ${index + 1}`}
//               />
//               <div className="flex-col justify-start text-left lg:gap-2 flex lg:h-[130px] lg:mt-[15px] mt-[10px]">
//                 <div className="flex-col justify-start items-start gap-1 flex">
//                   <p className="text-black md:h-[35px] lg:h-auto text-sm md:text-[15px] lg:text-xl font-medium font-poppins leading-snug">
//                     {data.title}
//                   </p>
//                   <div className="text-[#8A8A8A] text-xs py-1 md:text-sm lg:text-base font-regular font-poppins">
//                     {data.period}
//                   </div>
//                 </div>
//                 <div className="text-[#7575F0] text-sm sm:text-sm lg:text-base font-regular font-poppins">
//                   {data.linkText}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </Slider>
//     </div>
//   );
// };

// export default Promotion;

import React from "react";

export default function index() {
  return <div></div>;
}
