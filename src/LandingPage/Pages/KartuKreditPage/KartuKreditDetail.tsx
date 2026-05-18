// pages/CreditCardDetail.tsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ArrowRight, BadgeCheck, CreditCard, FileText, Info, ShieldCheck, Wallet, Layers3, Building2, Banknote } from "lucide-react";

import Navbar from "../../Components/Navbar";
import RedirectModal from "../../Components/Riderect/RiderectModal";

import { CreditCardDetail as CreditCardDetailType } from "../../../types/creditcard";

const CreditCardDetail = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [data, setData] = useState<CreditCardDetailType | null>(null);

  const [loading, setLoading] = useState(true);

  const [openRedirect, setOpenRedirect] = useState(false);

  const baseURL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (!id) {
          setLoading(false);
          return;
        }

        const response = await fetch(`${baseURL}/api/credit-card/detail/${id}`);

        const result = await response.json();

        setData(result.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, baseURL]);

  const formatRupiah = (value: string | number | null) => {
    if (!value) return "Rp 0";

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(value));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-signika">
        <Navbar />

        <div className="flex items-center justify-center h-[70vh]">
          <div className="flex flex-col items-center gap-5">
            <div className="w-16 h-16 border-[6px] border-red-200 border-t-red-600 rounded-full animate-spin"></div>

            <div className="text-center">
              <h2 className="text-2xl font-black text-gray-800">Memuat Detail</h2>

              <p className="text-gray-500 mt-2">Sedang mengambil informasi kartu kredit...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 font-signika">
        <Navbar />

        <div className="flex items-center justify-center h-[70vh] px-5">
          <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-10 max-w-md w-full text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-red-100 flex items-center justify-center">
              <Info className="w-12 h-12 text-red-500" />
            </div>

            <h2 className="mt-6 text-3xl font-black text-gray-800">Data Tidak Ditemukan</h2>

            <button
              onClick={() => navigate(-1)}
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
              ">
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  const infoCards = [
    {
      title: "Iuran Tahunan",
      value: formatRupiah(data.yearlyFee),
      icon: Wallet,
    },
    {
      title: "Publisher",
      value: data.publisher?.name,
      icon: Building2,
    },
    {
      title: "Jenis Kartu",
      value: data.type?.name,
      icon: CreditCard,
    },
    {
      title: "Minimum Income",
      value: formatRupiah(data.monthlyIncomeMinimum),
      icon: Banknote,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-white font-signika">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-700"></div>

        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center max-sm:mt-12 mt-12">
            {/* LEFT */}
            <div>
              <div
                className="
                  inline-flex items-center gap-2
                  bg-white/20 border border-white/20
                  backdrop-blur-md
                  px-4 py-2 rounded-full
                  text-white font-semibold mb-6 text-sm md:text-base
                ">
                <BadgeCheck className="w-4 h-4" />
                Kartu Kredit Terverifikasi
              </div>

              <h1 className="text-2xl lg:text-6xl font-black text-white leading-tight">{data.title}</h1>

              <p className="mt-6 text-white/90 text-sm md:text-lg leading-relaxed">Informasi lengkap mengenai limit pinjaman, tenor, metode pembayaran, serta persyaratan dokumen.</p>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  onClick={() => setOpenRedirect(true)}
                  className="
                    px-7 py-4 rounded-2xl
                    bg-white text-red-600
                    font-black
                    flex items-center justify-center gap-2
                    shadow-xl
                    hover:scale-[1.03]
                    transition-all duration-300
                    taxt-sm md:text-base
                  ">
                  Ajukan Sekarang
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex justify-center lg:justify-end">
              <div className="bg-white rounded-[2rem] shadow-2xl p-8 w-full max-w-md">
                <div
                  className="
                    mx-auto
                    rounded-[2rem]
                    bg-gradient-to-br
                    from-gray-100
                    to-gray-300
                    border border-gray-100
                    flex items-center justify-center
                    p-4
                  ">
                  <img
                    src={`${baseURL}/api${data.imageLink}`}
                    alt={data.title}
                    className="
                      w-full h-full object-contain rounded-xl
                      drop-shadow-[0_35px_45px_rgba(0,0,0,0.45)]
                    "
                  />
                </div>

                <div className="mt-8 text-center">
                  <h2 className="text-xl md:text-3xl font-black text-gray-800">{data.title}</h2>

                  <div
                    className="
                      mt-4
                      inline-flex items-center gap-2
                      bg-green-100 text-green-700
                      px-4 py-2 rounded-full
                      font-bold text-sm md:text-base
                    ">
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
      <section className="relative -mt-8 lg:-mt-12 px-4 lg:px-8 pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5">
            {infoCards.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="
                    bg-white
                    rounded-[2rem]
                    border border-gray-100
                    shadow-xl
                    p-6
                  ">
                  <div
                    className="
                      w-12 md:w-14 h-12 md:h-14 rounded-2xl
                      bg-red-50
                      flex items-center justify-center
                    ">
                    <Icon className="sm:w-4 md:w-6 sm:h-4 md:h-6 text-red-500" />
                  </div>

                  <p className="mt-5 text-sm text-gray-500 font-semibold">{item.title}</p>

                  <h3
                    className="
                      mt-2 text-lg md:text-xl font-black
                      text-gray-800 leading-snug break-words
                    ">
                    {item.value}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DETAIL */}
      <section className="px-4 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6">
          {/* INFORMASI */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                <Info className="w-6 h-6 text-red-500" />
              </div>

              <div>
                <p className="text-red-500 font-bold uppercase text-sm">Informasi</p>

                <h2 className="text-xl md:text-3xl font-black text-gray-800">Detail Kartu</h2>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-500">Siapa Yang Bisa Daftar</p>

                <h3 className="font-bold text-gray-800 mt-1">{data.whoCanRegister}</h3>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-500">Usia Kartu Utama</p>

                <h3 className="font-bold text-gray-800 mt-1">
                  {data.mainCardMinimumAge} - {data.mainCardMaximumAge} Tahun
                </h3>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-500">Minimum Pembayaran Bulanan</p>

                <h3 className="font-bold text-gray-800 mt-1">{formatRupiah(data.monthlyMinimumPayment)}</h3>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-500">Denda Keterlambatan</p>

                <h3 className="font-bold text-gray-800 mt-1">{formatRupiah(data.latePaymentChargePenalty)}</h3>
              </div>
            </div>
          </div>

          {/* FEATURES */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                <Layers3 className="w-6 h-6 text-red-500" />
              </div>

              <div>
                <p className="text-red-500 font-bold uppercase text-sm">Fitur</p>

                <h2 className="text-xl md:text-3xl font-black text-gray-800">Fitur Kartu</h2>
              </div>
            </div>

            <div className="space-y-4">
              {data.features.map((feature, index) => (
                <div
                  key={index}
                  className="
                    flex items-start gap-4
                    bg-gray-50
                    border border-gray-100
                    rounded-2xl
                    p-4
                  ">
                  <div
                    className="
                      w-10 h-10 rounded-xl
                      bg-red-100
                      flex items-center justify-center
                      shrink-0
                    ">
                    <FileText className="w-4 h-4 text-red-500" />
                  </div>

                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TERMS */}
        <div className="max-w-7xl mx-auto mt-6">
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                <FileText className="w-6 h-6 text-red-500" />
              </div>

              <div>
                <p className="text-red-500 font-bold uppercase text-sm">Persyaratan</p>

                <h2 className="text-xl md:text-3xl font-black text-gray-800">Dokumen Dibutuhkan</h2>
              </div>
            </div>

            {/* CONTENT */}
            <div
              className="
      [&>p:first-child]:hidden

      [&_ol]:space-y-4
      [&_ol]:list-none
      [&_ol]:p-0
      [&_ol]:m-0

      [&_li]:bg-white
      [&_li]:border
      [&_li]:border-gray-100
      [&_li]:rounded-2xl
      [&_li]:p-4
      [&_li]:sm:p-5
      [&_li]:shadow-sm
      [&_li]:flex
      [&_li]:gap-4
      [&_li]:items-start
      [&_li]:text-sm
      [&_li]:sm:text-base
      [&_li]:leading-relaxed
      [&_li]:text-gray-700

      [&_li::before]:content-['✓']
      [&_li::before]:min-w-8
      [&_li::before]:h-8
      [&_li::before]:rounded-xl
      [&_li::before]:bg-red-50
      [&_li::before]:text-red-500
      [&_li::before]:font-bold
      [&_li::before]:flex
      [&_li::before]:items-center
      [&_li::before]:justify-center
      [&_li::before]:text-sm

      [&_strong]:text-gray-900
      [&_strong]:font-bold
    "
              dangerouslySetInnerHTML={{
                __html: data.termsDocument,
              }}
            />
          </div>
        </div>
      </section>

      <RedirectModal open={openRedirect} onClose={() => setOpenRedirect(false)} lenderName={data.title} lenderImage={`${baseURL}/api${data.imageLink}`} redirectUrl={data.redirectLink || "#"} />
    </div>
  );
};

export default CreditCardDetail;
