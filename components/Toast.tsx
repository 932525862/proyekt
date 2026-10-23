"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./Icon";

export type ToastData = { kind: "ok" | "error"; title: string; text: string };

/**
 * Ekran burchagidagi bildirishnoma: `duration` dan keyin o'zi yopiladi, sichqoncha ustida turganda
 * taymer to'xtaydi. Taymer JS'da (chiziq faqat ko'rinish uchun) — "kamroq harakat" rejimida ham to'g'ri ishlaydi.
 * Portal orqali body'ga chiqariladi.
 */
export function Toast({ toast, closeLabel, onClose, duration = 6000 }: { toast: ToastData; closeLabel: string; onClose: () => void; duration?: number }) {
  const [paused, setPaused] = useState(false);
  const remaining = useRef(duration);

  useEffect(() => {
    if (paused) return;
    const start = Date.now();
    const t = window.setTimeout(onClose, remaining.current);
    return () => {
      window.clearTimeout(t);
      remaining.current -= Date.now() - start;
    };
  }, [paused, onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // faqat foydalanuvchi amalidan keyin (brauzerda) chiziladi — serverda document yo'q
  if (typeof document === "undefined") return null;
  const ok = toast.kind === "ok";

  return createPortal(
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[70] flex justify-center sm:inset-x-auto sm:bottom-6 sm:right-6 sm:justify-end">
      <div
        role={ok ? "status" : "alert"}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="toast-in pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-lg border border-line bg-card text-ink shadow-[0_24px_60px_-20px_rgb(4_12_22/0.45)]"
      >
        <div className="flex items-start gap-3.5 p-4 pr-11">
          <span className={`grid size-10 shrink-0 place-items-center rounded-full ${ok ? "bg-emerald-500/12 text-emerald-600" : "bg-red-500/12 text-red-600"}`}>
            <Icon name={ok ? "check" : "close"} className="size-5" strokeWidth={2.25} />
          </span>
          <div className="min-w-0 pt-0.5">
            <p className="font-semibold leading-snug">{toast.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{toast.text}</p>
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label={closeLabel} className="absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-md text-muted transition hover:bg-sunk hover:text-ink">
          <Icon name="close" className="size-4" />
        </button>
        {/* qolgan vaqt chizig'i */}
        <span
          aria-hidden
          style={{ animationDuration: `${duration}ms`, animationPlayState: paused ? "paused" : "running" }}
          className={`toast-timer absolute inset-x-0 bottom-0 h-1 origin-left ${ok ? "bg-emerald-500" : "bg-red-500"}`}
        />
      </div>
    </div>,
    document.body,
  );
}
