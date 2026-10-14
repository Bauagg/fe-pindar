import React, { useEffect } from "react";
import { Loader2, Pencil, X } from "lucide-react";

/** Tombol Edit kecil untuk pojok kartu. */
export function EditButton({ onClick, label = "Edit" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-gray-600 ring-1 ring-gray-200 transition hover:bg-red-50 hover:text-red-600 hover:ring-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
      <Pencil className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

/** Label + pesan error untuk satu input. */
export function Field({ label, htmlFor, error, wide, children }: { label: string; htmlFor?: string; error?: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-bold text-gray-500">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}

/** Pilihan tombol (segmented). */
export function Segmented<T extends string>({ options, value, onChange }: { options: readonly { value: T; label: string }[]; value: string; onChange: (v: T) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 ${
              active ? "border-red-500 bg-red-600 text-white shadow-sm" : "border-gray-200 bg-white text-gray-600 hover:border-red-300"
            }`}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

interface Props {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  tone?: string;
  saving: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: () => void;
  children: React.ReactNode;
}

/** Kerangka popup edit: header, isi (scroll), footer tombol. */
export default function EditModal({ title, subtitle, icon: Icon, tone = "bg-red-50 text-red-600", saving, error, onClose, onSubmit, children }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [saving, onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !saving && onClose()} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        noValidate
        className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-3xl">
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">{title}</h2>
              {subtitle && <p className="text-xs font-semibold text-gray-400">{subtitle}</p>}
            </div>
          </div>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Tutup" className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="grid gap-5 sm:grid-cols-2">{children}</div>

          {error && (
            <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50/60 px-6 py-4 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} disabled={saving} className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50">
            Batal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-100 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Menyimpan..." : "Simpan perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
