import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Percent, Wallet } from "lucide-react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { dummyPayLater } from "../../../types/dummyPayLater";

const ListPayLater = () => {
  return (
    <>
      <Navbar />

      <main className="bg-gradient-to-b from-red-50 via-white to-white min-h-screen">
        <section className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-14">
          {/* HEADER */}
          <div className="mt-20 pb-8 text-center sm:text-left">
            <p className="text-sm text-gray-500 hidden md:block">Home {">"} Pindar PayLater</p>

            <h1 className="mt-2 text-3xl md:text-4xl font-black text-gray-900">
              Pindar <span className="mx-0.5 inline-block -skew-x-12 align-middle text-[0.85em] font-black text-black drop-shadow-[0_0_6px_rgba(0,0,0,0.35)]">✕</span> PayLater
            </h1>

            <p className="mt-2 text-sm md:text-base text-gray-500 max-w-2xl">Belanja sekarang, bayar nanti. Bandingkan layanan PayLater populer di Indonesia sesuai kebutuhanmu.</p>
          </div>

          {/* LIST */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
            {dummyPayLater.map((item) => (
              <Link
                key={item.id}
                to={`/paylater/${item.id}`}
                className="
                  group flex flex-col sm:flex-row
                  bg-white rounded-3xl overflow-hidden
                  border border-gray-100 shadow-md
                  hover:shadow-2xl hover:border-red-200
                  transition-all duration-300
                ">
                {/* GAMBAR */}
                <div
                  className="
                    relative sm:w-52 lg:w-44 xl:w-52 shrink-0
                    h-44 sm:h-auto
                    bg-gradient-to-br from-red-500 to-red-700
                    flex items-center justify-center p-6
                  ">
                  <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-white/10" />
                  <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-white/10" />

                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white shadow-xl flex items-center justify-center p-3 group-hover:scale-105 transition-transform duration-300">
                    <img src={item.imageLink} alt={item.nama} className="w-full h-full object-contain" />
                  </div>
                </div>

                {/* ISI */}
                <div className="flex-1 p-5 md:p-6 flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-xl font-black text-gray-900">{item.nama}</h2>
                      <p className="mt-0.5 text-sm font-semibold text-red-500 truncate">{item.publisher}</p>
                    </div>

                    <span className="shrink-0 w-10 h-10 rounded-full border border-red-100 text-red-500 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition">
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-gray-500 leading-relaxed line-clamp-3">{item.deskripsi}</p>

                  {/* STATISTIK */}
                  <div className="mt-5 grid grid-cols-1 min-[420px]:grid-cols-3 gap-2.5">
                    <div className="rounded-2xl bg-red-50/70 p-3">
                      <Wallet className="w-4 h-4 text-red-500" />
                      <p className="mt-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Limit</p>
                      <p className="text-xs font-bold text-gray-800 leading-snug line-clamp-2">{item.limit}</p>
                    </div>

                    <div className="rounded-2xl bg-red-50/70 p-3">
                      <Percent className="w-4 h-4 text-red-500" />
                      <p className="mt-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Bunga</p>
                      <p className="text-xs font-bold text-gray-800 leading-snug line-clamp-2">{item.bunga}</p>
                    </div>

                    <div className="rounded-2xl bg-red-50/70 p-3">
                      <CalendarDays className="w-4 h-4 text-red-500" />
                      <p className="mt-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Tenor</p>
                      <p className="text-xs font-bold text-gray-800 leading-snug line-clamp-2">{item.tenor}</p>
                    </div>
                  </div>

                  <p className="mt-5 pt-4 border-t border-gray-100 text-sm font-bold text-red-600 flex items-center gap-1.5">
                    Lihat Detail
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ListPayLater;
