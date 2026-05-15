// components/LoanCard.tsx

import { useNavigate } from "react-router-dom";
import { FaArrowUpRightFromSquare, FaCheck } from "react-icons/fa6";

import RedirectModal from "../../Components/Riderect/RiderectModal";
import { useState } from "react";

interface Props {
  data: any;
  checked: boolean;
  onCompare: (item: any) => void;
}

const LoanCard = ({ data, checked, onCompare }: Props) => {
  const baseURL = process.env.REACT_APP_API_BASE_URL;

  const navigate = useNavigate();

  const [openRedirect, setOpenRedirect] = useState(false);

  const handleDetail = () => {
    navigate(`/creditcarddetail/${data.id}`);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden group">
        {/* IMAGE */}
        <div className="h-40 max-md:h-56 relative overflow-hidden flex items-center justify-center">
          {/* Blur Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200/60 to-gray-400/40 backdrop-blur-xl" />

          {/* Card Image */}
          <img
            src={`${baseURL}/api${data.imageLink}`}
            alt={data.title}
            className="
              relative z-10 max-w-[85%] h-[85%] object-contain
              rounded-xl shadow-lg
              group-hover:scale-105 transition duration-300
              drop-shadow-[0_35px_45px_rgba(0,0,0,0.45)]
            "
          />
        </div>

        {/* CONTENT */}
        <div className="p-5 space-y-4">
          {/* TITLE */}
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 line-clamp-2">{data.title}</h3>

            <p className="mt-2 text-red-500 font-black text-xl md:text-2xl">Rp {Number(data.yearlyFee).toLocaleString("id-ID")}</p>

            <p className="text-sm text-gray-500 mt-1">{data.detailYearlyFee}</p>
          </div>

          {/* FEATURES */}
          <ul className="space-y-2">
            {data.features?.slice(0, 4).map((item: any, index: number) => (
              <li
                key={index}
                className="
                  flex items-center gap-2
                  text-sm md:text-base
                  text-gray-700
                ">
                <span
                  className="
                    flex items-center justify-center
                    w-5 h-5 rounded-full
                    bg-green-100 text-green-600
                    shrink-0
                  ">
                  <FaCheck size={12} />
                </span>

                <span className="line-clamp-1">{item.feature}</span>
              </li>
            ))}
          </ul>

          {/* COMPARE */}
          <label
            className="
              flex items-center gap-2
              text-sm max-md:text-base
              pt-1 cursor-pointer
            ">
            <input type="checkbox" checked={checked} onChange={() => onCompare(data)} className="accent-red-500" />
            Bandingkan
          </label>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-3">
            {/* AJUKAN */}
            <button
              onClick={() => setOpenRedirect(true)}
              className="
                w-full py-3 rounded-xl
                text-sm md:text-lg
                font-semibold text-white
                bg-gradient-to-r
                from-rose-600 via-red-600 to-red-700
                hover:scale-[1.02]
                transition-all duration-300
                shadow-md hover:shadow-lg
              ">
              Ajukan Sekarang
            </button>

            {/* DETAIL */}
            <button
              onClick={handleDetail}
              className="
                px-4 py-3 rounded-xl
                text-sm md:text-lg
                font-semibold
                bg-gray-100 text-gray-700
                hover:bg-gray-200
                flex items-center gap-2
                transition-all duration-300
                shadow-md hover:shadow-lg
              ">
              Detail
              <FaArrowUpRightFromSquare />
            </button>
          </div>
        </div>
      </div>

      {/* REDIRECT MODAL */}
      <RedirectModal open={openRedirect} onClose={() => setOpenRedirect(false)} lenderName={data.title} lenderImage={`${baseURL}/api${data.imageLink}`} redirectUrl={data.redirectLink || "#"} />
    </>
  );
};

export default LoanCard;
