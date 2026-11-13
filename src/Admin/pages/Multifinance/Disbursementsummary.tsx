import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart3, CalendarDays, Layers, Loader2, RefreshCw, Wallet } from "lucide-react";
import { api, errorMessage } from "../../api";
import { BarChart, Delta, LineChart, Panel } from "../../pages/MultifinanceDashboard";
import type { Point } from "../../pages/MultifinanceDashboard";
import { num, rupiah, rupiahCompact, serviceLabel } from "../../../utils/Utils";

/* ------------------------------------------------------------------ */
/* Tipe respons GET /admin/disbursement-multifinance/summary           */
/* ------------------------------------------------------------------ */

type Cmp = { current: number; previous: number; difference: number; change_percent: number | null };
type Period = { transactions: Cmp; amount: Cmp };

type SummaryData = {
  overview: { total_transactions: number; total_amount: number };
  daily: Period;
  weekly: Period;
  monthly: Period;
  charts: {
    daily: { date: string; transactions: number; amount: number }[];
    monthly: { month: string; transactions: number; amount: number }[];
    by_service: { service_type: string; transactions: number; amount: number }[];
  };
};

type Metric = "amount" | "transactions";

const SERVICE_COLORS = ["#059669", "#0ea5e9", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#dc2626", "#64748b"];

type Props = {
  /** Naikkan angka ini untuk memuat ulang data (mis. setelah tambah/edit/hapus) */
  refreshKey?: number;
  /** Tampilkan grafik harian & bulanan. Default: true */
  showCharts?: boolean;
  /** Tampilkan rincian per layanan. Default: true */
  showServices?: boolean;
  className?: string;
};

/* ------------------------------------------------------------------ */
/* Kartu perbandingan satu periode                                     */
/* ------------------------------------------------------------------ */
function PeriodCard({ title, previousLabel, period }: { title: string; previousLabel: string; period: Period }) {
  const { amount, transactions } = period;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-gray-500">{title}</p>
        <Delta current={amount.current} previous={amount.previous} />
      </div>

      <p className="mt-3 break-words text-xl font-extrabold text-gray-900 sm:text-2xl">{rupiah(amount.current)}</p>
      <p className="mt-1 text-xs font-semibold text-gray-400">
        {previousLabel}: <span className="text-gray-600">{rupiah(amount.previous)}</span>
      </p>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-3 text-xs">
        <span className="font-semibold text-gray-500">
          <b className="text-sm font-extrabold text-gray-900">{num(transactions.current)}</b> transaksi
        </span>
        <span className="flex items-center gap-1.5 font-semibold text-gray-400">
          {previousLabel}: {num(transactions.previous)}
          <Delta current={transactions.current} previous={transactions.previous} />
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Komponen utama                                                      */
/* ------------------------------------------------------------------ */
export default function DisbursementSummary({ refreshKey = 0, showCharts = true, showServices = true, className = "" }: Props) {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [metric, setMetric] = useState<Metric>("amount");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");

    api<{ data: SummaryData }>("/admin/disbursement-multifinance/summary")
      .then((r) => alive && setData(r.data))
      .catch((e) => alive && setError(errorMessage(e)))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [refreshKey, retry]);

  const isAmount = metric === "amount";
  const chartProps = useCallback(() => (isAmount ? { format: rupiah, axis: rupiahCompact, unit: "" } : { unit: "transaksi" }), [isAmount]);

  const daily = useMemo<Point[]>(() => (data?.charts.daily ?? []).map((d) => ({ label: new Date(`${d.date}T00:00:00`).toLocaleDateString("id-ID", { day: "numeric", month: "short" }), value: Number(d[metric]) })), [data, metric]);

  const monthly = useMemo<Point[]>(() => (data?.charts.monthly ?? []).map((m) => ({ label: new Date(`${m.month}-01T00:00:00`).toLocaleDateString("id-ID", { month: "short", year: "2-digit" }), value: Number(m[metric]) })), [data, metric]);

  const services = useMemo(() => {
    const rows = data?.charts.by_service ?? [];
    const totalAmount = rows.reduce((s, r) => s + r.amount, 0);
    const maxAmount = Math.max(1, ...rows.map((r) => r.amount));
    return rows.map((r, i) => ({ ...r, color: SERVICE_COLORS[i % SERVICE_COLORS.length], share: totalAmount > 0 ? Math.round((r.amount / totalAmount) * 100) : 0, width: (r.amount / maxAmount) * 100 }));
  }, [data]);

  /* ---------- Error ---------- */
  if (error && !data) {
    return (
      <div role="alert" className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ${className}`}>
        <span>{error}</span>
        <button type="button" onClick={() => setRetry((n) => n + 1)} className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-red-700 ring-1 ring-red-200 hover:bg-red-50">
          <RefreshCw className="h-3.5 w-3.5" /> Coba lagi
        </button>
      </div>
    );
  }

  /* ---------- Skeleton ---------- */
  if (!data) {
    return (
      <div className={className}>
        <div className="h-32 animate-pulse rounded-3xl bg-gray-100" />
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} transition-opacity ${loading ? "opacity-60" : ""}`} aria-busy={loading}>
      {/* ===== Total keseluruhan ===== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-500 p-6 text-white sm:p-7" aria-label="Total pencairan">
        <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-100">
              <Wallet className="h-4 w-4" /> Total pencairan
            </p>
            <p className="mt-2 break-words text-3xl font-extrabold sm:text-4xl">{rupiah(data.overview.total_amount)}</p>
          </div>

          <div className="shrink-0 rounded-2xl bg-white/15 px-5 py-3 backdrop-blur">
            <p className="text-xs font-semibold text-emerald-100">Total transaksi</p>
            <p className="mt-0.5 text-2xl font-extrabold">{num(data.overview.total_transactions)}</p>
          </div>
        </div>
      </section>

      {/* ===== Perbandingan periode ===== */}
      <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3" aria-label="Perbandingan periode">
        <PeriodCard title="Hari ini" previousLabel="Kemarin" period={data.daily} />
        <PeriodCard title="Minggu ini" previousLabel="Minggu lalu" period={data.weekly} />
        <PeriodCard title="Bulan ini" previousLabel="Bulan lalu" period={data.monthly} />
      </section>

      {/* ===== Grafik ===== */}
      {showCharts && (
        <>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-gray-400">Grafik pencairan</h2>

            <div role="group" aria-label="Tampilkan grafik berdasarkan" className="inline-flex rounded-full bg-gray-100 p-1">
              {(
                [
                  ["amount", "Nominal"],
                  ["transactions", "Transaksi"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={metric === key}
                  onClick={() => setMetric(key)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600 ${
                    metric === key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"
                  }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 grid gap-4">
            <Panel title="30 hari terakhir" icon={CalendarDays}>
              <LineChart data={daily} color="#059669" {...chartProps()} />
            </Panel>

            <Panel title="12 bulan terakhir" icon={BarChart3}>
              <BarChart data={monthly} color="#059669" {...chartProps()} />
            </Panel>
          </div>
        </>
      )}

      {/* ===== Per layanan ===== */}
      {showServices && (
        <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-5" aria-label="Pencairan per layanan">
          <h2 className="mb-4 flex items-center gap-2 font-extrabold text-gray-900">
            <Layers className="h-4 w-4 text-emerald-600" />
            Pencairan per layanan
          </h2>

          {services.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">Belum ada pencairan yang tercatat.</p>
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {services.map((s) => (
                <li key={s.service_type} className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 truncate text-sm font-bold text-gray-700" title={serviceLabel(s.service_type)}>
                      {serviceLabel(s.service_type)}
                    </p>
                    <p className="shrink-0 text-base font-extrabold text-gray-900">{rupiah(s.amount)}</p>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200" role="progressbar" aria-valuenow={s.share} aria-valuemin={0} aria-valuemax={100} aria-label={`${serviceLabel(s.service_type)} ${s.share}%`}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${s.width}%`, background: s.color }} />
                  </div>

                  <p className="mt-1.5 flex justify-between text-xs font-semibold text-gray-400">
                    <span>{num(s.transactions)} transaksi</span>
                    <span>{s.share}% dari total nominal</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {loading && (
        <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-gray-400" role="status">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Memperbarui…
        </div>
      )}
    </div>
  );
}
