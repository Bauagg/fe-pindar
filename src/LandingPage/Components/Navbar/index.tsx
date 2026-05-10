import { JSX, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { FiMenu, FiX, FiHome, FiCreditCard, FiSearch } from "react-icons/fi";

import { FaMoneyBillWave } from "react-icons/fa";

import SearchPopup from "./SearchPopup";

const Navbar = (): JSX.Element => {
  const [isScrolled, setIsScrolled] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [openSearch, setOpenSearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`
          fixed left-1/2 -translate-x-1/2 z-50
          w-full rounded-b-[2rem]
          px-4 lg:px-7 py-4
          flex items-center justify-between
          transition-all duration-300
          ${isScrolled ? "bg-red-500/95 backdrop-blur-md shadow-lg" : "bg-red-500"}
        `}>
        {/* LEFT */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <NavLink to="/">
            <img src="/images/pindar.svg" alt="Logo" className="w-10 h-10" />
          </NavLink>

          <button
            onClick={() => setOpenSearch(true)}
            className="
              flex items-center gap-3
              w-full lg:w-[380px]
              px-4 py-3 rounded-full
              bg-white text-gray-400
              text-sm
            ">
            <FiSearch />
            Search pindar...
          </button>
        </div>

        {/* DESKTOP */}
        <div className="hidden lg:flex items-center gap-6 text-white mx-8">
          <NavLink to="/">
            <FiHome size={22} />
          </NavLink>
          <NavLink to="/pindar">
            <FaMoneyBillWave size={22} />
          </NavLink>

          <NavLink to="/kartukredit">
            <FiCreditCard size={22} />
          </NavLink>
        </div>

        {/* RIGHT */}
        <div className="hidden lg:flex items-center gap-6 text-white text-sm font-medium">
          <NavLink to="/terms">Terms & Condition</NavLink>

          <NavLink to="/privacy">Privacy Policy</NavLink>

          <NavLink to="/about">About Us</NavLink>
        </div>

        {/* MOBILE */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-white ml-3">
          {isMenuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
        </button>
      </header>

      {/* MOBILE MENU */}
      <div
        className={`
          fixed top-0 left-0 w-full h-screen
          bg-red-500 z-40
          transition-transform duration-300
          ${isMenuOpen ? "translate-y-0" : "-translate-y-full"}
        `}>
        <div className="pt-24 px-6 space-y-6 text-white text-lg font-medium">
          <div className="flex gap-6 justify-center pb-6 border-b border-white/30">
            <NavLink to="/">
              <FiHome size={24} />
            </NavLink>

            <NavLink to="/pindar">
              <FaMoneyBillWave size={24} />
            </NavLink>

            <NavLink to="/kartukredit">
              <FiCreditCard size={24} />
            </NavLink>
          </div>

          <div className="flex flex-col gap-4 items-center">
            <NavLink to="/terms">Terms & Condition</NavLink>

            <NavLink to="/privacy">Privacy Policy</NavLink>

            <NavLink to="/about">About Us</NavLink>
          </div>
        </div>
      </div>

      <SearchPopup open={openSearch} onClose={() => setOpenSearch(false)} />
    </>
  );
};

export default Navbar;
