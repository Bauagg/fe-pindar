import React, { useEffect, useState } from "react";
import { FileText, Plus, Save, ShieldCheck, Trash2, Upload, BadgeCheck, ListChecks, Pencil, X, Undo2, Share2 } from "lucide-react";
import { FieldValue, StatusBadge, STATUS, api, apiForm, apiJson, card, errorMessage, inputCls } from "./shared";
import type { ModuleConfig } from "./config";
import type { Application, ApprovalInfo, FieldType, Role, StatusKey } from "./types";
import { Alert, CardTitle, Label, Spinner, btnGhost, btnPrimary } from "./ui-parts";

type PanelProps = { config: ModuleConfig; app: Application; onChanged: () => void };

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: "text", label: "Teks singkat" },
  { value: "textarea", label: "Teks panjang" },
  { value: "number", label: "Angka" },
  { value: "date", label: "Tanggal" },
  { value: "file", label: "File (pdf/jpg/png, maks 15 MB)" },
];

/* ------------------------------------------------------------------ */
/* Status                                                              */
/* ------------------------------------------------------------------ */
export function StatusPanel({ config, app, onChanged }: PanelProps) {
  const [status, setStatus] = useState<StatusKey>(app.status.value);
  const [rejected, setRejected] = useState(app.status.rejected_reason ?? "");
  const [correction, setCorrection] = useState(app.status.correction_reason ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  useEffect(() => {
    setStatus(app.status.value);
    setRejected(app.status.rejected_reason ?? "");
    setCorrection(app.status.correction_reason ?? "");
  }, [app.updated_at, app.status.value, app.status.rejected_reason, app.status.correction_reason]);

  const needReason = (status === "rejected" && !rejected.trim()) || (status === "correction" && !correction.trim());

  const save = async () => {
    setSaving(true);
    setError("");
    setOk(false);
    try {
      await apiJson(`${config.api.admin}/${app.id}/status`, "PUT", {
        status,
        rejected_reason: status === "rejected" ? rejected.trim() : null,
        correction_reason: status === "correction" ? correction.trim() : null,
      });
      setOk(true);
      onChanged();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={`${card} p-5`}>
      <CardTitle icon={ListChecks} title="Status pengajuan" tone="bg-amber-50 text-amber-600" right={<StatusBadge value={app.status.value} />} />

      <div className="mt-4 space-y-3">
        <Label text="Ubah status">
          <select value={status} onChange={(e) => setStatus(e.target.value as StatusKey)} className={inputCls}>
            {Object.keys(STATUS).map((k) => (
              <option key={k} value={k}>
                {STATUS[k].label}
              </option>
            ))}
          </select>
        </Label>

        {status === "rejected" && (
          <Label text="Alasan penolakan (wajib)">
            <textarea rows={3} maxLength={2000} value={rejected} onChange={(e) => setRejected(e.target.value)} className={inputCls} />
          </Label>
        )}
        {status === "correction" && (
          <Label text="Alasan koreksi (wajib)">
            <textarea rows={3} maxLength={2000} value={correction} onChange={(e) => setCorrection(e.target.value)} className={inputCls} />
          </Label>
        )}

        {error && <Alert>{error}</Alert>}
        {ok && <p className="text-sm font-semibold text-emerald-600">Status berhasil diperbarui.</p>}

        <button type="button" onClick={save} disabled={saving || needReason} className={`${btnPrimary} w-full`}>
          <Save className="h-4 w-4" />
          {saving ? "Menyimpan…" : "Simpan status"}
        </button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Akses role                                                          */
/* ------------------------------------------------------------------ */
export function RolesPanel({ config, app, onChanged }: PanelProps) {
  const [roles, setRoles] = useState<Role[] | null>(null);
  const [picked, setPicked] = useState<number[]>(app.roles.map((r) => r.id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let alive = true;
    api<{ data: Role[] }>(`${config.api.admin}/roles`)
      .then((r) => alive && setRoles(r.data))
      .catch((e) => alive && setError(errorMessage(e)));
    return () => {
      alive = false;
    };
  }, [config.api.admin]);

  useEffect(() => {
    const ids = app.roles.map((r) => r.id);
    // buang role yang tidak ada di daftar (beda tipe), supaya simpan tidak ditolak
    setPicked(roles ? ids.filter((id) => roles.some((r) => r.id === id)) : ids);
  }, [app.updated_at, app.roles, roles]);

  const toggle = (id: number) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const save = async () => {
    setSaving(true);
    setError("");
    setOk(false);
    try {
      await apiJson(`${config.api.admin}/${app.id}/roles`, "PUT", { role_ids: picked });
      setOk(true);
      onChanged();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={`${card} p-5`}>
      <CardTitle icon={ShieldCheck} title="Akses role" tone="bg-violet-50 text-violet-600" />
      <p className="mt-2 text-xs text-gray-500">Role yang dicentang bisa melihat pengajuan ini.</p>

      {!roles ? (
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      ) : (
        <ul className="mt-3 space-y-1.5">
          {roles.map((r) => (
            <li key={r.id}>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                <input type="checkbox" checked={picked.includes(r.id)} onChange={() => toggle(r.id)} className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                {r.name}
              </label>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <div className="mt-3">
          <Alert>{error}</Alert>
        </div>
      )}
      {ok && <p className="mt-3 text-sm font-semibold text-emerald-600">Akses role diperbarui.</p>}

      <button type="button" onClick={save} disabled={saving || picked.length === 0} className={`${btnPrimary} mt-4 w-full`}>
        <Save className="h-4 w-4" />
        {saving ? "Menyimpan…" : "Simpan akses"}
      </button>
      {picked.length === 0 && <p className="mt-2 text-xs font-semibold text-red-600">Pilih minimal satu role.</p>}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Bagikan ke bidding (hanya super_admin & admin, diatur di halaman)   */
/* ------------------------------------------------------------------ */
export function SharePanel({ config, app, onChanged }: PanelProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  if (!config.biddingShare) return null;

  const shared = Boolean(app.is_shared);

  const toggle = async () => {
    setBusy(true);
    setError("");
    setOk("");
    try {
      await apiJson(`${config.api.admin}/${app.id}/share-bidding`, shared ? "DELETE" : "POST");
      setOk(shared ? "Pengajuan ditarik dari bidding." : "Pengajuan dibagikan ke bidding.");
      onChanged();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className={`${card} p-5`}>
      <CardTitle icon={Share2} title="Bagikan ke bidding" tone="bg-sky-50 text-sky-600" />
      <p className="mt-2 text-sm text-gray-500">{shared ? "Pengajuan ini sudah ada di bidding. Kamu bisa menariknya kembali kapan saja." : "Pengajuan ini belum ada di bidding. Bagikan agar muncul di daftar bidding."}</p>

      {error && (
        <div className="mt-3">
          <Alert>{error}</Alert>
        </div>
      )}
      {ok && <p className="mt-3 text-sm font-semibold text-emerald-600">{ok}</p>}

      {shared ? (
        <button type="button" onClick={toggle} disabled={busy} className={`${btnGhost} mt-4 w-full`}>
          <Undo2 className="h-4 w-4" />
          {busy ? "Memproses…" : "Tarik dari bidding"}
        </button>
      ) : (
        <button type="button" onClick={toggle} disabled={busy} className={`${btnPrimary} mt-4 w-full`}>
          <Share2 className="h-4 w-4" />
          {busy ? "Memproses…" : "Bagikan ke bidding"}
        </button>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Informasi persetujuan (hanya saat Approved)                         */
/* ------------------------------------------------------------------ */
function ApprovalRow({ config, info, onChanged }: { config: ModuleConfig; info: ApprovalInfo; onChanged: () => void }) {
  const [edit, setEdit] = useState(false);
  const [label, setLabel] = useState(info.label);
  const [value, setValue] = useState(info.value ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const isFile = info.field_type === "file";

  const save = async () => {
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("label", label.trim());
      if (isFile) {
        if (file) fd.append("value", file);
      } else fd.append("value", value);
      await apiForm(`${config.api.admin}/approval-infos/${info.id}`, fd);
      setEdit(false);
      setFile(null);
      onChanged();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Hapus informasi "${info.label}"?`)) return;
    setBusy(true);
    try {
      await apiJson(`${config.api.admin}/approval-infos/${info.id}`, "DELETE");
      onChanged();
    } catch (e) {
      setError(errorMessage(e));
      setBusy(false);
    }
  };

  return (
    <li className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
      {edit ? (
        <div className="space-y-2">
          <input value={label} onChange={(e) => setLabel(e.target.value)} maxLength={150} aria-label="Label" className={inputCls} />
          {isFile ? (
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="block w-full text-sm" />
          ) : info.field_type === "textarea" ? (
            <textarea rows={3} value={value} onChange={(e) => setValue(e.target.value)} className={inputCls} />
          ) : (
            <input type={info.field_type === "number" ? "number" : info.field_type === "date" ? "date" : "text"} value={value} onChange={(e) => setValue(e.target.value)} className={inputCls} />
          )}
          {error && <Alert>{error}</Alert>}
          <div className="flex justify-end gap-2">
            <button type="button" className={btnGhost} onClick={() => setEdit(false)}>
              Batal
            </button>
            <button type="button" className={btnPrimary} disabled={busy || !label.trim()} onClick={save}>
              Simpan
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-400">{info.label}</p>
            <div className="mt-0.5 break-words text-sm font-bold text-gray-900">
              <FieldValue type={info.field_type} value={info.value} fileUrl={info.file_url} label={info.label} />
            </div>
            {error && <p className="mt-1 text-xs font-semibold text-red-600">{error}</p>}
          </div>
          <div className="flex shrink-0 gap-1">
            <button type="button" aria-label={`Ubah ${info.label}`} onClick={() => setEdit(true)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
              <Pencil className="h-4 w-4" />
            </button>
            <button type="button" aria-label={`Hapus ${info.label}`} disabled={busy} onClick={remove} className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

export function ApprovalInfoPanel({ config, app, onChanged }: PanelProps) {
  const approved = app.status.value === "approved";
  const infos = app.approval_infos ?? [];

  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [type, setType] = useState<FieldType>("text");
  const [value, setValue] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setLabel("");
    setType("text");
    setValue("");
    setFile(null);
    setError("");
    setOpen(false);
  };

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("label", label.trim());
      fd.append("field_type", type);
      if (type === "file") {
        if (!file) throw new Error("Pilih file terlebih dahulu.");
        fd.append("value", file);
      } else fd.append("value", value);
      await apiForm(`${config.api.admin}/${app.id}/approval-infos`, fd);
      reset();
      onChanged();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={`${card} p-5`}>
      <CardTitle
        icon={BadgeCheck}
        title="Informasi persetujuan"
        tone="bg-emerald-50 text-emerald-600"
        right={
          approved && !open ? (
            <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-red-600 ring-1 ring-red-200 hover:bg-red-50">
              <Plus className="h-3.5 w-3.5" /> Tambah
            </button>
          ) : null
        }
      />

      {!approved && <p className="mt-3 text-sm text-gray-500">Informasi ini bisa diisi saat status pengajuan sudah Approved (contoh: limit, tenor, catatan pencairan).</p>}

      {approved && open && (
        <form onSubmit={add} className="mt-4 space-y-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3">
          <Label text="Label">
            <input required maxLength={150} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="mis. Limit disetujui" className={inputCls} />
          </Label>
          <Label text="Jenis isian">
            <select value={type} onChange={(e) => setType(e.target.value as FieldType)} className={inputCls}>
              {FIELD_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Label>
          <Label text="Isi">
            {type === "file" ? (
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="block w-full text-sm" />
            ) : type === "textarea" ? (
              <textarea required rows={3} maxLength={5000} value={value} onChange={(e) => setValue(e.target.value)} className={inputCls} />
            ) : (
              <input required type={type === "number" ? "number" : type === "date" ? "date" : "text"} maxLength={255} value={value} onChange={(e) => setValue(e.target.value)} className={inputCls} />
            )}
          </Label>
          {error && <Alert>{error}</Alert>}
          <div className="flex justify-end gap-2">
            <button type="button" className={btnGhost} onClick={reset}>
              Batal
            </button>
            <button type="submit" className={btnPrimary} disabled={saving}>
              {saving ? "Menyimpan…" : "Tambah"}
            </button>
          </div>
        </form>
      )}

      {approved && infos.length === 0 && !open && <p className="mt-3 text-sm text-gray-500">Belum ada informasi.</p>}

      {infos.length > 0 && (
        <ul className="mt-4 space-y-2">
          {infos.map((i) => (
            <ApprovalRow key={i.id} config={config} info={i} onChanged={onChanged} />
          ))}
        </ul>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Dokumen / form tambahan                                             */
/* ------------------------------------------------------------------ */
export function FormFieldsPanel({ config, app, onChanged }: PanelProps) {
  const fields = app.form_fields ?? [];
  const [files, setFiles] = useState<Record<string, File>>({});
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState<FieldType>("file");
  const [newRequired, setNewRequired] = useState(false);

  const pending = Object.keys(files).length + (Object.values(texts) as string[]).filter((v) => v.trim()).length;

  const submit = async () => {
    setSaving(true);
    setError("");
    setOk(false);
    try {
      const fd = new FormData();
      (Object.entries(files) as [string, File][]).forEach(([name, f]) => fd.append(name, f));
      (Object.entries(texts) as [string, string][]).forEach(([name, v]) => v.trim() && fd.append(name, v));
      await apiForm(`${config.api.admin}/${app.id}/form-values`, fd);
      setFiles({});
      setTexts({});
      setOk(true);
      onChanged();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const addField = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await apiJson(`${config.api.admin}/${app.id}/fields`, "POST", { label: newLabel.trim(), field_type: newType, is_required: newRequired });
      setNewLabel("");
      setNewType("file");
      setNewRequired(false);
      setAdding(false);
      onChanged();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const removeField = async (id: number, label: string) => {
    if (!window.confirm(`Hapus field "${label}"? Isian yang sudah diunggah ikut terhapus.`)) return;
    setError("");
    try {
      await apiJson(`${config.api.admin}/fields/${id}`, "DELETE");
      onChanged();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <section className={`${card} p-5`}>
      <CardTitle
        icon={FileText}
        title="Dokumen pendukung"
        tone="bg-sky-50 text-sky-600"
        right={
          !adding ? (
            <button type="button" onClick={() => setAdding(true)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-red-600 ring-1 ring-red-200 hover:bg-red-50">
              <Plus className="h-3.5 w-3.5" /> Field
            </button>
          ) : null
        }
      />

      {adding && (
        <form onSubmit={addField} className="mt-4 grid gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3 sm:grid-cols-2">
          <Label text="Label field">
            <input required maxLength={150} value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="mis. Rekening koran" className={inputCls} />
          </Label>
          <Label text="Jenis">
            <select value={newType} onChange={(e) => setNewType(e.target.value as FieldType)} className={inputCls}>
              {FIELD_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Label>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 sm:col-span-2">
            <input type="checkbox" checked={newRequired} onChange={(e) => setNewRequired(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />
            Wajib diisi pemohon
          </label>
          <div className="flex justify-end gap-2 sm:col-span-2">
            <button type="button" className={btnGhost} onClick={() => setAdding(false)}>
              <X className="h-4 w-4" /> Batal
            </button>
            <button type="submit" className={btnPrimary}>
              Tambah field
            </button>
          </div>
        </form>
      )}

      {fields.length === 0 ? (
        <p className="mt-3 text-sm text-gray-500">Belum ada field dokumen.</p>
      ) : (
        <ul className="mt-4 divide-y divide-gray-100">
          {fields.map((f) => {
            const filled = f.field_type === "file" ? Boolean(f.file_url) : Boolean(f.value);
            return (
              <li key={f.id} className="py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900">
                      {f.label}
                      {f.is_required && <span className="ml-1 text-red-600">*</span>}
                    </p>
                    <div className="mt-1 text-sm text-gray-600">{filled ? <FieldValue type={f.field_type} value={f.value} fileUrl={f.file_url} label={f.label} /> : <span className="text-gray-400">Belum diisi</span>}</div>
                  </div>
                  <button type="button" aria-label={`Hapus field ${f.label}`} onClick={() => removeField(f.id, f.label)} className="shrink-0 rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-2">
                  {f.field_type === "file" ? (
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50">
                      <Upload className="h-3.5 w-3.5" />
                      {files[f.name] ? files[f.name].name : filled ? "Ganti file" : "Pilih file"}
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          setFiles((p) => {
                            const n = { ...p };
                            if (file) n[f.name] = file;
                            else delete n[f.name];
                            return n;
                          });
                        }}
                      />
                    </label>
                  ) : f.field_type === "textarea" ? (
                    <textarea rows={2} placeholder={f.value ?? "Isi baru…"} value={texts[f.name] ?? ""} onChange={(e) => setTexts((p) => ({ ...p, [f.name]: e.target.value }))} className={inputCls} />
                  ) : (
                    <input
                      type={f.field_type === "number" ? "number" : f.field_type === "date" ? "date" : "text"}
                      placeholder={f.value ?? "Isi baru…"}
                      value={texts[f.name] ?? ""}
                      onChange={(e) => setTexts((p) => ({ ...p, [f.name]: e.target.value }))}
                      className={inputCls}
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {error && (
        <div className="mt-3">
          <Alert>{error}</Alert>
        </div>
      )}
      {ok && <p className="mt-3 text-sm font-semibold text-emerald-600">Dokumen berhasil disimpan.</p>}

      {fields.length > 0 && (
        <button type="button" onClick={submit} disabled={saving || pending === 0} className={`${btnPrimary} mt-4`}>
          <Save className="h-4 w-4" />
          {saving ? "Menyimpan…" : pending ? `Simpan ${pending} isian` : "Simpan isian"}
        </button>
      )}
    </section>
  );
}
