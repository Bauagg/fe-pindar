import MasterApplicationList, { type ListConfig } from "./MasterApplicationList";
import type { StatusKey } from "../../types";

export const CREDIT_CARD_CONFIG: ListConfig = {
  api: "/admin/credit-card", // SESUAIKAN dengan route BE kartu kredit
  productKey: "card_name",
  statsKey: "by_card",
  filterParam: "card_name",
  productLabel: "Kartu",
  detailRoute: (id) => `/admin/detail/creditcardapp/${id}`, // SESUAIKAN
};

type Props = { title: string; description?: string; endpoint?: string; role?: string; lockedStatus?: StatusKey };

export default function CreditCardListPage(props: Props) {
  return <MasterApplicationList config={CREDIT_CARD_CONFIG} {...props} />;
}
