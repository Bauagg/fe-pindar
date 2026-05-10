import { useEffect, useState } from "react";
import { CreditCardItem } from "../types/creditcard";

interface Props {
  page: number;
  limit: number;
  featureId: string;
  minYearlyFee: number;
  maxYearlyFee: number;
  sortBy: string;
  sortDirection: string;
}

export const useCreditCards = ({ page, limit, featureId, minYearlyFee, maxYearlyFee, sortBy, sortDirection }: Props) => {
  const [cards, setCards] = useState<CreditCardItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState<any>(null);

  const baseURL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetchCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, featureId, minYearlyFee, maxYearlyFee, sortBy, sortDirection]);

  const fetchCards = async () => {
    try {
      setLoading(true);

      const offset = (page - 1) * limit;

      const response = await fetch(`${baseURL}/api/credit-card/search?featureId=${featureId}&minYearlyFee=${minYearlyFee}&maxYearlyFee=${maxYearlyFee}&sortBy=${sortBy}&sortDirection=${sortDirection}&limit=${limit}&offset=${offset}`);

      const result = await response.json();

      const newData = result.data.creditCards || [];

      setPagination(result.data.pagination);

      if (page === 1) {
        setCards(newData);
      } else {
        setCards((prev) => [...prev, ...newData]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    cards,
    loading,
    pagination,
  };
};
