import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage/Pages";
import DetailPindar from "./LandingPage/Pages/detailPindar/detailpindar";
import DetailKartu from "./LandingPage/Pages/detailKartu/detailKartu";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pindar" element={<DetailPindar />} />
        <Route path="/cc" element={<DetailKartu />} />
      </Routes>
    </Router>
  );
};

export default App;
