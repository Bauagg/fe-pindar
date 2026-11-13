import React, { useCallback, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { CheckCircle2, ChevronLeft, ChevronRight, Eye, Loader2, Pencil, Plus, Search, Trash2, Wallet, X } from "lucide-react";
import { api, errorMessage } from "../../api";
import { isFullAdmin, useAuth } from "../../auth/AuthContext";
import { card, inputCls } from "../../components/ui";
import DisbursementSummary from "./Disbursementsummary";
import { DisbursementDeleteModal, DisbursementDetailModal, DisbursementFormModal } from "./Disbursementmodals";
import { fmtDay, num, rupiah, serviceLabel } from "../../../utils/Utils";
import type { Disbursement, Paged } from "../../../utils/Utils";

const API = "/admin/disbursement-multifinance";
const PER_PAGE_OPTIONS = [10, 20, 50, 100]; // maksimal 100 (batas di backend)

export default function DisbursementMultifinancePage() {
  const { user } = useAuth();
  const allowed = isFullAdmin(user);

  const [res, setRes] = useState<Paged<Disbursement> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);

  // Popup
  const [form, setForm] = useState<{ open: boolean; item: Disbursement | null }>({ open: false, item: null });
  const [detail, setDetail] = useState<Disbursement | null>(null);
  const [del, setDel] = useState<Disbursement | null>(null);

  // Notifikasi singkat
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | undefined>(undefined);
  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 3500);
  }, []);
  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  // Tunda pencarian 400ms
  useEffect(() => {
    const t = setTimeout(() => {
      setQ(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Ambil daftar
  useEffect(() => {
    if (!allowed) return;

    let alive = true;
    setLoading(true);
    setError("");

    const params = new URLSearchParams({ page: String(page), limit: String(perPage) });
    if (q) params.set("search", q);
    if (start) params.set("start_date", start);
    if (end) params.set("end_date", end);

    api<Paged<Disbursement>>(`${API}?${params}`)
      .then((r) => alive && setRes(r))
      .catch((e) => alive && setError(errorMessage(e)))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [allowed, q, start, end, page, perPage, refreshKey]);

  const rows = res?.data ?? [];
  const meta = res?.meta;
  const hasFilter = Boolean(q || start || end);

  const reload = () => setRefreshKey((k) => k + 1);

  const clearFilters = () => {
    setSearch("");
    setQ("");
    setStart("");
    setEnd("");
    setPage(1);
  };

  const onSaved = (msg: string) => {
    notify(msg);
    setPage(1);
    reload();
  };

  const onDeleted = (msg: string) => {
    notify(msg);
    setDel(null);
    setDetail(null);
    // Kalau yang dihapus satu-satunya baris di halaman terakhir, mundur satu halaman
    if (rows.length === 1 && page > 1) setPage((p) => p - 1);
    reload();
  };

  if (!allowed) return <Navigate to="/admin/multi-finance" replace />;

  return (
    <div>
      {/* ===== Header ===== */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Disbursement Multifinance</h1>
          <p className="mt-1 text-sm text-gray-500">Catatan pencairan untuk pengajuan yang sudah disetujui.</p>
        </div>

        <button
          type="button"
          onClick={() => setForm({ open: true, item: null })}
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-red-200 transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500">
          <Plus className="h-4 w-4" />
          Catat pencairan
        </button>
      </div>

      {/* ===== Summary (komponen terpisah, bisa dipakai di halaman lain) ===== */}
      <DisbursementSummary className="mt-6" refreshKey={refreshKey} />

      {/* ===== Daftar ===== */}
      <h2 className="mb-3 mt-10 text-lg font-extrabold text-gray-900">Riwayat pencairan</h2>

      {/* Filter */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari no. pengajuan, nama, keterangan" aria-label="Cari pencairan" className={`${inputCls} pl-11`} />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="block text-xs font-bold text-gray-500">
            Dari tanggal
            <input
              type="date"
              value={start}
              max={end || undefined}
              onChange={(e) => {
                setStart(e.target.value);
                setPage(1);
              }}
              className={`${inputCls} mt-1 sm:w-44`}
            />
          </label>

          <label className="block text-xs font-bold text-gray-500">
            Sampai tanggal
            <input
              type="date"
              value={end}
              min={start || undefined}
              onChange={(e) => {
                setEnd(e.target.value);
                setPage(1);
              }}
              className={`${inputCls} mt-1 sm:w-44`}
            />
          </label>

          {hasFilter && (
            <button type="button" onClick={clearFilters} className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-500 ring-1 ring-gray-200 hover:bg-gray-50">
              <X className="h-4 w-4" /> Reset
            </button>
          )}
        </div>
      </div>

      {error && (
        <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <section className={`${card} mt-5 overflow-hidden`}>
        {loading && !res ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-red-600" />
          </div>
        ) : rows.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
              <Wallet className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-semibold text-gray-600">{hasFilter ? "Tidak ada pencairan yang cocok dengan filter ini." : "Belum ada pencairan yang dicatat."}</p>
            {!hasFilter && (
              <button type="button" onClick={() => setForm({ open: true, item: null })} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700">
                <Plus className="h-4 w-4" /> Catat pencairan pertama
              </button>
            )}
          </div>
        ) : (
          <div className={`overflow-x-auto transition-opacity ${loading ? "opacity-50" : ""}`}>
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="border-b border-gray-100 text-xs font-bold text-gray-400">
                <tr>
                  <th className="px-5 py-3">Tanggal</th>
                  <th className="px-5 py-3">Pengajuan</th>
                  <th className="px-5 py-3">Layanan</th>
                  <th className="px-5 py-3 text-right">Nominal</th>
                  <th className="px-5 py-3">Keterangan</th>
                  <th className="px-5 py-3">Dicatat oleh</th>
                  <th className="px-5 py-3 text-right">
                    <span className="sr-only">Aksi</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {rows.map((d) => (
                  <tr key={d.id} onClick={() => setDetail(d)} className="cursor-pointer transition-colors hover:bg-gray-50/70">
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-700">{fmtDay(d.disbursement_date)}</td>

                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-900">{d.application?.application_number ?? `#${d.application_id}`}</p>
                      <p className="text-xs text-gray-400">{d.application?.applicant_name}</p>
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-600">{serviceLabel(d.application?.service_type)}</td>

                    <td className="whitespace-nowrap px-5 py-4 text-right font-extrabold text-gray-900">{rupiah(d.amount)}</td>

                    <td className="max-w-[220px] px-5 py-4 text-gray-500">
                      <p className="truncate" title={d.description ?? undefined}>
                        {d.description?.trim() || "-"}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-gray-600">{d.creator?.name ?? "-"}</td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          aria-label={`Lihat detail pencairan ${d.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetail(d);
                          }}
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Edit pencairan ${d.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setForm({ open: true, item: d });
                          }}
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Hapus pencairan ${d.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDel(d);
                          }}
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {meta && meta.total > 0 && (
          <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-3 text-sm lg:flex-row lg:items-center lg:justify-between">
            <p className="text-gray-500">
              Halaman <b className="text-gray-900">{meta.current_page}</b> dari {meta.last_page} · {num(meta.total)} pencairan
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 lg:justify-end">
              <label className="flex items-center gap-2 text-gray-500">
                <span className="whitespace-nowrap">Tampilkan</span>
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
                <span className="whitespace-nowrap">/ halaman</span>
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

      {/* ===== Popup ===== */}
      <DisbursementFormModal open={form.open} item={form.item} onClose={() => setForm((f) => ({ ...f, open: false }))} onSaved={onSaved} />

      <DisbursementDetailModal
        item={detail}
        onClose={() => setDetail(null)}
        onEdit={(d) => {
          setDetail(null);
          setForm({ open: true, item: d });
        }}
        onDelete={(d) => {
          setDetail(null);
          setDel(d);
        }}
      />

      <DisbursementDeleteModal item={del} onClose={() => setDel(null)} onDeleted={onDeleted} />

      {/* ===== Toast ===== */}
      {toast && (
        <div role="status" className="fixed bottom-5 right-5 z-[110] flex max-w-[calc(100vw-2.5rem)] items-center gap-2.5 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-xl">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  );
}
