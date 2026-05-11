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

  const menuItems = [
    {
      to: "/",
      icon: <FiHome size={20} />,
      label: "Home",
    },
    {
      to: "/pindar",
      icon: <FaMoneyBillWave size={20} />,
      label: "Pindar",
    },
    {
      to: "/kartukredit",
      icon: <FiCreditCard size={20} />,
      label: "Kartu Kredit",
    },
  ];

  const legalMenus = [
    {
      to: "/legal/terms",
      label: "Terms & Condition",
    },
    {
      to: "/legal/privacy",
      label: "Privacy Policy",
    },
    {
      to: "/legal/about",
      label: "About Us",
    },
  ];

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
              shadow-md
            ">
            <FiSearch />
            Search pindar...
          </button>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex items-center gap-4 text-white mx-8">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              className={({ isActive }) => `
                group relative
                flex items-center justify-center
                w-12 h-12 rounded-2xl
                transition-all duration-300
                ${isActive ? "bg-white text-red-500 shadow-lg" : "bg-white/10 hover:bg-white text-white hover:text-red-500 backdrop-blur-md"}
              `}>
              {item.icon}

              {/* TOOLTIP */}
              <span
                className="
                  absolute top-14 left-1/2 -translate-x-1/2
                  whitespace-nowrap
                  px-3 py-1.5 rounded-xl
                  bg-white text-red-500
                  text-xs font-bold
                  shadow-lg
                  opacity-0 scale-95
                  group-hover:opacity-100
                  group-hover:scale-100
                  transition-all duration-300
                  pointer-events-none
                ">
                {item.label}
              </span>
            </NavLink>
          ))}
        </div>

        {/* RIGHT */}
        <div className="hidden lg:flex items-center gap-3">
          {legalMenus.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              className={({ isActive }) => `
                px-5 py-3 rounded-2xl
                text-sm font-semibold
                transition-all duration-300
                ${isActive ? "bg-white text-red-500 shadow-lg" : "bg-white/10 text-white hover:bg-white hover:text-red-500 backdrop-blur-md"}
              `}>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="
            lg:hidden
            text-white
            ml-3
            w-11 h-11
            rounded-2xl
            bg-white/10
            backdrop-blur-md
            flex items-center justify-center
          ">
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </header>

      {/* MOBILE MENU */}
      <div
        className={`
          fixed top-0 left-0 w-full h-screen
          bg-gradient-to-b from-red-600 via-red-500 to-red-700
          z-40
          transition-transform duration-300
          ${isMenuOpen ? "translate-y-0" : "-translate-y-full"}
        `}>
        <div className="pt-28 px-6 text-white">
          {/* MENU ICON */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => `
                  group
                  flex flex-col items-center justify-center
                  gap-3
                  rounded-3xl
                  py-6
                  transition-all duration-300
                  ${isActive ? "bg-white text-red-500 shadow-2xl" : "bg-white/10 backdrop-blur-md hover:bg-white hover:text-red-500"}
                `}>
                <div>{item.icon}</div>

                <span className="text-sm font-bold">{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* LEGAL MENU */}
          <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-5 border border-white/10">
            <p className="text-white/70 text-sm font-semibold mb-4">Informasi Legal</p>

            <div className="flex flex-col gap-3">
              {legalMenus.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) => `
                    px-5 py-4 rounded-2xl
                    font-semibold transition-all duration-300
                    ${isActive ? "bg-white text-red-500" : "bg-white/5 hover:bg-white hover:text-red-500"}
                  `}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH POPUP */}
      <SearchPopup open={openSearch} onClose={() => setOpenSearch(false)} />
    </>
  );
};

export default Navbar;
