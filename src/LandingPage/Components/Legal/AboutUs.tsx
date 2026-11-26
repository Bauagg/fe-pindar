import { Building2, Wallet, CreditCard, Banknote, CarFront, HeartHandshake, ShieldCheck, Sparkles, CheckCircle2, AlertTriangle } from "lucide-react";

const products = [
  {
    icon: Wallet,
    title: "Pinjaman Daring (Pindar)",
    desc: "Informasi layanan pinjaman daring dari berbagai penyelenggara, lengkap dan mudah dipahami.",
  },
  {
    icon: CreditCard,
    title: "Kartu Kredit",
    desc: "Informasi produk kartu kredit dari berbagai bank dan penerbit, supaya Anda bisa memilih yang paling cocok.",
  },
  {
    icon: Banknote,
    title: "Kredit Tanpa Agunan (KTA)",
    desc: "Pilihan informasi fasilitas kredit tanpa jaminan untuk berbagai kebutuhan Anda.",
  },
  {
    icon: CarFront,
    title: "Multifinance & Leaseback BPKB",
    desc: "Informasi pembiayaan kendaraan dan fasilitas dana dengan jaminan BPKB.",
  },
];

const whyPindar = ["Fokus pada layanan legal", "Informasi transparan", "Keputusan finansial lebih aman"];

const whyUse = ["Membandingkan berbagai layanan pinjaman daring legal", "Memahami fitur, biaya, dan manfaat produk", "Mengambil keputusan finansial dengan lebih percaya diri"];

const compareRows = [
  ["Tidak terdaftar", "Diawasi OJK"],
  ["Tidak transparan", "Sesuai regulasi"],
  ["Risiko data", "Perlindungan konsumen"],
  ["Praktik penagihan tidak sesuai aturan", "Mengikuti standar operasional"],
];

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
            <h2
              className="
                text-xl
                sm:text-2xl
                lg:text-3xl
                font-black
                text-gray-800
              ">
              Tentang Pindar.id
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
            Temukan Informasi dan Solusi Keuangan dalam Satu Platform
          </h3>

          <p
            className="
              mt-4
              text-sm
              sm:text-base
              text-gray-700
              leading-relaxed
            ">
            Pindar.id adalah platform informasi dan agregasi fintech yang hadir untuk membantu masyarakat Indonesia menemukan berbagai produk dan layanan keuangan digital dengan lebih mudah, praktis, dan informatif. Semua dalam satu tempat,
            tanpa perlu repot mencari ke sana kemari.
          </p>

          <p
            className="
              mt-3
              text-sm
              sm:text-base
              text-gray-700
              leading-relaxed
            ">
            Kami menghadirkan informasi mengenai berbagai pilihan produk keuangan dari para penyedia layanan, sehingga Anda dapat mengenali pilihan yang tersedia dan menyesuaikannya dengan kebutuhan serta kondisi finansial Anda
            masing-masing.
          </p>
        </div>
      </div>

      {/* PRODUK KEUANGAN */}
      <div>
        <h3
          className="
            text-lg
            sm:text-2xl
            font-black
            text-gray-800
            mb-2
          ">
          Produk Keuangan
        </h3>

        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-5">Melalui Pindar.id, Anda dapat menemukan informasi berbagai produk keuangan, antara lain:</p>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
          {products.map((item, index) => {
            const Icon = item.icon;

            return (
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
                    bg-red-50
                    flex items-center justify-center
                  ">
                  <Icon className="w-5 h-5 text-red-500" />
                </div>

                <h4 className="mt-4 text-base sm:text-lg font-black text-gray-800 leading-snug">{item.title}</h4>

                <p
                  className="
                    mt-2
                    text-sm
                    sm:text-base
                    text-gray-600
                    leading-relaxed
                  ">
                  {item.desc}
                </p>
              </div>
            );
          })}
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
          {whyPindar.map((item, index) => (
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
          {whyUse.map((item, index) => (
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
            {compareRows.map((row, index) => (
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

      {/* KOMITMEN */}
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
          <div className="flex items-center gap-3">
            <div
              className="
                w-10 h-10
                rounded-xl
                bg-white
                flex items-center justify-center
                shadow-sm
                shrink-0
              ">
              <HeartHandshake className="w-5 h-5 text-red-500" />
            </div>

            <h3
              className="
                text-lg
                sm:text-xl
                lg:text-2xl
                font-black
                text-gray-800
                leading-snug
              ">
              Komitmen Kami
            </h3>
          </div>

          <p
            className="
              mt-4
              text-sm
              sm:text-base
              text-gray-700
              leading-relaxed
            ">
            Pindar.id berkomitmen menghadirkan informasi keuangan yang mudah dipahami, relevan, dan membantu masyarakat mengambil keputusan finansial secara lebih bijak.
          </p>

          <p
            className="
              mt-3
              text-sm
              sm:text-base
              text-gray-700
              leading-relaxed
            ">
            Kami percaya bahwa akses terhadap informasi yang tepat adalah langkah awal yang manis untuk memilih produk keuangan yang benar-benar sesuai dengan kebutuhan Anda.
          </p>
        </div>
      </div>

      {/* PENUTUP */}
      <div
        className="
          bg-white
          border border-gray-100
          rounded-2xl sm:rounded-[2rem]
          p-5 sm:p-6 lg:p-8
          shadow-lg
          text-center
        ">
        <div
          className="
            w-11 h-11
            sm:w-12 sm:h-12
            mx-auto
            rounded-2xl
            bg-red-50
            flex items-center justify-center
          ">
          <Sparkles className="w-5 h-5 text-red-500" />
        </div>

        <h3
          className="
            mt-4
            text-lg
            sm:text-xl
            lg:text-2xl
            font-black
            text-gray-800
            leading-snug
          ">
          Pindar.id, Satu Platform untuk Berbagai Pilihan Keuangan
        </h3>

        <p
          className="
            mt-3
            text-sm
            sm:text-base
            text-gray-700
            leading-relaxed
          ">
          Kenali pilihan Anda, pahami kebutuhan Anda, dan temukan informasi produk keuangan melalui Pindar.id.
        </p>
      </div>

      {/* DISCLAIMER */}
      <div
        className="
          flex items-start gap-3
          bg-gray-50
          border border-gray-100
          rounded-2xl sm:rounded-[2rem]
          p-5 sm:p-6
        ">
        <ShieldCheck className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />

        <p
          className="
            text-xs
            sm:text-sm
            text-gray-500
            leading-relaxed
          ">
          Pindar.id bukan lembaga pemberi pinjaman atau penyedia fasilitas kredit secara langsung. Persetujuan, pencairan, serta ketentuan produk sepenuhnya menjadi kewenangan masing-masing penyedia layanan keuangan.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
