import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Bell, ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { ActivityNote, StatusBadge, UnreadDot, api, card, errorMessage, inputCls } from "./shared";
import type { ModuleConfig } from "./config";
import type { Application, Paginated } from "./types";
import { fmtDate } from "./format";
import { Alert } from "./ui-parts";
import StatusDropdown, { type Filter } from "./StatusDropdown";
import PerPageSelect from "./PerPageSelect";

const POLL_MS = 30000;
const PER_PAGE_OPTIONS = [10, 20, 50];
const MAX_PER_PAGE = 50; // batas di backend

type Props = {
  config: ModuleConfig;
  title: string;
  description?: string;
  /** true = semua pengajuan (khusus super_admin/admin, endpoint /all). false = sesuai role login. */
  all?: boolean;
  /** Filter slug role distribusi (hanya berlaku saat all). */
  role?: string;
  /** Kunci status, mis. "approved". Dropdown status disembunyikan. */
  lockedStatus?: string;
  /** Tampilkan tab Semua / Belum dibaca + badge pembaruan. */
  showUnread?: boolean;
  /** Slot tombol di kanan judul (mis. export). */
  actions?: React.ReactNode;
};

export default function ApplicationListPage({ config, title, description, all = false, role, lockedStatus, showUnread = true, actions }: Props) {
  const navigate = useNavigate();
  const endpoint = all ? `${config.api.admin}/all` : config.api.admin;
  const [sp] = useSearchParams();
  const dummy = sp.get("role_dummy");
  const [status, setStatus] = useState<Filter>("");
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [res, setRes] = useState<Paginated<Application> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);
  const silent = useRef(false);

  // Pindah halaman/modul: reset filter & data
  useEffect(() => {
    setStatus("");
    setSearch("");
    setQ("");
    setPage(1);
    setRes(null);
    setLoading(true);
  }, [endpoint, role, lockedStatus]);

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
    if (all && role) params.set("role", role);
    if (q) params.set("search", q);
    if (dummy) params.set("role_dummy", dummy);

    api<Paginated<Application>>(`${endpoint}?${params}`)
      .then((r) => alive && setRes(r))
      .catch((e) => alive && setError(errorMessage(e)))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [endpoint, all, role, lockedStatus, status, q, page, perPage, tick]);

  const rows = res?.data ?? [];
  const meta = res?.meta;
  const unread = meta?.unread_count ?? 0;
  const hasFilter = Boolean(q || (!lockedStatus && status && status !== "unread"));

  const changeStatus = (v: Filter) => {
    setStatus(v);
    setPage(1);
  };

  const changePerPage = (n: number) => {
    setPerPage(n);
    setPage(1);
  };

  const quickTabs: { key: Filter; label: string }[] = [{ key: "", label: "Semua" }];

  const colSpanMin = config.hasCompany ? "min-w-[920px]" : "min-w-[780px]";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-extrabold text-gray-900">{title}</h1>
          {showUnread && unread > 0 && (
            <button
              type="button"
              onClick={() => changeStatus("unread")}
              className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-sm shadow-red-200 hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
              <Bell className="h-3.5 w-3.5" />
              {unread} pembaruan baru
            </button>
          )}
        </div>
        {actions}
      </div>
      <p className="mt-1 text-sm text-gray-500">{description ?? `Semua pengajuan ${config.title.toLowerCase()} yang bisa diakses role kamu.`}</p>

      {/* Filter bar */}
      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter pengajuan" className="flex flex-wrap items-center gap-2">
          {showUnread &&
            quickTabs.map((t) => {
              const active = status === t.key;
              const isUnreadTab = t.key === "unread";
              return (
                <button
                  key={t.key || "all"}
                  type="button"
                  aria-pressed={active}
                  onClick={() => changeStatus(t.key)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 ${
                    active ? "bg-red-600 text-white" : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
                  }`}>
                  {t.label}
                  {isUnreadTab && unread > 0 && <span className={`rounded-full px-1.5 py-0.5 text-[11px] leading-none ${active ? "bg-white text-red-600" : "bg-red-600 text-white"}`}>{unread}</span>}
                </button>
              );
            })}
          {!lockedStatus && <StatusDropdown value={status} onChange={changeStatus} />}
          <PerPageSelect pill value={perPage} options={PER_PAGE_OPTIONS} max={MAX_PER_PAGE} onChange={changePerPage} />
        </div>

        <div className="relative w-full lg:w-96">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={config.hasCompany ? "Cari nama, telepon, perusahaan, no. pengajuan" : "Cari nama, telepon, kartu, no. pengajuan"}
            aria-label="Cari pengajuan"
            className={`${inputCls} pl-11`}
          />
        </div>
      </div>

      {error && (
        <div className="mt-6">
          <Alert>{error}</Alert>
        </div>
      )}

      <section className={`${card} mt-6 overflow-hidden`}>
        {loading && !res ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-red-600" />
          </div>
        ) : rows.length === 0 ? (
          <p className="px-5 py-16 text-center text-sm text-gray-500">{status === "unread" ? "Semua pengajuan sudah dibaca. 🎉" : hasFilter ? "Tidak ada pengajuan yang cocok dengan filter ini." : "Belum ada pengajuan masuk."}</p>
        ) : (
          <div className={`overflow-x-auto transition-opacity ${loading ? "opacity-50" : ""}`}>
            <table className={`w-full ${colSpanMin} text-left text-sm`}>
              <thead className="border-b border-gray-100 text-xs font-bold text-gray-400">
                <tr>
                  <th className="px-5 py-3">Pemohon</th>
                  <th className="px-5 py-3">{config.productLabel.replace(/^Nama /, "").replace(/^./, (c) => c.toUpperCase())}</th>
                  {config.hasCompany && <th className="px-5 py-3">Perusahaan</th>}
                  <th className="px-5 py-3">Tanggal</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((a) => {
                  const isUnread = a.is_read === false;
                  const go = config.routes.detail(a.id);

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
                          {isUnread && <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white">Baru</span>}
                        </div>
                        <p className="text-xs text-gray-400">
                          {a.application_number} · {a.applicant?.phone}
                        </p>
                        <ActivityNote activity={a.latest_activity} unread={isUnread} />
                      </td>
                      <td className={`px-5 py-4 ${isUnread ? "font-bold text-gray-800" : "font-semibold text-gray-600"}`}>{a[config.productKey] || "-"}</td>
                      {config.hasCompany && (
                        <td className="max-w-[220px] px-5 py-4 text-gray-600">
                          <p className="truncate font-semibold" title={a.company?.name}>
                            {a.company?.name || "-"}
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
          <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-3 text-sm lg:flex-row lg:items-center lg:justify-between">
            <p className="text-gray-500">
              Halaman <b className="text-gray-900">{meta.current_page}</b> dari {meta.last_page} · {meta.total} pengajuan
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 lg:justify-end">
              <PerPageSelect
                value={perPage}
                options={PER_PAGE_OPTIONS}
                max={MAX_PER_PAGE}
                onChange={(n) => {
                  setPerPage(n);
                  setPage(1);
                }}
              />

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
