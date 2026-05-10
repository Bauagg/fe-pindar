import { useEffect, useRef, useState } from "react";

import Navbar from "../../Components/Navbar";
import FilterSidebar from "../../Components/KartuKredit/FilterSidebar";
import LoanList from "../../Components/KartuKredit/LoanList";
import CompareBar from "../../Components/KartuKredit/CompareBar";

import { useCreditCards } from "../../../hooks/useCreditCards";
import { CreditCardItem } from "../../../types/creditcard";

const DetailKartu = () => {
  const [selectedCompare, setSelectedCompare] = useState<CreditCardItem[]>([]);

  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    featureId: "",
    minYearlyFee: 0,
    maxYearlyFee: 68900000,
    sortBy: "yearly_fee",
    sortDirection: "desc",
  });

  const { cards, loading, pagination } = useCreditCards({
    page,
    limit: 5,
    ...filters,
  });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (first.isIntersecting && !loading && pagination && page < pagination.totalPages) {
          setPage((prev) => prev + 1);
        }
      },
      {
        threshold: 0.1,
      }
    );

    const currentRef = loadMoreRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loading, pagination, page]);

  const handleCompare = (item: CreditCardItem) => {
    const exists = selectedCompare.find((x) => x.id === item.id);

    if (exists) {
      setSelectedCompare((prev) => prev.filter((x) => x.id !== item.id));

      return;
    }

    if (selectedCompare.length >= 3) {
      alert("Maksimal 3 kartu");
      return;
    }

    setSelectedCompare((prev) => [...prev, item]);
  };

  return (
    <div className="bg-gray-100 p-4 md:p-8 font-signika min-h-screen">
      <div className="fixed top-0 left-0 w-full z-40 bg-white">
        <Navbar />
      </div>

      {/* HEADER */}
      <div className="mt-20 w-full pb-6">
        <p>
          Home {">"} Kartu Kredit {">"} Semua Kartu Kredit
        </p>

        <h1 className="text-2xl font-bold">Kartu Kredit</h1>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SIDEBAR */}
        <div className="lg:col-span-1">
          <FilterSidebar filters={filters} setFilters={setFilters} />
        </div>

        {/* LIST */}
        <div className="lg:col-span-3">
          <LoanList data={cards} selected={selectedCompare} onCompare={handleCompare} loading={loading} />

          <div ref={loadMoreRef} className="h-10" />
        </div>
      </div>

      {/* COMPARE */}
      <CompareBar selected={selectedCompare} onRemove={(id) => setSelectedCompare((prev) => prev.filter((x) => x.id !== id))} onClear={() => setSelectedCompare([])} />
    </div>
  );
};

export default DetailKartu;
