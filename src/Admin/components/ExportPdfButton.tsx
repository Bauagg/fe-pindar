import React, { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { SERVICES, STATUS } from "../constants";
import { btnGhost } from "./ui";
import { fmtDateTime } from "../utils";
import type { Application } from "../types";

interface Props {
  app: Application;
}

type RGB = [number, number, number];

// Warna laporan
const RED: RGB = [220, 38, 38];
const RED_DARK: RGB = [153, 27, 27];
const INK: RGB = [17, 24, 39];
const MUTED: RGB = [107, 114, 128];
const LINE: RGB = [229, 231, 235];
const SOFT: RGB = [249, 250, 251];
const GREEN: RGB = [5, 150, 105];
const GREEN_SOFT: RGB = [236, 253, 245];

// Ukuran halaman A4 (mm)
const PW = 210;
const PH = 297;
const M = 15;
const CW = PW - M * 2;
const BOTTOM = PH - 20;

const MAIN_LABELS = ["Nama Leasing", "Tenor", "Jumlah Pencairan", "Komisi Pindar"];
const MONEY_LABELS = ["Jumlah Pencairan", "Komisi Pindar"];

const norm = (s: string) => s.trim().toLowerCase();
const isMain = (label: string) => MAIN_LABELS.some((l) => norm(l) === norm(label));
const isMoney = (label: string) => MONEY_LABELS.some((l) => norm(l) === norm(label));
const isImage = (...s: (string | null | undefined)[]) => s.some((x) => !!x && /\.(jpe?g|png|webp|gif)(\?|#|$)/i.test(x));

const rupiah = (v: string | null) => {
  const n = Number(v);
  return v && Number.isFinite(n) ? `Rp ${n.toLocaleString("id-ID")}` : v || "-";
};

interface Attachment {
  group: string;
  title: string;
  url: string;
  image: boolean;
}

/** Ambil gambar, perkecil, lalu ubah ke JPEG (supaya PDF ringan & aman untuk webp/png). */
async function loadImage(url: string): Promise<{ data: string; w: number; h: number } | null> {
  let objUrl = "";
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) return null;
    objUrl = URL.createObjectURL(await res.blob());

    const img = await new Promise<HTMLImageElement>((ok, no) => {
      const i = new Image();
      i.onload = () => ok(i);
      i.onerror = () => no(new Error("img"));
      i.src = objUrl;
    });

    const scale = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.round(img.naturalWidth * scale);
    const h = Math.round(img.naturalHeight * scale);

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);

    return { data: canvas.toDataURL("image/jpeg", 0.85), w, h };
  } catch {
    return null;
  } finally {
    if (objUrl) URL.revokeObjectURL(objUrl);
  }
}

async function generatePdf(app: Application) {
  const [{ jsPDF }, atMod] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
  const autoTable = atMod.default;

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const lastY = () => (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

  const statusKey = app.status.value;
  const approved = statusKey === "approved";
  const infos = app.approval_infos ?? [];
  const fields = (app.form_fields ?? []).slice().sort((a, b) => a.sort_order - b.sort_order);

  const attachments: Attachment[] = [];
  const attach = (group: string, title: string, url: string | null, value: string | null) => {
    if (url) attachments.push({ group, title, url, image: isImage(url, value) });
  };

  let y = 0;
  const ensure = (h: number) => {
    if (y + h > BOTTOM) {
      doc.addPage();
      y = 22;
    }
  };

  // ===== Header (halaman pertama) =====
  doc.setFillColor(...RED);
  doc.rect(0, 0, PW, 38, "F");
  doc.setFillColor(...RED_DARK);
  doc.rect(0, 38, PW, 1.5, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("LAPORAN PENGAJUAN MULTIFINANCE", M, 14);
  doc.setFontSize(21);
  doc.text(app.application_number, M, 26);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Diajukan ${fmtDateTime(app.created_at)}`, M, 33);

  // Pill status
  const statusLabel = STATUS[statusKey].label;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  const pillW = doc.getTextWidth(statusLabel) + 12;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(PW - M - pillW, 12, pillW, 8, 4, 4, "F");
  doc.setTextColor(...(approved ? GREEN : RED_DARK));
  doc.text(statusLabel, PW - M - pillW / 2, 17.3, { align: "center" });

  y = 49;

  // ===== Helper judul section =====
  const section = (title: string, note?: string) => {
    ensure(16);
    doc.setFillColor(...RED);
    doc.rect(M, y - 1, 1.4, 6.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11.5);
    doc.setTextColor(...INK);
    doc.text(title, M + 4, y + 4);
    if (note) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...MUTED);
      doc.text(note, PW - M, y + 4, { align: "right" });
    }
    doc.setDrawColor(...LINE);
    doc.line(M, y + 8, PW - M, y + 8);
    y += 12;
  };

  const tableStyles = {
    font: "helvetica",
    fontSize: 9.5,
    cellPadding: { top: 3, bottom: 3, left: 3.5, right: 3.5 },
    textColor: INK,
    lineColor: LINE,
    lineWidth: 0.2,
    valign: "middle" as const,
  };

  // ===== 1. Data pemohon =====
  section("Data Pemohon");

  const pairs: [string, string][] = [
    ["Nama sesuai KTP", app.applicant.name],
    ["Nomor telepon", app.applicant.phone],
    ["Layanan", SERVICES[app.service_type] || app.service_type],
    ["Jenis kendaraan", app.vehicle.type ? app.vehicle.type.charAt(0).toUpperCase() + app.vehicle.type.slice(1) : "-"],
    ["Merek", app.vehicle.brand],
    ["Tipe", app.vehicle.model],
    ["Tahun", String(app.vehicle.year)],
    ["Terakhir diperbarui", fmtDateTime(app.updated_at)],
  ];
  const rows: string[][] = [];
  for (let i = 0; i < pairs.length; i += 2) {
    const a = pairs[i];
    const b = pairs[i + 1] ?? ["", ""];
    rows.push([a[0], a[1] || "-", b[0], b[1]]);
  }

  autoTable(doc, {
    startY: y,
    margin: { left: M, right: M, top: 22, bottom: 20 },
    body: rows,
    theme: "grid",
    styles: tableStyles,
    columnStyles: {
      0: { cellWidth: 33, fontStyle: "bold", textColor: MUTED, fillColor: SOFT, fontSize: 8.5 },
      1: { cellWidth: 57 },
      2: { cellWidth: 33, fontStyle: "bold", textColor: MUTED, fillColor: SOFT, fontSize: 8.5 },
      3: { cellWidth: 57 },
    },
  });
  y = lastY() + 10;

  // ===== 2. Informasi persetujuan (jika approved) =====
  if (approved) {
    section("Informasi Persetujuan", "Status: Disetujui");

    const find = (label: string) => infos.find((i) => norm(i.label) === norm(label));
    const gap = 4;
    const bw = (CW - gap * 3) / 4;
    const bh = 22;
    ensure(bh + 6);

    MAIN_LABELS.forEach((label, idx) => {
      const info = find(label);
      const x = M + idx * (bw + gap);
      const komisi = norm(label) === norm("Komisi Pindar");

      doc.setFillColor(...(komisi ? GREEN_SOFT : SOFT));
      doc.setDrawColor(...(komisi ? GREEN : LINE));
      doc.setLineWidth(komisi ? 0.5 : 0.25);
      doc.roundedRect(x, y, bw, bh, 2, 2, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...MUTED);
      doc.text(label.toUpperCase(), x + 3, y + 6);

      const raw = info ? (isMoney(label) ? rupiah(info.value) : info.value || "-") : "Belum diisi";
      doc.setFontSize(komisi ? 11.5 : 10);
      doc.setTextColor(...(info ? (komisi ? GREEN : INK) : MUTED));
      const lines = (doc.splitTextToSize(raw, bw - 6) as string[]).slice(0, 2);
      doc.text(lines, x + 3, y + 13);
    });
    doc.setLineWidth(0.2);
    y += bh + 6;

    const extras = infos.filter((i) => !isMain(i.label));
    if (extras.length > 0) {
      autoTable(doc, {
        startY: y,
        margin: { left: M, right: M, top: 22, bottom: 20 },
        head: [["Informasi tambahan", "Isi"]],
        body: extras.map((i) => {
          if (i.field_type === "file") {
            attach("Informasi Persetujuan", i.label, i.file_url, i.value);
            return [i.label, "Lihat halaman lampiran"];
          }
          return [i.label, isMoney(i.label) ? rupiah(i.value) : i.value || "-"];
        }),
        theme: "grid",
        styles: tableStyles,
        headStyles: { fillColor: RED, textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9 },
        columnStyles: { 0: { cellWidth: 55, fontStyle: "bold", textColor: MUTED, fillColor: SOFT } },
      });
      y = lastY() + 10;
    }

    // Isian file di 4 label utama (kalau ada) tetap masuk lampiran
    infos.filter((i) => isMain(i.label) && i.field_type === "file").forEach((i) => attach("Informasi Persetujuan", i.label, i.file_url, i.value));
  }

  // ===== 3. Form tambahan (jika ada) =====
  if (fields.length > 0) {
    section("Form Tambahan", `${fields.length} isian`);

    autoTable(doc, {
      startY: y,
      margin: { left: M, right: M, top: 22, bottom: 20 },
      head: [["Isian", "Jawaban"]],
      body: fields.map((f) => {
        if (f.field_type === "file") {
          if (f.file_url) {
            attach("Form Tambahan", f.label, f.file_url, f.value);
            return [f.label, "Lihat halaman lampiran"];
          }
          return [f.label, "-"];
        }
        return [f.label, f.value || "-"];
      }),
      theme: "grid",
      styles: tableStyles,
      headStyles: { fillColor: RED, textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9 },
      columnStyles: { 0: { cellWidth: 55, fontStyle: "bold", textColor: MUTED, fillColor: SOFT } },
    });
    y = lastY() + 10;
  }

  // ===== 4. Lampiran (gambar & dokumen) =====
  if (attachments.length > 0) {
    doc.addPage();
    y = 22;
    section("Lampiran", `${attachments.length} berkas`);

    const MAX_H = 105;

    for (let idx = 0; idx < attachments.length; idx++) {
      const a = attachments[idx];
      const img = a.image ? await loadImage(a.url) : null;

      // Caption
      ensure(16);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(...INK);
      doc.text(`${idx + 1}. ${a.title}`, M, y + 3);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...MUTED);
      doc.text(a.group, PW - M, y + 3, { align: "right" });
      y += 6;

      if (img) {
        let w = CW;
        let h = (img.h / img.w) * w;
        if (h > MAX_H) {
          h = MAX_H;
          w = (img.w / img.h) * h;
        }
        ensure(h + 8);
        const x = M + (CW - w) / 2;
        doc.setDrawColor(...LINE);
        doc.setFillColor(...SOFT);
        doc.roundedRect(M, y, CW, h + 4, 2, 2, "FD");
        doc.addImage(img.data, "JPEG", x, y + 2, w, h);
        y += h + 10;
      } else {
        // Dokumen non-gambar (mis. PDF) atau gambar gagal dimuat: tampilkan tautan
        ensure(14);
        doc.setFillColor(...SOFT);
        doc.setDrawColor(...LINE);
        doc.roundedRect(M, y, CW, 11, 2, 2, "FD");
        doc.setFontSize(8.5);
        doc.setTextColor(...MUTED);
        doc.text(a.image ? "Gambar tidak dapat dimuat. Buka tautan:" : "Dokumen terlampir. Buka tautan:", M + 4, y + 6.8);
        doc.setTextColor(37, 99, 235);
        const prefixW = doc.getTextWidth(a.image ? "Gambar tidak dapat dimuat. Buka tautan: " : "Dokumen terlampir. Buka tautan: ");
        doc.textWithLink("Buka berkas", M + 4 + prefixW, y + 6.8, { url: a.url });
        y += 17;
      }
    }
  }

  // ===== Header kecil & footer di semua halaman =====
  const total = doc.getNumberOfPages();
  const printed = new Date().toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" });

  for (let p = 1; p <= total; p++) {
    doc.setPage(p);

    if (p > 1) {
      doc.setFillColor(...RED);
      doc.rect(0, 0, PW, 3, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...MUTED);
      doc.text(`Pengajuan ${app.application_number}`, M, 11);
      doc.setFont("helvetica", "normal");
      doc.text(app.applicant.name, PW - M, 11, { align: "right" });
    }

    doc.setDrawColor(...LINE);
    doc.line(M, PH - 14, PW - M, PH - 14);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text("Dokumen rahasia, hanya untuk keperluan internal.", M, PH - 9);
    doc.text(`Dicetak ${printed}`, M, PH - 5.5);
    doc.setFont("helvetica", "bold");
    doc.text(`Halaman ${p} dari ${total}`, PW - M, PH - 9, { align: "right" });
  }

  doc.save(`Pengajuan-${app.application_number}.pdf`);
}

export default function ExportPdfButton({ app }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    setBusy(true);
    setError("");
    try {
      await generatePdf(app);
    } catch (e) {
      console.error(e);
      setError("Gagal membuat PDF. Coba lagi.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-end">
      <button type="button" onClick={run} disabled={busy} className={`${btnGhost} shrink-0`}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
        {busy ? "Membuat PDF..." : "Export PDF"}
      </button>
      {error && (
        <p role="alert" className="mt-1 text-xs font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
