import React from "react";

const Footer = () => {
  return (
    <footer className={`bg-red-500 text-white mt-12 `}>
      {/* Bottom Copyright */}
      <div className="border-t-4 border-red-900 text-center py-4 text-xs sm:text-sm md:text-base">
        © 2025 <span className="font-bold">PINDAR</span>. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
