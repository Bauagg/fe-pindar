import React, { useMemo, useState } from "react";
import { UserRound } from "lucide-react";
import { errorMessage } from "../api";
import EditModal, { Field, Segmented } from "./EditModal";
import { updateApplicant } from "./editApi";
import { inputCls } from "./ui";
import type { Application } from "../types";

interface Props {
  app: Application;
  onClose: () => void;
  onSaved: () => void;
}

const TYPES = [
  { value: "individu", label: "Individu" },
  { value: "perusahaan", label: "Perusahaan" },
] as const;

export default function EditApplicantModal({ app, onClose, onSaved }: Props) {
  const [form, setForm] = useState({
    name: app.applicant.name ?? "",
    phone: app.applicant.phone ?? "",
    age: app.applicant.age ? String(app.applicant.age) : "",
    address: app.applicant.address ?? "",
    type: app.applicant.type || "individu",
  });
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((p) => ({ ...p, [k]: v }));

  const errors = useMemo(() => {
    const e: Partial<Record<keyof typeof form, string>> = {};
    const age = Number(form.age);
    if (form.name.trim().length < 3) e.name = "Minimal 3 huruf.";
    if (!/^(\+62|62|0)8[1-9][0-9]{7,10}$/.test(form.phone.replace(/[\s-]/g, ""))) e.phone = "Contoh: 081234567890";
    if (!form.age || !Number.isInteger(age) || age < 17 || age > 80) e.age = "Usia 17 - 80 tahun.";
    if (form.address.trim().length < 10) e.address = "Minimal 10 karakter.";
    return e;
  }, [form]);

  const show = (k: keyof typeof form) => (submitted ? errors[k] : undefined);
  const cls = (k: keyof typeof form) => `${inputCls} ${show(k) ? "!border-red-400" : ""}`;

  const submit = async () => {
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    setError("");
    try {
      await updateApplicant(app.id, {
        applicant_name: form.name.trim(),
        applicant_phone: form.phone.replace(/[\s-]/g, ""),
        applicant_age: Number(form.age),
        applicant_address: form.address.trim(),
        applicant_type: form.type,
      });
      onSaved();
      onClose();
    } catch (e) {
      setError(errorMessage(e));
      setSaving(false);
    }
  };

  return (
    <EditModal title="Edit data pemohon" subtitle={app.application_number} icon={UserRound} tone="bg-sky-50 text-sky-600" saving={saving} error={error} onClose={onClose} onSubmit={submit}>
      <Field label="Pengajuan atas nama" wide>
        <Segmented options={TYPES} value={form.type} onChange={(v) => set("type", v)} />
      </Field>

      <Field label={form.type === "perusahaan" ? "Nama penanggung jawab (KTP)" : "Nama sesuai KTP"} htmlFor="e-name" error={show("name")} wide>
        <input id="e-name" value={form.name} onChange={(e) => set("name", e.target.value)} className={cls("name")} />
      </Field>

      <Field label="Nomor telepon" htmlFor="e-phone" error={show("phone")}>
        <input id="e-phone" type="tel" inputMode="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={cls("phone")} />
      </Field>

      <Field label="Usia" htmlFor="e-age" error={show("age")}>
        <input id="e-age" type="number" inputMode="numeric" min={17} max={80} value={form.age} onChange={(e) => set("age", e.target.value)} className={cls("age")} />
      </Field>

      <Field label="Alamat pribadi" htmlFor="e-address" error={show("address")} wide>
        <textarea id="e-address" rows={3} value={form.address} onChange={(e) => set("address", e.target.value)} className={`${cls("address")} resize-none`} />
      </Field>
    </EditModal>
  );
}
