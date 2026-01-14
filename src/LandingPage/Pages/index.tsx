import React, { useState, useRef } from "react";
import Fitur from "../Components/About";
import About from "../Components/Fitur";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import Satuan from "../Components/About/Satuan";
import JenisGerai from "../Components/JenisGerai";
import Gallery from "./galeri/galeri";

import HeroUdin from "../Components/Hero";

const HEADER_HEIGHT = 96;
const LandingPageUdin: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("Beranda");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const berandaRef = useRef<HTMLDivElement>(null);
  const fiturRef = useRef<HTMLDivElement>(null);
  const visimisiRef = useRef<HTMLDivElement>(null);
  const tentangKamiRef = useRef<HTMLDivElement>(null);
  const regulasiRef = useRef<HTMLDivElement>(null);
  const jenisGeraiRef = useRef<HTMLDivElement>(null);
  const bantuanRef = useRef<HTMLDivElement>(null);
  const strukturRef = useRef<HTMLDivElement>(null);
  const programRef = useRef<HTMLDivElement>(null);

  const handleMenuClick = (page: string) => {
    setTimeout(() => {
      const targetRef = {
        "Home Page": berandaRef,
        About: fiturRef,
        Service: visimisiRef,
        Partnership: jenisGeraiRef,
        Order: tentangKamiRef,
        Output: regulasiRef,
        Bantuan: bantuanRef,
        Struktur: strukturRef,
        Galery: programRef,
      }[page];

      if (targetRef?.current) {
        window.scrollTo({
          top: targetRef.current.offsetTop - HEADER_HEIGHT,
          behavior: "smooth",
        });
      }
    }, 100); // Memberi waktu agar komponen bisa update sebelum scroll

    setIsMenuOpen(false);
  };

  return (
    <section className="font-signika max-w-[1440px] mx-auto ">
      <div className="fixed top-0 left-0 w-full z-40 bg-white">
        <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      </div>

      <section className="pt-[80px] grid grid-cols-1">
        <>
          <div ref={berandaRef}>
            <HeroUdin />
          </div>
          <div ref={fiturRef}>
            <Fitur />
          </div>

          <div ref={programRef}>
            <Gallery />
          </div>

          <div ref={visimisiRef}>
            <Satuan />
          </div>

          <div ref={jenisGeraiRef}>
            <JenisGerai />
          </div>

          <Footer handleMenuClick={handleMenuClick} />
        </>
      </section>
    </section>
  );
};

export default LandingPageUdin;
