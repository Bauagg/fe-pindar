// Components/KPR/kprBanks.ts
// Data bank rekanan KPR. Dipakai halaman KPR, kalkulator, dan nanti halaman form.
// Logo ditaruh di folder public/images/bank/ (sesuaikan nama file dengan yang kamu punya).

export interface KprBank {
  id: string;
  name: string;
  logo: string;
}

export const kprBanks: KprBank[] = [
  { id: "btn", name: "Bank BTN", logo: "/images/bank/btn.png" },
  { id: "mandiri", name: "Bank Mandiri", logo: "/images/bank/mandiri.png" },
  { id: "bca", name: "Bank BCA", logo: "/images/bank/bca.png" },
  { id: "bri", name: "Bank BRI", logo: "/images/bank/bri.png" },
  { id: "bni", name: "Bank BNI", logo: "/images/bank/bni.png" },
  { id: "cimb", name: "Bank CIMB", logo: "/images/bank/cimb.png" },
];
