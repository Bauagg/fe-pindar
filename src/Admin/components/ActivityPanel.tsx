import React from "react";
import { STATUS } from "../constants";
import { card } from "./ui";
import { fmtDateTime } from "../utils";
import type { Activity, StatusKey } from "../types";

const label = (k?: StatusKey) => (k && STATUS[k]?.label) || "-";

function describe(a: Activity): { title: string; note?: string; dot: string } {
  const m = a.meta ?? {};
  const isFile = m.field_type === "file";
  const field = m.field_label ?? "form tambahan";

  switch (a.action) {
    case "created":
      return { title: "Pengajuan dibuat", dot: "bg-gray-400" };
    case "status_changed":
      return {
        title: `Status diubah dari ${label(m.from)} ke ${label(m.to)}`,
        note: m.to === "rejected" && m.reason ? `Alasan: ${m.reason}` : undefined,
        dot: (m.to && STATUS[m.to]?.dot) || "bg-gray-400",
      };
    case "field_filled":
      return { title: isFile ? `Mengunggah "${field}"` : `Mengisi "${field}"`, dot: "bg-red-500" };
    case "field_updated":
      return { title: isFile ? `Mengganti file "${field}"` : `Memperbarui "${field}"`, dot: "bg-red-500" };
    case "info_added":
      return { title: `Menambah informasi "${m.info_label ?? ""}"`, dot: "bg-emerald-500" };
    case "info_updated":
      return { title: `Mengubah informasi "${m.info_label ?? ""}"`, dot: "bg-emerald-500" };
    case "info_removed":
      return { title: `Menghapus informasi "${m.info_label ?? ""}"`, dot: "bg-gray-400" };
    default:
      return { title: a.action, dot: "bg-gray-400" };
  }
}

export default function ActivityPanel({ activities }: { activities: Activity[] }) {
  return (
    <section className={`${card} p-5`}>
      <h2 className="font-extrabold text-gray-900">Riwayat</h2>
      <p className="mt-1 text-sm text-gray-500">Perubahan status dan isian dokumen, terbaru di atas.</p>

      {activities.length === 0 ? (
        <p className="mt-4 text-sm text-gray-400">Belum ada riwayat.</p>
      ) : (
        <ol className="mt-5 ml-1.5 max-h-96 overflow-y-auto border-l border-gray-200 pr-1">
          {activities.map((a) => {
            const d = describe(a);
            return (
              <li key={a.id} className="relative pb-5 pl-5 last:pb-0">
                <span className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-white ${d.dot}`} />
                <p className="text-sm font-bold text-gray-900">{d.title}</p>
                {d.note && <p className="mt-0.5 text-sm text-gray-600">{d.note}</p>}
                <p className="mt-1 text-xs text-gray-400">
                  oleh <b className="text-gray-600">{a.actor?.name ?? "Pemohon"}</b> · {fmtDateTime(a.created_at)}
                </p>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
