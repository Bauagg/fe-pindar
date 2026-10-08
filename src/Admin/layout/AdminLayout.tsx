import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, FileText, LayoutDashboard, LogOut, Menu, ShieldCheck, Sparkles, X } from "lucide-react";
import { roleName, useAuth } from "../auth/AuthContext";
import { ADMIN_LOGIN_PATH } from "../config";

const PINDAR_LOGO = "/images/pindar.png";
const RETAILKU_LOGO = "/images/retailku_logo.png";

const NAV = [
  {
    to: "/admin/multi-finance",
    label: "Dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "/admin/multi-finance/applications",
    label: "Pengajuan",
    icon: FileText,
    end: false,
  },
];

type BrandType = "pindar" | "retailku";

function getBrand(role: string): BrandType {
  return role.toLowerCase() === "admin retailku" ? "retailku" : "pindar";
}

function Sidebar({ onNavigate, brand }: { onNavigate?: () => void; brand: BrandType }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const isRetailku = brand === "retailku";

  const handleLogout = async () => {
    const redirectPath = isRetailku ? "/retailku/login" : ADMIN_LOGIN_PATH;

    setLoggingOut(true);

    try {
      await logout(); // panggil API logout (butuh token), lalu hapus sesi
    } finally {
      localStorage.clear(); // hapus semua data tersimpan, termasuk token
      window.location.replace(redirectPath); // reload penuh, state bersih
    }
  };

  const theme = isRetailku
    ? {
        logo: RETAILKU_LOGO,
        brandName: "Retailku",
        subName: "Multifinance",
        badge: "RETAIL FINANCING",
        active: "bg-sky-50 text-sky-700",
        activeIcon: "bg-sky-100 text-sky-600",
        hover: "hover:bg-sky-50/70 hover:text-sky-700",
        avatar: "bg-sky-100 text-sky-700",
        logout: "hover:bg-sky-50 hover:text-sky-700",
        line: "from-sky-400 via-blue-500 to-sky-600",
      }
    : {
        logo: PINDAR_LOGO,
        brandName: "Pindar",
        subName: "Multifinance",
        badge: "PINDAR PLATFORM",
        active: "bg-red-50 text-red-700",
        activeIcon: "bg-red-100 text-red-600",
        hover: "hover:bg-red-50/70 hover:text-red-700",
        avatar: "bg-red-100 text-red-700",
        logout: "hover:bg-red-50 hover:text-red-700",
        line: "from-red-500 via-red-500 to-orange-400",
      };

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-white">
      {/* Top accent */}

      {loggingOut && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/95 backdrop-blur-md">
          <div className="flex flex-col items-center">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <div className={`absolute inset-0 animate-spin rounded-full border-4 border-gray-100 ${isRetailku ? "border-t-sky-500" : "border-t-red-500"}`} />

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                <img src={theme.logo} alt={theme.brandName} className="max-h-7 w-auto max-w-[34px] object-contain" />
              </div>
            </div>

            <p className="mt-5 text-sm font-extrabold text-gray-900">Keluar dari {theme.brandName}...</p>

            <p className="mt-1 text-xs font-medium text-gray-400">Mengamankan sesi Anda</p>
          </div>
        </div>
      )}
      <div className={`absolute left-0 right-0 top-0 h-1 bg-gradient-to-r ${theme.line}`} />

      {/* =========================================
          BRAND
      ========================================== */}
      <div className="px-5 pb-5 pt-7">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
            <img src={theme.logo} alt={theme.brandName} className="max-h-8 w-auto max-w-full object-contain" />
          </div>

          <div className="min-w-0 leading-tight">
            <p className="truncate text-[15px] font-black tracking-tight text-gray-900">{theme.brandName}</p>

            <p className="mt-0.5 text-xs font-semibold text-gray-400">{theme.subName}</p>
          </div>
        </div>

        {/* Role badge */}
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
          <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${isRetailku ? "bg-sky-100 text-sky-600" : "bg-red-100 text-red-600"}`}>
            <Sparkles className="h-3.5 w-3.5" />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Workspace</p>

            <p className="truncate text-xs font-extrabold text-gray-700">{theme.badge}</p>
          </div>
        </div>
      </div>

      {/* =========================================
          NAVIGATION
      ========================================== */}
      <nav className="flex-1 space-y-1 px-3" aria-label="Menu utama">
        <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-gray-400">Main Menu</p>

        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold transition-all duration-200 focus-visible:outline focus-visible:outline-2 ${isActive ? `${theme.active} shadow-sm` : `text-gray-500 ${theme.hover}`}`
            }>
            {({ isActive }) => (
              <>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${isActive ? theme.activeIcon : "bg-gray-50 text-gray-400 group-hover:bg-white group-hover:text-current"}`}>
                  <Icon className="h-[17px] w-[17px]" />
                </div>

                <span className="flex-1">{label}</span>

                {isActive && <ArrowRight className="h-4 w-4 opacity-60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* =========================================
          USER AREA
      ========================================== */}
      <div className="border-t border-gray-100 p-3">
        <div className="mb-2 rounded-2xl bg-gray-50 p-3">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black ${theme.avatar}`}>{(user?.name || "A").charAt(0).toUpperCase()}</div>

            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-extrabold text-gray-900">{user?.name || "Admin"}</p>

              <p className="mt-1 truncate text-[11px] font-semibold text-gray-400">{roleName(user)}</p>
            </div>
          </div>
        </div>

        <button onClick={handleLogout} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-gray-500 transition ${theme.logout} focus-visible:outline focus-visible:outline-2`}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 transition group-hover:bg-white">
            <LogOut className="h-4 w-4" />
          </div>
          Keluar
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { user } = useAuth();

  const role = roleName(user);

  const brand = useMemo<BrandType>(() => {
    return getBrand(role);
  }, [role]);

  const isRetailku = brand === "retailku";

  const theme = isRetailku
    ? {
        logo: RETAILKU_LOGO,
        name: "Retailku",
        subtitle: "Multifinance",
        mobileBg: "bg-sky-600",
        mobileHover: "hover:bg-sky-50",
        mobileText: "text-sky-700",
        gradient: "from-sky-500 via-blue-500 to-sky-600",
        dot: "bg-sky-400",
      }
    : {
        logo: PINDAR_LOGO,
        name: "Pindar",
        subtitle: "Multifinance",
        mobileBg: "bg-red-600",
        mobileHover: "hover:bg-red-50",
        mobileText: "text-red-700",
        gradient: "from-red-500 via-red-500 to-orange-400",
        dot: "bg-red-500",
      };

  // Tutup drawer saat pindah halaman
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[270px] border-r border-gray-100 bg-white lg:block">
        <Sidebar brand={brand} />
      </aside>

      {/* =====================================================
          MOBILE DRAWER
      ====================================================== */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" onClick={() => setOpen(false)} />

          {/* Drawer */}
          <aside className="absolute inset-y-0 left-0 w-[290px] overflow-hidden bg-white shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              aria-label="Tutup menu"
              className="absolute right-3 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800">
              <X className="h-4 w-4" />
            </button>

            <Sidebar brand={brand} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      {/* =====================================================
          MAIN AREA
      ====================================================== */}
      <div className="lg:pl-[270px]">
        {/* ================================================
            MOBILE TOPBAR
        ================================================= */}
        <header className="sticky top-0 z-20 border-b border-gray-100 bg-white/90 backdrop-blur-xl lg:hidden">
          <div className="flex h-[68px] items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setOpen(true)} aria-label="Buka menu" className={`flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm transition ${theme.mobileBg}`}>
                <Menu className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-100 bg-white p-1.5 shadow-sm">
                  <img src={theme.logo} alt={theme.name} className="max-h-6 w-auto object-contain" />
                </div>

                <div className="leading-tight">
                  <p className="text-sm font-black text-gray-900">{theme.name}</p>

                  <p className="text-[10px] font-semibold text-gray-400">{theme.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-3 py-1.5">
              <span className={`h-2 w-2 rounded-full ${theme.dot}`} />
              <span className="max-w-[100px] truncate text-[10px] font-bold text-gray-500">{roleName(user)}</span>
            </div>
          </div>

          {/* Accent */}
          <div className={`h-[2px] bg-gradient-to-r ${theme.gradient}`} />
        </header>

        {/* ================================================
            PAGE CONTENT
        ================================================= */}
        <main className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8 xl:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
