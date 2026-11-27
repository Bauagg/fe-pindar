import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, ChevronLeft, ChevronRight, HandCoins, Search } from "lucide-react";
import { errMsg, request } from "./api";
import { useAuth } from "./auth";
import { BASE } from "./config";
import { ClaimModal } from "./ClaimModal";
import { ErrorBox, ProductBadge, Spinner, btnGhost, btnPrimary, card, fmtDate, inputCls } from "./ui";

type Product = "" | "multifinance" | "kartu_kredit" | "pinjaman_bank";
type Scope = "" | "available" | "mine" | "taken";

interface BiddingRow {
  id: number;
  product: Exclude<Product, "">;
  product_label: string;
  name: string;
  phone: string | null;
  state: "available" | "mine" | "taken";
  can_claim: boolean;
  shared_at: string;
  claimed_at: string | null;
}

interface BiddingList {
  data: BiddingRow[];
  meta: { current_page: number; last_page: number; per_page: number; total: number; quota: number };
}

const PRODUCTS: { key: Product; label: string }[] = [
  { key: "", label: "Semua" },
  { key: "multifinance", label: "Multifinance" },
  { key: "kartu_kredit", label: "Kartu Kredit" },
  { key: "pinjaman_bank", label: "Pinjaman Bank" },
];

const SCOPES: { key: Scope; label: string }[] = [
  { key: "", label: "Semua data" },
  { key: "available", label: "Belum diclaim" },
  { key: "mine", label: "Diclaim saya" },
  { key: "taken", label: "Diclaim client lain" },
];

const PER_PAGE_OPTIONS = [10, 20, 50];

function StateBadge({ state }: { state: BiddingRow["state"] }) {
  if (state === "mine") {
    return <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">Diclaim saya</span>;
  }
  if (state === "taken") {
    return <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-500 ring-1 ring-gray-200">Sudah diclaim</span>;
  }
  return <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200">Tersedia</span>;
}

export default function DataPage() {
  const navigate = useNavigate();
  const { client, setQuota } = useAuth();
  const [params, setParams] = useState(() => new URLSearchParams(window.location.search));

  const initialScope = params.get("scope");
  const [product, setProduct] = useState<Product>("");
  const [scope, setScope] = useState<Scope>(initialScope === "available" || initialScope === "mine" || initialScope === "taken" ? initialScope : "");
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [res, setRes] = useState<BiddingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [claiming, setClaiming] = useState<BiddingRow | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setQ(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    const qs = new URLSearchParams({ page: String(page), limit: String(perPage) });
    if (product) qs.set("product", product);
    if (scope) qs.set("scope", scope);
    if (q) qs.set("search", q);

    try {
      const r = await request<BiddingList>(`/bidding-client/bidding?${qs}`);
      setRes(r);
      setQuota(r.meta.quota);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, scope, q, page, perPage]);

  useEffect(() => {
    load();
  }, [load]);

  const pickScope = (s: Scope) => {
    setScope(s);
    setPage(1);
    const next = new URLSearchParams(params);
    s ? next.set("scope", s) : next.delete("scope");
    setParams(next);
    window.history.replaceState(null, "", `${window.location.pathname}${next.toString() ? `?${next}` : ""}`);
  };

  const rows = res?.data ?? [];
  const meta = res?.meta;
  const hasFilter = Boolean(product || scope || q);
  const quota = client?.quota ?? 0;

  const openRow = (r: BiddingRow) => {
    if (r.state === "mine") navigate(`${BASE}/bidding/${r.product}/${r.id}`);
    else if (r.state === "available" && quota > 0) setClaiming(r);
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900">Data bidding</h1>
      <p className="mt-1 text-sm text-gray-500">Claim data untuk melihat detail lengkapnya. Nomor telepon disamarkan sampai data kamu ambil.</p>

      {quota <= 0 && (
        <p role="status" className="mt-5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          Kuota kamu habis, jadi belum bisa mengclaim data baru. Hubungi admin untuk menambah kuota.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter produk" className="flex flex-wrap items-center gap-2">
          {PRODUCTS.map((p) => {
            const active = product === p.key;
            return (
              <button
                key={p.key || "all"}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setProduct(p.key);
                  setPage(1);
                }}
                className={`rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 ${
                  active ? "bg-red-600 text-white" : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
                }`}>
                {p.label}
              </button>
            );
          })}
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
          <select value={scope} onChange={(e) => pickScope(e.target.value as Scope)} aria-label="Filter status data" className={`${inputCls} sm:w-52`}>
            {SCOPES.map((o) => (
              <option key={o.key || "all"} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>

          <div className="relative w-full sm:flex-1 lg:w-72 lg:flex-none">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama atau no. pengajuan" aria-label="Cari data bidding" className={`${inputCls} pl-11`} />
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6">
          <ErrorBox>{error}</ErrorBox>
        </div>
      )}

      <section className={`${card} mt-6 overflow-hidden`}>
        {loading && !res ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : rows.length === 0 ? (
          <p className="px-5 py-16 text-center text-sm text-gray-500">{hasFilter ? "Tidak ada data yang cocok dengan filter ini." : "Belum ada data bidding."}</p>
        ) : (
          <div className={`overflow-x-auto transition-opacity ${loading ? "opacity-50" : ""}`}>
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-gray-100 text-xs font-bold text-gray-400">
                <tr>
                  <th className="px-5 py-3">Nama</th>
                  <th className="px-5 py-3">Telepon</th>
                  <th className="px-5 py-3">Produk</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Tanggal</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((r) => {
                  const taken = r.state === "taken";
                  return (
                    <tr key={`${r.product}-${r.id}`} className={taken ? "bg-gray-50/60 text-gray-400" : "transition-colors hover:bg-gray-50/70"}>
                      <td className="px-5 py-4 font-semibold">
                        {r.state === "mine" ? (
                          <Link to={`${BASE}/bidding/${r.product}/${r.id}`} className="text-gray-900 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
                            {r.name}
                          </Link>
                        ) : (
                          <span className={taken ? "" : "text-gray-900"}>{r.name}</span>
                        )}
                      </td>
                      <td className="px-5 py-4 font-semibold tracking-wide">{r.phone ?? "-"}</td>
                      <td className="px-5 py-4">
                        <ProductBadge label={r.product_label} />
                      </td>
                      <td className="px-5 py-4">
                        <StateBadge state={r.state} />
                      </td>
                      <td className="px-5 py-4">{fmtDate(r.state === "mine" ? r.claimed_at : r.shared_at)}</td>
                      <td className="px-5 py-4 text-right">
                        {r.state === "available" && (
                          <button type="button" onClick={() => openRow(r)} disabled={!r.can_claim || quota < 1} title={quota < 1 ? "Kuota habis" : undefined} className={`${btnPrimary} !px-3 !py-1.5 !text-xs`}>
                            <HandCoins className="h-3.5 w-3.5" aria-hidden="true" />
                            Claim data
                          </button>
                        )}
                        {r.state === "mine" && (
                          <Link to={`${BASE}/bidding/${r.product}/${r.id}`} className={`${btnGhost} !px-3 !py-1.5 !text-xs`}>
                            Lihat detail
                          </Link>
                        )}
                        {taken && <span className="text-xs font-semibold">Tidak tersedia</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {meta && meta.total > 0 && (
          <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-gray-500">
              Halaman <b className="text-gray-900">{meta.current_page}</b> dari {meta.last_page} · {meta.total} data
            </p>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <label className="flex items-center gap-2 text-gray-500">
                Tampilkan
                <select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(Number(e.target.value));
                    setPage(1);
                  }}
                  aria-label="Jumlah data per halaman"
                  className="rounded-lg bg-white px-2 py-1.5 text-sm font-bold text-gray-700 ring-1 ring-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
                  {PER_PAGE_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex gap-2">
                <button onClick={() => setPage((p) => p - 1)} disabled={meta.current_page <= 1 || loading} aria-label="Halaman sebelumnya" className="rounded-lg p-2 text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-40">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={meta.current_page >= meta.last_page || loading}
                  aria-label="Halaman berikutnya"
                  className="rounded-lg p-2 text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-40">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {claiming && (
        <ClaimModal
          product={claiming.product}
          id={claiming.id}
          label={claiming.name}
          onClose={() => setClaiming(null)}
          onStale={load}
          onClaimed={() => {
            const r = claiming;
            setClaiming(null);
            navigate(`${BASE}/bidding/${r.product}/${r.id}`);
          }}
        />
      )}
    </div>
  );
}
