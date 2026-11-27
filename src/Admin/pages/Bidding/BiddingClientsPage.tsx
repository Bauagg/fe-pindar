import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertTriangle, Check, ChevronLeft, ChevronRight, Copy, Coins, Loader2, Pencil, Plus, Search, UserCheck, UserX, X } from "lucide-react";
import { api, errorMessage } from "../../api";
import { btnPrimary, card, inputCls } from "../../components/ui";
import { fmtDate } from "../../utils";

type Status = "pending" | "active" | "inactive";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  company_name: string | null;
  status: Status;
  quota: number;
  claims_count: number | null;
  approved_at: string | null;
  last_login_at: string | null;
  created_at: string;
}

interface ClientList {
  data: Client[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
}

interface Credentials {
  email: string;
  password: string;
}

const STATUS_TABS: { key: "" | Status; label: string }[] = [
  { key: "", label: "Semua" },
  { key: "pending", label: "Menunggu" },
  { key: "active", label: "Aktif" },
  { key: "inactive", label: "Nonaktif" },
];

const STATUS_BADGE: Record<Status, { label: string; cls: string }> = {
  pending: { label: "Menunggu persetujuan", cls: "bg-amber-50 text-amber-700 ring-amber-200" },
  active: { label: "Aktif", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  inactive: { label: "Nonaktif", cls: "bg-gray-100 text-gray-600 ring-gray-200" },
};

const PER_PAGE_OPTIONS = [10, 20, 50];

const randomPassword = (len = 10) => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const buf = new Uint32Array(len);
  crypto.getRandomValues(buf);
  return Array.from(buf, (n) => chars[n % chars.length]).join("");
};

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback untuk browser/koneksi yang menolak Clipboard API
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }
}

/* ------------------------------------------------------------------ */
/* Modal dasar                                                         */
/* ------------------------------------------------------------------ */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold text-gray-900">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Tutup" className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-gray-500">{label}</span>
      <div className="mt-1">{children}</div>
      {hint && <span className="mt-1 block text-xs text-gray-400">{hint}</span>}
    </label>
  );
}

const ErrorBox = ({ text }: { text: string }) => (
  <p role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
    {text}
  </p>
);

/* ------------------------------------------------------------------ */
/* Popup kredensial (salin email & password)                           */
/* ------------------------------------------------------------------ */
function CopyRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (await copyText(value)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div>
      <p className="text-xs font-bold text-gray-500">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        <code className={`min-w-0 flex-1 select-all break-all rounded-xl bg-gray-50 px-3 py-2.5 text-sm font-bold text-gray-900 ring-1 ring-gray-200 ${mono ? "tracking-wider" : ""}`}>{value}</code>
        <button
          type="button"
          onClick={copy}
          aria-label={`Salin ${label.toLowerCase()}`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
          {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
          {copied ? "Tersalin" : "Salin"}
        </button>
      </div>
    </div>
  );
}

function CredentialsModal({ name, creds, onClose }: { name: string; creds: Credentials; onClose: () => void }) {
  const [copiedAll, setCopiedAll] = useState(false);

  const copyAll = async () => {
    const text = `Akun bidding untuk ${name}\nEmail: ${creds.email}\nPassword: ${creds.password}`;
    if (await copyText(text)) {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1500);
    }
  };

  return (
    <Modal title="Akun client siap dibagikan" onClose={onClose}>
      <p className="mt-1 text-sm text-gray-500">
        Akun <b className="text-gray-800">{name}</b> sudah aktif. Salin dan kirim data login di bawah ke calon client.
      </p>

      <div className="mt-4 space-y-3">
        <CopyRow label="Email" value={creds.email} />
        <CopyRow label="Password" value={creds.password} mono />
      </div>

      <p className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        Password hanya ditampilkan sekali dan tidak bisa dilihat lagi setelah popup ini ditutup. Kalau hilang, atur ulang lewat menu Edit.
      </p>

      <div className="mt-5 flex gap-2">
        <button type="button" onClick={copyAll} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50">
          {copiedAll ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
          {copiedAll ? "Tersalin" : "Salin semua"}
        </button>
        <button type="button" onClick={onClose} className={`${btnPrimary} flex-1`}>
          Selesai
        </button>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Form tambah / edit client                                           */
/* ------------------------------------------------------------------ */
function ClientFormModal({ client, onClose, onDone }: { client: Client | null; onClose: () => void; onDone: (c: Client, creds: Credentials | null) => void }) {
  const editing = client !== null;
  const [f, setF] = useState({
    name: client?.name ?? "",
    email: client?.email ?? "",
    phone: client?.phone ?? "",
    company_name: client?.company_name ?? "",
    password: "",
    quota: "10",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const body: Record<string, unknown> = {
        name: f.name.trim(),
        email: f.email.trim(),
        phone: f.phone.trim(),
        company_name: f.company_name.trim() || null,
      };
      if (f.password) body.password = f.password;

      if (editing) {
        const r = await api<{ data: Client }>(`/admin/bidding/clients/${client!.id}`, { method: "PUT", body });
        onDone(r.data, f.password ? { email: r.data.email, password: f.password } : null);
      } else {
        body.quota = Number(f.quota || 0);
        const r = await api<{ data: Client & { credentials: Credentials } }>("/admin/bidding/clients", { method: "POST", body });
        onDone(r.data, r.data.credentials);
      }
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  };

  return (
    <Modal title={editing ? "Edit client" : "Tambah client"} onClose={onClose}>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <Field label="Nama">
          <input required maxLength={150} value={f.name} onChange={set("name")} className={inputCls} autoFocus />
        </Field>
        <Field label="Email">
          <input required type="email" maxLength={150} value={f.email} onChange={set("email")} className={inputCls} />
        </Field>
        <Field label="No. telepon / WA">
          <input required maxLength={30} value={f.phone} onChange={set("phone")} className={inputCls} />
        </Field>
        <Field label="Perusahaan (opsional)">
          <input maxLength={150} value={f.company_name} onChange={set("company_name")} className={inputCls} />
        </Field>

        <Field label={editing ? "Password baru" : "Password"} hint={editing ? "Kosongkan kalau tidak diubah. Jika diisi, client dipaksa login ulang." : "Kosongkan untuk dibuat otomatis. Minimal 8 karakter."}>
          <div className="flex gap-2">
            <input type="text" minLength={8} maxLength={100} value={f.password} onChange={set("password")} className={inputCls} autoComplete="off" />
            <button type="button" onClick={() => setF((p) => ({ ...p, password: randomPassword() }))} className="shrink-0 rounded-xl px-3 text-xs font-bold text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50">
              Acak
            </button>
          </div>
        </Field>

        {!editing && (
          <Field label="Kuota awal" hint="Default 10.">
            <input type="number" min={0} max={1000} value={f.quota} onChange={set("quota")} className={inputCls} />
          </Field>
        )}

        {error && <ErrorBox text={error} />}

        <div className="flex gap-2 pt-1">
          <button type="button" onClick={onClose} disabled={saving} className="flex-1 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-50">
            Batal
          </button>
          <button type="submit" disabled={saving} className={`${btnPrimary} flex-1`}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {editing ? "Simpan" : "Daftarkan"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Tambah kuota                                                        */
/* ------------------------------------------------------------------ */
function QuotaModal({ client, onClose, onDone }: { client: Client; onClose: () => void; onDone: (c: Client) => void }) {
  const [amount, setAmount] = useState("5");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const n = Number(amount);
  const valid = Number.isInteger(n) && n >= 1 && n <= 1000;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setSaving(true);
    setError("");

    try {
      const r = await api<{ data: Client }>(`/admin/bidding/clients/${client.id}/quota`, { method: "POST", body: { amount: n, note: note.trim() || null } });
      onDone(r.data);
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  };

  return (
    <Modal title="Tambah kuota" onClose={onClose}>
      <p className="mt-1 text-sm text-gray-500">
        {client.name} · kuota sekarang <b className="text-gray-900">{client.quota}</b>
      </p>

      <form onSubmit={submit} className="mt-4 space-y-3">
        <Field label="Jumlah tambahan" hint={valid ? `Kuota menjadi ${client.quota + n}.` : "Isi angka 1 sampai 1000."}>
          <input type="number" min={1} max={1000} value={amount} onChange={(e) => setAmount(e.target.value)} className={inputCls} autoFocus />
        </Field>
        <Field label="Catatan (opsional)">
          <input maxLength={255} value={note} onChange={(e) => setNote(e.target.value)} className={inputCls} />
        </Field>

        {error && <ErrorBox text={error} />}

        <div className="flex gap-2 pt-1">
          <button type="button" onClick={onClose} disabled={saving} className="flex-1 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-50">
            Batal
          </button>
          <button type="submit" disabled={saving || !valid} className={`${btnPrimary} flex-1`}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Tambah
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Halaman                                                             */
/* ------------------------------------------------------------------ */
export default function BiddingClientsPage() {
  const [params, setParams] = useSearchParams();
  const initial = params.get("status");

  const [status, setStatus] = useState<"" | Status>(initial === "pending" || initial === "active" || initial === "inactive" ? initial : "");
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [res, setRes] = useState<ClientList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const [form, setForm] = useState<{ client: Client | null } | null>(null);
  const [quotaFor, setQuotaFor] = useState<Client | null>(null);
  const [creds, setCreds] = useState<{ name: string; creds: Credentials } | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setQ(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    const qs = new URLSearchParams({ page: String(page), limit: String(perPage) });
    if (status) qs.set("status", status);
    if (q) qs.set("search", q);

    try {
      setRes(await api<ClientList>(`/admin/bidding/clients?${qs}`));
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [status, q, page, perPage]);

  useEffect(() => {
    load();
  }, [load]);

  const pickStatus = (s: "" | Status) => {
    setStatus(s);
    setPage(1);
    setParams(s ? { status: s } : {}, { replace: true });
  };

  const changeStatus = async (c: Client, next: "active" | "inactive") => {
    if (next === "inactive" && !window.confirm(`Nonaktifkan ${c.name}? Client akan langsung keluar dari semua perangkat.`)) return;

    setBusyId(c.id);
    setError("");
    try {
      await api(`/admin/bidding/clients/${c.id}/status`, { method: "PUT", body: { status: next } });
      await load();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusyId(null);
    }
  };

  const rows = res?.data ?? [];
  const meta = res?.meta;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Client bidding</h1>
          <p className="mt-1 text-sm text-gray-500">Setujui pendaftar baru, atur kuota, atau daftarkan client langsung.</p>
        </div>
        <button type="button" onClick={() => setForm({ client: null })} className={btnPrimary}>
          <Plus className="h-4 w-4" />
          Tambah client
        </button>
      </div>

      {/* Filter */}
      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter status" className="flex flex-wrap items-center gap-2">
          {STATUS_TABS.map((t) => {
            const active = status === t.key;
            return (
              <button
                key={t.key || "all"}
                type="button"
                aria-pressed={active}
                onClick={() => pickStatus(t.key)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 ${
                  active ? "bg-red-600 text-white" : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
                }`}>
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama, email, telepon" aria-label="Cari client" className={`${inputCls} pl-11`} />
        </div>
      </div>

      {error && (
        <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <section className={`${card} mt-6 overflow-hidden`}>
        {loading && !res ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-red-600" />
          </div>
        ) : rows.length === 0 ? (
          <p className="px-5 py-16 text-center text-sm text-gray-500">{status || q ? "Tidak ada client yang cocok dengan filter ini." : "Belum ada client."}</p>
        ) : (
          <div className={`overflow-x-auto transition-opacity ${loading ? "opacity-50" : ""}`}>
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-gray-100 text-xs font-bold text-gray-400">
                <tr>
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Kontak</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Kuota</th>
                  <th className="px-5 py-3">Diambil</th>
                  <th className="px-5 py-3">Terdaftar</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((c) => {
                  const badge = STATUS_BADGE[c.status];
                  const busy = busyId === c.id;
                  return (
                    <tr key={c.id}>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900">{c.name}</p>
                        {c.company_name && <p className="text-xs text-gray-400">{c.company_name}</p>}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        <p>{c.email}</p>
                        <p className="text-xs text-gray-400">{c.phone}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${badge.cls}`}>{badge.label}</span>
                      </td>
                      <td className="px-5 py-4 font-extrabold text-gray-900">{c.quota}</td>
                      <td className="px-5 py-4 text-gray-600">{c.claims_count ?? 0}</td>
                      <td className="px-5 py-4 text-gray-600">{fmtDate(c.created_at)}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          {c.status !== "active" && (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => changeStatus(c, "active")}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50">
                              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserCheck className="h-3.5 w-3.5" />}
                              {c.status === "pending" ? "Setujui" : "Aktifkan"}
                            </button>
                          )}
                          {c.status === "active" && (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => changeStatus(c, "inactive")}
                              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-red-600 ring-1 ring-red-200 hover:bg-red-50 disabled:opacity-50">
                              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserX className="h-3.5 w-3.5" />}
                              Nonaktifkan
                            </button>
                          )}
                          <button type="button" onClick={() => setQuotaFor(c)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50">
                            <Coins className="h-3.5 w-3.5" />
                            Kuota
                          </button>
                          <button type="button" onClick={() => setForm({ client: c })} aria-label={`Edit ${c.name}`} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                            <Pencil className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {meta && meta.total > 0 && (
          <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-gray-500">
              Halaman <b className="text-gray-900">{meta.current_page}</b> dari {meta.last_page} · {meta.total} client
            </p>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <label className="flex items-center gap-2 text-gray-500">
                Tampilkan
                <select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(Number(e.target.value));
                    setPage(1);
                  }}
                  aria-label="Jumlah data per halaman"
                  className="rounded-lg bg-white px-2 py-1.5 text-sm font-bold text-gray-700 ring-1 ring-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
                  {PER_PAGE_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex gap-2">
                <button onClick={() => setPage((p) => p - 1)} disabled={meta.current_page <= 1 || loading} aria-label="Halaman sebelumnya" className="rounded-lg p-2 text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-40">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={meta.current_page >= meta.last_page || loading}
                  aria-label="Halaman berikutnya"
                  className="rounded-lg p-2 text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-40">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {form && (
        <ClientFormModal
          client={form.client}
          onClose={() => setForm(null)}
          onDone={(c, cr) => {
            setForm(null);
            if (cr) setCreds({ name: c.name, creds: cr });
            load();
          }}
        />
      )}

      {quotaFor && (
        <QuotaModal
          client={quotaFor}
          onClose={() => setQuotaFor(null)}
          onDone={() => {
            setQuotaFor(null);
            load();
          }}
        />
      )}

      {creds && <CredentialsModal name={creds.name} creds={creds.creds} onClose={() => setCreds(null)} />}
    </div>
  );
}
