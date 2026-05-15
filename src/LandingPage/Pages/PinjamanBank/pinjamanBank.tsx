import { Clock3, Sparkles, ShieldCheck, Wrench, BellRing } from "lucide-react";

import Navbar from "../../Components/Navbar";

const BankLoanMaintenance = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-white font-signika overflow-hidden">
      <Navbar />

      <section
        className="
          relative
          min-h-screen
          flex items-center justify-center
          px-4 lg:px-8
          py-16 sm:py-20 lg:py-24
        ">
        {/* BACKGROUND */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-80 h-80 bg-red-300/20 rounded-full blur-3xl" />

          <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-300/20 rounded-full blur-3xl" />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-100/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* LEFT */}
          <div className="text-center lg:text-left animate-fadeIn">
            {/* BADGE */}
            <div
              className="
                inline-flex items-center gap-2
                bg-red-100 text-red-600
                px-4 py-2.5
                rounded-full
                font-bold
                text-xs sm:text-sm
                shadow-lg
                mt-10
              ">
              <Sparkles className="w-4 h-4" />
              Coming Soon
            </div>

            {/* TITLE */}
            <h1
              className="
                mt-6
                text-3xl
                sm:text-4xl
                lg:text-6xl
                font-black
                leading-tight
                text-gray-900
              ">
              Fitur
              <span className="block text-red-500">Pinjaman Bank</span>
              Sedang Dipersiapkan
            </h1>

            {/* DESC */}
            <p
              className="
                mt-5
                text-sm
                sm:text-base
                lg:text-lg
                text-gray-600
                leading-relaxed
                max-w-2xl
                mx-auto lg:mx-0
              ">
              Kami sedang menyiapkan pengalaman terbaik untuk membantu Anda menemukan dan membandingkan produk pinjaman bank secara lebih aman, transparan, dan mudah dipahami.
            </p>

            <p
              className="
                mt-3
                text-sm
                sm:text-base
                text-gray-500
                leading-relaxed
                max-w-2xl
                mx-auto lg:mx-0
              ">
              Nantinya Anda dapat membandingkan bunga, tenor, limit pinjaman, hingga simulasi cicilan dari berbagai bank terpercaya dalam satu platform modern.
            </p>

            {/* INFO */}
            <div className="mt-7 grid sm:grid-cols-2 gap-4">
              {/* CARD */}
              <div
                className="
                  bg-white
                  border border-gray-100
                  rounded-2xl sm:rounded-3xl
                  p-5
                  shadow-lg
                  hover:-translate-y-1
                  transition-all duration-300
                ">
                <div
                  className="
                    w-11 h-11
                    sm:w-12 sm:h-12
                    rounded-2xl
                    bg-red-50
                    flex items-center justify-center
                    mx-auto lg:mx-0
                  ">
                  <ShieldCheck className="w-5 h-5 text-red-500" />
                </div>

                <h3
                  className="
                    mt-4
                    font-black
                    text-gray-800
                    text-base sm:text-lg
                  ">
                  Aman & Terpercaya
                </h3>

                <p
                  className="
                    mt-2
                    text-gray-600
                    leading-relaxed
                    text-sm
                  ">
                  Informasi produk akan berasal dari partner terpercaya dan legal.
                </p>
              </div>

              {/* CARD */}
              <div
                className="
                  bg-white
                  border border-gray-100
                  rounded-2xl sm:rounded-3xl
                  p-5
                  shadow-lg
                  hover:-translate-y-1
                  transition-all duration-300
                ">
                <div
                  className="
                    w-11 h-11
                    sm:w-12 sm:h-12
                    rounded-2xl
                    bg-red-50
                    flex items-center justify-center
                    mx-auto lg:mx-0
                  ">
                  <Clock3 className="w-5 h-5 text-red-500" />
                </div>

                <h3
                  className="
                    mt-4
                    font-black
                    text-gray-800
                    text-base sm:text-lg
                  ">
                  Segera Hadir
                </h3>

                <p
                  className="
                    mt-2
                    text-gray-600
                    leading-relaxed
                    text-sm
                  ">
                  Tim kami sedang melakukan pengembangan dan penyempurnaan sistem.
                </p>
              </div>
            </div>

            {/* BUTTON */}
            <div className="mt-8">
              <button
                className="
                  inline-flex items-center gap-3
                  px-5 sm:px-7
                  py-3 sm:py-4
                  rounded-xl sm:rounded-2xl
                  bg-gradient-to-r
                  from-red-500 to-red-600
                  text-white
                  text-sm sm:text-base
                  font-black
                  shadow-xl
                  hover:scale-[1.03]
                  transition-all duration-300
                ">
                <BellRing className="w-5 h-5" />
                Nantikan Update Selanjutnya
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative flex justify-center">
            <div
              className="
                relative
                w-full max-w-lg
                bg-white/90 backdrop-blur-xl
                border border-white
                rounded-[2rem] sm:rounded-[3rem]
                shadow-2xl
                p-5 sm:p-8 md:p-10
              ">
              {/* ICON */}
              <div className="flex justify-center">
                <div
                  className="
                    w-24 h-24
                    sm:w-28 sm:h-28
                    rounded-[2rem]
                    bg-gradient-to-br
                    from-red-500 to-red-600
                    flex items-center justify-center
                    shadow-2xl
                    animate-pulse
                  ">
                  <Wrench className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
                </div>
              </div>

              {/* TEXT */}
              <div className="mt-7 text-center">
                <h2
                  className="
                    text-2xl
                    sm:text-3xl
                    md:text-4xl
                    font-black
                    text-gray-900
                  ">
                  Under Maintenance
                </h2>

                <p
                  className="
                    mt-3
                    text-sm
                    sm:text-base
                    text-gray-600
                    leading-relaxed
                  ">
                  Halaman pinjaman bank sedang dalam tahap pengembangan untuk memberikan pengalaman yang lebih maksimal bagi pengguna.
                </p>
              </div>

              {/* STATUS */}
              <div className="mt-7 space-y-3">
                {["Pengembangan fitur perbandingan bank", "Optimasi tampilan mobile & desktop", "Integrasi data partner bank", "Peningkatan keamanan & performa"].map((item, index) => (
                  <div
                    key={index}
                    className="
                      flex items-center gap-4
                      bg-red-50
                      border border-red-100
                      rounded-2xl
                      px-4 py-3
                      hover:bg-red-100/60
                      transition-all duration-300
                    ">
                    <div
                      className="
                        w-3 h-3 rounded-full
                        bg-red-500
                        animate-pulse
                      "
                    />

                    <p className="text-sm sm:text-base text-gray-700 font-semibold">{item}</p>
                  </div>
                ))}
              </div>

              {/* FOOTER */}
              <div className="mt-7 text-center">
                <p className="text-xs sm:text-sm text-gray-400">© 2026 Pindar — Better Financial Experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOM ANIMATION */}
      <style>
        {`
          .animate-fadeIn {
            animation: fadeInUp 0.8s ease;
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default BankLoanMaintenance;
