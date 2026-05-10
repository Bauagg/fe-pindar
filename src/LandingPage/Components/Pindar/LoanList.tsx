// components/LoanList.tsx

import LoanCard from "./LoanCard";
import LoanCardSkeleton from "../../Skeleton/skeletonloan";

import { Lender } from "../../../types/lender";

interface Props {
  data: Lender[];
  selected: Lender[];
  loading: boolean;
  onCompare: (item: Lender) => void;
}

const LoanList = ({ data, selected, onCompare, loading }: Props) => {
  // FIRST LOADING
  if (loading && data.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <LoanCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* CARD LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item) => (
          <LoanCard key={item.id} data={item} onCompare={onCompare} checked={selected.some((x) => x.id === item.id)} />
        ))}
      </div>

      {/* LOAD MORE SKELETON */}
      {loading && data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[...Array(3)].map((_, index) => (
            <LoanCardSkeleton key={index} />
          ))}
        </div>
      )}
    </>
  );
};

export default LoanList;
