import { Building2, CheckCircle2, AlertTriangle } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="space-y-7 sm:space-y-10">
      {/* HEADER */}
      <div>
        <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
          <div
            className="
              w-11 h-11
              sm:w-14 sm:h-14
              rounded-2xl
              bg-red-50
              flex items-center justify-center
            ">
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
          </div>

          <div>
            <p className="text-red-500 font-bold uppercase text-xs sm:text-sm">About Us</p>

            <h2
              className="
                text-xl
                sm:text-2xl
                lg:text-3xl
                font-black
                text-gray-800
              ">
              Tentang Pindar
            </h2>
          </div>
        </div>

        <div
          className="
            bg-gradient-to-r
            from-red-50
            to-rose-50
            border border-red-100
            rounded-2xl sm:rounded-[2rem]
            p-5 sm:p-6 lg:p-8
          ">
          <h3
            className="
              text-lg
              sm:text-xl
              lg:text-2xl
              font-black
              text-gray-800
              leading-snug
            ">
            Bandingkan Pindar Legal dengan Lebih Aman & Cerdas
          </h3>

          <p
            className="
              mt-4
              text-sm
              sm:text-base
              text-gray-700
              leading-relaxed
            ">
            Pindar membantu pengguna menemukan dan membandingkan layanan pinjaman daring legal yang diawasi OJK.
          </p>
        </div>
      </div>

      {/* APA ITU */}
      <div>
        <div
          className="
            bg-gradient-to-r
            from-red-50
            to-rose-50
            border border-red-100
            rounded-2xl sm:rounded-[2rem]
            p-5 sm:p-6 lg:p-8
          ">
          <h3
            className="
              text-lg
              sm:text-xl
              lg:text-2xl
              font-black
              text-gray-800
              leading-snug
            ">
            Apa itu Pindar?
          </h3>

          <p
            className="
              mt-4
              text-sm
              sm:text-base
              text-gray-700
              leading-relaxed
            ">
            Otoritas Jasa Keuangan (OJK) memperkenalkan istilah Pindar (Pinjaman Daring) untuk merujuk pada layanan pinjaman online resmi yang legal, terdaftar, dan diawasi oleh OJK. Perubahan istilah ini dilakukan untuk membedakan secara
            tegas antara layanan pinjaman legal dan praktik pinjaman online ilegal yang berisiko bagi masyarakat.
          </p>
        </div>
      </div>

      {/* MENGAPA */}
      <div>
        <h3
          className="
            text-lg
            sm:text-2xl
            font-black
            text-gray-800
            mb-4 sm:mb-5
          ">
          Mengapa Pindar?
        </h3>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-5">
          {["Fokus pada layanan legal", "Informasi transparan", "Keputusan finansial lebih aman"].map((item, index) => (
            <div
              key={index}
              className="
                bg-white
                border border-gray-100
                rounded-2xl sm:rounded-3xl
                p-5 sm:p-6
                shadow-lg
              ">
              <div
                className="
                  w-11 h-11
                  sm:w-12 sm:h-12
                  rounded-2xl
                  bg-green-100
                  flex items-center justify-center
                ">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>

              <p
                className="
                  mt-4
                  text-sm
                  sm:text-base
                  text-gray-700
                  font-semibold
                  leading-relaxed
                ">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* MENGGUNAKAN */}
      <div>
        <h3
          className="
            text-lg
            sm:text-2xl
            font-black
            text-gray-800
            mb-4 sm:mb-5
          ">
          Mengapa Menggunakan Pindar?
        </h3>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-5">
          {["Membandingkan berbagai layanan pinjaman daring legal", "Memahami fitur, biaya, dan manfaat produk", "Mengambil keputusan finansial dengan lebih percaya diri"].map((item, index) => (
            <div
              key={index}
              className="
                bg-white
                border border-gray-100
                rounded-2xl sm:rounded-3xl
                p-5 sm:p-6
                shadow-lg
              ">
              <div
                className="
                  w-11 h-11
                  sm:w-12 sm:h-12
                  rounded-2xl
                  bg-green-100
                  flex items-center justify-center
                ">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>

              <p
                className="
                  mt-4
                  text-sm
                  sm:text-base
                  text-gray-700
                  font-semibold
                  leading-relaxed
                ">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div
        className="
          overflow-x-auto
          rounded-2xl sm:rounded-[2rem]
          border border-gray-100
          bg-white
        ">
        <div className="px-5 pt-5">
          <div className="font-black text-gray-800 text-lg sm:text-xl">Kenali Perbedaan Pinjol Ilegal & Legal</div>

          <span className="text-xs text-gray-500 block md:hidden mt-1">Geser untuk melihat perbedaannya</span>
        </div>

        <table className="w-full min-w-[650px] mt-4">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4 sm:p-5 text-left text-gray-400 text-sm font-bold">Pinjol Ilegal</th>

              <th className="p-4 sm:p-5 text-left text-red-500 text-sm font-bold">Pindar Legal</th>
            </tr>
          </thead>

          <tbody>
            {[
              ["Tidak terdaftar", "Diawasi OJK"],
              ["Tidak transparan", "Sesuai regulasi"],
              ["Risiko data", "Perlindungan konsumen"],
              ["Praktik penagihan tidak sesuai aturan", "Mengikuti standar operasional"],
            ].map((row, index) => (
              <tr key={index} className="border-t border-gray-100">
                <td className="p-4 sm:p-5 text-sm sm:text-base text-gray-700">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />

                    {row[0]}
                  </div>
                </td>

                <td className="p-4 sm:p-5 text-sm sm:text-base text-gray-700">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />

                    {row[1]}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DISCLAIMER */}
      <div>
        <div
          className="
            bg-gradient-to-r
            from-red-50
            to-rose-50
            border border-red-100
            rounded-2xl sm:rounded-[2rem]
            p-5 sm:p-6 lg:p-8
          ">
          <h3
            className="
              text-lg
              sm:text-xl
              lg:text-2xl
              font-black
              text-gray-800
              leading-snug
            ">
            Disclaimer
          </h3>

          <p
            className="
              mt-4
              text-sm
              sm:text-base
              text-gray-700
              leading-relaxed
            ">
            Pindar merupakan platform agregator informasi finansial dan bukan lembaga keuangan, pemberi pinjaman, maupun penyalur dana. Persetujuan, verifikasi, dan pencairan pinjaman sepenuhnya menjadi kewenangan masing-masing partner
            penyedia layanan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
