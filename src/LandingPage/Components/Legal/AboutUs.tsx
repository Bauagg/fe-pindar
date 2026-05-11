import { Building2, CheckCircle2, AlertTriangle } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-red-500" />
          </div>

          <div>
            <p className="text-red-500 font-bold uppercase text-sm">About Us</p>

            <h2 className="text-3xl font-black text-gray-800">Tentang Pindar</h2>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 rounded-[2rem] p-6 lg:p-8">
          <h3 className="text-2xl font-black text-gray-800 leading-snug">Bandingkan Pindar Legal dengan Lebih Aman & Cerdas</h3>

          <p className="mt-5 text-gray-700 leading-relaxed text-lg">Pindar membantu pengguna menemukan dan membandingkan layanan pinjaman daring legal yang diawasi OJK.</p>
        </div>
      </div>

      <div>
        <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 rounded-[2rem] p-6 lg:p-8">
          <h3 className="text-2xl font-black text-gray-800 leading-snug">Apa itu Pindar?</h3>

          <p className="mt-5 text-gray-700 leading-relaxed text-lg">
            Otoritas Jasa Keuangan (OJK) memperkenalkan istilah Pindar (Pinjaman Daring) untuk merujuk pada layanan pinjaman online resmi yang legal, terdaftar, dan diawasi oleh OJK. Perubahan istilah ini dilakukan untuk membedakan secara
            tegas antara layanan pinjaman legal dan praktik pinjaman online ilegal yang berisiko bagi masyarakat.
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-black text-gray-800 mb-5">Mengapa Pindar?</h3>

        <div className="grid md:grid-cols-3 gap-5">
          {["Fokus pada layanan legal", "Informasi transparan", "Keputusan finansial lebih aman"].map((item, index) => (
            <div key={index} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>

              <p className="mt-5 text-gray-700 font-semibold leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-black text-gray-800 mb-5">Mengapa Menggunkan Pindar?</h3>

        <div className="grid md:grid-cols-3 gap-5">
          {["Membandingkan berbagai layanan pinjaman daring legal ", "Memahami fitur, biaya, dan manfaat produk ", "Mengambil keputusan finansial dengan lebih percaya diri "].map((item, index) => (
            <div key={index} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>

              <p className="mt-5 text-gray-700 font-semibold leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-[2rem] border border-gray-100">
        <div className="ms-4 font-black text-gray-800 pt-5">
          Kenali Perbedaan Pinjol Ilegal & Legal <br /> <span className="taxt-xs font-normal text-gray-500 block md:hidden">Geser Untuk Melihat Perbedaannya</span>
        </div>
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-5 text-left text-gray-400 font-bold">Pinjol Ilegal</th>

              <th className="p-5 text-left text-red-500 font-bold">Pindar Legal</th>
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
                <td className="p-5 text-gray-700">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mt-1 shrink-0" />

                    {row[0]}
                  </div>
                </td>

                <td className="p-5 text-gray-700">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 shrink-0" />

                    {row[1]}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 rounded-[2rem] p-6 lg:p-8">
          <h3 className="text-2xl font-black text-gray-800 leading-snug">Disclaimer</h3>

          <p className="mt-5 text-gray-700 leading-relaxed text-lg">
            Pindar merupakan platform agregator informasi finansial dan bukan lembaga keuangan, pemberi pinjaman, maupun penyalur dana. Persetujuan, verifikasi, dan pencairan pinjaman sepenuhnya menjadi kewenangan masing-masing partner
            penyedia layanan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
