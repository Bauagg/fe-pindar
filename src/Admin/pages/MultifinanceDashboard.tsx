import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, ArrowDownRight, ArrowUpRight, BarChart3, Building2, CalendarDays, Car, CheckCircle2, Clock, CreditCard, Info, Landmark, Layers, Loader2, Minus, NotebookPen, Wallet, X, XCircle } from "lucide-react";
import { api, errorMessage } from "../api";
import { isFullAdmin, roleName, useAuth } from "../auth/AuthContext";
import { SERVICES } from "../constants";
import StatusBadge from "../components/StatusBadge";

/* ------------------------------------------------------------------ */
/* Tipe respons GET /dashboard                                         */
/* ------------------------------------------------------------------ */

type ProductKey = "pindar" | "multifinance" | "kartu_kredit" | "pinjaman_bank";
type TabKey = "all" | ProductKey;

type Summary = {
  total: number;
  today: number;
  yesterday: number;
  this_week: number;
  last_week: number;
  this_month: number;
  last_month: number;
};

type RecentItem = {
  id: number;
  product: ProductKey;
  product_label: string;
  application_number: string;
  applicant_name: string;
  detail: string | null;
  status: string;
  created_at: string;
};

type Stats = Summary & {
  by_status: Record<string, number>;
  by_detail?: { name: string; count: number }[];
  daily: { date: string; count: number }[];
  monthly: { month: string; count: number }[];
  recent?: RecentItem[];
};

type ProductStats = Stats & { label: string; available: boolean };

type Partner = Summary & { role: string; label: string; type: string; product?: ProductKey };

type DashboardData = {
  scope: "all" | ProductKey;
  role: { slug: string | null; name: string | null; type: string | null };
  products: Partial<Record<ProductKey, ProductStats>>;
  overall: Stats;
  recent: RecentItem[];
  partners?: Partner[];
};

/* ------------------------------------------------------------------ */
/* Konfigurasi                                                         */
/* ------------------------------------------------------------------ */

export const STATUS_CARDS = [
  { key: "pending", label: "Menunggu diproses", icon: Clock, tone: "bg-amber-50 text-amber-600", color: "#f59e0b" },
  { key: "on_progress", label: "Sedang diproses", icon: Activity, tone: "bg-sky-50 text-sky-600", color: "#0ea5e9" },
  { key: "correction", label: "Koreksi", icon: NotebookPen, tone: "bg-orange-50 text-orange-600", color: "#f97316" },
  { key: "approved", label: "Disetujui", icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-600", color: "#10b981" },
  { key: "rejected", label: "Ditolak", icon: XCircle, tone: "bg-red-50 text-red-600", color: "#ef4444" },
] as const;

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "all", label: "Semua", icon: Layers },
  { key: "pindar", label: "Pindar", icon: Wallet },
  { key: "multifinance", label: "Multi Finance", icon: Car },
  { key: "kartu_kredit", label: "Kartu Kredit", icon: CreditCard },
  { key: "pinjaman_bank", label: "Pinjaman Bank", icon: Landmark },
];

const PRODUCT_LABEL: Record<ProductKey, string> = {
  pindar: "Pindar",
  multifinance: "Multi Finance",
  kartu_kredit: "Kartu Kredit",
  pinjaman_bank: "Pinjaman Bank",
};

const DETAIL_TITLE: Record<ProductKey, string> = {
  pindar: "Per layanan",
  multifinance: "Per layanan",
  kartu_kredit: "Per kartu",
  pinjaman_bank: "Per bank",
};

// SESUAIKAN dengan route halaman daftar pengajuan masing-masing produk (Pindar belum ada)
const LIST_ROUTE: Partial<Record<ProductKey, string>> = {
  multifinance: "/admin/multi-finance/applications",
  kartu_kredit: "/admin/credit-card/applications",
  pinjaman_bank: "/admin/bank-loan/applications",
};

export const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-");
export const num = (n: number) => n.toLocaleString("id-ID");

/* ------------------------------------------------------------------ */
/* Kartu perbandingan periode                                          */
/* ------------------------------------------------------------------ */

export function Delta({ current, previous }: { current: number; previous: number }) {
  const flat = (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-500">
      <Minus className="h-3 w-3" /> 0%
    </span>
  );

  if (current === 0 && previous === 0) return flat;

  if (previous === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
        <ArrowUpRight className="h-3 w-3" /> Baru
      </span>
    );
  }

  const pct = Math.round(((current - previous) / previous) * 100);
  if (pct === 0) return flat;

  const up = pct > 0;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${up ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
      {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {Math.abs(pct)}%
    </span>
  );
}

export function CompareCard({ title, current, previous, previousLabel }: { title: string; current: number; previous: number; previousLabel: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-gray-500">{title}</p>
        <Delta current={current} previous={previous} />
      </div>
      <p className="mt-3 text-3xl font-extrabold text-gray-900">{num(current)}</p>
      <p className="mt-1 text-xs font-semibold text-gray-400">
        {previousLabel}: <span className="text-gray-600">{num(previous)}</span>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Grafik SVG sederhana (tanpa library) + popup keterangan saat diklik */
/* ------------------------------------------------------------------ */

export type Point = { label: string; value: number };

const W = 600;
const H = 220;
const PAD = { top: 16, right: 12, bottom: 28, left: 32 };

function niceMax(v: number) {
  if (v <= 4) return 4;
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  return Math.ceil(v / pow) * pow;
}

// Tutup popup saat klik di luar grafik atau tekan Esc
function useDismiss(ref: React.RefObject<HTMLElement | null>, open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, ref]);
}

// Popup kecil yang menempel di titik yang diklik (posisi dalam persen dari area grafik)
function Popup({ xPct, yPct, children }: { xPct: number; yPct: number; children: React.ReactNode }) {
  const align = xPct < 18 ? "translate(-10%, -115%)" : xPct > 82 ? "translate(-90%, -115%)" : "translate(-50%, -115%)";

  return (
    <div role="status" className="pointer-events-none absolute z-10 whitespace-nowrap rounded-xl bg-gray-900 px-3 py-2 text-xs text-white shadow-lg" style={{ left: `${xPct}%`, top: `${yPct}%`, transform: align }}>
      {children}
    </div>
  );
}

function Grid({ max }: { max: number }) {
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  return (
    <>
      {ticks.map((t) => {
        const y = PAD.top + (1 - t) * (H - PAD.top - PAD.bottom);
        return (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke="#f1f5f9" strokeWidth="1" />
            <text x={PAD.left - 6} y={y + 3} textAnchor="end" fontSize="10" fill="#94a3b8">
              {Math.round(max * t)}
            </text>
          </g>
        );
      })}
    </>
  );
}

export function LineChart({ data, color = "#dc2626", unit = "pengajuan" }: { data: Point[]; color?: string; unit?: string }) {
  const [active, setActive] = useState<number | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setActive(null), []);
  useDismiss(box, active !== null, close);

  const max = niceMax(Math.max(0, ...data.map((d) => d.value)));
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
  const y = (v: number) => PAD.top + (1 - v / max) * innerH;

  const line = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(d.value)}`).join(" ");
  const area = `${line} L${x(data.length - 1)},${PAD.top + innerH} L${x(0)},${PAD.top + innerH} Z`;
  const gid = `grad-${color.replace("#", "")}`;

  return (
    <div ref={box} className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Grafik tren pengajuan harian">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <Grid max={max} />
        <path d={area} fill={`url(#${gid})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

        {data.map((d, i) => {
          const on = active === i;
          return (
            <g key={i}>
              {(i % 2 === 0 || data.length <= 7) && (
                <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="#94a3b8">
                  {d.label}
                </text>
              )}

              {/* Area klik lebih besar supaya mudah di HP */}
              <circle
                cx={x(i)}
                cy={y(d.value)}
                r="14"
                fill="transparent"
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`${d.label}: ${d.value} ${unit}`}
                onClick={() => setActive(on ? null : i)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setActive(on ? null : i))}
              />
              <circle cx={x(i)} cy={y(d.value)} r={on ? 6 : 3.5} fill={on ? color : "#fff"} stroke={color} strokeWidth="2" pointerEvents="none" />
            </g>
          );
        })}
      </svg>

      {active !== null && (
        <Popup xPct={(x(active) / W) * 100} yPct={(y(data[active].value) / H) * 100}>
          <p className="font-bold">{data[active].label}</p>
          <p className="mt-0.5 text-gray-300">
            <span className="text-sm font-extrabold text-white">{num(data[active].value)}</span> {unit}
          </p>
        </Popup>
      )}
    </div>
  );
}

export function BarChart({ data, color = "#dc2626", unit = "pengajuan" }: { data: Point[]; color?: string; unit?: string }) {
  const [active, setActive] = useState<number | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setActive(null), []);
  useDismiss(box, active !== null, close);

  const max = niceMax(Math.max(0, ...data.map((d) => d.value)));
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const slot = innerW / data.length;
  const bw = Math.min(48, slot * 0.55);
  const cxOf = (i: number) => PAD.left + slot * i + slot / 2;
  const topOf = (v: number) => PAD.top + innerH - (v / max) * innerH;

  return (
    <div ref={box} className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Grafik pengajuan per bulan">
        <Grid max={max} />
        {data.map((d, i) => {
          const h = (d.value / max) * innerH;
          const on = active === i;
          const dim = active !== null && !on;
          return (
            <g key={i}>
              <rect x={cxOf(i) - bw / 2} y={PAD.top + innerH - h} width={bw} height={Math.max(h, d.value > 0 ? 2 : 0)} rx="6" fill={color} opacity={dim ? 0.3 : on || (active === null && i === data.length - 1) ? 1 : 0.55} />
              <text x={cxOf(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="#94a3b8">
                {d.label}
              </text>

              {/* Area klik: seluruh kolom bulan */}
              <rect
                x={cxOf(i) - slot / 2}
                y={PAD.top}
                width={slot}
                height={innerH}
                fill="transparent"
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`${d.label}: ${d.value} ${unit}`}
                onClick={() => setActive(on ? null : i)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setActive(on ? null : i))}
              />
            </g>
          );
        })}
      </svg>

      {active !== null && (
        <Popup xPct={(cxOf(active) / W) * 100} yPct={(topOf(data[active].value) / H) * 100}>
          <p className="font-bold">{data[active].label}</p>
          <p className="mt-0.5 text-gray-300">
            <span className="text-sm font-extrabold text-white">{num(data[active].value)}</span> {unit}
          </p>
        </Popup>
      )}
    </div>
  );
}

export function Donut({ slices, total }: { slices: { label: string; value: number; color: string }[]; total: number }) {
  const [active, setActive] = useState<number | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setActive(null), []);
  useDismiss(box, active !== null, close);

  const R = 52;
  const C = 2 * Math.PI * R;

  let acc = 0;
  const arcs = slices.map((s) => {
    const len = total > 0 ? (s.value / total) * C : 0;
    const arc = { ...s, len, start: acc };
    acc += len;
    return arc;
  });

  let pop: { x: number; y: number } | null = null;
  if (active !== null && arcs[active]?.len > 0) {
    const mid = arcs[active].start + arcs[active].len / 2;
    const ang = (mid / C) * 2 * Math.PI - Math.PI / 2;
    pop = { x: 70 + R * Math.cos(ang), y: 70 + R * Math.sin(ang) };
  }

  const toggle = (i: number) => setActive((cur) => (cur === i ? null : i));

  return (
    <div ref={box} className="flex flex-col items-center gap-5">
      <div className="relative mx-auto h-44 w-44">
        <svg viewBox="0 0 140 140" className="h-full w-full" role="img" aria-label="Distribusi status pengajuan">
          <g transform="rotate(-90 70 70)">
            <circle cx="70" cy="70" r={R} fill="none" stroke="#f1f5f9" strokeWidth="18" />
            {arcs.map((a, i) =>
              a.len > 0 ? (
                <circle
                  key={a.label}
                  cx="70"
                  cy="70"
                  r={R}
                  fill="none"
                  stroke={a.color}
                  strokeWidth={active === i ? 22 : 18}
                  strokeDasharray={`${a.len} ${C - a.len}`}
                  strokeDashoffset={-a.start}
                  opacity={active !== null && active !== i ? 0.35 : 1}
                  className="cursor-pointer transition-all"
                  role="button"
                  tabIndex={0}
                  aria-label={`${a.label}: ${a.value}`}
                  onClick={() => toggle(i)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), toggle(i))}
                />
              ) : null
            )}
          </g>
        </svg>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold leading-none text-gray-900">{num(total)}</span>
          <span className="mt-1 text-[11px] font-semibold text-gray-400">total</span>
        </div>

        {pop && active !== null && (
          <Popup xPct={(pop.x / 140) * 100} yPct={(pop.y / 140) * 100}>
            <p className="flex items-center gap-1.5 font-bold">
              <span className="h-2 w-2 rounded-full" style={{ background: arcs[active].color }} />
              {arcs[active].label}
            </p>
            <p className="mt-0.5 text-gray-300">
              <span className="text-sm font-extrabold text-white">{num(arcs[active].value)}</span> pengajuan · {total > 0 ? Math.round((arcs[active].value / total) * 100) : 0}%
            </p>
          </Popup>
        )}
      </div>

      <ul className="w-full space-y-1 text-sm">
        {arcs.map((a, i) => (
          <li key={a.label}>
            <button type="button" onClick={() => a.len > 0 && toggle(i)} className={`flex w-full items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left transition hover:bg-gray-50 ${active === i ? "bg-gray-50" : ""}`}>
              <span className="flex min-w-0 items-center gap-2 font-semibold text-gray-600">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: a.color }} />
                <span className="truncate">{a.label}</span>
              </span>
              <span className="shrink-0 font-extrabold text-gray-900">
                {num(a.value)}
                <span className="ml-1.5 text-xs font-semibold text-gray-400">{total > 0 ? Math.round((a.value / total) * 100) : 0}%</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Panel({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5">
      <h2 className="mb-4 flex items-center gap-2 font-extrabold text-gray-900">
        <Icon className="h-4 w-4 text-red-600" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function RankList({ items }: { items: { name: string; count: number }[] }) {
  if (items.length === 0) return <p className="py-6 text-center text-sm text-gray-400">Belum ada data.</p>;

  const max = Math.max(1, ...items.map((i) => i.count));

  return (
    <ul className="space-y-3">
      {items.map((i) => (
        <li key={i.name}>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate font-semibold text-gray-600">{i.name}</span>
            <span className="shrink-0 font-extrabold text-gray-900">{num(i.count)}</span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-gray-100">
            <div className="h-2 rounded-full bg-red-500 transition-all" style={{ width: `${(i.count / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Halaman                                                             */
/* ------------------------------------------------------------------ */

export default function Dashboard() {
  const { user } = useAuth();

  const [tab, setTab] = useState<TabKey>("all");
  const [roleFilter, setRoleFilter] = useState(""); // filter partner (khusus full admin)
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");

    api<{ data: DashboardData }>(`/dashboard${roleFilter ? `?role=${encodeURIComponent(roleFilter)}` : ""}`)
      .then((res) => alive && setData(res.data))
      .catch((e) => alive && setError(errorMessage(e)))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [roleFilter]);

  // Admin/super admin => scope "all" (ada tab). Role partner => scope = produknya (tanpa tab).
  const isAll = data ? data.scope === "all" : isFullAdmin(user);
  const activeKey: TabKey = data && data.scope !== "all" ? data.scope : tab;

  const view: Stats | undefined = useMemo(() => {
    if (!data) return undefined;
    if (activeKey === "all") return data.overall;
    return data.products[activeKey];
  }, [data, activeKey]);

  const product = activeKey !== "all" ? data?.products[activeKey] : undefined;

  const recent: RecentItem[] = activeKey === "all" ? data?.recent ?? [] : view?.recent ?? [];

  const daily = useMemo<Point[]>(() => (view?.daily ?? []).map((d) => ({ label: new Date(`${d.date}T00:00:00`).toLocaleDateString("id-ID", { day: "numeric", month: "short" }), value: d.count })), [view]);

  const monthly = useMemo<Point[]>(() => (view?.monthly ?? []).map((m) => ({ label: new Date(`${m.month}-01T00:00:00`).toLocaleDateString("id-ID", { month: "short" }), value: m.count })), [view]);

  const slices = STATUS_CARDS.map((c) => ({ label: c.label, value: view?.by_status?.[c.key] ?? 0, color: c.color }));

  // Panel breakdown: "Semua" => per produk, tab produk => per layanan/kartu/bank
  const breakdown = useMemo(() => {
    if (!data) return [];
    if (activeKey === "all") {
      return (Object.keys(data.products) as ProductKey[]).map((k) => ({ name: PRODUCT_LABEL[k], count: data.products[k]?.total ?? 0 }));
    }
    return (view?.by_detail ?? []).map((d) => ({ name: activeKey === "multifinance" ? SERVICES[d.name] || d.name : d.name, count: d.count }));
  }, [data, activeKey, view]);

  const partners = useMemo(() => (data?.partners ?? []).filter((p) => activeKey === "all" || p.product === activeKey), [data, activeKey]);

  const partnerLabel = data?.partners?.find((p) => p.role === roleFilter)?.label ?? roleFilter;
  const scopeLabel = activeKey === "all" ? "semua produk" : PRODUCT_LABEL[activeKey];
  const listRoute = activeKey !== "all" ? LIST_ROUTE[activeKey] : undefined;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900">Halo, {user?.name?.split(" ")[0] || "Admin"}</h1>
      <p className="mt-1 text-sm text-gray-500">
        Kamu masuk sebagai {roleName(user)}. Ini ringkasan pengajuan {scopeLabel}
        {roleFilter ? ` (${partnerLabel})` : ""}.
      </p>

      {/* TAB PRODUK: hanya super_admin & admin */}
      {isAll && (
        <div role="tablist" aria-label="Pilih produk" className="mt-6 flex flex-wrap gap-2">
          {TABS.map((t) => {
            const on = tab === t.key;
            const Icon = t.icon;
            const total = t.key === "all" ? data?.overall.total : data?.products[t.key]?.total;

            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setTab(t.key)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 ${
                  on ? "bg-red-600 text-white" : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
                }`}>
                <Icon className="h-4 w-4" />
                {t.label}
                {total !== undefined && <span className={`rounded-full px-1.5 py-0.5 text-[11px] ${on ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>{num(total)}</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* Chip filter partner */}
      {roleFilter && (
        <div className="mt-3">
          <button type="button" onClick={() => setRoleFilter("")} className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100">
            Partner: {partnerLabel}
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {error && (
        <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* Pindar belum punya BE */}
      {product && !product.available && (
        <div className="mt-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-sm font-semibold text-amber-800">Data Pindar belum terhubung. Angka di bawah akan terisi setelah integrasinya tersedia.</p>
        </div>
      )}

      <div className={`transition-opacity ${loading && data ? "opacity-50" : ""}`}>
        {/* Perbandingan periode */}
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Perbandingan periode">
          {view ? (
            <>
              <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-red-600 to-red-500 p-5 text-white">
                <p className="text-sm font-semibold text-red-100">Total pengajuan</p>
                <p className="mt-3 text-3xl font-extrabold">{num(view.total)}</p>
                <p className="mt-1 text-xs font-semibold text-red-100">{roleFilter ? partnerLabel : scopeLabel}</p>
              </div>
              <CompareCard title="Hari ini" current={view.today} previous={view.yesterday} previousLabel="Kemarin" />
              <CompareCard title="Minggu ini" current={view.this_week} previous={view.last_week} previousLabel="Minggu lalu" />
              <CompareCard title="Bulan ini" current={view.this_month} previous={view.last_month} previousLabel="Bulan lalu" />
            </>
          ) : (
            Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-[132px] animate-pulse rounded-2xl bg-gray-100" />)
          )}
        </section>

        {/* Ringkasan status */}
        <section className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-5" aria-label="Ringkasan status">
          {STATUS_CARDS.map(({ key, label, icon: Icon, tone }) => (
            <div key={key} className="rounded-2xl border border-gray-100 bg-white p-5">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-3xl font-extrabold text-gray-900">{view ? num(view.by_status?.[key] ?? 0) : <span className="inline-block h-8 w-10 animate-pulse rounded bg-gray-100" />}</p>
              <p className="mt-1 text-sm font-semibold text-gray-500">{label}</p>
            </div>
          ))}
        </section>

        {/* Grafik */}
        {view && (
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Panel title="Tren 14 hari terakhir" icon={CalendarDays}>
                <LineChart data={daily} />
              </Panel>
            </div>
            <Panel title="Distribusi status" icon={BarChart3}>
              <Donut slices={slices} total={view.total} />
            </Panel>
            <div className="lg:col-span-2">
              <Panel title="Pengajuan per bulan (6 bulan terakhir)" icon={BarChart3}>
                <BarChart data={monthly} />
              </Panel>
            </div>
            <Panel title={activeKey === "all" ? "Per produk" : DETAIL_TITLE[activeKey]} icon={Layers}>
              <RankList items={breakdown} />
            </Panel>
          </div>
        )}

        {/* Data per partner: hanya full admin, tanpa filter partner */}
        {isAll && !roleFilter && partners.length > 0 && (
          <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-5" aria-label="Perbandingan partner">
            <h2 className="mb-4 flex items-center gap-2 font-extrabold text-gray-900">
              <Building2 className="h-4 w-4 text-red-600" />
              Data per partner
            </h2>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {partners.map((p) => (
                <button
                  key={p.role}
                  type="button"
                  onClick={() => setRoleFilter(p.role)}
                  className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 text-left transition hover:border-red-200 hover:bg-red-50/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
                  <p className="text-sm font-extrabold text-gray-900">{p.label}</p>
                  {p.product && <p className="text-[11px] font-semibold text-gray-400">{PRODUCT_LABEL[p.product]}</p>}
                  <p className="mt-2 text-2xl font-extrabold text-gray-900">{num(p.total)}</p>
                  <p className="text-xs font-semibold text-gray-400">total pengajuan</p>

                  <dl className="mt-3 space-y-1.5 text-xs">
                    {(
                      [
                        ["Hari ini", p.today, p.yesterday],
                        ["Minggu ini", p.this_week, p.last_week],
                        ["Bulan ini", p.this_month, p.last_month],
                      ] as [string, number, number][]
                    ).map(([label, cur, prev]) => (
                      <div key={label} className="flex items-center justify-between gap-2">
                        <dt className="font-semibold text-gray-500">{label}</dt>
                        <dd className="flex items-center gap-1.5 font-extrabold text-gray-800">
                          {num(cur)}
                          <Delta current={cur} previous={prev} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Pengajuan terbaru */}
        <section className="mt-6 rounded-2xl border border-gray-100 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="font-extrabold text-gray-900">Pengajuan terbaru</h2>
            {listRoute && (
              <Link to={listRoute} className="text-sm font-bold text-red-600 hover:text-red-700">
                Lihat semua
              </Link>
            )}
          </div>

          {loading && !data && !error ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-red-600" />
            </div>
          ) : recent.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-gray-500">Belum ada pengajuan masuk. Pengajuan dari form user akan muncul di sini.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="text-xs font-bold text-gray-400">
                  <tr>
                    <th className="px-5 py-3">Pemohon</th>
                    {activeKey === "all" && <th className="px-5 py-3">Produk</th>}
                    <th className="px-5 py-3">Detail</th>
                    <th className="px-5 py-3">Tanggal</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recent.map((r) => (
                    <tr key={`${r.product}-${r.id}`} className="hover:bg-gray-50/60">
                      <td className="px-5 py-4">
                        <p className="font-bold text-gray-900">{r.applicant_name}</p>
                        <p className="text-xs text-gray-400">{r.application_number}</p>
                      </td>
                      {activeKey === "all" && (
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700">{r.product_label}</span>
                        </td>
                      )}
                      <td className="px-5 py-4 font-semibold text-gray-700">{r.product === "multifinance" ? (r.detail && SERVICES[r.detail]) || r.detail || "-" : r.detail || "-"}</td>
                      <td className="px-5 py-4 text-gray-600">{fmtDate(r.created_at)}</td>
                      <td className="px-5 py-4">
                        <StatusBadge value={r.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
