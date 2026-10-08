import React, { useState } from "react";
import { ExternalLink, Loader2, Pencil, PenLine, Plus, Trash2, Upload } from "lucide-react";
import { api, errorMessage } from "../api";
import { FIELD_TYPES } from "../constants";
import Modal from "./Modal";
import { btnGhost, btnPrimary, btnSmall, card, inputCls } from "./ui";
import { fmtDateTime } from "../utils";
import type { Activity, Application, FieldType, FormField } from "../types";

interface Props {
  app: Application;
  onChanged: () => Promise<void> | void;
}

interface Draft {
  label: string;
  field_type: FieldType;
  is_required: boolean;
  sort_order: string;
}

const MAX_MB = 15;
const ALLOWED = /\.(pdf|jpe?g|png)$/i;

const isImage = (url: string) => /\.(jpe?g|png|webp|gif)$/i.test(url);

/** Aktivitas terakhir yang mengisi field ini (list sudah terbaru di atas). */
const lastFilled = (activities: Activity[] | undefined, fieldId: number) => activities?.find((a) => (a.action === "field_filled" || a.action === "field_updated") && a.meta.field_id === fieldId);

function ValueView({ f }: { f: FormField }) {
  if (f.field_type === "file") {
    if (!f.file_url) return <span className="text-sm text-gray-400">Belum diupload</span>;
    return (
      <a href={f.file_url} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-3">
        {isImage(f.file_url) && <img src={f.file_url} alt={f.label} className="h-16 w-16 rounded-lg object-cover ring-1 ring-gray-200" />}
        <span className="inline-flex items-center gap-1 text-sm font-bold text-red-600 group-hover:text-red-700">
          Buka file <ExternalLink className="h-3.5 w-3.5" />
        </span>
      </a>
    );
  }
  return f.value ? <p className="whitespace-pre-wrap text-sm font-semibold text-gray-800">{f.value}</p> : <span className="text-sm text-gray-400">Belum diisi</span>;
}

export default function FormFieldsPanel({ app, onChanged }: Props) {
  const fields = app.form_fields ?? [];

  // Kelola definisi field
  const [editing, setEditing] = useState<FormField | "new" | null>(null);
  const [draft, setDraft] = useState<Draft>({ label: "", field_type: "text", is_required: true, sort_order: "0" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  // Isi / upload nilai atas nama pemohon
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [rowError, setRowError] = useState<{ id: number; text: string } | null>(null);
  const [filling, setFilling] = useState<FormField | null>(null);
  const [fillValue, setFillValue] = useState("");
  const [fillSaving, setFillSaving] = useState(false);
  const [fillError, setFillError] = useState("");

  const openNew = () => {
    const last = fields[fields.length - 1];
    setDraft({ label: "", field_type: "text", is_required: true, sort_order: String((last?.sort_order ?? 0) + 1) });
    setError("");
    setEditing("new");
  };

  const openEdit = (f: FormField) => {
    setDraft({ label: f.label, field_type: f.field_type, is_required: f.is_required, sort_order: String(f.sort_order) });
    setError("");
    setEditing(f);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError("");

    const body = {
      label: draft.label.trim(),
      field_type: draft.field_type,
      is_required: draft.is_required,
      sort_order: Number(draft.sort_order) || 0,
    };

    try {
      if (editing === "new") await api(`/admin/multifinance/${app.id}/fields`, { method: "POST", body });
      else await api(`/admin/multifinance/fields/${editing.id}`, { method: "PUT", body });
      setEditing(null);
      await onChanged();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (f: FormField) => {
    if (!window.confirm(`Hapus field "${f.label}"? Isian user untuk field ini ikut terhapus.`)) return;
    setBusyId(f.id);
    try {
      await api(`/admin/multifinance/fields/${f.id}`, { method: "DELETE" });
      await onChanged();
    } catch (err) {
      window.alert(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  /** Upload file (mis. foto BPKB dari WA) langsung atas nama pemohon. */
  const uploadFile = async (f: FormField, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // supaya file yang sama bisa dipilih lagi
    if (!file) return;

    setRowError(null);

    if (!ALLOWED.test(file.name)) {
      setRowError({ id: f.id, text: "Format file harus PDF, JPG, atau PNG." });
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setRowError({ id: f.id, text: `Ukuran file maksimal ${MAX_MB} MB.` });
      return;
    }

    setUploadingId(f.id);
    try {
      const body = new FormData();
      body.append(f.name, file);
      await api(`/admin/multifinance/${app.id}/form-values`, { method: "POST", body });
      await onChanged();
    } catch (err) {
      setRowError({ id: f.id, text: errorMessage(err) });
    } finally {
      setUploadingId(null);
    }
  };

  const openFill = (f: FormField) => {
    setFilling(f);
    setFillValue(f.value ?? "");
    setFillError("");
  };

  const submitFill = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!filling) return;
    setFillSaving(true);
    setFillError("");
    try {
      await api(`/admin/multifinance/${app.id}/form-values`, { method: "POST", body: { [filling.name]: fillValue.trim() } });
      setFilling(null);
      await onChanged();
    } catch (err) {
      setFillError(errorMessage(err));
    } finally {
      setFillSaving(false);
    }
  };

  return (
    <section className={card}>
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-4">
        <div>
          <h2 className="font-extrabold text-gray-900">Form tambahan</h2>
          <p className="text-sm text-gray-500">Dokumen atau data tambahan. Bisa diisi pemohon, atau kamu upload atas nama pemohon.</p>
        </div>
        <button onClick={openNew} className={`${btnPrimary} h-10 shrink-0 px-4`}>
          <Plus className="h-4 w-4" /> Tambah
        </button>
      </div>

      {fields.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-gray-500">
          Belum ada form tambahan. Klik <b>Tambah</b> untuk meminta data seperti foto BPKB atau STNK.
        </p>
      ) : (
        <ul className="divide-y divide-gray-50">
          {fields.map((f) => {
            const last = lastFilled(app.activities, f.id);
            const uploading = uploadingId === f.id;

            return (
              <li key={f.id} className="flex items-start justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900">
                    {f.label}{" "}
                    {f.is_required && (
                      <span className="text-red-500" title="Wajib diisi">
                        *
                      </span>
                    )}
                  </p>
                  <p className="mb-2 text-xs text-gray-400">{FIELD_TYPES[f.field_type]}</p>
                  <ValueView f={f} />

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                    {f.field_type === "file" ? (
                      <label className={`${btnSmall} cursor-pointer ${uploading ? "pointer-events-none opacity-60" : ""}`}>
                        {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                        {uploading ? "Mengupload..." : f.file_url ? "Ganti file" : "Upload file"}
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only" disabled={uploading} onChange={(e) => uploadFile(f, e)} />
                      </label>
                    ) : (
                      <button type="button" onClick={() => openFill(f)} className={btnSmall}>
                        <PenLine className="h-3.5 w-3.5" />
                        {f.value ? "Ubah isian" : "Isi data"}
                      </button>
                    )}

                    {last && (
                      <span className="text-xs text-gray-400">
                        Diisi oleh <b className="text-gray-600">{last.actor?.name ?? "Pemohon"}</b> · {fmtDateTime(last.created_at)}
                      </span>
                    )}
                  </div>

                  {rowError?.id === f.id && (
                    <p role="alert" className="mt-2 text-xs font-semibold text-red-600">
                      {rowError.text}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 gap-1">
                  <button onClick={() => openEdit(f)} aria-label={`Ubah pengaturan ${f.label}`} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => remove(f)} disabled={busyId === f.id} aria-label={`Hapus ${f.label}`} className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50">
                    {busyId === f.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Modal: tambah / ubah definisi field */}
      {editing && (
        <Modal title={editing === "new" ? "Tambah form tambahan" : "Ubah form tambahan"} onClose={() => setEditing(null)}>
          <form onSubmit={submit} className="space-y-4">
            {error && (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="f-label" className="mb-2 block text-sm font-bold text-gray-900">
                Nama field
              </label>
              <input id="f-label" required maxLength={150} value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} placeholder="Contoh: Foto BPKB" className={inputCls} />
            </div>

            <div>
              <label htmlFor="f-type" className="mb-2 block text-sm font-bold text-gray-900">
                Jenis isian
              </label>
              <select id="f-type" value={draft.field_type} onChange={(e) => setDraft({ ...draft, field_type: e.target.value as FieldType })} className={inputCls}>
                {(Object.keys(FIELD_TYPES) as FieldType[]).map((t) => (
                  <option key={t} value={t}>
                    {FIELD_TYPES[t]}
                  </option>
                ))}
              </select>
              {draft.field_type === "file" && <p className="mt-1 text-xs text-gray-400">File yang diterima: PDF, JPG, PNG (maks. 15 MB).</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="f-order" className="mb-2 block text-sm font-bold text-gray-900">
                  Urutan
                </label>
                <input id="f-order" type="number" min={0} value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: e.target.value })} className={inputCls} />
              </div>
              <label className="mt-7 flex cursor-pointer items-center gap-3 text-sm font-bold text-gray-800">
                <input type="checkbox" checked={draft.is_required} onChange={(e) => setDraft({ ...draft, is_required: e.target.checked })} className="h-4 w-4 accent-red-600" />
                Wajib diisi
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className={btnGhost}>
                Batal
              </button>
              <button type="submit" disabled={saving || !draft.label.trim()} className={btnPrimary}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Simpan
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: isi data teks/angka/tanggal atas nama pemohon */}
      {filling && (
        <Modal title={`Isi "${filling.label}"`} onClose={() => setFilling(null)}>
          <form onSubmit={submitFill} className="space-y-4">
            {fillError && (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {fillError}
              </div>
            )}

            <div>
              <label htmlFor="fill-value" className="mb-2 block text-sm font-bold text-gray-900">
                {filling.label}
              </label>
              {filling.field_type === "textarea" ? (
                <textarea id="fill-value" rows={4} maxLength={5000} value={fillValue} onChange={(e) => setFillValue(e.target.value)} className={`${inputCls} h-auto resize-none py-3`} />
              ) : (
                <input
                  id="fill-value"
                  type={filling.field_type === "number" ? "number" : filling.field_type === "date" ? "date" : "text"}
                  maxLength={255}
                  value={fillValue}
                  onChange={(e) => setFillValue(e.target.value)}
                  className={inputCls}
                />
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setFilling(null)} className={btnGhost}>
                Batal
              </button>
              <button type="submit" disabled={fillSaving || !fillValue.trim()} className={btnPrimary}>
                {fillSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                Simpan
              </button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}
