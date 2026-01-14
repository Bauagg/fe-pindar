import React from "react";
import { IconCheclis, iconLock, IconPoin, iconScam } from "../../../Assets/Images";

const DataValue = [
  {
    id: 1,
    title: "Reward Poin",
    description: "Pengguna Udin dapat memperoleh reward poin setiap kali bertransaksi, yang bisa digunakan kembali sebagai metode pembayaran",
    image: IconPoin,
  },
  {
    id: 1,
    title: "Bisa QRIS",
    description: "Udin dilengkapi dengan fitur scan QRIS, cukup pindai kode QR dan transaksi Anda selesai dilakukan",
    image: iconScam,
  },
  {
    id: 1,
    title: "Keamanan Tinggi",
    description: "Udin dilindungi dengan keamanan tinggi yang memberikan perlindungan pada akun, data, dan privasi Anda",
    image: iconLock,
  },
  {
    id: 1,
    title: "Mudah Digunakan",
    description: "Udin memiliki fitur yang mudah digunakan sehingga Anda dapat bertransaksi kapanpun dan dimanapun",
    image: IconCheclis,
  },
];

const AboutWhy: React.FC = () => {
  return (
    <div className="w-full h-auto px-4 md:px-[30px] lg:px-[45px] lg:mb-[80px] md:mb-[50px] mb-[50px] bg-[#F7F7F7] rounded-lg md:rounded-2xl flex flex-col justify-start items-center">
      <div className="bg-white rounded-[16px] h-auto pb-[30px]">
        <div className="text-center my-[40px] md:my-8 lg:my-[40px] text-black text-[18px]  sm:text-3xl md:text-4xl font-bold font-poppins">Kenapa Harus Pakai Udin?</div>
        <div className="flex flex-wrap justify-center px-[16px] md:px-0 gap-[40px] md:mt-[40px] lg:mt-[0px]">
          {DataValue.map((item, index) => (
            <div key={index} className="w-full  md:w-1/5 flex flex-col justify-center items-center gap-1 md:gap-4 lg:gap-8">
              <div className="lg:w-[112px] lg:h-[112px] w-[56px] h-[56px] pr-[5px] pb-[5px] bg-black rounded-xl">
                <div className={`lg:w-[112px] lg:h-[112px] w-[56px] h-[56px] mt-[-5px] lg:mt-[-6px] ml-[-5px] lg:ml-[-6px] rounded-xl shadow justify-center items-center flex ${index % 2 === 0 ? "bg-[#F8931F]" : "bg-[#EF1A25]"}`}>
                  <div className="w-[32px] h-[32px] lg:w-12 lg:h-12">
                    <img src={item.image} alt="" className="w-full h-full object-contain" />
                  </div>
                </div>
              </div>
              <div className="text-center  text-[#25282b] lg:text-xl text-[14px] font-semibold font-poppins leading-relaxed min-h-[20px]">{item.title}</div>
              <div className="text-center   text-neutral-400 text-[12px] lg:text-base font-normal font-poppins leading-tight md:min-h-[150px]">{item.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutWhy;
