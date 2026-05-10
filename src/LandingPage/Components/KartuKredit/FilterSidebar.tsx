import { useState } from "react";
import { FiFilter, FiChevronDown, FiChevronUp, FiSearch } from "react-icons/fi";

interface Props {
  filters: any;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
}

const FilterSidebar = ({ filters, setFilters }: Props) => {
  const [open, setOpen] = useState(false);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // FIX INPUT FOCUS
  const filterContent = (
    <div className="space-y-7">
      {/* SEARCH */}
      <div>
        <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">Fitur</h3>

        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Cari fitur kartu..."
            value={filters.search || ""}
            onChange={(e) =>
              setFilters((prev: any) => ({
                ...prev,
                search: e.target.value,
              }))
            }
            className="
              w-full h-12 pl-12 pr-4
              rounded-2xl
              border border-gray-200
              outline-none
              focus:ring-4 focus:ring-red-100
              focus:border-red-400
              transition-all
              text-sm
            "
          />
        </div>
      </div>

      {/* SORT */}
      <div>
        <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">Urutkan</h3>

        <div className="space-y-3">
          {[
            {
              label: "Iuran Tahunan Tertinggi",
              value: "desc",
            },
            {
              label: "Iuran Tahunan Terendah",
              value: "asc",
            },
          ].map((item) => (
            <label
              key={item.value}
              className="
                flex items-center gap-3
                cursor-pointer
                group
              ">
              <input
                type="radio"
                checked={filters.sortDirection === item.value}
                onChange={() =>
                  setFilters((prev: any) => ({
                    ...prev,
                    sortDirection: item.value,
                  }))
                }
                className="w-4 h-4 accent-red-500"
              />

              <span className="text-sm text-gray-700 group-hover:text-red-500 transition">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* YEARLY FEE */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Maximum Iuran Tahunan</h3>

          <span className="text-xs font-bold text-red-500">{formatRupiah(filters.maxYearlyFee)}</span>
        </div>

        <div className="relative">
          <input
            type="range"
            min={0}
            max={68900000}
            step={100000}
            value={filters.maxYearlyFee}
            onChange={(e) =>
              setFilters((prev: any) => ({
                ...prev,
                maxYearlyFee: Number(e.target.value),
              }))
            }
            className="
              w-full
              accent-red-500
              cursor-pointer
            "
          />

          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>Rp 0</span>

            <span>Rp 68,9 JT</span>
          </div>
        </div>
      </div>

      {/* LIMIT */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Jumlah Data</h3>

          <span className="text-xs font-bold text-red-500">{filters.limit}</span>
        </div>

        <select
          value={filters.limit}
          onChange={(e) =>
            setFilters((prev: any) => ({
              ...prev,
              limit: Number(e.target.value),
            }))
          }
          className="
            w-full
            h-12
            rounded-2xl
            border border-gray-200
            px-4
            outline-none
            focus:ring-4 focus:ring-red-100
            focus:border-red-400
            transition-all
            text-sm
          ">
          <option value={5}>5 Data</option>
          <option value={10}>10 Data</option>
          <option value={15}>15 Data</option>
          <option value={20}>20 Data</option>
        </select>
      </div>
    </div>
  );

  return (
    <>
      {/* MOBILE */}
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
                bg-gradient-to-r
                from-red-500
                to-rose-500
                flex items-center justify-center
                text-white
              ">
              <FiFilter size={18} />
            </div>

            <div className="text-left">
              <h3 className="font-bold text-gray-800">Filter Kartu</h3>

              <p className="text-xs text-gray-500">Sesuaikan kebutuhan kartu</p>
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
            overflow-hidden
            transition-all duration-500
            ${open ? "max-h-[1200px] opacity-100 mt-4" : "max-h-0 opacity-0"}
          `}>
          <div
            className="
              bg-white
              rounded-3xl
              shadow-xl
              border border-gray-100
              p-5
            ">
            {filterContent}

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
          {/* HEADER */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="
                w-12 h-12
                rounded-2xl
                bg-gradient-to-r
                from-red-500
                to-rose-500
                flex items-center justify-center
                text-white
              ">
              <FiFilter size={20} />
            </div>

            <div>
              <h2 className="font-black text-xl text-gray-800">Filter</h2>

              <p className="text-sm text-gray-500">Sesuaikan pencarian kartu</p>
            </div>
          </div>

          {filterContent}
        </aside>
      </div>
    </>
  );
};

export default FilterSidebar;
