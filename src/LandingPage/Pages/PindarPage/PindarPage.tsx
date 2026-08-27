// pages/LoansPage.tsx

import { useEffect, useRef, useState } from "react";

import Navbar from "../../Components/Navbar";
import FilterSidebar from "../../Components/Pindar/FilterSidebar";
import LoanList from "../../Components/Pindar/LoanList";
import CompareBar from "../../Components/Pindar/comparebar";

import { Lender } from "../../../types/lender";
import { useLenders } from "../../../hooks/useLenders";

// TODO: sesuaikan dengan nama field asli di tipe Lender (misal: maxLoanAmount / plafondMax / max_pinjaman)
// dan threshold pembagi "Kecil" vs "Besar" sesuai kebutuhan bisnis.
// TODO: sesuaikan threshold pembagi "Kecil" vs "Besar" sesuai kebutuhan bisnis.
const LOAN_AMOUNT_FIELD: keyof Lender = "maxloan";
const LOAN_AMOUNT_THRESHOLD = 10_000_000;

const LoansPage = () => {
  const [selectedCompare, setSelectedCompare] = useState<Lender[]>([]);

  // PAGE INFINITE SCROLL
  const [page, setPage] = useState(1);

  // FILTER
  const [filters, setFilters] = useState({
    key: "",
    selectedPlafond: "",
    selectedLoanAmounts: "",
  });

  // FETCH API
  // NOTE: selectedLoanAmounts & selectedPayments sengaja selalu dikirim kosong ke backend —
  // filter Jenis Pinjaman diproses di FE saja lewat `filteredLenders` di bawah, backend tidak perlu tau nilainya.
  const { lenders, loading, pagination } = useLenders({
    page,
    limit: 10,
    key: filters.key,
    selectedPlafond: filters.selectedPlafond,
    selectedLoanAmounts: "",
    selectedPayments: "",
  });

  // OBSERVER
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // RESET PAGE WHEN FILTER CHANGED
  useEffect(() => {
    setPage(1);
  }, [filters.key, filters.selectedLoanAmounts, filters.selectedPlafond]);

  // INFINITE SCROLL
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

  // FILTER JENIS PINJAMAN (FE ONLY) — berdasarkan Max Pinjaman
  // FILTER JENIS PINJAMAN (FE ONLY) — berdasarkan Max Pinjaman
  const filteredLenders = lenders.filter((item) => {
    if (filters.selectedLoanAmounts === "") return true;

    // maxloan bertipe string (bisa mengandung "Rp", titik, koma, dll) — strip dulu ke angka murni
    const rawValue = String(item[LOAN_AMOUNT_FIELD] ?? "");
    const maxAmount = Number(rawValue.replace(/[^0-9]/g, "")) || 0;

    if (filters.selectedLoanAmounts === "small") return maxAmount <= LOAN_AMOUNT_THRESHOLD;
    if (filters.selectedLoanAmounts === "large") return maxAmount > LOAN_AMOUNT_THRESHOLD;

    return true;
  });

  // COMPARE
  const handleCompare = (item: Lender) => {
    const exists = selectedCompare.find((x) => x.id === item.id);

    if (exists) {
      setSelectedCompare((prev) => prev.filter((x) => x.id !== item.id));

      return;
    }

    if (selectedCompare.length >= 3) {
      alert("Maksimal 3 pinjaman");
      return;
    }

    setSelectedCompare((prev) => [...prev, item]);
  };

  return (
    <div className="bg-gray-100 p-4 md:p-8 font-signika min-h-screen">
      {/* NAVBAR */}
      <div className="fixed top-0 left-0 w-full z-40 bg-white">
        <Navbar />
      </div>

      {/* HEADER */}
      <div className="mt-20 w-full pb-6">
        <p>
          Home {">"} Pinjaman {">"} Semua Pinjaman
        </p>

        <h1 className="text-2xl font-bold">Pinjaman</h1>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SIDEBAR */}
        <div className="lg:col-span-1">
          <FilterSidebar filters={filters} setFilters={setFilters} />
        </div>

        {/* LIST */}
        <div className="lg:col-span-3">
          <LoanList data={filteredLenders} selected={selectedCompare} onCompare={handleCompare} loading={loading} />

          {/* OBSERVER TARGET */}
          <div ref={loadMoreRef} className="h-10" />
        </div>
      </div>

      {/* COMPARE */}
      <CompareBar selected={selectedCompare} onRemove={(id) => setSelectedCompare((prev) => prev.filter((x) => x.id !== id))} onClear={() => setSelectedCompare([])} onCompare={() => console.log(selectedCompare)} />
    </div>
  );
};

export default LoansPage;
