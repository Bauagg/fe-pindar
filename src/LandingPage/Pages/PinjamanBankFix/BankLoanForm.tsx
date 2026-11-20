// pages/BankLoanForm.tsx

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Building2, ClipboardList, Info, Landmark, MapPin, MessageCircle, Phone, User, Zap } from "lucide-react";

import Navbars from "../../Components/Navbar/index";

import BankLoanFullForm from "./BankLoanFullForm";
import BankLoanPhoneUsedModal from "./BankLoanPhoneUsedModal";
import { submitApplication, type FormState } from "./bankLoanApi";
import { BACK_PATH, ConfirmModal, FieldWrap, SectionTitle, SuccessModal, TextInput, baseInput, buildSummary, cleanPayload, emptyForm, isPhoneUsedError, maxBirthDate, stateInput, useLockBody, validateForm } from "./bankLoanShared";

type Mode = "cepat" | "lengkap";

// GANTI dengan nomor WhatsApp admin (format internasional, tanpa + dan tanpa spasi)
const WA_NUMBER = "6281234567890";

const tabs = [
  { key: "cepat", label: "Pengajuan Cepat", sub: "Isi data, tanpa upload foto", icon: Zap },
  { key: "lengkap", label: "Isi Formulir Lengkap", sub: "Upload dokumen sekalian", icon: ClipboardList },
] as const;

const BankLoanForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Nama bank dari halaman detail (?bank=...). Kalau tidak ada = kosong, user isi sendiri.
  const bankFromUrl = (searchParams.get("bank") ?? "").trim();

  const [mode, setMode] = useState<Mode>("cepat");

  const [form, setForm] = useState<FormState>({ ...emptyForm, bank_name: bankFromUrl });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [openConfirm, setOpenConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const [phoneUsedOpen, setPhoneUsedOpen] = useState(false);
  const [usedPhone, setUsedPhone] = useState("");

  useEffect(() => {
    setForm((p) => (p.bank_name ? p : { ...p, bank_name: bankFromUrl }));
  }, [bankFromUrl]);

  const setField = (key: keyof FormState, value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  const touch = (key: keyof FormState) => setTouched((t) => ({ ...t, [key]: true }));

  const errors = useMemo(() => validateForm(form, usedPhone), [form, usedPhone]);
  const isValid = Object.keys(errors).length === 0;
  const err = (k: keyof FormState) => (touched[k] ? errors[k] : undefined);

  useEffect(() => {
    window.fbq?.("track", "ViewContent", { content_name: "Form Bank Loan" });
  }, []);

  useLockBody(openConfirm || openSuccess || phoneUsedOpen);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(Object.fromEntries(Object.keys(emptyForm).map((k) => [k, true])));

    if (!isValid) {
      setTimeout(() => document.querySelector<HTMLElement>('#bl-quick-form [data-invalid="true"]')?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
      return;
    }

    window.fbq?.("track", "InitiateCheckout", { content_name: form.bank_name });
    setAgree(false);
    setSubmitError("");
    setOpenConfirm(true);
  };

  const handleConfirm = async () => {
    if (submitting) return;
    setSubmitError("");
    setSubmitting(true);

    try {
      const result = await submitApplication(cleanPayload(form));
      setRefNumber(result.applicationNumber);
      window.fbq?.("track", "Lead", { content_name: form.bank_name, content_category: "Bank Loan" }, { eventID: result.applicationNumber });
      setOpenConfirm(false);
      setOpenSuccess(true);
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

  const handleWhatsApp = () => {
    const bank = form.bank_name.trim();
    const message = `Halo Admin, saya ingin mengajukan pinjaman bank (KTA)${bank ? ` ${bank}` : ""} lewat WhatsApp. Mohon dibantu prosesnya ya. Terima kasih.`;

    window.fbq?.("track", "Contact", { content_name: "Pengajuan Bank Loan via WhatsApp" });
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  const handleClosePhoneUsed = () => {
    setPhoneUsedOpen(false);
    setTimeout(() => document.getElementById("bl-phone")?.focus(), 50);
  };

  const handleCloseSuccess = () => {
    setOpenSuccess(false);
    setForm({ ...emptyForm, bank_name: bankFromUrl });
    setTouched({});
    setUsedPhone("");
    navigate(BACK_PATH);
  };

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
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black">Formulir Pinjaman Bank (KTA)</h2>
              <p className="mt-1 text-sm text-white/90">
                {mode === "cepat" ? "Isi data diri dan pekerjaan singkat tanpa upload foto, dokumen bisa dilengkapi oleh tim kami." : "Lengkapi data diri, data pekerjaan, dan dokumen pendukung dalam satu kali pengisian."}
              </p>
            </div>

            {/* PILIH MODE */}
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

            {/* MODE 1: PENGAJUAN CEPAT */}
            <form id="bl-quick-form" onSubmit={handleSubmit} noValidate className={`p-5 sm:p-8 space-y-8 ${mode === "cepat" ? "" : "hidden"}`}>
              <div className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <p className="text-xs sm:text-sm leading-relaxed text-emerald-700">Dengan mengisi form ini, kamu masih akan dihubungi tim kami untuk mengirim dokumen seperti KTP, NPWP, dan slip gaji.</p>
              </div>

              {/* BANK */}
              <section className="space-y-5">
                <SectionTitle title="Bank Tujuan" desc="Bank yang ingin kamu ajukan." />

                <FieldWrap id="bl-bank" label="Nama Bank" error={err("bank_name")}>
                  <TextInput id="bl-bank" icon={Landmark} value={form.bank_name} onChange={(v) => setField("bank_name", v)} onBlur={() => touch("bank_name")} placeholder="Contoh: Bank BCA" hasError={!!err("bank_name")} />
                </FieldWrap>
              </section>

              {/* DATA DIRI */}
              <section className="space-y-5">
                <SectionTitle title="Data Diri" />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FieldWrap id="bl-name" label="Nama sesuai KTP" error={err("applicant_name")} className="sm:col-span-2">
                    <TextInput
                      id="bl-name"
                      icon={User}
                      value={form.applicant_name}
                      onChange={(v) => setField("applicant_name", v)}
                      onBlur={() => touch("applicant_name")}
                      placeholder="Contoh: Budi Santoso"
                      hasError={!!err("applicant_name")}
                    />
                  </FieldWrap>

                  <FieldWrap id="bl-phone" label="Nomor Telepon / WhatsApp" error={err("applicant_phone")} className="sm:col-span-2">
                    <TextInput
                      id="bl-phone"
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

                  <FieldWrap id="bl-birth-place" label="Tempat Lahir" error={err("birth_place")}>
                    <TextInput id="bl-birth-place" icon={MapPin} value={form.birth_place} onChange={(v) => setField("birth_place", v)} onBlur={() => touch("birth_place")} placeholder="Contoh: Bogor" hasError={!!err("birth_place")} />
                  </FieldWrap>

                  <FieldWrap id="bl-birth-date" label="Tanggal Lahir" error={err("birth_date")}>
                    <TextInput id="bl-birth-date" type="date" max={maxBirthDate()} value={form.birth_date} onChange={(v) => setField("birth_date", v)} onBlur={() => touch("birth_date")} hasError={!!err("birth_date")} />
                  </FieldWrap>

                  <FieldWrap id="bl-address" label="Alamat Lengkap" error={err("applicant_address")} className="sm:col-span-2">
                    <textarea
                      id="bl-address"
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

              {/* PEKERJAAN */}
              <section className="space-y-5">
                <SectionTitle title="Data Pekerjaan" desc="Tempat kamu bekerja saat ini." />

                <div className="grid grid-cols-1 gap-5">
                  <FieldWrap id="bl-company" label="Nama Perusahaan" error={err("company_name")}>
                    <TextInput
                      id="bl-company"
                      icon={Building2}
                      value={form.company_name}
                      onChange={(v) => setField("company_name", v)}
                      onBlur={() => touch("company_name")}
                      placeholder="Contoh: PT Maju Jaya"
                      hasError={!!err("company_name")}
                    />
                  </FieldWrap>

                  <FieldWrap id="bl-company-address" label="Alamat Perusahaan" error={err("company_address")}>
                    <textarea
                      id="bl-company-address"
                      rows={3}
                      value={form.company_address}
                      onChange={(e) => setField("company_address", e.target.value)}
                      onBlur={() => touch("company_address")}
                      placeholder="Jalan, gedung, kelurahan, kecamatan, kota"
                      className={`${baseInput} px-4 resize-none ${stateInput(!!err("company_address"))}`}
                    />
                  </FieldWrap>
                </div>
              </section>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-red-200 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300">
                Ajukan
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

            {/* MODE 2: FORMULIR LENGKAP (tetap ter-mount supaya isian tidak hilang saat pindah tab) */}
            <BankLoanFullForm active={mode === "lengkap"} initialBankName={bankFromUrl} onBackToSimple={() => setMode("cepat")} />
          </div>
        </div>
      </section>

      <ConfirmModal
        open={openConfirm}
        summary={buildSummary(form)}
        agree={agree}
        onAgree={setAgree}
        submitting={submitting}
        error={submitError}
        statement="Saya menyatakan bahwa data di atas benar dan sesuai dokumen asli, serta setuju dihubungi oleh pihak bank untuk proses pengajuan."
        onCancel={() => setOpenConfirm(false)}
        onConfirm={handleConfirm}
      />

      <BankLoanPhoneUsedModal open={phoneUsedOpen} onClose={handleClosePhoneUsed} phone={usedPhone} name={form.applicant_name.trim()} bankName={form.bank_name.trim()} />

      <SuccessModal open={openSuccess} refNumber={refNumber} message="Data kamu sedang kami proses. Tim kami akan menghubungi lewat telepon atau WhatsApp dalam 1x24 jam kerja." onFinish={handleCloseSuccess} />

      {/* <FloatingWaButton
        message={`Halo, saya ingin bertanya mengenai pengajuan pinjaman bank (KTA)${form.bank_name.trim() ? ` ${form.bank_name.trim()}` : ""} di Pindar.`}
        preview="Halo! Ada yang bisa kami bantu seputar pengajuan pinjaman bank kamu?"
      /> */}
    </div>
  );
};

export default BankLoanForm;
