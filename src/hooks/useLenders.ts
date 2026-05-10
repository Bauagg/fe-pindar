// hooks/useLenders.ts

import { useEffect, useState } from "react";
import axios from "axios";

import { FilterState, Lender, Pagination, LenderResponse } from "../types/lender";

interface Props extends FilterState {
  page: number;
  limit: number;
}

export const useLenders = ({ page, limit, key, selectedLoanAmounts, selectedPayments, selectedPlafond }: Props) => {
  const [loading, setLoading] = useState(false);

  const [lenders, setLenders] = useState<Lender[]>([]);

  const [pagination, setPagination] = useState<Pagination | null>(null);

  useEffect(() => {
    const fetchLenders = async () => {
      try {
        setLoading(true);

        const response = await axios.get<LenderResponse>(`${process.env.REACT_APP_API_BASE_URL}/api/lender/list`, {
          params: {
            limit,

            // FIX DISINI 🔥
            offset: (page - 1) * limit,

            search: key,
            sortBy: "maxloan",
            sortDirection: selectedPlafond,
            loanType: selectedLoanAmounts,
            paymentType: selectedPayments,
          },
        });

        const newData = response.data.data.lenders;

        setPagination(response.data.data.pagination);

        // APPEND DATA
        setLenders((prev) => {
          // PAGE 1 = RESET
          if (page === 1) {
            return newData;
          }

          const merged = [...prev, ...newData];

          // REMOVE DUPLICATE
          const unique = merged.filter((item, index, self) => index === self.findIndex((x) => x.id === item.id));

          return unique;
        });
      } catch (error) {
        console.error("Failed fetch lenders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLenders();
  }, [page, limit, key, selectedLoanAmounts, selectedPayments, selectedPlafond]);

  return {
    lenders,
    pagination,
    loading,
  };
};
