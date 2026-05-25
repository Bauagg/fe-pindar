import { Link } from "react-router-dom";
import { FileText, ArrowUpRight } from "lucide-react";
import Navbar from "../../Components/Navbar";
import { dummyPinjamanBank } from "../../../types/dummyPinjamanBank";
import Footer from "../../Components/Footer";

const ListPinjamanBank = () => {
  return (
    <>
      <Navbar />

      <main className="bg-gradient-to-b from-white to-red-50/40 min-h-screen">
        <section className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-14">
          {/* HEADER */}
          <div className="mt-20 w-full pb-6">
            <p>Home {">"} Pinjaman Bank</p>

            <h1 className="text-2xl font-bold">Pinjaman Bank</h1>
          </div>

          {/* LIST */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dummyPinjamanBank.map((item) => (
              <Link
                key={item.id}
                to={`/pinjaman-bank/${item.id}`}
                className="
                  group bg-white rounded-[2rem] p-5
                  border border-gray-100 shadow-lg
                  hover:shadow-2xl hover:-translate-y-1
                  transition-all duration-300
                ">
                <div className="w-full h-44 bg-gray-50 rounded-3xl flex items-center justify-center">
                  <img
                    src={item.imageLink}
                    alt={item.namaBank}
                    className="
                      w-28 h-28 object-contain
                      transition-transform duration-300
                      group-hover:scale-110
                    "
                  />
                </div>

                <div className="mt-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-black text-gray-900">{item.namaBank}</h2>

                      <p className="text-sm font-semibold text-red-500 mt-1">{item.publisher}</p>
                    </div>

                    <div
                      className="
                        w-10 h-10 rounded-2xl bg-red-50
                        flex items-center justify-center
                        group-hover:bg-red-500 transition
                      ">
                      <ArrowUpRight
                        className="
                          w-5 h-5 text-red-500
                          group-hover:text-white transition
                        "
                      />
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mt-4 leading-relaxed line-clamp-3">{item.detailPinjaman}</p>

                  <div className="mt-5 pt-4 border-t border-gray-100 flex gap-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />

                    <p className="line-clamp-2">{item.dokumenDibutuhkan.join(", ")}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ListPinjamanBank;
