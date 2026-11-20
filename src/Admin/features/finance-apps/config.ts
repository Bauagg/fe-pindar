export interface ModuleConfig {
  key: "credit-card" | "bank-loan";
  title: string; // "Kartu Kredit"
  productKey: "card_name" | "bank_name";
  productLabel: string; // "Nama kartu kredit"
  productPlaceholder: string;
  byKey: "by_card" | "by_bank";
  hasCompany: boolean;
  addressLabel: string;
  api: { admin: string; disbursement: string };
  routes: {
    summary: string;
    list: string; // nasabah (role-scoped)
    all: string; // semua (super_admin/admin)
    approved: string;
    disbursement: string;
    detail: (id: number | string) => string;
  };
}

export const creditCardConfig: ModuleConfig = {
  key: "credit-card",
  title: "Kartu Kredit",
  productKey: "card_name",
  productLabel: "Nama kartu kredit",
  productPlaceholder: "mis. Visa Platinum",
  byKey: "by_card",
  hasCompany: false,
  addressLabel: "Alamat",
  api: { admin: "/admin/credit-card", disbursement: "/admin/disbursement-credit-card" },
  routes: {
    summary: "/admin/credit-card",
    list: "/admin/credit-card/applications",
    all: "/admin/credit-card/all",
    approved: "/admin/credit-card/approved",
    disbursement: "/admin/credit-card/disbursement",
    detail: (id) => `/admin/detail/credit-card/${id}`,
  },
};

export const bankLoanConfig: ModuleConfig = {
  key: "bank-loan",
  title: "Pinjaman Bank",
  productKey: "bank_name",
  productLabel: "Nama bank",
  productPlaceholder: "mis. Bank Mandiri",
  byKey: "by_bank",
  hasCompany: true,
  addressLabel: "Alamat domisili",
  api: { admin: "/admin/bank-loan", disbursement: "/admin/disbursement-bank-loan" },
  routes: {
    summary: "/admin/bank-loan",
    list: "/admin/bank-loan/applications",
    all: "/admin/bank-loan/all",
    approved: "/admin/bank-loan/approved",
    disbursement: "/admin/bank-loan/disbursement",
    detail: (id) => `/admin/detail/bank-loan/${id}`,
  },
};
