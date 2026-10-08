import { API_URL } from "./config";

const TOKEN_KEY = "admin_token";

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string): void => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = (): void => localStorage.removeItem(TOKEN_KEY);

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
}

export async function api<T = unknown>(path: string, { method = "GET", body, headers }: ApiOptions = {}): Promise<T> {
  const token = getToken();
  const isForm = body instanceof FormData;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(body && !isForm ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? (isForm ? (body as FormData) : JSON.stringify(body)) : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // Token kadaluarsa / tidak valid -> paksa logout
    if (res.status === 401 && token) {
      clearToken();
      window.dispatchEvent(new Event("admin:unauthorized"));
    }
    throw new ApiError(data?.message || "Terjadi kesalahan. Coba lagi.", res.status, data?.errors);
  }

  return data as T;
}

/** Ambil pesan error paling berguna (validasi Laravel diutamakan). */
export function errorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const first = err.errors ? Object.values(err.errors)[0]?.[0] : undefined;
    return first || err.message;
  }
  return err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi.";
}
