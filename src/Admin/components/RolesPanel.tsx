import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { api, errorMessage } from "../api";
import { isFullAdmin, useAuth } from "../auth/AuthContext";
import { btnPrimary, card } from "./ui";
import type { Application, RoleItem } from "../types";

interface Props {
  app: Application;
  onSaved: () => Promise<void> | void;
}

/** Hanya tampil untuk super_admin & admin. Role lain (mis. admin retail) tidak melihat panel ini. */
export default function RolesPanel(props: Props) {
  const { user } = useAuth();
  if (!isFullAdmin(user)) return null;
  return <RolesPanelContent {...props} />;
}

function RolesPanelContent({ app, onSaved }: Props) {
  const [all, setAll] = useState<RoleItem[]>([]);
  const [selected, setSelected] = useState<number[]>(app.roles.map((r) => r.id));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const currentIds = useMemo(() => app.roles.map((r) => r.id).sort((a, b) => a - b), [app.roles]);

  useEffect(() => {
    setSelected(app.roles.map((r) => r.id));
  }, [app.roles]);

  useEffect(() => {
    api<{ data: RoleItem[] }>("/admin/multifinance/roles")
      .then((r) => setAll(r.data))
      .catch((e) => setMsg({ ok: false, text: errorMessage(e) }))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: number) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const sortedSel = [...selected].sort((a, b) => a - b);
  const dirty = JSON.stringify(sortedSel) !== JSON.stringify(currentIds);

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      await api(`/admin/multifinance/${app.id}/roles`, { method: "PUT", body: { role_ids: selected } });
      await onSaved();
      setMsg({ ok: true, text: "Akses role diperbarui." });
    } catch (e) {
      setMsg({ ok: false, text: errorMessage(e) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={`${card} p-5`}>
      <h2 className="font-extrabold text-gray-900">Role yang bisa melihat</h2>
      <p className="mt-1 text-sm text-gray-500">Pengajuan ini hanya terlihat oleh role yang dicentang.</p>

      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-red-600" />
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {all.map((r) => (
            <li key={r.id}>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 ring-1 ring-gray-200 hover:bg-gray-50 has-[:checked]:bg-red-50 has-[:checked]:ring-red-300">
                <input type="checkbox" checked={selected.includes(r.id)} onChange={() => toggle(r.id)} className="h-4 w-4 accent-red-600" />
                <span className="text-sm font-bold text-gray-800">{r.name}</span>
                <span className="ml-auto text-xs text-gray-400">{r.slug}</span>
              </label>
            </li>
          ))}
        </ul>
      )}

      {selected.length === 0 && !loading && <p className="mt-3 text-sm font-semibold text-red-600">Pilih minimal satu role.</p>}

      {msg && (
        <p role={msg.ok ? "status" : "alert"} className={`mt-3 flex items-center gap-2 text-sm font-semibold ${msg.ok ? "text-emerald-600" : "text-red-600"}`}>
          {msg.ok && <CheckCircle2 className="h-4 w-4" />}
          {msg.text}
        </p>
      )}

      <button onClick={save} disabled={!dirty || selected.length === 0 || saving} className={`${btnPrimary} mt-4 w-full`}>
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        Simpan akses
      </button>
      <p className="mt-3 text-xs text-gray-400">Kalau role kamu sendiri tidak dicentang, kamu tidak bisa membuka pengajuan ini lagi.</p>
    </section>
  );
}
