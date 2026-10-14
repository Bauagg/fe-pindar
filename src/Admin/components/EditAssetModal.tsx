import React, { useMemo, useState } from "react";
import { Bike, Car, Home } from "lucide-react";
import { errorMessage } from "../api";
import EditModal, { Field, Segmented } from "./EditModal";
import { updateAsset, type AssetPayload } from "./editApi";
import { inputCls } from "./ui";
import type { Application } from "../types";

interface Props {
  app: Application;
  onClose: () => void;
  onSaved: () => void;
}

const OWNERSHIP = [
  { value: "sendiri", label: "Atas nama sendiri" },
  { value: "orang_lain", label: "Atas nama orang lain" },
] as const;

const VEHICLE_TYPES = [
  { value: "mobil", label: "Mobil" },
  { value: "motor", label: "Motor" },
] as const;

const TRANSMISSIONS = [
  { value: "matic", label: "Matic" },
  { value: "manual", label: "Manual" },
] as const;

const FINANCING = [
  { value: "bpkb_on_hand", label: "BPKB On Hand" },
  { value: "take_over", label: "Take Over" },
] as const;

export default function EditAssetModal({ app, onClose, onSaved }: Props) {
  const isShm = !!app.asset?.is_shm;
  const v = app.vehicle;

  const [form, setForm] = useState({
    ownership: app.asset?.ownership ?? "",
    certificate: app.asset?.certificate_type ?? "",
    type: v?.type ?? "",
    brand: v?.brand ?? "",
    model: v?.model ?? "",
    year: v?.year ? String(v.year) : "",
    transmission: v?.transmission ?? "",
    financing: v?.financing_status ?? "",
    leasing: v?.previous_leasing ?? "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof typeof form>(k: K, val: (typeof form)[K]) => setForm((p) => ({ ...p, [k]: val }));

  const years = useMemo(() => {
    const now = new Date().getFullYear() + 1;
    const list = Array.from({ length: now - 1989 }, (_, i) => String(now - i));
    return form.year && !list.includes(form.year) ? [form.year, ...list] : list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isTakeOver = !isShm && form.financing === "take_over";

  const errors = useMemo(() => {
    const e: Partial<Record<keyof typeof form, string>> = {};
    if (!form.ownership) e.ownership = isShm ? "Pilih SHM atas nama siapa." : "Pilih BPKB atas nama siapa.";

    if (isShm) {
      if (form.certificate.trim().length < 3) e.certificate = "Contoh: Tanah, Rumah, Bangunan.";
    } else {
      if (!form.type) e.type = "Pilih mobil atau motor.";
      if (form.brand.trim().length < 2) e.brand = "Isi merek kendaraan.";
      if (form.model.trim().length < 1) e.model = "Isi tipe kendaraan.";
      if (!form.year) e.year = "Pilih tahun.";
      if (!form.transmission) e.transmission = "Pilih transmisi.";
      if (!form.financing) e.financing = "Pilih status BPKB.";
      if (isTakeOver && form.leasing.trim().length < 2) e.leasing = "Isi leasing asal take over.";
    }
    return e;
  }, [form, isShm, isTakeOver]);

  const show = (k: keyof typeof form) => (submitted ? errors[k] : undefined);
  const cls = (k: keyof typeof form) => `${inputCls} ${show(k) ? "!border-red-400" : ""}`;

  const submit = async () => {
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;

    const payload: AssetPayload = isShm
      ? { asset_ownership: form.ownership, certificate_type: form.certificate.trim() }
      : {
          asset_ownership: form.ownership,
          vehicle_type: form.type,
          vehicle_brand: form.brand.trim(),
          vehicle_model: form.model.trim(),
          vehicle_year: Number(form.year),
          transmission: form.transmission,
          financing_status: form.financing,
          previous_leasing: isTakeOver ? form.leasing.trim() : null,
        };

    setSaving(true);
    setError("");
    try {
      await updateAsset(app.id, payload);
      onSaved();
      onClose();
    } catch (e) {
      setError(errorMessage(e));
      setSaving(false);
    }
  };

  const Icon = isShm ? Home : form.type === "motor" ? Bike : Car;

  return (
    <EditModal
      title={isShm ? "Edit jaminan SHM" : "Edit jaminan kendaraan"}
      subtitle={app.application_number}
      icon={Icon}
      tone={isShm ? "bg-indigo-50 text-indigo-600" : "bg-red-50 text-red-600"}
      saving={saving}
      error={error}
      onClose={onClose}
      onSubmit={submit}>
      <Field label={isShm ? "SHM atas nama" : "BPKB atas nama"} error={show("ownership")} wide>
        <Segmented options={OWNERSHIP} value={form.ownership} onChange={(val) => set("ownership", val)} />
      </Field>

      {isShm ? (
        <Field label="Jenis surat SHM" htmlFor="a-cert" error={show("certificate")} wide>
          <input id="a-cert" value={form.certificate} onChange={(e) => set("certificate", e.target.value)} placeholder="Contoh: Tanah, Rumah, Bangunan" className={cls("certificate")} />
        </Field>
      ) : (
        <>
          <Field label="Jenis kendaraan" error={show("type")} wide>
            <Segmented options={VEHICLE_TYPES} value={form.type} onChange={(val) => set("type", val)} />
          </Field>

          <Field label="Merek" htmlFor="a-brand" error={show("brand")}>
            <input id="a-brand" value={form.brand} onChange={(e) => set("brand", e.target.value)} className={cls("brand")} />
          </Field>

          <Field label="Tipe" htmlFor="a-model" error={show("model")}>
            <input id="a-model" value={form.model} onChange={(e) => set("model", e.target.value)} className={cls("model")} />
          </Field>

          <Field label="Tahun" htmlFor="a-year" error={show("year")}>
            <select id="a-year" value={form.year} onChange={(e) => set("year", e.target.value)} className={cls("year")}>
              <option value="">Pilih tahun</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Transmisi" error={show("transmission")}>
            <Segmented options={TRANSMISSIONS} value={form.transmission} onChange={(val) => set("transmission", val)} />
          </Field>

          <Field label="Status BPKB" error={show("financing")} wide>
            <Segmented
              options={FINANCING}
              value={form.financing}
              onChange={(val) => {
                set("financing", val);
                if (val !== "take_over") set("leasing", "");
              }}
            />
          </Field>

          {isTakeOver && (
            <Field label="Take over dari leasing" htmlFor="a-leasing" error={show("leasing")} wide>
              <input id="a-leasing" value={form.leasing} onChange={(e) => set("leasing", e.target.value)} placeholder="Contoh: Adira, BFI, FIF" className={cls("leasing")} />
            </Field>
          )}
        </>
      )}
    </EditModal>
  );
}
