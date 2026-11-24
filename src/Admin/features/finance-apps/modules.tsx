import React from "react";
import ApplicationListPage from "./ApplicationListPage";
import ApplicationDetailPage from "./ApplicationDetailPage";
import SummaryPage from "./SummaryPage";
import DisbursementPage from "./DisbursementPage";
import { bankLoanConfig, creditCardConfig, pinjamanDaringConfig, type ModuleConfig } from "./config";

/** Halaman siap pakai per modul. Dipasang di router (lihat routes-snippet.tsx). */
function build(config: ModuleConfig) {
  const t = config.title;
  return {
    config,
    /** Ringkasan (khusus super_admin/admin) */
    SummaryPage: () => <SummaryPage config={config} />,
    /** Daftar sesuai role login + tab belum dibaca */
    ListPage: () => <ApplicationListPage config={config} title="Nasabah" description={`Semua pengajuan ${t.toLowerCase()} yang bisa diakses role kamu.`} />,
    /** Semua pengajuan (khusus super_admin/admin) */
    AllPage: () => <ApplicationListPage config={config} all title={`Semua ${t}`} description={`Seluruh pengajuan ${t.toLowerCase()} dari semua role.`} />,
    /** Hanya yang Approved (khusus super_admin/admin) */
    ApprovedPage: () => <ApplicationListPage config={config} all lockedStatus="approved" showUnread={false} title={`${t} Disetujui`} description="Pengajuan yang sudah berstatus Approved." />,
    DetailPage: () => <ApplicationDetailPage config={config} />,
    DisbursementPage: () => <DisbursementPage config={config} />,
  };
}

export const CreditCard = build(creditCardConfig);
export const BankLoan = build(bankLoanConfig);
export const PinjamanDaring = build(pinjamanDaringConfig);
