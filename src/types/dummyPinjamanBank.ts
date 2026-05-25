export interface PinjamanBank {
  id: string;
  namaBank: string;
  publisher: string;
  detailPinjaman: string;
  dokumenDibutuhkan: string[];
  imageLink: string;
}

export const dummyPinjamanBank: PinjamanBank[] = [
  {
    id: "1",
    namaBank: "Bank Mandiri",
    publisher: "Mandiri KSM",
    detailPinjaman: "Pinjaman tanpa agunan untuk karyawan dengan proses cepat dan tenor fleksibel.",
    dokumenDibutuhkan: ["KTP", "NPWP", "Slip Gaji", "Rekening Koran"],
    imageLink: "/images/bank/mandiri.png",
  },
  {
    id: "2",
    namaBank: "Bank BCA",
    publisher: "BCA Personal Loan",
    detailPinjaman: "Fasilitas pinjaman pribadi untuk kebutuhan konsumtif dengan cicilan tetap.",
    dokumenDibutuhkan: ["KTP", "NPWP", "Slip Gaji", "Kartu Keluarga"],
    imageLink: "/images/bank/bca.png",
  },
  {
    id: "3",
    namaBank: "Bank BRI",
    publisher: "BRIguna",
    detailPinjaman: "Pinjaman multiguna untuk pegawai aktif maupun pensiunan dengan tenor panjang.",
    dokumenDibutuhkan: ["KTP", "SK Pengangkatan", "Slip Gaji", "Buku Tabungan"],
    imageLink: "/images/bank/bri.png",
  },
  {
    id: "4",
    namaBank: "Bank BNI",
    publisher: "BNI Fleksi",
    detailPinjaman: "Kredit tanpa agunan untuk pegawai payroll BNI dengan bunga kompetitif.",
    dokumenDibutuhkan: ["KTP", "NPWP", "Slip Gaji", "Surat Keterangan Kerja"],
    imageLink: "/images/bank/bni.png",
  },
  {
    id: "5",
    namaBank: "CIMB Niaga",
    publisher: "X-Tra Dana",
    detailPinjaman: "Pinjaman dana tunai untuk berbagai kebutuhan dengan pengajuan praktis.",
    dokumenDibutuhkan: ["KTP", "NPWP", "Slip Gaji", "Rekening Koran 3 Bulan"],
    imageLink: "/images/bank/cimb.png",
  },
];
