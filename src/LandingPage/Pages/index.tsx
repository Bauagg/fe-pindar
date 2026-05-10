import React from "react";
// import Fitur from "../Components/About/Fitur";
// import About from "../Components/Fitur";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import Satuan from "../Components/About/Satuan";
import JenisGerai from "../Components/JenisGerai";
import Gallery from "./galeri/galeri";

import HeroSection from "../Components/Hero";
import RekomendasiApp from "../Components/pinjamanDaring/RecomentPinjaman";

const LandingPageUdin: React.FC = () => {
  return (
    <section className="font-signika max-w-[1440px] mx-auto ">
      <div className="fixed top-0 left-0 w-full z-40 bg-white">
        <Navbar />
      </div>

      <section className="pt-[80px] grid grid-cols-1">
        <>
          <div>
            <HeroSection />
          </div>
          <div>
            <RekomendasiApp />
          </div>

          <div>
            <Gallery />
          </div>

          <div>
            <Satuan />
          </div>

          <div>
            <JenisGerai />
          </div>

          <Footer />
        </>
      </section>
    </section>
  );
};

export default LandingPageUdin;
