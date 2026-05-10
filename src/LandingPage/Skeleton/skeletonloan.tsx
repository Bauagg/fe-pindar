// components/LoanCardSkeleton.tsx

const LoanCardSkeleton = () => {
  return (
    <div
      className="
          relative overflow-hidden
          bg-white rounded-3xl
          border border-gray-100
          shadow-lg
        ">
      {/* SHIMMER EFFECT */}
      <div
        className="
            absolute inset-0
            -translate-x-full
            animate-[shimmer_2s_infinite]
            bg-gradient-to-r
            from-transparent
            via-white/60
            to-transparent
            z-10
          "
      />

      {/* IMAGE */}
      <div className="h-40 max-md:h-60 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 animate-pulse" />

      {/* CONTENT */}
      <div className="p-5 space-y-5">
        {/* TITLE */}
        <div className="space-y-3">
          <div className="h-6 w-40 rounded-xl bg-gray-200 animate-pulse" />

          <div className="h-4 w-24 rounded-lg bg-gray-100 animate-pulse" />
        </div>

        {/* INFO */}
        <div className="flex justify-between gap-4">
          <div className="space-y-3 w-full">
            <div className="h-3 w-20 rounded-lg bg-gray-100 animate-pulse" />

            <div className="h-5 w-28 rounded-lg bg-gray-200 animate-pulse" />
          </div>

          <div className="space-y-3 w-full flex flex-col items-end">
            <div className="h-3 w-20 rounded-lg bg-gray-100 animate-pulse" />

            <div className="h-5 w-20 rounded-lg bg-gray-200 animate-pulse" />
          </div>
        </div>

        {/* CHECKBOX */}
        <div className="flex items-center gap-3 pt-1">
          <div className="w-5 h-5 rounded-md bg-gray-200 animate-pulse" />

          <div className="h-4 w-24 rounded-lg bg-gray-100 animate-pulse" />
        </div>

        {/* BUTTON */}
        <div className="flex gap-3 pt-3">
          <div className="h-12 w-full rounded-2xl bg-gradient-to-r from-red-200 via-red-100 to-red-200 animate-pulse" />

          <div className="h-12 w-28 rounded-2xl bg-gray-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default LoanCardSkeleton;
