// types/dummyPayLater.ts

export interface PayLater {
  id: string;
  nama: string;
  publisher: string;
  deskripsi: string;
  limit: string;
  bunga: string;
  tenor: string;
  biayaLayanan: string;
  denda: string;
  keunggulan: string[];
  dokumenDibutuhkan: string[];
  imageLink: string;
}

// Angka bersifat indikatif (limit, bunga, dan promo bisa berubah). Selalu cek aplikasi/situs resmi penyedia.
export const dummyPayLater: PayLater[] = [
  {
    id: "1",
    nama: "SPayLater",
    publisher: "Shopee",
    deskripsi: "Layanan bayar nanti dan cicilan di Shopee. Aktivasi digital cukup dengan KTP, bisa dipakai belanja online maupun bayar di merchant QRIS.",
    limit: "Hingga Rp62 juta",
    bunga: "0% (1 bulan), mulai 1,95% per bulan untuk cicilan",
    tenor: "1, 3, 6, 12 hingga 24 bulan",
    biayaLayanan: "Biaya penanganan sekitar 1% per transaksi",
    denda: "Denda keterlambatan dan dapat memengaruhi skor SLIK OJK",
    keunggulan: ["Bayar nanti 1 bulan tanpa bunga", "Aktivasi cepat dengan KTP", "Bisa dipakai di merchant QRIS", "Promo dan voucher untuk pengguna tertentu"],
    dokumenDibutuhkan: ["KTP Aktif", "Akun Shopee Terverifikasi", "Nomor HP Aktif", "Selfie Verifikasi"],
    imageLink: "/images/paylater/img1.png",
  },
  {
    id: "2",
    nama: "GoPayLater",
    publisher: "Gojek",
    deskripsi: "Fasilitas bayar nanti dan cicilan di ekosistem Gojek dan GoPay, cocok untuk transportasi, makanan, dan transaksi harian.",
    limit: "Awal menyesuaikan profil, naik seiring riwayat bayar",
    bunga: "0% (bayar bulan depan, periode tertentu), cicilan mulai sekitar 2% per bulan",
    tenor: "1, 3, 6, hingga 12 bulan",
    biayaLayanan: "Bervariasi sesuai tenor dan transaksi",
    denda: "Denda keterlambatan sesuai ketentuan aplikasi",
    keunggulan: ["Terintegrasi dengan Gojek dan GoPay", "Bayar bulan depan tanpa bunga", "Limit bisa naik seiring riwayat pembayaran", "Bisa dipakai di merchant mitra"],
    dokumenDibutuhkan: ["KTP Aktif", "Akun Gojek Terverifikasi (GoPay Plus)", "Nomor HP Aktif", "Selfie Verifikasi"],
    imageLink: "/images/paylater/img2.png",
  },
  {
    id: "3",
    nama: "Kredivo",
    publisher: "PT FinAccel Digital Indonesia",
    deskripsi: "Paylater dengan limit besar untuk belanja online maupun offline, populer untuk membeli elektronik dan kebutuhan mendesak.",
    limit: "Hingga Rp30 juta",
    bunga: "0% (30 hari), cicilan mulai 2,6% per bulan",
    tenor: "30 hari, hingga 12 bulan",
    biayaLayanan: "Biaya admin sesuai tenor dan transaksi",
    denda: "Denda keterlambatan sesuai ketentuan aplikasi",
    keunggulan: ["Bayar 30 hari tanpa bunga", "Limit besar hingga Rp30 juta", "Tersedia di banyak merchant online dan offline", "Limit bisa naik dengan riwayat pembayaran baik"],
    dokumenDibutuhkan: ["KTP Aktif", "Selfie dengan KTP", "Data Pekerjaan dan Penghasilan", "Nomor HP dan Email Aktif"],
    imageLink: "/images/paylater/img3.png",
  },
  {
    id: "4",
    nama: "Akulaku PayLater",
    publisher: "PT Akulaku Finance Indonesia",
    deskripsi: "Cicilan tanpa kartu kredit untuk gadget, elektronik, dan kebutuhan lain, tersedia di aplikasi Akulaku dan banyak marketplace.",
    limit: "Hingga Rp25 juta",
    bunga: "Mulai sekitar 1,75% per bulan, tergantung tenor dan promo",
    tenor: "1 hingga 12 bulan",
    biayaLayanan: "Biaya admin dan layanan sesuai tenor",
    denda: "Denda keterlambatan sesuai ketentuan aplikasi",
    keunggulan: ["Populer untuk cicilan gadget dan elektronik", "Tersedia di banyak marketplace", "Pilihan tenor fleksibel", "Tersedia opsi syariah"],
    dokumenDibutuhkan: ["KTP Aktif", "Selfie dengan KTP", "Data Pekerjaan", "Nomor HP Aktif"],
    imageLink: "/images/paylater/img4.png",
  },
];
