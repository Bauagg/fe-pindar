import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Check, ChevronDown, ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { api, errorMessage } from "../api";
import { SERVICES, STATUS } from "../constants";
import StatusBadge from "../components/StatusBadge";
import { card, inputCls } from "../components/ui";
import { fmtDate } from "../utils";
import type { Application, Paginated, StatusKey } from "../types";
import AssetCell, { ApplicantBadge } from "../components/AssetCell";
import ActivityNote, { UnreadDot } from "../components/ActivityNote";

type Filter = "" | "unread" | StatusKey;

const POLL_MS = 30000;

/* ------------------------------------------------------------------ */
/* Dropdown status: rapi di mobile, tablet, dan desktop                */
/* ------------------------------------------------------------------ */
function StatusDropdown({ value, onChange }: { value: Filter; onChange: (v: Filter) => void }) {
  const keys = Object.keys(STATUS) as StatusKey[];
  const selected = keys.includes(value as StatusKey) ? (value as StatusKey) : null;

  // index 0 = "Semua status", sisanya = tiap status
  const options: { key: "" | StatusKey; label: string }[] = [{ key: "", label: "Semua status" }, ...keys.map((k) => ({ key: k, label: STATUS[k].label as string }))];

  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const listId = "status-listbox";

  // Tutup saat klik di luar
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open]);

  const openMenu = () => {
    setHi(
      Math.max(
        0,
        options.findIndex((o) => o.key === (selected ?? ""))
      )
    );
    setOpen(true);
  };

  const pick = (i: number) => {
    onChange(options[i].key);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHi((i) => (i + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHi((i) => (i - 1 + options.length) % options.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setHi(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setHi(options.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      pick(hi);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  const active = selected !== null;

  return (
    <div ref={wrap} className="relative w-full sm:w-auto">
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `status-opt-${hi}` : undefined}
        aria-label="Filter status"
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        className={`inline-flex w-full items-center justify-between gap-3 rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 sm:w-auto sm:min-w-[11rem] ${
          active ? "bg-red-600 text-white" : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
        }`}>
        <span className="truncate">{active ? STATUS[selected!].label : "Status"}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul id={listId} role="listbox" aria-label="Pilih status" className="absolute left-0 right-0 z-30 mt-2 max-h-72 overflow-y-auto rounded-2xl bg-white p-1.5 shadow-xl shadow-gray-900/10 ring-1 ring-gray-200 sm:right-auto sm:w-64">
          {options.map((o, i) => {
            const isSel = (selected ?? "") === o.key;
            return (
              <li
                key={o.key || "all"}
                id={`status-opt-${i}`}
                role="option"
                aria-selected={isSel}
                onMouseEnter={() => setHi(i)}
                onClick={() => pick(i)}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm ${hi === i ? "bg-gray-50" : ""} ${isSel ? "font-bold text-gray-900" : "font-semibold text-gray-600"}`}>
                {o.key === "" ? <span>{o.label}</span> : <StatusBadge value={o.key} />}
                {isSel && <Check className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Filter>("");
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [res, setRes] = useState<Paginated<Application> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [service, setService] = useState("");
  const [tick, setTick] = useState(0);
  const silent = useRef(false);

  // Tunda pencarian 400ms supaya tidak request tiap ketikan
  useEffect(() => {
    const t = setTimeout(() => {
      setQ(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Refresh otomatis (tanpa efek loading) supaya notifikasi terasa real-time
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

    const params = new URLSearchParams({ page: String(page), limit: "10" });
    if (status === "unread") params.set("unread", "1");
    else if (status) params.set("status", status);
    if (service) params.set("service_type", service);
    if (q) params.set("search", q);

    api<Paginated<Application>>(`/admin/multifinance?${params}`)
      .then((r) => alive && setRes(r))
      .catch((e) => alive && setError(errorMessage(e)))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [status, service, q, page, tick]);

  const rows = res?.data ?? [];
  const meta = res?.meta;
  const unread = meta?.unread_count ?? 0;

  const changeStatus = (v: Filter) => {
    setStatus(v);
    setPage(1);
  };

  const quickTabs: { key: Filter; label: string }[] = [
    { key: "", label: "Semua" },
    { key: "unread", label: "Belum dibaca" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-extrabold text-gray-900">Pengajuan</h1>
        {unread > 0 && (
          <button
            type="button"
            onClick={() => changeStatus("unread")}
            className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-sm shadow-red-200 hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
            <Bell className="h-3.5 w-3.5" />
            {unread} pembaruan baru
          </button>
        )}
      </div>
      <p className="mt-1 text-sm text-gray-500">Semua pengajuan multifinance yang bisa diakses role kamu.</p>

      {/* Filter bar */}
      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Kiri: Semua, Belum dibaca, dropdown Status */}
        <div role="group" aria-label="Filter pengajuan" className="flex flex-wrap items-center gap-2">
          {quickTabs.map((t) => {
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

          <StatusDropdown value={status} onChange={changeStatus} />
        </div>

        {/* Kanan: layanan + pencarian */}
        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
          <select
            value={service}
            onChange={(e) => {
              setService(e.target.value);
              setPage(1);
            }}
            aria-label="Filter layanan"
            className={`${inputCls} sm:w-52`}>
            <option value="">Semua layanan</option>
            {Object.entries(SERVICES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <div className="relative w-full sm:flex-1 lg:w-80 lg:flex-none">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama, telepon, no. pengajuan" aria-label="Cari pengajuan" className={`${inputCls} pl-11`} />
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
          <p className="px-5 py-16 text-center text-sm text-gray-500">
            {status === "unread" ? "Semua pengajuan sudah dibaca. 🎉" : q || status || service ? "Tidak ada pengajuan yang cocok dengan filter ini." : "Belum ada pengajuan masuk."}
          </p>
        ) : (
          <div className={`overflow-x-auto transition-opacity ${loading ? "opacity-50" : ""}`}>
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-gray-100 text-xs font-bold text-gray-400">
                <tr>
                  <th className="px-5 py-3">Pemohon</th>
                  <th className="px-5 py-3">Layanan</th>
                  <th className="px-5 py-3">Jaminan</th>
                  <th className="px-5 py-3">Tanggal</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((a) => {
                  const isUnread = a.is_read === false;

                  return (
                    <tr key={a.id} onClick={() => navigate(`/admin/multi-finance/applications/${a.id}`)} className={`cursor-pointer transition-colors ${isUnread ? "bg-red-50/60 hover:bg-red-50" : "hover:bg-gray-50/70"}`}>
                      <td className="relative px-5 py-4">
                        {isUnread && <span className="absolute inset-y-0 left-0 w-1 bg-red-500" aria-hidden="true" />}
                        <div className="flex items-center gap-2">
                          {isUnread && <UnreadDot />}
                          <Link
                            to={`/admin/multi-finance/applications/${a.id}`}
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
                      <td className={`px-5 py-4 ${isUnread ? "font-bold text-gray-800" : "font-semibold text-gray-600"}`}>{SERVICES[a.service_type] || a.service_type}</td>
                      <td className="px-5 py-4">
                        <AssetCell a={a} />
                      </td>
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
