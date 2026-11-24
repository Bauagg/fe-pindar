import React, { useEffect, useState } from "react";

/** Pilihan jumlah data per halaman: preset + isi sendiri (dibatasi min..max). */
export default function PerPageSelect({ value, onChange, options, max, pill = false }: { value: number; onChange: (n: number) => void; options: number[]; max: number; pill?: boolean }) {
  const [customMode, setCustomMode] = useState(false);
  const [draft, setDraft] = useState(String(value));

  // Mode isi sendiri aktif kalau dipilih manual, atau kalau value bukan preset
  const custom = customMode || !options.includes(value);

  // Sinkronkan isian kalau value berubah dari selector lain (atas/bawah)
  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commit = () => {
    const n = Math.min(max, Math.max(1, Math.floor(Number(draft))));
    if (!Number.isFinite(n) || n < 1) return setDraft(String(value));
    setDraft(String(n));
    if (options.includes(n)) setCustomMode(false);
    if (n !== value) onChange(n);
  };

  const wrapCls = pill ? "inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-bold text-gray-600 ring-1 ring-gray-200" : "flex items-center gap-2 text-gray-500";

  const fieldCls = pill
    ? "rounded-md bg-transparent text-sm font-bold text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500"
    : "rounded-lg bg-white px-2 py-1.5 text-sm font-bold text-gray-700 ring-1 ring-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500";

  return (
    <div className={wrapCls}>
      <span className="whitespace-nowrap">Tampilkan</span>
      <select
        value={custom ? "custom" : String(value)}
        onChange={(e) => {
          if (e.target.value === "custom") {
            setCustomMode(true);
            setDraft(String(value));
          } else {
            setCustomMode(false);
            onChange(Number(e.target.value));
          }
        }}
        aria-label="Jumlah data per halaman"
        className={fieldCls}>
        {options.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
        <option value="custom">Isi sendiri…</option>
      </select>

      {custom && (
        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={max}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            }
          }}
          aria-label={`Jumlah data per halaman (1-${max})`}
          className={`${fieldCls} ${pill ? "w-10 px-2 py-0.5 ring-1 ring-gray-200" : "w-10"}`}
        />
      )}
      <span className="whitespace-nowrap"></span>
    </div>
  );
}
