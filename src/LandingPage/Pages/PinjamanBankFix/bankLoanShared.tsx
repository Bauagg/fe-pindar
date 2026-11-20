// pages/bankLoanShared.tsx

import React from "react";
import { AlertTriangle, CheckCircle2, Loader2, X } from "lucide-react";
import type { FormState } from "./bankLoanApi";

/* ---------- Data & helper bersama ---------- */

export const emptyForm: FormState = {
  applicant_name: "",
  applicant_phone: "",
  birth_place: "",
  birth_date: "",
  applicant_address: "",
  company_name: "",
  company_address: "",
  bank_name: "",
};

export const PHONE_RE = /^(\+62|62|0)8[1-9][0-9]{7,10}$/;

// Tujuan setelah klik "Selesai" (sesuaikan dengan route list pinjaman bank kamu)
export const BACK_PATH = "/pinjaman-bank";

const pad = (n: number) => String(n).padStart(2, "0");

// Batas maksimal tanggal lahir = kemarin (BE: before:today)
export const maxBirthDate = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const formatDateID = (iso: string) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

export const validateForm = (form: FormState, usedPhone: string) => {
  const e: Partial<Record<keyof FormState, string>> = {};

  if (form.applicant_name.trim().length < 3) e.applicant_name = "Isi nama lengkap sesuai KTP (minimal 3 huruf).";

  if (!PHONE_RE.test(form.applicant_phone.replace(/[\s-]/g, ""))) e.applicant_phone = "Gunakan nomor aktif, contoh: 081234567890";
  else if (usedPhone && form.applicant_phone === usedPhone) e.applicant_phone = "Nomor ini sudah terdaftar. Gunakan nomor lain atau hubungi admin.";

  if (form.birth_place.trim().length < 2) e.birth_place = "Isi tempat lahir.";

  if (!form.birth_date) e.birth_date = "Pilih tanggal lahir.";
  else if (form.birth_date <= "1900-01-01" || form.birth_date > maxBirthDate()) e.birth_date = "Tanggal lahir tidak valid.";

  if (form.applicant_address.trim().length < 10) e.applicant_address = "Isi alamat lengkap (minimal 10 karakter).";

  if (form.company_name.trim().length < 2) e.company_name = "Isi nama perusahaan tempat kamu bekerja.";
  if (form.company_address.trim().length < 10) e.company_address = "Isi alamat perusahaan (minimal 10 karakter).";

  if (form.bank_name.trim().length < 2) e.bank_name = "Isi nama bank yang dituju.";

  return e;
};

// Deteksi error 422 "nomor telepon sudah terdaftar" dari BE
export const isPhoneUsedError = (err: unknown): boolean => {
  const phoneMsgs = (err as any)?.errors?.applicant_phone;
  if (Array.isArray(phoneMsgs) && phoneMsgs.length) return true;

  const msg = err instanceof Error ? err.message : "";
  return /nomor telepon.*(sudah|terdaftar)/i.test(msg);
};

export const cleanPayload = (f: FormState): FormState => ({
  applicant_name: f.applicant_name.trim(),
  applicant_phone: f.applicant_phone.replace(/[\s-]/g, ""),
  birth_place: f.birth_place.trim(),
  birth_date: f.birth_date,
  applicant_address: f.applicant_address.trim(),
  company_name: f.company_name.trim(),
  company_address: f.company_address.trim(),
  bank_name: f.bank_name.trim(),
});

export const buildSummary = (f: FormState, docCount = 0) =>
  [
    { label: "Nama sesuai KTP", value: f.applicant_name },
    { label: "Nomor Telepon", value: f.applicant_phone },
    { label: "Tempat Lahir", value: f.birth_place },
    { label: "Tanggal Lahir", value: formatDateID(f.birth_date) },
    { label: "Alamat", value: f.applicant_address },
    { label: "Nama Perusahaan", value: f.company_name },
    { label: "Alamat Perusahaan", value: f.company_address },
    { label: "Bank Tujuan", value: f.bank_name },
    { label: "Dokumen", value: docCount ? `${docCount} file` : "" },
  ].filter((s) => s.value);

/* ---------- Komponen UI kecil ---------- */

export const baseInput = "w-full rounded-2xl border bg-gray-50 py-3.5 text-sm sm:text-base text-gray-800 placeholder-gray-400 outline-none transition focus:bg-white focus:ring-4";
export const stateInput = (hasError?: boolean) => (hasError ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-red-400 focus:ring-red-100");

type FieldWrapProps = { id: string; label: string; error?: string; hint?: string; className?: string; children: React.ReactNode };

export const FieldWrap = ({ id, label, error, hint, className = "", children }: FieldWrapProps) => (
  <div data-invalid={error ? "true" : "false"} className={className}>
    <label htmlFor={id} className="block mb-2 text-sm font-bold text-gray-800">
      {label}
      <span className="text-red-500"> *</span>
    </label>
    {children}
    {hint && !error && <p className="mt-1.5 text-xs text-gray-400">{hint}</p>}
    {error && <p className="mt-1.5 text-xs sm:text-sm text-red-500 font-semibold">{error}</p>}
  </div>
);

type TextInputProps = {
  id: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  icon?: React.ElementType;
  hasError?: boolean;
  type?: string;
  max?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
};

export const TextInput = ({ id, value, onChange, onBlur, placeholder, icon: Icon, hasError, type = "text", inputMode, max }: TextInputProps) => (
  <div className="relative">
    {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />}
    <input
      id={id}
      type={type}
      max={max}
      inputMode={inputMode}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      className={`${baseInput} ${Icon ? "pl-12 pr-4" : "px-4"} ${stateInput(hasError)}`}
    />
  </div>
);

export const SectionTitle = ({ title, desc }: { title: string; desc?: string }) => (
  <div className="border-b border-gray-100 pb-2">
    <h3 className="text-base sm:text-lg font-black text-gray-900">{title}</h3>
    {desc && <p className="mt-0.5 text-xs sm:text-sm text-gray-500">{desc}</p>}
  </div>
);

export const useLockBody = (locked: boolean) => {
  React.useEffect(() => {
    if (!locked) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [locked]);
};

/* ---------- Popup konfirmasi ---------- */

type ConfirmModalProps = {
  open: boolean;
  summary: { label: string; value: string }[];
  agree: boolean;
  onAgree: (v: boolean) => void;
  submitting: boolean;
  error: string;
  statement: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export const ConfirmModal = ({ open, summary, agree, onAgree, submitting, error, statement, onCancel, onConfirm }: ConfirmModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !submitting && onCancel()} />
      <div className="relative bg-white w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl animate-[popIn_.3s_ease]">
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-700 px-6 py-5 text-white flex items-start justify-between gap-4 rounded-t-[2rem]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black">Periksa Data Kamu</h3>
              <p className="text-xs sm:text-sm text-white/90">Pastikan tidak ada salah ketik sebelum dikirim.</p>
            </div>
          </div>
          <button onClick={onCancel} disabled={submitting} aria-label="Tutup" className="p-1 rounded-lg hover:bg-white/20">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <dl className="divide-y divide-gray-100 rounded-2xl border border-gray-100">
            {summary.map((s) => (
              <div key={s.label} className="flex justify-between gap-4 px-4 py-3 text-sm">
                <dt className="text-gray-500 font-semibold">{s.label}</dt>
                <dd className="text-gray-900 font-bold text-right break-words">{s.value}</dd>
              </div>
            ))}
          </dl>

          <label className="mt-5 flex items-start gap-3 rounded-2xl bg-red-50 border border-red-100 p-4 cursor-pointer">
            <input type="checkbox" checked={agree} onChange={(e) => onAgree(e.target.checked)} className="mt-1 w-5 h-5 accent-red-600" />
            <span className="text-sm text-gray-700 leading-relaxed">{statement}</span>
          </label>

          {error && (
            <div role="alert" className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
            <button onClick={onCancel} disabled={submitting} className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-700 font-bold text-sm sm:text-base hover:bg-gray-50 disabled:opacity-50">
              Periksa Lagi
            </button>
            <button
              onClick={onConfirm}
              disabled={!agree || submitting}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Mengirim...
                </>
              ) : error ? (
                "Coba Kirim Lagi"
              ) : (
                "Ya, Kirim Pengajuan"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Popup berhasil ---------- */

type SuccessModalProps = {
  open: boolean;
  refNumber: string;
  message: string;
  warning?: string;
  onFinish: () => void;
};

export const SuccessModal = ({ open, refNumber, message, warning, onFinish }: SuccessModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-6 sm:p-10 text-center animate-[popIn_.3s_ease]">
        <div className="relative w-24 h-24 mx-auto">
          <span className="absolute inset-0 rounded-full bg-green-200 animate-ping motion-reduce:animate-none opacity-60"></span>
          <div className="relative w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-14 h-14 text-green-600" />
          </div>
        </div>

        <h3 className="mt-6 text-2xl sm:text-3xl font-black text-gray-800">Pengajuan Terkirim</h3>
        <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">{message}</p>

        {warning && <p className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs sm:text-sm font-semibold text-amber-700">{warning}</p>}

        {refNumber && (
          <div className="mt-5 inline-block rounded-2xl bg-red-50 border border-red-100 px-5 py-3">
            <p className="text-xs text-gray-500 font-semibold">Nomor pengajuan</p>
            <p className="text-lg font-black text-red-600 tracking-wide">{refNumber}</p>
            <p className="mt-1 text-[11px] text-gray-400">Simpan nomor ini untuk cek status pengajuan.</p>
          </div>
        )}

        <button onClick={onFinish} className="mt-7 w-full py-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-sm sm:text-base shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
          Selesai
        </button>
      </div>
    </div>
  );
};
