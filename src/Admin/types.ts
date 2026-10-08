export type StatusKey = "pending" | "on_progress" | "approved" | "rejected";
export type FieldType = "text" | "textarea" | "number" | "date" | "file";

export interface Role {
  id?: number;
  name?: string;
  slug?: string;
}

export interface RoleItem {
  id: number;
  name: string;
  slug: string;
}

export interface User {
  id: number;
  name: string;
  email?: string;
  role?: string | Role;
}

export interface FormField {
  id: number;
  label: string;
  name: string;
  field_type: FieldType;
  is_required: boolean;
  sort_order: number;
  value: string | null;
  file_url: string | null;
}

export interface ApprovalInfo {
  id: number;
  label: string;
  field_type: FieldType;
  value: string | null;
  file_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ActivityMeta {
  info_label?: string;
  from?: StatusKey;
  to?: StatusKey;
  reason?: string | null;
  field_id?: number;
  field_label?: string;
  field_type?: FieldType;
}

export interface Activity {
  id: number;
  action: "created" | "status_changed" | "field_filled" | "field_updated" | string;
  meta: ActivityMeta;
  /** null = pemohon (user tanpa login) */
  actor: { id: number; name: string } | null;
  created_at: string;
}

export interface Application {
  id: number;
  application_number: string;
  applicant: { name: string; phone: string };
  service_type: string;
  vehicle: { type: string; brand: string; model: string; year: number };
  status: { value: StatusKey; rejected_reason: string | null };
  roles: RoleItem[];
  form_fields?: FormField[];
  activities?: Activity[];
  approval_infos?: ApprovalInfo[];
  created_at: string;
  updated_at: string;
}

export interface Paginated<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
}
