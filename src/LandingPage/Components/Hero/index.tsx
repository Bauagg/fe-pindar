import { NavLink } from "react-router-dom";

const categories = [
  {
    title: "Pinjaman Daring",
    image: "/images/kartu.png",
    link: "/pindar",
  },
  {
    title: "Kartu Kredit",
    image: "/images/kartu2.png",
    link: "/kartukredit",
  },
  {
    title: "Pinjaman Bank",
    image: "/images/kartu.png",
    link: "/pinjamanbank",
  },
];

const HeroUdin = () => {
  return (
    <section className="relative w-full overflow-hidden bg-white -mt-10">
      {/* ===== BACKGROUND MERAH SETENGAH ===== */}
      <div className="absolute top-0 left-0 w-full max-sm:h-[45%] h-[40%] bg-red-500 max-sm:rounded-ee-[50px] max-sm:rounded-es-[50px] rounded-ee-[120px] rounded-es-[120px]" />

      {/* ===== CONTENT ===== */}
      <div className="relative z-10">
        {/* ================= CATEGORY ================= */}
        <div className="pt-16">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6">
            <div className="grid grid-cols-3 gap-2 sm:gap-1 md:gap-8">
              {categories.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.link}
                  className="group bg-white rounded-2xl sm:rounded-3xl
                     p-3 sm:p-4 md:p-8
                     shadow-lg hover:shadow-2xl
                     transition transform hover:-translate-y-1">
                  {/* ICON / IMAGE */}
                  <div className="flex justify-center mb-3 sm:mb-4 md:mb-6">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="
                w-12 h-12
                sm:w-16 sm:h-16
                md:w-24 md:h-24
                object-contain
              "
                    />
                  </div>

                  {/* TITLE */}
                  <h3
                    className="
              text-center font-semibold text-gray-800
              text-xs sm:text-sm md:text-xl
              group-hover:text-red-500 transition
              leading-tight
            ">
                    {item.title}
                  </h3>
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        {/* ================= TRENDING ================= */}
        <div className="max-sm:mt-5 mt-10 px-4 sm:px-6 max-w-6xl mx-auto">
          <div
            className=" bg-gradient-to-r from-red-600 to-red-500 rounded-2xl sm:rounded-3xl
p-6 sm:p-6 md:p-12
      flex items-center justify-between
      gap-3 sm:gap-4 md:gap-6
      shadow-xl
    ">
            {/* LEFT */}
            <div className="min-w-0">
              <h2
                className="
          text-white font-bold
          text-md sm:text-xl md:text-3xl
          leading-tight
        ">
                Trending Education
              </h2>
              <p
                className="
          mt-1 text-white/80
          text-xs sm:text-sm
        ">
                Last Date 11/05/2026
              </p>
            </div>

            {/* RIGHT BUTTON */}
            <NavLink
              to="/education/trending"
              className="
        shrink-0
        inline-flex items-center gap-2
        border border-white text-white
        px-3 sm:px-4 md:px-6
        py-2 sm:py-2.5 md:py-3
        rounded-full
        text-xs sm:text-sm md:text-base
        hover:bg-white hover:text-red-600
        transition font-medium
        whitespace-nowrap
      ">
              View all →
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroUdin;
