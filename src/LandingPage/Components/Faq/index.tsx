import React from "react";
import { FaQuestionCircle } from "react-icons/fa";

type FAQItem = {
  q: string;
  a: string;
};

const faqData: FAQItem[] = [
  {
    q: "Apa itu Koperasi Desa/Kelurahan Merah Putih?",
    a: "Koperasi Desa/Kelurahan Merah Putih adalah lembaga ekonomi beranggotakan masyarakat desa yang dibentuk untuk meningkatkan kesejahteraan melalui prinsip gotong royong, kekeluargaan, dan partisipasi bersama.",
  },
  {
    q: "Apa tujuan utama pembentukan Kopdes/kel Merah Putih?",
    a: "Tujuannya antara lain memperkuat perekonomian desa, meningkatkan nilai tukar petani, menekan inflasi, menciptakan lapangan kerja, dan meningkatkan inklusi keuangan.",
  },
  {
    q: "Apa dasar hukum pembentukan koperasi ini?",
    a: "Pembentukan koperasi didasarkan pada berbagai peraturan, seperti Undang-Undang Nomor 25 Tahun 1992 tentang Perkoperasian (yang telah diubah beberapa kali), Peraturan Pemerintah, Peraturan Presiden, dan peraturan menteri terkait.",
  },
  {
    q: "Apa saja mekanisme pembentukan Kopdes/kel Merah Putih?",
    a: "Mekanismenya meliputi tiga pendekatan: pendirian koperasi baru, pengembangan koperasi yang telah ada, dan revitalisasi koperasi tidak aktif.",
  },
];

const FaqSection = () => {
  const Icon = FaQuestionCircle as React.FC<React.SVGProps<SVGSVGElement>>;

  return (
    <div className="mx-10 px-4 sm:px-6 lg:px-0 py-10 ">
      <div className="md:flex justify-center">
        <div className="bg-black bg-opacity-10 px-4 py-2 rounded-lg text-center mb-7">
          <h1 className="lg:text-[25px] font-poppins font-semibold text-[18px]  text-[#2C5C52] ">Pertanyaan Umum</h1>
        </div>
      </div>
      <div className="flex flex-col md:grid grid-cols-4 gap-3">
        {faqData.map((item, index) => (
          <div key={index} className="mb-5">
            <div className="flex gap-3 cursor-pointer items-start">
              <div className="mt-1 flex flex-col gap-3 justify-center">
                <div className="text-[#2C5C52]">
                  <Icon className="w-10 h-10" />
                </div>
                <div className="flex justify-center">
                  <div className="bg-[#2C5C52] h-20 w-1 mt-2"></div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-[#252525] text-base sm:text-lg">{item.q}</h3>
                <p className="text-sm sm:text-base text-[#252525] mt-4 lg:mt-1 text-justify">{item.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqSection;
