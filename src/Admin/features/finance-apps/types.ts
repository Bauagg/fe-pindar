export type StatusKey = "pending" | "on_progress" | "approved" | "rejected" | "correction";
export type FieldType = "text" | "textarea" | "number" | "date" | "file";

export interface Role {
  id: number;
  name: string;
  slug: string;
}

export interface FormFieldValue {
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
}

export interface LatestActivity {
  id: number;
  action: string;
  meta: Record<string, unknown> | null;
  actor: { id: number; name: string } | null;
  created_at: string;
}

/** Response backend (kartu kredit & pinjaman bank). Produk: card_name ATAU bank_name. */
export interface Application {
  id: number;
  application_number: string;
  applicant: {
    name: string;
    phone: string;
    birth_place: string;
    birth_date: string | null;
    address: string; // alamat (domisili untuk pinjaman bank)
  };
  company?: { name: string; address: string }; // hanya pinjaman bank
  card_name?: string;
  bank_name?: string;
  status: { value: StatusKey; rejected_reason: string | null; correction_reason: string | null };
  roles: Role[];
  created_at: string;
  updated_at: string;
  form_fields?: FormFieldValue[];
  activities?: unknown[];
  approval_infos?: ApprovalInfo[];
  can_edit?: boolean;
  is_shared?: boolean;
  is_read?: boolean;
  latest_activity?: LatestActivity | null;
}

export interface Paginated<T> {
  success?: boolean;
  data: T[];
  meta: { current_page: number; last_page: number; per_page: number; total: number; unread_count?: number };
}

export interface Stats {
  total: number;
  today: number;
  yesterday: number;
  this_week: number;
  last_week: number;
  this_month: number;
  last_month: number;
  by_status: Record<string, number>;
  by_card?: Record<string, number>;
  by_bank?: Record<string, number>;
  daily: { date: string; count: number }[];
  monthly: { month: string; count: number }[];
}

/* ---------- Disbursement ---------- */
export interface Disbursement {
  id: number;
  application_id: number;
  disbursement_date: string;
  amount: string | number;
  description: string | null;
  creator?: { id: number; name: string } | null;
  application?: { id: number; application_number: string; applicant_name: string; card_name?: string; bank_name?: string } | null;
}

export interface ApprovedOption {
  id: number;
  application_number: string;
  applicant_name: string;
  applicant_phone: string;
  card_name?: string;
  bank_name?: string;
  total_disbursed: number;
}

export interface Compare {
  current: number;
  previous: number;
  difference: number;
  change_percent: number | null;
}

export interface DisbursementSummaryData {
  overview: { total_transactions: number; total_amount: number };
  daily: { transactions: Compare; amount: Compare };
  weekly: { transactions: Compare; amount: Compare };
  monthly: { transactions: Compare; amount: Compare };
  charts: {
    daily: { date: string; transactions: number; amount: number }[];
    monthly: { month: string; transactions: number; amount: number }[];
    by_card?: { card_name: string; transactions: number; amount: number }[];
    by_bank?: { bank_name: string; transactions: number; amount: number }[];
  };
}
