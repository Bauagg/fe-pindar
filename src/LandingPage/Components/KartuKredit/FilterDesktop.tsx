import React from "react";

export default function FilterDesktop() {
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
}
