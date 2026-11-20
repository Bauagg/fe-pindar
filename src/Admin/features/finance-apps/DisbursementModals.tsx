import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { api, apiJson, errorMessage, inputCls } from "./shared";
import type { ModuleConfig } from "./config";
import type { ApprovedOption, Disbursement } from "./types";
import { fmtDateTime, fmtDay, rupiah, today } from "./format";
import { Alert, Info, Label, Modal, btnDanger, btnGhost, btnPrimary } from "./ui-parts";

const productOf = (c: ModuleConfig, a?: { card_name?: string; bank_name?: string } | null) => (a ? a[c.productKey] : undefined);

/* ------------------------------------------------------------------ */
/* Form catat / ubah pencairan                                         */
/* ------------------------------------------------------------------ */
export function DisbursementFormModal({ config, open, item, onClose, onSaved }: { config: ModuleConfig; open: boolean; item: Disbursement | null; onClose: () => void; onSaved: (msg: string) => void }) {
  const [appId, setAppId] = useState<number | "">("");
  const [picked, setPicked] = useState<string>("");
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<ApprovedOption[]>([]);
  const [date, setDate] = useState(today());
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Isi ulang form saat dibuka
  useEffect(() => {
    if (!open) return;
    setError("");
    setSearch("");
    if (item) {
      setAppId(item.application_id);
      setPicked(`${item.application?.application_number ?? `#${item.application_id}`} · ${item.application?.applicant_name ?? ""}`);
      setDate(item.disbursement_date.slice(0, 10));
      setAmount(String(Number(item.amount)));
      setDescription(item.description ?? "");
    } else {
      setAppId("");
      setPicked("");
      setDate(today());
      setAmount("");
      setDescription("");
    }
  }, [open, item]);

  // Cari pengajuan approved (tunda 300ms)
  useEffect(() => {
    if (!open) return;
    let alive = true;
    const t = setTimeout(() => {
      const qs = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : "";
      api<{ data: ApprovedOption[] }>(`${config.api.disbursement}/approved-applications${qs}`)
        .then((r) => alive && setOptions(r.data))
        .catch((e) => alive && setError(errorMessage(e)));
    }, 300);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [open, search, config.api.disbursement]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (appId === "") return setError("Pilih pengajuan terlebih dahulu.");
    setSaving(true);
    setError("");
    try {
      const body = { application_id: appId, disbursement_date: date, amount: Number(amount), description: description.trim() || null };
      if (item) await apiJson(`${config.api.disbursement}/${item.id}`, "PUT", body);
      else await apiJson(config.api.disbursement, "POST", body);
      onSaved(item ? "Data pencairan diperbarui." : "Pencairan berhasil dicatat.");
      onClose();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      wide
      title={item ? "Ubah pencairan" : "Catat pencairan"}
      onClose={onClose}
      footer={
        <>
          <button type="button" className={btnGhost} onClick={onClose}>
            Batal
          </button>
          <button type="submit" form="disbursement-form" className={btnPrimary} disabled={saving}>
            {saving ? "Menyimpan…" : "Simpan"}
          </button>
        </>
      }>
      <form id="disbursement-form" onSubmit={submit} className="space-y-4">
        {error && <Alert>{error}</Alert>}

        <Label text="Pengajuan (hanya yang Approved)">
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari no. pengajuan / nama / produk" className={inputCls} />
        </Label>

        {picked && (
          <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">
            Dipilih: {picked}
          </p>
        )}

        <ul className="max-h-48 space-y-1 overflow-y-auto rounded-xl border border-gray-100 p-1.5" role="listbox" aria-label="Daftar pengajuan approved">
          {options.length === 0 ? (
            <li className="px-3 py-4 text-center text-sm text-gray-500">Tidak ada pengajuan Approved yang cocok.</li>
          ) : (
            options.map((o) => (
              <li key={o.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={appId === o.id}
                  onClick={() => {
                    setAppId(o.id);
                    setPicked(`${o.application_number} · ${o.applicant_name}`);
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50 ${appId === o.id ? "bg-gray-50 ring-1 ring-red-200" : ""}`}>
                  <span className="min-w-0">
                    <span className="block truncate font-bold text-gray-900">{o.application_number}</span>
                    <span className="block truncate text-xs text-gray-500">
                      {o.applicant_name} · {productOf(config, o) || "-"}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-gray-400">Dicairkan {rupiah(o.total_disbursed)}</span>
                </button>
              </li>
            ))
          )}
        </ul>

        <div className="grid gap-4 sm:grid-cols-2">
          <Label text="Tanggal pencairan">
            <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
          </Label>
          <Label text="Nominal (Rp)">
            <input required type="number" min="0.01" step="0.01" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputCls} />
          </Label>
        </div>

        <Label text="Keterangan (opsional)">
          <textarea rows={3} maxLength={5000} value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} />
        </Label>
      </form>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Detail                                                              */
/* ------------------------------------------------------------------ */
export function DisbursementDetailModal({ config, item, onClose, onEdit, onDelete }: { config: ModuleConfig; item: Disbursement | null; onClose: () => void; onEdit: (d: Disbursement) => void; onDelete: (d: Disbursement) => void }) {
  return (
    <Modal
      open={!!item}
      title="Detail pencairan"
      onClose={onClose}
      footer={
        item && (
          <>
            <button type="button" className={btnGhost} onClick={() => onEdit(item)}>
              <Pencil className="h-4 w-4" /> Ubah
            </button>
            <button type="button" className={btnDanger} onClick={() => onDelete(item)}>
              <Trash2 className="h-4 w-4" /> Hapus
            </button>
          </>
        )
      }>
      {item && (
        <dl className="grid gap-5 sm:grid-cols-2">
          <Info label="Tanggal pencairan">{fmtDay(item.disbursement_date)}</Info>
          <Info label="Nominal">
            <span className="text-lg font-extrabold">{rupiah(item.amount)}</span>
          </Info>
          <Info label="No. pengajuan">{item.application?.application_number}</Info>
          <Info label="Pemohon">{item.application?.applicant_name}</Info>
          <Info label={config.productLabel}>{productOf(config, item.application)}</Info>
          <Info label="Dicatat oleh">{item.creator?.name}</Info>
          <Info label="Keterangan" wide>
            <span className="whitespace-pre-line">{item.description?.trim()}</span>
          </Info>
          <Info label="Dicatat pada">{fmtDateTime((item as unknown as { created_at?: string }).created_at)}</Info>
        </dl>
      )}
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Hapus                                                               */
/* ------------------------------------------------------------------ */
export function DisbursementDeleteModal({ config, item, onClose, onDeleted }: { config: ModuleConfig; item: Disbursement | null; onClose: () => void; onDeleted: (msg: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setError(""), [item]);

  const confirm = async () => {
    if (!item) return;
    setBusy(true);
    setError("");
    try {
      await apiJson(`${config.api.disbursement}/${item.id}`, "DELETE");
      onDeleted("Pencatatan pencairan dihapus.");
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={!!item}
      title="Hapus pencairan?"
      onClose={onClose}
      footer={
        <>
          <button type="button" className={btnGhost} onClick={onClose}>
            Batal
          </button>
          <button type="button" className={btnDanger} onClick={confirm} disabled={busy}>
            {busy ? "Menghapus…" : "Ya, hapus"}
          </button>
        </>
      }>
      {item && (
        <div className="space-y-3">
          {error && <Alert>{error}</Alert>}
          <p className="text-sm text-gray-600">
            Pencairan <b>{rupiah(item.amount)}</b> untuk <b>{item.application?.application_number}</b> pada {fmtDay(item.disbursement_date)} akan dihapus permanen.
          </p>
        </div>
      )}
    </Modal>
  );
}
