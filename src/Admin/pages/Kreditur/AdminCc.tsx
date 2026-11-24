// CreditCardPages.tsx
import CreditCardListPage from "./MasterCreditCard";

export const BcaCardPage = () => <CreditCardListPage title="Kartu Kredit BCA" role="admin_cc_bca" />;
export const BniCardPage = () => <CreditCardListPage title="Kartu Kredit BNI" role="admin_cc_bni" />;
export const BriCardPage = () => <CreditCardListPage title="Kartu Kredit BRI" role="admin_cc_bri" />;
export const MandiriCardPage = () => <CreditCardListPage title="Kartu Kredit Mandiri" role="admin_cc_mandiri" />;
export const CimbCardPage = () => <CreditCardListPage title="Kartu Kredit CIMB" role="admin_cc_cimb" />;
