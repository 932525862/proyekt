"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "./Icon";
import type { Dictionary, Locale } from "@/lib/i18n";

type Props = {
  lang: Locale;
  f: Dictionary["form"];
  requestFor?: string;
  options: { value: string; label: string }[];
  defaultInterest?: string;
  model?: string | null;
  onClearModel?: () => void;
};

type Status = "idle" | "sending" | "ok" | "err" | "fail";

const field =
  "w-full rounded-md border border-line bg-paper px-4 py-3 text-[15px] text-ink placeholder:text-muted/70 outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15";

export function LeadForm({ lang, f, requestFor, options, defaultInterest = "", model, onClearModel }: Props) {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (!data.name?.trim() || (data.phone ?? "").replace(/\D/g, "").length < 7 || !data.consent) {
      setStatus("err");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, model: model ?? undefined, lang }),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      form.reset();
      onClearModel?.();
    } catch {
      setStatus("fail");
    }
  }

  const msg = status === "ok" ? f.ok : status === "err" ? f.err : status === "fail" ? f.fail : "";

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 rounded-lg border border-line bg-card p-5 shadow-[0_40px_80px_-30px_rgb(4_12_22/0.55)] sm:p-8">
      {model && (
        <div className="flex items-center justify-between gap-3 rounded-md bg-sunk px-4 py-3 text-sm">
          <span>
            <span className="text-muted">{requestFor}: </span>
            <b className="font-semibold">{model}</b>
          </span>
          <button type="button" onClick={onClearModel} aria-label={f.clear} className="text-muted hover:text-ink">
            <Icon name="plus" className="size-4 rotate-45" />
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          {f.name} *
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {f.company}
          <input name="company" autoComplete="organization" className={field} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {f.phone} *
          <input name="phone" type="tel" required autoComplete="tel" placeholder="+998 __ ___ __ __" className={field} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {f.email}
          <input name="email" type="email" autoComplete="email" placeholder="name@company.uz" className={field} />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-medium">
        {f.interest}
        <select name="interest" defaultValue={defaultInterest} className={`${field} appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat`} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")" }}>
          <option value="">{f.interestAny}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-sm font-medium">
        {f.message}
        <textarea name="message" rows={4} placeholder={f.messageP} className={`${field} resize-y`} />
      </label>

      <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
        <input type="checkbox" name="consent" value="yes" className="mt-0.5 size-[18px] shrink-0 accent-[var(--accent)]" />
        {f.consent}
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className="group mt-1 inline-flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-4 font-semibold text-accent-ink transition hover:bg-ink hover:text-paper disabled:opacity-60"
      >
        {status === "sending" ? f.sending : f.submit}
        <Icon name="arrow" className="size-[18px] transition-transform group-hover:translate-x-1" />
      </button>

      <p
        role="status"
        aria-live="polite"
        className={`min-h-5 text-center text-sm font-medium ${status === "ok" ? "text-accent" : "text-red-500"}`}
      >
        {msg}
      </p>
    </form>
  );
}
