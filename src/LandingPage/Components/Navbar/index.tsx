import { JSX, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX, FiHome, FiCreditCard, FiFolder } from "react-icons/fi";
import { FaMoneyBillWave } from "react-icons/fa";

interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar = ({ isMenuOpen, setIsMenuOpen }: NavbarProps): JSX.Element => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ===== NAVBAR ===== */}
      <header
        className={`fixed left-1/2 -translate-x-1/2 z-50
        w-full rounded-ee-3xl rounded-es-3xl px-7 py-4
        flex items-center justify-between transition-all duration-300
        ${isScrolled ? "bg-red-500/95 backdrop-blur-md shadow-lg" : "bg-red-500"}`}>
        {/* LEFT */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <NavLink to="/">
            <img src="/images/pindar.svg" alt="Logo" className="w-9 h-9" />
          </NavLink>

          <input
            type="text"
            placeholder="Search here..."
            className="w-full lg:w-[380px] px-4 py-2 rounded-full
            outline-none text-sm placeholder:text-gray-400"
          />
        </div>

        {/* CENTER ICONS */}
        <div className="hidden lg:flex items-center gap-6 text-white mx-8">
          <NavLink to="/" className="hover:scale-110 transition">
            <FiHome size={22} />
          </NavLink>
          <NavLink to="/payment" className="hover:scale-110 transition">
            <FiCreditCard size={22} />
          </NavLink>
          <NavLink to="/files" className="hover:scale-110 transition">
            <FiFolder size={22} />
          </NavLink>
          <NavLink to="/donation" className="hover:scale-110 transition">
            <FaMoneyBillWave size={22} />
          </NavLink>
        </div>

        {/* RIGHT LINKS */}
        <div className="hidden lg:flex items-center gap-6 text-white text-sm font-medium">
          <NavLink to="/terms" className="hover:underline">
            Terms & Condition
          </NavLink>
          <NavLink to="/privacy" className="hover:underline">
            Privacy Policy
          </NavLink>
          <NavLink to="/about" className="hover:underline">
            About Us
          </NavLink>
        </div>

        {/* HAMBURGER */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-white ml-3" aria-label="Toggle Menu">
          {isMenuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
        </button>
      </header>

      {/* ===== MOBILE MENU ===== */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-red-500 z-40
        transition-transform duration-300
        ${isMenuOpen ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="pt-24 px-6 space-y-6 text-white text-lg font-medium">
          <div className="flex gap-6 justify-center pb-6 border-b border-white/30">
            <NavLink to="/">
              <FiHome size={24} />
            </NavLink>
            <NavLink to="/payment">
              <FiCreditCard size={24} />
            </NavLink>
            <NavLink to="/files">
              <FiFolder size={24} />
            </NavLink>
            <NavLink to="/donation">
              <FaMoneyBillWave size={24} />
            </NavLink>
          </div>

          <div className="flex flex-col gap-2 items-center justify-center">
            <NavLink to="/terms">Terms & Condition</NavLink>
            <NavLink to="/privacy">Privacy Policy</NavLink>
            <NavLink to="/about">About Us</NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
