import { useState } from "react";
import { Download, FileSpreadsheet, CalendarDays, X, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";
import { api, errorMessage } from "../api";

type ExportApplication = Record<string, any>;

type ExportResponse = {
  success: boolean;
  message?: string;
  data: ExportApplication[];
  meta?: {
    total?: number;
    start_date?: string | null;
    end_date?: string | null;
    all?: boolean;
    role?: string | null;
  };
};

type Props = {
  // Isi true jika ingin tombol ekspor seluruh role ditampilkan.
  // Backend tetap menjadi penentu izin akses sebenarnya.
  showAllOption?: boolean;
};

const formatDate = (value: any) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const getValue = (obj: any, paths: string[]) => {
  for (const path of paths) {
    const value = path.split(".").reduce((current, key) => current?.[key], obj);

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return "";
};

const flattenObject = (obj: Record<string, any>, prefix = ""): Record<string, any> => {
  const result: Record<string, any> = {};

  Object.entries(obj || {}).forEach(([key, value]) => {
    if (value === null || value === undefined || typeof value === "function") {
      return;
    }

    // Jangan masukkan array ke sheet utama.
    if (Array.isArray(value)) return;

    const column = prefix ? `${prefix}.${key}` : key;

    if (value instanceof Date) {
      result[column] = value;
    } else if (typeof value === "object") {
      Object.assign(result, flattenObject(value, column));
    } else {
      result[column] = value;
    }
  });

  return result;
};

const countBy = (data: ExportApplication[], keyPaths: string[]) => {
  const result: Record<string, number> = {};

  data.forEach((item) => {
    const value = getValue(item, keyPaths);
    const label = String(value || "Tidak diketahui");

    result[label] = (result[label] || 0) + 1;
  });

  return Object.entries(result).map(([label, total]) => ({
    Kategori: label,
    Jumlah: total,
  }));
};

const createWorkbook = (applications: ExportApplication[]) => {
  const workbook = XLSX.utils.book_new();

  // =====================================================
  // SHEET 1: RINGKASAN
  // =====================================================

  const statusCounts = countBy(applications, ["status.value", "status"]);
  const serviceCounts = countBy(applications, ["service_type"]);
  const collateralCounts = countBy(applications, ["vehicle_type", "certificate_type", "asset_ownership"]);

  const summaryRows = [
    ["LAPORAN PENGAJUAN MULTIFINANCE"],
    ["Tanggal Export", new Date().toLocaleString("id-ID")],
    [],
    ["RINGKASAN"],
    ["Total Pengajuan", applications.length],
    [],
    ["BERDASARKAN STATUS"],
    ["Status", "Jumlah"],
    ...statusCounts.map((item) => [item.Kategori, item.Jumlah]),
    [],
    ["BERDASARKAN LAYANAN"],
    ["Layanan", "Jumlah"],
    ...serviceCounts.map((item) => [item.Kategori, item.Jumlah]),
    [],
    ["BERDASARKAN JENIS JAMINAN / ASET"],
    ["Jenis", "Jumlah"],
    ...collateralCounts.map((item) => [item.Kategori, item.Jumlah]),
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows);

  summarySheet["!cols"] = [{ wch: 35 }, { wch: 22 }];

  XLSX.utils.book_append_sheet(workbook, summarySheet, "Ringkasan");

  // =====================================================
  // SHEET 2: DATA PENGAJUAN
  // =====================================================

  const mainRows = applications.map((app) => ({
    "Nomor Pengajuan": app.application_number || "",
    "Nama Pemohon": getValue(app, ["applicant.name", "applicant_name"]),
    "Nomor Telepon": getValue(app, ["applicant.phone", "applicant_phone"]),
    "Tipe Pemohon": getValue(app, ["applicant.type", "applicant_type"]),
    Alamat: getValue(app, ["applicant.address", "applicant_address"]),
    Layanan: app.service_type || "",
    "Jenis Kendaraan": app.vehicle_type || "",
    "Merek Kendaraan": app.vehicle_brand || "",
    "Model Kendaraan": app.vehicle_model || "",
    "Tahun Kendaraan": app.vehicle_year || "",
    "Jenis Sertifikat": app.certificate_type || "",
    "Kepemilikan Aset": app.asset_ownership || "",
    Transmisi: app.transmission || "",
    "Status Pembiayaan": app.financing_status || "",
    "Leasing Sebelumnya": app.previous_leasing || "",
    "Usia Pemohon": app.applicant_age || "",
    "Status Pengajuan": getValue(app, ["status.label", "status.value", "status"]),
    "Alasan Ditolak": app.rejected_reason || "",
    "Alasan Perbaikan": app.correction_reason || "",
    "Tanggal Pengajuan": formatDate(app.created_at),
    "Terakhir Diperbarui": formatDate(app.updated_at),
    "Role Penerima": Array.isArray(app.roles) ? app.roles.map((role: any) => role.name || role.slug).join(", ") : "",
  }));

  const applicationSheet = XLSX.utils.json_to_sheet(mainRows);

  applicationSheet["!cols"] = Object.keys(mainRows[0] || {}).map(() => ({ wch: 22 }));

  XLSX.utils.book_append_sheet(workbook, applicationSheet, "Data Pengajuan");

  // =====================================================
  // SHEET 3: FORM TAMBAHAN
  // =====================================================

  const formRows: Record<string, any>[] = [];

  applications.forEach((app) => {
    const fields = Array.isArray(app.field_values) ? app.field_values : [];

    fields.forEach((field: any) => {
      formRows.push({
        "Nomor Pengajuan": app.application_number || "",
        "Nama Pemohon": getValue(app, ["applicant.name", "applicant_name"]),
        "Nama Field": field.label || field.name || field.field_name || field.field_id || "",
        Nilai: field.value ?? field.field_value ?? "",
      });
    });
  });

  if (formRows.length) {
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(formRows), "Form Tambahan");
  }

  // =====================================================
  // SHEET 4: RIWAYAT AKTIVITAS
  // =====================================================

  const activityRows: Record<string, any>[] = [];

  applications.forEach((app) => {
    const activities = Array.isArray(app.activities) ? app.activities : [];

    activities.forEach((activity: any) => {
      activityRows.push({
        "Nomor Pengajuan": app.application_number || "",
        "Nama Pemohon": getValue(app, ["applicant.name", "applicant_name"]),
        Aktivitas: activity.action || "",
        Pelaku: activity.user?.name || activity.actor?.name || "",
        Keterangan: typeof activity.meta === "object" ? JSON.stringify(activity.meta) : activity.meta || "",
        Tanggal: formatDate(activity.created_at),
      });
    });
  });

  if (activityRows.length) {
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(activityRows), "Riwayat Aktivitas");
  }

  // =====================================================
  // SHEET 5: INFORMASI PERSETUJUAN
  // =====================================================

  const approvalRows: Record<string, any>[] = [];

  applications.forEach((app) => {
    const approvals = Array.isArray(app.approval_infos) ? app.approval_infos : [];

    approvals.forEach((approval: any) => {
      approvalRows.push({
        "Nomor Pengajuan": app.application_number || "",
        "Nama Pemohon": getValue(app, ["applicant.name", "applicant_name"]),
        ...flattenObject(approval),
      });
    });
  });

  if (approvalRows.length) {
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(approvalRows), "Informasi Persetujuan");
  }

  return workbook;
};

export default function ExportApplicationsButton({ showAllOption = true }: Props) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"all" | "date">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleExport = async () => {
    if (mode === "date") {
      if (!startDate || !endDate) {
        setError("Tanggal awal dan tanggal akhir wajib diisi.");
        return;
      }

      if (startDate > endDate) {
        setError("Tanggal awal tidak boleh melebihi tanggal akhir.");
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      // Coba akses seluruh data terlebih dahulu.
      if (showAllOption) {
        params.set("all", "1");
      }

      if (mode === "date") {
        params.set("start_date", startDate);
        params.set("end_date", endDate);
      }

      let response: ExportResponse;

      try {
        response = await api<ExportResponse>(`/admin/multifinance/export?${params.toString()}`);
      } catch (err: any) {
        // Jika bukan Admin/Super Admin, ambil data sesuai role login.
        const statusCode = err?.response?.status;

        if (statusCode !== 403 || !showAllOption) {
          throw err;
        }

        params.delete("all");

        response = await api<ExportResponse>(`/admin/multifinance/export?${params.toString()}`);
      }

      const applications = response.data || [];

      if (!applications.length) {
        setError("Tidak ada data pengajuan untuk diexport.");
        return;
      }

      const workbook = createWorkbook(applications);

      const filename = mode === "date" ? `Laporan-Multifinance-${startDate}-sampai-${endDate}.xlsx` : `Laporan-Multifinance-${new Date().toISOString().slice(0, 10)}.xlsx`;

      XLSX.writeFile(workbook, filename);

      setOpen(false);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError("");
          setOpen(true);
        }}
        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500">
        <FileSpreadsheet className="h-4 w-4" />
        Export Excel
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">Export Pengajuan</h2>
                <p className="mt-1 text-sm text-gray-500">Download laporan pengajuan dalam format Excel.</p>
              </div>

              <button type="button" onClick={() => setOpen(false)} disabled={loading} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-4 hover:bg-gray-50">
                <input type="radio" name="exportMode" checked={mode === "all"} onChange={() => setMode("all")} className="mt-1 accent-emerald-600" />

                <div>
                  <p className="font-bold text-gray-900">Semua Data</p>
                  <p className="mt-1 text-xs text-gray-500">Export seluruh pengajuan yang dapat diakses akun.</p>
                </div>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-4 hover:bg-gray-50">
                <input type="radio" name="exportMode" checked={mode === "date"} onChange={() => setMode("date")} className="mt-1 accent-emerald-600" />

                <div className="flex-1">
                  <p className="font-bold text-gray-900">Berdasarkan Rentang Tanggal</p>
                  <p className="mt-1 text-xs text-gray-500">Export pengajuan berdasarkan tanggal dibuat.</p>
                </div>
              </label>

              {mode === "date" && (
                <div className="space-y-3 rounded-xl bg-gray-50 p-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-gray-600">Tanggal Awal</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-gray-600">Tanggal Akhir</label>
                    <input
                      type="date"
                      value={endDate}
                      min={startDate || undefined}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              {error && <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700">{error}</div>}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} disabled={loading} className="rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100">
                Batal
              </button>

              <button
                type="button"
                onClick={handleExport}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}

                {loading ? "Menyiapkan..." : "Download Excel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
