import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, CalendarPlus, CheckCircle2, Coins, Inbox } from "lucide-react";
import { errMsg, request } from "./api";
import { useAuth } from "./auth";
import { BASE } from "./config";
import { ErrorBox, ProductBadge, Spinner, btnPrimary, card, fmtDateTime, nf } from "./ui";

interface RecentClaimed {
  id: number;
  product: string;
  product_label: string;
  name: string | null;
  shared_at: string;
  claimed_at: string | null;
}

interface Summary {
  quota: number;
  total_claimed: number;
  claimed_today: number;
  new_today: number;
  available_total: number;
  claimed_by_product: { product: string; label: string; total: number }[];
  recent_claimed: RecentClaimed[];
}

function StatCard({ icon: Icon, label, value, tone, hint }: { icon: React.ElementType; label: string; value: number; tone: string; hint?: string }) {
  return (
    <div className={`${card} p-5`}>
      <div className="flex items-center gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="text-sm font-semibold text-gray-500">{label}</p>
      </div>
      <p className="mt-3 text-3xl font-extrabold text-gray-900">{nf.format(value)}</p>
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

export default function SummaryPage() {
  const { client, setQuota } = useAuth();
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    request<{ data: Summary }>("/bidding-client/summary")
      .then((r) => {
        if (!alive) return;
        setData(r.data);
        setQuota(r.data.quota);
      })
      .catch((e) => alive && setError(errMsg(e)))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const heading = (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900">Halo, {client?.name?.split(" ")[0]}</h1>
      <p className="mt-1 text-sm text-gray-500">Ringkasan aktivitas bidding kamu.</p>
    </div>
  );

  if (loading) {
    return (
      <div>
        {heading}
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        {heading}
        <div className="mt-6">
          <ErrorBox>{error || "Ringkasan tidak tersedia."}</ErrorBox>
        </div>
      </div>
    );
  }

  return (
    <div>
      {heading}

      {data.quota <= 0 && (
        <p role="status" className="mt-5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          Kuota bidding kamu habis. Hubungi admin untuk menambah kuota.
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Coins} label="Sisa kuota" value={data.quota} tone="bg-red-50 text-red-600" hint="1 data yang diambil memakai 1 kuota" />
        <StatCard icon={CheckCircle2} label="Data yang kamu ambil" value={data.total_claimed} tone="bg-emerald-50 text-emerald-600" hint={`${data.claimed_today} diambil hari ini`} />
        <StatCard icon={CalendarPlus} label="Data baru hari ini" value={data.new_today} tone="bg-violet-50 text-violet-600" hint="Dibagikan admin hari ini" />
        <StatCard icon={Inbox} label="Data tersedia" value={data.available_total} tone="bg-amber-50 text-amber-600" hint="Belum diambil siapa pun" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className={`${card} overflow-hidden lg:col-span-2`}>
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-3">
            <h2 className="text-sm font-extrabold text-gray-900">5 data terakhir yang kamu ambil</h2>
            <Link to={`${BASE}/bidding?scope=mine`} className="text-xs font-bold text-red-600 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
              Lihat semua
            </Link>
          </div>

          {data.recent_claimed.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm text-gray-500">Kamu belum mengambil data apa pun.</p>
              <Link to={`${BASE}/bidding?scope=available`} className={`${btnPrimary} mt-4`}>
                Cari data bidding
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {data.recent_claimed.map((r) => (
                <li key={`${r.product}-${r.id}`}>
                  <Link
                    to={`${BASE}/bidding/${r.product}/${r.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 hover:bg-gray-50/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">{r.name ?? "-"}</p>
                      <p className="mt-0.5 text-xs text-gray-400">Diambil {fmtDateTime(r.claimed_at)}</p>
                    </div>
                    <ProductBadge label={r.product_label} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={`${card} overflow-hidden`}>
          <h2 className="border-b border-gray-100 px-5 py-3 text-sm font-extrabold text-gray-900">Per produk</h2>
          <ul className="divide-y divide-gray-50">
            {data.claimed_by_product.map((p) => (
              <li key={p.product} className="flex items-center justify-between px-5 py-3.5">
                <ProductBadge label={p.label} />
                <span className="text-sm text-gray-500">
                  <b className="text-gray-900">{nf.format(p.total)}</b> diambil
                </span>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-100 p-4">
            <Link to={`${BASE}/bidding?scope=available`} className={`${btnPrimary} w-full`}>
              Lihat data tersedia
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
