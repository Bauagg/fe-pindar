// pages/PindarDetail.tsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, BadgeCheck, Clock3, CreditCard, FileText, Info, Landmark, ShieldCheck, Wallet } from "lucide-react";

import Navbars from "../../Components/Navbar/index";
import RedirectModal from "../../Components/Riderect/RiderectModal";

interface DetailItem {
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

const PindarDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState<DetailItem | null>(null);
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

        const response = await fetch(`${baseURL}/api/lender/detail/${id}`);

        const result = await response.json();

        const lender = result.data;

        lender.id = id;

        setData(lender);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, baseURL]);

  const formatRupiah = (value: number) => {
    if (!value) return "Rp 0";

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-signika">
        <Navbars />

        <div className="flex items-center justify-center h-[70vh]">
          <div className="flex flex-col items-center gap-5">
            <div className="w-14 h-14 border-[5px] border-red-200 border-t-red-600 rounded-full animate-spin"></div>

            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-black text-gray-800">Memuat Detail</h2>

              <p className="text-sm sm:text-base text-gray-500 mt-2">Sedang mengambil informasi pindar...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 font-signika">
        <Navbars />

        <div className="flex items-center justify-center h-[70vh] px-4">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-10 max-w-md w-full text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center">
              <Info className="w-10 h-10 text-red-500" />
            </div>

            <h2 className="mt-5 text-2xl sm:text-3xl font-black text-gray-800">Data Tidak Ditemukan</h2>

            <button
              onClick={() => navigate(-1)}
              className="
                mt-7
                w-full
                py-3
                rounded-2xl
                bg-gradient-to-r
                from-red-500
                to-red-600
                text-white
                font-bold
                text-sm sm:text-base
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
      title: "Maksimum Pinjaman",
      value: formatRupiah(data.maxLoan),
      icon: Wallet,
    },
    {
      title: "Maksimum Tenor",
      value: data.maxTenor,
      icon: Clock3,
    },
    {
      title: "Tipe Pinjaman",
      value: data.loanType,
      icon: Landmark,
    },
    {
      title: "Jenis Pembayaran",
      value: data.paymentType,
      icon: CreditCard,
    },
  ];

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
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  bg-white/20
                  border border-white/20
                  backdrop-blur-md
                  px-4 py-2
                  rounded-full
                  text-white
                  text-xs sm:text-sm
                  font-semibold
                  mb-5
                  mt-5
                  
                ">
                <BadgeCheck className="w-4 h-4" />
                Pindar Terverifikasi
              </div>

              <h1
                className="
                  text-3xl
                  md:text-3xl
                  lg:text-5xl
                  font-black
                  text-white
                  leading-tight
                ">
                {data.lenderName}
              </h1>

              <p
                className="
                  mt-4
                  text-white/90
                  text-sm
                  sm:text-base
                  leading-relaxed
                  max-w-xl
                ">
                Informasi lengkap mengenai limit pinjaman, tenor, metode pembayaran, serta persyaratan dokumen.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-7">
                <button
                  onClick={() => setOpenRedirect(true)}
                  className="
                    px-5 sm:px-7
                    py-3
                    rounded-xl sm:rounded-2xl
                    bg-white
                    text-red-600
                    text-sm sm:text-base
                    font-bold
                    flex items-center justify-center gap-2
                    shadow-xl
                    hover:scale-[1.03]
                    active:scale-[0.98]
                    transition-all duration-300
                  ">
                  Ajukan Sekarang
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex justify-center lg:justify-end">
              <div
                className="
                  bg-white
                  rounded-2xl sm:rounded-[2rem]
                  shadow-2xl
                  p-5 sm:p-8
                  w-full
                  max-w-sm
                ">
                <div className="flex items-center justify-center p-2">
                  <img
                    src={`${baseURL}/api${data.imageLink}`}
                    alt={data.lenderName}
                    className="
                      w-full
                      h-full
                      max-h-[180px]
                      sm:max-h-[240px]
                      object-contain
                    "
                  />
                </div>

                <div className="mt-4 text-center">
                  <div
                    className="
                      mt-2
                      inline-flex
                      items-center
                      gap-2
                      bg-green-100
                      text-green-700
                      px-4 py-2
                      rounded-full
                      text-xs sm:text-sm
                      font-bold
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
      <section className="relative -mt-6 sm:-mt-8 lg:-mt-12 px-4 lg:px-8 pb-8 sm:pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {infoCards.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="
                    bg-white
                    rounded-2xl
                    sm:rounded-[2rem]
                    border border-gray-100
                    shadow-lg
                    p-4 sm:p-6
                  ">
                  <div
                    className="
                      w-11 h-11
                      sm:w-14 sm:h-14
                      rounded-2xl
                      bg-red-50
                      flex items-center justify-center
                    ">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                  </div>

                  <p className="mt-3 text-xs sm:text-sm text-gray-500 font-semibold">{item.title}</p>

                  <h3
                    className="
                      mt-1
                      text-sm
                      sm:text-xl
                      font-black
                      text-gray-800
                      leading-snug
                      break-words
                    ">
                    {item.value}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-4 lg:px-8 pb-10 sm:pb-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-5 sm:gap-6">
          {/* INFORMASI */}
          <div
            className="
              bg-white
              rounded-2xl sm:rounded-[2rem]
              border border-gray-100
              shadow-xl
              p-4 sm:p-6 lg:p-8
            ">
            <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
              <div
                className="
                  w-11 h-11
                  sm:w-14 sm:h-14
                  rounded-2xl
                  bg-red-50
                  flex items-center justify-center
                ">
                <Info className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
              </div>

              <div>
                <p className="text-red-500 font-bold uppercase text-xs sm:text-sm">Informasi</p>

                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-800">Tentang {data.lenderName}</h2>
              </div>
            </div>

            <div
              className="
                prose
                prose-sm
                sm:prose-base
                max-w-none
                prose-p:text-gray-700
                prose-p:leading-relaxed
                prose-li:text-gray-700
                prose-strong:text-gray-900
                prose-ul:pl-5
                prose-li:marker:text-red-500
                text-sm md:text-base
              "
              dangerouslySetInnerHTML={{
                __html: data.additionalInformation,
              }}
            />
          </div>

          {/* SYARAT */}
          <div
            className="
              bg-white
              rounded-2xl sm:rounded-[2rem]
              border border-gray-100
              shadow-xl
              p-4 sm:p-6 lg:p-8
            ">
            <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
              <div
                className="
                  w-11 h-11
                  sm:w-14 sm:h-14
                  rounded-2xl
                  bg-red-50
                  flex items-center justify-center
                ">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
              </div>

              <div>
                <p className="text-red-500 font-bold uppercase text-xs sm:text-sm">Persyaratan</p>

                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-800">Dokumen Dibutuhkan</h2>
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

      <RedirectModal open={openRedirect} onClose={() => setOpenRedirect(false)} lenderName={data.lenderName} lenderImage={`${baseURL}/api${data.imageLink}`} redirectUrl={data.directLink} />
    </div>
  );
};

export default PindarDetail;
