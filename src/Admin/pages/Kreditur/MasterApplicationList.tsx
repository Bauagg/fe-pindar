import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { api, errorMessage } from "../../api";
import { STATUS } from "../../constants";
import StatusBadge from "../../components/StatusBadge";
import { card, inputCls } from "../../components/ui";
import { fmtDate } from "../../utils";
import type { Application, Paginated, StatusKey } from "../../types";
import { ApplicantBadge } from "../../components/AssetCell";
import ActivityNote, { UnreadDot } from "../../components/ActivityNote";
// StatusDropdown dipindah ke file sendiri (export default + export type Filter)
import StatusDropdown, { type Filter } from "../../features/finance-apps/StatusDropdown";
import PerPageSelect from "../../features/finance-apps/PerPageSelect";

const POLL_MS = 30000;
const PER_PAGE_OPTIONS = [10, 20, 50];
const MAX_PER_PAGE = 50; // batas di backend

export type ListConfig = {
  /** Prefix endpoint admin, mis. "/admin/credit-card" */
  api: string;
  /** Nama field produk di data (card_name / bank_name) */
  productKey: string;
  /** Nama key di response /stats untuk isi dropdown (by_card / by_bank) */
  statsKey: string;
  /** Query param filter produk di BE (card_name / bank_name) */
  filterParam: string;
  /** Label kolom & dropdown, mis. "Kartu" / "Bank" */
  productLabel: string;
  /** Tampilkan kolom perusahaan (pinjaman bank) */
  hasCompany?: boolean;
  /** Route halaman detail */
  detailRoute: (id: number | string) => string;
};

type Props = {
  config: ListConfig;
  title: string;
  description?: string;
  /** Default: `${config.api}/all` (khusus super_admin & admin). Isi `config.api` sendiri untuk role partner. */
  endpoint?: string;
  /** Filter slug role, dikirim sebagai ?role=..., mis. "admin_bca" */
  role?: string;
  /** Kunci status (mis. "approved"). Dropdown status disembunyikan. */
  lockedStatus?: StatusKey;
};

export default function MasterApplicationList({ config, title, description, endpoint, role, lockedStatus }: Props) {
  const navigate = useNavigate();
  const listUrl = endpoint ?? `${config.api}/all`;
  const isAllEndpoint = listUrl.endsWith("/all");

  const [status, setStatus] = useState<Filter>("");
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [product, setProduct] = useState("");
  const [productOptions, setProductOptions] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [res, setRes] = useState<Paginated<Application> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);
  const silent = useRef(false);

  // Pindah halaman (mis. BCA -> Mandiri): reset filter & data
  useEffect(() => {
    setStatus("");
    setSearch("");
    setQ("");
    setProduct("");
    setPage(1);
    setRes(null);
    setLoading(true);
  }, [listUrl, role, lockedStatus]);

  // Opsi dropdown produk diambil dari /stats (mengikuti role)
  useEffect(() => {
    let alive = true;
    const qs = isAllEndpoint && role ? `?role=${encodeURIComponent(role)}` : "";

    api<{ data: Record<string, unknown> }>(`${config.api}/stats${qs}`)
      .then((r) => {
        if (!alive) return;
        const map = (r.data?.[config.statsKey] ?? {}) as Record<string, number>;
        setProductOptions(Object.keys(map).filter(Boolean));
      })
      .catch(() => alive && setProductOptions([]));

    return () => {
      alive = false;
    };
  }, [config.api, config.statsKey, isAllEndpoint, role]);

  // Tunda pencarian 400ms
  useEffect(() => {
    const t = setTimeout(() => {
      setQ(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Refresh otomatis tanpa efek loading
  useEffect(() => {
    const t = setInterval(() => {
      if (document.visibilityState === "visible") {
        silent.current = true;
        setTick((n) => n + 1);
      }
    }, POLL_MS);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let alive = true;
    const quiet = silent.current;
    silent.current = false;

    if (!quiet) setLoading(true);
    setError("");

    const params = new URLSearchParams({ page: String(page), limit: String(perPage) });
    if (status === "unread") params.set("unread", "1");

    const effectiveStatus = lockedStatus ?? (status && status !== "unread" ? status : "");
    if (effectiveStatus) params.set("status", effectiveStatus);

    if (isAllEndpoint && role) params.set("role", role);
    if (product) params.set(config.filterParam, product);
    if (q) params.set("search", q);

    api<Paginated<Application>>(`${listUrl}?${params}`)
      .then((r) => alive && setRes(r))
      .catch((e) => alive && setError(errorMessage(e)))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [listUrl, isAllEndpoint, role, lockedStatus, status, product, q, page, perPage, tick, config.filterParam]);

  const rows = res?.data ?? [];
  const meta = res?.meta;

  const changeStatus = (v: Filter) => {
    setStatus(v);
    setPage(1);
  };

  const changePerPage = (n: number) => {
    setPerPage(n);
    setPage(1);
  };

  const hasFilter = Boolean(q || product || (!lockedStatus && status && status !== "unread"));
  const colMin = config.hasCompany ? "min-w-[920px]" : "min-w-[780px]";

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900">{title}</h1>
      <p className="mt-1 text-sm text-gray-500">{description ?? "Semua pengajuan yang bisa diakses role kamu."}</p>

      {/* Filter bar */}
      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter pengajuan" className="flex flex-wrap items-center gap-2">
          {!lockedStatus && <StatusDropdown value={status} onChange={changeStatus} />}
          <PerPageSelect pill value={perPage} options={PER_PAGE_OPTIONS} max={MAX_PER_PAGE} onChange={changePerPage} />
          {meta && (
            <span aria-live="polite" className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1.5 text-sm font-bold text-gray-600">
              {meta.total.toLocaleString("id-ID")} Pengajuan
            </span>
          )}
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
          <select
            value={product}
            onChange={(e) => {
              setProduct(e.target.value);
              setPage(1);
            }}
            aria-label={`Filter ${config.productLabel.toLowerCase()}`}
            className={`${inputCls} sm:w-52`}>
            <option value="">Semua {config.productLabel.toLowerCase()}</option>
            {productOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>

          <div className="relative w-full sm:flex-1 lg:w-80 lg:flex-none">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={config.hasCompany ? "Cari nama, telepon, perusahaan, no. pengajuan" : "Cari nama, telepon, no. pengajuan"}
              aria-label="Cari pengajuan"
              className={`${inputCls} pl-11`}
            />
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
          <p className="px-5 py-16 text-center text-sm text-gray-500">{hasFilter ? "Tidak ada pengajuan yang cocok dengan filter ini." : "Belum ada pengajuan."}</p>
        ) : (
          <div className={`overflow-x-auto transition-opacity ${loading ? "opacity-50" : ""}`}>
            <table className={`w-full ${colMin} text-left text-sm`}>
              <thead className="border-b border-gray-100 text-xs font-bold text-gray-400">
                <tr>
                  <th className="px-5 py-3">Pemohon</th>
                  <th className="px-5 py-3">{config.productLabel}</th>
                  {config.hasCompany && <th className="px-5 py-3">Perusahaan</th>}
                  <th className="px-5 py-3">Tanggal</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((a) => {
                  const isUnread = a.is_read === false;
                  const go = config.detailRoute(a.id);
                  const row = a as unknown as Record<string, any>;

                  return (
                    <tr key={a.id} onClick={() => navigate(go)} className={`cursor-pointer transition-colors ${isUnread ? "bg-red-50/60 hover:bg-red-50" : "hover:bg-gray-50/70"}`}>
                      <td className="relative px-5 py-4">
                        {isUnread && <span className="absolute inset-y-0 left-0 w-1 bg-red-500" aria-hidden="true" />}
                        <div className="flex items-center gap-2">
                          {isUnread && <UnreadDot />}
                          <Link
                            to={go}
                            onClick={(e) => e.stopPropagation()}
                            className={`text-gray-900 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 ${isUnread ? "font-extrabold" : "font-semibold"}`}>
                            {a.applicant?.name}
                          </Link>
                          <ApplicantBadge type={a.applicant?.type} />
                          {isUnread && <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white">Baru</span>}
                        </div>
                        <p className="text-xs text-gray-400">
                          {a.application_number} · {a.applicant?.phone}
                        </p>
                        <ActivityNote activity={a.latest_activity} unread={isUnread} />
                      </td>
                      <td className={`px-5 py-4 ${isUnread ? "font-bold text-gray-800" : "font-semibold text-gray-600"}`}>{row[config.productKey] || "-"}</td>
                      {config.hasCompany && (
                        <td className="max-w-[220px] px-5 py-4 text-gray-600">
                          <p className="truncate font-semibold" title={row.company?.name}>
                            {row.company?.name || "-"}
                          </p>
                        </td>
                      )}
                      <td className="px-5 py-4 text-gray-600">{fmtDate(a.created_at)}</td>
                      <td className="px-5 py-4">
                        <StatusBadge value={a.status.value} />
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
              Halaman <b className="text-gray-900">{meta.current_page}</b> dari {meta.last_page} · {meta.total} pengajuan
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
              <PerPageSelect value={perPage} options={PER_PAGE_OPTIONS} max={MAX_PER_PAGE} onChange={changePerPage} />

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
