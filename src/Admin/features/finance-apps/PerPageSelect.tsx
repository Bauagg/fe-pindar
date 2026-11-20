import React, { useState } from "react";

/** Pilihan jumlah data per halaman: preset + isi sendiri (dibatasi min..max). */
export default function PerPageSelect({ value, onChange, options, max }: { value: number; onChange: (n: number) => void; options: number[]; max: number }) {
  const [custom, setCustom] = useState(!options.includes(value));
  const [draft, setDraft] = useState(String(value));

  const commit = () => {
    const n = Math.min(max, Math.max(1, Math.floor(Number(draft))));
    if (!Number.isFinite(n) || n < 1) return setDraft(String(value));
    setDraft(String(n));
    if (options.includes(n)) setCustom(false);
    if (n !== value) onChange(n);
  };

  return (
    <div className="flex items-center gap-2 text-gray-500">
      <span className="whitespace-nowrap">Tampilkan</span>
      <select
        value={custom ? "custom" : String(value)}
        onChange={(e) => {
          if (e.target.value === "custom") {
            setCustom(true);
            setDraft(String(value));
          } else {
            setCustom(false);
            onChange(Number(e.target.value));
          }
        }}
        aria-label="Jumlah data per halaman"
        className="rounded-lg bg-white px-2 py-1.5 text-sm font-bold text-gray-700 ring-1 ring-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
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
          className="w-20 rounded-lg bg-white px-2 py-1.5 text-sm font-bold text-gray-700 ring-1 ring-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500"
        />
      )}
      <span className="whitespace-nowrap">/ halaman</span>
    </div>
  );
}
