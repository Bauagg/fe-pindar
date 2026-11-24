import { Info } from "lucide-react";

export default function PindarEmpty({ title }: { title: string }) {
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900">{title}</h1>
      <p className="mt-1 text-sm text-gray-500">Semua pengajuan Pindar yang bisa diakses role kamu.</p>

      <div className="mt-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <p className="text-sm font-semibold text-amber-800">Data Pindar belum terhubung. Halaman ini akan terisi setelah integrasinya tersedia.</p>
      </div>

      <section className="mt-6 rounded-2xl border border-gray-100 bg-white">
        <p className="px-5 py-16 text-center text-sm text-gray-500">Belum ada pengajuan.</p>
      </section>
    </div>
  );
}
