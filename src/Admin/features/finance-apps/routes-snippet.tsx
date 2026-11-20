// Tempel ke router admin kamu (react-router-dom v6), di dalam layout admin yang sudah ada.
import { Route } from "react-router-dom";
import { BankLoan, CreditCard } from "./features/finance-apps/modules";

export const financeAppRoutes = (
  <>
    {/* ===== Kartu Kredit ===== */}
    <Route path="/admin/credit-card" element={<CreditCard.SummaryPage />} />
    <Route path="/admin/credit-card/applications" element={<CreditCard.ListPage />} />
    <Route path="/admin/credit-card/all" element={<CreditCard.AllPage />} />
    <Route path="/admin/credit-card/approved" element={<CreditCard.ApprovedPage />} />
    <Route path="/admin/credit-card/disbursement" element={<CreditCard.DisbursementPage />} />
    <Route path="/admin/detail/credit-card/:id" element={<CreditCard.DetailPage />} />

    {/* ===== Pinjaman Bank ===== */}
    <Route path="/admin/bank-loan" element={<BankLoan.SummaryPage />} />
    <Route path="/admin/bank-loan/applications" element={<BankLoan.ListPage />} />
    <Route path="/admin/bank-loan/all" element={<BankLoan.AllPage />} />
    <Route path="/admin/bank-loan/approved" element={<BankLoan.ApprovedPage />} />
    <Route path="/admin/bank-loan/disbursement" element={<BankLoan.DisbursementPage />} />
    <Route path="/admin/detail/bank-loan/:id" element={<BankLoan.DetailPage />} />
  </>
);

/*
 Menu sidebar (contoh, sesuaikan komponen sidebar kamu):
   Kartu Kredit  -> Ringkasan /admin/credit-card | Nasabah /admin/credit-card/applications
                    Semua /admin/credit-card/all | Disetujui /admin/credit-card/approved
                    Disbursement /admin/credit-card/disbursement
   Pinjaman Bank -> sama, prefix /admin/bank-loan
 Ringkasan, Semua, Disetujui, dan Disbursement hanya untuk super_admin/admin
 (halaman otomatis redirect ke Nasabah kalau role tidak sesuai).
*/
