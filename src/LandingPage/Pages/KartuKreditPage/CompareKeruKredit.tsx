// pages/CreditCardCompare.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ExternalLink, CreditCard, Wallet, BadgeCheck, Layers3, Sparkles } from "lucide-react";

import Navbar from "../../Components/Navbar";
import RedirectModal from "../../Components/Riderect/RiderectModal";

interface CompareItem {
  id: string;
  title: string;
  yearlyFee: string;
  detailYearlyFee: string;
  benefitName: string;
  redirectLink: string | null;
  imageLink: string;
  features: {
    feature: string;
  }[];
}

const CreditCardCompare = () => {
  const navigate = useNavigate();

  const [compareData, setCompareData] = useState<CompareItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [openRedirect, setOpenRedirect] = useState(false);

  const [selectedRedirect, setSelectedRedirect] = useState<CompareItem | null>(null);

  const baseURL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const data = sessionStorage.getItem("compareCreditCard");

    if (!data) {
      setLoading(false);
      return;
    }

    setCompareData(JSON.parse(data));

    setLoading(false);
  }, []);

  const handleRedirect = (item: CompareItem) => {
    setSelectedRedirect(item);

    setOpenRedirect(true);
  };

  const handleDetail = (item: CompareItem) => {
    navigate(`/creditcarddetail/${item.id}`);
  };

  const formatRupiah = (value: string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(value));
  };

  const comparisonRows = [
    {
      label: "Iuran Tahunan",
      key: "yearlyFee",
      icon: Wallet,
    },
    {
      label: "Detail Iuran",
      key: "detailYearlyFee",
      icon: BadgeCheck,
    },
    {
      label: "Benefit",
      key: "benefitName",
      icon: Sparkles,
    },
    {
      label: "Fitur",
      key: "features",
      icon: Layers3,
    },
    {
      label: "Pengajuan",
      key: "redirectLink",
      icon: ExternalLink,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-signika">
        <Navbar />

        <div className="flex items-center justify-center h-[70vh]">
          <div className="flex flex-col items-center gap-5">
            <div className="w-16 h-16 border-[6px] border-red-200 border-t-red-600 rounded-full animate-spin"></div>

            <div className="text-center">
              <h2 className="text-2xl font-black text-gray-800">Memuat Komparasi</h2>

              <p className="text-gray-500 mt-2">Sedang menyiapkan kartu kredit terbaik...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (compareData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 font-signika">
        <Navbar />

        <div className="flex items-center justify-center h-[70vh] px-5">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 max-w-md w-full text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-red-100 flex items-center justify-center">
              <CreditCard className="w-12 h-12 text-red-500" />
            </div>

            <h2 className="mt-6 text-3xl font-black text-gray-800">Belum Ada Data</h2>

            <p className="mt-3 text-gray-500 leading-relaxed">Kamu belum memilih kartu kredit untuk dibandingkan.</p>

            <button
              onClick={() => navigate("/kartukredit")}
              className="
                mt-8
                w-full
                py-4
                rounded-2xl
                bg-gradient-to-r
                from-red-500
                to-red-600
                text-white
                font-bold
                shadow-lg
                hover:scale-[1.02]
                transition-all duration-300
              ">
              Cari Kartu Kredit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-white font-signika">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-700 opacity-95"></div>

        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            <div
              className="
                inline-flex
                items-center
                gap-2
                bg-white/20
                backdrop-blur-md
                border border-white/20
                rounded-full
                px-4 py-2
                text-white
                font-medium
                mb-6
                max-sm:mt-10
                mt-10
              ">
              <CreditCard className="w-4 h-4" />
              Komparasi Kartu Kredit
            </div>

            <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight">
              Bandingkan
              <span className="block">Kartu Kredit Terbaik</span>
            </h1>

            <p className="mt-6 text-white/90 text-lg leading-relaxed max-w-2xl">Lihat perbedaan iuran tahunan, benefit, fitur, dan informasi penting lainnya dalam satu tampilan modern.</p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="relative -mt-8 lg:-mt-10 pb-16 px-3 lg:px-6">
        <div className="max-w-7xl mx-auto">
          {/* DESKTOP */}
          <div className="hidden lg:block bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr>
                    <th className="bg-white border-b border-gray-100 p-6 min-w-[260px] text-left">
                      <p className="text-sm font-bold text-red-500 uppercase tracking-wider">Informasi</p>

                      <h2 className="text-3xl font-black text-gray-800 mt-2">Detail Perbandingan</h2>
                    </th>

                    {compareData.map((item) => (
                      <th key={item.id} className="border-b border-gray-100 p-6 min-w-[320px]">
                        <div className="flex flex-col items-center">
                          <div
                            className="
                              w-52 h-32
                              rounded-3xl
                              bg-gradient-to-br
                              from-gray-100
                              to-gray-300
                              p-4
                              shadow-xl
                              flex items-center justify-center
                            ">
                            <img
                              src={`${baseURL}/api${item.imageLink}`}
                              alt={item.title}
                              className="
                                w-full h-full object-contain
                                drop-shadow-[0_35px_45px_rgba(0,0,0,0.45)]
                              "
                            />
                          </div>

                          <h3 className="mt-5 text-2xl font-black text-gray-800">{item.title}</h3>

                          <div className="flex gap-3 mt-5 w-full">
                            <button
                              onClick={() => handleDetail(item)}
                              className="
                                flex-1 py-3 rounded-2xl
                                bg-gray-100 hover:bg-gray-200
                                text-gray-800 font-bold transition
                              ">
                              Detail
                            </button>

                            <button
                              onClick={() => handleRedirect(item)}
                              className="
                                flex-1 py-3 rounded-2xl
                                bg-gradient-to-r from-red-500 to-red-600
                                text-white font-bold
                                flex items-center justify-center gap-2
                                shadow-lg hover:scale-[1.03]
                                transition-all duration-300
                              ">
                              Ajukan
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {comparisonRows.map((row, rowIndex) => {
                    const Icon = row.icon;

                    return (
                      <tr key={rowIndex} className="border-b border-gray-100 last:border-none">
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div
                              className="
                                w-11 h-11 rounded-2xl
                                bg-red-50
                                flex items-center justify-center
                              ">
                              <Icon className="w-5 h-5 text-red-500" />
                            </div>

                            <span className="font-bold text-gray-800">{row.label}</span>
                          </div>
                        </td>

                        {compareData.map((item) => (
                          <td key={item.id} className="p-5">
                            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                              {row.key === "yearlyFee" ? (
                                <span className="text-xl font-black text-red-600">{formatRupiah(item.yearlyFee)}</span>
                              ) : row.key === "features" ? (
                                <div className="space-y-2">
                                  {item.features.map((feature, index) => (
                                    <div
                                      key={index}
                                      className="
                                        flex items-start gap-2
                                        text-sm text-gray-700
                                      ">
                                      <div
                                        className="
                                          w-2 h-2 rounded-full
                                          bg-red-500 mt-2 shrink-0
                                        "
                                      />

                                      <span>{feature.feature}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : row.key === "redirectLink" ? (
                                item.redirectLink ? (
                                  <button
                                    onClick={() => handleRedirect(item)}
                                    className="
                                      inline-flex items-center gap-2
                                      px-5 py-3 rounded-2xl
                                      bg-gradient-to-r
                                      from-red-500 to-red-600
                                      text-white font-bold
                                    ">
                                    Open Link
                                    <ExternalLink className="w-4 h-4" />
                                  </button>
                                ) : (
                                  <span className="text-gray-400">Tidak tersedia</span>
                                )
                              ) : (
                                <span className="text-gray-700 leading-relaxed">{item[row.key as keyof CompareItem] as string}</span>
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE */}
          <div className="lg:hidden flex flex-col gap-6">
            {compareData.map((item) => (
              <div
                key={item.id}
                className="
                  bg-white rounded-[2rem]
                  shadow-xl border border-gray-100
                  overflow-hidden
                ">
                {/* HEADER */}
                <div className="bg-gradient-to-r from-red-500 to-red-700 p-6 text-white">
                  <div className="flex flex-col items-center text-center">
                    <div
                      className="
                        
                        bg-white/10
                        backdrop-blur-md
                        rounded-3xl
                        p-4
                        shadow-lg
                      ">
                      <img
                        src={`${baseURL}/api${item.imageLink}`}
                        alt={item.title}
                        className="
                          w-full h-full object-contain
                          drop-shadow-[0_35px_45px_rgba(0,0,0,0.45)]
                        "
                      />
                    </div>

                    <h2 className="mt-4 text-2xl font-black">{item.title}</h2>

                    <div className="flex gap-3 w-full mt-5">
                      <button
                        onClick={() => handleDetail(item)}
                        className="
                          flex-1 bg-white/20
                          backdrop-blur-md
                          py-3 rounded-2xl font-bold
                        ">
                        Detail
                      </button>

                      <button
                        onClick={() => handleRedirect(item)}
                        className="
                          flex-1 bg-white text-red-500
                          py-3 rounded-2xl font-black
                          flex items-center justify-center gap-2
                        ">
                        Ajukan
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-5 space-y-4">
                  {comparisonRows.map((row, idx) => {
                    const Icon = row.icon;

                    return (
                      <div
                        key={idx}
                        className="
                          bg-gray-50
                          border border-gray-100
                          rounded-2xl
                          p-4
                        ">
                        <div className="flex items-start gap-4">
                          <div
                            className="
                              w-11 h-11 rounded-2xl
                              bg-red-100
                              flex items-center justify-center
                              shrink-0
                            ">
                            <Icon className="w-5 h-5 text-red-500" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-500">{row.label}</p>

                            <div className="mt-2">
                              {row.key === "yearlyFee" ? (
                                <p className="text-lg font-black text-red-600">{formatRupiah(item.yearlyFee)}</p>
                              ) : row.key === "features" ? (
                                <div className="space-y-2">
                                  {item.features.map((feature, index) => (
                                    <div
                                      key={index}
                                      className="
                                        flex items-start gap-2
                                        text-sm text-gray-700
                                      ">
                                      <div
                                        className="
                                          w-2 h-2 rounded-full
                                          bg-red-500 mt-2 shrink-0
                                        "
                                      />

                                      <span>{feature.feature}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : row.key === "redirectLink" ? (
                                item.redirectLink ? (
                                  <button
                                    onClick={() => handleRedirect(item)}
                                    className="
                                      inline-flex items-center gap-2
                                      text-red-500 font-bold
                                    ">
                                    Open Link
                                    <ExternalLink className="w-4 h-4" />
                                  </button>
                                ) : (
                                  <span className="text-gray-400">Tidak tersedia</span>
                                )
                              ) : (
                                <p className="text-gray-800 leading-relaxed">{item[row.key as keyof CompareItem] as string}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedRedirect && (
        <RedirectModal open={openRedirect} onClose={() => setOpenRedirect(false)} lenderName={selectedRedirect.title} lenderImage={`${baseURL}${selectedRedirect.imageLink}`} redirectUrl={selectedRedirect.redirectLink || "#"} />
      )}
    </div>
  );
};

export default CreditCardCompare;
