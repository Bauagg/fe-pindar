import { useNavigate } from "react-router-dom";

interface Props {
  selected: any[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

const CompareBar = ({ selected, onRemove, onClear }: Props) => {
  const navigate = useNavigate();

  if (selected.length === 0) return null;

  const handleCompare = () => {
    sessionStorage.setItem("compareCreditCard", JSON.stringify(selected));

    navigate("/creditcompare");
  };

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
      <div
        className="
          bg-white/95 backdrop-blur-xl
          shadow-2xl
          rounded-3xl
          border border-gray-200
          px-5 py-4
        ">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* LEFT */}
          <div>
            <h2 className="text-xl font-black text-red-600">Bandingkan Kartu</h2>

            <p className="text-sm text-gray-500 mt-1">Maksimal 3 kartu kredit dapat dibandingkan</p>
          </div>

          {/* CENTER */}
          <div className="flex flex-wrap gap-3">
            {selected.map((item) => (
              <div
                key={item.id}
                className="
                  bg-red-50
                  border border-red-100
                  rounded-2xl
                  px-3 py-2
                  flex items-center gap-3
                ">
                {/* IMAGE */}
                <div className="w-10 h-10 ">
                  <img src={`${process.env.REACT_APP_API_BASE_URL}/api${item.imageLink}`} alt={item.title} className="w-full h-full object-contain rounded-lg" />
                </div>

                {/* TITLE */}
                <p className="text-sm font-bold text-gray-800 max-w-[140px] truncate ">{item.title}</p>

                {/* REMOVE */}
                <button
                  onClick={() => onRemove(item.id)}
                  className="
                    w-6 h-6
                    rounded-full
                    bg-red-100
                    text-red-500
                    flex items-center justify-center
                    hover:bg-red-500
                    hover:text-white
                    transition
                    text-xs
                    font-bold
                  ">
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div className="flex gap-3">
            <button
              onClick={onClear}
              className="
                px-5 py-3
                rounded-2xl
                bg-gray-100
                hover:bg-gray-200
                text-gray-700
                font-bold
                transition
              ">
              Clear
            </button>

            <button
              onClick={handleCompare}
              disabled={selected.length < 2}
              className={`
                px-6 py-3
                rounded-2xl
                font-bold
                transition-all duration-300
                ${selected.length < 2 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:scale-[1.03] shadow-lg"}
              `}>
              {selected.length < 2 ? "Pilih Minimal 2" : "Compare"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareBar;
