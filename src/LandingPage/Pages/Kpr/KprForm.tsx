// pages/KprForm.tsx

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Briefcase, ChevronDown, CircleCheck, Clock3, Home, Info, Landmark, Mail, MapPin, MessageCircle, Percent, Phone, User, Wallet } from "lucide-react";

import Navbars from "../../Components/Navbar/index"; // sesuaikan path
import { kprBanks } from "./kprBanks"; // sesuaikan path
import { calculateKpr } from "./KprSimulator"; // sesuaikan path

/* ================================================================== */
/* Konfigurasi                                                         */
/* ================================================================== */

const BACK_PATH = "/kpr";

// GANTI dengan nomor WhatsApp admin (format internasional, tanpa + dan tanpa spasi)
const WA_NUMBER = "6281234567890";

const DEFAULT_RATE = 7.5;
const TENORS = [5, 10, 15, 20, 25, 30];
const MIN_AGE = 21;

const PROPERTY_TYPES = [
  { value: "baru", label: "Rumah Baru (Developer)" },
  { value: "second", label: "Rumah Bekas (Second)" },
];

const OCCUPATIONS = ["Karyawan Swasta", "PNS / BUMN / TNI / Polri", "Wiraswasta / Pengusaha", "Profesional (dokter, pengacara, dll)", "Lainnya"];

/* ================================================================== */
/* Form state, validasi, util                                          */
/* ================================================================== */

interface KprFormState {
  bank: string;
  property_type: string;
  property_location: string;
  property_price: string;
  dp_percent: string;
  tenor_years: string;
  applicant_name: string;
  applicant_phone: string;
  applicant_email: string;
  birth_place: string;
  birth_date: string;
  applicant_address: string;
  occupation: string;
  monthly_income: string;
  monthly_obligation: string;
}

type Errors = Partial<Record<keyof KprFormState, string>>;

const emptyForm: KprFormState = {
  bank: "",
  property_type: "",
  property_location: "",
  property_price: "",
  dp_percent: "20",
  tenor_years: "20",
  applicant_name: "",
  applicant_phone: "",
  applicant_email: "",
  birth_place: "",
  birth_date: "",
  applicant_address: "",
  occupation: "",
  monthly_income: "",
  monthly_obligation: "",
};

const nf = new Intl.NumberFormat("id-ID");
const rupiah = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Math.round(n));
const digitsOnly = (v: string) => v.replace(/\D/g, "").slice(0, 13);
const fmtDigits = (v: string) => (v ? nf.format(Number(v)) : "");
const cleanPhone = (v: string) => v.replace(/[\s-]/g, "");

const maxBirthDate = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - MIN_AGE);
  return d.toISOString().slice(0, 10);
};

function validateForm(f: KprFormState): Errors {
  const e: Errors = {};
  const price = Number(f.property_price);
  const dp = Number(f.dp_percent);

  if (!f.property_type) e.property_type = "Pilih jenis properti.";
  if (f.property_location.trim().length < 3) e.property_location = "Isi lokasi properti (kota atau kecamatan).";

  if (!price) e.property_price = "Isi harga properti.";
  else if (price < 50_000_000) e.property_price = "Harga properti minimal Rp 50.000.000.";

  if (!f.dp_percent || dp < 5 || dp > 90) e.dp_percent = "DP harus antara 5% sampai 90%.";
  if (!f.tenor_years) e.tenor_years = "Pilih tenor.";

  if (f.applicant_name.trim().length < 3) e.applicant_name = "Isi nama sesuai KTP.";
  if (!/^(?:\+62|62|0)8\d{8,12}$/.test(cleanPhone(f.applicant_phone))) e.applicant_phone = "Nomor tidak valid. Contoh: 081234567890";
  if (f.applicant_email.trim() && !/^\S+@\S+\.\S+$/.test(f.applicant_email.trim())) e.applicant_email = "Format email tidak valid.";

  if (f.birth_place.trim().length < 2) e.birth_place = "Isi tempat lahir.";
  if (!f.birth_date) e.birth_date = "Isi tanggal lahir.";
  else if (f.birth_date > maxBirthDate()) e.birth_date = `Usia minimal ${MIN_AGE} tahun.`;

  if (f.applicant_address.trim().length < 10) e.applicant_address = "Isi alamat lengkap.";

  if (!f.occupation) e.occupation = "Pilih pekerjaan.";
  if (!Number(f.monthly_income)) e.monthly_income = "Isi penghasilan bersih per bulan.";

  return e;
}

function useLockBody(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

/* ================================================================== */
/* Komponen UI kecil                                                   */
/* ================================================================== */

const baseInput = "w-full rounded-2xl bg-gray-50 py-3 text-sm font-semibold text-gray-800 ring-1 ring-gray-200 placeholder:font-normal placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-400 transition";
const stateInput = (hasError: boolean) => (hasError ? "!ring-red-400 bg-red-50/40" : "");

function SectionTitle({ title, desc }: { title: string; desc?: string }) {
  return (
    <div>
      <h3 className="text-base sm:text-lg font-black text-gray-800">{title}</h3>
      {desc && <p className="mt-0.5 text-xs sm:text-sm text-gray-500">{desc}</p>}
    </div>
  );
}

function Field({ id, label, error, hint, optional, className = "", children }: { id: string; label: string; error?: string; hint?: string; optional?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div className={className} data-invalid={error ? "true" : undefined}>
      <label htmlFor={id} className="text-xs sm:text-sm font-bold text-gray-600">
        {label}
        {optional && <span className="ml-1 font-semibold text-gray-400">(opsional)</span>}
      </label>
      <div className="mt-2">{children}</div>
      {hint && !error && <p className="mt-1.5 text-xs text-gray-400">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1.5 text-xs font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "prefix"> & {
  onChange: (v: string) => void;
  icon?: React.ElementType;
  prefixText?: string;
  suffixText?: string;
  hasError?: boolean;
};

function Input({ icon: Icon, prefixText, suffixText, hasError, onChange, className = "", ...rest }: InputProps) {
  return (
    <div className="relative">
      {Icon && <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />}
      {prefixText && <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">{prefixText}</span>}
      <input
        {...rest}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={hasError || undefined}
        className={`${baseInput} ${Icon || prefixText ? "pl-11" : "pl-4"} ${suffixText ? "pr-10" : "pr-4"} ${stateInput(!!hasError)} ${className}`}
      />
      {suffixText && <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">{suffixText}</span>}
    </div>
  );
}

function Select({ id, icon: Icon, value, onChange, onBlur, hasError, children }: { id: string; icon?: React.ElementType; value: string; onChange: (v: string) => void; onBlur?: () => void; hasError?: boolean; children: React.ReactNode }) {
  return (
    <div className="relative">
      {Icon && <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />}
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} aria-invalid={hasError || undefined} className={`${baseInput} appearance-none pr-10 ${Icon ? "pl-11" : "pl-4"} ${stateInput(!!hasError)}`}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
    </div>
  );
}

/* ================================================================== */
/* Halaman                                                             */
/* ================================================================== */

const KprForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Dari simulasi KPR: ?harga=...&dp=...&tenor=...&bunga=...&bank=...
  const initial = useMemo<KprFormState>(() => {
    const harga = searchParams.get("harga") ?? "";
    const dp = searchParams.get("dp") ?? "";
    const tenor = searchParams.get("tenor") ?? "";
    const bank = searchParams.get("bank") ?? "";

    return {
      ...emptyForm,
      bank: kprBanks.some((b: { id: string }) => b.id === bank) ? bank : "",
      property_price: /^\d+$/.test(harga) ? harga : "",
      dp_percent: /^\d+$/.test(dp) ? dp : emptyForm.dp_percent,
      tenor_years: TENORS.includes(Number(tenor)) ? tenor : emptyForm.tenor_years,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rateParam = Number(searchParams.get("bunga"));
  const rate = rateParam >= 1 && rateParam <= 30 ? rateParam : DEFAULT_RATE;

  const [form, setForm] = useState<KprFormState>(initial);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [openSuccess, setOpenSuccess] = useState(false);

  const setField = (key: keyof KprFormState, value: string) => setForm((p) => ({ ...p, [key]: value }));
  const touch = (key: keyof KprFormState) => setTouched((t) => ({ ...t, [key]: true }));

  const errors = useMemo(() => validateForm(form), [form]);
  const isValid = Object.keys(errors).length === 0;
  const err = (k: keyof KprFormState) => (touched[k] ? errors[k] : undefined);

  const estimate = useMemo(
    () => calculateKpr({ price: Number(form.property_price) || 0, dpPercent: Number(form.dp_percent) || 0, tenorYears: Number(form.tenor_years) || 0, ratePercent: rate }),
    [form.property_price, form.dp_percent, form.tenor_years, rate]
  );

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    window.fbq?.("track", "ViewContent", { content_name: "Form KPR" });
  }, []);

  useLockBody(openSuccess);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(Object.fromEntries(Object.keys(emptyForm).map((k) => [k, true])));

    if (!isValid) {
      setTimeout(() => document.querySelector<HTMLElement>('#kpr-form [data-invalid="true"]')?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
      return;
    }

    // TODO: sambungkan ke BE di sini (kirim `form`), lalu tampilkan popup setelah sukses.
    // Untuk sementara langsung tampilkan popup berhasil.
    setOpenSuccess(true);
  };

  const handleWhatsApp = () => {
    const bank = kprBanks.find((b: { id: string }) => b.id === form.bank)?.name;
    const price = Number(form.property_price);
    const message = `Halo Admin, saya ingin mengajukan KPR Rumah${bank ? ` di ${bank}` : ""}${price ? ` dengan harga properti ${rupiah(price)}` : ""} lewat WhatsApp. Mohon dibantu prosesnya ya. Terima kasih.`;

    window.fbq?.("track", "Contact", { content_name: "Pengajuan KPR via WhatsApp" });
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  const handleCloseSuccess = () => {
    setOpenSuccess(false);
    setForm(emptyForm);
    setTouched({});
    navigate(BACK_PATH);
  };

  const showEstimate = Number(form.property_price) > 0 && Number(form.dp_percent) >= 5 && Number(form.tenor_years) > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-white font-signika">
      <Navbars />

      <section className="px-4 lg:px-8 pt-8 sm:pt-12 pb-16 sm:pb-24">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 mb-5 mt-24 sm:mt-16">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>

          <div className="bg-white rounded-2xl sm:rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-700 px-5 sm:px-8 py-6 text-white">
              <p className="font-bold uppercase text-xs sm:text-sm text-white/80">Pengajuan</p>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black">Formulir Pengajuan KPR Rumah</h2>
              <p className="mt-1 text-sm text-white/90">Isi data singkat tanpa upload dokumen. Bank akan menghubungi kamu untuk langkah berikutnya.</p>
            </div>

            <form id="kpr-form" onSubmit={handleSubmit} noValidate className="p-5 sm:p-8 space-y-8">
              <div className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <p className="text-xs sm:text-sm leading-relaxed text-emerald-700">
                  Kamu tidak perlu upload dokumen di sini. Setelah mengirim, kamu akan dihubungi untuk melengkapi dokumen seperti KTP, NPWP, dan slip gaji. Persetujuan KPR sepenuhnya keputusan bank.
                </p>
              </div>

              {/* PILIHAN KPR */}
              <section className="space-y-5">
                <SectionTitle title="Pilihan KPR" desc="Bank dan properti yang kamu incar." />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field id="kpr-bank" label="Bank Pilihan" optional hint="Kosongkan jika belum menentukan." className="sm:col-span-2">
                    <Select id="kpr-bank" icon={Landmark} value={form.bank} onChange={(v) => setField("bank", v)}>
                      <option value="">Belum menentukan / bebas</option>
                      {kprBanks.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </Select>
                  </Field>

                  <Field id="kpr-type" label="Jenis Properti" error={err("property_type")}>
                    <Select id="kpr-type" icon={Home} value={form.property_type} onChange={(v) => setField("property_type", v)} onBlur={() => touch("property_type")} hasError={!!err("property_type")}>
                      <option value="">Pilih jenis properti</option>
                      {PROPERTY_TYPES.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </Select>
                  </Field>

                  <Field id="kpr-location" label="Lokasi Properti" error={err("property_location")}>
                    <Input
                      id="kpr-location"
                      icon={MapPin}
                      value={form.property_location}
                      onChange={(v) => setField("property_location", v)}
                      onBlur={() => touch("property_location")}
                      placeholder="Contoh: Bogor Barat"
                      hasError={!!err("property_location")}
                    />
                  </Field>
                </div>
              </section>

              {/* RENCANA PEMBIAYAAN */}
              <section className="space-y-5">
                <SectionTitle title="Rencana Pembiayaan" desc="Terisi otomatis jika kamu datang dari simulasi." />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field id="kpr-price" label="Harga Properti" error={err("property_price")} className="sm:col-span-2">
                    <Input
                      id="kpr-price"
                      prefixText="Rp"
                      inputMode="numeric"
                      value={fmtDigits(form.property_price)}
                      onChange={(v) => setField("property_price", digitsOnly(v))}
                      onBlur={() => touch("property_price")}
                      placeholder="750.000.000"
                      hasError={!!err("property_price")}
                    />
                  </Field>

                  <Field id="kpr-dp" label="Uang Muka (DP)" error={err("dp_percent")}>
                    <Input
                      id="kpr-dp"
                      icon={Percent}
                      suffixText="%"
                      inputMode="numeric"
                      value={form.dp_percent}
                      onChange={(v) => setField("dp_percent", digitsOnly(v).slice(0, 2))}
                      onBlur={() => touch("dp_percent")}
                      placeholder="20"
                      hasError={!!err("dp_percent")}
                    />
                  </Field>

                  <Field id="kpr-tenor" label="Tenor" error={err("tenor_years")}>
                    <Select id="kpr-tenor" icon={Clock3} value={form.tenor_years} onChange={(v) => setField("tenor_years", v)} onBlur={() => touch("tenor_years")} hasError={!!err("tenor_years")}>
                      {TENORS.map((t) => (
                        <option key={t} value={t}>
                          {t} tahun
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>

                {showEstimate && (
                  <div className="rounded-2xl bg-gradient-to-br from-red-600 via-red-500 to-red-700 p-5 text-white" aria-live="polite">
                    <p className="text-xs font-semibold text-white/80">Estimasi cicilan per bulan</p>
                    <p className="mt-1 text-2xl sm:text-3xl font-black break-words">{rupiah(estimate.monthly)}</p>
                    <p className="mt-1 text-xs text-white/70">
                      Plafon {rupiah(estimate.loan)} · bunga {rate.toLocaleString("id-ID")}% per tahun. Hanya estimasi, angka final ditentukan bank.
                    </p>
                  </div>
                )}
              </section>

              {/* DATA DIRI */}
              <section className="space-y-5">
                <SectionTitle title="Data Diri" />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field id="kpr-name" label="Nama sesuai KTP" error={err("applicant_name")} className="sm:col-span-2">
                    <Input
                      id="kpr-name"
                      icon={User}
                      value={form.applicant_name}
                      onChange={(v) => setField("applicant_name", v)}
                      onBlur={() => touch("applicant_name")}
                      placeholder="Contoh: Budi Santoso"
                      autoComplete="name"
                      hasError={!!err("applicant_name")}
                    />
                  </Field>

                  <Field id="kpr-phone" label="Nomor Telepon / WhatsApp" error={err("applicant_phone")}>
                    <Input
                      id="kpr-phone"
                      icon={Phone}
                      type="tel"
                      inputMode="tel"
                      value={form.applicant_phone}
                      onChange={(v) => setField("applicant_phone", v)}
                      onBlur={() => touch("applicant_phone")}
                      placeholder="081234567890"
                      autoComplete="tel"
                      hasError={!!err("applicant_phone")}
                    />
                  </Field>

                  <Field id="kpr-email" label="Email" optional error={err("applicant_email")}>
                    <Input
                      id="kpr-email"
                      icon={Mail}
                      type="email"
                      value={form.applicant_email}
                      onChange={(v) => setField("applicant_email", v)}
                      onBlur={() => touch("applicant_email")}
                      placeholder="nama@email.com"
                      autoComplete="email"
                      hasError={!!err("applicant_email")}
                    />
                  </Field>

                  <Field id="kpr-birth-place" label="Tempat Lahir" error={err("birth_place")}>
                    <Input id="kpr-birth-place" icon={MapPin} value={form.birth_place} onChange={(v) => setField("birth_place", v)} onBlur={() => touch("birth_place")} placeholder="Contoh: Bogor" hasError={!!err("birth_place")} />
                  </Field>

                  <Field id="kpr-birth-date" label="Tanggal Lahir" error={err("birth_date")}>
                    <Input id="kpr-birth-date" type="date" max={maxBirthDate()} value={form.birth_date} onChange={(v) => setField("birth_date", v)} onBlur={() => touch("birth_date")} hasError={!!err("birth_date")} />
                  </Field>

                  <Field id="kpr-address" label="Alamat Lengkap" error={err("applicant_address")} className="sm:col-span-2">
                    <textarea
                      id="kpr-address"
                      rows={3}
                      value={form.applicant_address}
                      onChange={(e) => setField("applicant_address", e.target.value)}
                      onBlur={() => touch("applicant_address")}
                      placeholder="Jalan, RT/RW, kelurahan, kecamatan, kota"
                      aria-invalid={!!err("applicant_address") || undefined}
                      className={`${baseInput} px-4 resize-none ${stateInput(!!err("applicant_address"))}`}
                    />
                  </Field>
                </div>
              </section>

              {/* PEKERJAAN & PENGHASILAN */}
              <section className="space-y-5">
                <SectionTitle title="Pekerjaan & Penghasilan" desc="Dipakai bank untuk menilai kemampuan cicilan." />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field id="kpr-job" label="Pekerjaan" error={err("occupation")} className="sm:col-span-2">
                    <Select id="kpr-job" icon={Briefcase} value={form.occupation} onChange={(v) => setField("occupation", v)} onBlur={() => touch("occupation")} hasError={!!err("occupation")}>
                      <option value="">Pilih pekerjaan</option>
                      {OCCUPATIONS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </Select>
                  </Field>

                  <Field id="kpr-income" label="Penghasilan Bersih / Bulan" error={err("monthly_income")}>
                    <Input
                      id="kpr-income"
                      icon={Wallet}
                      inputMode="numeric"
                      value={fmtDigits(form.monthly_income)}
                      onChange={(v) => setField("monthly_income", digitsOnly(v))}
                      onBlur={() => touch("monthly_income")}
                      placeholder="15.000.000"
                      hasError={!!err("monthly_income")}
                    />
                  </Field>

                  <Field id="kpr-obligation" label="Total Cicilan Lain / Bulan" optional hint="Isi jika ada cicilan lain (kendaraan, kartu kredit, dll).">
                    <Input id="kpr-obligation" icon={Wallet} inputMode="numeric" value={fmtDigits(form.monthly_obligation)} onChange={(v) => setField("monthly_obligation", digitsOnly(v))} placeholder="0" />
                  </Field>
                </div>
              </section>

              <p className="text-center text-xs sm:text-sm text-gray-500 leading-relaxed">Dengan mengirim formulir, kamu menyetujui data diteruskan ke bank mitra dan dihubungi oleh bank untuk proses pengajuan KPR.</p>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-red-200 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300">
                Ajukan KPR
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

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
          </div>
        </div>
      </section>

      {/* POPUP BERHASIL */}
      {openSuccess && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div role="dialog" aria-modal="true" aria-labelledby="kpr-success-title" className="w-full max-w-md rounded-2xl sm:rounded-[2rem] bg-white p-6 shadow-2xl text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CircleCheck className="h-8 w-8 text-green-600" />
            </span>
            <h3 id="kpr-success-title" className="mt-4 text-lg font-black text-gray-900">
              Pengajuan Berhasil Dikirim
            </h3>
            <p className="mt-1 text-sm text-gray-600 leading-relaxed">Terima kasih! Data kamu sudah kami terima. Tim kami atau pihak bank akan menghubungi lewat telepon atau WhatsApp dalam 1x24 jam kerja.</p>

            <button
              type="button"
              onClick={handleCloseSuccess}
              className="mt-5 w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500">
              Selesai
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KprForm;
