import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { multifinanceList } from "./multifinanceData"; // sesuaikan path-nya

const getItemsByDevice = (width: number) => {
  if (width >= 1024) return 10; // desktop / laptop
  if (width >= 768) return 8; // tablet
  return 12; // hp
};

const RekomendasiMultifinance = () => {
  const [itemsToShow, setItemsToShow] = useState<number>(9);

  // detect device resize
  useEffect(() => {
    const handleResize = () => setItemsToShow(getItemsByDevice(window.innerWidth));

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="w-full pt-5 md:pt-14 max-w-6xl mx-auto px-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg md:text-2xl font-bold text-gray-900">Pindar Multifinance</h2>

        <NavLink to="/multi-finance" className="text-sm font-medium text-gray-700 hover:text-red-500 transition">
          Lihat Semua
        </NavLink>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {multifinanceList.slice(0, itemsToShow).map((item) => (
          <Link
            key={item.id}
            to={`/multi-finance?finance=${item.id}`}
            // state={{ selectedId: item.id }}
            className="
              group bg-white
              rounded-xl
              p-3 md:p-5
              border border-gray-100
              shadow-md hover:shadow-xl hover:border-red-200
              transition-all duration-300
              hover:-translate-y-1
            ">
            <div className="w-full aspect-square flex items-center justify-center">
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                }}
                className="
                  w-16 h-16 md:w-24 md:h-24
                  object-contain
                  transition-transform duration-300
                  group-hover:scale-110
                "
              />
            </div>

            <div className="mt-3 text-center">
              <p className="text-xs md:text-sm font-semibold text-gray-800 line-clamp-2">{item.name}</p>
              <p className="hidden md:block text-[11px] text-gray-500 mt-1">Tenor hingga {Math.max(...item.tenors)} bln</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RekomendasiMultifinance;
