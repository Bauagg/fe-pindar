/**
 * SATU-SATUNYA file yang menyentuh kode FE multifinance yang sudah ada.
 * Kalau path import / signature berbeda di project kamu, cukup edit file ini.
 * Posisi default: src/features/finance-apps/shared.ts
 */
import type { ComponentType, ReactNode } from "react";

import { api as apiRaw, errorMessage as errorMessageRaw } from "../../api";
import StatusBadgeRaw from "../../components/StatusBadge";
import ActivityPanelRaw from "../../components/ActivityPanel";
import ActivityNoteRaw, { UnreadDot as UnreadDotRaw } from "../../components/ActivityNote";
import FieldValueRaw from "../../components/FieldValue";
import { STATUS as STATUS_RAW } from "../../constants";
import { card as cardRaw, inputCls as inputClsRaw } from "../../components/ui";
import * as Dash from "../../pages/MultifinanceDashboard";

export { useAuth, isFullAdmin } from "../../auth/AuthContext";

/* ---------- API ---------- */
export const api = apiRaw as unknown as <T>(path: string, init?: RequestInit) => Promise<T>;
export const errorMessage = errorMessageRaw as unknown as (e: unknown) => string;

/**
 * ADAPTER kirim data. Sesuaikan dengan signature api() kamu:
 * - asumsi 1: api(path, { method, body: string JSON, headers })
 * - asumsi 2: body FormData dikirim apa adanya (Content-Type diurus browser)
 * Kalau api() kamu menerima object langsung / set header sendiri, ubah dua fungsi ini saja.
 */
export function apiJson<T>(path: string, method: "POST" | "PUT" | "DELETE", body?: unknown) {
  // api() sudah JSON.stringify + set Content-Type sendiri, jadi kirim object apa adanya
  return (apiRaw as unknown as (p: string, o: { method: string; body?: unknown }) => Promise<T>)(path, { method, body });
}

export function apiForm<T>(path: string, form: FormData) {
  return api<T>(path, { method: "POST", body: form });
}

/* ---------- Komponen tampilan yang sudah ada ---------- */
export const StatusBadge = StatusBadgeRaw as unknown as ComponentType<{ value: string }>;
export const ActivityPanel = ActivityPanelRaw as unknown as ComponentType<{ activities: unknown[] }>;
export const ActivityNote = ActivityNoteRaw as unknown as ComponentType<{ activity: unknown; unread?: boolean }>;
export const UnreadDot = UnreadDotRaw as unknown as ComponentType;
export const FieldValue = FieldValueRaw as unknown as ComponentType<{ type: string; value: string | null; fileUrl: string | null; label: string }>;

export const STATUS = STATUS_RAW as unknown as Record<string, { label: string }>;
export const card = cardRaw as string;
export const inputCls = inputClsRaw as string;

/* ---------- Grafik dari MultifinanceDashboard ---------- */
type Icon = ComponentType<{ className?: string }>;
export type Point = { label: string; value: number };

export const BarChart = Dash.BarChart as unknown as ComponentType<{ data: Point[] }>;
export const LineChart = Dash.LineChart as unknown as ComponentType<{ data: Point[] }>;
export const Donut = Dash.Donut as unknown as ComponentType<{ slices: { label: string; value: number; color: string }[]; total: number }>;
export const CompareCard = Dash.CompareCard as unknown as ComponentType<{ title: string; current: number; previous: number; previousLabel: string }>;
export const Delta = Dash.Delta as unknown as ComponentType<{ current: number; previous: number }>;
export const Panel = Dash.Panel as unknown as ComponentType<{ title: string; icon: Icon; children: ReactNode }>;
export const STATUS_CARDS = Dash.STATUS_CARDS as unknown as { key: string; label: string; icon: Icon; tone: string; color: string }[];
