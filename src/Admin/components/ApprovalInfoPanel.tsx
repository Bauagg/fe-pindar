import React, { useState } from "react";
import { Loader2, Lock, Pencil, Plus, Trash2 } from "lucide-react";
import { api, errorMessage } from "../api";
import { FIELD_TYPES } from "../constants";
import FieldValue from "./FieldValue";
import Modal from "./Modal";
import { btnGhost, btnPrimary, card, inputCls } from "./ui";
import type { Application, ApprovalInfo, FieldType } from "../types";

interface Props {
  app: Application;
  onChanged: () => Promise<void> | void;
}

const SUGGESTIONS = ["Leasing", "Nomor kontrak", "Plafon pencairan", "Tenor", "Angsuran per bulan", "Tanggal pencairan", "Catatan"];
const MAX_MB = 15;
const ALLOWED = /\.(pdf|jpe?g|png)$/i;

export default function ApprovalInfoPanel({ app, onChanged }: Props) {
  const approved = app.status.value === "approved";
  const infos = app.approval_infos ?? [];

  const [editing, setEditing] = useState<ApprovalInfo | "new" | null>(null);
  const [label, setLabel] = useState("");
  const [type, setType] = useState<FieldType>("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const openNew = () => {
    setLabel("");
    setType("text");
    setText("");
    setFile(null);
    setError("");
    setEditing("new");
  };

  const openEdit = (i: ApprovalInfo) => {
    setLabel(i.label);
    setType(i.field_type);
    setText(i.value ?? "");
    setFile(null);
    setError("");
    setEditing(i);
  };

  const isNew = editing === "new";
  const isFile = type === "file";

  const canSave = !saving && label.trim().length > 0 && (isFile ? !isNew || file !== null : text.trim().length > 0);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;
    setError("");

    if (isFile && file) {
      if (!ALLOWED.test(file.name)) return setError("Format file harus PDF, JPG, atau PNG.");
      if (file.size > MAX_MB * 1024 * 1024) return setError(`Ukuran file maksimal ${MAX_MB} MB.`);
    }

    const body = new FormData();
    body.append("label", label.trim());
    if (isNew) body.append("field_type", type);
    if (isFile) {
      if (file) body.append("value", file);
    } else {
      body.append("value", text.trim());
    }

    setSaving(true);
    try {
      if (isNew) await api(`/admin/multifinance/${app.id}/approval-infos`, { method: "POST", body });
      else await api(`/admin/multifinance/approval-infos/${editing.id}`, { method: "POST", body });
      setEditing(null);
      await onChanged();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (i: ApprovalInfo) => {
    if (!window.confirm(`Hapus informasi "${i.label}"?`)) return;
    setBusyId(i.id);
    try {
      await api(`/admin/multifinance/approval-infos/${i.id}`, { method: "DELETE" });
      await onChanged();
    } catch (err) {
      window.alert(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  // Belum Approved: tampilkan petunjuk saja
  if (!approved) {
    return (
      <section className={`${card} flex items-start gap-3 p-5`}>
        <Lock className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
        <div>
          <h2 className="font-extrabold text-gray-900">Informasi persetujuan</h2>
          <p className="mt-1 text-sm text-gray-500">
            Bagian ini aktif setelah status diubah ke <b>Approved</b>. Isinya bebas, misalnya Leasing: Adira Finance, nomor kontrak, atau foto dokumen.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={`${card} border-emerald-200`}>
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-4">
        <div>
          <h2 className="font-extrabold text-gray-900">Informasi persetujuan</h2>
          <p className="text-sm text-gray-500">Informasi untuk pemohon setelah disetujui, misalnya leasing dan nomor kontrak.</p>
        </div>
        <button onClick={openNew} className={`${btnPrimary} shrink-0`}>
          <Plus className="h-4 w-4" /> Tambah
        </button>
      </div>

      {infos.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-gray-500">
          Belum ada informasi. Klik <b>Tambah</b>, contoh: label <b>Leasing</b>, isi <b>Adira Finance</b>.
        </p>
      ) : (
        <ul className="divide-y divide-gray-50">
          {infos.map((i) => (
            <li key={i.id} className="flex items-start justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-400">{i.label}</p>
                <div className="mt-1">
                  <FieldValue type={i.field_type} value={i.value} fileUrl={i.file_url} label={i.label} />
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <button onClick={() => openEdit(i)} aria-label={`Ubah ${i.label}`} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => remove(i)} disabled={busyId === i.id} aria-label={`Hapus ${i.label}`} className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50">
                  {busyId === i.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <Modal title={isNew ? "Tambah informasi" : "Ubah informasi"} onClose={() => setEditing(null)}>
          <form onSubmit={submit} className="space-y-4">
            {error && (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="ai-label" className="mb-2 block text-sm font-bold text-gray-900">
                Label
              </label>
              <input id="ai-label" list="ai-suggestions" required maxLength={150} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Contoh: Leasing" className={inputCls} />
              <datalist id="ai-suggestions">
                {SUGGESTIONS.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>

            <div>
              <label htmlFor="ai-type" className="mb-2 block text-sm font-bold text-gray-900">
                Jenis isian
              </label>
              <select id="ai-type" value={type} disabled={!isNew} onChange={(e) => setType(e.target.value as FieldType)} className={`${inputCls} disabled:opacity-60`}>
                {(Object.keys(FIELD_TYPES) as FieldType[]).map((t) => (
                  <option key={t} value={t}>
                    {FIELD_TYPES[t]}
                  </option>
                ))}
              </select>
              {!isNew && <p className="mt-1 text-xs text-gray-400">Jenis isian tidak bisa diganti. Hapus lalu tambah baru kalau perlu.</p>}
            </div>

            <div>
              <label htmlFor="ai-value" className="mb-2 block text-sm font-bold text-gray-900">
                Isi
              </label>
              {isFile ? (
                <>
                  <input
                    id="ai-value"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    className="block w-full text-sm text-gray-600 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-red-50 file:px-4 file:py-2.5 file:text-sm file:font-bold file:text-red-700 hover:file:bg-red-100"
                  />
                  <p className="mt-1 text-xs text-gray-400">{isNew ? "PDF, JPG, atau PNG, maks. 15 MB." : "Kosongkan jika tidak ingin mengganti file."}</p>
                </>
              ) : type === "textarea" ? (
                <textarea id="ai-value" rows={4} maxLength={5000} value={text} onChange={(e) => setText(e.target.value)} className={`${inputCls} h-auto resize-none py-3`} />
              ) : (
                <input
                  id="ai-value"
                  type={type === "number" ? "number" : type === "date" ? "date" : "text"}
                  maxLength={255}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={type === "text" ? "Contoh: Adira Finance" : undefined}
                  className={inputCls}
                />
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className={btnGhost}>
                Batal
              </button>
              <button type="submit" disabled={!canSave} className={btnPrimary}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Simpan
              </button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}
