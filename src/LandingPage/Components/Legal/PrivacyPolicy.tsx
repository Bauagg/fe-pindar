import { ShieldCheck, CircleCheck } from "lucide-react";

const sections = [
  {
    title: "Informasi yang Kami Kumpulkan",
    content: `
      Pindar dapat mengumpulkan informasi tertentu terkait penggunaan platform.
    `,
    list: ["Alamat IP", "Jenis perangkat", "Browser dan sistem operasi", "Aktivitas penggunaan platform", "Data analytics dan cookies"],
  },
  {
    title: "Penggunaan Informasi",
    content: `
      Informasi yang dikumpulkan digunakan untuk mendukung dan meningkatkan kualitas layanan Pindar.
    `,
    list: ["Menyediakan dan mengoptimalkan layanan Pindar", "Analisis penggunaan platform", "Pengukuran traffic dan performa platform", "Peningkatan pengalaman pengguna"],
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
          <p className="text-red-500 font-bold uppercase text-sm">Privacy Policy</p>

          <h2 className="text-xl md:text-3xl font-black text-gray-800">Kebijakan Privasi</h2>

          <p className="mt-2 text-gray-500  text-xs md:text-base">Terakhir diperbarui: 11 Mei 2026</p>
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
            <h3 className="text-xlmd:text-2xl font-black text-gray-800">
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
