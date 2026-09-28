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

const App = () => {
  return (
    <Router>
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

        {/* MULTIFINANCE */}
        <Route path="/multi-finance" element={<MultiFinance />} />
      </Routes>
    </Router>
  );
};

export default App;
