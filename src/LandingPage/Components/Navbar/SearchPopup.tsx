import { useCallback, useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface Lender {
  id: string;
  lendername: string;
  imagelink: string;
  maxloan: number;
  maxtenor?: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

const SearchPopup = ({ open, onClose }: Props) => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Lender[]>([]);

  const baseURL = process.env.REACT_APP_API_BASE_URL;

  const fetchLenders = useCallback(async (keyword = "") => {
    try {
      setLoading(true);

      const endpoint = keyword.trim() ? `${baseURL}/api/lender/list?search=${encodeURIComponent(keyword)}` : `${baseURL}/api/lender/list?limit=3`;

      const response = await fetch(endpoint);

      const result = await response.json();

      // FIX RESPONSE
      setData(Array.isArray(result?.data?.lenders) ? result.data.lenders : []);
    } catch (error) {
      console.error(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [baseURL]);

  // OPEN POPUP => LOAD DEFAULT
  useEffect(() => {
    if (!open) return;

    fetchLenders("");
  }, [open, fetchLenders]);

  // SEARCH DEBOUNCE
  useEffect(() => {
    if (!open) return;

    const debounce = setTimeout(() => {
      fetchLenders(search);
    }, 500);

    return () => clearTimeout(debounce);
  }, [search, open, fetchLenders]);

  // CLOSE ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-md flex items-start justify-center p-3 sm:p-5 overflow-y-auto">
      <div
        className="
          w-full max-w-2xl
          mt-5 sm:mt-10
          bg-white
          rounded-[2rem]
          shadow-[0_20px_80px_rgba(0,0,0,0.25)]
          overflow-hidden
          animate-in fade-in zoom-in duration-300
        ">
        {/* HEADER */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-600 to-red-700"></div>

          <div className="relative p-5 sm:p-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Cari Pindar</h2>

              <p className="text-white/80 mt-1 text-sm sm:text-base">Temukan platform pinjaman terbaik & terpercaya</p>
            </div>

            <button
              onClick={onClose}
              className="
                w-11 h-11 rounded-2xl
                bg-white/20
                hover:bg-white/30
                backdrop-blur-md
                flex items-center justify-center
                text-white
                transition
                shrink-0
              ">
              <FiX size={22} />
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="p-4 sm:p-5 border-b border-gray-100">
          <div className="relative">
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

            <input
              autoFocus
              type="text"
              placeholder="Cari nama pindar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full h-14 sm:h-16
                pl-14 pr-5
                rounded-2xl
                border border-gray-200
                bg-gray-50
                outline-none
                text-sm sm:text-base
                focus:ring-4 focus:ring-red-100
                focus:border-red-400
                focus:bg-white
                transition-all duration-300
              "
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="max-h-[65vh] overflow-y-auto p-4 sm:p-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-red-200 border-t-red-500 rounded-full animate-spin"></div>

              <p className="mt-5 text-gray-500 font-medium">Sedang mencari pindar...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-red-50 mx-auto flex items-center justify-center">
                <FiSearch className="text-red-500 text-3xl" />
              </div>

              <h3 className="mt-5 text-xl font-black text-gray-800">Tidak Ditemukan</h3>

              <p className="mt-2 text-gray-500">Coba gunakan kata kunci lain</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(`/pindardetail/${item.id}`);

                    onClose();
                  }}
                  className="
                    group
                    w-full
                    p-4
                    rounded-[1.7rem]
                    border border-gray-100
                    bg-white
                    hover:border-red-200
                    hover:bg-red-50/40
                    hover:shadow-xl
                    transition-all duration-300
                    text-left
                  ">
                  <div className="flex items-center gap-4">
                    {/* IMAGE */}
                    <div
                      className="
                        w-20 h-20
                        rounded-3xl
                        bg-gray-50
                        border border-gray-100
                        p-4
                        shrink-0
                        group-hover:scale-105
                        transition
                      ">
                      <img src={`${baseURL}${item.imagelink}`} alt={item.lendername} className="w-full h-full object-contain" />
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="
                          text-lg sm:text-xl
                          font-black
                          text-gray-800
                          truncate
                        ">
                        {item.lendername}
                      </h3>

                      <p className="text-red-500 font-black mt-2 text-sm sm:text-base">Rp {Number(item.maxloan).toLocaleString("id-ID")}</p>

                      {item.maxtenor && <p className="text-gray-500 text-sm mt-1">Maksimal tenor {item.maxtenor} bulan</p>}
                    </div>

                    {/* ARROW */}
                    <div
                      className="
                        hidden sm:flex
                        w-11 h-11
                        rounded-2xl
                        bg-red-100
                        items-center
                        justify-center
                        text-red-500
                        group-hover:bg-red-500
                        group-hover:text-white
                        transition
                      ">
                      →
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPopup;
