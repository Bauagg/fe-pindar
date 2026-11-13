import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  /** Cegah tutup lewat overlay / ESC / tombol X (mis. saat sedang menyimpan) */
  locked?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

const SIZE = { sm: "sm:max-w-md", md: "sm:max-w-xl", lg: "sm:max-w-3xl" } as const;

const FOCUSABLE = 'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Popup reusable.
 * - Desktop: kartu di tengah layar. Mobile: muncul dari bawah (bottom sheet).
 * - Tutup: tombol X, klik area gelap, atau Esc. Fokus dikunci di dalam popup.
 */
export default function Modal({ open, onClose, title, subtitle, icon, size = "md", locked = false, children, footer }: Props) {
  const titleId = useId();
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const lockedRef = useRef(locked);

  useEffect(() => {
    onCloseRef.current = onClose;
    lockedRef.current = locked;
  });

  // Mount / unmount dengan animasi masuk-keluar
  useEffect(() => {
    if (open) {
      setMounted(true);
      let r2 = 0;
      const r1 = requestAnimationFrame(() => {
        r2 = requestAnimationFrame(() => setShown(true));
      });
      return () => {
        cancelAnimationFrame(r1);
        cancelAnimationFrame(r2);
      };
    }

    setShown(false);
    const t = window.setTimeout(() => setMounted(false), 200);
    return () => window.clearTimeout(t);
  }, [open]);

  // Kunci scroll halaman, Esc, focus trap, kembalikan fokus saat tutup
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !lockedRef.current) {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (e.key === "Tab" && panel.current) {
        const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
        if (items.length === 0) return;

        const first = items[0];
        const last = items[items.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);

    const focusTimer = window.setTimeout(() => {
      const target = panel.current?.querySelector<HTMLElement>("[data-autofocus]") ?? panel.current;
      target?.focus();
    }, 60);

    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
      {/* Overlay */}
      <div className={`absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] transition-opacity duration-200 ${shown ? "opacity-100" : "opacity-0"}`} onClick={() => !lockedRef.current && onCloseRef.current()} aria-hidden="true" />

      {/* Panel */}
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl outline-none transition-all duration-200 sm:rounded-3xl ${SIZE[size]} ${
          shown ? "translate-y-0 opacity-100 sm:scale-100" : "translate-y-6 opacity-0 sm:translate-y-2 sm:scale-95"
        }`}>
        {/* Header */}
        <div className="flex items-start gap-3 border-b border-gray-100 px-5 pb-4 pt-5 sm:px-6">
          {icon && <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">{icon}</div>}

          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-lg font-extrabold text-gray-900">
              {title}
            </h2>
            {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
          </div>

          <button
            type="button"
            onClick={() => !locked && onClose()}
            disabled={locked}
            aria-label="Tutup"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 disabled:opacity-40">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>

        {/* Footer */}
        {footer && <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-4 sm:px-6">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
