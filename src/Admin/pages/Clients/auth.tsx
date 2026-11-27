import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { request, getToken } from "./api";
import { LOGOUT_EVENT, TOKEN_KEY } from "./config";

export interface ClientUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  company_name: string | null;
  status: "pending" | "active" | "inactive";
  quota: number;
}

interface AuthValue {
  client: ClientUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setQuota: (n: number) => void;
}

const AuthCtx = createContext<AuthValue | null>(null);

export function useAuth() {
  const v = useContext(AuthCtx);
  if (!v) throw new Error("useAuth harus dipakai di dalam AuthProvider");
  return v;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<ClientUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;

    if (!getToken()) {
      setReady(true);
    } else {
      request<{ data: ClientUser }>("/bidding-client/me")
        .then((r) => alive && setClient(r.data))
        .catch(() => alive && localStorage.removeItem(TOKEN_KEY))
        .finally(() => alive && setReady(true));
    }

    const onLogout = () => setClient(null);
    window.addEventListener(LOGOUT_EVENT, onLogout);

    return () => {
      alive = false;
      window.removeEventListener(LOGOUT_EVENT, onLogout);
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const r = await request<{ data: { token: string; client: ClientUser } }>("/bidding-client/login", { method: "POST", body: { email, password } });
    localStorage.setItem(TOKEN_KEY, r.data.token);
    setClient(r.data.client);
  }, []);

  const logout = useCallback(async () => {
    try {
      await request("/bidding-client/logout", { method: "POST" });
    } catch {
      /* token mungkin sudah tidak valid, tetap keluar */
    }
    localStorage.removeItem(TOKEN_KEY);
    setClient(null);
  }, []);

  const setQuota = useCallback((n: number) => setClient((c) => (c ? { ...c, quota: n } : c)), []);

  const value = useMemo(() => ({ client, ready, login, logout, setQuota }), [client, ready, login, logout, setQuota]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
