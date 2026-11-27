// pages/Kpr.tsx

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertTriangle, ArrowRight, BadgeCheck, Calculator, CircleCheck, ClipboardList, Clock3, FileText, Home, Info, Landmark, ShieldCheck } from "lucide-react";

import Navbars from "../../Components/Navbar/index";
import KprSimulator from "./KprSimulator"; // sesuaikan path
import { kprBanks } from "./kprBanks"; // sesuaikan path

const FORM_PATH = "/kpr/form";

const infoCards = [
  { title: "Bank Rekanan", value: "5 Bank Nasional", icon: Landmark },
  { title: "Jenis Layanan", value: "KPR Rumah", icon: Home },
  { title: "Simulasi", value: "Gratis & Instan", icon: Calculator },
  { title: "Proses", value: "Cepat & Transparan", icon: Clock3 },
];

const keunggulan = [
  { value: "Satu Pengajuan", desc: "Isi satu formulir, data diteruskan ke bank mitra yang kamu pilih.", icon: ClipboardList },
  { value: "Bank Nasional", desc: "Bekerja sama dengan BTN, Mandiri, BCA, BRI, dan BNI.", icon: Landmark },
  { value: "Simulasi Gratis", desc: "Hitung estimasi cicilan dan penghasilan minimal sebelum mengajukan.", icon: Calculator },
  { value: "Proses Transparan", desc: "Persetujuan, bunga, dan biaya dijelaskan langsung oleh bank.", icon: ShieldCheck },
];

const langkah = [
  { title: "Hitung Simulasi", desc: "Masukkan harga, DP, tenor, dan bunga untuk melihat estimasi cicilan." },
  { title: "Isi Formulir", desc: "Klik Ajukan KPR, lalu lengkapi data diri dan data properti yang diinginkan." },
  { title: "Data Diteruskan ke Bank", desc: "Pengajuan kamu diteruskan ke bank mitra untuk ditindaklanjuti." },
  { title: "Verifikasi & Keputusan Bank", desc: "Bank menghubungi kamu, memverifikasi data, menilai kelayakan, lalu memutuskan persetujuan." },
];

const syarat = [
  "Warga Negara Indonesia dan memenuhi batas usia sesuai ketentuan bank.",
  "Memiliki penghasilan tetap atau usaha yang dapat diverifikasi.",
  "Memiliki riwayat kredit yang baik.",
  "Properti yang dibeli memenuhi ketentuan bank, termasuk legalitas dan lokasinya.",
];

const dokumen = [
  "KTP dan Kartu Keluarga.",
  "NPWP.",
  "Slip gaji atau bukti penghasilan (karyawan), atau dokumen usaha (wiraswasta).",
  "Rekening koran atau mutasi rekening beberapa bulan terakhir.",
  "Dokumen properti seperti sertifikat dan PBB, sesuai arahan bank.",
];

const penting = [
  "Pindar.id adalah platform yang membantu menghubungkan kamu dengan bank. Pindar.id bukan bank dan bukan pemberi KPR.",
  "Persetujuan KPR sepenuhnya menjadi kewenangan bank. Pindar.id tidak menjamin pengajuan disetujui.",
  "Suku bunga, DP minimum, tenor, dan biaya ditentukan oleh bank dan dapat berubah sewaktu-waktu.",
  "Biaya yang umumnya ada antara lain provisi, administrasi, appraisal, asuransi jiwa dan kebakaran, BPHTB, serta biaya notaris.",
  "Baca dan pahami perjanjian kredit dari bank sebelum menyetujuinya.",
];

const CheckList = ({ items }: { items: string[] }) => (
  <div className="space-y-3">
    {items.map((item) => (
      <div key={item} className="flex items-start gap-3">
        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
          <CircleCheck className="w-4 h-4 text-green-600" />
        </div>
        <p className="text-gray-700 leading-relaxed text-sm md:text-base">{item}</p>
      </div>
    ))}
  </div>
);

const Kpr = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedId = searchParams.get("bank");
  const selected = kprBanks.find((b) => b.id === selectedId);

  // otomatis scroll ke paling atas saat halaman dibuka
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const goToForm = () => navigate(selected ? `${FORM_PATH}?bank=${selected.id}` : FORM_PATH);

  const scrollToSimulasi = () => document.getElementById("simulasi")?.scrollIntoView({ behavior: "smooth", block: "start" });

  const pickBank = (id: string) => {
    if (selectedId === id) setSearchParams({}, { replace: true });
    else setSearchParams({ bank: id }, { replace: true });
  };

  const hideBrokenImage = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.visibility = "hidden";
  };

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
              <div className="inline-flex items-center gap-2 bg-white/20 border border-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs sm:text-sm font-semibold mb-5 mt-10">
                <BadgeCheck className="w-4 h-4" />
                KPR Rumah Bank Terverifikasi
              </div>

              <h1 className="text-3xl md:text-3xl lg:text-5xl font-black text-white leading-tight">Wujudkan Rumah Impian Kamu !!</h1>

              <p className="mt-4 text-white/90 text-sm sm:text-base leading-relaxed max-w-xl">
                Ajukan KPR Rumah lewat Pindar dan terhubung dengan bank rekanan kami: BTN, Mandiri, BCA, BRI, dan BNI. Hitung dulu estimasi cicilan kamu dengan simulasi gratis, lalu ajukan dalam beberapa menit. Persetujuan dan ketentuan
                akhir ditentukan oleh bank.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-7">
                <button
                  onClick={goToForm}
                  className="px-5 sm:px-7 py-3 rounded-xl sm:rounded-2xl bg-white text-red-600 text-sm sm:text-base font-bold flex items-center justify-center gap-2 shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300">
                  Ajukan KPR
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={scrollToSimulasi}
                  className="px-5 sm:px-7 py-3 rounded-xl sm:rounded-2xl bg-white/10 border border-white/40 text-white text-sm sm:text-base font-bold flex items-center justify-center gap-2 hover:bg-white/20 active:scale-[0.98] transition-all duration-300">
                  <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
                  Hitung Simulasi
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex justify-center lg:justify-end">
              <div className="bg-white rounded-2xl sm:rounded-[2rem] shadow-2xl p-5 sm:p-8 w-full max-w-sm">
                {selected ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-6">
                    <div className="w-32 h-32 rounded-3xl bg-red-50 flex items-center justify-center p-4">
                      <img src={selected.logo} alt={selected.name} className="w-full h-full object-contain" onError={hideBrokenImage} />
                    </div>
                    <p className="font-black text-gray-800 text-center">{selected.name}</p>
                  </div>
                ) : (
                  <div className="py-2">
                    <p className="text-center text-xs sm:text-sm font-bold text-gray-500 uppercase">Bank Rekanan KPR</p>
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                      {kprBanks.map((b) => (
                        <div key={b.id} className="w-[5.5rem] h-16 rounded-2xl bg-red-50 flex items-center justify-center p-3">
                          <img src={b.logo} alt={b.name} className="w-full h-full object-contain" onError={hideBrokenImage} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-2 text-center">
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs sm:text-sm font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    Bank Berizin & Diawasi OJK
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
      <section className="px-4 lg:px-8 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl sm:rounded-[2rem] border border-gray-100 shadow-xl p-4 sm:p-6 lg:p-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-red-50 flex items-center justify-center">
              <Info className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
            </div>
            <div>
              <p className="text-red-500 font-bold uppercase text-xs sm:text-sm">Informasi</p>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-800">Tentang KPR Pindar</h2>
            </div>
          </div>

          <p className="text-sm md:text-base text-gray-700 leading-relaxed max-w-3xl">
            KPR (Kredit Pemilikan Rumah) adalah fasilitas pembiayaan dari bank untuk membantu kamu membeli rumah dengan cicilan bulanan. Melalui Pindar, kamu bisa mengajukan KPR Rumah ke bank rekanan kami dalam satu alur yang sederhana,
            mulai dari simulasi cicilan hingga pengajuan. Pindar berperan sebagai platform penghubung, sedangkan penilaian dan keputusan persetujuan dilakukan oleh bank.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {keunggulan.map((l) => {
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

      {/* BANK REKANAN */}
      <section className="px-4 lg:px-8 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl sm:rounded-[2rem] border border-gray-100 shadow-xl p-4 sm:p-6 lg:p-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-red-50 flex items-center justify-center">
              <Landmark className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
            </div>
            <div>
              <p className="text-red-500 font-bold uppercase text-xs sm:text-sm">Mitra</p>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-800">Bank Rekanan KPR</h2>
            </div>
          </div>

          <p className="text-sm md:text-base text-gray-700 leading-relaxed max-w-3xl">
            Pilih bank yang kamu inginkan agar tercantum di pengajuan. Memilih bank bersifat opsional dan belum menjamin disetujui, karena keputusan tetap ada di bank.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mt-6">
            {kprBanks.map((b) => {
              const active = selectedId === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => pickBank(b.id)}
                  className={`rounded-2xl border p-4 sm:p-5 flex flex-col items-center gap-3 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 ${
                    active ? "border-red-400 bg-red-50 ring-2 ring-red-200" : "border-gray-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5"
                  }`}>
                  <div className="w-full h-16 flex items-center justify-center">
                    <img src={b.logo} alt={b.name} className="max-h-full max-w-full object-contain" onError={hideBrokenImage} />
                  </div>
                  <span className="text-sm font-black text-gray-800">{b.name}</span>
                  <span className={`text-xs font-bold ${active ? "text-red-600" : "text-gray-400"}`}>{active ? "Dipilih" : "Pilih bank"}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* SIMULASI */}
      <section id="simulasi" className="px-4 lg:px-8 pb-8 sm:pb-12 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <KprSimulator bank={selected?.id} ctaTo={FORM_PATH} />
        </div>
      </section>

      {/* ALUR + SYARAT */}
      <section className="px-4 lg:px-8 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl sm:rounded-[2rem] border border-gray-100 shadow-xl p-4 sm:p-6 lg:p-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-red-50 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
            </div>
            <div>
              <p className="text-red-500 font-bold uppercase text-xs sm:text-sm">Panduan</p>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-800">Alur Pengajuan KPR</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {langkah.map((s, i) => (
              <div key={s.title} className="rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
                <div className="w-9 h-9 rounded-full bg-red-600 text-white text-sm font-black flex items-center justify-center">{i + 1}</div>
                <h3 className="mt-3 font-black text-gray-900">{s.title}</h3>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mt-8 pt-8 border-t border-gray-100">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                  <BadgeCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-gray-800">Syarat Umum</h3>
              </div>
              <CheckList items={syarat} />
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-gray-800">Dokumen yang Biasanya Diminta</h3>
              </div>
              <CheckList items={dokumen} />
            </div>
          </div>

          <p className="mt-6 text-xs sm:text-sm text-gray-500 leading-relaxed">Syarat dan dokumen dapat berbeda di setiap bank, dan bank dapat meminta dokumen tambahan saat verifikasi.</p>
        </div>
      </section>

      {/* PENTING DIKETAHUI */}
      <section className="px-4 lg:px-8 pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto rounded-2xl sm:rounded-[2rem] border border-amber-200 bg-amber-50 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-5">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-800">Penting Diketahui</h2>
          </div>

          <ul className="space-y-3">
            {penting.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm md:text-base text-gray-700 leading-relaxed">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                {p}
              </li>
            ))}
          </ul>

          {/* CTA bawah */}
          <div className="mt-8 pt-6 border-t border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm sm:text-base text-gray-700 text-center sm:text-left">Sudah siap? Ajukan KPR sekarang, prosesnya cuma butuh beberapa menit.</p>
            <button
              onClick={goToForm}
              className="w-full sm:w-auto shrink-0 px-6 sm:px-7 py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white text-sm sm:text-base font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-200 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300">
              Ajukan KPR
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Kpr;
