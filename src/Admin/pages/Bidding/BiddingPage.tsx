import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronLeft, ChevronRight, CircleDashed, Loader2, Search } from "lucide-react";
import { api, errorMessage } from "../../api";
import { card, inputCls } from "../../components/ui";
import { fmtDate } from "../../utils";

type Product = "" | "multifinance" | "kartu_kredit" | "pinjaman_bank";
type Complete = "" | "1" | "0";

interface BiddingRow {
  id: number;
  product: Exclude<Product, "">;
  product_label: string;
  name: string;
  phone: string | null; // sudah disamarkan backend: 081*****
  is_complete: boolean;
  created_at: string;
}

interface BiddingList {
  data: BiddingRow[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
}

const PRODUCTS: { key: Product; label: string }[] = [
  { key: "", label: "Semua" },
  { key: "multifinance", label: "Multifinance" },
  { key: "kartu_kredit", label: "Kartu Kredit" },
  { key: "pinjaman_bank", label: "Pinjaman Bank" },
];

const COMPLETE_OPTIONS: { key: Complete; label: string }[] = [
  { key: "", label: "Semua kelengkapan" },
  { key: "1", label: "Lengkap" },
  { key: "0", label: "Belum lengkap" },
];

const PER_PAGE_OPTIONS = [10, 20, 50];

export function CompleteBadge({ value }: { value: boolean }) {
  return value ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
      Lengkap
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200">
      <CircleDashed className="h-3.5 w-3.5" aria-hidden="true" />
      Belum lengkap
    </span>
  );
}

export function ProductBadge({ label }: { label: string }) {
  return <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700">{label}</span>;
}

export default function BiddingPage() {
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product>("");
  const [complete, setComplete] = useState<Complete>("");
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [res, setRes] = useState<BiddingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Tunda pencarian 400ms
  useEffect(() => {
    const t = setTimeout(() => {
      setQ(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");

    const params = new URLSearchParams({ page: String(page), limit: String(perPage) });
    if (product) params.set("product", product);
    if (complete) params.set("complete", complete);
    if (q) params.set("search", q);

    api<BiddingList>(`/admin/bidding?${params}`)
      .then((r) => alive && setRes(r))
      .catch((e) => alive && setError(errorMessage(e)))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [product, complete, q, page, perPage]);

  const rows = res?.data ?? [];
  const meta = res?.meta;
  const hasFilter = Boolean(product || complete || q);

  const detailPath = (r: BiddingRow) => `/admin/bidding/${r.product}/${r.id}`;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900">Bidding</h1>
      <p className="mt-1 text-sm text-gray-500">Gabungan data multifinance, kartu kredit, dan pinjaman bank. Nomor telepon disamarkan di daftar.</p>

      {/* Filter bar */}
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
          <select
            value={complete}
            onChange={(e) => {
              setComplete(e.target.value as Complete);
              setPage(1);
            }}
            aria-label="Filter kelengkapan data"
            className={`${inputCls} sm:w-52`}>
            {COMPLETE_OPTIONS.map((o) => (
              <option key={o.key || "all"} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>

          <div className="relative w-full sm:flex-1 lg:w-80 lg:flex-none">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama atau no. pengajuan" aria-label="Cari bidding" className={`${inputCls} pl-11`} />
          </div>
        </div>
      </div>

      {error && (
        <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <section className={`${card} mt-6 overflow-hidden`}>
        {loading && !res ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-red-600" />
          </div>
        ) : rows.length === 0 ? (
          <p className="px-5 py-16 text-center text-sm text-gray-500">{hasFilter ? "Tidak ada data yang cocok dengan filter ini." : "Belum ada data bidding."}</p>
        ) : (
          <div className={`overflow-x-auto transition-opacity ${loading ? "opacity-50" : ""}`}>
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-gray-100 text-xs font-bold text-gray-400">
                <tr>
                  <th className="px-5 py-3">Nama</th>
                  <th className="px-5 py-3">Telepon</th>
                  <th className="px-5 py-3">Produk</th>
                  <th className="px-5 py-3">Kelengkapan</th>
                  <th className="px-5 py-3">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((r) => (
                  <tr key={`${r.product}-${r.id}`} onClick={() => navigate(detailPath(r))} className="cursor-pointer transition-colors hover:bg-gray-50/70">
                    <td className="px-5 py-4">
                      <Link to={detailPath(r)} onClick={(e) => e.stopPropagation()} className="font-semibold text-gray-900 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
                        {r.name}
                      </Link>
                    </td>
                    <td className="px-5 py-4 font-semibold tracking-wide text-gray-600">{r.phone ?? "-"}</td>
                    <td className="px-5 py-4">
                      <ProductBadge label={r.product_label} />
                    </td>
                    <td className="px-5 py-4">
                      <CompleteBadge value={r.is_complete} />
                    </td>
                    <td className="px-5 py-4 text-gray-600">{fmtDate(r.created_at)}</td>
                  </tr>
                ))}
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
    </div>
  );
}
