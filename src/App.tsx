import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pindar" element={<PindarPage />} />
          <Route path="/pindarcompare" element={<PindarCompare />} />
          <Route path="/pindardetail/:id" element={<PindarDetail />} />
          <Route path="/kartukredit" element={<KartuKredit />} />
          <Route path="/creditcompare" element={<CreditCardCompare />} />
          <Route path="/creditcarddetail/:id" element={<CreditDetail />} />
          <Route path="/legal/:tab" element={<LegalPage />} />
          <Route path="/legal" element={<Navigate to="/legal/about" replace />} />
          <Route path="/education" element={<EducationList />} />
          <Route path="/education/:id" element={<EducationDetail />} />
          <Route path="/education/trending" element={<TrendingEducation />} />
          {/* PINJAMAN BANK FIX */}
          <Route path="/pinjaman-bank" element={<ListPinjamanBank />} />
          <Route path="/pinjaman-bank/:id" element={<DetailPinjamanBank />} />
          {/* PINJAMAN BANK MAINTENANCE */}
          <Route path="/pinjamanbank" element={<BankLoanMaintenance />} />

          {/* MULTIFINANCE (USER) */}
          <Route path="/multi-finance" element={<MultiFinance />} />
          <Route path="/multi-finance/form" element={<MultiFinanceForm />} />

          {/* MULTIFINANCE (ADMIN) */}
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/retailku/login" element={<LoginRetailku />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="multi-finance" replace />} />
              <Route path="multi-finance" element={<MultifinanceDashboard />} />
              <Route path="multi-finance/applications" element={<ApplicationsPage />} />
              <Route path="multi-finance/applications/:id" element={<ApplicationDetailPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
