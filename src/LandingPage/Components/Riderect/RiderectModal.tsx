// components/RedirectModal.tsx

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  lenderName: string;
  lenderImage: string;
  redirectUrl: string;
}

const RedirectModal = ({ open, onClose, lenderName, lenderImage, redirectUrl }: Props) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!open) return;

    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);

          window.open(redirectUrl, "_blank");

          onClose();

          return 100;
        }

        return prev + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [open, onClose, redirectUrl]);

  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-[999]
        flex items-center justify-center
        bg-black/50 backdrop-blur-sm
        p-4
      ">
      <div
        className="
          relative
          w-full max-w-md
          bg-white
          rounded-[2rem]
          shadow-2xl
          overflow-hidden
          animate-[fadeIn_.3s_ease]
        ">
        {/* TOP GRADIENT */}
        <div
          className="
            h-2
            bg-gradient-to-r
            from-red-500
            via-rose-500
            to-red-700
          "
        />

        <div className="p-8 text-center">
          {/* ICON */}
          <div
            className="
              w-24 h-24
              mx-auto
              rounded-3xl
              bg-gradient-to-br
              from-gray-50
              to-gray-100
              shadow-inner
              flex items-center justify-center
              mb-5
            ">
            <img src={lenderImage} alt={lenderName} className="w-16 h-16 object-contain" />
          </div>

          {/* TITLE */}
          <h2 className="text-3xl font-black text-gray-900">{lenderName}</h2>

          <p className="mt-3 text-gray-500 leading-relaxed">Anda akan dialihkan menuju halaman aplikasi resmi dalam beberapa detik</p>

          {/* PROGRESS */}
          <div className="mt-8">
            <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  from-red-500
                  via-rose-500
                  to-red-700
                  transition-all duration-100
                "
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <div className="mt-2 text-sm text-gray-400">{Math.ceil((100 - progress) / 10)} detik</div>
          </div>

          {/* BUTTON */}
          <button
            onClick={() => window.open(redirectUrl, "_blank")}
            className="
              mt-8
              w-full
              py-4
              rounded-2xl
              bg-gradient-to-r
              from-red-500
              via-rose-500
              to-red-700
              text-white
              font-bold
              shadow-lg
              hover:scale-[1.02]
              transition-all duration-300
              flex items-center justify-center gap-2
            ">
            Lanjutkan Sekarang
            <ExternalLink size={18} />
          </button>

          {/* CANCEL */}
          <button
            onClick={onClose}
            className="
              mt-3
              text-sm
              text-gray-400
              hover:text-red-500
              transition
            ">
            Batalkan
          </button>
        </div>
      </div>
    </div>
  );
};

export default RedirectModal;
