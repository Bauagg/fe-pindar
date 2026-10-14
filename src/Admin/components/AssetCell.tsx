// components/AssetCell.tsx

import { Bike, Building2, Car, Home, User } from "lucide-react";
import type { Application } from "../types";

export const OWNERSHIP_LABEL: Record<string, string> = {
  sendiri: "Atas nama sendiri",
  orang_lain: "Atas nama orang lain",
};

export const OWNER_SHORT: Record<string, string> = {
  sendiri: "Sendiri",
  orang_lain: "Orang lain",
};

export const TRANSMISSION_LABEL: Record<string, string> = {
  matic: "Matic",
  manual: "Manual",
};

export const FINANCING_LABEL: Record<string, string> = {
  bpkb_on_hand: "BPKB On Hand",
  take_over: "Take Over",
};

export const APPLICANT_LABEL: Record<string, string> = {
  individu: "Individu",
  perusahaan: "Perusahaan",
};

/** Jaminan: SHM atau kendaraan (BPKB). Aman untuk data lama yang belum punya field baru. */
export default function AssetCell({ a }: { a: Application }) {
  const ownership = a.asset?.ownership ? OWNERSHIP_LABEL[a.asset.ownership] ?? a.asset.ownership : null;

  if (a.asset?.is_shm) {
    return (
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Home className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate font-bold text-gray-900">SHM · {a.asset.certificate_type || "-"}</p>
          {ownership && <p className="text-xs text-gray-400">{ownership}</p>}
        </div>
      </div>
    );
  }

  const v = a.vehicle;
  const Icon = v?.type === "motor" ? Bike : Car;
  const title = [v?.brand, v?.model].filter(Boolean).join(" ") || "-";

  const sub = [
    v?.transmission ? TRANSMISSION_LABEL[v.transmission] ?? v.transmission : null,
    v?.financing_status ? FINANCING_LABEL[v.financing_status] ?? v.financing_status : null,
    v?.financing_status === "take_over" && v.previous_leasing ? `dari ${v.previous_leasing}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="truncate font-bold text-gray-900">
          {title}
          {v?.year ? <span className="font-semibold text-gray-500"> ({v.year})</span> : null}
        </p>
        <p className="text-xs text-gray-400">{[ownership ? `BPKB ${ownership.toLowerCase()}` : null, sub].filter(Boolean).join(" · ")}</p>
      </div>
    </div>
  );
}

/** Label kecil: individu / perusahaan. */
export function ApplicantBadge({ type }: { type?: string }) {
  const isCompany = type === "perusahaan";
  const Icon = isCompany ? Building2 : User;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${isCompany ? "bg-violet-50 text-violet-600" : "bg-gray-100 text-gray-500"}`}>
      <Icon className="h-3 w-3" />
      {APPLICANT_LABEL[type ?? "individu"] ?? type}
    </span>
  );
}
