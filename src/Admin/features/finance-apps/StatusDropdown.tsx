import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { STATUS, StatusBadge } from "./shared";

export type Filter = "" | "unread" | string;

export default function StatusDropdown({ value, onChange }: { value: Filter; onChange: (v: Filter) => void }) {
  const keys = Object.keys(STATUS);
  const selected = keys.includes(value) ? value : null;

  // index 0 = "Semua status"
  const options: { key: string; label: string }[] = [{ key: "", label: "Semua status" }, ...keys.map((k) => ({ key: k, label: STATUS[k].label }))];

  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const listId = "status-listbox";

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open]);

  const openMenu = () => {
    setHi(Math.max(0, options.findIndex((o) => o.key === (selected ?? ""))));
    setOpen(true);
  };

  const pick = (i: number) => {
    onChange(options[i].key);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") return setOpen(false);
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHi((i) => (i + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHi((i) => (i - 1 + options.length) % options.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      pick(hi);
    } else if (e.key === "Tab") setOpen(false);
  };

  const active = selected !== null;

  return (
    <div ref={wrap} className="relative w-full sm:w-auto">
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `status-opt-${hi}` : undefined}
        aria-label="Filter status"
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        className={`inline-flex w-full items-center justify-between gap-3 rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 sm:w-auto sm:min-w-[11rem] ${
          active ? "bg-red-600 text-white" : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
        }`}>
        <span className="truncate">{active ? STATUS[selected!].label : "Status"}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul id={listId} role="listbox" aria-label="Pilih status" className="absolute left-0 right-0 z-30 mt-2 max-h-72 overflow-y-auto rounded-2xl bg-white p-1.5 shadow-xl shadow-gray-900/10 ring-1 ring-gray-200 sm:right-auto sm:w-64">
          {options.map((o, i) => {
            const isSel = (selected ?? "") === o.key;
            return (
              <li
                key={o.key || "all"}
                id={`status-opt-${i}`}
                role="option"
                aria-selected={isSel}
                onMouseEnter={() => setHi(i)}
                onClick={() => pick(i)}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm ${hi === i ? "bg-gray-50" : ""} ${isSel ? "font-bold text-gray-900" : "font-semibold text-gray-600"}`}>
                {o.key === "" ? <span>{o.label}</span> : <StatusBadge value={o.key} />}
                {isSel && <Check className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
