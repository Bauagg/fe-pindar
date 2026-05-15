// components/LoanList.tsx

import { SearchX, RefreshCcw } from "lucide-react";

import LoanCard from "./LoanCard";
import LoanCardSkeleton from "../../Skeleton/skeletonloan";

import { Lender } from "../../../types/lender";

interface Props {
  data: Lender[];
  selected: Lender[];
  loading: boolean;
  onCompare: (item: Lender) => void;
}

const LoanList = ({ data, selected, onCompare, loading }: Props) => {
  // =========================
  // FIRST LOADING
  // =========================
  if (loading && data.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, index) => (
          <LoanCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // =========================
  // EMPTY STATE
  // =========================
  if (!loading && data.length === 0) {
    return (
      <div
        className="
          bg-white
          border border-gray-100
          shadow-lg
          rounded-3xl
          p-8 sm:p-12
          flex flex-col items-center justify-center
          text-center
        ">
        {/* ICON */}
        <div
          className="
            w-20 h-20
            sm:w-24 sm:h-24
            rounded-full
            bg-gradient-to-br
            from-red-50
            to-rose-100
            flex items-center justify-center
          ">
          <SearchX className="w-10 h-10 sm:w-12 sm:h-12 text-red-500" />
        </div>

        {/* TITLE */}
        <h2
          className="
            mt-6
            text-xl
            sm:text-3xl
            font-black
            text-gray-800
          ">
          Data Tidak Ditemukan
        </h2>

        {/* DESCRIPTION */}
        <p
          className="
            mt-3
            text-sm
            sm:text-base
            text-gray-500
            leading-relaxed
            max-w-md
          ">
          Tidak ada pinjaman yang sesuai dengan filter yang dipilih. Coba ubah filter atau reset pencarian.
        </p>

        {/* BUTTON */}
        <button
          onClick={() => window.location.reload()}
          className="
            mt-7
            inline-flex
            items-center
            gap-2
            px-5 py-3
            rounded-2xl
            bg-gradient-to-r
            from-red-500
            to-rose-500
            text-white
            font-bold
            shadow-lg
            hover:scale-[1.03]
            active:scale-[0.98]
            transition-all duration-300
          ">
          <RefreshCcw className="w-4 h-4" />
          Muat Ulang
        </button>
      </div>
    );
  }

  // =========================
  // NORMAL DATA
  // =========================
  return (
    <>
      {/* CARD LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map((item) => (
          <LoanCard key={item.id} data={item} onCompare={onCompare} checked={selected.some((x) => x.id === item.id)} />
        ))}
      </div>

      {/* LOAD MORE SKELETON */}
      {loading && data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
          {[...Array(3)].map((_, index) => (
            <LoanCardSkeleton key={index} />
          ))}
        </div>
      )}
    </>
  );
};

export default LoanList;
