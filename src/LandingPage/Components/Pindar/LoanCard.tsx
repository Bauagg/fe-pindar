// components/LoanCard.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { Lender } from "../../../types/lender";
import RedirectModal from "../Riderect/RiderectModal";

interface Props {
  data: Lender;
  checked: boolean;
  onCompare: (item: Lender) => void;
}

const LoanCard = ({ data, checked, onCompare }: Props) => {
  const [openRedirect, setOpenRedirect] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="bg-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden">
      <div className="h-40 max-md:h-60 bg-gray-100 flex items-center justify-center border-b border-gray-200">
        <img src={`${process.env.REACT_APP_API_BASE_URL}${data.imagelink}`} alt={data.lendername} className="object-contain w-full h-full bg-white" />
      </div>

      <div className="p-5 space-y-3">
        <h3 className="max-md:text-2xl text-lg font-bold">{data.lendername}</h3>

        <div className="flex justify-between">
          <div className="max-md:text-base text-sm text-gray-600">
            <p>Max Pinjaman</p>

            <p className="font-semibold text-black">Rp {Number(data.maxloan).toLocaleString("id-ID")}</p>
          </div>

          <div className="max-md:text-base text-sm text-gray-600">
            <p>Lama Pinjam</p>

            <p className="font-semibold text-black">{data.maxtenor} Bulan</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 max-md:text-base text-sm cursor-pointer">
            <input type="checkbox" checked={checked} onChange={() => onCompare(data)} className="accent-red-500" />
            Bandingkan
          </label>
        </div>

        <div className="flex justify-between gap-3 w-full pt-3 pb-2">
          <button
            onClick={() => setOpenRedirect(true)}
            rel="noopener noreferrer"
            className="w-full text-center px-3.5 py-2 rounded-xl max-md:text-lg text-sm font-semibold text-white
            bg-gradient-to-r from-rose-600 via-red-600 to-red-700
            transition-all duration-300 shadow-md hover:shadow-lg">
            Ajukan Sekarang
          </button>

          <button
            onClick={() => {
              navigate(`/pindardetail/${data.id}`);
            }}
            className="
    px-3.5 py-2 rounded-xl max-md:text-lg text-sm font-semibold text-white
    bg-gray-400 hover:bg-gray-500
    shadow-md hover:shadow-lg
    flex items-center gap-2
    transition-all duration-300
  ">
            Detail
            <FaArrowUpRightFromSquare className="text-white" />
          </button>
        </div>
      </div>

      <RedirectModal open={openRedirect} onClose={() => setOpenRedirect(false)} lenderName={data.lendername} lenderImage={`${process.env.REACT_APP_API_BASE_URL}${data.imagelink}`} redirectUrl={data.directlink} />
    </div>
  );
};

export default LoanCard;
