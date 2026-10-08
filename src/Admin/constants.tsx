import type { FieldType, StatusKey } from "./types";

export const STATUS: Record<StatusKey, { label: string; dot: string; badge: string }> = {
  pending: { label: "Pending", dot: "bg-amber-500", badge: "bg-amber-50 text-amber-700 ring-amber-200" },
  on_progress: { label: "On progress", dot: "bg-sky-500", badge: "bg-sky-50 text-sky-700 ring-sky-200" },
  approved: { label: "Approved", dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  rejected: { label: "Rejected", dot: "bg-red-500", badge: "bg-red-50 text-red-700 ring-red-200" },
};

export const SERVICES: Record<string, string> = {
  jaminkan_bpkb: "Jaminkan BPKB",
  beli_kendaraan_second: "Beli Kendaraan (Second)",
  take_over: "Take Over Kendaraan",
};

export const FIELD_TYPES: Record<FieldType, string> = {
  text: "Teks singkat",
  textarea: "Teks panjang",
  number: "Angka",
  date: "Tanggal",
  file: "File / foto",
};
