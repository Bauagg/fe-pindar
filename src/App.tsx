import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage/Pages";
import PindarPage from "./LandingPage/Pages/PindarPage/PindarPage";
import PindarCompare from "./LandingPage/Pages/PindarPage/ComparePindar";
import PindarDetail from "./LandingPage/Pages/PindarPage/pindarDetail";
import KartuKredit from "./LandingPage/Pages/KartuKreditPage/KartuKreditPages";
import CreditDetail from "./LandingPage/Pages/KartuKreditPage/KartuKreditDetail";
import CreditCardCompare from "./LandingPage/Pages/KartuKreditPage/CompareKeruKredit";

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
      </Routes>
    </Router>
  );
};

export default App;

//sadasdasdasd
