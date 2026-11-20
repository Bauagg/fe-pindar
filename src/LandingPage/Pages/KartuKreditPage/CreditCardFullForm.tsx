// pages/CreditCardFullForm.tsx

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowRight, Camera, CheckCircle2, CreditCard, FileText, Info, Loader2, MapPin, Phone, RefreshCw, Trash2, User } from "lucide-react";

import PhoneUsedModal from "./CreditCardPhoneUsedModal";
import { submitApplication, uploadFormValues, type FormState } from "./creditCardApi";
import { BACK_PATH, ConfirmModal, FieldWrap, SectionTitle, SuccessModal, TextInput, baseInput, buildSummary, cleanPayload, emptyForm, isPhoneUsedError, maxBirthDate, stateInput, useLockBody, validateForm } from "./creditCardShared";

/* =========================================
   KONFIGURASI DOKUMEN
========================================== */

const MAX_BYTES = 15 * 1024 * 1024; // sama dengan BE: max:15360 (KB)
const ACCEPT = "image/jpeg,image/png,application/pdf";

type DocDef = {
  name: string; // HARUS sama dengan `name` di DEFAULT_FORM_FIELDS (BE)
  label: string;
  hint: string;
  required: boolean;
};

const DOCS: DocDef[] = [
  { name: "foto_ktp_customer", label: "Foto KTP Customer", hint: "Foto KTP asli, terlihat jelas dan tidak buram.", required: true },
  { name: "foto_npwp", label: "Foto NPWP", hint: "Foto kartu NPWP, terlihat jelas.", required: true },
  { name: "slip_gaji", label: "Slip Gaji", hint: "Slip gaji terbaru (maksimal 3 bulan terakhir).", required: true },
  { name: "kartu_keluarga", label: "Kartu Keluarga", hint: "Opsional, seluruh halaman KK dalam satu foto.", required: false },
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
   SLOT UPLOAD
========================================== */

type DocSlotProps = {
  doc: DocDef;
  file: File | null;
  status: DocStatus;
  message?: string;
  showError: boolean;
  disabled?: boolean;
  onPick: (f: File) => void;
  onClear: () => void;
};

const DocSlot = ({ doc, file, status, message, showError, disabled, onPick, onClear }: DocSlotProps) => {
  const inputId = `cc-doc-${doc.name}`;

  const preview = useMemo(() => (file && file.type.startsWith("image/") ? URL.createObjectURL(file) : null), [file]);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview]
  );

  const missing = showError && doc.required && !file;
  const invalid = missing || !!message;
  const border = invalid ? "border-red-300 bg-red-50/40" : file ? "border-green-300 bg-green-50/40" : "border-gray-200 bg-white";

  return (
    <div data-invalid={invalid ? "true" : "false"} className={`rounded-2xl border p-4 transition focus-within:ring-4 focus-within:ring-red-100 ${border}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-black text-gray-900">{doc.label}</p>
          <p className="mt-0.5 text-xs text-gray-500">{doc.hint}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${doc.required ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`}>{doc.required ? "Wajib" : "Opsional"}</span>
      </div>

      <input
        id={inputId}
        type="file"
        accept={ACCEPT}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
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
          <span className="text-[11px] text-gray-400">JPG, PNG, atau PDF · maks 15 MB</span>
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
  active: boolean; // true saat tab "Isi Formulir Lengkap" dibuka
  initialCardName: string; // dari ?card=
  onBackToSimple: () => void;
};

const CreditCardFullForm = ({ active, initialCardName, onBackToSimple }: Props) => {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({ ...emptyForm, card_name: initialCardName });
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

  // Kalau nama kartu di URL berubah dan user belum mengetik apa pun di kolomnya
  useEffect(() => {
    setForm((p) => (p.card_name ? p : { ...p, card_name: initialCardName }));
  }, [initialCardName]);

  const setField = (key: keyof FormState, value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  const touch = (key: keyof FormState) => setTouched((t) => ({ ...t, [key]: true }));

  const errors = useMemo(() => validateForm(form, usedPhone), [form, usedPhone]);
  const missingDocs = DOCS.filter((d) => d.required && !files[d.name]);
  const isValid = Object.keys(errors).length === 0 && missingDocs.length === 0;
  const err = (k: keyof FormState) => (touched[k] ? errors[k] : undefined);

  // Popup info muncul sekali saat tab ini pertama kali dibuka
  useEffect(() => {
    if (active && !infoSeen) {
      setInfoOpen(true);
      setInfoSeen(true);
    }
  }, [active, infoSeen]);

  useLockBody(infoOpen || openConfirm || openUpload || openSuccess || phoneUsedOpen);

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
      setDocMsg((m) => ({ ...m, [doc.name]: "Ukuran file maksimal 15 MB." }));
      return;
    }

    setFiles((f) => ({ ...f, [doc.name]: result }));
  };

  const handleClear = (doc: DocDef) => {
    setFiles((f) => ({ ...f, [doc.name]: null }));
    setDocStatus((s) => ({ ...s, [doc.name]: "idle" }));
    setDocMsg((m) => ({ ...m, [doc.name]: "" }));
  };

  const queuedDocs = DOCS.filter((d) => files[d.name]);
  const failedDocs = DOCS.filter((d) => docStatus[d.name] === "error");
  const doneCount = queuedDocs.filter((d) => docStatus[d.name] === "done").length;

  // Upload satu per satu (1 request = 1 file) supaya aman dari batas post_max_size & bisa retry per dokumen
  const runUploads = async (token: string): Promise<boolean> => {
    const queue = DOCS.filter((d) => files[d.name] && docStatus[d.name] !== "done");
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
      setTimeout(() => document.querySelector<HTMLElement>('#cc-full-form [data-invalid="true"]')?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
      return;
    }

    window.fbq?.("track", "InitiateCheckout", { content_name: form.card_name });
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

      // Langkah 1: simpan data pengajuan (sekali saja, supaya nomor telepon tidak ditolak saat retry)
      if (!token) {
        const result = await submitApplication(cleanPayload(form));

        token = result.accessToken;
        setAccessToken(token);
        setRefNumber(result.applicationNumber);
        window.fbq?.("track", "Lead", { content_name: form.card_name, content_category: "Credit Card" }, { eventID: result.applicationNumber });
      }

      setOpenConfirm(false);

      if (!token) {
        console.error("accessToken tidak dikembalikan BE, upload dokumen dilewati.");
        setOpenSuccess(true);
        return;
      }

      // Langkah 2: upload dokumen
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
        setUsedPhone(form.applicant_phone);
        setTouched((t) => ({ ...t, applicant_phone: true }));
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
      const el = document.getElementById("cc-full-phone");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus();
    }, 50);
  };

  const handleFinish = () => {
    setOpenSuccess(false);
    setForm({ ...emptyForm, card_name: initialCardName });
    setTouched({});
    setSubmitted(false);
    setFiles({});
    setDocStatus({});
    setDocMsg({});
    setAccessToken("");
    setUsedPhone("");
    navigate(BACK_PATH);
  };

  const busy = submitting || uploading;

  return (
    <>
      <form id="cc-full-form" onSubmit={handleSubmit} noValidate className={`p-5 sm:p-8 space-y-8 ${active ? "" : "hidden"}`}>
        <div className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div>
            <p className="text-sm font-black text-emerald-800">Isi lengkap, proses lebih cepat</p>
            <p className="mt-0.5 text-xs sm:text-sm leading-relaxed text-emerald-700">Lengkapi data dan dokumen di bawah ini agar pengajuan kartu kredit kamu bisa langsung diproses.</p>
          </div>
        </div>

        {/* KARTU */}
        <section className="space-y-5">
          <SectionTitle title="Kartu Kredit" desc="Kartu yang ingin kamu ajukan." />

          <FieldWrap id="cc-full-card" label="Nama Kartu Kredit" error={err("card_name")}>
            <TextInput id="cc-full-card" icon={CreditCard} value={form.card_name} onChange={(v) => setField("card_name", v)} onBlur={() => touch("card_name")} placeholder="Contoh: BCA Everyday Card" hasError={!!err("card_name")} />
          </FieldWrap>
        </section>

        {/* DATA DIRI */}
        <section className="space-y-5">
          <SectionTitle title="Data Diri" />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FieldWrap id="cc-full-name" label="Nama sesuai KTP" error={err("applicant_name")} className="sm:col-span-2">
              <TextInput
                id="cc-full-name"
                icon={User}
                value={form.applicant_name}
                onChange={(v) => setField("applicant_name", v)}
                onBlur={() => touch("applicant_name")}
                placeholder="Contoh: Budi Santoso"
                hasError={!!err("applicant_name")}
              />
            </FieldWrap>

            <FieldWrap id="cc-full-phone" label="Nomor Telepon / WhatsApp" error={err("applicant_phone")} className="sm:col-span-2">
              <TextInput
                id="cc-full-phone"
                icon={Phone}
                type="tel"
                inputMode="tel"
                value={form.applicant_phone}
                onChange={(v) => setField("applicant_phone", v)}
                onBlur={() => touch("applicant_phone")}
                placeholder="081234567890"
                hasError={!!err("applicant_phone")}
              />
            </FieldWrap>

            <FieldWrap id="cc-full-birth-place" label="Tempat Lahir" error={err("birth_place")}>
              <TextInput id="cc-full-birth-place" icon={MapPin} value={form.birth_place} onChange={(v) => setField("birth_place", v)} onBlur={() => touch("birth_place")} placeholder="Contoh: Bogor" hasError={!!err("birth_place")} />
            </FieldWrap>

            <FieldWrap id="cc-full-birth-date" label="Tanggal Lahir" error={err("birth_date")}>
              <TextInput id="cc-full-birth-date" type="date" max={maxBirthDate()} value={form.birth_date} onChange={(v) => setField("birth_date", v)} onBlur={() => touch("birth_date")} hasError={!!err("birth_date")} />
            </FieldWrap>

            <FieldWrap id="cc-full-address" label="Alamat Lengkap" error={err("applicant_address")} className="sm:col-span-2">
              <textarea
                id="cc-full-address"
                rows={3}
                value={form.applicant_address}
                onChange={(e) => setField("applicant_address", e.target.value)}
                onBlur={() => touch("applicant_address")}
                placeholder="Jalan, RT/RW, kelurahan, kecamatan, kota"
                className={`${baseInput} px-4 resize-none ${stateInput(!!err("applicant_address"))}`}
              />
            </FieldWrap>
          </div>
        </section>

        {/* DOKUMEN */}
        <section className="space-y-5">
          <SectionTitle title="Dokumen Pendukung" desc="Foto atau scan dokumen asli. Pastikan jelas, tidak buram, dan semua sisi terlihat." />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {DOCS.map((d) => (
              <DocSlot key={d.name} doc={d} file={files[d.name] ?? null} status={docStatus[d.name] ?? "idle"} message={docMsg[d.name]} showError={submitted} disabled={busy} onPick={(f) => handlePick(d, f)} onClear={() => handleClear(d)} />
            ))}
          </div>
        </section>

        <button
          type="submit"
          disabled={busy}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-red-200 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 disabled:opacity-60">
          Kirim Pengajuan Lengkap
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </form>

      {/* POPUP: INFO (sekali, saat tab lengkap pertama dibuka) */}
      {infoOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setInfoOpen(false)} />
          <div className="relative bg-white w-full sm:max-w-md max-h-[92vh] overflow-y-auto rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl animate-[popIn_.3s_ease]">
            <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-700 px-6 py-5 text-white flex items-center gap-3 rounded-t-[2rem]">
              <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center">
                <Info className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-black">Isi Formulir Lengkap</h3>
            </div>

            <div className="p-6">
              <p className="text-sm sm:text-base leading-relaxed text-gray-700">
                Dengan mengisi data dan dokumen secara lengkap, pengajuan kamu <span className="font-black text-gray-900">bisa langsung diproses tim kami</span>.
              </p>

              <ul className="mt-4 space-y-2.5 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
                <li className="flex gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                  Siapkan foto KTP, NPWP, dan slip gaji terbaru.
                </li>
                <li className="flex gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                  Format JPG, PNG, atau PDF, maksimal 15 MB per file.
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

      <ConfirmModal
        open={openConfirm}
        summary={buildSummary(form, queuedDocs.length)}
        agree={agree}
        onAgree={setAgree}
        submitting={submitting}
        error={submitError}
        statement="Saya menyatakan bahwa data dan dokumen di atas benar dan sesuai dokumen asli, serta setuju dihubungi oleh pihak penerbit kartu kredit untuk proses pengajuan."
        onCancel={() => setOpenConfirm(false)}
        onConfirm={handleConfirm}
      />

      {/* POPUP: PROGRES UPLOAD */}
      {openUpload && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white w-full max-w-md max-h-[92vh] overflow-y-auto rounded-[2rem] shadow-2xl p-6 animate-[popIn_.3s_ease]">
            <h3 className="text-lg sm:text-xl font-black text-gray-900">{uploading ? "Mengunggah Dokumen..." : failedDocs.length ? "Sebagian Dokumen Gagal Terkirim" : "Dokumen Terkirim"}</h3>
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

      <PhoneUsedModal open={phoneUsedOpen} onClose={handleClosePhoneUsed} phone={usedPhone} name={form.applicant_name.trim()} />

      <SuccessModal
        open={openSuccess}
        refNumber={refNumber}
        message="Data dan dokumen kamu sudah kami terima. Tim kami akan menghubungi lewat telepon atau WhatsApp dalam 1x24 jam kerja."
        warning={failedDocs.length > 0 ? `${failedDocs.length} dokumen belum terkirim. Silakan kirim ke admin lewat WhatsApp agar pengajuan tetap diproses.` : undefined}
        onFinish={handleFinish}
      />
    </>
  );
};

export default CreditCardFullForm;
