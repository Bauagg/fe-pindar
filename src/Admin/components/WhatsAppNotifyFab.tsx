import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Send, ShieldCheck, UserRound, X } from "lucide-react";
import { isFullAdmin, useAuth } from "../auth/AuthContext";
import { STATUS } from "../constants";
import Modal from "./Modal";
import { btnGhost, btnPrimary, inputCls } from "./ui";
import type { Application, StatusKey } from "../types";

type Target = "customer" | "admin";

const STORAGE_KEY = "wa_admin_terkait_number";

const norm = (s: string) => s.trim().toLowerCase();
const MONEY_LABELS = ["jumlah pencairan", "komisi pindar"];
// Komisi itu data internal, jangan dikirim ke customer.
const INTERNAL_ONLY = ["komisi pindar"];

// Label status untuk pesan ke customer (bahasa Indonesia).
const STATUS_ID: Record<StatusKey, string> = {
  pending: "Pending",
  on_progress: "On Progress",
  approved: "Approved",
  correction: "Perlu Koreksi",
  rejected: "Ditolak",
};

const rupiah = (value: string | null) => {
  const n = Number(value);
  return value && Number.isFinite(n) ? `Rp ${n.toLocaleString("id-ID")}` : value || "-";
};

/** 0812xxx / 812xxx / +62812xxx -> 62812xxx (format wa.me) */
const toWaNumber = (raw: string) => {
  let n = (raw || "").replace(/\D/g, "");
  if (n.startsWith("0")) n = "62" + n.slice(1);
  else if (n.startsWith("8")) n = "62" + n;
  return n;
};

const loadAdminNumber = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
};

function buildMessage(app: Application, target: Target) {
  const key = app.status.value; // pending | on_progress | approved | correction | rejected
  const isCustomer = target === "customer";
  const label = isCustomer ? STATUS_ID[key] ?? key : STATUS[key]?.label ?? key;
  const infos = (app.approval_infos ?? []).filter((i) => i.field_type !== "file" && i.value && (!isCustomer || !INTERNAL_ONLY.includes(norm(i.label))));

  let detail = "";
  if (key === "approved") {
    const lines = infos.map((i) => `• ${i.label}: *${MONEY_LABELS.includes(norm(i.label)) ? rupiah(i.value) : i.value}*`);
    detail = lines.length ? `${isCustomer ? "Berikut rincian persetujuannya:" : "Rincian persetujuan:"}\n${lines.join("\n")}` : isCustomer ? "Rincian persetujuan akan kami kabari segera." : "Rincian persetujuan belum diisi.";
  } else if (key === "pending") {
    detail = isCustomer ? "Pengajuan Anda masih menunggu untuk diproses. Kami akan kabari lagi ya." : "Masih menunggu diproses.";
  } else if (key === "on_progress") {
    detail = isCustomer ? "Pengajuan Anda sedang kami proses. Mohon ditunggu ya." : "Sedang dalam proses.";
  } else if (key === "correction") {
    const reason = app.status.correction_reason || "Tidak ada alasan yang dicantumkan.";
    detail = isCustomer ? `Ada data yang perlu dikoreksi:\n"${reason}"\n\nMohon dilengkapi/diperbaiki ya.` : `Alasan koreksi:\n"${reason}"`;
  } else if (key === "rejected") {
    const reason = app.status.rejected_reason || "Tidak ada alasan yang dicantumkan.";
    detail = isCustomer ? `Mohon maaf, pengajuan belum bisa kami setujui.\nAlasan:\n"${reason}"` : `Alasan penolakan:\n"${reason}"`;
  }

  if (isCustomer) {
    return [
      `Halo Kak *${app.applicant.name}* 👋`,
      ``,
      `Kami dari Pindar ingin menginformasikan, pengajuan dengan nomor *${app.application_number}* saat ini berstatus *${label}*.`,
      ``,
      detail,
      ``,
      `Kalau ada pertanyaan, silakan balas pesan ini ya 🙏`,
      ``,
      `_🤖 Pesan ini dikirim otomatis oleh sistem Pindar_`,
    ]
      .filter((l, i, arr) => !(l === "" && arr[i - 1] === ""))
      .join("\n");
  }

  return [
    `📌 *Update Pengajuan*`,
    `No: *${app.application_number}*`,
    `Atas nama: ${app.applicant.name}`,
    `Telepon pemohon: ${app.applicant.phone || "-"}`,
    `Status saat ini: *${label.toUpperCase()}*`,
    ``,
    detail,
    ``,
    `_⚙️ Pesan otomatis dari sistem Pindar_`,
  ].join("\n");
}

export default function WhatsAppNotifyFab({ app }: { app: Application }) {
  const { user } = useAuth();
  const full = isFullAdmin(user); // hanya super_admin & admin yang boleh kirim ke customer

  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<Target>(full ? "customer" : "admin");
  const [adminPhone, setAdminPhone] = useState(loadAdminNumber);
  const [custom, setCustom] = useState<string | null>(null);

  // Role terbatas selalu ke admin terkait, apa pun isi state target.
  const effectiveTarget: Target = full ? target : "admin";

  // Buka pengajuan lain: tombol muncul lagi
  useEffect(() => {
    setHidden(false);
    setOpen(false);
  }, [app.id]);

  // Nomor admin tersimpan otomatis di localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, adminPhone);
    } catch {
      /* abaikan jika storage diblokir */
    }
  }, [adminPhone]);

  const generated = useMemo(() => buildMessage(app, effectiveTarget), [app, effectiveTarget]);

  // Data/target berubah -> pesan dibuat ulang (edit manual direset)
  useEffect(() => setCustom(null), [generated]);

  const message = custom ?? generated;
  const number = toWaNumber(effectiveTarget === "customer" ? app.applicant.phone : adminPhone);
  const canSend = number.length >= 9 && message.trim().length > 0;
  const href = canSend ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : undefined;

  if (hidden) return null;

  const optionCls = (active: boolean) => `flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${active ? "border-emerald-400 bg-emerald-50 ring-1 ring-emerald-300" : "border-gray-200 bg-white hover:bg-gray-50"}`;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setHidden(true)}
          aria-label="Sembunyikan tombol WhatsApp"
          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-white shadow hover:bg-gray-900">
          <X className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500">
          <MessageCircle className="h-5 w-5" /> Info via WhatsApp
        </button>
      </div>

      {open && (
        <Modal title="Kirim info via WhatsApp" onClose={() => setOpen(false)}>
          <div className="space-y-4 md:max-h-[450px] overflow-auto ">
            <div>
              <p className="mb-2 text-sm font-bold text-gray-900">{full ? "Informasikan ke siapa?" : "Kirim ke admin terkait"}</p>
              <div className="space-y-2">
                {full && (
                  <button type="button" onClick={() => setTarget("customer")} className={optionCls(effectiveTarget === "customer")}>
                    <UserRound className="h-5 w-5 text-sky-600" />
                    <span className="min-w-0">
                      <span className="block text-sm font-extrabold text-gray-900">Customer</span>
                      <span className="block truncate text-xs font-semibold text-gray-500">
                        {app.applicant.name} · {app.applicant.phone || "Nomor belum ada"}
                      </span>
                    </span>
                  </button>
                )}
                <button type="button" onClick={() => setTarget("admin")} className={optionCls(effectiveTarget === "admin")}>
                  <ShieldCheck className="h-5 w-5 text-indigo-600" />
                  <span className="min-w-0">
                    <span className="block text-sm font-extrabold text-gray-900">Admin terkait</span>
                    <span className="block truncate text-xs font-semibold text-gray-500">{adminPhone || "Nomor belum diisi"}</span>
                  </span>
                </button>
              </div>
            </div>

            {effectiveTarget === "admin" && (
              <div>
                <label htmlFor="wa-admin" className="mb-2 block text-sm font-bold text-gray-900">
                  Nomor WhatsApp admin
                </label>
                <input id="wa-admin" type="tel" inputMode="tel" value={adminPhone} onChange={(e) => setAdminPhone(e.target.value)} placeholder="Contoh: 081234567890" className={inputCls} />
                <p className="mt-1 text-xs text-gray-400">Tersimpan otomatis di browser ini, jadi tidak perlu diisi ulang.</p>
              </div>
            )}

            <div>
              <label htmlFor="wa-message" className="mb-2 block text-sm font-bold text-gray-900">
                Pesan
              </label>
              <textarea id="wa-message" rows={13} value={message} onChange={(e) => setCustom(e.target.value)} className={`${inputCls} h-auto resize-none py-3 text-sm`} />
              <p className="mt-1 text-xs text-gray-400">Pesan bisa diedit dulu sebelum dikirim.</p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setOpen(false)} className={btnGhost}>
                Batal
              </button>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-disabled={!canSend}
                onClick={(e) => {
                  if (!canSend) e.preventDefault();
                }}
                className={`${btnPrimary} ${canSend ? "" : "pointer-events-none opacity-50"}`}>
                <Send className="h-4 w-4" /> Buka WhatsApp
              </a>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
