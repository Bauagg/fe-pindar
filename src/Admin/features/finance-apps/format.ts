export const fmtNum = (n: number | null | undefined) => Number(n ?? 0).toLocaleString("id-ID");

export const rupiah = (v: string | number | null | undefined) => {
  const n = Number(v);
  return v !== null && v !== undefined && v !== "" && Number.isFinite(n) ? `Rp ${n.toLocaleString("id-ID")}` : "-";
};

const fmt = (iso: string | null | undefined, opts: Intl.DateTimeFormatOptions) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleString("id-ID", opts);
};

export const fmtDate = (iso?: string | null) => fmt(iso, { day: "numeric", month: "short", year: "numeric" });
export const fmtDateTime = (iso?: string | null) => fmt(iso, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

/** 'YYYY-MM-DD' (atau ISO) -> "17 Agustus 1995", tanpa geser zona waktu */
export const fmtDay = (d?: string | null) => {
  if (!d) return "-";
  const x = new Date(`${d.slice(0, 10)}T00:00:00`);
  return Number.isNaN(x.getTime()) ? "-" : x.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
};

export const today = () => new Date().toISOString().slice(0, 10);

/** 0812... -> https://wa.me/62812... */
export const waLink = (phone: string) => `https://wa.me/${String(phone).replace(/\D/g, "").replace(/^0/, "62")}`;
