// pages/PindarCompare.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ExternalLink, Wallet, Clock3, CreditCard, FileText, Info, Scale } from "lucide-react";

import Navbars from "../../Components/Navbar/index";
import RedirectModal from "../../Components/Riderect/RiderectModal";

interface CompareItem {
  id: string;
  lenderName: string;
  imageLink: string;
  directLink: string;
  maxLoan: number;
  maxTenor: string;
  loanType: string;
  paymentType: string;
  additionalInformation: string;
  termsDocument: string;
}

const PindarCompare = () => {
  const navigate = useNavigate();

  const [compareData, setCompareData] = useState<CompareItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openRedirect, setOpenRedirect] = useState(false);

  const [selectedRedirect, setSelectedRedirect] = useState<CompareItem | null>(null);

  const handleRedirect = (item: CompareItem) => {
    setSelectedRedirect(item);

    setOpenRedirect(true);
  };

  const baseURL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchAllDetails = async () => {
      try {
        const data = sessionStorage.getItem("dataCompere");

        if (!data) {
          setLoading(false);
          return;
        }

        const items = JSON.parse(data);

        const promises = items.map(async (item: { id: string }) => {
          try {
            const response = await fetch(`${baseURL}/api/lender/detail/${item.id}`);

            const result = await response.json();

            const lender = result.data;

            lender.id = item.id;

            return lender;
          } catch (error) {
            console.error(`Error fetching ID ${item.id}`, error);
            return null;
          }
        });

        const results = await Promise.all(promises);

        setCompareData(results.filter(Boolean));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDetails();
  }, [baseURL]);

  const formatRupiah = (value: number) => {
    if (!value) return "Rp 0";

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleDetail = (item: CompareItem) => {
    navigate(`/pindardetail/${item.id}`);
  };

  const comparisonRows = [
    {
      label: "Link Pengajuan",
      key: "directLink",
      icon: ExternalLink,
    },
    {
      label: "Maksimum Pinjaman",
      key: "maxLoan",
      icon: Wallet,
    },
    {
      label: "Maksimum Tenor",
      key: "maxTenor",
      icon: Clock3,
    },
    {
      label: "Tipe Pinjaman",
      key: "loanType",
      icon: Scale,
    },
    {
      label: "Jenis Pembayaran",
      key: "paymentType",
      icon: CreditCard,
    },
    {
      label: "Informasi Tambahan",
      key: "additionalInformation",
      icon: Info,
    },
    {
      label: "Dokumen Persyaratan",
      key: "termsDocument",
      icon: FileText,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-signika">
        <Navbars />

        <div className="flex items-center justify-center h-[70vh]">
          <div className="flex flex-col items-center gap-5">
            <div className="w-16 h-16 border-[6px] border-red-200 border-t-red-600 rounded-full animate-spin"></div>

            <div className="text-center">
              <h2 className="text-2xl font-black text-gray-800">Memuat Komparasi</h2>

              <p className="text-gray-500 mt-2">Sedang menyiapkan data pindar terbaik...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (compareData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 font-signika">
        <Navbars />

        <div className="flex items-center justify-center h-[70vh] px-5">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 max-w-md w-full text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-red-100 flex items-center justify-center">
              <Scale className="w-12 h-12 text-red-500" />
            </div>

            <h2 className="mt-6 text-3xl font-black text-gray-800">Belum Ada Data</h2>

            <p className="mt-3 text-gray-500 leading-relaxed">Kamu belum memilih pindar untuk dibandingkan.</p>

            <button onClick={() => navigate("/")} className="mt-8 w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold shadow-lg hover:scale-[1.02] transition-all duration-300">
              Cari Pindar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-white font-signika">
      <Navbars />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-700 opacity-95"></div>

        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-white font-medium mb-6 max-sm:mt-10 mt-10 taxt-xs md:text-base">
              <Scale className="w-4 h-4" />
              Komparasi Pindar
            </div>

            <h1 className="text-3xl lg:text-6xl font-black text-white leading-tight">
              Bandingkan
              <span className="block">Pinjaman Terbaik</span>
            </h1>

            <p className="mt-6 text-white/90 text-base md:text-lg leading-relaxed max-w-2xl">Lihat perbedaan limit, tenor, jenis pembayaran, dan informasi penting lainnya dalam satu tampilan modern.</p>
          </div>
        </div>
      </section>

      {/* TABLE */}
      {/* COMPARE CONTENT */}
      <section className="relative -mt-8 lg:-mt-10 pb-16 px-3 lg:px-6">
        <div className="max-w-7xl mx-auto">
          {/* DESKTOP TABLE */}
          <div className="hidden lg:block bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr>
                    <th className="bg-white border-b border-gray-100 p-6 min-w-[260px] text-left">
                      <p className="text-sm font-bold text-red-500 uppercase tracking-wider">Informasi</p>

                      <h2 className="text-3xl font-black text-gray-800 mt-2">Detail Perbandingan</h2>
                    </th>

                    {compareData.map((item, index) => (
                      <th key={index} className="border-b border-gray-100 p-6 min-w-[320px]">
                        <div className="flex flex-col items-center">
                          <div className="w-28 h-28 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-center p-5 shadow-sm">
                            <img src={`${baseURL}/api${item.imageLink}`} alt={item.lenderName} className="w-full h-full object-contain" />
                          </div>

                          <h3 className="mt-5 text-2xl font-black text-gray-800">{item.lenderName}</h3>

                          <div className="flex gap-3 mt-5 w-full">
                            <button onClick={() => handleDetail(item)} className="flex-1 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold transition  text-sm md:text-base">
                              Detail
                            </button>

                            <button
                              onClick={() => handleRedirect(item)}
                              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.03] transition-all duration-300 text-base">
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
                            <div className="w-11 h-11 rounded-2xl bg-red-50 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-red-500" />
                            </div>

                            <span className="font-bold text-gray-800">{row.label}</span>
                          </div>
                        </td>

                        {compareData.map((item, index) => (
                          <td key={index} className="p-5">
                            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                              {row.key === "maxLoan" ? (
                                <span className="text-xl font-black text-red-600">{formatRupiah(item.maxLoan)}</span>
                              ) : row.key === "directLink" ? (
                                <button
                                  onClick={() => handleRedirect(item)}
                                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold hover:scale-[1.03] transition-all duration-300">
                                  Open Link
                                  <ExternalLink className="w-4 h-4" />
                                </button>
                              ) : row.key === "additionalInformation" || row.key === "termsDocument" ? (
                                <div
                                  className="
      prose prose-sm max-w-none
      prose-p:text-gray-700
      prose-p:leading-relaxed
      prose-strong:text-gray-900
      prose-ul:pl-5
      prose-li:text-gray-700
      prose-li:marker:text-red-500
    "
                                  dangerouslySetInnerHTML={{
                                    __html: item[row.key as keyof CompareItem] as string,
                                  }}
                                />
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

          {/* MOBILE CARD VIEW */}
          <div className="lg:hidden flex flex-col gap-6">
            {compareData.map((item, index) => (
              <div key={index} className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                {/* HEADER */}
                <div className="bg-gradient-to-r from-red-500 to-red-700 p-6 text-white">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-white rounded-3xl p-4 shadow-lg">
                      <img src={`${baseURL}/api${item.imageLink}`} alt={item.lenderName} className="w-full h-full object-contain" />
                    </div>

                    <h2 className="mt-4 text-2xl font-black">{item.lenderName}</h2>

                    <div className="flex gap-3 w-full mt-5">
                      <button onClick={() => handleDetail(item)} className="flex-1 bg-white/20 backdrop-blur-md py-2 rounded-2xl font-bold">
                        <span className="text-sm">Detail</span>
                      </button>

                      <button onClick={() => handleRedirect(item)} className="flex-1 bg-white text-red-500 py-2 rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-[1.03] transition-all duration-300 text-sm">
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
                      <div key={idx} className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-11 h-11 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5 text-red-500" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-500">{row.label}</p>

                            <div className="mt-2 break-words">
                              {row.key === "maxLoan" ? (
                                <p className="text-lg font-black text-red-600">{formatRupiah(item.maxLoan)}</p>
                              ) : row.key === "directLink" ? (
                                <button onClick={() => handleRedirect(item)} className="inline-flex items-center gap-2 text-red-500 font-bold">
                                  Open Link
                                  <ExternalLink className="w-4 h-4" />
                                </button>
                              ) : row.key === "additionalInformation" || row.key === "termsDocument" ? (
                                <div
                                  className="
      prose prose-sm max-w-none
      prose-p:leading-relaxed
      prose-p:text-gray-700
      prose-li:text-gray-700
      prose-strong:text-gray-900
      prose-ul:pl-5
      prose-li:marker:text-red-500
    "
                                  dangerouslySetInnerHTML={{
                                    __html: item[row.key as keyof CompareItem] as string,
                                  }}
                                />
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
        <RedirectModal open={openRedirect} onClose={() => setOpenRedirect(false)} lenderName={selectedRedirect.lenderName} lenderImage={`${baseURL}/api${selectedRedirect.imageLink}`} redirectUrl={selectedRedirect.directLink} />
      )}
    </div>
  );
};

export default PindarCompare;
