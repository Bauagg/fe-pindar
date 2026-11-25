import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import { api, errorMessage } from "../../api";
import StatusBadge from "../../components/StatusBadge";
import { card } from "../../components/ui";
import { fmtDate } from "../../utils";
import { CompleteBadge, ProductBadge } from "./BiddingPage";

/* Bentuk detail mengikuti formatter backend (formatApplication), jadi dibuat longgar. */
type Detail = Record<string, any>;

/** Key yang tidak perlu ditampilkan sebagai baris data. */
const SKIP_KEYS = new Set([
  "id",
  "product",
  "product_label",
  "is_complete",
  "status",
  "roles",
  "applicant",
  "asset",
  "form",
  "form_fields",
  "fields",
  "field_values",
  "activities",
  "approval_infos",
  "can_edit",
  "is_read",
  "latest_activity",
  "read_at",
  "updated_at",
]);

const LABELS: Record<string, string> = {
  application_number: "No. pengajuan",
  name: "Nama",
  phone: "No. telepon",
  created_at: "Tanggal masuk",
  birth_place: "Tempat lahir",
  birth_date: "Tanggal lahir",
  address: "Alamat",
  rejected_reason: "Alasan ditolak",
  correction_reason: "Alasan koreksi",
};

const humanize = (key: string) => {
  if (LABELS[key]) return LABELS[key];
  const s = key.replace(/[_-]+/g, " ").trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const isScalar = (v: unknown) => v === null || ["string", "number", "boolean"].includes(typeof v);
const isImageUrl = (s: string) => /^https?:\/\/.+\.(jpe?g|png|webp|gif)(\?.*)?$/i.test(s) || /^\/.+\.(jpe?g|png|webp|gif)(\?.*)?$/i.test(s);
const isUrl = (s: string) => /^https?:\/\//i.test(s);

function Value({ value, field }: { value: unknown; field?: string }) {
  if (value === null || value === undefined || value === "") return <span className="text-gray-400">-</span>;
  if (typeof value === "boolean") return <>{value ? "Ya" : "Tidak"}</>;

  if (typeof value === "string") {
    if (field && /(_at|date)$/.test(field) && /^\d{4}-\d{2}-\d{2}/.test(value)) return <>{fmtDate(value)}</>;

    if (isImageUrl(value)) {
      return (
        <a href={value} target="_blank" rel="noreferrer" className="inline-block focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
          <img src={value} alt={field ? humanize(field) : "Lampiran"} className="h-28 w-auto rounded-xl object-cover ring-1 ring-gray-200" loading="lazy" />
        </a>
      );
    }

    if (isUrl(value)) {
      return (
        <a href={value} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-red-600 hover:underline">
          Buka file <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      );
    }
  }

  return <span className="whitespace-pre-wrap break-words">{String(value)}</span>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={`${card} overflow-hidden`}>
      <h2 className="border-b border-gray-100 px-5 py-3 text-sm font-extrabold text-gray-900">{title}</h2>
      {children}
    </section>
  );
}

function Rows({ rows }: { rows: { label: string; value: unknown; field?: string }[] }) {
  if (rows.length === 0) return <p className="px-5 py-6 text-sm text-gray-500">Tidak ada data.</p>;
  return (
    <dl className="divide-y divide-gray-50">
      {rows.map((r, i) => (
        <div key={`${r.label}-${i}`} className="grid gap-1 px-5 py-3 text-sm sm:grid-cols-3 sm:gap-4">
          <dt className="font-semibold text-gray-400">{r.label}</dt>
          <dd className="font-semibold text-gray-900 sm:col-span-2">
            <Value value={r.value} field={r.field} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Object datar => baris label/nilai (hanya nilai scalar). */
const objectRows = (obj: Record<string, any> | undefined, skip: Set<string> = new Set()) =>
  Object.entries(obj ?? {})
    .filter(([k, v]) => !skip.has(k) && isScalar(v))
    .map(([k, v]) => ({ label: humanize(k), value: v, field: k }));

/** Isian form dinamis: array {label,value} atau object key=>value. */
function formRows(d: Detail) {
  const src = d.form ?? d.form_fields ?? d.fields ?? d.field_values;
  if (Array.isArray(src)) {
    return src.map((f: any) => ({
      label: f.label ?? f.name ?? f.key ?? "Isian",
      value: f.value ?? f.file_url ?? f.file_path ?? f.url ?? null,
      field: f.key ?? f.name,
    }));
  }
  if (src && typeof src === "object") return objectRows(src);
  return [];
}

export default function BiddingDetailPage() {
  const { product, id } = useParams();
  const [d, setD] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");

    api<{ data: Detail }>(`/admin/bidding/${product}/${id}`)
      .then((r) => alive && setD(r.data))
      .catch((e) => alive && setError(errorMessage(e)))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [product, id]);

  const back = (
    <Link to="/admin/bidding" className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      Kembali ke bidding
    </Link>
  );

  if (loading) {
    return (
      <div>
        {back}
        <div className="flex justify-center py-24">
          <Loader2 className="h-5 w-5 animate-spin text-red-600" />
        </div>
      </div>
    );
  }

  if (error || !d) {
    return (
      <div>
        {back}
        <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error || "Data tidak ditemukan."}
        </div>
      </div>
    );
  }

  const statusValue = typeof d.status === "object" ? d.status?.value : d.status;

  const applicantRows = [{ label: "No. pengajuan", value: d.application_number, field: "application_number" }, ...objectRows(d.applicant), ...objectRows(d, SKIP_KEYS).filter((r) => r.field !== "application_number")];
  const assetRows = objectRows(d.asset);
  const fields = formRows(d);
  const approvals: any[] = Array.isArray(d.approval_infos) ? d.approval_infos : [];
  const activities: any[] = Array.isArray(d.activities) ? d.activities : [];

  return (
    <div>
      {back}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-extrabold text-gray-900">{d.applicant?.name ?? d.applicant_name ?? "Detail bidding"}</h1>
        {d.product_label && <ProductBadge label={d.product_label} />}
        <CompleteBadge value={Boolean(d.is_complete)} />
        {statusValue && <StatusBadge value={statusValue} />}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Section title="Data pemohon">
            <Rows rows={applicantRows} />
          </Section>

          {assetRows.length > 0 && (
            <Section title="Aset">
              <Rows rows={assetRows} />
            </Section>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <Section title="Isian form & lampiran">
            <Rows rows={fields} />
          </Section>

          {approvals.length > 0 && (
            <Section title="Info persetujuan">
              <div className="divide-y divide-gray-50">
                {approvals.map((a, i) => (
                  <div key={a.id ?? i}>
                    <Rows rows={objectRows(a, new Set(["id"]))} />
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}
