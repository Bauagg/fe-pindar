import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, clearToken, getToken, setToken } from "../api";
import type { User } from "../types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  return ctx;
}

// Sesuaikan kalau bentuk response AuthController kamu berbeda.
/* eslint-disable @typescript-eslint/no-explicit-any */
const pickUser = (res: any): User => res?.user ?? res?.data?.user ?? res?.data ?? res;
const pickToken = (res: any): string | undefined => res?.token ?? res?.access_token ?? res?.data?.token ?? res?.data?.access_token;
/* eslint-enable @typescript-eslint/no-explicit-any */

export function roleName(user: User | null): string {
  const r = user?.role;
  return (typeof r === "string" ? r : r?.name || r?.slug) || "Admin";
}

/** "Super Admin" / "super-admin" / "super_admin" -> "super_admin" */
export function roleSlug(user: User | null): string {
  const r = user?.role;
  const raw = typeof r === "string" ? r : r?.slug || r?.name || "";
  return raw
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

/** Hanya super_admin & admin: boleh atur akses role dan semua status. Role lain (mis. admin retail) dibatasi. */
const FULL_ADMIN_ROLES = ["super_admin", "admin"];
export const isFullAdmin = (user: User | null): boolean => FULL_ADMIN_ROLES.includes(roleSlug(user));

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(!!getToken());

  const logout = useCallback(async () => {
    try {
      await api("/auth/logout", { method: "POST" });
    } catch {
      /* abaikan, tetap logout di sisi FE */
    }
    clearToken();
    setUser(null);
  }, []);

  // Cek sesi saat halaman dibuka
  useEffect(() => {
    if (!getToken()) return;
    api("/auth/me")
      .then((res) => setUser(pickUser(res)))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  // Dipanggil dari api.ts saat server balas 401
  useEffect(() => {
    const onUnauthorized = () => setUser(null);
    window.addEventListener("admin:unauthorized", onUnauthorized);
    return () => window.removeEventListener("admin:unauthorized", onUnauthorized);
  }, []);

  const login = async (identifier: string, password: string) => {
    const res = await api<unknown>("/auth/login", { method: "POST", body: { login: identifier, password } });
    const token = pickToken(res);
    if (!token) throw new Error("Token tidak ditemukan di response login.");
    setToken(token);

    const me = (res as { user?: User; data?: { user?: User } })?.user ?? (res as { data?: { user?: User } })?.data?.user;
    setUser(me ?? pickUser(await api("/auth/me")));
  };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
