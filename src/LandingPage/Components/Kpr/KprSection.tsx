import { NavLink } from "react-router-dom";
import { Home } from "lucide-react";

export default function KprSection() {
  return (
    <div className="max-sm:mt-5 mt-10 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="relative overflow-hidden bg-gradient-to-br from-red-700 via-red-600 to-red-500 rounded-2xl sm:rounded-3xl p-6 flex items-center justify-between gap-3 sm:gap-4 md:gap-6 shadow-xl">
        {/* Dekorasi background */}
        <div className="pointer-events-none absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute right-24 -bottom-12 w-32 h-32 rounded-full bg-white/5" />

        <div className="relative flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
            <Home className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>

          <div className="min-w-0">
            <h2 className="text-white font-bold text-base sm:text-xl md:text-2xl leading-tight">
              Pindar <span className="mx-0.5 inline-block -skew-x-12 align-middle text-[0.85em] font-black text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]">✕</span> KPR
            </h2>
            <p className="text-red-100 text-xs sm:text-sm mt-0.5">Wujudkan rumah impian dengan cicilan ringan</p>
          </div>
        </div>

        <NavLink
          to="/kpr"
          className="
            relative shrink-0
            inline-flex items-center gap-2
            bg-white text-red-600
            px-3 sm:px-4 md:px-5
            py-2 sm:py-2.5 md:py-2
            rounded-full
            text-xs sm:text-sm md:text-base
            hover:bg-red-50
            transition font-semibold
            whitespace-nowrap
          ">
          Lihat Semua →
        </NavLink>
      </div>
    </div>
  );
}
