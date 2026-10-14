import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, BadgeCheck, Bike, Car, Home, Loader2, MessageCircle, UserRound, X, XCircle } from "lucide-react";
import { api, errorMessage } from "../api";
import { SERVICES } from "../constants";
import ActivityPanel from "../components/ActivityPanel";
import ApprovalInfoPanel from "../components/ApprovalInfoPanel";
import AssetCell, { APPLICANT_LABEL, ApplicantBadge, FINANCING_LABEL, OWNER_SHORT, TRANSMISSION_LABEL } from "../components/AssetCell";
import EditApplicantModal from "../components/EditApplicantModal";
import EditAssetModal from "../components/EditAssetModal";
import { EditButton } from "../components/EditModal";
import FieldValue from "../components/FieldValue";
import FormFieldsPanel from "../components/FormFieldsPanel";
import RolesPanel from "../components/RolesPanel";
import StatusBadge from "../components/StatusBadge";
import StatusPanel from "../components/StatusPanel";
import { card } from "../components/ui";
import { fmtDateTime, waLink } from "../utils";
import type { Application, ApprovalInfo } from "../types";
import ExportPdfButton from "../components/ExportPdfButton";
import WhatsAppNotifyFab from "../components/WhatsAppNotifyFab";

function Info({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <dt className="text-xs font-bold text-gray-400">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-gray-900">{children || "-"}</dd>
    </div>
  );
}

function CardTitle({ icon: Icon, title, tone, right }: { icon: React.ElementType; title: string; tone: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone}`}>
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="font-extrabold text-gray-900">{title}</h2>
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  );
}

/** Banner peringatan alasan koreksi / penolakan (hanya muncul jika status-nya sesuai). */
function ReasonBanner({ app }: { app: Application }) {
  const { value, rejected_reason, correction_reason } = app.status;

  if (value === "correction") {
    return (
      <div role="alert" className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
        <div>
          <p className="text-sm font-extrabold">Pengajuan perlu dikoreksi</p>
          <p className="mt-0.5 whitespace-pre-line text-sm font-semibold">{correction_reason || "Tidak ada alasan yang dicantumkan."}</p>
        </div>
      </div>
    );
  }

  if (value === "rejected") {
    return (
      <div role="alert" className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800">
        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
        <div>
          <p className="text-sm font-extrabold">Pengajuan ditolak</p>
          <p className="mt-0.5 whitespace-pre-line text-sm font-semibold">{rejected_reason || "Tidak ada alasan yang dicantumkan."}</p>
        </div>
      </div>
    );
  }

  return null;
}

// Data utama yang selalu ditampilkan di ringkasan (urutan sesuai tampilan).
const MAIN_LABELS = ["Nama Leasing", "Paket Leasing", "Tenor", "Jumlah Pencairan", "Komisi Pindar"];
// Label yang ditampilkan sebagai rupiah.
const MONEY_LABELS = ["Jumlah Pencairan", "Komisi Pindar"];

const norm = (s: string) => s.trim().toLowerCase();

const rupiah = (value: string | null) => {
  const n = Number(value);
  return value && Number.isFinite(n) ? `Rp ${n.toLocaleString("id-ID")}` : value || "-";
};

/** Ringkasan informasi persetujuan (leasing, tenor, pencairan, komisi) di paling atas. */
function ApprovalSummary({ app, onClose }: { app: Application; onClose: () => void }) {
  const infos = app.approval_infos ?? [];
  const find = (label: string) => infos.find((i) => norm(i.label) === norm(label));
  const extras = infos.filter((i) => !MAIN_LABELS.some((l) => norm(l) === norm(i.label)));

  const renderValue = (info: ApprovalInfo) => (MONEY_LABELS.some((l) => norm(l) === norm(info.label)) ? rupiah(info.value) : <FieldValue type={info.field_type} value={info.value} fileUrl={info.file_url} label={info.label} />);

  return (
    <section aria-label="Ringkasan persetujuan" className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/60 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <BadgeCheck className="h-5 w-5 text-emerald-600" />
          <h2 className="font-extrabold text-emerald-900">Ringkasan persetujuan</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup ringkasan persetujuan"
          className="-mr-1 -mt-1 rounded-lg p-1.5 text-emerald-700 hover:bg-emerald-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500">
          <X className="h-4 w-4" />
        </button>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {MAIN_LABELS.map((label) => {
          const info = find(label);
          const isKomisi = norm(label) === norm("Komisi Pindar");
          return (
            <div key={label} className={`rounded-xl bg-white px-4 py-3 ring-1 ${isKomisi ? "ring-emerald-300" : "ring-emerald-100"}`}>
              <dt className="text-xs font-bold text-gray-400">{label}</dt>
              <dd className={`mt-1 break-words font-extrabold ${isKomisi ? "text-lg text-emerald-700" : "text-base text-gray-900"}`}>{info ? renderValue(info) : <span className="text-sm font-semibold text-gray-400">Belum diisi</span>}</dd>
            </div>
          );
        })}
      </dl>

      {extras.length > 0 && (
        <dl className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {extras.map((info) => (
            <div key={info.id} className="rounded-xl bg-white px-4 py-3 ring-1 ring-emerald-100">
              <dt className="text-xs font-bold text-gray-400">{info.label}</dt>
              <dd className="mt-1 break-words text-sm font-bold text-gray-900">{renderValue(info)}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}

/** Kartu jaminan: SHM atau kendaraan (BPKB). Tombol edit hanya jika onEdit diberikan. */
function AssetCard({ app, onEdit }: { app: Application; onEdit?: () => void }) {
  const { asset, vehicle: v } = app;
  const owner = asset?.ownership ? OWNER_SHORT[asset.ownership] ?? asset.ownership : "";
  const editBtn = onEdit ? <EditButton onClick={onEdit} /> : null;

  if (asset?.is_shm) {
    return (
      <section className={`${card} p-5`}>
        <CardTitle
          icon={Home}
          title="Jaminan SHM"
          tone="bg-indigo-50 text-indigo-600"
          right={
            <>
              <span className="hidden rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600 sm:inline">Sertifikat Hak Milik</span>
              {editBtn}
            </>
          }
        />
        <dl className="mt-4 grid gap-5 sm:grid-cols-2">
          <Info label="SHM atas nama">{owner}</Info>
          <Info label="Jenis surat">{asset.certificate_type}</Info>
        </dl>
      </section>
    );
  }

  const Icon = v?.type === "motor" ? Bike : Car;
  const isTakeOver = v?.financing_status === "take_over";

  return (
    <section className={`${card} p-5`}>
      <CardTitle
        icon={Icon}
        title="Jaminan Kendaraan"
        tone="bg-red-50 text-red-600"
        right={
          <>
            <span className="hidden rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold capitalize text-gray-600 sm:inline">{v?.type || "-"}</span>
            {editBtn}
          </>
        }
      />
      <dl className="mt-4 grid gap-5 sm:grid-cols-2">
        <Info label="Merek">{v?.brand}</Info>
        <Info label="Tipe">{v?.model}</Info>
        <Info label="Tahun">{v?.year ? String(v.year) : ""}</Info>
        <Info label="Transmisi">{v?.transmission ? TRANSMISSION_LABEL[v.transmission] ?? v.transmission : ""}</Info>
        <Info label="BPKB atas nama">{owner}</Info>
        <Info label="Status BPKB">{v?.financing_status ? FINANCING_LABEL[v.financing_status] ?? v.financing_status : ""}</Info>
        {isTakeOver && <Info label="Take over dari leasing">{v?.previous_leasing}</Info>}
      </dl>
    </section>
  );
}

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSummary, setShowSummary] = useState(true);
  const [editing, setEditing] = useState<"applicant" | "asset" | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await api<{ data: Application }>(`/admin/multifinance/${id}`);
      setApp(r.data);
      setError("");
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    setShowSummary(true); // pengajuan lain dibuka: ringkasan tampil lagi
    setEditing(null);
    load();
  }, [load]);

  const back = (
    <Link to="/admin/multi-finance/applications" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-600">
      <ArrowLeft className="h-4 w-4" /> Kembali ke daftar
    </Link>
  );

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-red-600" />
      </div>
    );
  }

  if (error || !app) {
    return (
      <div>
        {back}
        <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error || "Pengajuan tidak ditemukan."}
        </div>
      </div>
    );
  }

  const approved = app.status.value === "approved";
  const isCompany = app.applicant.type === "perusahaan";
  const canEdit = !!app.can_edit; // dari BE: hanya super_admin & admin

  return (
    <div>
      {back}

      {approved &&
        (showSummary ? (
          <ApprovalSummary app={app} onClose={() => setShowSummary(false)} />
        ) : (
          <button type="button" onClick={() => setShowSummary(true)} className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:underline">
            <BadgeCheck className="h-4 w-4" /> Tampilkan ringkasan persetujuan
          </button>
        ))}

      <ReasonBanner app={app} />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-extrabold text-gray-900">{app.application_number}</h1>
        <StatusBadge value={app.status.value} />
        <ApplicantBadge type={app.applicant.type} />
        <div className="ml-auto">
          <ExportPdfButton app={app} />
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Diajukan {fmtDateTime(app.created_at)} · {SERVICES[app.service_type] || app.service_type}
      </p>

      {/* Ringkasan jaminan singkat */}
      <div className="mt-5 rounded-2xl border border-gray-100 bg-white px-5 py-4">
        <AssetCell a={app} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className={`${card} p-5`}>
            <CardTitle icon={UserRound} title="Data pemohon" tone="bg-sky-50 text-sky-600" right={canEdit ? <EditButton onClick={() => setEditing("applicant")} /> : null} />
            <dl className="mt-4 grid gap-5 sm:grid-cols-2">
              <Info label="Pengajuan atas nama">{APPLICANT_LABEL[app.applicant.type] ?? app.applicant.type}</Info>
              <Info label={isCompany ? "Nama penanggung jawab (KTP)" : "Nama sesuai KTP"}>{app.applicant.name}</Info>
              <Info label="Nomor telepon">
                <span className="flex flex-wrap items-center gap-3">
                  {app.applicant.phone}
                  <a
                    href={waLink(app.applicant.phone)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100">
                    <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                  </a>
                </span>
              </Info>
              <Info label="Usia">{app.applicant.age ? `${app.applicant.age} tahun` : ""}</Info>
              <Info label="Alamat pribadi" wide>
                <span className="whitespace-pre-line">{app.applicant.address}</span>
              </Info>
              <Info label="Layanan">{SERVICES[app.service_type] || app.service_type}</Info>
              <Info label="Terakhir diperbarui">{fmtDateTime(app.updated_at)}</Info>
            </dl>
          </section>

          <AssetCard app={app} onEdit={canEdit ? () => setEditing("asset") : undefined} />

          <ApprovalInfoPanel app={app} onChanged={load} />

          <FormFieldsPanel app={app} onChanged={load} />
        </div>

        <div className="space-y-6">
          <StatusPanel app={app} onSaved={load} />
          <ActivityPanel activities={app.activities ?? []} />
          <RolesPanel app={app} onSaved={load} />
        </div>
      </div>

      {canEdit && editing === "applicant" && <EditApplicantModal app={app} onClose={() => setEditing(null)} onSaved={load} />}
      {canEdit && editing === "asset" && <EditAssetModal app={app} onClose={() => setEditing(null)} onSaved={load} />}

      <WhatsAppNotifyFab app={app} />
    </div>
  );
}
