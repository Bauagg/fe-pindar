import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, HandCoins, Lock, MessageCircle } from "lucide-react";
import { ApiError, errMsg, request } from "./api";
import { BASE } from "./config";
import { ClaimModal, Detail } from "./ClaimModal";
import { ErrorBox, ProductBadge, Spinner, btnPrimary, card, fmtDate, fmtDateTime, waLink } from "./ui";

/** Key yang tidak ditampilkan sebagai baris data umum. */
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
  "claimed_at",
  "claim",
  "shared_at",
]);

const LABELS: Record<string, string> = {
  application_number: "No. pengajuan",
  name: "Nama",
  phone: "No. telepon",
  created_at: "Tanggal masuk",
  birth_place: "Tempat lahir",
  birth_date: "Tanggal lahir",
  address: "Alamat",
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

type RowItem = { label: string; value: unknown; field?: string };

function Rows({ rows }: { rows: RowItem[] }) {
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

const objectRows = (obj: Record<string, any> | undefined, skip: Set<string> = new Set()): RowItem[] =>
  Object.entries(obj ?? {})
    .filter(([k, v]) => !skip.has(k) && isScalar(v))
    .map(([k, v]) => ({ label: humanize(k), value: v, field: k }));

function formRows(d: Detail): RowItem[] {
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

export default function DetailPage() {
  const { product, id } = useParams();
  const [d, setD] = useState<Detail | null>(null);
  const [gate, setGate] = useState<"not_claimed" | "taken" | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [claiming, setClaiming] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    setGate(null);
    try {
      const r = await request<{ data: Detail }>(`/bidding-client/bidding/${product}/${id}`);
      setD(r.data);
    } catch (e) {
      if (e instanceof ApiError && (e.code === "not_claimed" || e.code === "taken")) setGate(e.code);
      else setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }, [product, id]);

  useEffect(() => {
    load();
  }, [load]);

  const back = (
    <Link to={`${BASE}/bidding`} className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      Kembali ke data bidding
    </Link>
  );

  if (loading) {
    return (
      <div>
        {back}
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      </div>
    );
  }

  if (gate === "taken") {
    return (
      <div>
        {back}
        <div className={`${card} mx-auto mt-8 max-w-md p-8 text-center`}>
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
            <Lock className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-lg font-extrabold text-gray-900">Data sudah diambil</h1>
          <p className="mt-1 text-sm text-gray-500">Data ini sudah diambil client lain, jadi detailnya tidak bisa kamu lihat.</p>
          <Link to={`${BASE}/bidding?scope=available`} className={`${btnPrimary} mt-5`}>
            Cari data lain
          </Link>
        </div>
      </div>
    );
  }

  if (gate === "not_claimed") {
    return (
      <div>
        {back}
        <div className={`${card} mx-auto mt-8 max-w-md p-8 text-center`}>
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <HandCoins className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-lg font-extrabold text-gray-900">Ambil data untuk melihat detail</h1>
          <p className="mt-1 text-sm text-gray-500">Detail lengkap hanya terbuka setelah kamu mengambil data ini. Pengambilan memakai 1 kuota.</p>
          <button type="button" onClick={() => setClaiming(true)} className={`${btnPrimary} mt-5`}>
            Ambil data
          </button>
        </div>

        {claiming && (
          <ClaimModal
            product={String(product)}
            id={Number(id)}
            label="data ini"
            onClose={() => setClaiming(false)}
            onStale={load}
            onClaimed={(detail) => {
              setClaiming(false);
              setGate(null);
              setD(detail);
            }}
          />
        )}
      </div>
    );
  }

  if (error || !d) {
    return (
      <div>
        {back}
        <div className="mt-6">
          <ErrorBox>{error || "Data tidak ditemukan."}</ErrorBox>
        </div>
      </div>
    );
  }

  const phone: string | undefined = d.applicant?.phone ?? d.applicant_phone;
  const applicantRows: RowItem[] = [
    { label: "No. pengajuan", value: d.application_number, field: "application_number" },
    ...objectRows(d.applicant),
    ...objectRows(d, SKIP_KEYS).filter((r) => r.field !== "application_number"),
  ];
  const assetRows = objectRows(d.asset);
  const fields = formRows(d);
  const approvals: any[] = Array.isArray(d.approval_infos) ? d.approval_infos : [];

  return (
    <div>
      {back}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-extrabold text-gray-900">{d.applicant?.name ?? d.applicant_name ?? "Detail data"}</h1>
        {d.product_label && <ProductBadge label={d.product_label} />}
        <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">Diambil saya</span>

        {phone && (
          <a
            href={waLink(phone)}
            target="_blank"
            rel="noreferrer"
            className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Hubungi via WhatsApp
          </a>
        )}
      </div>
      {d.claimed_at && <p className="mt-1 text-sm text-gray-500">Diambil {fmtDateTime(d.claimed_at)}</p>}

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
