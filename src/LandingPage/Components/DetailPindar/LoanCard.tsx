// components/LoanCard.tsx

import { FaArrowUpRightFromSquare } from "react-icons/fa6";
type Props = {
  data: any;
};

const LoanCard = ({ data }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden">
      {/* Image */}
      <div className="h-40 max-md:h-60 bg-gray-100 flex items-center justify-center">
        <img src={data.image} alt={data.name} className=" object-cover w-full h-full " />
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <h3 className="max-md:text-2xl text-lg font-bold">{data.name}</h3>

        <div className="flex justify-between">
          <div className="max-md:text-base text-sm text-gray-600">
            <p>Max Pinjaman</p>
            <p className="font-semibold text-black">{data.maxLoan}</p>
          </div>

          <div className="max-md:text-base text-sm text-gray-600">
            <p>Lama Pinjam</p>
            <p className="font-semibold text-black">{data.tenor}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 max-md:text-base text-sm">
            <input type="checkbox" />
            Bandingkan
          </label>
        </div>

        <div className="flex justify-between gap-3 w-full pt-3 pb-2">
          <button
            className="w-full px-3.5 py-2 rounded-xl max-md:text-lg text-sm font-semibold text-white
    bg-gradient-to-r from-rose-600 via-red-600 to-red-700
    hover:from-rose-600 hover:via-red-600 hover:to-red-700
    transition-all duration-300 shadow-md hover:shadow-lg">
            Ajukan Sekarang
          </button>

          <div
            className="px-3.5 py-2 rounded-xl max-md:text-lg text-sm font-semibold text-white
    bg-gray-400 shadow-md hover:shadow-lg flex items-center gap-2">
            Detail <FaArrowUpRightFromSquare className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanCard;
