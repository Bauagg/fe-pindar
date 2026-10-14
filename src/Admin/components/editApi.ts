import { api } from "../api";
import type { Application } from "../types";

export interface ApplicantPayload {
  applicant_name: string;
  applicant_phone: string;
  applicant_age: number;
  applicant_address: string;
  applicant_type: string;
}

export interface AssetPayload {
  asset_ownership: string;
  certificate_type?: string;
  vehicle_type?: string;
  vehicle_brand?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  transmission?: string;
  financing_status?: string;
  previous_leasing?: string | null;
}

const put = <T>(path: string, payload: unknown) => api<T>(path, { method: "PUT", body: payload });

export const updateApplicant = (id: number, payload: ApplicantPayload) => put<{ data: Application }>(`/admin/multifinance/${id}/applicant`, payload);

export const updateAsset = (id: number, payload: AssetPayload) => put<{ data: Application }>(`/admin/multifinance/${id}/asset`, payload);
