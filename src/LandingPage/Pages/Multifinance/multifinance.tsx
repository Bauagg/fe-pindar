// pages/MultiFinance.tsx

import { useNavigate } from "react-router-dom";
import { ArrowRight, BadgeCheck, Bike, Car, Clock3, FileText, Info, Landmark, Repeat, ShieldCheck, Tag, Wallet } from "lucide-react";

import Navbars from "../../Components/Navbar/index";

const layananList = [
  { value: "Jaminkan BPKB", desc: "Dana cepat dengan jaminan BPKB, kendaraan tetap dipakai.", icon: FileText },
  { value: "Beli Kendaraan (Second)", desc: "Beli mobil atau motor (Second) dengan harga terbaik.", icon: Tag },
  { value: "Take Over Kendaraan", desc: "Pindahkan cicilan kendaraan ke tenor dan bunga lebih ringan.", icon: Repeat },
] as const;

const infoCards = [
  { title: "Layanan", value: "3 Pilihan Pembiayaan", icon: Wallet },
  { title: "Jenis Kendaraan", value: "Mobil & Motor", icon: Car },
  { title: "Proses", value: "Cepat & Transparan", icon: Clock3 },
  { title: "Status", value: "Berizin OJK", icon: Landmark },
];

const MultiFinance = () => {
  const navigate = useNavigate();

  const goToForm = () => navigate("/multi-finance/form");

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-white font-signika">
      <Navbars />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-700"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-8 sm:py-10 lg:py-20">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-10 items-center mt-10 sm:mt-12">
            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 border border-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs sm:text-sm font-semibold mb-5 mt-5">
                <BadgeCheck className="w-4 h-4" />
                Multi Finance Terverifikasi
              </div>

              <h1 className="text-3xl md:text-3xl lg:text-5xl font-black text-white leading-tight">Dapatkan Dana Tunai Sekarang !!</h1>

              <p className="mt-4 text-white/90 text-sm sm:text-base leading-relaxed max-w-xl">
                Gadai Pindar Multifinance menerima semua jenis BPKB mobil dan motor dengan proses cepat dan transparan. Kamu juga bisa membeli kendaraan favorit kamu disini dan atau take over cicilan kamu. Semua bisa di Pindar!
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-7">
                <button
                  onClick={goToForm}
                  className="px-5 sm:px-7 py-3 rounded-xl sm:rounded-2xl bg-white text-red-600 text-sm sm:text-base font-bold flex items-center justify-center gap-2 shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300">
                  Ajukan Sekarang
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex justify-center lg:justify-end">
              <div className="bg-white rounded-2xl sm:rounded-[2rem] shadow-2xl p-5 sm:p-8 w-full max-w-sm">
                <div className="flex items-center justify-center gap-4 py-6">
                  <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center">
                    <Car className="w-10 h-10 text-red-500" />
                  </div>
                  <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center">
                    <Bike className="w-10 h-10 text-red-500" />
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs sm:text-sm font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    Legal & Terverifikasi
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INFO CARD */}
      <section className="relative -mt-6 sm:-mt-8 lg:-mt-12 px-4 lg:px-8 pb-8 sm:pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {infoCards.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="bg-white rounded-2xl sm:rounded-[2rem] border border-gray-100 shadow-lg p-4 sm:p-6">
                  <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                  </div>
                  <p className="mt-3 text-xs sm:text-sm text-gray-500 font-semibold">{item.title}</p>
                  <h3 className="mt-1 text-sm sm:text-xl font-black text-gray-800 leading-snug break-words">{item.value}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DESKRIPSI */}
      <section className="px-4 lg:px-8 pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl sm:rounded-[2rem] border border-gray-100 shadow-xl p-4 sm:p-6 lg:p-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-red-50 flex items-center justify-center">
              <Info className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
            </div>
            <div>
              <p className="text-red-500 font-bold uppercase text-xs sm:text-sm">Informasi</p>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-800">Tentang Pindar Multifinance</h2>
            </div>
          </div>

          <p className="text-sm md:text-base text-gray-700 leading-relaxed max-w-3xl">
            Pindar Aggregator Multifinance adalah platform digital yang mengintegrasikan berbagai perusahaan pembiayaan (multifinance) dalam satu sistem. Platform ini membantu pengguna atau mitra bisnis mengakses dan membandingkan berbagai
            pilihan pembiayaan sesuai kebutuhan, sekaligus mempermudah proses pengajuan hingga mendapatkan produk pembiayaan yang sesuai.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {layananList.map((l) => {
              const Icon = l.icon;
              return (
                <div key={l.value} className="rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex gap-4 items-start">
                  <div className="min-w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900">{l.value}</h3>
                    <p className="mt-1 text-sm text-gray-600 leading-relaxed">{l.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA bawah */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm sm:text-base text-gray-600 text-center sm:text-left">Sudah siap? Ajukan sekarang, prosesnya cuma butuh beberapa menit.</p>
            <button
              onClick={goToForm}
              className="w-full sm:w-auto shrink-0 px-6 sm:px-7 py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white text-sm sm:text-base font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-200 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300">
              Ajukan Sekarang
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MultiFinance;
