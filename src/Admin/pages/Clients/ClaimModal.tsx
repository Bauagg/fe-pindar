import { useState } from "react";
import { Loader2 } from "lucide-react";
import { ApiError, errMsg, request } from "./api";
import { useAuth } from "./auth";
import { ErrorBox, Modal, btnGhost, btnPrimary } from "./ui";

export type Detail = Record<string, any>;

/** Dipakai oleh DataPage (daftar) dan DetailPage (gerbang "belum diambil"). */
export function ClaimModal({
  product,
  id,
  label,
  onClose,
  onClaimed,
  onStale,
}: {
  product: string;
  id: number;
  label: string;
  onClose: () => void;
  onClaimed: (detail: Detail) => void;
  onStale?: () => void;
}) {
  const { client, setQuota } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const quota = client?.quota ?? 0;

  const confirm = async () => {
    setBusy(true);
    setError("");
    try {
      const r = await request<{ data: { quota: number; detail: Detail } }>(`/bidding-client/bidding/${product}/${id}/claim`, { method: "POST" });
      setQuota(r.data.quota);
      onClaimed(r.data.detail);
    } catch (e) {
      setError(errMsg(e));
      setBusy(false);
      if (e instanceof ApiError && (e.status === 409 || e.status === 404)) onStale?.();
    }
  };

  return (
    <Modal title="Ambil data ini?" onClose={onClose} locked={busy}>
      <p className="mt-2 text-sm text-gray-600">
        Kamu akan mengambil <b className="text-gray-900">{label}</b>. Setelah diambil, client lain tidak bisa melihat detailnya.
      </p>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm ring-1 ring-gray-100">
        <span className="font-semibold text-gray-500">Kuota kamu</span>
        <span className="font-extrabold text-gray-900">
          {quota} <span className="mx-1 text-gray-300">→</span> {Math.max(quota - 1, 0)}
        </span>
      </div>

      {quota < 1 && <p className="mt-3 text-sm font-semibold text-red-600">Kuota kamu habis. Hubungi admin untuk menambah kuota.</p>}

      {error && (
        <div className="mt-3">
          <ErrorBox>{error}</ErrorBox>
        </div>
      )}

      <div className="mt-5 flex gap-2">
        <button type="button" onClick={onClose} disabled={busy} className={`${btnGhost} flex-1`}>
          Batal
        </button>
        <button type="button" onClick={confirm} disabled={busy || quota < 1} className={`${btnPrimary} flex-1`}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          Ya, ambil
        </button>
      </div>
    </Modal>
  );
}
