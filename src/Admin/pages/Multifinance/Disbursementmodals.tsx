import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, CalendarDays, CheckCircle2, ExternalLink, Loader2, Pencil, Search, Trash2, Wallet, X } from "lucide-react";
import { api, errorMessage } from "../../api";
import type { StatusKey } from "../../types";
import Modal from "../../components/ModalDis";
import StatusBadge from "../../components/StatusBadge";
import { inputCls } from "../../components/ui";
import { dateOnly, fmtDateTime, fmtDay, rupiah, serviceLabel, todayISO } from "../../../utils/Utils";
import type { ApprovedApplication, Disbursement } from "../../../utils/Utils";

const API = "/admin/disbursement-multifinance";

const labelCls = "mb-1.5 block text-sm font-bold text-gray-700";

/** Simpan data terakhir yang tidak null, supaya isi popup tidak kosong saat animasi tutup */
function useLast<T>(value: T | null): T | null {
  const ref = useRef<T | null>(value);
  if (value) ref.current = value;
  return value ?? ref.current;
}

/* ================================================================== */
/* 1. TAMBAH / EDIT                                                    */
/* ================================================================== */

type Picked = Pick<ApprovedApplication, "id" | "application_number" | "applicant_name" | "service_type"> & { total_disbursed?: number };

type FormProps = {
  open: boolean;
  /** null = tambah baru, isi = edit */
  item: Disbursement | null;
  onClose: () => void;
  onSaved: (message: string) => void;
};

export function DisbursementFormModal({ open, item, onClose, onSaved }: FormProps) {
  const isEdit = !!item;

  const [selected, setSelected] = useState<Picked | null>(null);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<ApprovedApplication[]>([]);
  const [optLoading, setOptLoading] = useState(false);
  const [optError, setOptError] = useState("");

  const [date, setDate] = useState(todayISO());
  const [digits, setDigits] = useState(""); // nominal, hanya angka
  const [description, setDescription] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Isi ulang form setiap popup dibuka
  useEffect(() => {
    if (!open) return;

    setError("");
    setSearch("");
    setSaving(false);
    setOptLoading(false);
    setOptError("");

    if (item) {
      const a = item.application;
      setSelected({
        id: item.application_id,
        application_number: a?.application_number ?? `#${item.application_id}`,
        applicant_name: a?.applicant_name ?? "-",
        service_type: a?.service_type ?? "",
      });
      setDate(dateOnly(item.disbursement_date));
      setDigits(String(Math.round(Number(item.amount) || 0)));
      setDescription(item.description ?? "");
    } else {
      setSelected(null);
      setDate(todayISO());
      setDigits("");
      setDescription("");
    }
  }, [open, item]);

  // Cari pengajuan approved (hanya saat belum ada yang dipilih)
  useEffect(() => {
    if (!open || selected) return;

    let alive = true;
    setOptLoading(true);
    setOptError("");

    const t = window.setTimeout(
      () => {
        const qs = new URLSearchParams();
        if (search.trim()) qs.set("search", search.trim());

        api<{ data: ApprovedApplication[] }>(`${API}/approved-applications?${qs}`)
          .then((r) => alive && setOptions(r.data))
          .catch((e) => alive && setOptError(errorMessage(e)))
          .finally(() => alive && setOptLoading(false));
      },
      search ? 300 : 0
    );

    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, [open, selected, search]);

  const amount = Number(digits || 0);
  const valid = !!selected && !!date && amount >= 1;

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!valid || saving || !selected) return;

    setSaving(true);
    setError("");

    try {
      await api(isEdit ? `${API}/${item!.id}` : API, {
        method: isEdit ? "PUT" : "POST",
        body: {
          application_id: selected.id,
          disbursement_date: date,
          amount,
          description: description.trim() || null,
        },
      });

      onSaved(isEdit ? "Data pencairan berhasil diperbarui." : "Pencairan berhasil dicatat.");
      onClose();
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      locked={saving}
      size="md"
      icon={<Wallet className="h-5 w-5" />}
      title={isEdit ? "Edit pencairan" : "Catat pencairan"}
      subtitle={isEdit ? "Perbarui data pencairan yang sudah dicatat." : "Pilih pengajuan yang sudah disetujui lalu isi nominalnya."}
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} disabled={saving} className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-gray-600 ring-1 ring-gray-200 transition hover:bg-gray-50 disabled:opacity-50">
            Batal
          </button>
          <button
            type="submit"
            form="disbursement-form"
            disabled={!valid || saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-red-200 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? "Simpan perubahan" : "Simpan pencairan"}
          </button>
        </div>
      }>
      <form id="disbursement-form" onSubmit={submit} className="space-y-5">
        {/* Pengajuan */}
        <div>
          <span className={labelCls}>
            Pengajuan <span className="text-red-600">*</span>
          </span>

          {selected ? (
            <div className="flex items-start gap-3 rounded-2xl bg-emerald-50 p-3.5 ring-1 ring-emerald-200">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold text-gray-900">{selected.application_number}</p>
                <p className="truncate text-sm font-semibold text-gray-600">{selected.applicant_name}</p>
                <p className="mt-0.5 text-xs font-semibold text-gray-400">
                  {serviceLabel(selected.service_type)}
                  {typeof selected.total_disbursed === "number" && <> · Sudah dicairkan {rupiah(selected.total_disbursed)}</>}
                </p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50">
                Ganti
              </button>
            </div>
          ) : (
            <div className="rounded-2xl ring-1 ring-gray-200">
              <div className="relative border-b border-gray-100">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  data-autofocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari no. pengajuan atau nama pemohon"
                  aria-label="Cari pengajuan approved"
                  className="w-full rounded-t-2xl bg-transparent py-3 pl-11 pr-4 text-sm font-semibold text-gray-800 outline-none placeholder:font-medium placeholder:text-gray-400"
                />
              </div>

              <ul className="max-h-56 overflow-y-auto p-1.5" role="listbox" aria-label="Pengajuan approved">
                {optLoading ? (
                  <li className="flex justify-center py-6">
                    <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                  </li>
                ) : optError ? (
                  <li className="px-3 py-4 text-sm font-semibold text-red-600">{optError}</li>
                ) : options.length === 0 ? (
                  <li className="px-3 py-6 text-center text-sm text-gray-500">{search ? "Tidak ada pengajuan approved yang cocok." : "Belum ada pengajuan berstatus approved."}</li>
                ) : (
                  options.map((o) => (
                    <li key={o.id} role="option" aria-selected={false}>
                      <button
                        type="button"
                        onClick={() => setSelected(o)}
                        className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none">
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-extrabold text-gray-900">{o.application_number}</span>
                          <span className="block truncate text-xs font-semibold text-gray-500">
                            {o.applicant_name} · {serviceLabel(o.service_type)}
                          </span>
                        </span>
                        {o.total_disbursed > 0 && <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">{rupiah(o.total_disbursed)}</span>}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Tanggal & nominal */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="d-date" className={labelCls}>
              Tanggal pencairan <span className="text-red-600">*</span>
            </label>
            <input id="d-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={inputCls} />
          </div>

          <div>
            <label htmlFor="d-amount" className={labelCls}>
              Nominal <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">Rp</span>
              <input
                id="d-amount"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={digits ? Number(digits).toLocaleString("id-ID") : ""}
                onChange={(e) => setDigits(e.target.value.replace(/\D/g, "").slice(0, 15))}
                placeholder="0"
                required
                className={`${inputCls} pl-11 font-bold`}
              />
            </div>
          </div>
        </div>

        {/* Keterangan */}
        <div>
          <label htmlFor="d-desc" className={labelCls}>
            Keterangan <span className="font-medium text-gray-400">(opsional)</span>
          </label>
          <textarea id="d-desc" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={5000} rows={3} placeholder="Mis. pencairan tahap 1, transfer ke rekening pemohon" className={`${inputCls} resize-y`} />
          <p className="mt-1 text-right text-xs font-semibold text-gray-400">{description.length}/5000</p>
        </div>

        {error && (
          <p role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 px-3.5 py-3 text-sm font-semibold text-red-700">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}

/* ================================================================== */
/* 2. DETAIL                                                           */
/* ================================================================== */

type DetailProps = {
  item: Disbursement | null;
  onClose: () => void;
  onEdit: (item: Disbursement) => void;
  onDelete: (item: Disbursement) => void;
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</dt>
      <dd className="mt-1 break-words text-sm font-semibold text-gray-800">{children}</dd>
    </div>
  );
}

export function DisbursementDetailModal({ item, onClose, onEdit, onDelete }: DetailProps) {
  const d = useLast(item);
  const app = d?.application;

  return (
    <Modal
      open={!!item}
      onClose={onClose}
      size="md"
      icon={<Wallet className="h-5 w-5" />}
      title="Detail pencairan"
      subtitle={app ? app.application_number : undefined}
      footer={
        d && (
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => onDelete(d)}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-red-600 ring-1 ring-red-200 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
              <Trash2 className="h-4 w-4" /> Hapus
            </button>

            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <button type="button" onClick={onClose} className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-gray-600 ring-1 ring-gray-200 transition hover:bg-gray-50">
                Tutup
              </button>
              <button type="button" onClick={() => onEdit(d)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-red-200 transition hover:bg-red-700">
                <Pencil className="h-4 w-4" /> Edit
              </button>
            </div>
          </div>
        )
      }>
      {d && (
        <div className="space-y-5">
          {/* Nominal */}
          <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 p-5 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-100">Nominal pencairan</p>
            <p className="mt-1.5 break-words text-3xl font-extrabold">{rupiah(d.amount)}</p>
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
              <CalendarDays className="h-3.5 w-3.5" />
              {fmtDay(d.disbursement_date)}
            </p>
          </div>

          {/* Pengajuan */}
          <dl className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
            <Field label="No. pengajuan">
              {app ? (
                <Link to={`/admin/multi-finance/applications/${app.id}`} className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 hover:underline">
                  {app.application_number}
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              ) : (
                `#${d.application_id}`
              )}
            </Field>
            <Field label="Status pengajuan">{app ? <StatusBadge value={app.status as StatusKey} /> : "-"}</Field>
            <Field label="Pemohon">{app?.applicant_name || "-"}</Field>
            <Field label="Telepon">{app?.applicant_phone || "-"}</Field>
            <Field label="Layanan">{serviceLabel(app?.service_type)}</Field>
            <Field label="Role penerima">
              {app?.roles && app.roles.length > 0 ? (
                <span className="flex flex-wrap gap-1.5">
                  {app.roles.map((r) => (
                    <span key={r.id} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-gray-600">
                      {r.name}
                    </span>
                  ))}
                </span>
              ) : (
                "-"
              )}
            </Field>
          </dl>

          {/* Keterangan */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Keterangan</p>
            <p className="mt-1.5 whitespace-pre-wrap break-words rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">{d.description?.trim() || <span className="text-gray-400">Tidak ada keterangan.</span>}</p>
          </div>

          {/* Audit */}
          <dl className="grid gap-x-5 gap-y-4 border-t border-gray-100 pt-4 sm:grid-cols-2">
            <Field label="Dicatat oleh">{d.creator?.name || "-"}</Field>
            <Field label="Dicatat pada">{fmtDateTime(d.created_at)}</Field>
            {d.updated_at && d.updated_at !== d.created_at && <Field label="Terakhir diperbarui">{fmtDateTime(d.updated_at)}</Field>}
          </dl>
        </div>
      )}
    </Modal>
  );
}

/* ================================================================== */
/* 3. HAPUS                                                            */
/* ================================================================== */

type DeleteProps = {
  item: Disbursement | null;
  onClose: () => void;
  onDeleted: (message: string) => void;
};

export function DisbursementDeleteModal({ item, onClose, onDeleted }: DeleteProps) {
  const d = useLast(item);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (item) {
      setError("");
      setDeleting(false);
    }
  }, [item]);

  const remove = async () => {
    if (!d) return;

    setDeleting(true);
    setError("");

    try {
      await api(`${API}/${d.id}`, { method: "DELETE" });
      onDeleted("Pencatatan pencairan berhasil dihapus.");
    } catch (e) {
      setError(errorMessage(e));
      setDeleting(false);
    }
  };

  return (
    <Modal
      open={!!item}
      onClose={onClose}
      locked={deleting}
      size="sm"
      icon={<Trash2 className="h-5 w-5" />}
      title="Hapus pencairan?"
      subtitle="Tindakan ini tidak bisa dibatalkan."
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} disabled={deleting} data-autofocus className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-gray-600 ring-1 ring-gray-200 transition hover:bg-gray-50 disabled:opacity-50">
            Batal
          </button>
          <button
            type="button"
            onClick={remove}
            disabled={deleting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-red-200 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">
            {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
            Ya, hapus
          </button>
        </div>
      }>
      {d && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
            <p className="text-xs font-bold uppercase tracking-wider text-red-400">Yang akan dihapus</p>
            <p className="mt-1.5 text-2xl font-extrabold text-gray-900">{rupiah(d.amount)}</p>
            <p className="mt-1 text-sm font-semibold text-gray-600">
              {d.application?.application_number ?? `#${d.application_id}`}
              {d.application?.applicant_name && <> · {d.application.applicant_name}</>}
            </p>
            <p className="mt-0.5 text-xs font-semibold text-gray-400">{fmtDay(d.disbursement_date)}</p>
          </div>

          <p className="text-sm text-gray-500">Total pencairan di summary akan ikut berkurang. Pengajuannya sendiri tidak terhapus.</p>

          {error && (
            <p role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 px-3.5 py-3 text-sm font-semibold text-red-700">
              <X className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}
