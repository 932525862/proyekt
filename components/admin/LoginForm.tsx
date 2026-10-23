"use client";

import { useActionState } from "react";
import { login, type FormState } from "@/app/admin/actions";
import { field } from "./ui";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(login, {});
  return (
    <form action={action} className="mt-6 grid gap-4">
      <input type="hidden" name="next" value={next} />
      <label className="grid gap-1.5 text-sm font-medium">
        Login
        <input name="login" autoComplete="username" required defaultValue="admin" className={field} />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Parol
        <input name="password" type="password" autoComplete="current-password" required autoFocus className={field} />
      </label>
      {state.error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      <button type="submit" disabled={pending} className="mt-1 h-11 rounded-md bg-accent font-semibold text-accent-ink transition hover:bg-ink hover:text-paper disabled:opacity-60">
        {pending ? "Tekshirilmoqda…" : "Kirish"}
      </button>
    </form>
  );
}
