/** SESUAIKAN dengan base URL di api.ts admin kamu (harus sudah termasuk "/api"). */
/** Base URL API client, diambil dari .env (CRA: REACT_APP_*). */
export const API_BASE: string = (process.env.REACT_APP_API_BASE_URL_CLIENT ?? "").replace(/\/$/, "");
/** Semua halaman client dipasang di bawah path ini: <Route path="/client/*" ... /> */
export const BASE = "/client";

export const TOKEN_KEY = "bidding_client_token";
export const LOGOUT_EVENT = "bidding-client:logout";
