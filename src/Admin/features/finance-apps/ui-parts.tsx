import React, { useEffect } from "react";
import { Loader2, X } from "lucide-react";

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-red-200 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500";
export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 ring-1 ring-gray-200 transition hover:bg-gray-50 disabled:opacity-50";
export const btnDanger =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50";

export function Spinner({ className = "h-5 w-5" }: { className?: string }) {
  return <Loader2 className={`animate-spin text-red-600 ${className}`} />;
}

export function Alert({ children }: { children: React.ReactNode }) {
  return (
    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
      {children}
    </div>
  );
}

export function Info({ label, children, wide }: { label: string; children?: React.ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <dt className="text-xs font-bold text-gray-400">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-gray-900">{children || "-"}</dd>
    </div>
  );
}

export function CardTitle({ icon: Icon, title, tone, right }: { icon: React.ElementType; title: string; tone: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone}`}>
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="font-extrabold text-gray-900">{title}</h2>
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  );
}

export function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs font-bold text-gray-500">
      {text}
      <div className="mt-1">{children}</div>
    </label>
  );
}

export function Modal({ open, title, onClose, children, footer, wide }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-gray-900/50 sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
      <div role="dialog" aria-modal="true" aria-label={title} className={`flex max-h-[92vh] w-full flex-col rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl ${wide ? "sm:max-w-2xl" : "sm:max-w-lg"}`}>
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
          <h2 className="font-extrabold text-gray-900">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Tutup" className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-gray-100 px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
}
