import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, User } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { ApiError } from "../api";

const LOGO_SRC = "/images/pindar.png";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
  const redirectTo = from || "/admin";

  if (user) return <Navigate to={redirectTo} replace />;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(identifier.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const e = err as ApiError;
      setError(e.status === 422 || e.status === 401 ? "Email/nomor telepon atau password salah. Periksa lagi lalu coba masuk." : e.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm font-semibold text-gray-800 placeholder:font-medium placeholder:text-gray-400 outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100";

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[1.05fr_1fr]">
      {/* PANEL KIRI */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-red-700 p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white px-3 py-2">
            <img src={LOGO_SRC} alt="Pindar" className="h-8 w-auto" />
          </div>
          <span className="text-lg font-extrabold">Pindar Multifinance</span>
        </div>

        <div>
          <h1 className="max-w-md text-4xl font-extrabold leading-tight">Semua pengajuan Multifinance, dari masuk sampai disetujui.</h1>
          <p className="mt-4 max-w-md text-red-100">Pantau status, minta dokumen tambahan, dan putuskan pengajuan dalam satu panel.</p>
        </div>

        <p className="text-sm text-red-200">Khusus tim internal Pindar.</p>

        <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-red-600/60" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-red-600/40" />
      </aside>

      {/* FORM */}
      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <img src={LOGO_SRC} alt="Pindar" className="h-10 w-auto" />
            <span className="text-lg font-extrabold text-gray-900">Admin</span>
          </div>

          <h2 className="text-2xl font-extrabold text-gray-900">Dashboard Multifinance</h2>
          <p className="mt-2 text-sm text-gray-500">Masuk ke Dashboard Multifinance.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
            {error && (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="login" className="mb-2 block text-sm font-bold text-gray-900">
                Email atau nomor telepon
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                <input id="login" type="text" autoComplete="username" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="admin@pindar.id atau 081234567890" className={inputCls} />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-bold text-gray-900">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                <input
                  id="password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className={`${inputCls} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 hover:text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !identifier || !password}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-sm font-extrabold text-white shadow-lg shadow-red-200 transition hover:from-red-600 hover:to-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-60">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Memeriksa..." : "Masuk"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
