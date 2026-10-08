import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { api, errorMessage } from "../api";
import { SERVICES, STATUS } from "../constants";
import StatusBadge from "../components/StatusBadge";
import { card, inputCls } from "../components/ui";
import { fmtDate } from "../utils";
import type { Application, Paginated, StatusKey } from "../types";

type Filter = "" | StatusKey;

const TABS: { key: Filter; label: string }[] = [{ key: "", label: "Semua" }, ...(Object.keys(STATUS) as StatusKey[]).map((k) => ({ key: k, label: STATUS[k].label }))];

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Filter>("");
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [res, setRes] = useState<Paginated<Application> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Tunda pencarian 400ms supaya tidak request tiap ketikan
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

    const params = new URLSearchParams({ page: String(page), limit: "10" });
    if (status) params.set("status", status);
    if (q) params.set("search", q);

    api<Paginated<Application>>(`/admin/multifinance?${params}`)
      .then((r) => alive && setRes(r))
      .catch((e) => alive && setError(errorMessage(e)))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [status, q, page]);

  const rows = res?.data ?? [];
  const meta = res?.meta;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900">Pengajuan</h1>
      <p className="mt-1 text-sm text-gray-500">Semua pengajuan multifinance yang bisa diakses role kamu.</p>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="tablist" aria-label="Filter status" className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key || "all"}
              role="tab"
              aria-selected={status === t.key}
              onClick={() => {
                setStatus(t.key);
                setPage(1);
              }}
              className={`rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 ${
                status === t.key ? "bg-red-600 text-white" : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama, telepon, no. pengajuan" aria-label="Cari pengajuan" className={`${inputCls} pl-11`} />
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
          <p className="px-5 py-16 text-center text-sm text-gray-500">{q || status ? "Tidak ada pengajuan yang cocok dengan filter ini." : "Belum ada pengajuan masuk."}</p>
        ) : (
          <div className={`overflow-x-auto transition-opacity ${loading ? "opacity-50" : ""}`}>
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-gray-100 text-xs font-bold text-gray-400">
                <tr>
                  <th className="px-5 py-3">Pemohon</th>
                  <th className="px-5 py-3">Layanan</th>
                  <th className="px-5 py-3">Kendaraan</th>
                  <th className="px-5 py-3">Tanggal</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((a) => (
                  <tr key={a.id} onClick={() => navigate(`/admin/multi-finance/applications/${a.id}`)} className="cursor-pointer hover:bg-gray-50/70">
                    <td className="px-5 py-4">
                      <Link
                        to={`/admin/multi-finance/applications/${a.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-bold text-gray-900 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
                        {a.applicant?.name}
                      </Link>
                      <p className="text-xs text-gray-400">
                        {a.application_number} · {a.applicant?.phone}
                      </p>
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-700">{SERVICES[a.service_type] || a.service_type}</td>
                    <td className="px-5 py-4 text-gray-600">
                      {a.vehicle.brand} {a.vehicle.model} ({a.vehicle.year})
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

        {meta && meta.total > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 text-sm">
            <p className="text-gray-500">
              Halaman <b className="text-gray-900">{meta.current_page}</b> dari {meta.last_page} · {meta.total} pengajuan
            </p>
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
        )}
      </section>
    </div>
  );
}
