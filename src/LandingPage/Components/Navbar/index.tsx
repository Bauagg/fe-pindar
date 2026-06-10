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
    { to: "/", icon: <FiHome size={20} />, label: "Beranda" },
    { to: "/pindar", icon: <FaMoneyBillWave size={20} />, label: "Pindar" },
    { to: "/kartukredit", icon: <FiCreditCard size={20} />, label: "Kartu Kredit" },
  ];

  const legalMenus = [
    { to: "/legal/terms", label: "Syarat & Ketentuan" },
    { to: "/legal/privacy", label: "Kebijakan Privasi" },
    { to: "/legal/about", label: "Tentang Kami" },
  ];

  return (
    <>
      <header
        className={`fixed left-1/2 -translate-x-1/2 z-50 w-full overflow-hidden rounded-b-[2.5rem] px-4 lg:px-7 py-4 flex items-center justify-between transition-all duration-300 ${
          isScrolled ? "bg-gradient-to-r from-red-600 via-red-700 to-red-800 backdrop-blur-xl shadow-2xl" : "bg-red-600"
        }`}>
        {/* LEFT */}
        <div className="relative z-10 flex items-center gap-3 w-full lg:w-auto">
          {/* LOGO */}
          <NavLink to="/">
            <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.2)] overflow-hidden">
              {/* GLOW */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-60" />

              <img src="/images/pindar.svg" alt="Logo" className="relative z-10 w-9 h-9 drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]" />
            </div>
          </NavLink>

          {/* SEARCH */}
          <button
            onClick={() => setOpenSearch(true)}
            className="flex items-center gap-3 w-full lg:w-[380px] px-4 py-3 rounded-full bg-white/95 text-gray-500 text-sm shadow-xl border border-white/40 hover:bg-white transition-all duration-300">
            <FiSearch />
            Cari pindar...
          </button>
        </div>

        <div className="relative z-10 hidden lg:flex items-center gap-4 text-white mx-8">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              className={({ isActive }) =>
                `group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 border border-white/20 ${
                  isActive ? "bg-white text-red-500 shadow-lg scale-105" : "bg-white/15 hover:bg-white text-white hover:text-red-500 backdrop-blur-md hover:scale-105"
                }`
              }>
              {item.icon}
              <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-xl bg-white text-red-500 text-xs font-bold shadow-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none z-[999999]">
                {item.label}
              </span>
            </NavLink>
          ))}
        </div>

        <div className="relative z-10 hidden lg:flex items-center gap-3">
          {legalMenus.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              className={({ isActive }) =>
                `px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 border border-white/20 ${isActive ? "bg-white text-red-500 shadow-lg" : "bg-white/15 text-white hover:bg-white hover:text-red-500 backdrop-blur-md"}`
              }>
              {item.label}
            </NavLink>
          ))}
        </div>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="relative z-10 lg:hidden text-white ml-3 w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/25 shadow-lg">
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </header>

      <div className={`fixed top-0 left-0 w-full h-screen overflow-hidden bg-gradient-to-br from-red-800 via-red-500 to-red-700 z-40 transition-transform duration-300 ${isMenuOpen ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="relative z-10 pt-28 px-6 text-white">
          <div className="grid grid-cols-3 gap-4 mb-10">
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `group flex flex-col items-center justify-center gap-3 rounded-3xl py-6 transition-all duration-300 border border-white/20 ${
                    isActive ? "bg-white text-red-500 shadow-2xl scale-105" : "bg-white/15 backdrop-blur-md hover:bg-white hover:text-red-500"
                  }`
                }>
                <div>{item.icon}</div>
                <span className="text-sm font-bold">{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="bg-white/15 backdrop-blur-md rounded-[2rem] p-5 border border-white/20 shadow-2xl">
            <p className="text-white/80 text-sm font-semibold mb-4">Informasi Legal</p>

            <div className="flex flex-col gap-3">
              {legalMenus.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) => `px-5 py-4 rounded-2xl font-semibold transition-all duration-300 ${isActive ? "bg-white text-red-500 shadow-lg" : "bg-white/10 hover:bg-white hover:text-red-500"}`}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SearchPopup open={openSearch} onClose={() => setOpenSearch(false)} />
    </>
  );
};

export default Navbar;
