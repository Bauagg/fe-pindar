import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../../Components/Navbar";

import LegalTabs from "../../Components/Legal/LegalTabs";
import AboutUs from "../../Components/Legal/AboutUs";
import TermsCondition from "../../Components/Legal/TermsCondition";
import PrivacyPolicy from "../../Components/Legal/PrivacyPolicy";

const LegalPage = () => {
  const { tab } = useParams();

  const navigate = useNavigate();

  const activeTab = tab || "about";

  const setActiveTab = (value: string) => {
    navigate(`/legal/${value}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-white font-signika">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-700" />

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl mt-12">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-black text-white leading-tight">Legal Information</h1>

            <p className="mt-6 text-white/90 text-base md:text-lg leading-relaxed">Informasi legal, kebijakan privasi, dan tentang platform.</p>
          </div>
        </div>
      </section>

      <section className="relative -mt-8 lg:-mt-10 px-3 lg:px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <LegalTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl p-6 lg:p-10">
            {activeTab === "about" && <AboutUs />}

            {activeTab === "terms" && <TermsCondition />}

            {activeTab === "privacy" && <PrivacyPolicy />}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LegalPage;
