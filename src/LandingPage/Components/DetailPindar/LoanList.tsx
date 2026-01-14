// components/LoanList.tsx
import LoanCard from "./LoanCard";
import { loanData } from "../../../types/loanData";

const LoanList = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
      {loanData.map((item) => (
        <LoanCard key={item.id} data={item} />
      ))}
    </div>
  );
};

export default LoanList;
