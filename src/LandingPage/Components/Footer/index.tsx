import React from "react";

interface FooterProps {
  className?: string;
  handleMenuClick?: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ className, handleMenuClick }) => {
  const menus = ["Home Page", "About", "Service", "Order", "Partnership", "Galery", "Contact Us"];

  const services = ["Hassle-free ordering", "Flexible Delivery", "Ready to export"];

  return (
    <footer className={`bg-red-500 text-white mt-12 ${className || ""}`}>
      {/* Bottom Copyright */}
      <div className="border-t-4 border-red-900 text-center py-4 text-xs sm:text-sm md:text-base">
        © 2025 <span className="font-bold">PINDAR</span>. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
