// pages/MultiFinance.tsx

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, BadgeCheck, Bike, Car, CheckCircle2, Clock3, FileText, Info, Landmark, Loader2, Repeat, ShieldCheck, Tag, User, Mail, Phone, X, AlertTriangle, Wallet } from "lucide-react";

import Navbars from "../../Components/Navbar/index";

type Layanan = "" | "Gadai BPKB" | "Jual Kendaraan Bekas" | "Take Over Kendaraan";
type Jenis = "" | "Mobil" | "Motor";

interface FormState {
  nama: string;
  email: string;
  telepon: string;
  layanan: Layanan;
  jenis: Jenis;
  merek: string;
  tipe: string;
  tahun: string;
}

const initialForm: FormState = { nama: "", email: "", telepon: "", layanan: "", jenis: "", merek: "", tipe: "", tahun: "" };

const layananList = [
  { value: "Gadai BPKB", desc: "Dana cepat dengan jaminan BPKB, kendaraan tetap dipakai.", icon: FileText },
  { value: "Jual Kendaraan Bekas", desc: "Jual mobil atau motor bekas dengan harga terbaik.", icon: Tag },
  { value: "Take Over Kendaraan", desc: "Pindahkan cicilan kendaraan ke tenor dan bunga lebih ringan.", icon: Repeat },
] as const;

const infoCards = [
  { title: "Layanan", value: "3 Pilihan Pembiayaan", icon: Wallet },
  { title: "Jenis Kendaraan", value: "Mobil & Motor", icon: Car },
  { title: "Proses", value: "Cepat & Transparan", icon: Clock3 },
  { title: "Status", value: "Berizin OJK", icon: Landmark },
];

const MultiFinance = () => {
  const formRef = useRef<HTMLElement | null>(null);

  const [form, setForm] = useState<FormState>(initialForm);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [openConfirm, setOpenConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const currentYear = new Date().getFullYear();
  const years = useMemo(() => Array.from({ length: currentYear - 1994 }, (_, i) => String(currentYear - i)), [currentYear]);

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((prev) => ({ ...prev, [key]: value }));

  const errors = useMemo(() => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (form.nama.trim().length < 3) e.nama = "Isi nama lengkap sesuai KTP (minimal 3 huruf).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Format email belum benar, contoh: nama@email.com";
    if (!/^(\+62|62|0)8[1-9][0-9]{7,10}$/.test(form.telepon.replace(/[\s-]/g, ""))) e.telepon = "Gunakan nomor aktif, contoh: 081234567890";
    if (!form.layanan) e.layanan = "Pilih layanan yang kamu butuhkan.";
    if (form.layanan && !form.jenis) e.jenis = "Pilih mobil atau motor.";
    if (form.jenis && form.merek.trim().length < 2) e.merek = "Isi merek kendaraan.";
    if (form.jenis && form.tipe.trim().length < 1) e.tipe = "Isi tipe kendaraan.";
    if (form.jenis && !form.tahun) e.tahun = "Pilih tahun kendaraan.";
    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  // lock body scroll when a popup is open
  useEffect(() => {
    document.body.style.overflow = openConfirm || openSuccess ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openConfirm, openSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ nama: true, email: true, telepon: true, layanan: true, jenis: true, merek: true, tipe: true, tahun: true });
    if (!isValid) return;
    setAgree(false);
    setOpenConfirm(true);
  };

  const handleConfirm = () => {
    setSubmitting(true);
    // DEMO: ganti dengan request API asli
    setTimeout(() => {
      setRefNumber(`MF-${Date.now().toString().slice(-8)}`);
      setSubmitting(false);
      setOpenConfirm(false);
      setOpenSuccess(true);
    }, 1800);
  };

  const handleCloseSuccess = () => {
    setOpenSuccess(false);
    setForm(initialForm);
    setTouched({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const inputBase = (field: keyof FormState) =>
    `w-full rounded-2xl border bg-gray-50 pl-12 pr-4 py-3.5 text-sm sm:text-base text-gray-800 placeholder-gray-400 outline-none transition focus:bg-white focus:ring-4 ${
      touched[field] && errors[field] ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-red-400 focus:ring-red-100"
    }`;

  const Err = ({ field }: { field: keyof FormState }) => (touched[field] && errors[field] ? <p className="mt-1.5 text-xs sm:text-sm text-red-500 font-semibold">{errors[field]}</p> : null);

  const summary = [
    { label: "Nama sesuai KTP", value: form.nama },
    { label: "Email", value: form.email },
    { label: "Nomor Telepon", value: form.telepon },
    { label: "Layanan", value: form.layanan },
    { label: "Jenis Kendaraan", value: form.jenis },
    { label: "Merek", value: form.merek },
    { label: "Tipe", value: form.tipe },
    { label: "Tahun", value: form.tahun },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-white font-signika">
      <Navbars />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-700"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-8 sm:py-10 lg:py-20">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-10 items-center mt-10 sm:mt-12">
            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 border border-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs sm:text-sm font-semibold mb-5 mt-5">
                <BadgeCheck className="w-4 h-4" />
                Multi Finance Terverifikasi
              </div>

              <h1 className="text-3xl md:text-3xl lg:text-5xl font-black text-white leading-tight">Pembiayaan Kendaraan Lebih Mudah</h1>

              <p className="mt-4 text-white/90 text-sm sm:text-base leading-relaxed max-w-xl">Gadai BPKB, jual kendaraan bekas, atau take over cicilan. Isi formulir singkat, tim kami akan menghubungi kamu untuk proses selanjutnya.</p>

              <div className="flex flex-col sm:flex-row gap-3 mt-7">
                <button
                  onClick={scrollToForm}
                  className="px-5 sm:px-7 py-3 rounded-xl sm:rounded-2xl bg-white text-red-600 text-sm sm:text-base font-bold flex items-center justify-center gap-2 shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300">
                  Ajukan
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex justify-center lg:justify-end">
              <div className="bg-white rounded-2xl sm:rounded-[2rem] shadow-2xl p-5 sm:p-8 w-full max-w-sm">
                <div className="flex items-center justify-center gap-4 py-6">
                  <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center">
                    <Car className="w-10 h-10 text-red-500" />
                  </div>
                  <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center">
                    <Bike className="w-10 h-10 text-red-500" />
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs sm:text-sm font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    Legal & Terverifikasi
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INFO CARD */}
      <section className="relative -mt-6 sm:-mt-8 lg:-mt-12 px-4 lg:px-8 pb-8 sm:pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {infoCards.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="bg-white rounded-2xl sm:rounded-[2rem] border border-gray-100 shadow-lg p-4 sm:p-6">
                  <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                  </div>
                  <p className="mt-3 text-xs sm:text-sm text-gray-500 font-semibold">{item.title}</p>
                  <h3 className="mt-1 text-sm sm:text-xl font-black text-gray-800 leading-snug break-words">{item.value}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DESKRIPSI */}
      <section className="px-4 lg:px-8 pb-10 sm:pb-16">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl sm:rounded-[2rem] border border-gray-100 shadow-xl p-4 sm:p-6 lg:p-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-red-50 flex items-center justify-center">
              <Info className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
            </div>
            <div>
              <p className="text-red-500 font-bold uppercase text-xs sm:text-sm">Informasi</p>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-800">Tentang Multi Finance</h2>
            </div>
          </div>

          <p className="text-sm md:text-base text-gray-700 leading-relaxed max-w-3xl">
            Multi finance adalah lembaga pembiayaan yang membantu kamu mendapatkan dana atau mengatur ulang cicilan dengan jaminan kendaraan. Prosesnya diawasi OJK, biayanya dijelaskan di awal, dan kamu bisa memilih layanan sesuai
            kebutuhan.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {layananList.map((l) => {
              const Icon = l.icon;
              return (
                <div key={l.value} className="rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex gap-4 items-start">
                  <div className="min-w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900">{l.value}</h3>
                    <p className="mt-1 text-sm text-gray-600 leading-relaxed">{l.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FORM */}
      <section id="form-pengajuan" ref={formRef} className="px-4 lg:px-8 pb-16 sm:pb-24 scroll-mt-20">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl sm:rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-700 px-5 sm:px-8 py-6 text-white">
            <p className="font-bold uppercase text-xs sm:text-sm text-white/80">Pengajuan</p>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black">Formulir Pengajuan</h2>
            <p className="mt-1 text-sm text-white/90">Lengkapi data di bawah ini. Gunakan data yang sama dengan KTP.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="p-5 sm:p-8 space-y-5">
            {/* Nama */}
            <div>
              <label htmlFor="nama" className="block mb-2 text-sm font-bold text-gray-800">
                Nama sesuai KTP
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />
                <input id="nama" value={form.nama} onChange={(e) => setField("nama", e.target.value)} onBlur={() => setTouched((t) => ({ ...t, nama: true }))} placeholder="Contoh: Budi Santoso" className={inputBase("nama")} />
              </div>
              <Err field="nama" />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-bold text-gray-800">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />
                  <input id="email" type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} onBlur={() => setTouched((t) => ({ ...t, email: true }))} placeholder="nama@email.com" className={inputBase("email")} />
                </div>
                <Err field="email" />
              </div>

              {/* Telepon */}
              <div>
                <label htmlFor="telepon" className="block mb-2 text-sm font-bold text-gray-800">
                  Nomor Telepon
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />
                  <input
                    id="telepon"
                    type="tel"
                    inputMode="tel"
                    value={form.telepon}
                    onChange={(e) => setField("telepon", e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, telepon: true }))}
                    placeholder="081234567890"
                    className={inputBase("telepon")}
                  />
                </div>
                <Err field="telepon" />
              </div>
            </div>

            {/* Layanan */}
            <div>
              <p className="mb-2 text-sm font-bold text-gray-800">Layanan yang dibutuhkan</p>
              <div className="grid sm:grid-cols-3 gap-3">
                {layananList.map((l) => {
                  const Icon = l.icon;
                  const active = form.layanan === l.value;
                  return (
                    <button
                      type="button"
                      key={l.value}
                      onClick={() => {
                        setField("layanan", l.value);
                        setTouched((t) => ({ ...t, layanan: true }));
                      }}
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

            {/* Muncul setelah pilih layanan */}
            {form.layanan && (
              <div className="space-y-5 rounded-2xl bg-red-50/50 border border-red-100 p-4 sm:p-5 animate-[fadeIn_.35s_ease]">
                <div>
                  <p className="mb-2 text-sm font-bold text-gray-800">Jenis kendaraan</p>
                  <div className="grid grid-cols-2 gap-3">
                    {(
                      [
                        { v: "Mobil", icon: Car },
                        { v: "Motor", icon: Bike },
                      ] as const
                    ).map(({ v, icon: Icon }) => {
                      const active = form.jenis === v;
                      return (
                        <button
                          type="button"
                          key={v}
                          onClick={() => {
                            setField("jenis", v);
                            setTouched((t) => ({ ...t, jenis: true }));
                          }}
                          aria-pressed={active}
                          className={`flex items-center justify-center gap-2 rounded-2xl border py-3.5 font-bold text-sm sm:text-base transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-100 ${
                            active ? "border-red-500 bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg" : "border-gray-200 bg-white text-gray-700 hover:border-red-300"
                          }`}>
                          <Icon className="w-5 h-5" />
                          {v}
                        </button>
                      );
                    })}
                  </div>
                  <Err field="jenis" />
                </div>

                {form.jenis && (
                  <div className="grid sm:grid-cols-3 gap-5">
                    <div>
                      <label htmlFor="merek" className="block mb-2 text-sm font-bold text-gray-800">
                        Merek Kendaraan
                      </label>
                      <input
                        id="merek"
                        value={form.merek}
                        onChange={(e) => setField("merek", e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, merek: true }))}
                        placeholder={form.jenis === "Mobil" ? "Toyota" : "Honda"}
                        className={inputBase("merek").replace("pl-12", "pl-4")}
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
                        onBlur={() => setTouched((t) => ({ ...t, tipe: true }))}
                        placeholder={form.jenis === "Mobil" ? "Avanza 1.3 G" : "Vario 160"}
                        className={inputBase("tipe").replace("pl-12", "pl-4")}
                      />
                      <Err field="tipe" />
                    </div>
                    <div>
                      <label htmlFor="tahun" className="block mb-2 text-sm font-bold text-gray-800">
                        Tahun Kendaraan
                      </label>
                      <select id="tahun" value={form.tahun} onChange={(e) => setField("tahun", e.target.value)} onBlur={() => setTouched((t) => ({ ...t, tahun: true }))} className={inputBase("tahun").replace("pl-12", "pl-4")}>
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
                    <dd className="text-gray-900 font-bold text-right break-all">{s.value}</dd>
                  </div>
                ))}
              </dl>

              <label className="mt-5 flex items-start gap-3 rounded-2xl bg-red-50 border border-red-100 p-4 cursor-pointer">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 w-5 h-5 accent-red-600" />
                <span className="text-sm text-gray-700 leading-relaxed">Saya menyatakan bahwa data di atas benar dan sesuai dokumen asli, serta setuju dihubungi oleh pihak multi finance untuk proses pengajuan.</span>
              </label>

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
            <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">Dokumen kamu sedang kami proses. Tim kami akan menghubungi lewat telepon atau email dalam 1x24 jam kerja.</p>

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
    </div>
  );
};

export default MultiFinance;
