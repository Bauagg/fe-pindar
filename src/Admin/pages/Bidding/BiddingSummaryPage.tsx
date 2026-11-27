import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarPlus, CheckCircle2, Database, HandCoins, Inbox, Loader2, RefreshCw, Trophy, UserCheck, Users } from "lucide-react";
import { api, errorMessage } from "../../api";
import { card } from "../../components/ui";
import { fmtDate } from "../../utils";
import { ProductBadge } from "./BiddingPage";

interface ProductStat {
  product: "multifinance" | "kartu_kredit" | "pinjaman_bank";
  label: string;
  total: number;
  claimed: number;
  available: number;
}

interface RecentClaim {
  id: number;
  product: string;
  product_label: string;
  name: string | null;
  shared_at: string;
  claimed_at: string | null;
  client_name: string | null;
}

interface TopClient {
  client_id: number;
  name: string | null;
  total: number;
}

interface Summary {
  total_shared: number;
  total_claimed: number;
  total_available: number;
  shared_today: number;
  claimed_today: number;
  by_product: ProductStat[];
  clients: {
    total: number;
    pending_approval: number;
    by_status: Partial<Record<"pending" | "active" | "inactive", number>>;
  };
  recent_claims: RecentClaim[];
  top_clients: TopClient[];
}

const CLIENT_STATUS: { key: "pending" | "active" | "inactive"; label: string; tone: string }[] = [
  { key: "pending", label: "Menunggu persetujuan", tone: "bg-amber-50 text-amber-700 ring-amber-200" },
  { key: "active", label: "Aktif", tone: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  { key: "inactive", label: "Nonaktif", tone: "bg-gray-100 text-gray-600 ring-gray-200" },
];

const nf = new Intl.NumberFormat("id-ID");

function StatCard({ icon: Icon, label, value, tone, hint }: { icon: React.ElementType; label: string; value: number; tone: string; hint?: string }) {
  return (
    <div className={`${card} p-5`}>
      <div className="flex items-center gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="text-sm font-semibold text-gray-500">{label}</p>
      </div>
      <p className="mt-3 text-3xl font-extrabold text-gray-900">{nf.format(value)}</p>
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

function Panel({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className={`${card} overflow-hidden`}>
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-3">
        <h2 className="text-sm font-extrabold text-gray-900">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  );
}

export default function BiddingSummaryPage() {
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const r = await api<{ data: Summary }>("/admin/bidding/summary");
      setData(r.data);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const header = (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Ringkasan bidding</h1>
        <p className="mt-1 text-sm text-gray-500">Gambaran data yang dibagikan ke bidding dan aktivitas client.</p>
      </div>
      <button
        type="button"
        onClick={load}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 disabled:opacity-50">
        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
        Muat ulang
      </button>
    </div>
  );

  if (loading && !data) {
    return (
      <div>
        {header}
        <div className="flex justify-center py-24">
          <Loader2 className="h-5 w-5 animate-spin text-red-600" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        {header}
        <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error || "Data ringkasan tidak tersedia."}
        </div>
      </div>
    );
  }

  const claimedPct = data.total_shared > 0 ? Math.round((data.total_claimed / data.total_shared) * 100) : 0;

  return (
    <div>
      {header}

      {error && (
        <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* Kartu angka utama */}
      <div className={`mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 transition-opacity ${loading ? "opacity-60" : ""}`}>
        <StatCard icon={Database} label="Total di bidding" value={data.total_shared} tone="bg-sky-50 text-sky-600" hint={`${data.shared_today} dibagikan hari ini`} />
        <StatCard icon={Inbox} label="Belum diambil" value={data.total_available} tone="bg-amber-50 text-amber-600" />
        <StatCard icon={CheckCircle2} label="Sudah diambil" value={data.total_claimed} tone="bg-emerald-50 text-emerald-600" hint={`${claimedPct}% dari total · ${data.claimed_today} hari ini`} />
        <StatCard icon={CalendarPlus} label="Dibagikan hari ini" value={data.shared_today} tone="bg-violet-50 text-violet-600" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Per produk */}
        <div className="lg:col-span-2">
          <Panel title="Per produk">
            <ul className="divide-y divide-gray-50">
              {data.by_product.map((p) => {
                const pct = p.total > 0 ? Math.round((p.claimed / p.total) * 100) : 0;
                return (
                  <li key={p.product} className="px-5 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <ProductBadge label={p.label} />
                      <p className="text-sm text-gray-500">
                        <b className="text-gray-900">{nf.format(p.total)}</b> data · {nf.format(p.claimed)} diambil · {nf.format(p.available)} tersedia
                      </p>
                    </div>
                    <div role="progressbar" aria-label={`Persentase ${p.label} yang sudah diambil`} aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-gray-400">{pct}% sudah diambil</p>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>

        {/* Client */}
        <Panel
          title="Client bidding"
          right={
            <Link to="/admin/bidding/clients" className="text-xs font-bold text-red-600 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
              Kelola
            </Link>
          }>
          <div className="px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <Users className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-2xl font-extrabold text-gray-900">{nf.format(data.clients.total)}</p>
                <p className="text-xs text-gray-400">Total client terdaftar</p>
              </div>
            </div>

            {data.clients.pending_approval > 0 && (
              <Link
                to="/admin/bidding/clients?status=pending"
                className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-sm font-bold text-amber-800 ring-1 ring-amber-200 hover:bg-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
                <UserCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                {data.clients.pending_approval} client menunggu persetujuan
              </Link>
            )}

            <ul className="mt-4 space-y-2">
              {CLIENT_STATUS.map((s) => (
                <li key={s.key} className="flex items-center justify-between text-sm">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${s.tone}`}>{s.label}</span>
                  <b className="text-gray-900">{nf.format(data.clients.by_status[s.key] ?? 0)}</b>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Pengambilan terbaru */}
        <div className="lg:col-span-2">
          <Panel title="Pengambilan terbaru" right={<HandCoins className="h-4 w-4 text-gray-400" aria-hidden="true" />}>
            {data.recent_claims.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-gray-500">Belum ada data yang diambil client.</p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {data.recent_claims.map((r) => (
                  <li key={`${r.product}-${r.id}`}>
                    <Link to={`/admin/bidding/${r.product}/${r.id}`} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 hover:bg-gray-50/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">{r.name ?? "-"}</p>
                        <p className="mt-0.5 text-xs text-gray-400">
                          Diambil oleh <b className="text-gray-600">{r.client_name ?? "-"}</b>
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <ProductBadge label={r.product_label} />
                        <span className="text-xs text-gray-400">{r.claimed_at ? fmtDate(r.claimed_at) : ""}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        {/* Client paling aktif */}
        <Panel title="Client paling aktif" right={<Trophy className="h-4 w-4 text-gray-400" aria-hidden="true" />}>
          {data.top_clients.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-gray-500">Belum ada data.</p>
          ) : (
            <ol className="divide-y divide-gray-50">
              {data.top_clients.map((c, i) => (
                <li key={c.client_id} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-extrabold text-gray-600">{i + 1}</span>
                  <p className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-900">{c.name ?? "-"}</p>
                  <span className="text-sm text-gray-500">
                    <b className="text-gray-900">{nf.format(c.total)}</b> data
                  </span>
                </li>
              ))}
            </ol>
          )}
        </Panel>
      </div>
    </div>
  );
}
