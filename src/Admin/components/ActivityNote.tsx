import React from "react";
import { BellRing } from "lucide-react";
import { STATUS } from "../constants";
import type { Activity, StatusKey } from "../types";

/** "baru saja", "5 menit lalu", "2 jam lalu", "3 hari lalu", atau tanggal. */
export function timeAgo(iso?: string): string {
  if (!iso) return "";
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const m = Math.floor(diff / 60000);
  if (m < 1) return "baru saja";
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} hari lalu`;
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

/** Kalimat singkat tentang aktivitas terakhir. */
export function describeActivity(a: Activity): { who: string; text: string } {
  const who = a.actor?.name ?? "Pemohon";
  const m = a.meta ?? {};

  switch (a.action) {
    case "created":
      return { who, text: "mengirim pengajuan baru" };
    case "status_changed": {
      const to = m.to ? STATUS[m.to as StatusKey]?.label ?? m.to : "";
      return { who, text: `mengubah status${to ? ` menjadi ${to}` : ""}` };
    }
    case "field_filled":
      return { who, text: `mengisi ${m.field_label ?? "form tambahan"}` };
    case "field_updated":
      return { who, text: `memperbarui ${m.field_label ?? "form tambahan"}` };
    case "data_updated":
      return { who, text: `mengubah data ${m.section === "asset" ? "jaminan" : "pemohon"}` };
    default:
      return { who, text: m.info_label ? `memperbarui ${m.info_label}` : "memperbarui pengajuan" };
  }
}

/** Titik merah berdenyut untuk penanda belum dibaca. */
export function UnreadDot({ className = "" }: { className?: string }) {
  return (
    <span className={`relative flex h-2.5 w-2.5 ${className}`} aria-hidden="true">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-70 motion-reduce:animate-none" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
    </span>
  );
}

/** Baris "Pemohon mengisi KTP · 5 menit lalu". Merah kalau belum dibaca, abu kalau sudah. */
export default function ActivityNote({ activity, unread }: { activity?: Activity | null; unread: boolean }) {
  if (!activity) return null;
  const { who, text } = describeActivity(activity);

  return (
    <p className={`mt-1 flex items-center gap-1.5 text-xs ${unread ? "font-bold text-red-600" : "font-medium text-gray-400"}`}>
      {unread && <BellRing className="h-3.5 w-3.5 shrink-0" />}
      <span className="truncate">
        {who} {text}
      </span>
      <span className={`shrink-0 ${unread ? "text-red-400" : "text-gray-300"}`}>· {timeAgo(activity.created_at)}</span>
    </p>
  );
}
