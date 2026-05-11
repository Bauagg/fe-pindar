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
        <Route path="/pinjamanbank" element={<BankLoanMaintenance />} />
      </Routes>
    </Router>
  );
};

export default App;

//sadasdasdasd
