import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, ArrowDownRight, ArrowUpRight, BarChart3, Building2, CalendarDays, CheckCircle2, Clock, Loader2, Minus, NotebookPen, XCircle } from "lucide-react";
import { api } from "../api";
import { roleName, useAuth } from "../auth/AuthContext";
import { SERVICES } from "../constants";
import StatusBadge from "../components/StatusBadge";
import type { Application, Paginated } from "../types";
import AssetCell, { ApplicantBadge } from "../components/AssetCell";

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

// Tab partner (hanya untuk super_admin & admin). value = query ?role=
export const PARTNERS = [
  { value: "", label: "Semua" },
  { value: "admin_retailku", label: "Retailku" },
  { value: "admin_moladin", label: "Moladin" },
  { value: "admin_sinarmas", label: "Sinarmas" },
  { value: "admin_cnaf", label: "CNAF" },
  { value: "admin_taf", label: "TAF" },
];

export const FULL_ADMIN = ["super_admin", "admin"];

export const normalizeRole = (r?: string | null) =>
  (r || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

/* ------------------------------------------------------------------ */
/* Tipe respons GET /admin/multifinance/stats                          */
/* ------------------------------------------------------------------ */

type Summary = {
  total: number;
  today: number;
  yesterday: number;
  this_week: number;
  last_week: number;
  this_month: number;
  last_month: number;
};

export type Stats = Summary & {
  by_status: Record<string, number>;
  by_service?: Record<string, number>; // jumlah per layanan (service_type)
  daily: { date: string; count: number }[]; // 14 hari terakhir
  monthly: { month: string; count: number }[]; // 6 bulan terakhir
  partners?: ({ role: string; label: string } & Summary)[]; // hanya super_admin/admin tanpa filter role
};

export const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-");
export const num = (n: number) => n.toLocaleString("id-ID");

/* ------------------------------------------------------------------ */
/* Kartu perbandingan periode                                          */
/* ------------------------------------------------------------------ */

export function Delta({ current, previous }: { current: number; previous: number }) {
  if (current === 0 && previous === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-500">
        <Minus className="h-3 w-3" /> 0%
      </span>
    );
  }
  if (previous === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
        <ArrowUpRight className="h-3 w-3" /> Baru
      </span>
    );
  }

  const pct = Math.round(((current - previous) / previous) * 100);
  if (pct === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-500">
        <Minus className="h-3 w-3" /> 0%
      </span>
    );
  }

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
  // Jaga agar popup tidak keluar dari kiri/kanan kartu
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
  const close = React.useCallback(() => setActive(null), []);
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
  const close = React.useCallback(() => setActive(null), []);
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
  const close = React.useCallback(() => setActive(null), []);
  useDismiss(box, active !== null, close);

  const R = 52;
  const C = 2 * Math.PI * R;

  // Hitung awal tiap irisan (dalam satuan panjang keliling)
  let acc = 0;
  const arcs = slices.map((s) => {
    const len = total > 0 ? (s.value / total) * C : 0;
    const arc = { ...s, len, start: acc };
    acc += len;
    return arc;
  });

  // Posisi popup = tengah irisan yang aktif
  let pop: { x: number; y: number } | null = null;
  if (active !== null && arcs[active]?.len > 0) {
    const mid = arcs[active].start + arcs[active].len / 2;
    const ang = (mid / C) * 2 * Math.PI - Math.PI / 2;
    pop = { x: 70 + R * Math.cos(ang), y: 70 + R * Math.sin(ang) };
  }

  const toggle = (i: number) => setActive((cur) => (cur === i ? null : i));

  return (
    <div ref={box} className="flex flex-col items-center gap-5">
      {/* Donut */}
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

        {/* Angka di tengah (tidak menghalangi klik) */}
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

      {/* Keterangan (juga bisa diklik) */}
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

/* ------------------------------------------------------------------ */
/* Halaman                                                             */
/* ------------------------------------------------------------------ */

export default function MultifinanceDashboard() {
  const { user } = useAuth();
  const isFullAdmin = FULL_ADMIN.includes(normalizeRole(roleName(user)));

  const [partner, setPartner] = useState(""); // "" = semua
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");

    const roleParam = isFullAdmin && partner ? `role=${partner}` : "";
    const recentUrl = isFullAdmin ? `/admin/multifinance/all?limit=5${roleParam ? `&${roleParam}` : ""}` : "/admin/multifinance?limit=5";

    Promise.all([api<{ data: Stats }>(`/admin/multifinance/stats${roleParam ? `?${roleParam}` : ""}`), api<Paginated<Application>>(recentUrl)])
      .then(([s, r]) => {
        if (!alive) return;
        setStats(s.data);
        setRecent(r.data);
      })
      .catch((e: Error) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [partner, isFullAdmin]);

  const daily = useMemo<Point[]>(() => (stats?.daily ?? []).map((d) => ({ label: new Date(`${d.date}T00:00:00`).toLocaleDateString("id-ID", { day: "numeric", month: "short" }), value: d.count })), [stats]);

  const monthly = useMemo<Point[]>(() => (stats?.monthly ?? []).map((m) => ({ label: new Date(`${m.month}-01T00:00:00`).toLocaleDateString("id-ID", { month: "short" }), value: m.count })), [stats]);

  const slices = STATUS_CARDS.map((c) => ({ label: c.label, value: stats?.by_status?.[c.key] ?? 0, color: c.color }));
  const partnerLabel = PARTNERS.find((p) => p.value === partner)?.label;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900">Halo, {user?.name?.split(" ")[0] || "Admin"}</h1>
      <p className="mt-1 text-sm text-gray-500">
        Kamu masuk sebagai {roleName(user)}. Ini ringkasan pengajuan{isFullAdmin && partner ? ` ${partnerLabel}` : " yang bisa kamu lihat"}.
      </p>

      {/* Tab partner: hanya super_admin & admin */}
      {isFullAdmin && (
        <div role="tablist" aria-label="Pilih partner" className="mt-6 flex flex-wrap gap-2">
          {PARTNERS.map((p) => {
            const active = partner === p.value;
            return (
              <button
                key={p.value || "all"}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setPartner(p.value)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 ${
                  active ? "bg-red-600 text-white" : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
                }`}>
                {p.label}
              </button>
            );
          })}
        </div>
      )}

      {error && (
        <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className={`transition-opacity ${loading && stats ? "opacity-50" : ""}`}>
        {/* Perbandingan periode */}
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Perbandingan periode">
          {stats ? (
            <>
              <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-red-600 to-red-500 p-5 text-white">
                <p className="text-sm font-semibold text-red-100">Total semua pengajuan</p>
                <p className="mt-3 text-3xl font-extrabold">{num(stats.total)}</p>
                <p className="mt-1 text-xs font-semibold text-red-100">{isFullAdmin && partner ? partnerLabel : "Sejak awal"}</p>
              </div>
              <CompareCard title="Hari ini" current={stats.today} previous={stats.yesterday} previousLabel="Kemarin" />
              <CompareCard title="Minggu ini" current={stats.this_week} previous={stats.last_week} previousLabel="Minggu lalu" />
              <CompareCard title="Bulan ini" current={stats.this_month} previous={stats.last_month} previousLabel="Bulan lalu" />
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
              <p className="mt-4 text-3xl font-extrabold text-gray-900">{stats ? num(stats.by_status?.[key] ?? 0) : <span className="inline-block h-8 w-10 animate-pulse rounded bg-gray-100" />}</p>
              <p className="mt-1 text-sm font-semibold text-gray-500">{label}</p>
            </div>
          ))}
        </section>

        {/* Grafik */}
        {stats && (
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Panel title="Tren 14 hari terakhir" icon={CalendarDays}>
                <LineChart data={daily} />
              </Panel>
            </div>
            <Panel title="Distribusi status" icon={BarChart3}>
              <Donut slices={slices} total={stats.total} />
            </Panel>
            <div className="lg:col-span-3">
              <Panel title="Pengajuan per bulan (6 bulan terakhir)" icon={BarChart3}>
                <BarChart data={monthly} />
              </Panel>
            </div>
          </div>
        )}

        {/* Perbandingan antar partner: super_admin & admin, tampilan "Semua" */}
        {isFullAdmin && !partner && stats?.partners && (
          <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-5" aria-label="Perbandingan partner">
            <h2 className="mb-4 flex items-center gap-2 font-extrabold text-gray-900">
              <Building2 className="h-4 w-4 text-red-600" />
              Data per partner
            </h2>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {stats.partners.map((p) => (
                <button
                  key={p.role}
                  type="button"
                  onClick={() => setPartner(p.role)}
                  className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 text-left transition hover:border-red-200 hover:bg-red-50/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
                  <p className="text-sm font-extrabold text-gray-900">{p.label}</p>
                  <p className="mt-2 text-2xl font-extrabold text-gray-900">{num(p.total)}</p>
                  <p className="text-xs font-semibold text-gray-400">total pengajuan</p>

                  <dl className="mt-3 space-y-1.5 text-xs">
                    {[
                      ["Hari ini", p.today, p.yesterday],
                      ["Minggu ini", p.this_week, p.last_week],
                      ["Bulan ini", p.this_month, p.last_month],
                    ].map(([label, cur, prev]) => (
                      <div key={label as string} className="flex items-center justify-between gap-2">
                        <dt className="font-semibold text-gray-500">{label}</dt>
                        <dd className="flex items-center gap-1.5 font-extrabold text-gray-800">
                          {num(cur as number)}
                          <Delta current={cur as number} previous={prev as number} />
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
            <Link to="/admin/multi-finance/applications" className="text-sm font-bold text-red-600 hover:text-red-700">
              Lihat semua
            </Link>
          </div>

          {loading && !stats && !error ? (
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
                    <th className="px-5 py-3">Layanan</th>
                    <th className="px-5 py-3">Jaminan</th>
                    <th className="px-5 py-3">Tanggal</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recent.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50/60">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900">{a.applicant?.name}</p>
                          <ApplicantBadge type={a.applicant?.type} />
                        </div>
                        <p className="text-xs text-gray-400">{a.application_number}</p>
                      </td>
                      <td className="px-5 py-4 font-semibold text-gray-700">{SERVICES[a.service_type] || a.service_type}</td>
                      <td className="px-5 py-4">
                        <AssetCell a={a} />
                      </td>
                      <td className="px-5 py-4 text-gray-600">{fmtDate(a.created_at)}</td>
                      <td className="px-5 py-4">
                        <StatusBadge value={a.status.value} />
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
