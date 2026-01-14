import React, { useState } from "react";
import FilterSidebar from "../../Components/DetailKartu/FilterSidebar";
import LoanList from "../../Components/DetailKartu/LoanList";
import Navbar from "../../Components/Navbar";

const DetailKartu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = (page: string) => {
    setTimeout(() => {}, 100);

    setIsMenuOpen(false);
  };
  return (
    <div className="bg-gray-100  p-4 md:p-8 font-signika">
      <div className="fixed top-0 left-0 w-full z-40 bg-white">
        <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      </div>
      <div className="mt-20  w-full pb-6">
        <p>
          Home {">"} Kartu Kredit {">"} Semua Kartu Kredit
        </p>
        <h1 className="text-2xl font-bold ">Kartu Kredit</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 max-md:mt-5">
          <FilterSidebar />
        </div>

        {/* Content */}
        <div className="lg:col-span-3 max-md:-mt-4 -mt-0">
          <LoanList />
        </div>
      </div>
    </div>
  );
};

export default DetailKartu;
