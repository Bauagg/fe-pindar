// src/LandingPage/Pages/Multifinance/multifinanceApi.ts

import { API_URL } from "../../../Admin/config"; // sesuaikan path kalau beda

export type TipePemohon = "" | "Individu" | "Perusahaan";
export type Layanan = "" | "Jaminkan BPKB" | "Jaminkan SHM" | "Beli Kendaraan (Second)" | "Take Over Kendaraan";
export type Jenis = "" | "Mobil" | "Motor";
export type Kepemilikan = "" | "Sendiri" | "Orang Lain";
export type Transmisi = "" | "Matic" | "Manual";
export type StatusPembiayaan = "" | "BPKB On Hand" | "Take Over";

export interface FormState {
  nama: string;
  telepon: string;
  usia: string;
  alamat: string;
  tipe_pemohon: TipePemohon;
  layanan: Layanan;
  kepemilikan: Kepemilikan; // BPKB atas nama (kendaraan) / SHM atas nama (SHM)
  // Khusus SHM
  jenis_surat: string;
  // Khusus kendaraan
  jenis: Jenis;
  merek: string;
  tipe: string;
  tahun: string;
  transmisi: Transmisi;
  status_pembiayaan: StatusPembiayaan;
  leasing_asal: string;
}

export type ApplicationInput = FormState;

const SERVICE_MAP: Record<string, string> = {
  "Jaminkan BPKB": "jaminkan_bpkb",
  "Jaminkan SHM": "jaminkan_shm",
  "Beli Kendaraan (Second)": "beli_kendaraan_second",
  "Take Over Kendaraan": "take_over",
};

const APPLICANT_MAP: Record<string, string> = {
  Individu: "individu",
  Perusahaan: "perusahaan",
};

const OWNERSHIP_MAP: Record<string, string> = {
  Sendiri: "sendiri",
  "Orang Lain": "orang_lain",
};

const FINANCING_MAP: Record<string, string> = {
  "BPKB On Hand": "bpkb_on_hand",
  "Take Over": "take_over",
};

/** +62 812-3456-7890 / 62812... / 0812... -> 081234567890 (format lokal, tanpa spasi). */
export const normalizePhone = (phone: string): string => phone.replace(/[\s-]/g, "").replace(/^(\+62|62)/, "0");

export interface ApplicationResult {
  applicationNumber: string;
  accessToken: string;
}

/** Ubah state form menjadi payload sesuai kolom BE. Field yang tidak relevan dikirim null. */
export const toPayload = (f: FormState) => {
  const isShm = f.layanan === "Jaminkan SHM";
  const isTakeOver = !isShm && f.status_pembiayaan === "Take Over";

  return {
    applicant_name: f.nama.trim(),
    applicant_phone: normalizePhone(f.telepon),
    applicant_age: Number(f.usia),
    applicant_address: f.alamat.trim(),
    applicant_type: APPLICANT_MAP[f.tipe_pemohon],

    service_type: SERVICE_MAP[f.layanan],
    asset_ownership: OWNERSHIP_MAP[f.kepemilikan],

    certificate_type: isShm ? f.jenis_surat.trim() : null,

    vehicle_type: isShm ? null : f.jenis.toLowerCase(), // mobil | motor
    vehicle_brand: isShm ? null : f.merek.trim(),
    vehicle_model: isShm ? null : f.tipe.trim(),
    vehicle_year: isShm ? null : Number(f.tahun),
    transmission: isShm ? null : f.transmisi.toLowerCase(), // matic | manual
    financing_status: isShm ? null : FINANCING_MAP[f.status_pembiayaan],
    previous_leasing: isTakeOver ? f.leasing_asal.trim() : null,
  };
};

/** Ambil pesan error pertama dari response validasi Laravel (422), kalau ada. */
const firstValidationError = (data: any): string | null => {
  const errors = data?.errors;
  if (!errors || typeof errors !== "object") return null;
  const first = Object.values(errors)[0];
  return Array.isArray(first) && first[0] ? String(first[0]) : null;
};

/** Kirim pengajuan (tanpa login). Melempar Error dengan pesan yang ramah untuk user. */
export async function submitApplication(input: ApplicationInput): Promise<ApplicationResult> {
  let res: Response;

  try {
    res = await fetch(`${API_URL}/multifinance`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(toPayload(input)),
    });
  } catch {
    throw new Error("Tidak bisa terhubung ke server. Periksa koneksi internet kamu lalu coba lagi.");
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 422) {
      throw new Error(firstValidationError(data) ?? "Ada data yang belum sesuai. Periksa lagi data yang kamu isi.");
    }
    if (res.status === 429) throw new Error("Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.");
    throw new Error(data?.message || "Pengajuan gagal dikirim. Coba lagi beberapa saat lagi.");
  }

  return {
    applicationNumber: data.data.application_number,
    accessToken: data.access_token,
  };
}
