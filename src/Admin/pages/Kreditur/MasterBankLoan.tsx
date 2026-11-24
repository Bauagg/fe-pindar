import MasterApplicationList, { type ListConfig } from "./MasterApplicationList";
import type { StatusKey } from "../../types";

export const BANK_LOAN_CONFIG: ListConfig = {
  api: "/admin/bank-loan", // SESUAIKAN dengan route BE pinjaman bank
  productKey: "bank_name",
  statsKey: "by_bank",
  filterParam: "bank_name",
  productLabel: "Bank",
  hasCompany: true,
  detailRoute: (id) => `/admin/detail/bankloanapp/${id}`, // SESUAIKAN
};

type Props = { title: string; description?: string; endpoint?: string; role?: string; lockedStatus?: StatusKey };

export default function BankLoanListPage(props: Props) {
  return <MasterApplicationList config={BANK_LOAN_CONFIG} {...props} />;
}
