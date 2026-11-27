import { API_BASE, LOGOUT_EVENT, TOKEN_KEY } from "./config";

export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export async function request<T>(path: string, opts: { method?: string; body?: unknown } = {}): Promise<T> {
  const token = getToken();

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: opts.method ?? "GET",
      headers: {
        Accept: "application/json",
        ...(opts.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
  } catch {
    throw new ApiError("Tidak bisa terhubung ke server. Periksa koneksi internet Anda.", 0);
  }

  let json: any = null;
  try {
    json = await res.json();
  } catch {
    /* body kosong / bukan JSON */
  }

  if (!res.ok) {
    if (res.status === 401 && token) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event(LOGOUT_EVENT));
    }

    const firstValidation = json?.errors ? (Object.values(json.errors)[0] as string[] | undefined)?.[0] : null;
    throw new ApiError(firstValidation ?? json?.message ?? "Terjadi kesalahan. Coba lagi.", res.status, json?.code);
  }

  return json as T;
}

export const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Terjadi kesalahan. Coba lagi.");
