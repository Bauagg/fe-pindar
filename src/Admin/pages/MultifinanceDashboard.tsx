import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { api } from "../api";
import { roleName, useAuth } from "../auth/AuthContext";
import { SERVICES } from "../constants";
import StatusBadge from "../components/StatusBadge";
import type { Application, Paginated, StatusKey } from "../types";

const CARDS = [
  { key: "pending", label: "Menunggu diproses", icon: Clock, tone: "bg-amber-50 text-amber-600" },
  { key: "on_progress", label: "Sedang diproses", icon: Activity, tone: "bg-sky-50 text-sky-600" },
  { key: "approved", label: "Disetujui", icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-600" },
  { key: "rejected", label: "Ditolak", icon: XCircle, tone: "bg-red-50 text-red-600" },
] as const;

const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-");

export default function MultifinanceDashboard() {
  const { user } = useAuth();
  const [counts, setCounts] = useState<Record<StatusKey, number> | null>(null);
  const [recent, setRecent] = useState<Application[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    Promise.all([...CARDS.map((c) => api<Paginated<Application>>(`/admin/multifinance?status=${c.key}&limit=1`)), api<Paginated<Application>>("/admin/multifinance?limit=5")])
      .then((res) => {
        if (!alive) return;
        setCounts(Object.fromEntries(CARDS.map((c, i) => [c.key, res[i].meta.total])) as Record<StatusKey, number>);
        setRecent(res[CARDS.length].data);
      })
      .catch((e: Error) => alive && setError(e.message));

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900">Halo, {user?.name?.split(" ")[0] || "Admin"}</h1>
      <p className="mt-1 text-sm text-gray-500">Kamu masuk sebagai {roleName(user)}. Ini ringkasan pengajuan yang bisa kamu lihat.</p>

      {error && (
        <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* Ringkasan status */}
      <section className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4" aria-label="Ringkasan status">
        {CARDS.map(({ key, label, icon: Icon, tone }) => (
          <div key={key} className="rounded-2xl border border-gray-100 bg-white p-5">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-3xl font-extrabold text-gray-900">{counts ? counts[key] : <span className="inline-block h-8 w-10 animate-pulse rounded bg-gray-100" />}</p>
            <p className="mt-1 text-sm font-semibold text-gray-500">{label}</p>
          </div>
        ))}
      </section>

      {/* Pengajuan terbaru */}
      <section className="mt-8 rounded-2xl border border-gray-100 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="font-extrabold text-gray-900">Pengajuan terbaru</h2>
          <Link to="/admin/multi-finance/applications" className="text-sm font-bold text-red-600 hover:text-red-700">
            Lihat semua
          </Link>
        </div>

        {!counts && !error ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-red-600" />
          </div>
        ) : recent.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-gray-500">Belum ada pengajuan masuk. Pengajuan dari form user akan muncul di sini.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs font-bold text-gray-400">
                <tr>
                  <th className="px-5 py-3">Pemohon</th>
                  <th className="px-5 py-3">Layanan</th>
                  <th className="px-5 py-3">Kendaraan</th>
                  <th className="px-5 py-3">Tanggal</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recent.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50/60">
                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-900">{a.applicant?.name}</p>
                      <p className="text-xs text-gray-400">{a.application_number}</p>
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-700">{SERVICES[a.service_type] || a.service_type}</td>
                    <td className="px-5 py-4 text-gray-600">
                      {a.vehicle.brand} {a.vehicle.model} ({a.vehicle.year})
                    </td>
                    <td className="px-5 py-4 text-gray-600">{fmtDate(a.created_at)}</td>
                    <td className="px-5 py-4">
                      <StatusBadge value={a.status.value} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
