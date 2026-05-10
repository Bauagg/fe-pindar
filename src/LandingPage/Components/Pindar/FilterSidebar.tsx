// components/FilterSidebar.tsx

import { useState } from "react";
import { FiFilter, FiChevronDown, FiChevronUp } from "react-icons/fi";

interface Props {
  filters: any;
  setFilters: any;
}

const FilterSidebar = ({ filters, setFilters }: Props) => {
  const [open, setOpen] = useState(false);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* JENIS PINJAMAN */}
      <div>
        <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">Jenis Pinjaman</h3>

        <div className="space-y-3">
          {[
            { label: "Semua", value: "" },
            { label: "Pinjaman Kecil", value: "small" },
            { label: "Pinjaman Besar", value: "large" },
          ].map((item) => (
            <label
              key={item.value}
              className="
                flex items-center gap-3 cursor-pointer
                group
              ">
              <input
                type="radio"
                checked={filters.selectedLoanAmounts === item.value}
                onChange={() =>
                  setFilters({
                    ...filters,
                    selectedLoanAmounts: item.value,
                  })
                }
                className="
                  w-4 h-4
                  accent-red-500
                "
              />

              <span className="text-sm text-gray-700 group-hover:text-red-500 transition">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* PAYMENT */}
      <div>
        <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">Payment</h3>

        <div className="space-y-3">
          {[
            { label: "Semua", value: "" },
            { label: "Full Payment", value: "full_payment" },
            { label: "Periodic Payment", value: "periodic_payment" },
          ].map((item) => (
            <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                checked={filters.selectedPayments === item.value}
                onChange={() =>
                  setFilters({
                    ...filters,
                    selectedPayments: item.value,
                  })
                }
                className="w-4 h-4 accent-red-500"
              />

              <span className="text-sm text-gray-700 group-hover:text-red-500 transition">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* SORT */}
      <div>
        <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">Urutkan</h3>

        <div className="space-y-3">
          {[
            { label: "Plafond Tertinggi", value: "desc" },
            { label: "Plafond Terendah", value: "asc" },
          ].map((item) => (
            <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                checked={filters.selectedPlafond === item.value}
                onChange={() =>
                  setFilters({
                    ...filters,
                    selectedPlafond: item.value,
                  })
                }
                className="w-4 h-4 accent-red-500"
              />

              <span className="text-sm text-gray-700 group-hover:text-red-500 transition">{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* MOBILE & TABLET */}
      <div className="xl:hidden mb-5">
        {/* BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="
            w-full
            bg-white
            rounded-2xl
            px-5 py-4
            shadow-md
            border border-gray-100
            flex items-center justify-between
            hover:shadow-lg
            transition-all duration-300
          ">
          <div className="flex items-center gap-3">
            <div
              className="
                w-10 h-10
                rounded-xl
                bg-gradient-to-r from-red-500 to-rose-500
                flex items-center justify-center
                text-white
              ">
              <FiFilter size={18} />
            </div>

            <div className="text-left">
              <h3 className="font-bold text-gray-800">Filter Pinjaman</h3>

              <p className="text-xs text-gray-500">Pilih filter sesuai kebutuhan</p>
            </div>
          </div>

          <div
            className="
              w-10 h-10
              rounded-xl
              bg-gray-100
              flex items-center justify-center
              text-gray-600
            ">
            {open ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
          </div>
        </button>

        {/* DROPDOWN */}
        <div
          className={`
            transition-all duration-500 overflow-hidden
            ${open ? "max-h-[1000px] opacity-100 mt-4" : "max-h-0 opacity-0"}
          `}>
          <div
            className="
              bg-white
              rounded-3xl
              shadow-xl
              border border-gray-100
              p-5
            ">
            <FilterContent />

            {/* BUTTON */}
            <div className="pt-6">
              <button
                onClick={() => setOpen(false)}
                className="
                  w-full
                  py-3
                  rounded-2xl
                  bg-gradient-to-r
                  from-red-500
                  to-rose-500
                  text-white
                  font-bold
                  shadow-lg
                  hover:scale-[1.02]
                  transition-all duration-300
                ">
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden xl:block">
        <aside
          className="
            bg-white
            rounded-3xl
            shadow-lg
            border border-gray-100
            p-6
            sticky top-28
          ">
          <div className="flex items-center gap-3 mb-8">
            <div
              className="
                w-12 h-12
                rounded-2xl
                bg-gradient-to-r from-red-500 to-rose-500
                flex items-center justify-center
                text-white
              ">
              <FiFilter size={20} />
            </div>

            <div>
              <h2 className="font-black text-xl text-gray-800">Filter</h2>

              <p className="text-sm text-gray-500">Sesuaikan pencarian</p>
            </div>
          </div>

          <FilterContent />
        </aside>
      </div>
    </>
  );
};

export default FilterSidebar;
