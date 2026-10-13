import React, { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { api, errorMessage } from "../api";
import { isFullAdmin, useAuth } from "../auth/AuthContext";
import { STATUS } from "../constants";
import { btnPrimary, card, inputCls } from "./ui";
import type { Application, StatusKey } from "../types";

interface Props {
  app: Application;
  onSaved: () => Promise<void> | void;
}

const ALL_KEYS = Object.keys(STATUS) as StatusKey[];
// Role selain super_admin & admin (mis. admin retail) hanya boleh menetapkan hasil akhir.
const LIMITED_KEYS: StatusKey[] = ["correction", "approved", "rejected"];

// Status yang wajib disertai alasan.
type ReasonKey = "rejected" | "correction";

const REASON_CONFIG: Record<ReasonKey, { field: "rejected_reason" | "correction_reason"; label: string; placeholder: string }> = {
  rejected: {
    field: "rejected_reason",
    label: "Alasan penolakan",
    placeholder: "Contoh: Data pemohon tidak memenuhi syarat.",
  },
  correction: {
    field: "correction_reason",
    label: "Alasan koreksi",
    placeholder: "Contoh: Foto BPKB tidak terbaca, mohon upload ulang.",
  },
};

const needsReason = (k: StatusKey): k is ReasonKey => k === "rejected" || k === "correction";

// Ambil alasan tersimpan sesuai status yang sedang dipilih.
const savedReasonOf = (app: Application, k: StatusKey): string => {
  if (k === "rejected") return app.status.rejected_reason ?? "";
  if (k === "correction") return app.status.correction_reason ?? "";
  return "";
};

export default function StatusPanel({ app, onSaved }: Props) {
  const { user } = useAuth();
  const full = isFullAdmin(user);
  const keys = full ? ALL_KEYS : LIMITED_KEYS;

  const current = app.status.value;
  const currentReason = savedReasonOf(app, current);

  const [value, setValue] = useState<StatusKey>(current);
  const [reason, setReason] = useState(currentReason);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    setValue(current);
    setReason(currentReason);
  }, [current, currentReason]);

  // Saat pindah pilihan status, isi alasan dengan alasan tersimpan milik status itu
  // (kalau status yang dipilih sama dengan status saat ini), selain itu kosongkan.
  const pick = (k: StatusKey) => {
    setValue(k);
    setReason(k === current ? currentReason : "");
    setMsg(null);
  };

  const dirty = value !== current || (needsReason(value) && reason !== currentReason);
  const canSave = dirty && keys.includes(value) && (!needsReason(value) || reason.trim().length > 0);

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const body: Record<string, string> = { status: value };
      if (needsReason(value)) {
        body[REASON_CONFIG[value].field] = reason.trim();
      }

      await api(`/admin/multifinance/${app.id}/status`, {
        method: "PUT",
        body,
      });
      await onSaved();
      setMsg({ ok: true, text: "Status berhasil diperbarui." });
    } catch (e) {
      setMsg({ ok: false, text: errorMessage(e) });
    } finally {
      setSaving(false);
    }
  };

  const reasonCfg = needsReason(value) ? REASON_CONFIG[value] : null;

  return (
    <section className={`${card} p-5`}>
      <h2 className="font-extrabold text-gray-900">Status pengajuan</h2>

      {!full && (
        <p className="mt-1 text-sm text-gray-500">
          Status saat ini: <b className="text-gray-800">{STATUS[current].label}</b>. Role kamu hanya bisa menetapkan Koreksi, Approved, atau Rejected.
        </p>
      )}

      <div role="radiogroup" aria-label="Pilih status" className="mt-4 grid grid-cols-2 gap-2">
        {keys.map((k) => (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={value === k}
            onClick={() => pick(k)}
            className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold ring-1 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 ${
              value === k ? "bg-red-50 text-red-700 ring-red-300" : "bg-white text-gray-600 ring-gray-200 hover:bg-gray-50"
            }`}>
            <span className={`h-2 w-2 rounded-full ${STATUS[k].dot}`} />
            {STATUS[k].label}
          </button>
        ))}
      </div>

      {reasonCfg && (
        <div className="mt-4">
          <label htmlFor="reason" className="mb-2 block text-sm font-bold text-gray-900">
            {reasonCfg.label}
          </label>
          <textarea id="reason" rows={3} maxLength={2000} value={reason} onChange={(e) => setReason(e.target.value)} placeholder={reasonCfg.placeholder} className={`${inputCls} h-auto resize-none py-3`} />
        </div>
      )}

      {msg && (
        <p role={msg.ok ? "status" : "alert"} className={`mt-4 flex items-center gap-2 text-sm font-semibold ${msg.ok ? "text-emerald-600" : "text-red-600"}`}>
          {msg.ok && <CheckCircle2 className="h-4 w-4" />}
          {msg.text}
        </p>
      )}

      <button onClick={save} disabled={!canSave || saving} className={`${btnPrimary} mt-5 w-full`}>
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        Simpan status
      </button>
    </section>
  );
}
