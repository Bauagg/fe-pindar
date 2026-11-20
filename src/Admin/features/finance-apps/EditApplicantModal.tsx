import React, { useState } from "react";
import { apiJson, errorMessage, inputCls } from "./shared";
import type { ModuleConfig } from "./config";
import type { Application } from "./types";
import { Alert, Label, Modal, btnGhost, btnPrimary } from "./ui-parts";

export default function EditApplicantModal({ config, app, onClose, onSaved }: { config: ModuleConfig; app: Application; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({
    applicant_name: app.applicant.name ?? "",
    applicant_phone: app.applicant.phone ?? "",
    birth_place: app.applicant.birth_place ?? "",
    birth_date: (app.applicant.birth_date ?? "").slice(0, 10),
    applicant_address: app.applicant.address ?? "",
    company_name: app.company?.name ?? "",
    company_address: app.company?.address ?? "",
    product: app[config.productKey] ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const body: Record<string, string> = {
      applicant_name: f.applicant_name.trim(),
      applicant_phone: f.applicant_phone.trim(),
      birth_place: f.birth_place.trim(),
      birth_date: f.birth_date,
      applicant_address: f.applicant_address.trim(),
      [config.productKey]: f.product.trim(),
    };
    if (config.hasCompany) {
      body.company_name = f.company_name.trim();
      body.company_address = f.company_address.trim();
    }

    try {
      await apiJson(`${config.api.admin}/${app.id}/applicant`, "PUT", body);
      onSaved();
      onClose();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      wide
      title="Ubah data pemohon"
      onClose={onClose}
      footer={
        <>
          <button type="button" className={btnGhost} onClick={onClose}>
            Batal
          </button>
          <button type="submit" form="edit-applicant-form" className={btnPrimary} disabled={saving}>
            {saving ? "Menyimpan…" : "Simpan"}
          </button>
        </>
      }>
      <form id="edit-applicant-form" onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        {error && (
          <div className="sm:col-span-2">
            <Alert>{error}</Alert>
          </div>
        )}
        <Label text="Nama sesuai KTP">
          <input required minLength={3} maxLength={150} value={f.applicant_name} onChange={set("applicant_name")} className={inputCls} />
        </Label>
        <Label text="No. telepon / WA">
          <input required inputMode="tel" value={f.applicant_phone} onChange={set("applicant_phone")} placeholder="081234567890" className={inputCls} />
        </Label>
        <Label text="Tempat lahir">
          <input required maxLength={100} value={f.birth_place} onChange={set("birth_place")} className={inputCls} />
        </Label>
        <Label text="Tanggal lahir">
          <input required type="date" max={new Date().toISOString().slice(0, 10)} value={f.birth_date} onChange={set("birth_date")} className={inputCls} />
        </Label>
        <div className="sm:col-span-2">
          <Label text={config.addressLabel}>
            <textarea required minLength={10} maxLength={500} rows={3} value={f.applicant_address} onChange={set("applicant_address")} className={inputCls} />
          </Label>
        </div>
        {config.hasCompany && (
          <>
            <Label text="Nama perusahaan">
              <input required maxLength={150} value={f.company_name} onChange={set("company_name")} className={inputCls} />
            </Label>
            <div className="sm:col-span-2">
              <Label text="Alamat kantor">
                <textarea required minLength={10} maxLength={500} rows={3} value={f.company_address} onChange={set("company_address")} className={inputCls} />
              </Label>
            </div>
          </>
        )}
        <Label text={config.productLabel}>
          <input required maxLength={150} value={f.product} onChange={set("product")} placeholder={config.productPlaceholder} className={inputCls} />
        </Label>
      </form>
    </Modal>
  );
}
