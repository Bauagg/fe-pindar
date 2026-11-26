import { ShieldCheck, CircleCheck } from "lucide-react";

const sections = [
  {
    title: "Informasi yang Kami Kumpulkan",
    content: `
      Pindar dapat mengumpulkan informasi tertentu terkait penggunaan platform.
    `,
    list: ["Alamat IP", "Jenis perangkat", "Browser dan sistem operasi", "Aktivitas penggunaan platform", "Data analytics dan cookies", "Data yang Anda isi secara sukarela pada formulir pengajuan produk"],
  },
  {
    title: "Penggunaan Informasi",
    content: `
      Informasi yang dikumpulkan digunakan untuk mendukung dan meningkatkan kualitas layanan Pindar.
    `,
    list: ["Menyediakan dan mengoptimalkan layanan Pindar", "Analisis penggunaan platform", "Pengukuran traffic dan performa platform", "Peningkatan pengalaman pengguna"],
  },
  {
    title: "Pengisian Formulir dan Pembagian Data kepada Mitra",
    content: `
      Pindar.id menyediakan formulir pengajuan pada berbagai produk keuangan, seperti Pinjaman Daring (Pindar), Kartu Kredit, Kredit Tanpa Agunan (KTA), serta Multifinance dan Leaseback BPKB. Formulir ini hadir untuk membantu Anda menyampaikan kebutuhan dengan mudah, sekaligus menghubungkan Anda dengan penyedia layanan keuangan yang paling sesuai.

      Setelah Anda mengisi dan mengirimkan formulir pada produk apa pun di Pindar.id, data yang Anda berikan berpotensi diteruskan kepada pihak lain yang sah, legal, dan terpercaya, seperti bank, perusahaan pembiayaan, penyelenggara pinjaman daring yang berizin, maupun lembaga jasa keuangan lainnya yang bekerja sama dengan Pindar.id.

      Pembagian data ini dilakukan semata-mata agar permohonan Anda dapat ditindaklanjuti dengan baik, mulai dari proses verifikasi, penilaian kelayakan, penawaran produk, hingga komunikasi lanjutan oleh mitra terkait. Dengan begitu, Anda tidak perlu mengisi data yang sama berulang kali di banyak tempat.

      Dengan mengirimkan formulir, Anda memahami dan menyetujui bahwa data tersebut dapat dibagikan kepada mitra sebagaimana dijelaskan di atas. Setelah data diterima oleh mitra, pengelolaan dan penggunaannya tunduk pada kebijakan privasi masing-masing mitra. Kami menganjurkan Anda untuk membaca kebijakan tersebut agar Anda semakin tenang dan paham bagaimana data Anda dilindungi.
    `,
    list: [
      "Data hanya dapat diteruskan kepada mitra yang legal, berizin, dan diawasi oleh otoritas yang berwenang",
      "Data digunakan untuk menindaklanjuti pengajuan yang Anda kirimkan",
      "Mitra dapat menghubungi Anda melalui kontak yang Anda cantumkan pada formulir",
      "Pindar.id berupaya bekerja sama dengan mitra yang menjunjung tinggi kepatuhan regulasi dan perlindungan data",
    ],
  },
  {
    title: "Tautan dan Layanan Pihak Ketiga",
    content: `
      Pindar dapat menyediakan tautan, referral link, atau akses menuju website maupun aplikasi partner penyedia layanan finansial sebagai bagian dari pengembangan layanan.

      Apabila pengguna memilih mengakses layanan partner melalui tautan yang tersedia, maka pengguna dapat meninggalkan platform Pindar dan seluruh proses pengajuan, verifikasi, persetujuan, serta pencairan layanan dilakukan sepenuhnya oleh partner terkait.

      Pindar tidak memproses, menyetujui, maupun mengambil keputusan atas pengajuan layanan finansial pengguna.

      Penggunaan data pada platform partner tunduk pada kebijakan privasi masing-masing partner.
    `,
  },
  {
    title: "Cookies dan Tracking",
    content: `
      Pindar dapat menggunakan cookies atau teknologi serupa untuk memahami traffic pengguna, mengukur performa platform, dan meningkatkan pengalaman penggunaan layanan.

      Pengguna dapat mengatur browser untuk menolak cookies, namun beberapa fitur mungkin tidak berfungsi optimal.
    `,
    list: ["Memahami traffic pengguna", "Mengukur performa platform", "Meningkatkan pengalaman penggunaan layanan"],
  },
  {
    title: "Keamanan Data",
    content: `
      Pindar menerapkan langkah teknis dan administratif yang wajar untuk membantu menjaga keamanan data penggunaan platform.

      Namun, tidak ada sistem elektronik yang sepenuhnya bebas dari risiko keamanan.
    `,
  },
  {
    title: "Hak Pengguna",
    content: `
      Pengguna dapat menghubungi Pindar terkait pertanyaan, permintaan informasi, atau masukan terkait privasi dan penggunaan data.
    `,
  },
  {
    title: "Perubahan Kebijakan Privasi",
    content: `
      Pindar dapat memperbarui Kebijakan Privasi ini sewaktu-waktu sesuai kebutuhan operasional, pengembangan layanan, atau perubahan regulasi.

      Perubahan akan dipublikasikan melalui platform Pindar.
    `,
  },
  {
    title: "Hubungi Kami",
    content: `
      Jika Anda memiliki pertanyaan terkait Kebijakan Privasi, silakan hubungi:

      Email: support@pindar.id
      Website: www.pindar.id
    `,
  },
];

const PrivacyPolicy = () => {
  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-red-500" />
        </div>

        <div>
          <h2 className="text-xl md:text-3xl font-black text-gray-800">Kebijakan Privasi</h2>

          <p className="mt-2 text-gray-500  text-xs md:text-base">Terakhir diperbarui: 26 November 2026</p>
        </div>
      </div>

      {/* INTRO */}
      <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 rounded-[2rem] p-6 lg:p-8 mb-8">
        <p className="text-gray-700 leading-relaxed  text-sm md:text-base">Pindar menghargai privasi pengguna dan berkomitmen melindungi informasi yang diperoleh melalui penggunaan platform.</p>

        <p className="mt-4 text-gray-700 leading-relaxed  text-sm md:text-base">Kebijakan Privasi ini menjelaskan bagaimana Pindar mengumpulkan, menggunakan, dan melindungi informasi pengguna dalam penggunaan layanan Pindar.</p>

        <p className="mt-4 text-gray-700 leading-relaxed font-semibold  text-sm md:text-base">Dengan mengakses dan menggunakan platform Pindar, Anda menyetujui Kebijakan Privasi ini.</p>
      </div>

      {/* CONTENT */}
      <div className="space-y-6">
        {sections.map((section, index) => (
          <div key={index} className="bg-white border border-gray-100 rounded-[2rem] shadow-lg p-6 lg:p-8">
            <h3 className="text-xl md:text-2xl font-black text-gray-800">
              {index + 1}. {section.title}
            </h3>

            {section.content && (
              <div className="mt-5 space-y-4">
                {section.content
                  .trim()
                  .split("\n\n")
                  .map((paragraph, idx) => (
                    <p key={idx} className="text-gray-700 leading-relaxed  text-sm md:text-base">
                      {paragraph.trim()}
                    </p>
                  ))}
              </div>
            )}

            {section.list && (
              <div className="mt-5 space-y-3">
                {section.list.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                      <CircleCheck className="w-4 h-4 text-green-600" />
                    </div>

                    <p className="text-gray-700 leading-relaxed  text-sm md:text-base">{item}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
