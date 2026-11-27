import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { AlertTriangle, Banknote, Car, CheckCircle2, Coins, CreditCard, Eye, EyeOff, Landmark, Loader2, Lock, ShieldCheck, Sparkles, Target } from "lucide-react";
import { ApiError, errMsg, request } from "./api";
import { useAuth } from "./auth";
import { BASE } from "./config";
import { ErrorBox, btnPrimary, card, inputCls } from "./ui";

/** Produk yang datanya disediakan Pindar.id. */
const PRODUCTS = [
  { label: "Pinjaman Daring", icon: Banknote },
  { label: "Kartu Kredit", icon: CreditCard },
  { label: "Pinjaman Bank", icon: Landmark },
  { label: "Multifinance", icon: Car },
];

const BENEFITS = [
  { icon: Target, title: "Pilih sesuai kebutuhan", text: "Telusuri data dari berbagai produk, lalu ambil yang cocok untuk bisnismu." },
  { icon: Coins, title: "Ambil dengan kuota", text: "Setiap data yang kamu ambil memakai kuota bidding milikmu." },
  { icon: ShieldCheck, title: "Eksklusif untukmu", text: "Data yang sudah kamu ambil tidak bisa dilihat client lain." },
];

/** Pola titik halus untuk latar merah. */
const DOT_PATTERN: React.CSSProperties = {
  backgroundImage: "radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

function PasswordInput({ value, onChange, id, autoComplete, minLength }: { value: string; onChange: (v: string) => void; id: string; autoComplete: string; minLength?: number }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input id={id} type={show ? "text" : "password"} required minLength={minLength} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} className={`${inputCls} pr-11`} />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-400 hover:text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function FormField({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-xs font-bold text-gray-500">
        {label}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

export default function LoginPage() {
  const { client, ready, login } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ text: string; code?: string } | null>(null);
  const [notice, setNotice] = useState("");

  const [reg, setReg] = useState({ name: "", email: "", phone: "", company_name: "", password: "", password_confirmation: "" });

  if (ready && client) return <Navigate to={BASE} replace />;

  const submitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice("");
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError({ text: errMsg(err), code: err instanceof ApiError ? err.code : undefined });
      setBusy(false);
    }
  };

  const submitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await request<{ message: string }>("/bidding-client/register", {
        method: "POST",
        body: { ...reg, name: reg.name.trim(), email: reg.email.trim(), phone: reg.phone.trim(), company_name: reg.company_name.trim() || null },
      });
      setNotice(r.message);
      setEmail(reg.email.trim());
      setPassword("");
      setReg({ name: "", email: "", phone: "", company_name: "", password: "", password_confirmation: "" });
      setTab("login");
    } catch (err) {
      setError({ text: errMsg(err) });
    } finally {
      setBusy(false);
    }
  };

  const setR = (k: keyof typeof reg) => (e: React.ChangeEvent<HTMLInputElement>) => setReg((p) => ({ ...p, [k]: e.target.value }));
  const pending = error?.code === "pending";

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* ============ Kiri: keterangan (latar merah) ============ */}
      <section aria-labelledby="brand-title" className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-red-600 via-red-600 to-red-800 px-6 py-10 text-white sm:px-10 lg:px-14 lg:py-14">
        {/* Dekorasi */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70" style={DOT_PATTERN} />
        <div aria-hidden="true" className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full border border-white/15" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full border border-white/10" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-red-500/40 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute right-10 top-1/2 h-40 w-40 rounded-full bg-white/10 blur-3xl motion-safe:animate-pulse" />

        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white ring-1 ring-white/25 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Data prospek dari Pindar.id
          </span>

          <h1 id="brand-title" className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-4xl">
            Pindar Bidding Data
          </h1>

          <p className="mt-4 max-w-md text-base leading-relaxed text-red-50">
            Beli data prospek yang disediakan Pindar.id dari berbagai produk keuangan. Pilih data yang kamu butuhkan, ambil dengan kuota bidding, lalu hubungi pemohon langsung.
          </p>

          <ul aria-label="Produk yang tersedia" className="mt-7 grid max-w-md grid-cols-2 gap-3">
            {PRODUCTS.map(({ label, icon: Icon }) => (
              <li key={label} className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-3 ring-1 ring-white/20 backdrop-blur">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-red-600">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-sm font-bold">{label}</span>
              </li>
            ))}
          </ul>

          <ul className="mt-9 hidden max-w-md space-y-5 lg:block">
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/25">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-extrabold">{title}</p>
                  <p className="text-sm text-red-100">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative mt-10 hidden text-xs font-semibold text-red-100 lg:block">© {new Date().getFullYear()} Pindar.id</p>
      </section>

      {/* ============ Kanan: logo + form ============ */}
      <section aria-label="Masuk atau daftar" className="flex items-center justify-center bg-gray-50 px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className={`${card} p-6 sm:p-7`}>
            <img src="/images/pindar.png" alt="Pindar.id" className="mx-auto h-10 w-auto object-contain sm:h-12" />

            <div role="tablist" className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-gray-100 p-1">
              {(["login", "register"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => {
                    setTab(t);
                    setError(null);
                  }}
                  className={`rounded-lg py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 ${
                    tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}>
                  {t === "login" ? "Masuk" : "Daftar"}
                </button>
              ))}
            </div>

            <div className="mt-5 text-center">
              <h2 className="text-lg font-extrabold text-gray-900">{tab === "login" ? "Masuk ke akun kamu" : "Buat akun client"}</h2>
              <p className="mt-0.5 text-sm text-gray-500">{tab === "login" ? "Gunakan email dan password yang terdaftar." : "Akun baru akan aktif setelah disetujui admin Pindar."}</p>
            </div>

            {notice && (
              <p role="status" className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {notice}
              </p>
            )}

            {error && (
              <div className="mt-4">
                {pending ? (
                  <p role="status" className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm font-semibold text-amber-800">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    {error.text}
                  </p>
                ) : (
                  <ErrorBox>{error.text}</ErrorBox>
                )}
              </div>
            )}

            {tab === "login" ? (
              <form onSubmit={submitLogin} className="mt-4 space-y-3">
                <FormField id="login-email" label="Email">
                  <input id="login-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={inputCls} />
                </FormField>
                <FormField id="login-password" label="Password">
                  <PasswordInput id="login-password" value={password} onChange={setPassword} autoComplete="current-password" />
                </FormField>
                <button type="submit" disabled={busy} className={`${btnPrimary} w-full`}>
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                  Masuk
                </button>
              </form>
            ) : (
              <form onSubmit={submitRegister} className="mt-4 space-y-3">
                <FormField id="reg-name" label="Nama lengkap">
                  <input id="reg-name" required maxLength={150} value={reg.name} onChange={setR("name")} autoComplete="name" className={inputCls} />
                </FormField>
                <FormField id="reg-email" label="Email">
                  <input id="reg-email" type="email" required maxLength={150} value={reg.email} onChange={setR("email")} autoComplete="email" className={inputCls} />
                </FormField>
                <FormField id="reg-phone" label="No. telepon / WA">
                  <input id="reg-phone" type="tel" required maxLength={30} value={reg.phone} onChange={setR("phone")} autoComplete="tel" className={inputCls} />
                </FormField>
                <FormField id="reg-company" label="Perusahaan (opsional)">
                  <input id="reg-company" maxLength={150} value={reg.company_name} onChange={setR("company_name")} autoComplete="organization" className={inputCls} />
                </FormField>
                <FormField id="reg-password" label="Password (min. 8 karakter)">
                  <PasswordInput id="reg-password" value={reg.password} onChange={(v) => setReg((p) => ({ ...p, password: v }))} autoComplete="new-password" minLength={8} />
                </FormField>
                <FormField id="reg-password2" label="Ulangi password">
                  <PasswordInput id="reg-password2" value={reg.password_confirmation} onChange={(v) => setReg((p) => ({ ...p, password_confirmation: v }))} autoComplete="new-password" minLength={8} />
                </FormField>
                <button type="submit" disabled={busy} className={`${btnPrimary} w-full`}>
                  {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                  Daftar
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
