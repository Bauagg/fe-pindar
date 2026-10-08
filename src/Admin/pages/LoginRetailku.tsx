import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, ShieldCheck, Sparkles, User } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { ApiError } from "../api";

const PINDAR_LOGO = "/images/pindar.png";
const RETAILKU_LOGO = "/images/retailku_logo.png";

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

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

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

  return (
    <>
      {/* Fix browser autofill */}
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #f8fafc inset !important;
          -webkit-text-fill-color: #0f172a !important;
          transition: background-color 9999s ease-in-out 0s;
        }
      `}</style>

      <div className="min-h-screen bg-[#f6f8fc]">
        <div className="grid min-h-screen min-[700px]:grid-cols-[0.92fr_1.08fr]">
          {/* =====================================================
              LEFT BRAND PANEL
          ====================================================== */}
          <section className="relative hidden min-h-screen overflow-hidden min-[700px]:flex">
            {/* Main background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#dc2626] via-[#ef4444] to-[#38bdf8]" />

            {/* Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.20),transparent_30%),radial-gradient(circle_at_90%_85%,rgba(14,165,233,0.35),transparent_35%)]" />

            {/* Glow */}
            <div className="absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-red-300/20 blur-3xl" />
            <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-sky-200/25 blur-3xl" />

            {/* Decorative circles */}
            <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full border border-white/10" />
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border border-white/10" />
            <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full border border-white/10" />

            <div className="relative z-10 flex w-full flex-col justify-between p-8 xl:p-12">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-3">
                  {/* Pindar */}
                  <div className="flex h-14 items-center rounded-2xl bg-white px-4 shadow-xl shadow-red-900/10">
                    <img src={PINDAR_LOGO} alt="Pindar" className="h-8 w-auto object-contain" />
                  </div>

                  {/* X */}
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/10 text-sm font-black text-white backdrop-blur-md">×</div>

                  {/* Retailku */}
                  <div className="flex h-14 items-center rounded-2xl bg-white px-4 shadow-xl shadow-sky-900/10">
                    <img src={RETAILKU_LOGO} alt="Retailku" className="h-8 w-auto object-contain" />
                  </div>
                </div>

                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5 text-sky-100" />
                  <span className="text-[11px] font-extrabold tracking-[0.12em] text-white">STRATEGIC COLLABORATION</span>
                </div>
              </div>

              {/* Center */}
              <div className="max-w-xl">
                <p className="mb-4 text-sm font-bold text-white/70">PINDAR × RETAILKU</p>

                <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-white xl:text-5xl">
                  Pembiayaan retail
                  <br />
                  <span className="text-sky-100">lebih mudah & terintegrasi.</span>
                </h1>

                <p className="mt-5 max-w-md text-sm leading-6 text-white/75 xl:text-base">Satu ekosistem untuk mengelola pengajuan multifinance, memantau proses, dan mempercepat keputusan pembiayaan.</p>

                {/* Collaboration card */}
                <div className="mt-8 rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white">
                      <img src={PINDAR_LOGO} alt="Pindar" className="max-h-7 w-auto object-contain" />
                    </div>

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
                      <ArrowRight className="h-4 w-4" />
                    </div>

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white">
                      <img src={RETAILKU_LOGO} alt="Retailku" className="max-h-7 w-auto object-contain" />
                    </div>

                    <div className="ml-1 min-w-0">
                      <p className="truncate text-sm font-extrabold text-white">Pindar × Retailku</p>

                      <p className="mt-0.5 text-xs text-white/60">Smarter retail financing</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-white">Multifinance Platform</p>
                  <p className="mt-1 text-[11px] text-white/55">Internal access only</p>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md">
                  <ShieldCheck className="h-3.5 w-3.5 text-sky-100" />
                  <span className="text-[11px] font-bold text-white/80">Secure</span>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              RIGHT LOGIN
          ====================================================== */}
          <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-8 sm:px-8">
            {/* Background decoration */}
            <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-sky-100/70 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-red-100/70 blur-3xl" />

            <div className="relative z-10 w-full max-w-[430px]">
              {/* Mobile brand */}
              <div className="mb-8 min-[700px]:hidden">
                <div className="flex items-center justify-center gap-3">
                  <div className="flex h-12 items-center rounded-xl border border-gray-100 bg-white px-3 shadow-sm">
                    <img src={PINDAR_LOGO} alt="Pindar" className="h-7 w-auto" />
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-sky-500 text-sm font-black text-white">×</div>

                  <div className="flex h-12 items-center rounded-xl border border-gray-100 bg-white px-3 shadow-sm">
                    <img src={RETAILKU_LOGO} alt="Retailku" className="h-7 w-auto" />
                  </div>
                </div>
              </div>

              {/* Heading */}
              <div className="text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-100 bg-white px-4 py-2 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-gradient-to-r from-red-500 to-sky-400" />

                  <span className="text-[11px] font-extrabold tracking-wide text-gray-600">PINDAR × RETAILKU</span>
                </div>

                <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-[34px]">Selamat datang kembali</h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">Masuk untuk mengelola pengajuan multifinance Anda.</p>
              </div>

              {/* Login Card */}
              <div className="mt-8 overflow-hidden rounded-[28px] border border-gray-200/80 bg-white shadow-[0_25px_70px_-30px_rgba(15,23,42,0.28)]">
                {/* Top gradient line */}
                <div className="h-1.5 bg-gradient-to-r from-red-500 via-red-400 to-sky-400" />

                <div className="p-6 sm:p-8">
                  <form onSubmit={onSubmit} className="space-y-5" noValidate>
                    {/* Error */}
                    {error && (
                      <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-5 text-red-700">
                        {error}
                      </div>
                    )}

                    {/* Email */}
                    <div>
                      <label htmlFor="login" className="mb-2.5 block text-sm font-bold text-gray-900">
                        Email atau nomor telepon
                      </label>

                      <div className="relative">
                        <div className="pointer-events-none absolute left-3.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl bg-red-50">
                          <User className="h-4 w-4 text-red-500" />
                        </div>

                        <input
                          id="login"
                          type="text"
                          autoComplete="username"
                          required
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder="admin@pindar.id"
                          className="h-12 w-full rounded-2xl border border-gray-200 bg-slate-50 pl-14 pr-4 text-sm font-semibold text-gray-900 outline-none transition-all placeholder:font-medium placeholder:text-gray-400 hover:border-gray-300 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-50"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <div className="mb-2.5 flex items-center justify-between">
                        <label htmlFor="password" className="text-sm font-bold text-gray-900">
                          Password
                        </label>
                      </div>

                      <div className="relative">
                        <div className="pointer-events-none absolute left-3.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl bg-sky-50">
                          <Lock className="h-4 w-4 text-sky-500" />
                        </div>

                        <input
                          id="password"
                          type={show ? "text" : "password"}
                          autoComplete="current-password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Masukkan password"
                          className="h-12 w-full rounded-2xl border border-gray-200 bg-slate-50 pl-14 pr-12 text-sm font-semibold text-gray-900 outline-none transition-all placeholder:font-medium placeholder:text-gray-400 hover:border-gray-300 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-50"
                        />

                        <button
                          type="button"
                          onClick={() => setShow((v) => !v)}
                          aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
                          className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700">
                          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Button */}
                    <button
                      type="submit"
                      disabled={loading || !identifier || !password}
                      className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 via-red-500 to-sky-500 text-sm font-extrabold text-white shadow-lg shadow-red-200/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-200/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0">
                      <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity group-hover:opacity-100" />

                      {loading ? (
                        <>
                          <Loader2 className="relative h-4 w-4 animate-spin" />
                          <span className="relative">Memeriksa...</span>
                        </>
                      ) : (
                        <>
                          <span className="relative">Masuk ke Dashboard</span>

                          <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Security */}
              <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-gray-400">
                <ShieldCheck className="h-4 w-4 text-gray-400" />
                <span>Secure access • Pindar × Retailku</span>
              </div>

              {/* Mobile footer */}
              <p className="mt-5 text-center text-[11px] text-gray-400 min-[700px]:hidden">Internal Multifinance Platform</p>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
