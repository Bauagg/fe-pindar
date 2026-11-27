// Components/KPR/KprSimulator.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Calculator, Info } from "lucide-react";

/* ================================================================== */
/* Hitungan (bisa dipakai tanpa UI)                                    */
/* ================================================================== */

export interface KprInput {
  price: number; // harga properti (Rp)
  dpPercent: number; // uang muka (%)
  tenorYears: number; // tenor (tahun)
  ratePercent: number; // bunga per tahun (%)
}

export interface KprResult {
  dp: number;
  loan: number;
  months: number;
  monthly: number;
  totalInterest: number;
  totalPayment: number;
  minIncome: number;
}

/** Rasio cicilan terhadap penghasilan yang dipakai untuk estimasi penghasilan minimal. */
const INSTALLMENT_RATIO = 0.35;

/** Metode anuitas: cicilan tetap setiap bulan. */
export const calculateKpr = ({ price, dpPercent, tenorYears, ratePercent }: KprInput): KprResult => {
  const dp = Math.round((price * dpPercent) / 100);
  const loan = Math.max(price - dp, 0);
  const months = tenorYears * 12;
  const r = ratePercent / 100 / 12;

  const monthly = loan === 0 || months === 0 ? 0 : r === 0 ? loan / months : (loan * r) / (1 - Math.pow(1 + r, -months));
  const totalPayment = monthly * months;

  return {
    dp,
    loan,
    months,
    monthly,
    totalInterest: Math.max(totalPayment - loan, 0),
    totalPayment,
    minIncome: monthly / INSTALLMENT_RATIO,
  };
};

/* ================================================================== */
/* Util                                                                */
/* ================================================================== */

const rupiah = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Math.round(n));
const nf = new Intl.NumberFormat("id-ID");

const PRICE_MIN = 100_000_000;
const PRICE_MAX = 5_000_000_000;
const PRICE_STEP = 10_000_000;
const TENOR_OPTIONS = [5, 10, 15, 20, 25, 30];

function RangeField({
  id,
  label,
  valueLabel,
  min,
  max,
  step,
  value,
  onChange,
  minLabel,
  maxLabel,
}: {
  id: string;
  label: string;
  valueLabel: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  minLabel: string;
  maxLabel: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-xs sm:text-sm font-bold text-gray-600">
          {label}
        </label>
        <span className="text-sm font-black text-red-600">{valueLabel}</span>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-3 w-full accent-red-600 cursor-pointer" />
      <div className="mt-1 flex justify-between text-[11px] text-gray-400 font-semibold">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 text-sm">
      <span className="text-white/80">{label}</span>
      <span className={`text-right ${strong ? "font-black" : "font-bold"}`}>{value}</span>
    </div>
  );
}

/* ================================================================== */
/* Komponen                                                            */
/* ================================================================== */

export interface KprSimulatorProps {
  className?: string;
  /** Judul di atas kalkulator. */
  title?: string;
  /** Tampilkan tombol ajukan (default true). */
  showCta?: boolean;
  ctaLabel?: string;
  /** Tujuan tombol ajukan. Hasil simulasi ikut dikirim sebagai query string. */
  ctaTo?: string;
  /** Id bank terpilih (mis. "bca"), ikut dikirim ke form. Opsional. */
  bank?: string;
  /** Kalau diisi, dipanggil saat tombol ajukan diklik dan navigasi otomatis dilewati. */
  onApply?: (input: KprInput, result: KprResult) => void;
  defaultPrice?: number;
  defaultDpPercent?: number;
  defaultTenorYears?: number;
  defaultRatePercent?: number;
}

export default function KprSimulator({
  className = "",
  title = "Simulasi KPR",
  showCta = true,
  ctaLabel = "Ajukan KPR",
  ctaTo = "/kpr/form",
  bank,
  onApply,
  defaultPrice = 750_000_000,
  defaultDpPercent = 20,
  defaultTenorYears = 20,
  defaultRatePercent = 7.5,
}: KprSimulatorProps) {
  const navigate = useNavigate();

  const [price, setPrice] = useState(defaultPrice);
  const [dpPercent, setDpPercent] = useState(defaultDpPercent);
  const [tenorYears, setTenorYears] = useState(defaultTenorYears);
  const [ratePercent, setRatePercent] = useState(defaultRatePercent);

  const input: KprInput = { price, dpPercent, tenorYears, ratePercent };
  const result = useMemo(() => calculateKpr({ price, dpPercent, tenorYears, ratePercent }), [price, dpPercent, tenorYears, ratePercent]);

  const principalShare = result.totalPayment > 0 ? Math.round((result.loan / result.totalPayment) * 100) : 100;

  const apply = () => {
    if (onApply) return onApply(input, result);

    const qs = new URLSearchParams({
      harga: String(price),
      dp: String(dpPercent),
      tenor: String(tenorYears),
      bunga: String(ratePercent),
    });
    if (bank) qs.set("bank", bank);
    navigate(`${ctaTo}?${qs.toString()}`);
  };

  return (
    <div className={`bg-white rounded-2xl sm:rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden ${className}`}>
      <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 lg:p-8 pb-0 sm:pb-0 lg:pb-0">
        <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
          <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
        </div>
        <div>
          <p className="text-red-500 font-bold uppercase text-xs sm:text-sm">Kalkulator</p>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-800">{title}</h2>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
        {/* INPUT */}
        <div className="space-y-6">
          <div>
            <label htmlFor="kpr-price" className="text-xs sm:text-sm font-bold text-gray-600">
              Harga properti
            </label>
            <div className="mt-2 flex items-center rounded-2xl bg-gray-50 ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-red-500 transition">
              <span className="pl-4 text-sm font-bold text-gray-400">Rp</span>
              <input
                id="kpr-price"
                inputMode="numeric"
                value={price ? nf.format(price) : ""}
                onChange={(e) => setPrice(Math.min(Number(e.target.value.replace(/\D/g, "") || 0), PRICE_MAX))}
                placeholder="0"
                className="w-full bg-transparent px-3 py-3 text-lg font-black text-gray-800 outline-none"
              />
            </div>
            <input
              type="range"
              aria-label="Geser harga properti"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={PRICE_STEP}
              value={Math.min(Math.max(price, PRICE_MIN), PRICE_MAX)}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="mt-3 w-full accent-red-600 cursor-pointer"
            />
            <div className="mt-1 flex justify-between text-[11px] text-gray-400 font-semibold">
              <span>Rp 100 jt</span>
              <span>Rp 5 M</span>
            </div>
          </div>

          <RangeField
            id="kpr-dp"
            label="Uang muka (DP)"
            valueLabel={`${dpPercent}% · ${rupiah(result.dp)}`}
            min={5}
            max={70}
            step={5}
            value={dpPercent}
            onChange={setDpPercent}
            minLabel="5%"
            maxLabel="70%"
          />

          <div>
            <p className="text-xs sm:text-sm font-bold text-gray-600">Jangka waktu (tenor)</p>
            <div role="group" aria-label="Pilih tenor" className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-2">
              {TENOR_OPTIONS.map((t) => {
                const active = tenorYears === t;
                return (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setTenorYears(t)}
                    className={`rounded-xl py-2.5 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 ${
                      active ? "bg-red-600 text-white shadow-md shadow-red-200" : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
                    }`}>
                    {t} th
                  </button>
                );
              })}
            </div>
          </div>

          <RangeField
            id="kpr-rate"
            label="Suku bunga per tahun"
            valueLabel={`${ratePercent.toLocaleString("id-ID")}%`}
            min={3}
            max={15}
            step={0.25}
            value={ratePercent}
            onChange={setRatePercent}
            minLabel="3%"
            maxLabel="15%"
          />
        </div>

        {/* HASIL */}
        <div className="rounded-2xl sm:rounded-[1.75rem] bg-gradient-to-br from-red-600 via-red-500 to-red-700 text-white p-5 sm:p-6 flex flex-col" aria-live="polite">
          <p className="text-xs sm:text-sm font-semibold text-white/80">Estimasi cicilan per bulan</p>
          <p className="mt-1 text-3xl sm:text-4xl font-black leading-tight break-words">{rupiah(result.monthly)}</p>
          <p className="mt-1 text-xs text-white/70">
            selama {result.months} bulan ({tenorYears} tahun)
          </p>

          {/* komposisi pokok vs bunga */}
          <div className="mt-5">
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-white/25" role="img" aria-label={`Pokok ${principalShare}%, bunga ${100 - principalShare}%`}>
              <div className="bg-white" style={{ width: `${principalShare}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-[11px] font-semibold text-white/80">
              <span>Pokok {principalShare}%</span>
              <span>Bunga {100 - principalShare}%</span>
            </div>
          </div>

          <div className="mt-4 divide-y divide-white/15 border-t border-white/15">
            <Row label="Uang muka (DP)" value={rupiah(result.dp)} />
            <Row label="Plafon pinjaman" value={rupiah(result.loan)} />
            <Row label="Total bunga" value={rupiah(result.totalInterest)} />
            <Row label="Total pembayaran" value={rupiah(result.totalPayment)} strong />
          </div>

          <div className="mt-4 rounded-2xl bg-white/15 p-4">
            <p className="text-xs font-semibold text-white/80">Estimasi penghasilan minimal per bulan</p>
            <p className="mt-0.5 text-lg font-black">{rupiah(result.minIncome)}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-white/70">Dengan asumsi cicilan maksimal {INSTALLMENT_RATIO * 100}% dari penghasilan. Ketentuan tiap bank bisa berbeda.</p>
          </div>

          {showCta && (
            <button
              type="button"
              onClick={apply}
              disabled={result.loan <= 0}
              className="mt-5 w-full px-6 py-3 rounded-xl sm:rounded-2xl bg-white text-red-600 text-sm sm:text-base font-bold flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:hover:scale-100">
              {ctaLabel}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="mx-4 sm:mx-6 lg:mx-8 mb-4 sm:mb-6 lg:mb-8 flex items-start gap-3 rounded-2xl bg-gray-50 border border-gray-100 p-4">
        <Info className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          Hasil simulasi hanyalah estimasi dengan metode anuitas dan bunga tetap sepanjang tenor. Pada praktiknya, banyak bank memakai bunga fixed di awal lalu floating, sehingga cicilan bisa berubah. Belum termasuk biaya provisi, administrasi,
          asuransi, dan biaya lain. Angka final ditentukan oleh bank.
        </p>
      </div>
    </div>
  );
}
