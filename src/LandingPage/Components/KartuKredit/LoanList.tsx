import LoanCard from "./LoanCard";

interface Props {
  data: any[];
  selected: any[];
  onCompare: (item: any) => void;
  loading: boolean;
}

const LoanList = ({ data, selected, onCompare, loading }: Props) => {
  if (loading && data.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-80 bg-white rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((item) => (
        <LoanCard key={item.id} data={item} checked={!!selected.find((x) => x.id === item.id)} onCompare={onCompare} />
      ))}
    </div>
  );
};

export default LoanList;
