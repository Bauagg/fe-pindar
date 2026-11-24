import React, { useEffect, useLayoutEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import LandingPage from "./LandingPage/Pages";
import PindarPage from "./LandingPage/Pages/PindarPage/PindarPage";
import PindarCompare from "./LandingPage/Pages/PindarPage/ComparePindar";
import PindarDetail from "./LandingPage/Pages/PindarPage/pindarDetail";
import KartuKredit from "./LandingPage/Pages/KartuKreditPage/KartuKreditPages";
import CreditDetail from "./LandingPage/Pages/KartuKreditPage/KartuKreditDetail";
import CreditCardCompare from "./LandingPage/Pages/KartuKreditPage/CompareKeruKredit";
import LegalPage from "./LandingPage/Pages/legalPage/legalPage";
import EducationDetail from "./LandingPage/Components/Education/EducationDetail";
import EducationList from "./LandingPage/Components/Education/EducationAll";
import TrendingEducation from "./LandingPage/Components/Education/EducationTrending";
import BankLoanMaintenance from "./LandingPage/Pages/PinjamanBank/pinjamanBank";
import ListPinjamanBank from "./LandingPage/Pages/PinjamanBankFix/pinjamanbankfix";
import DetailPinjamanBank from "./LandingPage/Pages/PinjamanBankFix/detailPinjamanBank";
import MultiFinance from "./LandingPage/Pages/Multifinance/multifinance";
import MultiFinanceForm from "./LandingPage/Pages/Multifinance/form-multifinance";

// ADMIN (sesuaikan path import dengan lokasi folder Admin di project kamu)
import { AuthProvider } from "./Admin/auth/AuthContext";
import ProtectedRoute from "./Admin/auth/ProtectedRoute";
import AdminLayout from "./Admin/layout/AdminLayout";
import AdminLogin from "./Admin/pages/Login";
import MultifinanceDashboard from "./Admin/pages/MultifinanceDashboard";
import ApplicationsPage from "./Admin/pages/ApplicationsPage";
import LoginRetailku from "./Admin/pages/LoginRetailku";
import ApplicationDetailPage from "./Admin/pages/ApplicationDetailPage";
import LoginSinarmas from "./Admin/pages/LoginSinarmas";
import LoginCNAF from "./Admin/pages/LoginCnaf";
import LoginTaf from "./Admin/pages/LoginTaf";
import LoginMoladin from "./Admin/pages/LoginMoladin";
import ApprovedApplicationsPage from "./Admin/pages/ApprovedApplicationsPage";
import RetailkuPage from "./Admin/pages/Multifinance/Retailku";
import MoladinPage from "./Admin/pages/Multifinance/Moladin";
import SinarmasPage from "./Admin/pages/Multifinance/Sinarmas";
import CnafPage from "./Admin/pages/Multifinance/cnaf";
import TafPage from "./Admin/pages/Multifinance/taf";
import SummaryMultifinancePage from "./Admin/pages/Multifinance/SummaryMultifinancePage";
import DisbursementMultifinancePage from "./Admin/pages/Multifinance/Disbursementmultifinancepage";
import { BankLoan, CreditCard } from "./Admin/features/finance-apps/modules";
import CreditCardForm from "./LandingPage/Pages/KartuKreditPage/CreditCardForm";
import BankLoanForm from "./LandingPage/Pages/PinjamanBankFix/BankLoanForm";
import ListPayLater from "./LandingPage/Pages/PayLater/ListPayLater";
import DetailPayLater from "./LandingPage/Pages/PayLater/DetailPayLater";
import { BcaCardPage, BniCardPage, BriCardPage, CimbCardPage, MandiriCardPage } from "./Admin/pages/Kreditur/AdminCc";
import { KtaBca, KtaBni, KtaBri, KtaMandiri, KtaMayapada, KtaOcbc } from "./Admin/pages/Kreditur/AdminKta";
import PindarEmpty from "./Admin/features/finance-apps/PindarEmpty";

// Deklarasi tipe fbq supaya TypeScript tidak error
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

// Kirim PageView setiap pindah halaman
const PixelRouteTracker = () => {
  const { pathname } = useLocation();
  const isFirst = useRef(true);

  useEffect(() => {
    // PageView pertama sudah dikirim oleh index.html, jadi dilewati
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return null;
};

// Scroll ke paling atas setiap pindah halaman
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    // Kalau URL punya anchor (#id), biarkan browser yang mengatur posisinya
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
};

const App = () => {
  return (
    <Router>
      <PixelRouteTracker />
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pindar" element={<PindarPage />} />
          <Route path="/pindarcompare" element={<PindarCompare />} />
          <Route path="/pindardetail/:id" element={<PindarDetail />} />
          <Route path="/kartukredit" element={<KartuKredit />} />
          <Route path="/creditcompare" element={<CreditCardCompare />} />
          <Route path="/creditcarddetail/:id" element={<CreditDetail />} />
          <Route path="/creditcard/form" element={<CreditCardForm />} />
          <Route path="/legal/:tab" element={<LegalPage />} />
          <Route path="/legal" element={<Navigate to="/legal/about" replace />} />
          <Route path="/education" element={<EducationList />} />
          <Route path="/education/:id" element={<EducationDetail />} />
          <Route path="/education/trending" element={<TrendingEducation />} />

          {/* PINJAMAN BANK FIX */}
          <Route path="/pinjaman-bank" element={<ListPinjamanBank />} />
          <Route path="/pinjaman-bank/:id" element={<DetailPinjamanBank />} />
          <Route path="/pinjamanbankform" element={<BankLoanForm />} />

          {/* PINJAMAN BANK MAINTENANCE */}
          <Route path="/pinjamanbank" element={<BankLoanMaintenance />} />

          {/* PAYLATER */}
          <Route path="/paylater" element={<ListPayLater />} />
          <Route path="/paylater/:id" element={<DetailPayLater />} />

          {/* MULTIFINANCE (USER) */}
          <Route path="/multi-finance" element={<MultiFinance />} />
          <Route path="/multi-finance/form" element={<MultiFinanceForm />} />

          {/* MULTIFINANCE (ADMIN) */}
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/retailku/login" element={<LoginRetailku />} />
          <Route path="/sinarmas-multifinance/login" element={<LoginSinarmas />} />
          <Route path="/cnaf/login" element={<LoginCNAF />} />
          <Route path="/taf/login" element={<LoginTaf />} />
          <Route path="/moladin/login" element={<LoginMoladin />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<MultifinanceDashboard />} />
              <Route path="multi-finance/applications" element={<ApplicationsPage />} />
              <Route path="detail/multifinanceapp/:id" element={<ApplicationDetailPage />} />

              {/* multifinance super admin */}
              <Route path="multifinance/summary" element={<SummaryMultifinancePage />} />
              <Route path="multifinance/list-pengajuan" element={<ApplicationsPage />} />
              <Route path="multifinance/pencairan" element={<DisbursementMultifinancePage />} />
              <Route path="multifinance/retailku" element={<RetailkuPage />} />
              <Route path="multifinance/moladin" element={<MoladinPage />} />
              <Route path="multifinance/sinarmas" element={<SinarmasPage />} />
              <Route path="multifinance/cnaf" element={<CnafPage />} />
              <Route path="multifinance/taf" element={<TafPage />} />
              <Route path="multifinance/pengajuan-disetujui" element={<ApprovedApplicationsPage title="Pengajuan Disetujui" description="Semua pengajuan multifinance yang sudah disetujui." lockedStatus="approved" />} />

              {/* PINDAR */}
              {/* PINDAR (sementara kosong, BE belum ada) */}
              <Route path="pinjaman-daring/summary" element={<PindarEmpty title="Ringkasan Pindar" />} />
              <Route path="pinjaman-daring/applications" element={<PindarEmpty title="Nasabah Pindar" />} />
              <Route path="pinjaman-daring/all" element={<PindarEmpty title="Semua Pengajuan Pindar" />} />
              <Route path="pinjaman-daring/approved" element={<PindarEmpty title="Pindar Disetujui" />} />
              <Route path="pinjaman-daring/disbursement" element={<PindarEmpty title="Pencairan Pindar" />} />
              <Route path="detail/pinjaman-daring/:id" element={<PindarEmpty title="Detail Pindar" />} />

              {/* KARTU KREDIT */}
              <Route path="credit-card/summary" element={<CreditCard.SummaryPage />} />
              <Route path="credit-card/applications" element={<CreditCard.ListPage />} />
              <Route path="credit-card/all" element={<CreditCard.AllPage />} />
              <Route path="credit-card/approved" element={<CreditCard.ApprovedPage />} />
              <Route path="credit-card/disbursement" element={<CreditCard.DisbursementPage />} />
              <Route path="detail/credit-card/:id" element={<CreditCard.DetailPage />} />
              <Route path="credit-card/bca-cc" element={<BcaCardPage />} />
              <Route path="credit-card/bri-cc" element={<BriCardPage />} />
              <Route path="credit-card/bni-cc" element={<BniCardPage />} />
              <Route path="credit-card/mandiri-cc" element={<MandiriCardPage />} />
              <Route path="credit-card/cimb-cc" element={<CimbCardPage />} />

              {/* PINJAMAN BANK */}
              <Route path="bank-loan/summary" element={<BankLoan.SummaryPage />} />
              <Route path="bank-loan/applications" element={<BankLoan.ListPage />} />
              <Route path="bank-loan/all" element={<BankLoan.AllPage />} />
              <Route path="bank-loan/approved" element={<BankLoan.ApprovedPage />} />
              <Route path="bank-loan/disbursement" element={<BankLoan.DisbursementPage />} />
              <Route path="detail/bank-loan/:id" element={<BankLoan.DetailPage />} />
              <Route path="bank-loan/bca-kta" element={<KtaBca />} />
              <Route path="bank-loan/bni-kta" element={<KtaBni />} />
              <Route path="bank-loan/bri-kta" element={<KtaBri />} />
              <Route path="bank-loan/mandiri-kta" element={<KtaMandiri />} />
              <Route path="bank-loan/mayapada-kta" element={<KtaMayapada />} />
              <Route path="bank-loan/ocbc-kta" element={<KtaOcbc />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
