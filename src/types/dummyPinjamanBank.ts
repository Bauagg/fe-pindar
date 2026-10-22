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
    namaBank: "Bank Mayapada",
    publisher: "myDANA Cepat",
    detailPinjaman: "Kredit Tanpa Agunan (KTA) fleksibel untuk berbagai kebutuhan finansial pribadi.",
    dokumenDibutuhkan: ["KTP", "NPWP", "Slip Gaji", "Rekening Koran 3 Bulan"],
    imageLink: "/images/bank/mayapada.png",
  },
  {
    id: "2",
    namaBank: "CTBC",
    publisher: "KTA Dana Cinta",
    detailPinjaman: "Pinjaman KTA dengan pencairan cepat dan bunga kompetitif untuk nasabah individu.",
    dokumenDibutuhkan: ["KTP", "NPWP", "Slip Gaji", "Kartu Kredit / Rekening Koran"],
    imageLink: "/images/bank/ctbc.png",
  },
  {
    id: "3",
    namaBank: "Bank Mandiri",
    publisher: "Mandiri KSM",
    detailPinjaman: "Pinjaman tanpa agunan untuk karyawan dengan proses cepat dan tenor fleksibel.",
    dokumenDibutuhkan: ["KTP", "NPWP", "Slip Gaji", "Rekening Koran"],
    imageLink: "/images/bank/mandiri.png",
  },
  {
    id: "4",
    namaBank: "Bank BCA",
    publisher: "BCA Personal Loan",
    detailPinjaman: "Fasilitas pinjaman pribadi untuk kebutuhan konsumtif dengan cicilan tetap.",
    dokumenDibutuhkan: ["KTP", "NPWP", "Slip Gaji", "Kartu Keluarga"],
    imageLink: "/images/bank/bca.png",
  },
  {
    id: "5",
    namaBank: "Bank BRI",
    publisher: "BRIguna",
    detailPinjaman: "Pinjaman multiguna untuk pegawai aktif maupun pensiunan dengan tenor panjang.",
    dokumenDibutuhkan: ["KTP", "SK Pengangkatan", "Slip Gaji", "Buku Tabungan"],
    imageLink: "/images/bank/bri.png",
  },
  {
    id: "6",
    namaBank: "Bank BNI",
    publisher: "BNI Fleksi",
    detailPinjaman: "Kredit tanpa agunan untuk pegawai payroll BNI dengan bunga kompetitif.",
    dokumenDibutuhkan: ["KTP", "NPWP", "Slip Gaji", "Surat Keterangan Kerja"],
    imageLink: "/images/bank/bni.png",
  },
  {
    id: "7",
    namaBank: "CIMB Niaga",
    publisher: "X-Tra Dana",
    detailPinjaman: "Pinjaman dana tunai untuk berbagai kebutuhan dengan pengajuan praktis.",
    dokumenDibutuhkan: ["KTP", "NPWP", "Slip Gaji", "Rekening Koran 3 Bulan"],
    imageLink: "/images/bank/cimb.png",
  },
];
