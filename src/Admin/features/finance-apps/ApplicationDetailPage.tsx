import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Briefcase, CreditCard, Landmark, Loader2, MessageCircle, Trash2, UserRound, XCircle } from "lucide-react";
import { ActivityPanel, StatusBadge, api, apiJson, card, errorMessage } from "./shared";
import type { ModuleConfig } from "./config";
import type { Application } from "./types";
import { fmtDateTime, fmtDay, waLink } from "./format";
import { Alert, CardTitle, Info, btnDanger } from "./ui-parts";
import EditApplicantModal from "./EditApplicantModal";
import { ApprovalInfoPanel, FormFieldsPanel, RolesPanel, SharePanel, StatusPanel } from "./Panels";

const EditButton = ({ onClick }: { onClick: () => void }) => (
  <button type="button" onClick={onClick} className="rounded-lg px-3 py-1.5 text-xs font-bold text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
    Ubah
  </button>
);

/** Banner alasan koreksi / penolakan (hanya muncul jika status-nya sesuai). */
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

export default function ApplicationDetailPage({ config }: { config: ModuleConfig }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const goBack = () => {
    // key "default" = halaman dibuka langsung (refresh / link)
    if (location.key !== "default") navigate(-1);
    else navigate(config.routes.list);
  };

  const load = useCallback(async () => {
    try {
      const r = await api<{ data: Application }>(`${config.api.admin}/${id}`);
      setApp(r.data);
      setError("");
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [config.api.admin, id]);

  useEffect(() => {
    setLoading(true);
    setEditing(false);
    load();
  }, [load]);

  const remove = async () => {
    if (!app) return;
    if (!window.confirm(`Hapus pengajuan ${app.application_number}? Tindakan ini tidak bisa dibatalkan.`)) return;
    setDeleting(true);
    try {
      await apiJson(`${config.api.admin}/${app.id}`, "DELETE");
      navigate(config.routes.list, { replace: true });
    } catch (e) {
      setError(errorMessage(e));
      setDeleting(false);
    }
  };

  const back = (
    <Link
      to={config.routes.list}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        goBack();
      }}
      className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-600">
      <ArrowLeft className="h-4 w-4" /> Kembali
    </Link>
  );

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-red-600" />
      </div>
    );
  }

  if (!app) {
    return (
      <div>
        {back}
        <div className="mt-6">
          <Alert>{error || "Pengajuan tidak ditemukan."}</Alert>
        </div>
      </div>
    );
  }

  const canEdit = !!app.can_edit; // dari BE: hanya super_admin & admin
  const ProductIcon = config.key === "bank-loan" ? Landmark : CreditCard;
  const birth = [app.applicant.birth_place, app.applicant.birth_date ? fmtDay(app.applicant.birth_date) : ""].filter(Boolean).join(", ");

  return (
    <div>
      {back}

      <ReasonBanner app={app} />

      {error && (
        <div className="mt-4">
          <Alert>{error}</Alert>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-extrabold text-gray-900">{app.application_number}</h1>
        <StatusBadge value={app.status.value} />
        {canEdit && (
          <button type="button" onClick={remove} disabled={deleting} className={`${btnDanger} ml-auto`}>
            <Trash2 className="h-4 w-4" />
            {deleting ? "Menghapus…" : "Hapus"}
          </button>
        )}
      </div>

      <p className="text-sm text-gray-500">
        Diajukan {fmtDateTime(app.created_at)} · {config.title}
        {app[config.productKey] ? ` · ${app[config.productKey]}` : ""}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className={`${card} p-5`}>
            <CardTitle icon={UserRound} title="Data pemohon" tone="bg-sky-50 text-sky-600" right={canEdit ? <EditButton onClick={() => setEditing(true)} /> : null} />
            <dl className="mt-4 grid gap-5 sm:grid-cols-2">
              <Info label="Nama sesuai KTP">{app.applicant.name}</Info>
              <Info label="No. telepon / WA">
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
              <Info label="Tempat, tanggal lahir">{birth}</Info>
              <Info label="Terakhir diperbarui">{fmtDateTime(app.updated_at)}</Info>
              <Info label={config.addressLabel} wide>
                <span className="whitespace-pre-line">{app.applicant.address}</span>
              </Info>
            </dl>
          </section>

          {config.hasCompany && (
            <section className={`${card} p-5`}>
              <CardTitle icon={Briefcase} title="Data pekerjaan" tone="bg-indigo-50 text-indigo-600" right={canEdit ? <EditButton onClick={() => setEditing(true)} /> : null} />
              <dl className="mt-4 grid gap-5 sm:grid-cols-2">
                <Info label="Nama perusahaan">{app.company?.name}</Info>
                <Info label="Alamat kantor" wide>
                  <span className="whitespace-pre-line">{app.company?.address}</span>
                </Info>
              </dl>
            </section>
          )}

          <section className={`${card} p-5`}>
            <CardTitle icon={ProductIcon} title="Pengajuan" tone="bg-red-50 text-red-600" right={canEdit ? <EditButton onClick={() => setEditing(true)} /> : null} />
            <dl className="mt-4 grid gap-5 sm:grid-cols-2">
              <Info label={config.productLabel}>{app[config.productKey]}</Info>
              <Info label="Jenis layanan">{config.title}</Info>
            </dl>
          </section>

          <ApprovalInfoPanel config={config} app={app} onChanged={load} />
          <FormFieldsPanel config={config} app={app} onChanged={load} />
        </div>

        <div className="space-y-6">
          <StatusPanel config={config} app={app} onChanged={load} />
          <ActivityPanel activities={app.activities ?? []} />
          <RolesPanel config={config} app={app} onChanged={load} />
          {canEdit && <SharePanel config={config} app={app} onChanged={load} />}
        </div>
      </div>

      {canEdit && editing && <EditApplicantModal config={config} app={app} onClose={() => setEditing(false)} onSaved={load} />}
    </div>
  );
}
