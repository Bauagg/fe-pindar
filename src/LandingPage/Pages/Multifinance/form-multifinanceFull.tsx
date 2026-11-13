// pages/MultiFinanceFullForm.tsx

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowRight, Camera, CheckCircle2, FileText, Home, Info, Loader2, Phone, RefreshCw, Repeat, Tag, Trash2, User, X } from "lucide-react";
import PhoneUsedModal from "./PhoneUseModal";
import { submitApplication, uploadFormValues, type FormState, type Layanan } from "./multifinanceApi";

/* =========================================
   SHARED (dipakai juga oleh MultiFinanceForm)
========================================== */

export const emptyForm: FormState = {
  nama: "",
  telepon: "",
  usia: "",
  alamat: "",
  tipe_pemohon: "",
  layanan: "",
  kepemilikan: "",
  jenis_surat: "",
  jenis: "",
  merek: "",
  tipe: "",
  tahun: "",
  transmisi: "",
  status_pembiayaan: "",
  leasing_asal: "",
};

export const layananList = [
  { value: "Jaminkan BPKB", desc: "Dana cepat dengan jaminan BPKB, kendaraan tetap dipakai.", icon: FileText },
  { value: "Jaminkan SHM", desc: "Dana dengan jaminan sertifikat hak milik.", icon: Home },
  { value: "Beli Kendaraan (Second)", desc: "Beli mobil atau motor (Second) dengan harga terbaik.", icon: Tag },
  { value: "Take Over Kendaraan", desc: "Pindahkan cicilan kendaraan ke tenor dan bunga lebih ringan.", icon: Repeat },
] as const;

// Deteksi error "nomor telepon sudah terdaftar" dari BE (HTTP 422, errors.applicant_phone).
export const isPhoneUsedError = (err: unknown): boolean => {
  const e = err as any;

  // submitApplication melempar Error yang membawa `errors` dari response validasi BE
  const phoneMsgs: unknown = e?.errors?.applicant_phone ?? e?.response?.data?.errors?.applicant_phone;
  if (Array.isArray(phoneMsgs) && phoneMsgs.some((m) => /sudah|terdaftar|digunakan/i.test(String(m)))) return true;

  const msg = err instanceof Error ? err.message : "";
  return /nomor telepon.*(sudah|terdaftar)/i.test(msg);
};

/* =========================================
   KONFIGURASI
========================================== */

const MAX_BYTES = 15 * 1024 * 1024; // sama dengan BE: max:15360 (KB)
const ACCEPT = "image/jpeg,image/png,application/pdf";
const PHONE_RE = /^(\+62|62|0)8[1-9][0-9]{7,10}$/;
const TAKE_OVER = "Take Over"; // leasing asal hanya diisi untuk status ini

// Nilai harus sama persis dengan tipe di multifinanceApi.ts (TipePemohon, Kepemilikan, Jenis, Transmisi, StatusPembiayaan).
const OPTIONS = {
  tipe_pemohon: ["Individu", "Perusahaan"],
  kepemilikan: ["Sendiri", "Orang Lain"],
  jenis: ["Mobil", "Motor"],
  transmisi: ["Matic", "Manual"],
  status_pembiayaan: ["BPKB On Hand", "Take Over"],
};

const YEARS = Array.from({ length: 30 }, (_, i) => String(new Date().getFullYear() - i));

type DocDef = {
  name: string; // HARUS sama dengan `name` field di BE (DEFAULT_FORM_FIELDS)
  label: string;
  hint: string;
  group: "pribadi" | "kendaraan";
  required: "always" | "vehicle" | "never"; // vehicle = wajib hanya untuk layanan berbasis kendaraan
};

const DOCS: DocDef[] = [
  { name: "foto_ktp_customer", label: "Foto KTP Customer", hint: "Foto KTP asli, terlihat jelas dan tidak buram.", group: "pribadi", required: "always" },
  { name: "foto_ktp_pasangan", label: "Foto KTP Pasangan", hint: "Isi jika sudah menikah.", group: "pribadi", required: "never" },
  { name: "kartu_keluarga", label: "Kartu Keluarga", hint: "Seluruh halaman KK dalam satu foto.", group: "pribadi", required: "always" },
  { name: "foto_npwp", label: "Foto NPWP", hint: "Opsional, lampirkan jika ada.", group: "pribadi", required: "never" },
  { name: "foto_bpkb", label: "Foto BPKB", hint: "Halaman data kendaraan pada BPKB.", group: "kendaraan", required: "vehicle" },
  { name: "foto_stnk_depan", label: "Foto STNK (Depan)", hint: "Sisi depan STNK.", group: "kendaraan", required: "vehicle" },
  { name: "foto_stnk_belakang", label: "Foto STNK (Belakang)", hint: "Sisi belakang STNK.", group: "kendaraan", required: "vehicle" },
];

type DocStatus = "idle" | "processing" | "uploading" | "done" | "error";

/* =========================================
   HELPERS
========================================== */

const formatSize = (b: number) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`);

// Kecilkan foto (maks 1600px, JPEG) supaya upload di HP/jaringan lambat tetap cepat.
const compressImage = (file: File, maxSide = 1600, quality = 0.8): Promise<File> =>
  new Promise((resolve) => {
    if (!file.type.startsWith("image/") || file.size < 800 * 1024) return resolve(file);

    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => resolve(blob && blob.size < file.size ? new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" }) : file), "image/jpeg", quality);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });

/* =========================================
   KOMPONEN KECIL
========================================== */

const baseInput = "w-full rounded-2xl border bg-gray-50 py-3.5 text-sm sm:text-base text-gray-800 placeholder-gray-400 outline-none transition focus:bg-white focus:ring-4";
const stateInput = (hasError?: boolean) => (hasError ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-red-400 focus:ring-red-100");

type FieldWrapProps = { id: string; label: string; required?: boolean; error?: string; hint?: string; className?: string; children: React.ReactNode };

const FieldWrap = ({ id, label, required, error, hint, className = "", children }: FieldWrapProps) => (
  <div data-invalid={error ? "true" : "false"} className={className}>
    <label htmlFor={id} className="block mb-2 text-sm font-bold text-gray-800">
      {label}
      {required ? <span className="text-red-500"> *</span> : <span className="text-xs font-semibold text-gray-400"> (opsional)</span>}
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
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
};

const TextInput = ({ id, value, onChange, onBlur, placeholder, icon: Icon, hasError, type = "text", inputMode }: TextInputProps) => (
  <div className="relative">
    {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />}
    <input id={id} type={type} inputMode={inputMode} value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} placeholder={placeholder} className={`${baseInput} ${Icon ? "pl-12 pr-4" : "px-4"} ${stateInput(hasError)}`} />
  </div>
);

type SelectInputProps = { id: string; value: string; onChange: (v: string) => void; onBlur?: () => void; options: string[]; placeholder: string; hasError?: boolean };

const SelectInput = ({ id, value, onChange, onBlur, options, placeholder, hasError }: SelectInputProps) => (
  <select id={id} value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} className={`${baseInput} px-4 ${stateInput(hasError)} ${value ? "" : "text-gray-400"}`}>
    <option value="">{placeholder}</option>
    {options.map((o) => (
      <option key={o} value={o} className="text-gray-800">
        {o}
      </option>
    ))}
  </select>
);

const SectionTitle = ({ title, desc }: { title: string; desc?: string }) => (
  <div className="border-b border-gray-100 pb-2">
    <h3 className="text-base sm:text-lg font-black text-gray-900">{title}</h3>
    {desc && <p className="mt-0.5 text-xs sm:text-sm text-gray-500">{desc}</p>}
  </div>
);

/* ---------- Slot upload dokumen ---------- */

type DocSlotProps = {
  doc: DocDef;
  required: boolean;
  file: File | null;
  status: DocStatus;
  message?: string;
  showError: boolean;
  disabled?: boolean;
  onPick: (f: File) => void;
  onClear: () => void;
};

const DocSlot = ({ doc, required, file, status, message, showError, disabled, onPick, onClear }: DocSlotProps) => {
  const inputId = `full-doc-${doc.name}`;

  const preview = useMemo(() => (file && file.type.startsWith("image/") ? URL.createObjectURL(file) : null), [file]);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview]
  );

  const missing = showError && required && !file;
  const invalid = missing || !!message;

  const border = invalid ? "border-red-300 bg-red-50/40" : file ? "border-green-300 bg-green-50/40" : "border-gray-200 bg-white";

  return (
    <div data-invalid={invalid ? "true" : "false"} className={`rounded-2xl border p-4 transition focus-within:ring-4 focus-within:ring-red-100 ${border}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-black text-gray-900">{doc.label}</p>
          <p className="mt-0.5 text-xs text-gray-500">{doc.hint}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${required ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`}>{required ? "Wajib" : "Opsional"}</span>
      </div>

      <input
        id={inputId}
        type="file"
        accept={ACCEPT}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = ""; // supaya file yang sama bisa dipilih ulang
          if (f) onPick(f);
        }}
      />

      {!file ? (
        <label
          htmlFor={inputId}
          className={`mt-3 flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-6 text-center transition hover:border-red-400 hover:bg-red-50 ${
            missing ? "border-red-300" : "border-gray-300"
          } ${status === "processing" || disabled ? "pointer-events-none opacity-70" : ""}`}>
          {status === "processing" ? <Loader2 className="h-6 w-6 animate-spin text-red-500" /> : <Camera className="h-6 w-6 text-red-400" />}
          <span className="text-sm font-bold text-gray-700">{status === "processing" ? "Memproses foto..." : "Ketuk untuk unggah"}</span>
          <span className="text-[11px] text-gray-400">JPG, PNG, atau PDF · maks 2 MB</span>
        </label>
      ) : (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-2.5">
          {preview ? (
            <img src={preview} alt={doc.label} className="h-14 w-14 shrink-0 rounded-lg object-cover" />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
              <FileText className="h-6 w-6" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-gray-800">{file.name}</p>
            <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
          </div>

          {!disabled && (
            <div className="flex shrink-0 items-center gap-1">
              <label htmlFor={inputId} className="cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50">
                Ganti
              </label>
              <button type="button" onClick={onClear} aria-label={`Hapus ${doc.label}`} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {message ? (
        <p role="alert" className="mt-2 text-xs font-semibold text-red-500">
          {message}
        </p>
      ) : missing ? (
        <p className="mt-2 text-xs font-semibold text-red-500">Dokumen ini wajib diunggah.</p>
      ) : null}
    </div>
  );
};

/* =========================================
   FORM LENGKAP
========================================== */

type Props = {
  active: boolean; // true saat tab "Isi Formulir Lengkap" sedang dibuka
  onBackToSimple: () => void;
};

const MultiFinanceFullForm = ({ active, onBackToSimple }: Props) => {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  // Dokumen
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [docStatus, setDocStatus] = useState<Record<string, DocStatus>>({});
  const [docMsg, setDocMsg] = useState<Record<string, string>>({});

  // Popup
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoSeen, setInfoSeen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [phoneUsedOpen, setPhoneUsedOpen] = useState(false);

  // Proses kirim
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [refNumber, setRefNumber] = useState("");
  const [usedPhone, setUsedPhone] = useState("");

  const isSHM = form.layanan === "Jaminkan SHM";
  const vehicleDocsRequired = form.layanan === "Jaminkan BPKB" || form.layanan === "Take Over Kendaraan";
  const isDocRequired = (d: DocDef) => d.required === "always" || (d.required === "vehicle" && vehicleDocsRequired);
  const visibleDocs = DOCS.filter((d) => !(isSHM && d.group === "kendaraan")); // SHM: dokumen kendaraan disembunyikan

  const setField = (key: keyof FormState, value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  const touch = (key: keyof FormState) => setTouched((t) => ({ ...t, [key]: true }));

  const handleLayanan = (v: Layanan) => {
    setField("layanan", v);
    touch("layanan");
  };

  /* ---------- Validasi ---------- */

  const errors = useMemo(() => {
    const e: Partial<Record<keyof FormState, string>> = {};
    const usia = Number(form.usia);

    if (form.nama.trim().length < 3) e.nama = "Isi nama lengkap sesuai KTP (minimal 3 huruf).";

    if (!PHONE_RE.test(form.telepon.replace(/[\s-]/g, ""))) e.telepon = "Gunakan nomor aktif, contoh: 081234567890";
    else if (usedPhone && form.telepon === usedPhone) e.telepon = "Nomor ini sudah terdaftar. Gunakan nomor lain atau hubungi admin.";

    if (!form.usia || !Number.isInteger(usia) || usia < 17 || usia > 80) e.usia = "Isi usia yang valid (17–80 tahun).";
    if (form.alamat.trim().length < 10) e.alamat = "Isi alamat lengkap (minimal 10 karakter).";
    if (!form.tipe_pemohon) e.tipe_pemohon = "Pilih tipe pemohon.";
    if (!form.layanan) e.layanan = "Pilih layanan yang kamu butuhkan.";
    if (!form.kepemilikan) e.kepemilikan = isSHM ? "Pilih nama pemilik sertifikat." : "Pilih nama pemilik BPKB.";

    if (isSHM) {
      // Khusus SHM
      if (!form.jenis_surat.trim()) e.jenis_surat = "Isi jenis sertifikat.";
    } else {
      // Khusus kendaraan
      if (!form.jenis) e.jenis = "Pilih jenis kendaraan.";
      if (!form.merek.trim()) e.merek = "Isi merek kendaraan.";
      if (!form.tipe.trim()) e.tipe = "Isi tipe kendaraan.";
      if (!form.tahun) e.tahun = "Pilih tahun kendaraan.";
      if (!form.transmisi) e.transmisi = "Pilih transmisi.";
      if (!form.status_pembiayaan) e.status_pembiayaan = "Pilih status pembiayaan.";
    }

    if (!isSHM && form.status_pembiayaan === TAKE_OVER && !form.leasing_asal.trim()) e.leasing_asal = "Isi nama leasing asal.";

    return e;
  }, [form, usedPhone, isSHM]);

  const missingDocs = visibleDocs.filter((d) => isDocRequired(d) && !files[d.name]);
  const isValid = Object.keys(errors).length === 0 && missingDocs.length === 0;

  const err = (k: keyof FormState) => (touched[k] ? errors[k] : undefined);

  /* ---------- Efek ---------- */

  // Popup info muncul sekali, saat tab ini pertama kali dibuka
  useEffect(() => {
    if (active && !infoSeen) {
      setInfoOpen(true);
      setInfoSeen(true);
    }
  }, [active, infoSeen]);

  useEffect(() => {
    document.body.style.overflow = infoOpen || openConfirm || openUpload || openSuccess || phoneUsedOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [infoOpen, openConfirm, openUpload, openSuccess, phoneUsedOpen]);

  /* ---------- Dokumen ---------- */

  const handlePick = async (doc: DocDef, picked: File) => {
    setDocMsg((m) => ({ ...m, [doc.name]: "" }));

    if (!/^(image\/(jpeg|png)|application\/pdf)$/.test(picked.type)) {
      setDocMsg((m) => ({ ...m, [doc.name]: "Format harus JPG, PNG, atau PDF." }));
      return;
    }

    setDocStatus((s) => ({ ...s, [doc.name]: "processing" }));
    const result = await compressImage(picked);
    setDocStatus((s) => ({ ...s, [doc.name]: "idle" }));

    if (result.size > MAX_BYTES) {
      setDocMsg((m) => ({ ...m, [doc.name]: "Ukuran file maksimal 2 MB." }));
      return;
    }

    setFiles((f) => ({ ...f, [doc.name]: result }));
  };

  const handleClear = (doc: DocDef) => {
    setFiles((f) => ({ ...f, [doc.name]: null }));
    setDocStatus((s) => ({ ...s, [doc.name]: "idle" }));
    setDocMsg((m) => ({ ...m, [doc.name]: "" }));
  };

  const queuedDocs = visibleDocs.filter((d) => files[d.name]);
  const failedDocs = visibleDocs.filter((d) => docStatus[d.name] === "error");
  const doneCount = queuedDocs.filter((d) => docStatus[d.name] === "done").length;

  // Upload satu per satu (1 request = 1 file) supaya tidak kena batas post_max_size & bisa retry per dokumen.
  const runUploads = async (token: string): Promise<boolean> => {
    const queue = visibleDocs.filter((d) => files[d.name] && docStatus[d.name] !== "done");
    if (!queue.length) return true;

    setUploading(true);
    let allOk = true;

    for (const d of queue) {
      setDocStatus((s) => ({ ...s, [d.name]: "uploading" }));

      try {
        await uploadFormValues(token, { [d.name]: files[d.name] as File });
        setDocStatus((s) => ({ ...s, [d.name]: "done" }));
        setDocMsg((m) => ({ ...m, [d.name]: "" }));
      } catch (e) {
        allOk = false;
        setDocStatus((s) => ({ ...s, [d.name]: "error" }));
        setDocMsg((m) => ({ ...m, [d.name]: e instanceof Error ? e.message : "Gagal mengunggah dokumen." }));
      }
    }

    setUploading(false);
    return allOk;
  };

  /* ---------- Submit ---------- */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setTouched(Object.fromEntries(Object.keys(emptyForm).map((k) => [k, true])));
    setSubmitted(true);

    if (!isValid) {
      setTimeout(() => document.querySelector<HTMLElement>('#full-form [data-invalid="true"]')?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
      return;
    }

    window.fbq?.("track", "InitiateCheckout", { content_name: form.layanan });
    setAgree(false);
    setSubmitError("");
    setOpenConfirm(true);
  };

  const handleConfirm = async () => {
    if (submitting) return;
    setSubmitError("");
    setSubmitting(true);

    try {
      let token = accessToken;

      // Langkah 1: simpan data pengajuan (hanya sekali, supaya nomor telepon tidak ditolak saat retry)
      if (!token) {
        const result = await submitApplication({
          ...form,
          nama: form.nama.trim(),
          alamat: form.alamat.trim(),
          merek: form.merek.trim(),
          tipe: form.tipe.trim(),
          leasing_asal: form.leasing_asal.trim(),
        });

        token = result.accessToken ?? "";
        setAccessToken(token);
        setRefNumber(result.applicationNumber);
        window.fbq?.("track", "Lead", { content_name: form.layanan, content_category: "Multi Finance" }, { eventID: result.applicationNumber });
      }

      setOpenConfirm(false);

      if (!token) {
        console.error("submitApplication belum mengembalikan accessToken, upload dokumen dilewati.");
        setOpenSuccess(true);
        return;
      }

      // Langkah 2: upload dokumen (kalau ada)
      if (!queuedDocs.length) {
        setOpenSuccess(true);
        return;
      }

      setOpenUpload(true);
      const ok = await runUploads(token);

      if (ok) {
        setOpenUpload(false);
        setOpenSuccess(true);
      }
    } catch (e) {
      if (isPhoneUsedError(e)) {
        setUsedPhone(form.telepon);
        setTouched((t) => ({ ...t, telepon: true }));
        setOpenConfirm(false);
        setPhoneUsedOpen(true);
        return;
      }

      setSubmitError(e instanceof Error ? e.message : "Pengajuan gagal dikirim. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetryUploads = async () => {
    const ok = await runUploads(accessToken);

    if (ok) {
      setOpenUpload(false);
      setOpenSuccess(true);
    }
  };

  const handleClosePhoneUsed = () => {
    setPhoneUsedOpen(false);

    setTimeout(() => {
      const el = document.getElementById("full-telepon");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus();
    }, 50);
  };

  const handleFinish = () => {
    setOpenSuccess(false);
    setForm(emptyForm);
    setTouched({});
    setSubmitted(false);
    setFiles({});
    setDocStatus({});
    setDocMsg({});
    setAccessToken("");
    setUsedPhone("");
    navigate("/multi-finance");
  };

  const veh = (v: string) => (isSHM ? "" : v);

  const summary = [
    { label: "Nama sesuai KTP", value: form.nama },
    { label: "Nomor Telepon", value: form.telepon },
    { label: "Usia", value: form.usia ? `${form.usia} tahun` : "" },
    { label: "Tipe Pemohon", value: form.tipe_pemohon },
    { label: "Alamat", value: form.alamat },
    { label: "Layanan", value: form.layanan },
    { label: isSHM ? "Sertifikat Atas Nama" : "BPKB Atas Nama", value: form.kepemilikan },
    { label: "Jenis Sertifikat", value: isSHM ? form.jenis_surat : "" },
    { label: "Jenis Kendaraan", value: veh(form.jenis) },
    { label: "Merek / Tipe", value: veh([form.merek, form.tipe].filter(Boolean).join(" ")) },
    { label: "Tahun", value: veh(form.tahun) },
    { label: "Transmisi", value: veh(form.transmisi) },
    { label: "Status Pembiayaan", value: veh(form.status_pembiayaan) },
    { label: "Leasing Asal", value: veh(form.status_pembiayaan === TAKE_OVER ? form.leasing_asal : "") },
    { label: "Dokumen", value: queuedDocs.length ? `${queuedDocs.length} file` : "" },
  ].filter((s) => s.value);

  const busy = submitting || uploading;

  return (
    <>
      <form id="full-form" onSubmit={handleSubmit} noValidate className={`p-5 sm:p-8 space-y-8 ${active ? "" : "hidden"}`}>
        {/* INFO PALING ATAS */}
        <div className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div>
            <p className="text-sm font-black text-emerald-800">Isi lengkap, tinggal tunggu pencairan</p>
            <p className="mt-0.5 text-xs sm:text-sm leading-relaxed text-emerald-700">Lengkapi semua data dan dokumen di bawah ini. Setelah terkirim, pengajuan kamu tinggal menunggu proses pencairan.</p>
          </div>
        </div>

        {/* DATA DIRI */}
        <section className="space-y-5">
          <SectionTitle title="Data Diri" />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FieldWrap id="full-nama" label="Nama sesuai KTP" required error={err("nama")} className="sm:col-span-2">
              <TextInput id="full-nama" icon={User} value={form.nama} onChange={(v) => setField("nama", v)} onBlur={() => touch("nama")} placeholder="Contoh: Budi Santoso" hasError={!!err("nama")} />
            </FieldWrap>

            <FieldWrap id="full-telepon" label="Nomor Telepon / WhatsApp" required error={err("telepon")}>
              <TextInput id="full-telepon" icon={Phone} type="tel" inputMode="tel" value={form.telepon} onChange={(v) => setField("telepon", v)} onBlur={() => touch("telepon")} placeholder="081234567890" hasError={!!err("telepon")} />
            </FieldWrap>

            <FieldWrap id="full-usia" label="Usia" required error={err("usia")}>
              <TextInput id="full-usia" type="number" inputMode="numeric" value={form.usia} onChange={(v) => setField("usia", v)} onBlur={() => touch("usia")} placeholder="Contoh: 35" hasError={!!err("usia")} />
            </FieldWrap>

            <FieldWrap id="full-tipe_pemohon" label="Tipe Pemohon" required error={err("tipe_pemohon")} className="sm:col-span-2">
              <SelectInput
                id="full-tipe_pemohon"
                value={form.tipe_pemohon}
                onChange={(v) => setField("tipe_pemohon", v)}
                onBlur={() => touch("tipe_pemohon")}
                options={OPTIONS.tipe_pemohon}
                placeholder="Pilih tipe pemohon"
                hasError={!!err("tipe_pemohon")}
              />
            </FieldWrap>

            <FieldWrap id="full-alamat" label="Alamat Lengkap" required error={err("alamat")} className="sm:col-span-2">
              <textarea
                id="full-alamat"
                rows={3}
                value={form.alamat}
                onChange={(e) => setField("alamat", e.target.value)}
                onBlur={() => touch("alamat")}
                placeholder="Jalan, RT/RW, kelurahan, kecamatan, kota"
                className={`${baseInput} px-4 resize-none ${stateInput(!!err("alamat"))}`}
              />
            </FieldWrap>
          </div>
        </section>

        {/* LAYANAN */}
        <section className="space-y-4">
          <SectionTitle title="Layanan" desc="Pilih layanan yang kamu butuhkan." />

          <div data-invalid={err("layanan") ? "true" : "false"}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {layananList.map((l) => {
                const Icon = l.icon;
                const on = form.layanan === l.value;

                return (
                  <button
                    type="button"
                    key={l.value}
                    onClick={() => handleLayanan(l.value)}
                    aria-pressed={on}
                    className={`text-left rounded-2xl border p-4 transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-100 ${
                      on ? "border-red-500 bg-red-50 shadow-md" : "border-gray-200 bg-white hover:border-red-300"
                    }`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${on ? "bg-red-500 text-white" : "bg-red-50 text-red-500"}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="mt-3 text-sm font-black text-gray-900">{l.value}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{l.desc}</p>
                  </button>
                );
              })}
            </div>
            {err("layanan") && <p className="mt-1.5 text-xs sm:text-sm text-red-500 font-semibold">{err("layanan")}</p>}
          </div>
        </section>

        {/* DATA SERTIFIKAT (SHM) / KENDARAAN */}
        <section className="space-y-5">
          <SectionTitle title={isSHM ? "Data Sertifikat" : "Data Kendaraan"} desc={isSHM ? "Isi data sertifikat yang dijaminkan." : "Isi sesuai kendaraan yang dijaminkan atau dibeli."} />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FieldWrap id="full-kepemilikan" label={isSHM ? "Sertifikat Atas Nama" : "BPKB Atas Nama"} required error={err("kepemilikan")}>
              <SelectInput
                id="full-kepemilikan"
                value={form.kepemilikan}
                onChange={(v) => setField("kepemilikan", v)}
                onBlur={() => touch("kepemilikan")}
                options={OPTIONS.kepemilikan}
                placeholder="Pilih pemilik"
                hasError={!!err("kepemilikan")}
              />
            </FieldWrap>

            {isSHM ? (
              <FieldWrap id="full-jenis_surat" label="Jenis Sertifikat" required error={err("jenis_surat")}>
                <TextInput id="full-jenis_surat" value={form.jenis_surat} onChange={(v) => setField("jenis_surat", v)} onBlur={() => touch("jenis_surat")} placeholder="Contoh: SHM atau SHGB" hasError={!!err("jenis_surat")} />
              </FieldWrap>
            ) : (
              <>
                <FieldWrap id="full-jenis" label="Jenis Kendaraan" required error={err("jenis")}>
                  <SelectInput id="full-jenis" value={form.jenis} onChange={(v) => setField("jenis", v)} onBlur={() => touch("jenis")} options={OPTIONS.jenis} placeholder="Pilih jenis" hasError={!!err("jenis")} />
                </FieldWrap>

                <FieldWrap id="full-merek" label="Merek" required error={err("merek")}>
                  <TextInput id="full-merek" value={form.merek} onChange={(v) => setField("merek", v)} onBlur={() => touch("merek")} placeholder="Contoh: Honda" hasError={!!err("merek")} />
                </FieldWrap>

                <FieldWrap id="full-tipe" label="Tipe" required error={err("tipe")}>
                  <TextInput id="full-tipe" value={form.tipe} onChange={(v) => setField("tipe", v)} onBlur={() => touch("tipe")} placeholder="Contoh: Brio RS" hasError={!!err("tipe")} />
                </FieldWrap>

                <FieldWrap id="full-tahun" label="Tahun" required error={err("tahun")}>
                  <SelectInput id="full-tahun" value={form.tahun} onChange={(v) => setField("tahun", v)} onBlur={() => touch("tahun")} options={YEARS} placeholder="Pilih tahun" hasError={!!err("tahun")} />
                </FieldWrap>

                <FieldWrap id="full-transmisi" label="Transmisi" required error={err("transmisi")}>
                  <SelectInput
                    id="full-transmisi"
                    value={form.transmisi}
                    onChange={(v) => setField("transmisi", v)}
                    onBlur={() => touch("transmisi")}
                    options={OPTIONS.transmisi}
                    placeholder="Pilih transmisi"
                    hasError={!!err("transmisi")}
                  />
                </FieldWrap>

                <FieldWrap
                  id="full-status_pembiayaan"
                  label="Status Pembiayaan"
                  required
                  error={err("status_pembiayaan")}
                  hint="BPKB On Hand: BPKB ada di tangan kamu. Take Over: kendaraan masih dalam cicilan leasing."
                  className="sm:col-span-2">
                  <SelectInput
                    id="full-status_pembiayaan"
                    value={form.status_pembiayaan}
                    onChange={(v) => setField("status_pembiayaan", v)}
                    onBlur={() => touch("status_pembiayaan")}
                    options={OPTIONS.status_pembiayaan}
                    placeholder="Pilih status"
                    hasError={!!err("status_pembiayaan")}
                  />
                </FieldWrap>

                {form.status_pembiayaan === TAKE_OVER && (
                  <FieldWrap id="full-leasing_asal" label="Leasing Asal" required error={err("leasing_asal")} className="sm:col-span-2">
                    <TextInput id="full-leasing_asal" value={form.leasing_asal} onChange={(v) => setField("leasing_asal", v)} onBlur={() => touch("leasing_asal")} placeholder="Contoh: Adira Finance" hasError={!!err("leasing_asal")} />
                  </FieldWrap>
                )}
              </>
            )}
          </div>
        </section>

        {/* DOKUMEN */}
        <section className="space-y-5">
          <SectionTitle title="Dokumen Pendukung" desc="Foto atau scan dokumen asli. Pastikan jelas, tidak buram, dan semua sisi terlihat." />

          {(["pribadi", "kendaraan"] as const)
            .filter((g) => !(isSHM && g === "kendaraan"))
            .map((group) => (
              <div key={group} className="space-y-3">
                <p className="text-xs font-extrabold uppercase tracking-wider text-gray-400">{group === "pribadi" ? "Dokumen Pribadi" : "Dokumen Kendaraan"}</p>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {DOCS.filter((d) => d.group === group).map((d) => (
                    <DocSlot
                      key={d.name}
                      doc={d}
                      required={isDocRequired(d)}
                      file={files[d.name] ?? null}
                      status={docStatus[d.name] ?? "idle"}
                      message={docMsg[d.name]}
                      showError={submitted}
                      disabled={busy}
                      onPick={(f) => handlePick(d, f)}
                      onClear={() => handleClear(d)}
                    />
                  ))}
                </div>
              </div>
            ))}
        </section>

        <button
          type="submit"
          disabled={busy}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-red-200 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 disabled:opacity-60">
          Kirim Pengajuan Lengkap
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </form>

      {/* POPUP: INFO (muncul saat pertama kali buka tab lengkap) */}
      {infoOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="full-info-title">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setInfoOpen(false)} />
          <div className="relative bg-white w-full sm:max-w-md max-h-[92vh] overflow-y-auto rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl animate-[popIn_.3s_ease]">
            <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-700 px-6 py-5 text-white flex items-center gap-3 rounded-t-[2rem]">
              <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center">
                <Info className="w-6 h-6" />
              </div>
              <h3 id="full-info-title" className="text-lg sm:text-xl font-black">
                Isi Formulir Lengkap
              </h3>
            </div>

            <div className="p-6">
              <p className="text-sm sm:text-base leading-relaxed text-gray-700">
                Dengan mengisi data dan dokumen secara lengkap di halaman ini, pengajuan kamu <span className="font-black text-gray-900">tinggal menunggu proses pencairan</span>.
              </p>

              <ul className="mt-4 space-y-2.5 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
                <li className="flex gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                  Siapkan foto KTP, Kartu Keluarga, serta BPKB dan STNK (untuk layanan kendaraan).
                </li>
                <li className="flex gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                  Format JPG, PNG, atau PDF, maksimal 2 MB per file.
                </li>
              </ul>

              <div className="mt-6 flex flex-col gap-3">
                <button onClick={() => setInfoOpen(false)} className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-sm sm:text-base shadow-lg">
                  Mengerti, Lanjut Isi
                </button>
                <button
                  onClick={() => {
                    setInfoOpen(false);
                    onBackToSimple();
                  }}
                  className="w-full py-3 rounded-2xl border border-gray-200 text-gray-700 font-bold text-sm sm:text-base hover:bg-gray-50">
                  Pakai Pengajuan Cepat Saja
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POPUP: PERNYATAAN & CROSS CHECK */}
      {openConfirm && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="full-confirm-title">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !submitting && setOpenConfirm(false)} />
          <div className="relative bg-white w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl animate-[popIn_.3s_ease]">
            <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-700 px-6 py-5 text-white flex items-start justify-between gap-4 rounded-t-[2rem]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 id="full-confirm-title" className="text-lg sm:text-xl font-black">
                    Periksa Data Kamu
                  </h3>
                  <p className="text-xs sm:text-sm text-white/90">Pastikan tidak ada salah ketik sebelum dikirim.</p>
                </div>
              </div>
              <button onClick={() => setOpenConfirm(false)} disabled={submitting} aria-label="Tutup" className="p-1 rounded-lg hover:bg-white/20">
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
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 w-5 h-5 accent-red-600" />
                <span className="text-sm text-gray-700 leading-relaxed">Saya menyatakan bahwa data dan dokumen di atas benar dan sesuai dokumen asli, serta setuju dihubungi oleh pihak multi finance untuk proses pengajuan.</span>
              </label>

              {submitError && (
                <div role="alert" className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {submitError}
                </div>
              )}

              <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
                <button onClick={() => setOpenConfirm(false)} disabled={submitting} className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-700 font-bold text-sm sm:text-base hover:bg-gray-50 disabled:opacity-50">
                  Periksa Lagi
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!agree || submitting}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Mengirim...
                    </>
                  ) : submitError ? (
                    "Coba Kirim Lagi"
                  ) : (
                    "Ya, Kirim Pengajuan"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POPUP: PROGRES UPLOAD DOKUMEN */}
      {openUpload && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="full-upload-title">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white w-full max-w-md max-h-[92vh] overflow-y-auto rounded-[2rem] shadow-2xl p-6 animate-[popIn_.3s_ease]">
            <h3 id="full-upload-title" className="text-lg sm:text-xl font-black text-gray-900">
              {uploading ? "Mengunggah Dokumen..." : failedDocs.length ? "Sebagian Dokumen Gagal Terkirim" : "Dokumen Terkirim"}
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">{uploading ? "Jangan tutup halaman ini sampai selesai." : `${doneCount} dari ${queuedDocs.length} dokumen berhasil dikirim.`}</p>

            <ul className="mt-4 divide-y divide-gray-100 rounded-2xl border border-gray-100">
              {queuedDocs.map((d) => {
                const st = docStatus[d.name] ?? "idle";

                return (
                  <li key={d.name} className="flex items-start gap-3 px-4 py-3">
                    <span className="mt-0.5 shrink-0">
                      {st === "done" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : st === "error" ? (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      ) : st === "uploading" ? (
                        <Loader2 className="h-5 w-5 animate-spin text-red-500" />
                      ) : (
                        <span className="block h-5 w-5 rounded-full border-2 border-gray-200" />
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-gray-800">{d.label}</p>
                      <p className={`text-xs ${st === "error" ? "font-semibold text-red-500" : "text-gray-400"}`}>
                        {st === "done" ? "Terkirim" : st === "uploading" ? "Mengunggah..." : st === "error" ? docMsg[d.name] || "Gagal mengunggah." : "Menunggu antrean"}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            {!uploading && failedDocs.length > 0 && (
              <div className="mt-5 flex flex-col gap-3">
                <button onClick={handleRetryUploads} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 py-3 text-sm sm:text-base font-bold text-white shadow-lg">
                  <RefreshCw className="h-4 w-4" />
                  Kirim Ulang yang Gagal
                </button>
                <button
                  onClick={() => {
                    setOpenUpload(false);
                    setOpenSuccess(true);
                  }}
                  className="w-full rounded-2xl border border-gray-200 py-3 text-sm sm:text-base font-bold text-gray-700 hover:bg-gray-50">
                  Lanjutkan Tanpa Dokumen Ini
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* POPUP: NOMOR TELEPON SUDAH TERDAFTAR */}
      <PhoneUsedModal open={phoneUsedOpen} onClose={handleClosePhoneUsed} phone={usedPhone} name={form.nama.trim()} />

      {/* POPUP: BERHASIL */}
      {openSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="full-success-title">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-6 sm:p-10 text-center animate-[popIn_.3s_ease]">
            <div className="relative w-24 h-24 mx-auto">
              <span className="absolute inset-0 rounded-full bg-green-200 animate-ping motion-reduce:animate-none opacity-60"></span>
              <div className="relative w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-14 h-14 text-green-600" />
              </div>
            </div>

            <h3 id="full-success-title" className="mt-6 text-2xl sm:text-3xl font-black text-gray-800">
              Pengajuan Terkirim
            </h3>
            <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
              Data dan dokumen kamu sudah kami terima. Tim kami akan menghubungi lewat telepon atau WhatsApp dalam 1x24 jam kerja, setelah itu tinggal menunggu proses pencairan.
            </p>

            {failedDocs.length > 0 && (
              <p className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs sm:text-sm font-semibold text-amber-700">
                {failedDocs.length} dokumen belum terkirim. Silakan kirim ke admin lewat WhatsApp agar pengajuan tetap diproses.
              </p>
            )}

            {refNumber && (
              <div className="mt-5 inline-block rounded-2xl bg-red-50 border border-red-100 px-5 py-3">
                <p className="text-xs text-gray-500 font-semibold">Nomor referensi</p>
                <p className="text-lg font-black text-red-600 tracking-wide">{refNumber}</p>
              </div>
            )}

            <button onClick={handleFinish} className="mt-7 w-full py-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-sm sm:text-base shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
              Selesai
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MultiFinanceFullForm;
