// Letakkan di folder yang sama dengan form-multifinance.tsx
// src/LandingPage/Pages/Multifinance/multifinance-api.ts

import { API_URL } from "../../../Admin/config"; // sesuaikan path kalau beda

export interface ApplicationInput {
  nama: string;
  telepon: string;
  layanan: string;
  jenis: string;
  merek: string;
  tipe: string;
  tahun: string;
}

const SERVICE_MAP: Record<string, string> = {
  "Jaminkan BPKB": "jaminkan_bpkb",
  "Beli Kendaraan (Second)": "beli_kendaraan_second",
  "Take Over Kendaraan": "take_over",
};

/** +62 812-3456-7890 / 62812... / 0812... -> 081234567890 (format lokal, tanpa spasi). */
export const normalizePhone = (phone: string): string => phone.replace(/[\s-]/g, "").replace(/^(\+62|62)/, "0");

export interface ApplicationResult {
  applicationNumber: string;
  accessToken: string;
}

/** Kirim pengajuan (tanpa login). Melempar Error dengan pesan yang ramah untuk user. */
export async function submitApplication(input: ApplicationInput): Promise<ApplicationResult> {
  let res: Response;

  try {
    res = await fetch(`${API_URL}/multifinance`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        applicant_name: input.nama.trim(),
        applicant_phone: normalizePhone(input.telepon),
        service_type: SERVICE_MAP[input.layanan],
        vehicle_type: input.jenis.toLowerCase(),
        vehicle_brand: input.merek.trim(),
        vehicle_model: input.tipe.trim(),
        vehicle_year: Number(input.tahun),
      }),
    });
  } catch {
    throw new Error("Tidak bisa terhubung ke server. Periksa koneksi internet kamu lalu coba lagi.");
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 422) throw new Error("Ada data yang belum sesuai. Periksa lagi nama, nomor telepon, dan data kendaraan.");
    if (res.status === 429) throw new Error("Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.");
    throw new Error(data?.message || "Pengajuan gagal dikirim. Coba lagi beberapa saat lagi.");
  }

  return {
    applicationNumber: data.data.application_number,
    accessToken: data.access_token,
  };
}
