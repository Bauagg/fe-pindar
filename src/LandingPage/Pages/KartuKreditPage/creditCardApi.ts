// pages/creditCardApi.ts

import { API_URL } from "../../../Admin/config"; // sama seperti multifinanceApi.ts, sesuaikan path

export type FormState = {
  applicant_name: string;
  applicant_phone: string;
  birth_place: string;
  birth_date: string; // Y-m-d
  applicant_address: string;
  card_name: string;
};

export type ApplicationResult = {
  applicationNumber: string;
  accessToken: string;
};

/** Ambil pesan error pertama dari response validasi Laravel (422), kalau ada. */
const firstValidationError = (data: any): string | null => {
  const errors = data?.errors;
  if (!errors || typeof errors !== "object") return null;
  const first = Object.values(errors)[0];
  return Array.isArray(first) && first[0] ? String(first[0]) : null;
};

/** Error dengan detail dari BE (status + errors per field), supaya UI bisa mengenali nomor telepon yang sudah terdaftar. */
const apiError = (message: string, status: number, errors?: Record<string, string[]>) => Object.assign(new Error(message), { status, errors });

/** Kirim pengajuan (tanpa login). */
export async function submitApplication(input: FormState): Promise<ApplicationResult> {
  let res: Response;

  try {
    res = await fetch(`${API_URL}/creditcard`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    throw new Error("Tidak bisa terhubung ke server. Periksa koneksi internet kamu lalu coba lagi.");
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 422) {
      throw apiError(firstValidationError(data) ?? "Ada data yang belum sesuai. Periksa lagi data yang kamu isi.", 422, data?.errors);
    }
    if (res.status === 429) throw new Error("Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.");
    throw new Error(data?.message || "Pengajuan gagal dikirim. Coba lagi beberapa saat lagi.");
  }

  return {
    applicationNumber: data.data.application_number,
    accessToken: data.access_token,
  };
}

/**
 * Upload dokumen pemohon (tanpa login, pakai access token dari submitApplication).
 * Key pada `files` = `name` field di BE, mis. { foto_ktp_customer: File }.
 * Satu file per request supaya tidak kena batas post_max_size dan mudah di-retry.
 */
export async function uploadFormValues(token: string, files: Record<string, File>): Promise<void> {
  const body = new FormData();
  Object.entries(files).forEach(([name, file]) => body.append(name, file));

  let res: Response;

  try {
    // Jangan set Content-Type manual, biar browser mengisi boundary multipart.
    res = await fetch(`${API_URL}/creditcard/${token}/form-values`, {
      method: "POST",
      headers: { Accept: "application/json" },
      body,
    });
  } catch {
    throw new Error("Koneksi terputus saat mengunggah. Periksa internet kamu lalu coba lagi.");
  }

  if (res.ok) return;

  const data = await res.json().catch(() => null);

  if (res.status === 413) throw new Error("Ukuran file terlalu besar untuk server. Coba foto dengan ukuran lebih kecil.");
  if (res.status === 429) throw new Error("Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.");

  if (res.status === 422) {
    const raw = firstValidationError(data) ?? data?.message ?? "";
    console.error("Upload 422:", data);

    let msg = raw;
    if (/failed to upload/i.test(raw)) msg = "File terlalu besar untuk server. Coba foto dengan ukuran lebih kecil.";
    else if (/must be a file of type|mimes/i.test(raw)) msg = "Format file harus JPG, PNG, atau PDF.";
    else if (/may not be greater than|max/i.test(raw)) msg = "Ukuran file terlalu besar.";
    else if (/belum ada form tambahan/i.test(raw)) msg = "Dokumen belum bisa diunggah saat ini. Kamu bisa kirim lewat WhatsApp admin.";

    throw apiError(msg || "File tidak valid. Gunakan JPG, PNG, atau PDF.", 422, data?.errors);
  }

  throw new Error(data?.message || "Gagal mengunggah dokumen. Coba lagi.");
}
