// pages/MultiFinanceForm.tsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft, ArrowRight, Bike, Building2, CalendarDays, Car, CheckCircle2, FileText, Home, Loader2, MapPin, Phone, Repeat, Tag, User, Users, X, type LucideIcon } from "lucide-react";
import FloatingWaButton from "./floatingwabutton";

import Navbars from "../../Components/Navbar/index";
import { submitApplication, type FormState, type Layanan, type StatusPembiayaan } from "./multifinanceApi";

const initialForm: FormState = {
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

const layananList = [
  { value: "Jaminkan BPKB", desc: "Dana cepat dengan jaminan BPKB, kendaraan tetap dipakai.", icon: FileText },
  { value: "Jaminkan SHM", desc: "Dana dengan jaminan sertifikat hak milik.", icon: Home },
  { value: "Beli Kendaraan (Second)", desc: "Beli mobil atau motor (Second) dengan harga terbaik.", icon: Tag },
  { value: "Take Over Kendaraan", desc: "Pindahkan cicilan kendaraan ke tenor dan bunga lebih ringan.", icon: Repeat },
] as const;

const tipePemohonOptions = [
  { value: "Individu", label: "Individu", icon: User },
  { value: "Perusahaan", label: "Perusahaan", icon: Building2 },
] as const;

const jenisOptions = [
  { value: "Mobil", label: "Mobil", icon: Car },
  { value: "Motor", label: "Motor", icon: Bike },
] as const;

const kepemilikanOptions = [
  { value: "Sendiri", label: "Atas nama sendiri", icon: User },
  { value: "Orang Lain", label: "Atas nama orang lain", icon: Users },
] as const;

const transmisiOptions = [
  { value: "Matic", label: "Matic" },
  { value: "Manual", label: "Manual" },
] as const;

const statusPembiayaanOptions = [
  { value: "BPKB On Hand", label: "BPKB On Hand" },
  { value: "Take Over", label: "Take Over" },
] as const;

interface ChoiceProps<T extends string> {
  options: readonly { value: T; label: string; icon?: LucideIcon }[];
  value: string;
  onChange: (value: T) => void;
  columns?: string;
}

function Choice<T extends string>({ options, value, onChange, columns = "grid-cols-2" }: ChoiceProps<T>) {
  return (
    <div className={`grid ${columns} gap-3`}>
      {options.map(({ value: v, label, icon: Icon }) => {
        const active = value === v;
        return (
          <button
            type="button"
            key={v}
            onClick={() => onChange(v)}
            aria-pressed={active}
            className={`flex items-center justify-center gap-2 rounded-2xl border py-3.5 px-2 font-bold text-sm sm:text-base transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-100 ${
              active ? "border-red-500 bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg" : "border-gray-200 bg-white text-gray-700 hover:border-red-300"
            }`}>
            {Icon && <Icon className="w-5 h-5 shrink-0" />}
            {label}
          </button>
        );
      })}
    </div>
  );
}

const MultiFinanceForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(initialForm);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [openConfirm, setOpenConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const currentYear = new Date().getFullYear();
  const years = useMemo(() => Array.from({ length: currentYear - 1994 }, (_, i) => String(currentYear - i)), [currentYear]);

  const isShm = form.layanan === "Jaminkan SHM";
  const isVehicle = form.layanan !== "" && !isShm;
  const isTakeOver = isVehicle && form.status_pembiayaan === "Take Over";

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((prev) => ({ ...prev, [key]: value }));
  const touch = (key: keyof FormState) => setTouched((t) => ({ ...t, [key]: true }));

  // Pilih layanan. Pindah antara SHM <-> kendaraan: kosongkan isian milik sisi lain.
  const handleLayanan = (v: Layanan) => {
    setForm((prev) => {
      const wasShm = prev.layanan === "Jaminkan SHM";
      const nowShm = v === "Jaminkan SHM";

      if (nowShm && !wasShm) {
        return { ...prev, layanan: v, kepemilikan: "", jenis: "", merek: "", tipe: "", tahun: "", transmisi: "", status_pembiayaan: "", leasing_asal: "" };
      }
      if (!nowShm && wasShm) {
        return { ...prev, layanan: v, kepemilikan: "", jenis_surat: "" };
      }
      return { ...prev, layanan: v };
    });
    touch("layanan");
  };

  const handleStatusPembiayaan = (v: StatusPembiayaan) => {
    setForm((prev) => ({ ...prev, status_pembiayaan: v, leasing_asal: v === "Take Over" ? prev.leasing_asal : "" }));
    touch("status_pembiayaan");
  };

  const errors = useMemo(() => {
    const e: Partial<Record<keyof FormState, string>> = {};
    const usia = Number(form.usia);

    if (!form.tipe_pemohon) e.tipe_pemohon = "Pilih individu atau perusahaan.";
    if (form.nama.trim().length < 3) e.nama = "Isi nama lengkap sesuai KTP (minimal 3 huruf).";
    if (!/^(\+62|62|0)8[1-9][0-9]{7,10}$/.test(form.telepon.replace(/[\s-]/g, ""))) e.telepon = "Gunakan nomor aktif, contoh: 081234567890";
    if (!form.usia || !Number.isInteger(usia) || usia < 17 || usia > 80) e.usia = "Isi usia yang valid (17 - 80 tahun).";
    if (form.alamat.trim().length < 10) e.alamat = "Isi alamat lengkap (minimal 10 karakter).";
    if (!form.layanan) e.layanan = "Pilih layanan yang kamu butuhkan.";

    if (isShm) {
      if (!form.kepemilikan) e.kepemilikan = "Pilih SHM atas nama sendiri atau orang lain.";
      if (form.jenis_surat.trim().length < 3) e.jenis_surat = "Isi jenis surat, contoh: Tanah, Rumah, Bangunan.";
    }

    if (isVehicle) {
      if (!form.jenis) {
        e.jenis = "Pilih mobil atau motor.";
      } else {
        if (!form.kepemilikan) e.kepemilikan = "Pilih BPKB atas nama sendiri atau orang lain.";
        if (form.merek.trim().length < 2) e.merek = "Isi merek kendaraan.";
        if (form.tipe.trim().length < 1) e.tipe = "Isi tipe kendaraan.";
        if (!form.tahun) e.tahun = "Pilih tahun kendaraan.";
        if (!form.transmisi) e.transmisi = "Pilih matic atau manual.";
        if (!form.status_pembiayaan) e.status_pembiayaan = "Pilih BPKB on hand atau take over.";
        if (isTakeOver && form.leasing_asal.trim().length < 2) e.leasing_asal = "Isi nama leasing asal take over.";
      }
    }

    return e;
  }, [form, isShm, isVehicle, isTakeOver]);

  const isValid = Object.keys(errors).length === 0;

  useEffect(() => {
    document.body.style.overflow = openConfirm || openSuccess ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openConfirm, openSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = (Object.keys(initialForm) as (keyof FormState)[]).reduce<Record<string, boolean>>((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(allTouched);
    if (!isValid) return;
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
      const result = await submitApplication(form);
      setRefNumber(result.applicationNumber);
      setOpenConfirm(false);
      setOpenSuccess(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Pengajuan gagal dikirim. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setOpenSuccess(false);
    setForm(initialForm);
    setTouched({});
    navigate("/multi-finance");
  };

  const inputBase = (field: keyof FormState, withIcon = true) =>
    `w-full rounded-2xl border bg-gray-50 ${withIcon ? "pl-12" : "pl-4"} pr-4 py-3.5 text-sm sm:text-base text-gray-800 placeholder-gray-400 outline-none transition focus:bg-white focus:ring-4 ${
      touched[field] && errors[field] ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-red-400 focus:ring-red-100"
    }`;

  const Err = ({ field }: { field: keyof FormState }) => (touched[field] && errors[field] ? <p className="mt-1.5 text-xs sm:text-sm text-red-500 font-semibold">{errors[field]}</p> : null);

  const kepemilikanLabel = isShm ? "SHM atas nama" : "BPKB atas nama";

  const summary = [
    { label: "Pemohon", value: form.tipe_pemohon },
    { label: form.tipe_pemohon === "Perusahaan" ? "Nama Penanggung Jawab" : "Nama sesuai KTP", value: form.nama },
    { label: "Nomor Telepon", value: form.telepon },
    { label: "Usia", value: form.usia ? `${form.usia} tahun` : "" },
    { label: "Alamat", value: form.alamat },
    { label: "Layanan", value: form.layanan },
    ...(isShm
      ? [
          { label: kepemilikanLabel, value: form.kepemilikan },
          { label: "Jenis Surat", value: form.jenis_surat },
        ]
      : []),
    ...(isVehicle
      ? [
          { label: "Jenis Kendaraan", value: form.jenis },
          { label: kepemilikanLabel, value: form.kepemilikan },
          { label: "Merek", value: form.merek },
          { label: "Tipe", value: form.tipe },
          { label: "Tahun", value: form.tahun },
          { label: "Transmisi", value: form.transmisi },
          { label: "Status BPKB", value: form.status_pembiayaan },
          ...(isTakeOver ? [{ label: "Leasing Asal", value: form.leasing_asal }] : []),
        ]
      : []),
  ];

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
              <p className="mt-1 text-sm text-white/90">Lengkapi data di bawah ini. Gunakan data yang sama dengan KTP.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="p-5 sm:p-8 space-y-5">
              {/* Tipe pemohon */}
              <div>
                <p className="mb-2 text-sm font-bold text-gray-800">Pengajuan atas nama</p>
                <Choice
                  options={tipePemohonOptions}
                  value={form.tipe_pemohon}
                  onChange={(v) => {
                    setField("tipe_pemohon", v);
                    touch("tipe_pemohon");
                  }}
                />
                <Err field="tipe_pemohon" />
              </div>

              {/* Nama */}
              <div>
                <label htmlFor="nama" className="block mb-2 text-sm font-bold text-gray-800">
                  {form.tipe_pemohon === "Perusahaan" ? "Nama Penanggung Jawab (sesuai KTP)" : "Nama sesuai KTP"}
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />
                  <input id="nama" value={form.nama} onChange={(e) => setField("nama", e.target.value)} onBlur={() => touch("nama")} placeholder="Contoh: Budi Santoso" className={inputBase("nama")} />
                </div>
                <Err field="nama" />
              </div>

              {/* Telepon & usia */}
              <div className="grid sm:grid-cols-3 gap-5">
                <div className="sm:col-span-2">
                  <label htmlFor="telepon" className="block mb-2 text-sm font-bold text-gray-800">
                    Nomor Telepon
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />
                    <input id="telepon" type="tel" inputMode="tel" value={form.telepon} onChange={(e) => setField("telepon", e.target.value)} onBlur={() => touch("telepon")} placeholder="081234567890" className={inputBase("telepon")} />
                  </div>
                  <Err field="telepon" />
                </div>

                <div>
                  <label htmlFor="usia" className="block mb-2 text-sm font-bold text-gray-800">
                    Usia
                  </label>
                  <div className="relative">
                    <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />
                    <input id="usia" type="number" inputMode="numeric" min={17} max={80} value={form.usia} onChange={(e) => setField("usia", e.target.value)} onBlur={() => touch("usia")} placeholder="30" className={inputBase("usia")} />
                  </div>
                  <Err field="usia" />
                </div>
              </div>

              {/* Alamat */}
              <div>
                <label htmlFor="alamat" className="block mb-2 text-sm font-bold text-gray-800">
                  Alamat Pribadi
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-5 h-5 text-red-400" />
                  <textarea
                    id="alamat"
                    rows={3}
                    value={form.alamat}
                    onChange={(e) => setField("alamat", e.target.value)}
                    onBlur={() => touch("alamat")}
                    placeholder="Jalan, RT/RW, kelurahan, kecamatan, kota"
                    className={`${inputBase("alamat")} resize-none`}
                  />
                </div>
                <Err field="alamat" />
              </div>

              {/* Layanan */}
              <div>
                <p className="mb-2 text-sm font-bold text-gray-800">Layanan yang dibutuhkan</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {layananList.map((l) => {
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
                      </button>
                    );
                  })}
                </div>
                <Err field="layanan" />
              </div>

              {/* SHM: hanya atas nama + jenis surat */}
              {isShm && (
                <div className="space-y-5 rounded-2xl bg-red-50/50 border border-red-100 p-4 sm:p-5 animate-[fadeIn_.35s_ease]">
                  <div>
                    <p className="mb-2 text-sm font-bold text-gray-800">SHM atas nama</p>
                    <Choice
                      options={kepemilikanOptions}
                      value={form.kepemilikan}
                      onChange={(v) => {
                        setField("kepemilikan", v);
                        touch("kepemilikan");
                      }}
                    />
                    <Err field="kepemilikan" />
                  </div>

                  <div>
                    <label htmlFor="jenis_surat" className="block mb-2 text-sm font-bold text-gray-800">
                      Jenis Surat SHM
                    </label>
                    <input
                      id="jenis_surat"
                      value={form.jenis_surat}
                      onChange={(e) => setField("jenis_surat", e.target.value)}
                      onBlur={() => touch("jenis_surat")}
                      placeholder="Contoh: Tanah, Rumah, Bangunan"
                      className={inputBase("jenis_surat", false)}
                    />
                    <Err field="jenis_surat" />
                  </div>
                </div>
              )}

              {/* Kendaraan: layanan selain SHM */}
              {isVehicle && (
                <div className="space-y-5 rounded-2xl bg-red-50/50 border border-red-100 p-4 sm:p-5 animate-[fadeIn_.35s_ease]">
                  <div>
                    <p className="mb-2 text-sm font-bold text-gray-800">Jenis kendaraan</p>
                    <Choice
                      options={jenisOptions}
                      value={form.jenis}
                      onChange={(v) => {
                        setField("jenis", v);
                        touch("jenis");
                      }}
                    />
                    <Err field="jenis" />
                  </div>

                  {form.jenis && (
                    <>
                      <div>
                        <p className="mb-2 text-sm font-bold text-gray-800">BPKB atas nama</p>
                        <Choice
                          options={kepemilikanOptions}
                          value={form.kepemilikan}
                          onChange={(v) => {
                            setField("kepemilikan", v);
                            touch("kepemilikan");
                          }}
                        />
                        <Err field="kepemilikan" />
                      </div>

                      <div className="grid sm:grid-cols-3 gap-5">
                        <div>
                          <label htmlFor="merek" className="block mb-2 text-sm font-bold text-gray-800">
                            Merek Kendaraan
                          </label>
                          <input
                            id="merek"
                            value={form.merek}
                            onChange={(e) => setField("merek", e.target.value)}
                            onBlur={() => touch("merek")}
                            placeholder={form.jenis === "Mobil" ? "Toyota" : "Honda"}
                            className={inputBase("merek", false)}
                          />
                          <Err field="merek" />
                        </div>
                        <div>
                          <label htmlFor="tipe" className="block mb-2 text-sm font-bold text-gray-800">
                            Tipe Kendaraan
                          </label>
                          <input
                            id="tipe"
                            value={form.tipe}
                            onChange={(e) => setField("tipe", e.target.value)}
                            onBlur={() => touch("tipe")}
                            placeholder={form.jenis === "Mobil" ? "Avanza 1.3 G" : "Vario 160"}
                            className={inputBase("tipe", false)}
                          />
                          <Err field="tipe" />
                        </div>
                        <div>
                          <label htmlFor="tahun" className="block mb-2 text-sm font-bold text-gray-800">
                            Tahun Kendaraan
                          </label>
                          <select id="tahun" value={form.tahun} onChange={(e) => setField("tahun", e.target.value)} onBlur={() => touch("tahun")} className={inputBase("tahun", false)}>
                            <option value="">Pilih tahun</option>
                            {years.map((y) => (
                              <option key={y} value={y}>
                                {y}
                              </option>
                            ))}
                          </select>
                          <Err field="tahun" />
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 text-sm font-bold text-gray-800">Transmisi</p>
                        <Choice
                          options={transmisiOptions}
                          value={form.transmisi}
                          onChange={(v) => {
                            setField("transmisi", v);
                            touch("transmisi");
                          }}
                        />
                        <Err field="transmisi" />
                      </div>

                      <div>
                        <p className="mb-2 text-sm font-bold text-gray-800">Status BPKB</p>
                        <Choice options={statusPembiayaanOptions} value={form.status_pembiayaan} onChange={handleStatusPembiayaan} />
                        <Err field="status_pembiayaan" />
                      </div>

                      {isTakeOver && (
                        <div>
                          <label htmlFor="leasing_asal" className="block mb-2 text-sm font-bold text-gray-800">
                            Take over dari leasing mana?
                          </label>
                          <input
                            id="leasing_asal"
                            value={form.leasing_asal}
                            onChange={(e) => setField("leasing_asal", e.target.value)}
                            onBlur={() => touch("leasing_asal")}
                            placeholder="Contoh: Adira, BFI, FIF"
                            className={inputBase("leasing_asal", false)}
                          />
                          <Err field="leasing_asal" />
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-red-200 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300">
                Ajukan
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </form>
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
            <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">Dokumen kamu sedang kami proses. Tim kami akan menghubungi lewat telepon atau Whats App dalam 1x24 jam kerja.</p>

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
