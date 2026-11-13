import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import { ArrowRight, BarChart3, Building2, CheckCircle2, ChevronDown, FileText, LayoutDashboard, List, LogOut, Menu, Sparkles, X } from "lucide-react";
import { roleName, useAuth } from "../auth/AuthContext";
import { ADMIN_LOGIN_PATH } from "../config";
import { FaMoneyBill } from "react-icons/fa";

const PINDAR_LOGO = "/images/pindar.png";
const RETAILKU_LOGO = "/images/retailku_logo.png";

/* =========================================
   ROLE & AKSES MENU
========================================== */

// Normalisasi: "Super Admin" / "super-admin" / "SUPER_ADMIN" -> "super_admin"
export const normalizeRole = (role?: string | null) =>
  (role || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

const FULL_ADMIN = ["super_admin", "admin"];

type NavChild = {
  to?: string; // grup (yang punya children) tidak butuh `to`
  label: string;
  icon: React.ElementType;
  roles?: string[]; // kosong = ikut roles induk
  children?: NavChild[]; // sub-menu level 3
};

type NavItem = {
  to?: string;
  label: string;
  icon: React.ElementType;
  end?: boolean;
  roles?: string[]; // kosong/undefined = semua role boleh
  children?: NavChild[];
};

const DASHBOARD_PATH = "/admin/multi-finance";

export const NAV: NavItem[] = [
  {
    to: DASHBOARD_PATH,
    label: "Dashboard",
    icon: LayoutDashboard,
    end: true,
    // semua role boleh
  },
  {
    to: "/admin/multi-finance/applications",
    label: "Pengajuan",
    icon: FileText,
    roles: ["admin_retailku", "admin_moladin", "admin_cnaf", "admin_sinarmas", "admin_taf"],
  },
  {
    label: "Multifinance",
    icon: Building2,
    roles: FULL_ADMIN,
    // roles belum dibatasi -> semua role boleh.
    // Kalau mau dibatasi: roles: ["super_admin", "admin", "admin_retailku"],
    children: [
      { to: "/admin/multifinance/summary", label: "Summary", icon: BarChart3 },
      { to: "/admin/multifinance/list-pengajuan", label: "List Pengajuan", icon: List },
      { to: "/admin/multifinance/pengajuan-disetujui", label: "Pengajuan Disetujui", icon: CheckCircle2 },
      { to: "/admin/multifinance/pencairan", label: "Disbursement", icon: FaMoneyBill },
      {
        label: "Kreditur Multifinance",
        icon: Building2,
        children: [
          { to: "/admin/multifinance/retailku", label: "Retailku", icon: Building2 },
          { to: "/admin/multifinance/moladin", label: "Moladin", icon: Building2 },
          { to: "/admin/multifinance/sinarmas", label: "Sinarmas", icon: Building2 },
          { to: "/admin/multifinance/cnaf", label: "CNAF", icon: Building2 },
          { to: "/admin/multifinance/taf", label: "TAF", icon: Building2 },
        ],
      },
    ],
  },
];

const canAccess = (roles: string[] | undefined, roleKey: string) => !roles || roles.length === 0 || roles.includes(roleKey);

// Cek apakah pathname cocok dengan sebuah `to`
const isActivePath = (pathname: string, to?: string) => !!to && (pathname === to || pathname.startsWith(to + "/"));

// Cek apakah sebuah child (atau turunannya) sedang aktif
const hasActiveChild = (pathname: string, c: NavChild): boolean => isActivePath(pathname, c.to) || !!c.children?.some((x) => hasActiveChild(pathname, x));

// Ratakan semua leaf (menu yang punya `to`) beserta roles efektifnya
const flattenChildren = (children: NavChild[], inheritedRoles?: string[]): { to: string; roles?: string[] }[] =>
  children.flatMap((c) => {
    const roles = c.roles ?? inheritedRoles;
    const self = c.to ? [{ to: c.to, roles }] : [];
    return [...self, ...(c.children ? flattenChildren(c.children, roles) : [])];
  });

// Cek akses halaman berdasarkan path (dipakai untuk guard, supaya URL manual juga ke-block)
export function isPathAllowed(pathname: string, roleKey: string): boolean {
  for (const item of NAV) {
    if (item.children) {
      for (const leaf of flattenChildren(item.children, item.roles)) {
        if (isActivePath(pathname, leaf.to)) {
          return canAccess(leaf.roles, roleKey);
        }
      }
    }

    if (item.to && item.to !== DASHBOARD_PATH && isActivePath(pathname, item.to)) {
      return canAccess(item.roles, roleKey);
    }
  }

  return true; // dashboard & path lain
}

/* =========================================
   BRAND
========================================== */

type BrandType = "pindar" | "retailku";

function getBrand(role: string): BrandType {
  return normalizeRole(role) === "admin_retailku" ? "retailku" : "pindar";
}

/* =========================================
   SIDEBAR
========================================== */

function Sidebar({ onNavigate, brand }: { onNavigate?: () => void; brand: BrandType }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);
  const isRetailku = brand === "retailku";
  const roleKey = normalizeRole(roleName(user));

  // Filter children secara rekursif sesuai role (dari API profile)
  const filterChildren = (children: NavChild[], inheritedRoles?: string[]): NavChild[] =>
    children
      .filter((c) => canAccess(c.roles ?? inheritedRoles, roleKey))
      .map((c) => (c.children ? { ...c, children: filterChildren(c.children, c.roles ?? inheritedRoles) } : c))
      .filter((c) => !c.children || c.children.length > 0);

  // Filter menu sesuai role
  const visibleNav = useMemo(
    () =>
      NAV.filter((i) => canAccess(i.roles, roleKey))
        .map((i) => (i.children ? { ...i, children: filterChildren(i.children, i.roles) } : i))
        .filter((i) => !i.children || i.children.length > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [roleKey]
  );

  // Submenu otomatis terbuka kalau halaman aktif ada di dalamnya
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [openSubGroup, setOpenSubGroup] = useState<string | null>(null);

  useEffect(() => {
    const group = visibleNav.find((i) => i.children?.some((c) => hasActiveChild(pathname, c)));

    if (group) {
      setOpenGroup(group.label);

      const sub = group.children!.find((c) => c.children && hasActiveChild(pathname, c));
      if (sub) setOpenSubGroup(sub.label);
    }
  }, [pathname, visibleNav]);

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

      {/* Top accent */}
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
      <nav className="flex-1 space-y-1 overflow-y-auto px-3" aria-label="Menu utama">
        <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-gray-400">Main Menu</p>

        {visibleNav.map((item) => {
          const Icon = item.icon;

          // ===== Menu dengan submenu =====
          if (item.children) {
            const isOpen = openGroup === item.label;
            const childActive = item.children.some((c) => hasActiveChild(pathname, c));

            return (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => setOpenGroup(isOpen ? null : item.label)}
                  aria-expanded={isOpen}
                  className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold transition-all duration-200 focus-visible:outline focus-visible:outline-2 ${
                    childActive ? `${theme.active} shadow-sm` : `text-gray-500 ${theme.hover}`
                  }`}>
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${childActive ? theme.activeIcon : "bg-gray-50 text-gray-400 group-hover:bg-white group-hover:text-current"}`}>
                    <Icon className="h-[17px] w-[17px]" />
                  </div>

                  <span className="flex-1 text-left">{item.label}</span>

                  <ChevronDown className={`h-4 w-4 opacity-60 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                  <div className="ml-[26px] mt-1 space-y-0.5 border-l border-gray-100 pl-3">
                    {item.children.map((c) => {
                      // ===== Sub-grup (level 3) =====
                      if (c.children) {
                        const subOpen = openSubGroup === c.label;
                        const subActive = hasActiveChild(pathname, c);

                        return (
                          <div key={c.label}>
                            <button
                              type="button"
                              onClick={() => setOpenSubGroup(subOpen ? null : c.label)}
                              aria-expanded={subOpen}
                              className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-semibold transition focus-visible:outline focus-visible:outline-2 ${subActive ? theme.active : `text-gray-500 ${theme.hover}`}`}>
                              <span className="flex-1 text-left">{c.label}</span>

                              <ChevronDown className={`h-3.5 w-3.5 opacity-60 transition-transform ${subOpen ? "rotate-180" : ""}`} />
                            </button>

                            {subOpen && (
                              <div className="ml-3 mt-0.5 space-y-0.5 border-l border-gray-100 pl-3">
                                {c.children.map((s) => (
                                  <NavLink
                                    key={s.to}
                                    to={s.to!}
                                    onClick={onNavigate}
                                    className={({ isActive }) => `block rounded-xl px-3 py-2 text-[12.5px] font-semibold transition focus-visible:outline focus-visible:outline-2 ${isActive ? theme.active : `text-gray-500 ${theme.hover}`}`}>
                                    {s.label}
                                  </NavLink>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      }

                      // ===== Menu biasa (level 2) =====
                      return (
                        <NavLink
                          key={c.to}
                          to={c.to!}
                          onClick={onNavigate}
                          className={({ isActive }) => `block rounded-xl px-3 py-2 text-[13px] font-semibold transition focus-visible:outline focus-visible:outline-2 ${isActive ? theme.active : `text-gray-500 ${theme.hover}`}`}>
                          {c.label}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // ===== Menu biasa =====
          return (
            <NavLink
              key={item.to}
              to={item.to!}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold transition-all duration-200 focus-visible:outline focus-visible:outline-2 ${isActive ? `${theme.active} shadow-sm` : `text-gray-500 ${theme.hover}`}`
              }>
              {({ isActive }) => (
                <>
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${isActive ? theme.activeIcon : "bg-gray-50 text-gray-400 group-hover:bg-white group-hover:text-current"}`}>
                    <Icon className="h-[17px] w-[17px]" />
                  </div>

                  <span className="flex-1">{item.label}</span>

                  {isActive && <ArrowRight className="h-4 w-4 opacity-60" />}
                </>
              )}
            </NavLink>
          );
        })}
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

/* =========================================
   ADMIN LAYOUT
========================================== */

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  // `loading` = flag saat profile masih di-fetch. Sesuaikan nama field-nya dengan AuthContext kamu.
  const { user, loading } = useAuth() as ReturnType<typeof useAuth> & { loading?: boolean };

  const role = roleName(user);
  const roleKey = normalizeRole(role);

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

  // Tunggu profile selesai di-load supaya tidak ke-redirect salah
  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8fc]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-red-500" />
      </div>
    );
  }

  // Guard halaman: role tidak punya akses -> balik ke dashboard
  if (!isPathAllowed(pathname, roleKey)) {
    return <Navigate to={DASHBOARD_PATH} replace />;
  }

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
