import { SERVICES } from "../Admin/constants";

/* ------------------------------------------------------------------ */
/* Tipe                                                                */
/* ------------------------------------------------------------------ */

export type RoleLite = { id: number; name: string; slug: string };

export type DisbursementApp = {
  id: number;
  application_number: string;
  applicant_name: string;
  applicant_phone?: string | null;
  service_type: string;
  status: string;
  roles?: RoleLite[];
};

export type Disbursement = {
  id: number;
  application_id: number;
  disbursement_date: string;
  amount: number | string;
  description: string | null;
  created_by: number | null;
  created_at?: string;
  updated_at?: string;
  application?: DisbursementApp | null;
  creator?: { id: number; name: string } | null;
};

export type ApprovedApplication = {
  id: number;
  application_number: string;
  applicant_name: string;
  applicant_phone?: string | null;
  service_type: string;
  status: string;
  roles?: RoleLite[];
  total_disbursed: number;
};

export type Paged<T> = {
  data: T[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
};

/* ------------------------------------------------------------------ */
/* Format                                                              */
/* ------------------------------------------------------------------ */

const idr = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

/** 1500000 -> "Rp 1.500.000" */
export const rupiah = (n: number | string | null | undefined) => idr.format(Number(n) || 0);

/** 1250000 -> "1,3 jt" (untuk label sumbu grafik) */
export const rupiahCompact = (n: number) => {
  const abs = Math.abs(n);
  const f = (v: number, s: string) => `${v.toLocaleString("id-ID", { maximumFractionDigits: 1 })} ${s}`;

  if (abs >= 1e12) return f(n / 1e12, "T");
  if (abs >= 1e9) return f(n / 1e9, "M");
  if (abs >= 1e6) return f(n / 1e6, "jt");
  if (abs >= 1e3) return f(n / 1e3, "rb");
  return String(Math.round(n));
};

export const num = (n: number) => n.toLocaleString("id-ID");

/** "2026-11-13T00:00:00.000000Z" -> "2026-11-13" */
export const dateOnly = (d?: string | null) => (d ? d.slice(0, 10) : "");

/** Tanggal hari ini (zona waktu perangkat) format YYYY-MM-DD, untuk <input type="date"> */
export const todayISO = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

export const fmtDay = (d?: string | null) => (d ? new Date(`${dateOnly(d)}T00:00:00`).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-");

export const fmtDateTime = (d?: string | null) => (d ? new Date(d).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-");

export const prettify = (k: string) => {
  const s = (k || "").replace(/[_-]+/g, " ").trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const serviceLabel = (k?: string | null) => (k ? (SERVICES as Record<string, string>)[k] || prettify(k) : "-");
