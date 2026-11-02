import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { dummyPinjamanBank } from "../../types/dummyPinjamanBank";

const getItemsByDevice = (width: number) => {
  if (width >= 1024) return 5; // desktop / laptop (5 kolom x 2 baris)
  if (width >= 768) return 5; // tablet (4 kolom x 2 baris)
  return 6; // hp (2 kolom x 3 baris)
};

const RekomendasiPinjamanBank = () => {
  const [itemsToShow, setItemsToShow] = useState<number>(6);

  // detect device resize
  useEffect(() => {
    const handleResize = () => {
      setItemsToShow(getItemsByDevice(window.innerWidth));
    };

    handleResize(); // initial set
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="w-full pt-10 md:pt-14 max-w-6xl mx-auto px-1 md:px-3">
      <div
        className="
          relative overflow-hidden
          bg-gradient-to-br
          from-red-500
          via-red-600
          to-red-700
          rounded-[1rem] md:rounded-[2rem]
          py-8 md:py-10
          shadow-2xl
        ">
        {/* BACKGROUND EFFECT */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

        {/* HEADER */}
        <div className="relative z-10 px-6 flex items-center justify-between mb-6">
          <h2 className="text-lg md:text-2xl font-bold text-white">Pinjaman Bank</h2>

          <NavLink to="/pinjaman-bank" className="text-sm font-medium text-white/90 hover:text-white transition">
            Lihat Semua
          </NavLink>
        </div>

        {/* GRID */}
        <div className="relative z-10 px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {dummyPinjamanBank.slice(0, itemsToShow).map((item) => (
              <Link
                key={item.id}
                to={`/pinjaman-bank/${item.id}`}
                className="
                  group bg-white
                  rounded-2xl
                  p-3 md:p-5
                  shadow-xl
                  transition-all duration-300
                  hover:-translate-y-1
                ">
                <div className="w-full aspect-square flex items-center justify-center">
                  <img
                    src={item.imageLink}
                    alt={item.namaBank}
                    className="
                      w-24 h-24 md:w-24 md:h-24
                      object-contain
                      transition-transform duration-300
                      group-hover:scale-110
                    "
                  />
                </div>

                <div className="mt-3 text-center">
                  <p className="text-xs md:text-sm font-semibold text-gray-800 line-clamp-2">{item.namaBank}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RekomendasiPinjamanBank;
