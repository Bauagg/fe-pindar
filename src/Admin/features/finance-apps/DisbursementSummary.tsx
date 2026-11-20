import React, { useEffect, useMemo, useState } from "react";
import { BarChart3, CalendarDays, Layers, Wallet } from "lucide-react";
import { BarChart, Delta, LineChart, Panel, api, errorMessage } from "./shared";
import type { Point } from "./shared";
import type { ModuleConfig } from "./config";
import type { Compare, DisbursementSummaryData } from "./types";
import { fmtNum, rupiah } from "./format";
import { Alert } from "./ui-parts";

function PeriodCard({ title, amount, tx, previousLabel }: { title: string; amount: Compare; tx: Compare; previousLabel: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <p className="text-xs font-bold text-gray-400">{title}</p>
      <p className="mt-1 text-xl font-extrabold text-gray-900">{rupiah(amount.current)}</p>
      <p className="mt-1 flex items-center gap-2 text-xs font-semibold text-gray-500">
        {fmtNum(tx.current)} transaksi
        <Delta current={amount.current} previous={amount.previous} />
      </p>
      <p className="mt-1 text-xs text-gray-400">
        {previousLabel}: {rupiah(amount.previous)}
      </p>
    </div>
  );
}

export default function DisbursementSummary({ config, className = "", refreshKey = 0 }: { config: ModuleConfig; className?: string; refreshKey?: number }) {
  const [data, setData] = useState<DisbursementSummaryData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    api<{ data: DisbursementSummaryData }>(`${config.api.disbursement}/summary`)
      .then((r) => {
        if (!alive) return;
        setData(r.data);
        setError("");
      })
      .catch((e) => alive && setError(errorMessage(e)));
    return () => {
      alive = false;
    };
  }, [config.api.disbursement, refreshKey]);

  const daily = useMemo<Point[]>(() => (data?.charts.daily ?? []).map((d) => ({ label: new Date(`${d.date}T00:00:00`).toLocaleDateString("id-ID", { day: "numeric", month: "short" }), value: d.amount })), [data]);
  const monthly = useMemo<Point[]>(() => (data?.charts.monthly ?? []).map((m) => ({ label: new Date(`${m.month}-01T00:00:00`).toLocaleDateString("id-ID", { month: "short" }), value: m.amount })), [data]);

  const byProduct = useMemo(() => {
    const rows = config.byKey === "by_card" ? data?.charts.by_card?.map((r) => ({ label: r.card_name, ...r })) : data?.charts.by_bank?.map((r) => ({ label: r.bank_name, ...r }));
    return rows ?? [];
  }, [data, config.byKey]);
  const maxAmount = Math.max(1, ...byProduct.map((r) => r.amount));

  if (error) {
    return (
      <div className={className}>
        <Alert>{error}</Alert>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-gray-900 to-red-900 p-5 text-white">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
            <Wallet className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold text-gray-300">Total pencairan</p>
            <p className="text-2xl font-extrabold">{data ? rupiah(data.overview.total_amount) : "…"}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <Layers className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold text-gray-400">Total transaksi</p>
            <p className="text-2xl font-extrabold text-gray-900">{data ? fmtNum(data.overview.total_transactions) : "…"}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {data ? (
          <>
            <PeriodCard title="Hari ini" amount={data.daily.amount} tx={data.daily.transactions} previousLabel="Kemarin" />
            <PeriodCard title="Minggu ini" amount={data.weekly.amount} tx={data.weekly.transactions} previousLabel="Minggu lalu" />
            <PeriodCard title="Bulan ini" amount={data.monthly.amount} tx={data.monthly.transactions} previousLabel="Bulan lalu" />
          </>
        ) : (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-[120px] animate-pulse rounded-2xl bg-gray-100" />)
        )}
      </div>

      {data && (
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Panel title="Nominal pencairan 30 hari terakhir" icon={CalendarDays}>
              <LineChart data={daily} />
            </Panel>
          </div>

          <section className="rounded-2xl border border-gray-100 bg-white p-5">
            <h3 className="mb-3 flex items-center gap-2 font-extrabold text-gray-900">
              <Layers className="h-4 w-4 text-red-600" />
              Per {config.productLabel.replace(/^Nama /, "").toLowerCase()}
            </h3>
            {byProduct.length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-500">Belum ada data.</p>
            ) : (
              <ul className="space-y-3">
                {byProduct.map((r) => (
                  <li key={r.label}>
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="min-w-0 truncate font-bold text-gray-700" title={r.label}>
                        {r.label || "(tanpa nama)"}
                      </span>
                      <span className="shrink-0 font-extrabold text-gray-900">{rupiah(r.amount)}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-red-500" style={{ width: `${(r.amount / maxAmount) * 100}%` }} />
                    </div>
                    <p className="mt-0.5 text-xs text-gray-400">{fmtNum(r.transactions)} transaksi</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="lg:col-span-3">
            <Panel title="Nominal pencairan 12 bulan terakhir" icon={BarChart3}>
              <BarChart data={monthly} />
            </Panel>
          </div>
        </div>
      )}
    </div>
  );
}
