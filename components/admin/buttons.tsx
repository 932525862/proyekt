"use client";

import { useFormStatus } from "react-dom";
import { btnDanger, btnPrimary } from "./ui";

/** Forma yuborilayotganda bloklanadigan tugma */
export function SubmitButton({ children, className = btnPrimary, pendingText = "Saqlanmoqda…" }: { children: React.ReactNode; className?: string; pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? pendingText : children}
    </button>
  );
}

/** O'chirishdan oldin tasdiqlash so'raydigan tugma (forma ichida) */
export function ConfirmButton({ children, message, className = btnDanger, pendingText = "Bajarilmoqda…" }: { children: React.ReactNode; message: string; className?: string; pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {pending ? pendingText : children}
    </button>
  );
}
