// Components/FloatingWaButton/index.tsx

import { useState } from "react";
import { X } from "lucide-react";

interface FloatingWaButtonProps {
  phone?: string; // format lokal, contoh: "08138320993"
  message?: string;
  name?: string;
  preview?: string;
}

const WhatsAppIcon = ({ className = "w-7 h-7 fill-white" }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={className}>
    <path d="M16.004 3C9.38 3 4 8.373 4 14.99c0 2.65.86 5.1 2.33 7.09L4.5 29l7.1-1.86a12.9 12.9 0 0 0 4.4.77h.004C22.62 27.9 28 22.53 28 15.9 28 9.28 22.63 3 16.004 3zm0 22.63h-.003a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-4.21 1.1 1.12-4.1-.25-.42a10.55 10.55 0 0 1-1.62-5.63c0-5.85 4.77-10.62 10.63-10.62 5.85 0 10.62 4.77 10.62 10.63s-4.77 10.75-10.5 10.75zm5.83-7.94c-.32-.16-1.9-.94-2.2-1.04-.29-.11-.51-.16-.72.16-.21.32-.82 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.87-1.76-2.19-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.63-.53-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.67 0 1.57 1.15 3.08 1.31 3.3.16.21 2.26 3.45 5.47 4.84.76.33 1.36.53 1.82.67.77.24 1.46.21 2.01.13.61-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.29-.21-.61-.37z" />
  </svg>
);

const FloatingWaButton = ({
  phone = "08138320993",
  message = "Halo, saya ingin bertanya mengenai pengajuan multi finance di Pindar.",
  name = "Admin Pindar",
  preview = "Halo! Ada yang bisa kami bantu seputar pengajuan kamu?",
}: FloatingWaButtonProps) => {
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(false);

  const normalizedPhone = phone.replace(/[^0-9]/g, "").replace(/^0/, "62");
  const waLink = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;

  const toggleOpen = () => {
    setOpen((prev) => !prev);
    setSeen(true);
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-[90] flex flex-col items-end gap-3">
      {/* CARD */}
      {open && (
        <div
          className="
            w-[280px] sm:w-80
            bg-white
            rounded-2xl sm:rounded-[1.75rem]
            shadow-2xl
            border border-gray-100
            overflow-hidden
            origin-bottom-right
            animate-[popIn_.25s_ease]
          ">
          <div className="relative bg-gradient-to-r from-green-500 to-green-600 px-4 sm:px-5 py-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
              <WhatsAppIcon className="w-6 h-6 fill-white" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-black text-sm sm:text-base leading-tight truncate">{name}</p>
              <p className="text-white/90 text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-lime-300"></span>
                Online
              </p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Tutup" className="ml-auto p-1 rounded-lg text-white/90 hover:bg-white/20 shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 sm:p-5 bg-gray-50">
            <div className="bg-white rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm px-4 py-3 text-sm text-gray-700 leading-relaxed">{preview}</div>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-4
                w-full
                flex items-center justify-center gap-2
                rounded-xl sm:rounded-2xl
                bg-gradient-to-r from-green-500 to-green-600
                text-white font-bold text-sm
                py-3
                shadow-lg shadow-green-200
                hover:scale-[1.02] active:scale-[0.98]
                transition-all duration-300
              ">
              <WhatsAppIcon className="w-4 h-4 fill-white" />
              Chat Sekarang
            </a>
          </div>
        </div>
      )}

      {/* TOGGLE BUTTON */}
      <button
        onClick={toggleOpen}
        aria-label={open ? "Tutup chat" : "Buka chat WhatsApp"}
        className="
          relative
          w-14 h-14 sm:w-16 sm:h-16
          rounded-full
          bg-gradient-to-br from-green-500 to-green-600
          shadow-[0_10px_30px_rgba(16,185,129,0.45)]
          hover:shadow-[0_14px_38px_rgba(16,185,129,0.55)]
          hover:scale-[1.06]
          active:scale-[0.95]
          transition-all duration-300
          flex items-center justify-center
        ">
        {!open && !seen && <span className="absolute inset-0 rounded-full bg-green-400 opacity-50 animate-ping motion-reduce:animate-none" />}

        {!open && !seen && <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-red-500 border-2 border-white text-white text-[10px] font-black flex items-center justify-center">1</span>}

        {open ? <X className="w-6 h-6 text-white" /> : <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8 fill-white" />}
      </button>
    </div>
  );
};

export default FloatingWaButton;
