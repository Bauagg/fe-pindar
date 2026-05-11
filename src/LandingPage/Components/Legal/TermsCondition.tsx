import { Scale, CircleCheck } from "lucide-react";

const sections = [
  {
    title: "Tentang Pindar",
    content: `
      Pindar adalah platform agregator informasi finansial yang membantu pengguna menemukan dan membandingkan layanan pinjaman daring legal yang terdaftar dan diawasi oleh Otoritas Jasa Keuangan (OJK).

      Pindar bukan lembaga keuangan, pemberi pinjaman, penyalur dana, maupun pihak yang memproses persetujuan pinjaman.
    `,
  },
  {
    title: "Penggunaan Layanan",
    list: ["Mencari informasi produk pinjaman daring", "Membandingkan fitur, biaya, dan informasi produk", "Mengakses tautan menuju partner penyedia layanan"],
    content: `
      Pengguna setuju menggunakan platform secara wajar, sah, dan tidak melanggar hukum yang berlaku.
    `,
  },
  {
    title: "Akurasi Informasi",
    content: `
      Pindar berupaya menyediakan informasi yang akurat dan terkini. Namun, informasi produk, biaya, suku bunga, promo, maupun syarat layanan dapat berubah sewaktu-waktu sesuai kebijakan masing-masing partner.

      Pengguna disarankan untuk selalu melakukan verifikasi langsung kepada partner penyedia layanan.
    `,
  },
  {
    title: "Tautan ke Pihak Ketiga",
    list: ["Isi layanan pihak ketiga", "Keputusan persetujuan pinjaman", "Proses verifikasi", "Pencairan dana", "Kebijakan privasi pihak ketiga"],
    content: `
      Segala interaksi pengguna dengan partner sepenuhnya berada di luar kendali Pindar.
    `,
  },
  {
    title: "Tanggung Jawab Pengguna",
    list: ["Keakuratan data yang diberikan", "Keputusan finansial pribadi", "Pemahaman terhadap syarat partner penyedia layanan"],
    content: `
      Pindar tidak bertanggung jawab atas kerugian yang timbul akibat keputusan finansial pengguna.
    `,
  },
  {
    title: "Hak Kekayaan Intelektual",
    content: `
      Seluruh konten, desain, logo, teks, dan elemen platform Pindar merupakan milik Pindar atau pihak terkait dan dilindungi oleh hukum yang berlaku.

      Pengguna tidak diperkenankan menyalin, mendistribusikan, atau menggunakan konten tanpa izin tertulis.
    `,
  },
  {
    title: "Perubahan Layanan dan Ketentuan",
    content: `
      Pindar berhak mengubah, memperbarui, atau menghentikan sebagian maupun seluruh layanan sewaktu-waktu.

      Pindar juga dapat memperbarui Syarat & Ketentuan ini sesuai kebutuhan operasional maupun regulasi.
    `,
  },
  {
    title: "Pembatasan Tanggung Jawab",
    list: ["Kelayakan produk finansial tertentu", "Persetujuan pinjaman", "Hasil finansial tertentu"],
    content: `
      Penggunaan platform sepenuhnya menjadi tanggung jawab pengguna.
    `,
  },
  {
    title: "Hukum yang Berlaku",
    content: `
      Syarat & Ketentuan ini tunduk pada hukum Republik Indonesia.
    `,
  },
  {
    title: "Kontak",
    content: `
      Jika Anda memiliki pertanyaan terkait Syarat & Ketentuan ini, silakan hubungi:

      Email: support@pindar.id
      Website: www.pindar.id
    `,
  },
];

const TermsCondition = () => {
  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
          <Scale className="w-6 h-6 text-red-500" />
        </div>

        <div>
          <p className="text-red-500 font-bold uppercase text-sm">Terms & Condition</p>

          <h2 className="text-3xl font-black text-gray-800">Syarat & Ketentuan</h2>

          <p className="mt-2 text-gray-500">Terakhir diperbarui: 11 Mei 2026</p>
        </div>
      </div>

      {/* INTRO */}
      <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 rounded-[2rem] p-6 lg:p-8 mb-8">
        <p className="text-gray-700 leading-relaxed text-lg">Selamat datang di Pindar. Dengan mengakses dan menggunakan platform Pindar, Anda dianggap telah membaca, memahami, dan menyetujui seluruh Syarat & Ketentuan berikut.</p>
      </div>

      {/* CONTENT */}
      <div className="space-y-6">
        {sections.map((section, index) => (
          <div key={index} className="bg-white border border-gray-100 rounded-[2rem] shadow-lg p-6 lg:p-8">
            <h3 className="text-2xl font-black text-gray-800">
              {index + 1}. {section.title}
            </h3>

            {section.content && (
              <div className="mt-5 space-y-4">
                {section.content
                  .trim()
                  .split("\n\n")
                  .map((paragraph, idx) => (
                    <p key={idx} className="text-gray-700 leading-relaxed">
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

                    <p className="text-gray-700 leading-relaxed">{item}</p>
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

export default TermsCondition;
