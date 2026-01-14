import { useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";

const FilterSidebar = () => {
  const FilterMobile = () => {
    const [open, setOpen] = useState(false);

    return (
      <div className="lg:hidden mb-4">
        {/* Trigger Button */}
        <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl shadow text-sm font-medium">
          <span>Filter & Urutkan</span>
          <span>{open ? <IoIosArrowUp /> : <IoIosArrowDown />}</span>
        </button>

        {/* Dropdown */}
        {open && (
          <div className="mt-3 bg-white rounded-xl shadow p-4 space-y-5">
            <div>
              <h3 className="font-semibold mb-2">Jumlah Pinjaman</h3>
              {["Semua", "< 1 Juta", "1 - 10 Juta"].map((item) => (
                <label key={item} className="flex items-center gap-2 mb-2 text-sm">
                  <input type="checkbox" />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Jenis Pinjaman</h3>
              {["Semua", "Full Payment", "Periodic Payment"].map((item) => (
                <label key={item} className="flex items-center gap-2 mb-2 text-sm">
                  <input type="checkbox" />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Urutkan</h3>
              {["Produk Pilihan", "Plafond Tertinggi", "Plafond Terendah"].map((item) => (
                <label key={item} className="flex items-center gap-2 mb-2 text-sm">
                  <input type="checkbox" />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            <button className="w-full mt-2 bg-gradient-to-r from-red-500 to-orange-500 text-white py-2 rounded-lg text-sm font-semibold">Terapkan</button>
          </div>
        )}
      </div>
    );
  };

  const FilterDesktop = () => {
    return (
      <div className="hidden lg:block space-y-6">
        <aside className="bg-white rounded-xl shadow p-5 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-xl">Filter</h1>
            <p className="text-red-500 cursor-pointer text-sm">Select All</p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Jumlah Pinjaman</h3>
            {["Semua", "< 1 Juta", "1 - 10 Juta"].map((item) => (
              <label key={item} className="flex items-center gap-2 mb-2 text-sm">
                <input type="checkbox" />
                <span>{item}</span>
              </label>
            ))}
          </div>

          <div>
            <h3 className="font-semibold mb-3">Jenis Pinjaman</h3>
            {["Semua", "Full Payment", "Periodic Payment"].map((item) => (
              <label key={item} className="flex items-center gap-2 mb-2 text-sm">
                <input type="checkbox" />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </aside>

        <aside className="bg-white rounded-xl shadow p-5 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-xl">Urutkan</h1>
            <p className="text-red-500 cursor-pointer text-sm">Select All</p>
          </div>

          {["Produk Pilihan", "Plafond Tertinggi", "Plafond Terendah"].map((item) => (
            <label key={item} className="flex items-center gap-2 mb-2 text-sm">
              <input type="checkbox" />
              <span>{item}</span>
            </label>
          ))}
        </aside>
      </div>
    );
  };

  return (
    <>
      <>
        <FilterMobile />
        <FilterDesktop />
      </>
    </>
  );
};

export default FilterSidebar;
