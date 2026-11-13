// pages/MultiFinanceForm.tsx

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, ClipboardList, Loader2, MessageCircle, Phone, User, X, Zap } from "lucide-react";
import FloatingWaButton from "./floatingwabutton";
import PhoneUsedModal from "./PhoneUseModal"; // sesuaikan path kalau file-nya ditaruh di folder lain
import MultiFinanceFullForm, { emptyForm, isPhoneUsedError, layananList } from "./form-multifinanceFull";

import Navbars from "../../Components/Navbar/index";
import { submitApplication, type FormState, type Layanan } from "./multifinanceApi";

type FieldKey = keyof FormState;
type Mode = "cepat" | "lengkap";

/* =========================================
   KONFIGURASI
========================================== */

// GANTI dengan nomor WhatsApp admin (format internasional, tanpa + dan tanpa spasi)
const WA_NUMBER = "6281234567890";

const PHONE_RE = /^(\+62|62|0)8[1-9][0-9]{7,10}$/;
const TAKE_OVER = "Take Over"; // leasing asal hanya diisi untuk status ini

// Nilai harus sama persis dengan tipe di multifinanceApi.ts
const OPTIONS = {
  tipe_pemohon: ["Individu", "Perusahaan"],
  kepemilikan: ["Sendiri", "Orang Lain"],
  jenis: ["Mobil", "Motor"],
  transmisi: ["Matic", "Manual"],
  status_pembiayaan: ["BPKB On Hand", "Take Over"],
};

const YEARS = Array.from({ length: 30 }, (_, i) => String(new Date().getFullYear() - i));

const tabs = [
  { key: "cepat", label: "Pengajuan Cepat", sub: "Isi data, tanpa upload foto", icon: Zap },
  { key: "lengkap", label: "Isi Formulir Lengkap", sub: "Tinggal tunggu pencairan", icon: ClipboardList },
] as const;

/* =========================================
   KOMPONEN KECIL (di luar komponen utama supaya input tidak kehilangan fokus)
========================================== */

const baseInput = "w-full rounded-2xl border bg-gray-50 py-3.5 text-sm sm:text-base text-gray-800 placeholder-gray-400 outline-none transition focus:bg-white focus:ring-4";
const stateInput = (hasError?: boolean) => (hasError ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-red-400 focus:ring-red-100");

type FieldWrapProps = { id: string; label: string; error?: string; hint?: string; className?: string; children: React.ReactNode };

const FieldWrap = ({ id, label, error, hint, className = "", children }: FieldWrapProps) => (
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

/* =========================================
   HALAMAN
========================================== */

const MultiFinanceForm = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>("cepat");

  const [form, setForm] = useState<FormState>(emptyForm);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [openConfirm, setOpenConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  // Popup nomor telepon sudah terdaftar
  const [phoneUsedOpen, setPhoneUsedOpen] = useState(false);
  const [usedPhone, setUsedPhone] = useState(""); // nomor yang ditolak BE

  const isSHM = form.layanan === "Jaminkan SHM";

  const setField = (key: FieldKey, value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  const touch = (key: FieldKey) => setTouched((t) => ({ ...t, [key]: true }));

  const handleLayanan = (v: Layanan) => {
    setField("layanan", v);
    touch("layanan");
  };

  const errors = useMemo(() => {
    const e: Partial<Record<FieldKey, string>> = {};
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
      if (!form.jenis_surat.trim()) e.jenis_surat = "Isi jenis sertifikat.";
    } else {
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

  const isValid = Object.keys(errors).length === 0;

  const err = (k: FieldKey) => (touched[k] ? errors[k] : undefined);

  useEffect(() => {
    window.fbq?.("track", "ViewContent", { content_name: "Form Multi Finance" });
  }, []);

  useEffect(() => {
    document.body.style.overflow = openConfirm || openSuccess || phoneUsedOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openConfirm, openSuccess, phoneUsedOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(Object.fromEntries(Object.keys(emptyForm).map((k) => [k, true])));

    if (!isValid) {
      setTimeout(() => document.querySelector<HTMLElement>('#quick-form [data-invalid="true"]')?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
      return;
    }

    window.fbq?.("track", "InitiateCheckout", { content_name: form.layanan });
    setAgree(false);
    setSubmitError("");
    setOpenConfirm(true);
  };

  // Kirim ke API (tanpa login). Data tersimpan di database.
  const handleConfirm = async () => {
    if (submitting) return;
    setSubmitError("");
    setSubmitting(true);

    try {
      const payload: FormState = {
        ...emptyForm,
        nama: form.nama.trim(),
        telepon: form.telepon,
        usia: form.usia,
        alamat: form.alamat.trim(),
        tipe_pemohon: form.tipe_pemohon,
        layanan: form.layanan,
        kepemilikan: form.kepemilikan,
        // Field khusus SHM
        jenis_surat: isSHM ? form.jenis_surat.trim() : "",
        // Field khusus kendaraan
        jenis: isSHM ? "" : form.jenis,
        merek: isSHM ? "" : form.merek.trim(),
        tipe: isSHM ? "" : form.tipe.trim(),
        tahun: isSHM ? "" : form.tahun,
        transmisi: isSHM ? "" : form.transmisi,
        status_pembiayaan: isSHM ? "" : form.status_pembiayaan,
        leasing_asal: !isSHM && form.status_pembiayaan === TAKE_OVER ? form.leasing_asal.trim() : "",
      };

      const result = await submitApplication(payload);
      setRefNumber(result.applicationNumber);
      window.fbq?.("track", "Lead", { content_name: form.layanan, content_category: "Multi Finance" }, { eventID: result.applicationNumber });
      setOpenConfirm(false);
      setOpenSuccess(true);
    } catch (err) {
      if (isPhoneUsedError(err)) {
        // Nomor sudah dipakai: tutup konfirmasi, tampilkan popup khusus
        setUsedPhone(form.telepon);
        setTouched((t) => ({ ...t, telepon: true }));
        setOpenConfirm(false);
        setPhoneUsedOpen(true);
        return;
      }

      setSubmitError(err instanceof Error ? err.message : "Pengajuan gagal dikirim. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  // Pengajuan lewat WhatsApp: pesan template simpel, tanpa data form
  const handleWhatsApp = () => {
    const message = "Halo Admin Pindar, saya ingin mengajukan dana tunai lewat WhatsApp. Mohon dibantu prosesnya ya. Terima kasih.";

    window.fbq?.("track", "Contact", { content_name: "Pengajuan via WhatsApp" });
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  const handleClosePhoneUsed = () => {
    setPhoneUsedOpen(false);
    // Arahkan user langsung ke kolom nomor telepon
    setTimeout(() => document.getElementById("telepon")?.focus(), 50);
  };

  const handleCloseSuccess = () => {
    setOpenSuccess(false);
    setForm(emptyForm);
    setTouched({});
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
  ].filter((s) => s.value);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-white font-signika">
      <Navbars />

      <section className="px-4 lg:px-8 pt-8 sm:pt-12 pb-16 sm:pb-24">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate("/multi-finance")} className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 mb-5 mt-24 sm:mt-16">
            <ArrowLeft className="w-4 h-4 " />
            Kembali
          </button>

          <div className="bg-white rounded-2xl sm:rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-700 px-5 sm:px-8 py-6 text-white">
              <p className="font-bold uppercase text-xs sm:text-sm text-white/80">Pengajuan</p>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black">Formulir Pengajuan Dana Tunai</h2>
              <p className="mt-1 text-sm text-white/90">
                {mode === "cepat" ? "Isi data diri, layanan, dan data jaminan atau kendaraan. Tanpa upload foto, dokumen bisa dilengkapi oleh tim kami." : "Lengkapi data diri, data jaminan, dan dokumen pendukung dalam satu kali pengisian."}
              </p>
            </div>

            {/* PILIH MODE PENGISIAN */}
            <div className="px-5 sm:px-8 pt-5">
              <div role="tablist" aria-label="Mode pengisian" className="grid grid-cols-2 gap-1.5 rounded-2xl bg-gray-100 p-1.5">
                {tabs.map((t) => {
                  const Icon = t.icon;
                  const on = mode === t.key;

                  return (
                    <button
                      key={t.key}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      onClick={() => setMode(t.key)}
                      className={`flex flex-col items-center gap-0.5 rounded-xl px-2 py-2.5 text-center transition focus:outline-none focus-visible:ring-4 focus-visible:ring-red-100 ${
                        on ? "bg-white text-red-600 shadow" : "text-gray-500 hover:text-gray-700"
                      }`}>
                      <span className="flex items-center gap-1.5 text-xs sm:text-sm font-black">
                        <Icon className="h-4 w-4" />
                        {t.label}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-semibold opacity-80">{t.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MODE 1: PENGAJUAN CEPAT (tanpa foto) */}
            <form id="quick-form" onSubmit={handleSubmit} noValidate className={`p-5 sm:p-8 space-y-8 ${mode === "cepat" ? "" : "hidden"}`}>
              {/* DATA DIRI */}
              <section className="space-y-5">
                <SectionTitle title="Data Diri" />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FieldWrap id="nama" label="Nama sesuai KTP" error={err("nama")} className="sm:col-span-2">
                    <TextInput id="nama" icon={User} value={form.nama} onChange={(v) => setField("nama", v)} onBlur={() => touch("nama")} placeholder="Contoh: Budi Santoso" hasError={!!err("nama")} />
                  </FieldWrap>

                  <FieldWrap id="telepon" label="Nomor Telepon / WhatsApp" error={err("telepon")}>
                    <TextInput id="telepon" icon={Phone} type="tel" inputMode="tel" value={form.telepon} onChange={(v) => setField("telepon", v)} onBlur={() => touch("telepon")} placeholder="081234567890" hasError={!!err("telepon")} />
                  </FieldWrap>

                  <FieldWrap id="usia" label="Usia" error={err("usia")}>
                    <TextInput id="usia" type="number" inputMode="numeric" value={form.usia} onChange={(v) => setField("usia", v)} onBlur={() => touch("usia")} placeholder="Contoh: 35" hasError={!!err("usia")} />
                  </FieldWrap>

                  <FieldWrap id="tipe_pemohon" label="Tipe Pemohon" error={err("tipe_pemohon")} className="sm:col-span-2">
                    <SelectInput
                      id="tipe_pemohon"
                      value={form.tipe_pemohon}
                      onChange={(v) => setField("tipe_pemohon", v)}
                      onBlur={() => touch("tipe_pemohon")}
                      options={OPTIONS.tipe_pemohon}
                      placeholder="Pilih tipe pemohon"
                      hasError={!!err("tipe_pemohon")}
                    />
                  </FieldWrap>

                  <FieldWrap id="alamat" label="Alamat Lengkap" error={err("alamat")} className="sm:col-span-2">
                    <textarea
                      id="alamat"
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
                  <div className="grid grid-cols-1 gap-3">
                    {layananList.map((l: any) => {
                      const Icon = l.icon;
                      const active = form.layanan === l.value;
                      return (
                        <button
                          type="button"
                          key={l.value}
                          onClick={() => handleLayanan(l.value)}
                          aria-pressed={active}
                          className={`text-left rounded-2xl border p-4 transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-100 ${
                            active ? "border-red-500 bg-red-50 shadow-md" : "border-gray-200 bg-white hover:border-red-300"
                          }`}>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? "bg-red-500 text-white" : "bg-red-50 text-red-500"}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <p className="mt-3 text-sm font-black text-gray-900">{l.value}</p>
                          {l.desc && <p className="mt-0.5 text-xs text-gray-500">{l.desc}</p>}
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
                  <FieldWrap id="kepemilikan" label={isSHM ? "Sertifikat Atas Nama" : "BPKB Atas Nama"} error={err("kepemilikan")}>
                    <SelectInput
                      id="kepemilikan"
                      value={form.kepemilikan}
                      onChange={(v) => setField("kepemilikan", v)}
                      onBlur={() => touch("kepemilikan")}
                      options={OPTIONS.kepemilikan}
                      placeholder="Pilih pemilik"
                      hasError={!!err("kepemilikan")}
                    />
                  </FieldWrap>

                  {isSHM ? (
                    <FieldWrap id="jenis_surat" label="Jenis Sertifikat" error={err("jenis_surat")}>
                      <TextInput id="jenis_surat" value={form.jenis_surat} onChange={(v) => setField("jenis_surat", v)} onBlur={() => touch("jenis_surat")} placeholder="Contoh: SHM atau SHGB" hasError={!!err("jenis_surat")} />
                    </FieldWrap>
                  ) : (
                    <>
                      <FieldWrap id="jenis" label="Jenis Kendaraan" error={err("jenis")}>
                        <SelectInput id="jenis" value={form.jenis} onChange={(v) => setField("jenis", v)} onBlur={() => touch("jenis")} options={OPTIONS.jenis} placeholder="Pilih jenis" hasError={!!err("jenis")} />
                      </FieldWrap>

                      <FieldWrap id="merek" label="Merek" error={err("merek")}>
                        <TextInput id="merek" value={form.merek} onChange={(v) => setField("merek", v)} onBlur={() => touch("merek")} placeholder="Contoh: Honda" hasError={!!err("merek")} />
                      </FieldWrap>

                      <FieldWrap id="tipe" label="Tipe" error={err("tipe")}>
                        <TextInput id="tipe" value={form.tipe} onChange={(v) => setField("tipe", v)} onBlur={() => touch("tipe")} placeholder="Contoh: Brio RS" hasError={!!err("tipe")} />
                      </FieldWrap>

                      <FieldWrap id="tahun" label="Tahun" error={err("tahun")}>
                        <SelectInput id="tahun" value={form.tahun} onChange={(v) => setField("tahun", v)} onBlur={() => touch("tahun")} options={YEARS} placeholder="Pilih tahun" hasError={!!err("tahun")} />
                      </FieldWrap>

                      <FieldWrap id="transmisi" label="Transmisi" error={err("transmisi")}>
                        <SelectInput
                          id="transmisi"
                          value={form.transmisi}
                          onChange={(v) => setField("transmisi", v)}
                          onBlur={() => touch("transmisi")}
                          options={OPTIONS.transmisi}
                          placeholder="Pilih transmisi"
                          hasError={!!err("transmisi")}
                        />
                      </FieldWrap>

                      <FieldWrap id="status_pembiayaan" label="Status Pembiayaan" error={err("status_pembiayaan")} hint="BPKB On Hand: BPKB ada di tangan kamu. Take Over: kendaraan masih dalam cicilan leasing." className="sm:col-span-2">
                        <SelectInput
                          id="status_pembiayaan"
                          value={form.status_pembiayaan}
                          onChange={(v) => setField("status_pembiayaan", v)}
                          onBlur={() => touch("status_pembiayaan")}
                          options={OPTIONS.status_pembiayaan}
                          placeholder="Pilih status"
                          hasError={!!err("status_pembiayaan")}
                        />
                      </FieldWrap>

                      {form.status_pembiayaan === TAKE_OVER && (
                        <FieldWrap id="leasing_asal" label="Leasing Asal" error={err("leasing_asal")} className="sm:col-span-2">
                          <TextInput id="leasing_asal" value={form.leasing_asal} onChange={(v) => setField("leasing_asal", v)} onBlur={() => touch("leasing_asal")} placeholder="Contoh: Adira Finance" hasError={!!err("leasing_asal")} />
                        </FieldWrap>
                      )}
                    </>
                  )}
                </div>
              </section>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-red-200 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300">
                Ajukan
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* PENGAJUAN LEWAT WHATSAPP */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="h-px flex-1 bg-gray-200" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">atau</span>
                  <span className="h-px flex-1 bg-gray-200" />
                </div>

                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="w-full py-3.5 rounded-2xl border-2 border-green-500 bg-green-50 text-green-700 font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-green-100 active:scale-[0.98] transition-all duration-300">
                  <MessageCircle className="w-5 h-5" />
                  Pengajuan Lewat WhatsApp
                </button>

                <p className="text-center text-xs sm:text-sm text-gray-500">Males isi formulir? Kamu bisa langsung ajukan lewat WhatsApp, tim kami bantu prosesnya.</p>
              </div>
            </form>

            {/* MODE 2: FORMULIR LENGKAP (tetap ter-mount supaya isian tidak hilang saat pindah tab) */}
            <MultiFinanceFullForm active={mode === "lengkap"} onBackToSimple={() => setMode("cepat")} />
          </div>
        </div>
      </section>

      {/* POPUP: PERNYATAAN & CROSS CHECK */}
      {openConfirm && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !submitting && setOpenConfirm(false)} />
          <div className="relative bg-white w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl animate-[popIn_.3s_ease]">
            <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-700 px-6 py-5 text-white flex items-start justify-between gap-4 rounded-t-[2rem]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 id="confirm-title" className="text-lg sm:text-xl font-black">
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
                <span className="text-sm text-gray-700 leading-relaxed">Saya menyatakan bahwa data di atas benar dan sesuai dokumen asli, serta setuju dihubungi oleh pihak multi finance untuk proses pengajuan.</span>
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

      {/* POPUP: NOMOR TELEPON SUDAH TERDAFTAR */}
      <PhoneUsedModal open={phoneUsedOpen} onClose={handleClosePhoneUsed} phone={usedPhone} name={form.nama.trim()} />

      {/* POPUP: BERHASIL */}
      {openSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="success-title">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-6 sm:p-10 text-center animate-[popIn_.3s_ease]">
            <div className="relative w-24 h-24 mx-auto">
              <span className="absolute inset-0 rounded-full bg-green-200 animate-ping motion-reduce:animate-none opacity-60"></span>
              <div className="relative w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-14 h-14 text-green-600" />
              </div>
            </div>

            <h3 id="success-title" className="mt-6 text-2xl sm:text-3xl font-black text-gray-800">
              Pengajuan Terkirim
            </h3>
            <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">Data kamu sedang kami proses. Tim kami akan menghubungi lewat telepon atau Whats App dalam 1x24 jam kerja.</p>

            <div className="mt-5 inline-block rounded-2xl bg-red-50 border border-red-100 px-5 py-3">
              <p className="text-xs text-gray-500 font-semibold">Nomor referensi</p>
              <p className="text-lg font-black text-red-600 tracking-wide">{refNumber}</p>
            </div>

            <button onClick={handleCloseSuccess} className="mt-7 w-full py-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-sm sm:text-base shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
              Selesai
            </button>
          </div>
        </div>
      )}

      <FloatingWaButton />
    </div>
  );
};

export default MultiFinanceForm;
