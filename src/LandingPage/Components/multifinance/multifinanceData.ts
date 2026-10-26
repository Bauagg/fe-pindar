export interface MultifinancePackage {
  name: string;
  /** rate per tenor (%), urutan sesuai field `tenors` */
  rates: (number | null)[];
}

export interface Multifinance {
  id: string;
  name: string;
  image: string;
  tenors: number[]; // dalam bulan
  basedOn: "Pencairan" | "OTR";
  packages: MultifinancePackage[];
}

const IMG = "/images/multifinance"; // letakkan gambar di public/images/multifinance/

export const multifinanceList: Multifinance[] = [
  {
    id: "adira",
    name: "Adira Finance",
    image: `${IMG}/adira.png`,
    tenors: [12, 24, 36, 48],
    basedOn: "Pencairan",
    packages: [
      { name: "Reguler ARK", rates: [3.0, 5.91, 8.84, 9.78] },
      { name: "Reguler Mixed", rates: [0.81, 4.49, 7.58, 7.98] },
      { name: "Reguler TLO", rates: [2.3, 4.22, 6.06, 7.28] },
    ],
  },
  {
    id: "bfi",
    name: "BFI Finance",
    image: `${IMG}/bfi.png`,
    tenors: [12, 24, 36, 48],
    basedOn: "Pencairan",
    packages: [
      { name: "Bonbasts", rates: [5.0, 7.0, 8.0, 9.0] },
      { name: "Standard", rates: [4.5, 6.0, 6.5, 7.0] },
      { name: "Superdeal", rates: [4.0, 4.5, 4.5, null] },
      { name: "Takeover", rates: [4.0, 5.0, 5.5, 4.5] },
    ],
  },
  {
    id: "sinarmas",
    name: "Sinarmas Multifinance",
    image: `${IMG}/sinarmas.png`,
    tenors: [12, 24, 36, 48],
    basedOn: "Pencairan",
    packages: [
      { name: "Super VIP", rates: [null, 8.75, 10.5, 10.25] },
      { name: "VIP", rates: [null, 8.0, 9.5, 10.0] },
      { name: "Premium", rates: [null, 7.0, 8.5, 10.0] },
      { name: "Standard", rates: [4.5, 5.0, 7.0, 8.0] },
      { name: "Hemat", rates: [3.5, 4.0, 5.5, 6.0] },
    ],
  },
  {
    id: "taf",
    name: "TAF (Toyota Astra Financial)",
    image: `${IMG}/taf.png`,
    tenors: [12, 24, 36, 48],
    basedOn: "Pencairan",
    packages: [
      { name: "Reguler", rates: [5.0, 6.0, 7.25, 7.25] },
      { name: "Deviasi Rate -1%", rates: [3.5, 5.0, 6.25, 6.25] },
      { name: "Deviasi Rate -2%", rates: [1.5, 3.0, 3.75, 3.75] },
    ],
  },
  {
    id: "sms-finance",
    name: "SMS Finance",
    image: `${IMG}/sms.png`,
    tenors: [12, 24, 36, 48],
    basedOn: "Pencairan",
    packages: [
      { name: "Diamond", rates: [null, 3.0, 5.0, 7.0] },
      { name: "Platinum", rates: [null, 2.25, 4.0, 5.0] },
      { name: "Reguler", rates: [null, 2.25, 4.0, 5.0] },
    ],
  },

  {
    id: "genie",
    name: "Genie",
    image: `${IMG}/genie.png`,
    tenors: [12, 24, 36],
    basedOn: "Pencairan",
    packages: [{ name: "Reguler", rates: [0.5, 1.0, 1.5] }],
  },

  {
    id: "wom",
    name: "WOM Finance",
    image: `${IMG}/wom.png`,
    tenors: [12, 24, 36, 48],
    basedOn: "OTR",
    packages: [
      { name: "Bombardir", rates: [5.0, 7.75, 9.25, 9.5] },
      { name: "Extra 2", rates: [4.5, 6.25, 6.25, 6.25] },
      { name: "Special", rates: [4.0, 5.0, 5.0, 5.0] },
    ],
  },
  {
    id: "mandiri-utama",
    name: "Mandiri Utama Finance",
    image: `${IMG}/mandiriutama.png`,
    tenors: [12, 24, 36, 48],
    basedOn: "OTR",
    packages: [
      { name: "Super Fantastis", rates: [2.5, 5.75, 8.0, 8.5] },
      { name: "Fantastis", rates: [2.5, 5.0, 7.25, 7.75] },
      { name: "Fantastis -1%", rates: [2.5, 3.75, 5.5, 6.0] },
      { name: "Fantastis -2%", rates: [2.5, 3.5, 3.5, 4.5] },
    ],
  },
  {
    id: "mega",
    name: "Mega Finance",
    image: `${IMG}/mega.png`,
    tenors: [12, 24, 36, 48],
    basedOn: "OTR",
    packages: [
      { name: "Super", rates: [6.0, 8.0, 9.5, 10.0] },
      { name: "Boom", rates: [5.0, 7.25, 8.25, 9.25] },
      { name: "Extra", rates: [3.5, 5.25, 7.25, 8.0] },
      { name: "Hit", rates: [3.0, 4.0, 4.5, 4.25] },
      { name: "Prio 1", rates: [2.5, 4.0, 4.75, 4.5] },
      { name: "Prio 2", rates: [2.0, 3.0, 3.25, 3.5] },
      { name: "Prio 3", rates: [2.0, 2.5, 2.5, 3.0] },
    ],
  },
  {
    id: "cimb-niaga",
    name: "CIMB Niaga Finance",
    image: `${IMG}/cimb.png`,
    tenors: [12, 24, 36, 48],
    basedOn: "OTR",
    packages: [
      { name: "Platinum", rates: [4.0, 6.5, 8.0, 9.0] },
      { name: "Gold", rates: [3.0, 5.0, 6.0, 7.0] },
      { name: "Silver", rates: [3.0, 4.0, 4.25, 5.0] },
    ],
  },
  {
    id: "mnc-finance",
    name: "MNC Finance",
    image: `${IMG}/mnc.png`,
    tenors: [12, 24, 36, 48],
    basedOn: "OTR",
    packages: [
      { name: "Kombes", rates: [4.0, 6.5, 7.5, 8.0] },
      { name: "Standard", rates: [4.0, 5.0, 5.5, 6.0] },
      { name: "Akpol", rates: [2.0, 3.0, 3.0, 3.5] },
    ],
  },
  {
    id: "mandiri-tunas",
    name: "Mandiri Tunas Finance",
    image: `${IMG}/mandiritunas.png`,
    tenors: [12, 24, 36, 48],
    basedOn: "OTR",
    packages: [
      { name: "Superdeal", rates: [3.0, 3.5, 3.5, 4.0] },
      { name: "Standard", rates: [2.0, 2.5, 3.0, 3.5] },
      { name: "Special", rates: [2.0, 2.5, 3.0, 3.5] },
    ],
  },
  {
    id: "sis",
    name: "SIS",
    image: `${IMG}/sis.png`,
    tenors: [12, 24, 36],
    basedOn: "Pencairan",
    packages: [
      { name: "BRE - J", rates: [6.0, 8.0, 10.0] },
      { name: "MAY - J", rates: [null, 4.0, 5.0] },
      { name: "LET - J", rates: [null, 1.0, 2.0] },
    ],
  },
];
