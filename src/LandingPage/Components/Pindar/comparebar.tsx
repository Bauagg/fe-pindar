// components/CompareBar.tsx

import { Lender } from "../../../types/lender";
import { useNavigate } from "react-router-dom";

interface Props {
  selected: Lender[];
  onRemove: (id: string) => void;
  onCompare: () => void;
  onClear: () => void;
}

const CompareBar = ({ selected, onRemove, onCompare, onClear }: Props) => {
  const navigate = useNavigate();

  const handleCompare = () => {
    sessionStorage.setItem("dataCompere", JSON.stringify(selected));

    navigate("/pindarcompare");
  };
  if (selected.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] lg:w-[85%]">
      <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between">
          {/* LEFT */}
          <div>
            <h2 className="text-xl lg:text-2xl font-black text-red-600">Bandingkan Pinjaman</h2>

            <p className="text-gray-500 mt-1 text-sm lg:text-base">Maksimal 3 pinjaman dapat dibandingkan</p>
          </div>

          {/* CENTER */}
          <div className="flex flex-wrap gap-3">
            {selected.map((item) => (
              <div key={item.id} className="bg-gray-100 rounded-2xl px-4 py-3 flex items-center gap-3">
                <img src={`${process.env.REACT_APP_API_BASE_URL}${item.imagelink}`} alt={item.lendername} className="w-10 h-10 object-contain" />

                <p className="font-semibold text-sm">{item.lendername}</p>

                <button onClick={() => onRemove(item.id)} className="text-red-500 font-bold">
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div className="flex gap-3">
            <button
              onClick={handleCompare}
              disabled={selected.length < 2}
              className={`
    px-6 py-3 rounded-2xl font-bold shadow-lg transition-all duration-300
    ${selected.length < 2 ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none" : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:scale-[1.03]"}
  `}>
              {selected.length < 2 ? "Pilih Minimal 2" : "Bandingkan"}
            </button>
            <button onClick={onClear} className="px-6 py-3 rounded-2xl border border-red-500 text-red-500 font-bold">
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareBar;
