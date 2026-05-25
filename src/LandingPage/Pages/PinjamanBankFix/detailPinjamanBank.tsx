import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BadgeCheck, Building2, FileText, Info, ShieldCheck } from "lucide-react";

import Navbars from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { dummyPinjamanBank } from "../../../types/dummyPinjamanBank";

const DetailPinjamanBank = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const data = dummyPinjamanBank.find((item) => item.id === id);

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 font-signika">
        <Navbars />

        <div className="flex items-center justify-center h-[70vh] px-4">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center">
              <Info className="w-10 h-10 text-red-500" />
            </div>

            <h2 className="mt-5 text-2xl font-black text-gray-800">Data Tidak Ditemukan</h2>

            <button onClick={() => navigate(-1)} className="mt-7 w-full py-3 rounded-2xl bg-red-500 text-white font-bold">
              Kembali
            </button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-white font-signika">
      <Navbars />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-700" />

        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-10 sm:py-14 lg:py-20">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-10 items-center mt-10">
            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 border border-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs sm:text-sm font-semibold mb-5 mt-5">
                <BadgeCheck className="w-4 h-4" />
                Pinjaman Bank
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">{data.namaBank}</h1>

              <p className="mt-5 text-white/90 text-sm sm:text-base leading-relaxed max-w-xl">{data.detailPinjaman}</p>
            </div>

            {/* RIGHT */}
            <div className="flex justify-center lg:justify-end">
              <div className="bg-white rounded-2xl sm:rounded-[2rem] shadow-2xl p-6 sm:p-8 w-full max-w-sm">
                <div className="h-48 flex items-center justify-center">
                  <img src={data.imageLink} alt={data.namaBank} className="w-full h-full max-h-[180px] object-contain" />
                </div>

                <div className="mt-5 text-center">
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs sm:text-sm font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    Tersedia
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INFO CARD */}
      <section className="relative -mt-8 px-4 lg:px-8 pb-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl p-6">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-red-500" />
            </div>

            <p className="mt-4 text-sm text-gray-500 font-semibold">Publisher</p>

            <h3 className="mt-1 text-xl font-black text-gray-800">{data.publisher}</h3>
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl p-6">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
              <FileText className="w-6 h-6 text-red-500" />
            </div>

            <p className="mt-4 text-sm text-gray-500 font-semibold">Total Dokumen</p>

            <h3 className="mt-1 text-xl font-black text-gray-800">{data.dokumenDibutuhkan.length} Dokumen</h3>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-4 lg:px-8 pb-14">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6">
          {/* DETAIL PINJAMAN */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                <Info className="w-6 h-6 text-red-500" />
              </div>

              <div>
                <p className="text-red-500 font-bold uppercase text-sm">Informasi</p>

                <h2 className="text-2xl font-black text-gray-800">Detail Pinjaman</h2>
              </div>
            </div>

            <p className="text-gray-600 text-sm md:text-base leading-relaxed">{data.detailPinjaman}</p>
          </div>

          {/* DOKUMEN */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                <FileText className="w-6 h-6 text-red-500" />
              </div>

              <div>
                <p className="text-red-500 font-bold uppercase text-sm">Persyaratan</p>

                <h2 className="text-2xl font-black text-gray-800">Dokumen Dibutuhkan</h2>
              </div>
            </div>

            <div className="space-y-3">
              {data.dokumenDibutuhkan.map((doc, index) => (
                <div key={index} className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4">
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-red-500 font-bold flex items-center justify-center">✓</div>

                  <p className="text-sm md:text-base font-semibold text-gray-700">{doc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DetailPinjamanBank;
