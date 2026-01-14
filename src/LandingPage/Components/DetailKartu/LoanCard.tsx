// components/LoanCard.tsx
import { FaArrowUpRightFromSquare, FaCheck } from "react-icons/fa6";

type Props = {
  data: {
    name: string;
    image: string;
    features: string[];
  };
};

const LoanCard = ({ data }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden group">
      {/* Image */}
      {/* Image */}
      <div className="h-40 max-md:h-56 relative overflow-hidden flex items-center justify-center">
        {/* Blur Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200/60 to-gray-400/40 backdrop-blur-xl" />

        {/* Card Image */}
        <img
          src={data.image}
          alt={data.name}
          className="relative z-10 max-w-[85%] h-[85%] object-contain
    rounded-xl shadow-lg
    group-hover:scale-105 transition duration-300  drop-shadow-[0_35px_45px_rgba(0,0,0,0.45)]"
        />
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <h3 className="text-lg max-md:text-2xl font-bold text-gray-800">{data.name}</h3>

        {/* Features */}
        <ul className="space-y-2">
          {data.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm max-md:text-base text-gray-700">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600">
                <FaCheck size={12} />
              </span>
              {feature}
            </li>
          ))}
        </ul>

        {/* Compare */}
        <label className="flex items-center gap-2 text-sm max-md:text-base pt-1">
          <input type="checkbox" className="accent-red-500" />
          Bandingkan
        </label>

        {/* Actions */}
        <div className="flex gap-3 pt-3">
          <button
            className="w-full py-3 rounded-xl text-sm max-md:text-lg font-semibold text-white
            bg-gradient-to-r from-rose-600 via-red-600 to-red-700
            hover:from-rose-600 hover:via-red-600 hover:to-red-700
            transition shadow-md hover:shadow-lg">
            Ajukan Sekarang
          </button>

          <button
            className="px-4 py-3 rounded-xl text-sm max-md:text-lg font-semibold
            bg-gray-100 text-gray-700 hover:bg-gray-200
            flex items-center gap-2 transition shadow-md hover:shadow-lg">
            Detail <FaArrowUpRightFromSquare />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanCard;
