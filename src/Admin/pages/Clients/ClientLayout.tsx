import { useEffect, useState } from "react";
import { Link, Navigate, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Coins, Database, LayoutDashboard, Loader2, LogOut } from "lucide-react";
import { request } from "./api";
import { ClientUser, useAuth } from "./auth";
import { BASE } from "./config";
import { Spinner } from "./ui";

export default function ClientLayout() {
  const { client, ready, logout, setQuota } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  // Sinkronkan kuota terbaru saat dasbor dibuka (mis. admin baru menambah kuota).
  useEffect(() => {
    if (!client) return;
    request<{ data: ClientUser }>("/bidding-client/me")
      .then((r) => setQuota(r.data.quota))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client?.id]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!client) return <Navigate to={`${BASE}/login`} state={{ from: location.pathname }} replace />;

  const doLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate(`${BASE}/login`, { replace: true });
  };

  const navCls = ({ isActive }: { isActive: boolean }) =>
    `relative inline-flex items-center gap-2 px-4 py-3 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-red-500 ${
      isActive ? "text-red-600 after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-red-600" : "text-gray-500 hover:text-gray-800"
    }`;

  const quotaEmpty = client.quota <= 0;
  const initial = client.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-30 bg-white shadow-sm">
        {/* Aksen merah di paling atas */}
        <div aria-hidden="true" className="h-1 bg-gradient-to-r from-red-700 via-red-600 to-red-500" />

        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to={BASE} aria-label="Pindar Bidding Data, ke ringkasan" className="flex min-w-0 items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500">
            <img src="/images/pindar.png" alt="Pindar.id" className="h-8 w-auto shrink-0 object-contain sm:h-9" />
            <span aria-hidden="true" className="hidden h-7 w-px bg-gray-200 sm:block" />
            <span className="hidden min-w-0 sm:block">
              <span className="block truncate text-sm font-extrabold leading-tight text-gray-900">Pindar Bidding Data</span>
              <span className="block truncate text-xs leading-tight text-gray-400">Data prospek dari Pindar.id</span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span
              title="Sisa kuota bidding"
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold ring-1 ${quotaEmpty ? "bg-red-50 text-red-700 ring-red-200" : "bg-emerald-50 text-emerald-700 ring-emerald-200"}`}>
              <Coins className="h-3.5 w-3.5" aria-hidden="true" />
              Kuota {client.quota}
            </span>

            <div className="flex items-center gap-2.5 border-l border-gray-100 pl-2 sm:pl-3">
              <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-extrabold text-gray-600">
                {initial}
              </span>
              <div className="hidden min-w-0 md:block">
                <p className="max-w-[10rem] truncate text-sm font-bold leading-tight text-gray-900">{client.name}</p>
                <p className="max-w-[10rem] truncate text-xs leading-tight text-gray-400">{client.company_name || client.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={doLogout}
              disabled={loggingOut}
              aria-label="Keluar"
              title="Keluar"
              className="rounded-xl p-2.5 text-gray-500 ring-1 ring-gray-200 hover:bg-gray-50 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 disabled:opacity-50">
              {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <nav aria-label="Menu utama" className="border-t border-gray-100">
          <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-1 sm:px-3">
            <NavLink to={BASE} end className={navCls}>
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              Ringkasan
            </NavLink>
            <NavLink to={`${BASE}/bidding`} className={navCls}>
              <Database className="h-4 w-4" aria-hidden="true" />
              Data bidding
            </NavLink>
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-gray-400">
          <img src="/images/pindar.png" alt="Pindar.id" className="h-5 w-auto object-contain opacity-80" />
          <p>© {new Date().getFullYear()} Pindar.id. Data bidding hanya untuk client terdaftar.</p>
        </div>
      </footer>
    </div>
  );
}
