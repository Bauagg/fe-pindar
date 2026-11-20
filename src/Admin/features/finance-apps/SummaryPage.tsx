import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { BarChart3, CalendarDays, Layers, Loader2 } from "lucide-react";
import { BarChart, CompareCard, Donut, LineChart, Panel, STATUS_CARDS, StatusBadge, api, errorMessage, isFullAdmin, useAuth } from "./shared";
import type { Point } from "./shared";
import type { ModuleConfig } from "./config";
import type { Application, Paginated, Stats } from "./types";
import { fmtDate, fmtNum } from "./format";
import { Alert } from "./ui-parts";

const COLORS = ["#dc2626", "#0ea5e9", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#14b8a6", "#64748b"];

export default function SummaryPage({ config }: { config: ModuleConfig }) {
  const { user } = useAuth();
  const allowed = isFullAdmin(user);

  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!allowed) return;
    let alive = true;
    setLoading(true);
    setError("");

    Promise.all([api<{ data: Stats }>(`${config.api.admin}/stats`), api<Paginated<Application>>(`${config.api.admin}/all?limit=5`)])
      .then(([s, r]) => {
        if (!alive) return;
        setStats(s.data);
        setRecent(r.data);
      })
      .catch((e) => alive && setError(errorMessage(e)))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [allowed, config.api.admin]);

  const daily = useMemo<Point[]>(() => (stats?.daily ?? []).map((d) => ({ label: new Date(`${d.date}T00:00:00`).toLocaleDateString("id-ID", { day: "numeric", month: "short" }), value: d.count })), [stats]);
  const monthly = useMemo<Point[]>(() => (stats?.monthly ?? []).map((m) => ({ label: new Date(`${m.month}-01T00:00:00`).toLocaleDateString("id-ID", { month: "short" }), value: m.count })), [stats]);

  const products = useMemo(() => {
    const by = stats?.[config.byKey] ?? {};
    return Object.entries(by)
      .map(([label, value]) => ({ label: label || "(tanpa nama)", value: Number(value) }))
      .sort((a, b) => b.value - a.value)
      .map((p, i) => ({ ...p, color: COLORS[i % COLORS.length] }));
  }, [stats, config.byKey]);

  const productTotal = products.reduce((s, p) => s + p.value, 0);
  const productMax = Math.max(1, ...products.map((p) => p.value));
  const slices = STATUS_CARDS.map((c) => ({ label: c.label, value: stats?.by_status?.[c.key] ?? 0, color: c.color }));

  // Khusus super_admin & admin
  if (!allowed) return <Navigate to={config.routes.list} replace />;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-red-500/20 blur-3xl" aria-hidden="true" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-200">Summary {config.title}</p>
            <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">Ringkasan seluruh pengajuan</h1>
            <p className="mt-1 text-sm text-gray-300">Hanya terlihat oleh Super Admin dan Admin.</p>
          </div>
          <div className="shrink-0 rounded-2xl bg-white/10 px-6 py-4 backdrop-blur">
            <p className="text-xs font-semibold text-gray-300">Total semua pengajuan</p>
            <p className="mt-1 text-4xl font-extrabold">{stats ? fmtNum(stats.total) : <span className="inline-block h-9 w-20 animate-pulse rounded bg-white/20" />}</p>
          </div>
        </div>
      </section>

      {error && (
        <div className="mt-6">
          <Alert>{error}</Alert>
        </div>
      )}

      <div className={`transition-opacity ${loading && stats ? "opacity-50" : ""}`}>
        {/* Perbandingan periode */}
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3" aria-label="Perbandingan periode">
          {stats ? (
            <>
              <CompareCard title="Hari ini" current={stats.today} previous={stats.yesterday} previousLabel="Kemarin" />
              <CompareCard title="Minggu ini" current={stats.this_week} previous={stats.last_week} previousLabel="Minggu lalu" />
              <CompareCard title="Bulan ini" current={stats.this_month} previous={stats.last_month} previousLabel="Bulan lalu" />
            </>
          ) : (
            Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-[120px] animate-pulse rounded-2xl bg-gray-100" />)
          )}
        </section>

        {/* Per produk (kartu / bank) */}
        <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-5" aria-label={`Rincian per ${config.productLabel.toLowerCase()}`}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 font-extrabold text-gray-900">
              <Layers className="h-4 w-4 text-red-600" />
              Pengajuan per {config.productLabel.replace(/^Nama /, "").toLowerCase()}
            </h2>
            {stats && <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">{fmtNum(productTotal)} pengajuan</span>}
          </div>

          {!stats ? (
            <div className="grid gap-3 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">Belum ada data.</p>
          ) : (
            <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {products.map((p) => {
                const share = productTotal > 0 ? Math.round((p.value / productTotal) * 100) : 0;
                return (
                  <li key={p.label} className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="min-w-0 truncate text-sm font-bold text-gray-700" title={p.label}>
                        {p.label}
                      </p>
                      <p className="shrink-0 text-xl font-extrabold text-gray-900">{fmtNum(p.value)}</p>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200" role="progressbar" aria-valuenow={share} aria-valuemin={0} aria-valuemax={100} aria-label={`${p.label} ${share}%`}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${(p.value / productMax) * 100}%`, background: p.color }} />
                    </div>
                    <p className="mt-1.5 text-xs font-semibold text-gray-400">{share}% dari total</p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Ringkasan status */}
        <section className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-5" aria-label="Ringkasan status">
          {STATUS_CARDS.map(({ key, label, icon: Icon, tone }) => (
            <div key={key} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-extrabold leading-none text-gray-900">{stats ? fmtNum(stats.by_status?.[key] ?? 0) : <span className="inline-block h-6 w-8 animate-pulse rounded bg-gray-100" />}</p>
                <p className="mt-1 truncate text-xs font-semibold text-gray-500">{label}</p>
              </div>
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

        {/* Terbaru */}
        <section className="mt-6 rounded-2xl border border-gray-100 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="font-extrabold text-gray-900">Pengajuan terbaru</h2>
            <Link to={config.routes.all} className="text-sm font-bold text-red-600 hover:text-red-700">
              Lihat semua
            </Link>
          </div>

          {loading && !stats && !error ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-red-600" />
            </div>
          ) : recent.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-gray-500">Belum ada pengajuan masuk.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="text-xs font-bold text-gray-400">
                  <tr>
                    <th className="px-5 py-3">Pemohon</th>
                    <th className="px-5 py-3">{config.productLabel.replace(/^Nama /, "").replace(/^./, (c) => c.toUpperCase())}</th>
                    {config.hasCompany && <th className="px-5 py-3">Perusahaan</th>}
                    <th className="px-5 py-3">Tanggal</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recent.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50/60">
                      <td className="px-5 py-4">
                        <Link to={config.routes.detail(a.id)} className="font-bold text-gray-900 hover:text-red-600">
                          {a.applicant?.name}
                        </Link>
                        <p className="text-xs text-gray-400">{a.application_number}</p>
                      </td>
                      <td className="px-5 py-4 font-semibold text-gray-700">{a[config.productKey] || "-"}</td>
                      {config.hasCompany && <td className="px-5 py-4 text-gray-600">{a.company?.name || "-"}</td>}
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
