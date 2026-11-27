import React, { useEffect } from "react";
import { Loader2, X } from "lucide-react";

export const card = "rounded-2xl bg-white shadow-sm ring-1 ring-gray-100";
export const inputCls =
  "w-full rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 ring-1 ring-gray-200 placeholder:font-normal placeholder:text-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500";
export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-50";
export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-gray-600 ring-1 ring-gray-200 transition hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-50";

export const nf = new Intl.NumberFormat("id-ID");

export const fmtDate = (s?: string | null) => (s ? new Date(s).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-");
export const fmtDateTime = (s?: string | null) =>
  s ? new Date(s).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-";

export const waLink = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  return `https://wa.me/${intl}`;
};

export const Spinner = () => <Loader2 className="h-5 w-5 animate-spin text-red-600" aria-label="Memuat" />;

export const ErrorBox = ({ children }: { children: React.ReactNode }) => (
  <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
    {children}
  </div>
);

export function ProductBadge({ label }: { label: string }) {
  return <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700">{label}</span>;
}

export function Modal({ title, onClose, locked, children }: { title: string; onClose: () => void; locked?: boolean; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !locked && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, locked]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center" onMouseDown={(e) => e.target === e.currentTarget && !locked && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold text-gray-900">{title}</h2>
          <button type="button" onClick={onClose} disabled={locked} aria-label="Tutup" className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 disabled:opacity-40">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
