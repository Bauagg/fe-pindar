import { useState } from "react";
import { Banknote, Car, ChevronDown, CircleCheck, CircleHelp, CreditCard, Info, ShieldCheck, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ================================================================== */
/* Tipe data                                                           */
/* ================================================================== */

/** string = paragraf, string[] = daftar poin (ber-ikon centang) */
type Block = string | string[];

interface FaqItem {
  q: string;
  a: Block[];
}

interface FaqCategory {
  id: string;
  title: string;
  icon: LucideIcon;
  items: FaqItem[];
}

/* ================================================================== */
/* Data FAQ                                                            */
/* ================================================================== */

const umum: FaqCategory = {
  id: "umum",
  title: "Pertanyaan Umum tentang Pindar.id",
  icon: Info,
  items: [
    {
      q: "Apa itu Pindar.id?",
      a: [
        "Pindar.id adalah platform agregasi fintech yang membantu masyarakat memperoleh informasi mengenai berbagai produk dan layanan keuangan.",
        "Melalui Pindar.id, pengguna dapat menemukan pilihan produk Pinjaman Daring (Pindar), Kartu Kredit, KTA, serta Multifinance atau Leaseback BPKB dari penyedia layanan keuangan.",
      ],
    },
    {
      q: "Apa tujuan Pindar.id?",
      a: [
        "Pindar.id hadir untuk mempermudah masyarakat dalam mencari, memahami, dan menemukan pilihan produk keuangan yang sesuai dengan kebutuhan serta kemampuan finansial mereka.",
        "Kami berkomitmen menyediakan informasi yang mudah diakses agar masyarakat dapat mengambil keputusan keuangan secara lebih bijak.",
      ],
    },
    {
      q: "Apakah Pindar.id merupakan perusahaan pemberi pinjaman?",
      a: [
        "Pindar.id merupakan platform agregasi fintech yang berfokus pada penyediaan informasi dan fasilitasi pencarian produk keuangan.",
        "Pindar.id bukan pemberi pinjaman, bank, atau perusahaan pembiayaan, kecuali dinyatakan secara khusus sesuai dengan kegiatan usaha dan izin yang berlaku.",
      ],
    },
    {
      q: "Apakah Pindar.id menyediakan berbagai pilihan produk keuangan?",
      a: [
        "Ya. Pindar.id menghadirkan informasi dari berbagai kategori produk keuangan, antara lain:",
        ["Pinjaman Daring (Pindar)", "Kartu Kredit", "Kredit Tanpa Agunan (KTA)", "Multifinance atau Leaseback BPKB"],
        "Ketersediaan produk bergantung pada mitra penyedia layanan dan informasi yang tersedia di platform.",
      ],
    },
    {
      q: "Apakah pengajuan produk keuangan melalui Pindar.id pasti disetujui?",
      a: [
        "Tidak. Persetujuan pengajuan sepenuhnya menjadi kewenangan bank, penyelenggara Pindar, atau perusahaan pembiayaan yang bersangkutan.",
        "Setiap penyedia layanan memiliki kebijakan, persyaratan, serta proses penilaian kelayakan masing-masing.",
      ],
    },
    {
      q: "Apakah Pindar.id mengenakan biaya untuk mencari informasi produk?",
      a: [
        "Pengguna dapat mengakses informasi produk yang tersedia di Pindar.id sesuai ketentuan platform.",
        "Apabila terdapat biaya terkait produk keuangan, biaya tersebut akan mengikuti ketentuan penyedia layanan yang bersangkutan dan harus diperiksa sebelum pengguna menyetujui pengajuan.",
      ],
    },
  ],
};

const pindar: FaqCategory = {
  id: "pindar",
  title: "Tentang Pinjaman Daring (Pindar)",
  icon: Banknote,
  items: [
    {
      q: "Apa yang dimaksud dengan Pinjaman Daring atau Pindar?",
      a: [
        "Pinjaman Daring (Pindar) adalah layanan pendanaan berbasis teknologi informasi yang memungkinkan proses pengajuan dan transaksi pendanaan dilakukan secara digital melalui penyelenggara yang berizin dan diawasi oleh Otoritas Jasa Keuangan (OJK).",
        "Pindar dapat menjadi salah satu alternatif pembiayaan bagi masyarakat yang membutuhkan dana untuk keperluan tertentu.",
      ],
    },
    {
      q: "Apa perbedaan Pindar dengan pinjaman online ilegal?",
      a: [
        "Pindar yang resmi diselenggarakan oleh perusahaan yang memiliki izin OJK dan wajib mematuhi ketentuan yang berlaku.",
        "Sementara itu, pinjaman online ilegal beroperasi tanpa izin yang diperlukan dan berpotensi menimbulkan risiko, seperti biaya tidak transparan, penyalahgunaan data pribadi, serta praktik penagihan yang melanggar hukum.",
        "Pengguna disarankan selalu memeriksa status izin penyelenggara melalui kanal resmi OJK sebelum mengajukan pinjaman.",
      ],
    },
    {
      q: "Siapa yang dapat mengajukan Pinjaman Daring?",
      a: [
        "Pengajuan dapat dilakukan oleh calon penerima dana yang memenuhi persyaratan penyelenggara Pindar.",
        "Persyaratan umumnya meliputi:",
        [
          "Warga Negara Indonesia.",
          "Memenuhi batas usia yang ditentukan.",
          "Memiliki identitas diri yang valid.",
          "Memiliki penghasilan atau kemampuan membayar.",
          "Memiliki rekening bank atas nama sendiri.",
          "Memenuhi persyaratan verifikasi dan penilaian kredit.",
        ],
        "Persyaratan dapat berbeda pada setiap penyelenggara.",
      ],
    },
    {
      q: "Apakah Pinjaman Daring membutuhkan jaminan?",
      a: ["Sebagian besar produk Pindar merupakan pendanaan tanpa agunan.", "Namun, ketentuan mengenai jaminan atau persyaratan tambahan dapat berbeda tergantung pada jenis produk dan kebijakan penyelenggara."],
    },
    {
      q: "Berapa lama proses pengajuan Pindar?",
      a: [
        "Proses pengajuan dilakukan secara digital dan waktu pemrosesan dapat berbeda pada setiap penyelenggara.",
        "Kecepatan persetujuan dan pencairan dana bergantung pada kelengkapan dokumen, hasil verifikasi, penilaian kelayakan, serta kebijakan masing-masing penyedia layanan.",
      ],
    },
    {
      q: "Berapa besar pinjaman yang dapat diajukan?",
      a: ["Besaran pinjaman yang dapat diajukan bergantung pada produk dan kebijakan penyelenggara.", "Jumlah pendanaan yang disetujui akan mempertimbangkan profil calon penerima dana, kemampuan membayar, serta hasil penilaian kredit."],
    },
    {
      q: "Apakah Pindar memiliki bunga dan biaya?",
      a: [
        "Ya. Setiap produk Pindar memiliki ketentuan manfaat ekonomi, biaya layanan, serta kemungkinan biaya lainnya sesuai perjanjian.",
        "Pengguna wajib membaca dan memahami seluruh rincian biaya, jumlah pengembalian, serta jadwal pembayaran sebelum menyetujui pendanaan.",
      ],
    },
    {
      q: "Apa yang terjadi jika terlambat membayar pinjaman?",
      a: [
        "Keterlambatan pembayaran dapat menimbulkan konsekuensi sesuai perjanjian, termasuk denda keterlambatan dan dampak terhadap riwayat kredit.",
        "Apabila mengalami kesulitan membayar, pengguna disarankan segera menghubungi penyelenggara Pindar untuk memperoleh informasi mengenai solusi yang tersedia.",
      ],
    },
  ],
};

const kartuKredit: FaqCategory = {
  id: "kartu-kredit",
  title: "Tentang Kartu Kredit",
  icon: CreditCard,
  items: [
    {
      q: "Apa itu kartu kredit?",
      a: [
        "Kartu kredit adalah fasilitas pembayaran yang diberikan oleh bank penerbit kepada nasabah untuk melakukan transaksi pembelian atau pembayaran dengan menggunakan limit kredit yang telah ditentukan.",
        "Tagihan transaksi harus dibayar sesuai ketentuan dan jadwal yang ditetapkan oleh bank penerbit.",
      ],
    },
    {
      q: "Apa manfaat menggunakan kartu kredit?",
      a: [
        "Kartu kredit dapat memberikan berbagai manfaat, antara lain:",
        [
          "Mempermudah transaksi pembayaran.",
          "Memberikan fleksibilitas dalam pembayaran.",
          "Mendukung transaksi online maupun offline.",
          "Menawarkan program cashback, reward, atau poin.",
          "Menyediakan fasilitas cicilan pada transaksi tertentu.",
        ],
        "Manfaat yang tersedia bergantung pada jenis kartu dan kebijakan bank penerbit.",
      ],
    },
    {
      q: "Siapa yang dapat mengajukan kartu kredit?",
      a: [
        "Calon pemegang kartu kredit harus memenuhi persyaratan bank penerbit.",
        "Persyaratan umum dapat mencakup:",
        ["Memiliki identitas diri yang valid.", "Memenuhi batas usia minimum.", "Memiliki penghasilan sesuai ketentuan bank.", "Memiliki dokumen pendukung penghasilan.", "Memenuhi penilaian kelayakan kredit."],
      ],
    },
    {
      q: "Apakah pengajuan kartu kredit membutuhkan penghasilan tetap?",
      a: ["Sebagian besar bank menetapkan persyaratan penghasilan minimum bagi calon pemegang kartu kredit.", "Ketentuan tersebut berbeda pada setiap bank dan jenis kartu yang diajukan."],
    },
    {
      q: "Apa itu limit kartu kredit?",
      a: [
        "Limit kartu kredit adalah batas maksimum penggunaan kredit yang diberikan oleh bank penerbit kepada pemegang kartu.",
        "Besaran limit ditentukan berdasarkan hasil penilaian bank, termasuk penghasilan, profil keuangan, dan riwayat kredit calon nasabah.",
      ],
    },
    {
      q: "Apakah kartu kredit memiliki biaya tahunan?",
      a: [
        "Sebagian kartu kredit mengenakan biaya tahunan atau annual fee.",
        "Namun, terdapat pula produk yang menawarkan pembebasan biaya tahunan dengan syarat tertentu.",
        "Informasi mengenai biaya tahunan perlu diperiksa pada masing-masing produk kartu kredit.",
      ],
    },
    {
      q: "Apakah kartu kredit dapat digunakan untuk transaksi cicilan?",
      a: ["Ya. Beberapa kartu kredit menyediakan fasilitas cicilan untuk transaksi tertentu.", "Program cicilan, tenor, bunga, dan biaya administrasi bergantung pada kebijakan bank penerbit serta merchant yang bekerja sama."],
    },
    {
      q: "Bagaimana cara membayar tagihan kartu kredit?",
      a: [
        "Tagihan kartu kredit dapat dibayar melalui berbagai kanal yang disediakan oleh bank penerbit, seperti:",
        ["Mobile banking.", "Internet banking.", "ATM.", "Transfer antarbank.", "Kanal pembayaran lain yang tersedia."],
        "Pengguna disarankan membayar tagihan sebelum tanggal jatuh tempo untuk menghindari denda dan biaya keterlambatan.",
      ],
    },
  ],
};

const kta: FaqCategory = {
  id: "kta",
  title: "Tentang Kredit Tanpa Agunan (KTA)",
  icon: Wallet,
  items: [
    {
      q: "Apa itu Kredit Tanpa Agunan (KTA)?",
      a: [
        "Kredit Tanpa Agunan (KTA) adalah fasilitas pinjaman yang diberikan oleh bank atau lembaga keuangan tanpa mensyaratkan jaminan aset tertentu.",
        "KTA umumnya digunakan untuk kebutuhan pribadi, pendidikan, renovasi rumah, kebutuhan keluarga, atau keperluan lainnya sesuai ketentuan pemberi kredit.",
      ],
    },
    {
      q: "Apa perbedaan KTA dengan Pinjaman Daring (Pindar)?",
      a: [
        "KTA umumnya merupakan produk kredit yang diberikan oleh bank atau lembaga keuangan sesuai dengan izin dan ketentuan yang berlaku.",
        "Sementara itu, Pindar merupakan layanan pendanaan berbasis teknologi informasi yang diselenggarakan oleh perusahaan penyelenggara LPBBTI berizin OJK.",
        "Keduanya dapat memiliki perbedaan dalam proses pengajuan, struktur biaya, tenor, persyaratan, dan mekanisme pembayaran.",
      ],
    },
    {
      q: "Siapa yang dapat mengajukan KTA?",
      a: [
        "Calon peminjam umumnya harus memenuhi persyaratan berikut:",
        [
          "Warga Negara Indonesia.",
          "Memenuhi batas usia yang ditentukan.",
          "Memiliki penghasilan tetap atau sumber penghasilan yang dapat diverifikasi.",
          "Memiliki identitas diri yang valid.",
          "Memiliki rekening bank.",
          "Memenuhi penilaian kelayakan kredit.",
        ],
        "Persyaratan dapat berbeda pada setiap bank atau lembaga keuangan.",
      ],
    },
    {
      q: "Apakah KTA membutuhkan jaminan?",
      a: [
        "KTA merupakan kredit tanpa agunan sehingga umumnya tidak membutuhkan jaminan berupa rumah, kendaraan, atau aset lainnya.",
        "Namun, calon peminjam tetap harus memenuhi persyaratan administrasi dan penilaian kredit dari pemberi pinjaman.",
      ],
    },
    {
      q: "Berapa jumlah pinjaman KTA yang dapat diajukan?",
      a: ["Besaran pinjaman KTA bergantung pada kebijakan bank atau lembaga keuangan.", "Jumlah kredit yang disetujui biasanya mempertimbangkan penghasilan, kemampuan membayar, riwayat kredit, serta profil keuangan calon peminjam."],
    },
    {
      q: "Berapa lama tenor KTA?",
      a: [
        "Tenor KTA dapat berbeda pada setiap produk.",
        "Umumnya, bank atau lembaga keuangan menyediakan pilihan jangka waktu pembayaran sesuai kebijakan masing-masing.",
        "Pengguna sebaiknya memilih tenor yang sesuai dengan kemampuan finansial agar pembayaran cicilan tidak membebani keuangan bulanan.",
      ],
    },
    {
      q: "Apakah KTA memiliki bunga dan biaya administrasi?",
      a: ["Ya. KTA dapat memiliki bunga, biaya administrasi, biaya provisi, atau biaya lainnya sesuai ketentuan produk.", "Seluruh biaya harus diperiksa sebelum pengajuan disetujui."],
    },
    {
      q: "Apakah KTA dapat digunakan untuk kebutuhan usaha?",
      a: [
        "Beberapa produk KTA dapat digunakan untuk kebutuhan pribadi maupun kebutuhan usaha, sepanjang sesuai dengan ketentuan pemberi kredit.",
        "Calon peminjam perlu memastikan tujuan penggunaan dana diperbolehkan oleh bank atau lembaga keuangan yang bersangkutan.",
      ],
    },
  ],
};

const multifinance: FaqCategory = {
  id: "multifinance",
  title: "Tentang Multifinance dan Leaseback BPKB",
  icon: Car,
  items: [
    {
      q: "Apa itu Multifinance?",
      a: [
        "Multifinance atau perusahaan pembiayaan adalah lembaga jasa keuangan yang menyediakan fasilitas pembiayaan untuk berbagai kebutuhan, termasuk pembiayaan kendaraan dan pembiayaan dengan jaminan aset tertentu.",
        "Perusahaan pembiayaan menjalankan kegiatan usaha sesuai dengan izin dan ketentuan yang berlaku.",
      ],
    },
    {
      q: "Apa itu Leaseback BPKB?",
      a: [
        "Leaseback BPKB merupakan skema pembiayaan dengan menggunakan kendaraan yang dimiliki sebagai objek jaminan atau dasar pembiayaan.",
        "Dalam skema ini, pemilik kendaraan dapat memperoleh dana dengan menyerahkan BPKB kepada perusahaan pembiayaan sesuai perjanjian.",
        "Kendaraan umumnya tetap dapat digunakan oleh pemilik selama memenuhi ketentuan perjanjian pembiayaan.",
      ],
    },
    {
      q: "Apa manfaat Leaseback BPKB?",
      a: [
        "Leaseback BPKB dapat menjadi alternatif bagi pemilik kendaraan yang membutuhkan dana dengan memanfaatkan aset kendaraan yang dimiliki.",
        "Manfaat yang dapat diperoleh antara lain:",
        ["Mendapatkan akses pembiayaan dengan jaminan kendaraan.", "Memanfaatkan kendaraan yang dimiliki untuk memperoleh dana.", "Kendaraan umumnya tetap dapat digunakan.", "Pilihan pembiayaan dengan tenor dan skema pembayaran tertentu."],
        "Manfaat dan ketentuan bergantung pada perusahaan pembiayaan.",
      ],
    },
    {
      q: "Kendaraan apa saja yang dapat digunakan untuk Leaseback BPKB?",
      a: [
        "Jenis kendaraan yang dapat dibiayai bergantung pada kebijakan perusahaan pembiayaan.",
        "Umumnya, kendaraan yang dapat dipertimbangkan meliputi:",
        ["Mobil pribadi.", "Mobil niaga.", "Sepeda motor."],
        "Persyaratan usia kendaraan, kondisi kendaraan, kelengkapan dokumen, dan nilai taksiran dapat berbeda pada setiap perusahaan pembiayaan.",
      ],
    },
    {
      q: "Apa saja persyaratan pengajuan Leaseback BPKB?",
      a: [
        "Persyaratan umum dapat meliputi:",
        ["KTP pemohon.", "Kartu Keluarga.", "BPKB kendaraan.", "STNK kendaraan.", "Bukti kepemilikan kendaraan.", "Bukti penghasilan atau dokumen pendukung lainnya."],
        "Perusahaan pembiayaan dapat meminta dokumen tambahan sesuai kebutuhan verifikasi.",
      ],
    },
    {
      q: "Apakah kendaraan tetap dapat digunakan setelah pengajuan Leaseback BPKB?",
      a: ["Pada umumnya, kendaraan tetap dapat digunakan oleh pemilik selama masa pembiayaan.", "Namun, penggunaan kendaraan harus mengikuti ketentuan dalam perjanjian dengan perusahaan pembiayaan."],
    },
    {
      q: "Berapa besar dana yang dapat diperoleh dari Leaseback BPKB?",
      a: [
        "Besaran pembiayaan ditentukan berdasarkan hasil penilaian kendaraan dan kebijakan perusahaan pembiayaan.",
        "Faktor yang dapat memengaruhi jumlah pembiayaan antara lain:",
        ["Merek dan tipe kendaraan.", "Tahun produksi kendaraan.", "Kondisi kendaraan.", "Kelengkapan dokumen.", "Nilai pasar kendaraan.", "Kemampuan membayar pemohon."],
      ],
    },
    {
      q: "Apa yang terjadi jika pembayaran Leaseback BPKB terlambat?",
      a: [
        "Keterlambatan pembayaran dapat menimbulkan denda atau konsekuensi lain sesuai perjanjian pembiayaan.",
        "Apabila terjadi keterlambatan, pemilik kendaraan disarankan segera menghubungi perusahaan pembiayaan untuk membahas penyelesaian kewajiban.",
      ],
    },
  ],
};

const keamanan: FaqCategory = {
  id: "keamanan",
  title: "Tentang Keamanan dan Perlindungan Pengguna",
  icon: ShieldCheck,
  items: [
    {
      q: "Apakah Pindar.id aman digunakan?",
      a: [
        "Pindar.id berkomitmen menyediakan informasi produk keuangan secara transparan dan membantu pengguna menemukan pilihan layanan keuangan yang relevan.",
        "Pengguna tetap disarankan untuk memastikan bahwa penyedia produk yang dipilih memiliki izin yang sesuai dan membaca seluruh ketentuan sebelum melakukan transaksi.",
      ],
    },
    {
      q: "Apakah data pribadi pengguna dilindungi?",
      a: [
        "Pindar.id berkomitmen menjaga kerahasiaan dan keamanan data pribadi pengguna sesuai dengan kebijakan privasi serta ketentuan perlindungan data pribadi yang berlaku.",
        "Pengguna disarankan hanya memberikan data melalui kanal resmi dan tidak membagikan informasi sensitif kepada pihak yang tidak dikenal.",
      ],
    },
    {
      q: "Apakah Pindar.id menjamin pengguna mendapatkan pinjaman?",
      a: ["Tidak. Pindar.id tidak menjamin persetujuan pinjaman, kartu kredit, KTA, atau pembiayaan lainnya.", "Keputusan persetujuan sepenuhnya berada pada bank, penyelenggara Pindar, atau perusahaan pembiayaan yang bersangkutan."],
    },
    {
      q: "Apa yang harus diperhatikan sebelum mengajukan produk keuangan?",
      a: [
        "Sebelum mengajukan produk keuangan, pengguna disarankan untuk:",
        [
          "Memastikan penyedia layanan memiliki izin yang sesuai.",
          "Membaca syarat dan ketentuan produk.",
          "Memahami bunga dan seluruh biaya.",
          "Memeriksa tenor dan jadwal pembayaran.",
          "Memastikan kemampuan membayar.",
          "Menghindari pengajuan pinjaman untuk menutup pinjaman lain secara berulang.",
        ],
        "Gunakan produk keuangan secara bijak dan sesuai kebutuhan.",
      ],
    },
  ],
};

/** Semua kategori, berurutan seperti di halaman FAQ lengkap. */
export const faqCategories: FaqCategory[] = [umum, pindar, kartuKredit, kta, multifinance, keamanan];

/* ================================================================== */
/* Komponen dasar                                                      */
/* ================================================================== */

interface FaqCardProps {
  /** Tampilkan judul + ikon di atas daftar pertanyaan (default: true). */
  showTitle?: boolean;
  /** Class tambahan untuk wrapper kartu, mis. "mt-10". */
  className?: string;
}

const FaqBlocks = ({ blocks }: { blocks: Block[] }) => (
  <div className="space-y-4">
    {blocks.map((block, i) =>
      typeof block === "string" ? (
        <p key={i} className="text-gray-700 leading-relaxed text-sm md:text-base">
          {block}
        </p>
      ) : (
        <div key={i} className="space-y-3">
          {block.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                <CircleCheck className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">{item}</p>
            </div>
          ))}
        </div>
      )
    )}
  </div>
);

const FaqCategoryCard = ({ category, showTitle = true, className = "" }: FaqCardProps & { category: FaqCategory }) => {
  const [open, setOpen] = useState<number | null>(null);
  const Icon = category.icon;

  return (
    <section id={`faq-${category.id}`} className={`bg-white border border-gray-100 rounded-[2rem] shadow-lg p-6 lg:p-8 ${className}`}>
      {showTitle && (
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
            <Icon className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-xl md:text-2xl font-black text-gray-800">{category.title}</h3>
        </div>
      )}

      <div className="space-y-3">
        {category.items.map((item, index) => {
          const isOpen = open === index;
          const panelId = `faq-${category.id}-${index}`;

          return (
            <div key={item.q} className={`rounded-2xl border transition-colors ${isOpen ? "border-red-200 bg-red-50/40" : "border-gray-100 bg-white"}`}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
                <span className="text-sm md:text-base font-bold text-gray-800">
                  {index + 1}. {item.q}
                </span>
                <ChevronDown className={`w-5 h-5 shrink-0 text-red-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {isOpen && (
                <div id={panelId} className="px-5 pb-5">
                  <FaqBlocks blocks={item.a} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

/* ================================================================== */
/* Komponen per kategori — import yang dibutuhkan saja                 */
/* ================================================================== */

export const FaqUmum = (props: FaqCardProps) => <FaqCategoryCard category={umum} {...props} />;
export const FaqPindar = (props: FaqCardProps) => <FaqCategoryCard category={pindar} {...props} />;
export const FaqKartuKredit = (props: FaqCardProps) => <FaqCategoryCard category={kartuKredit} {...props} />;
export const FaqKta = (props: FaqCardProps) => <FaqCategoryCard category={kta} {...props} />;
export const FaqMultifinance = (props: FaqCardProps) => <FaqCategoryCard category={multifinance} {...props} />;
export const FaqKeamanan = (props: FaqCardProps) => <FaqCategoryCard category={keamanan} {...props} />;

/* ================================================================== */
/* Halaman FAQ lengkap (semua kategori)                                */
/* ================================================================== */

const FAQ = () => {
  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
          <CircleHelp className="w-6 h-6 text-red-500" />
        </div>

        <div>
          <h2 className="text-xl md:text-3xl font-black text-gray-800">FAQ – Pertanyaan yang Sering Diajukan</h2>
          <p className="mt-2 text-gray-500 text-xs md:text-base">Seputar layanan dan produk di Pindar.id</p>
        </div>
      </div>

      {/* INTRO */}
      <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 rounded-[2rem] p-6 lg:p-8 mb-8">
        <p className="text-gray-700 leading-relaxed text-sm md:text-base">Selamat datang di Pindar.id.</p>

        <p className="mt-4 text-gray-700 leading-relaxed text-sm md:text-base">Pindar.id adalah platform agregasi fintech yang menyediakan informasi dan membantu masyarakat menemukan berbagai pilihan produk keuangan sesuai kebutuhan.</p>

        <p className="mt-4 text-gray-700 leading-relaxed text-sm md:text-base">
          Kami menghadirkan informasi mengenai empat kategori produk utama, yaitu Pinjaman Daring (Pindar), Kartu Kredit, Kredit Tanpa Agunan (KTA), serta Multifinance atau Leaseback BPKB.
        </p>

        <p className="mt-4 text-gray-700 leading-relaxed font-semibold text-sm md:text-base">Berikut adalah beberapa pertanyaan yang sering diajukan mengenai layanan dan produk yang tersedia di Pindar.id.</p>
      </div>

      {/* CONTENT */}
      <div className="space-y-6">
        {faqCategories.map((category) => (
          <FaqCategoryCard key={category.id} category={category} />
        ))}
      </div>

      {/* PENUTUP */}
      <div className="mt-8 bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 rounded-[2rem] p-6 lg:p-8 text-center">
        <h3 className="text-lg md:text-xl font-black text-gray-800">Pindar.id – Temukan Pilihan Keuangan yang Tepat</h3>
        <p className="mt-3 text-gray-700 leading-relaxed text-sm md:text-base">Pindar.id hadir untuk membantu masyarakat mendapatkan informasi mengenai berbagai produk keuangan dalam satu platform.</p>
        <p className="mt-3 text-gray-700 leading-relaxed text-sm md:text-base">Kami percaya bahwa akses terhadap informasi keuangan yang tepat dapat membantu masyarakat membuat keputusan yang lebih baik.</p>
        <p className="mt-3 text-gray-700 leading-relaxed font-semibold text-sm md:text-base">Pindar.id – Temukan, Bandingkan, dan Pilih Solusi Keuangan Anda.</p>
      </div>
    </div>
  );
};

export default FAQ;
