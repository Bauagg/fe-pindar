import React, { useEffect } from "react";
import { MessageCircle, PhoneOff, X } from "lucide-react";

// Format internasional tanpa "+" / "0" di depan: 08134262738 -> 628134262738
const ADMIN_WA = "628134262738";

type Props = {
  open: boolean;
  onClose: () => void;
  phone?: string; // nomor yang diinput user (opsional, ikut masuk ke template pesan)
  name?: string; // nama pemohon (opsional)
};

export default function PhoneUsedModal({ open, onClose, phone, name }: Props) {
  // Tutup dengan tombol Esc (scroll-lock diatur oleh halaman induk)
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);

    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  // Template pesan WhatsApp
  const message = [
    "Halo Admin, saya ingin menanyakan pengajuan multifinance saya.",
    "",
    name ? `Nama: ${name}` : null,
    phone ? `Nomor telepon/WA: ${phone}` : null,
    "",
    "Saat mengajukan, muncul pemberitahuan bahwa nomor ini sudah terdaftar. Mohon bantuannya untuk pengecekan atau perubahan data. Terima kasih.",
  ]
    .filter((line) => line !== null)
    .join("\n");

  const waUrl = `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" role="alertdialog" aria-modal="true" aria-labelledby="phone-used-title" aria-describedby="phone-used-desc">
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]" onClick={onClose} />

      {/* Dialog */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="h-1 bg-gradient-to-r from-red-500 via-red-500 to-orange-400" />

        <button onClick={onClose} aria-label="Tutup" className="absolute right-3 top-4 flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800">
          <X className="h-4 w-4" />
        </button>

        <div className="px-6 pb-6 pt-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <PhoneOff className="h-7 w-7" />
          </div>

          <h2 id="phone-used-title" className="mt-5 text-lg font-extrabold text-gray-900">
            Nomor telepon/WA sudah terdaftar
          </h2>

          <p id="phone-used-desc" className="mt-2 text-sm leading-relaxed text-gray-500">
            Nomor ini sudah pernah dipakai untuk pengajuan sebelumnya. Silakan gunakan nomor lain, atau hubungi admin kami jika Anda ingin mengubah data atau membutuhkan bantuan.
          </p>

          {phone && <p className="mx-auto mt-4 w-fit rounded-full border border-gray-100 bg-gray-50 px-4 py-1.5 text-sm font-bold tracking-wide text-gray-700">{phone}</p>}

          <div className="mt-6 flex flex-col gap-2.5">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#1ebe5b] focus-visible:outline focus-visible:outline-2">
              <MessageCircle className="h-4 w-4" />
              Hubungi Admin via WhatsApp
            </a>

            <button onClick={onClose} className="rounded-2xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-50 focus-visible:outline focus-visible:outline-2">
              Ganti nomor telepon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
