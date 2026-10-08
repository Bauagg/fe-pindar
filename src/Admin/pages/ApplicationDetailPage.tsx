import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, MessageCircle } from "lucide-react";
import { api, errorMessage } from "../api";
import { SERVICES } from "../constants";
import ActivityPanel from "../components/ActivityPanel";
import ApprovalInfoPanel from "../components/ApprovalInfoPanel";
import FormFieldsPanel from "../components/FormFieldsPanel";
import RolesPanel from "../components/RolesPanel";
import StatusBadge from "../components/StatusBadge";
import StatusPanel from "../components/StatusPanel";
import { card } from "../components/ui";
import { fmtDateTime, waLink } from "../utils";
import type { Application } from "../types";

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-bold text-gray-400">{label}</dt>
      <dd className="mt-1 text-sm font-bold text-gray-900">{children}</dd>
    </div>
  );
}

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div>
      {back}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-extrabold text-gray-900">{app.application_number}</h1>
        <StatusBadge value={app.status.value} />
      </div>
      <p className="mt-1 text-sm text-gray-500">Diajukan {fmtDateTime(app.created_at)}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className={`${card} p-5`}>
            <h2 className="font-extrabold text-gray-900">Data pemohon</h2>
            <dl className="mt-4 grid gap-5 sm:grid-cols-2">
              <Info label="Nama sesuai KTP">{app.applicant.name}</Info>
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
              <Info label="Layanan">{SERVICES[app.service_type] || app.service_type}</Info>
              <Info label="Jenis kendaraan">
                <span className="capitalize">{app.vehicle.type}</span>
              </Info>
              <Info label="Merek">{app.vehicle.brand}</Info>
              <Info label="Tipe">{app.vehicle.model}</Info>
              <Info label="Tahun">{app.vehicle.year}</Info>
              <Info label="Terakhir diperbarui">{fmtDateTime(app.updated_at)}</Info>
            </dl>
          </section>

          <ApprovalInfoPanel app={app} onChanged={load} />

          <FormFieldsPanel app={app} onChanged={load} />
        </div>

        <div className="space-y-6">
          <StatusPanel app={app} onSaved={load} />
          <ActivityPanel activities={app.activities ?? []} />
          <RolesPanel app={app} onSaved={load} />
        </div>
      </div>
    </div>
  );
}
