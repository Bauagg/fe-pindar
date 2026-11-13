import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { BarChart3, Building2, CalendarDays, Layers, Loader2 } from "lucide-react";
import { api } from "../../api";
import { roleName, useAuth } from "../../auth/AuthContext";
import { SERVICES } from "../../constants";
import StatusBadge from "../../components/StatusBadge";
import type { Application, Paginated } from "../../types";
import AssetCell, { ApplicantBadge } from "../../components/AssetCell";
import { BarChart, CompareCard, Delta, Donut, FULL_ADMIN, LineChart, PARTNERS, Panel, STATUS_CARDS, fmtDate, normalizeRole, num } from "../MultifinanceDashboard";
import type { Point, Stats } from "../MultifinanceDashboard";

const SERVICE_COLORS = ["#dc2626", "#0ea5e9", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#14b8a6", "#64748b"];

// "jaminkan_bpkb" -> "Jaminkan bpkb" (dipakai kalau label tidak ada di SERVICES)
const prettify = (k: string) => {
  const s = k.replace(/[_-]+/g, " ").trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export default function SummaryMultifinancePage() {
  const { user } = useAuth();
  const isFullAdmin = FULL_ADMIN.includes(normalizeRole(roleName(user)));

  const [partner, setPartner] = useState(""); // "" = semua
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isFullAdmin) return;

    let alive = true;
    setLoading(true);
    setError("");

    const roleParam = partner ? `role=${partner}` : "";

    Promise.all([api<{ data: Stats }>(`/admin/multifinance/stats${roleParam ? `?${roleParam}` : ""}`), api<Paginated<Application>>(`/admin/multifinance/all?limit=5${roleParam ? `&${roleParam}` : ""}`)])
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

  // Rincian per layanan: semua layanan di SERVICES tetap tampil (0 kalau belum ada), diurutkan terbanyak
  const services = useMemo(() => {
    const by = stats?.by_service ?? {};
    const keys = Array.from(new Set([...Object.keys(SERVICES), ...Object.keys(by)]));

    return keys
      .map((k) => ({ key: k, label: (SERVICES as Record<string, string>)[k] || prettify(k), value: Number(by[k] ?? 0) }))
      .sort((a, b) => b.value - a.value)
      .map((s, i) => ({ ...s, color: SERVICE_COLORS[i % SERVICE_COLORS.length] }));
  }, [stats]);

  const serviceTotal = services.reduce((sum, s) => sum + s.value, 0);
  const serviceMax = Math.max(1, ...services.map((s) => s.value));
  const slices = STATUS_CARDS.map((c) => ({ label: c.label, value: stats?.by_status?.[c.key] ?? 0, color: c.color }));
  const partnerLabel = PARTNERS.find((p) => p.value === partner)?.label;

  // Khusus super_admin & admin
  if (!isFullAdmin) return <Navigate to="/admin/multi-finance" replace />;

  return (
    <div>
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-red-500/20 blur-3xl" aria-hidden="true" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-200">Summary Multifinance</p>
            <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">Ringkasan seluruh pengajuan{partner ? ` · ${partnerLabel}` : ""}</h1>
            <p className="mt-1 text-sm text-gray-300">Hanya terlihat oleh Super Admin dan Admin.</p>
          </div>

          <div className="shrink-0 rounded-2xl bg-white/10 px-6 py-4 backdrop-blur">
            <p className="text-xs font-semibold text-gray-300">Total semua pengajuan</p>
            <p className="mt-1 text-4xl font-extrabold">{stats ? num(stats.total) : <span className="inline-block h-9 w-20 animate-pulse rounded bg-white/20" />}</p>
          </div>
        </div>

        {/* Tab partner */}
        <div role="tablist" aria-label="Pilih partner" className="relative mt-6 flex flex-wrap gap-2">
          {PARTNERS.map((p) => {
            const active = partner === p.value;
            return (
              <button
                key={p.value || "all"}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setPartner(p.value)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${active ? "bg-white text-gray-900" : "bg-white/10 text-white hover:bg-white/20"}`}>
                {p.label}
              </button>
            );
          })}
        </div>
      </section>

      {error && (
        <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className={`transition-opacity ${loading && stats ? "opacity-50" : ""}`}>
        {/* ===== Perbandingan periode ===== */}
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

        {/* ===== Layanan ===== */}
        <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-5" aria-label="Rincian per layanan">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 font-extrabold text-gray-900">
              <Layers className="h-4 w-4 text-red-600" />
              Pengajuan per layanan
            </h2>
            {stats && <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">{num(serviceTotal)} pengajuan</span>}
          </div>

          {!stats ? (
            <div className="grid gap-3 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />
              ))}
            </div>
          ) : (
            <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {services.map((s) => {
                const share = serviceTotal > 0 ? Math.round((s.value / serviceTotal) * 100) : 0;
                return (
                  <li key={s.key} className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="min-w-0 truncate text-sm font-bold text-gray-700" title={s.label}>
                        {s.label}
                      </p>
                      <p className="shrink-0 text-xl font-extrabold text-gray-900">{num(s.value)}</p>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200" role="progressbar" aria-valuenow={share} aria-valuemin={0} aria-valuemax={100} aria-label={`${s.label} ${share}%`}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${(s.value / serviceMax) * 100}%`, background: s.color }} />
                    </div>

                    <p className="mt-1.5 text-xs font-semibold text-gray-400">{share}% dari total</p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* ===== Ringkasan status ===== */}
        <section className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-5" aria-label="Ringkasan status">
          {STATUS_CARDS.map(({ key, label, icon: Icon, tone }) => (
            <div key={key} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-extrabold leading-none text-gray-900">{stats ? num(stats.by_status?.[key] ?? 0) : <span className="inline-block h-6 w-8 animate-pulse rounded bg-gray-100" />}</p>
                <p className="mt-1 truncate text-xs font-semibold text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ===== Grafik ===== */}
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

        {/* ===== Perbandingan partner (tampilan "Semua") ===== */}
        {!partner && stats?.partners && (
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

        {/* ===== Pengajuan terbaru ===== */}
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
            <p className="px-5 py-12 text-center text-sm text-gray-500">Belum ada pengajuan masuk.</p>
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
                      <td className="px-5 py-4 font-semibold text-gray-700">{(SERVICES as Record<string, string>)[a.service_type] || a.service_type}</td>
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
