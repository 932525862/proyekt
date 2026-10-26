import Link from "next/link";
import { Icon } from "@/components/Icon";

/** Admin panel uchun umumiy uslublar (server va client komponentlarda ishlatiladi) */
export const field =
  "w-full rounded-md border border-line bg-card px-3 py-2 text-[14.5px] text-ink outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-4 focus:ring-accent/15";
export const label = "grid gap-1.5 text-[13px] font-medium text-ink/80";
export const btn = "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition disabled:opacity-60";
export const btnPrimary = `${btn} bg-accent text-accent-ink hover:bg-ink hover:text-paper`;
export const btnGhost = `${btn} border border-line bg-card text-ink hover:border-accent/50 hover:text-accent`;
export const btnDanger = `${btn} border border-red-200 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white`;
export const card = "rounded-lg border border-line bg-card";

export function PageHeader({ title, sub, back, actions }: { title: string; sub?: string; back?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {back && (
          <Link href={back} className="mb-2 inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent">
            <Icon name="back" className="size-4" /> Orqaga
          </Link>
        )}
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Badge({ children, tone = "bg-sunk text-ink/70" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-[11.5px] font-semibold ${tone}`}>{children}</span>;
}

export function Notice({ tone = "info", children }: { tone?: "info" | "warn" | "ok"; children: React.ReactNode }) {
  const t = { info: "border-accent/20 bg-accent/5 text-ink", warn: "border-amber-300 bg-amber-50 text-amber-900", ok: "border-emerald-300 bg-emerald-50 text-emerald-900" }[tone];
  return <div className={`mb-5 rounded-md border px-4 py-3 text-sm leading-relaxed ${t}`}>{children}</div>;
}

export function Section({ title, sub, action, children }: { title: string; sub?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className={`${card} p-5 sm:p-6`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          {sub && <p className="mt-0.5 text-[13px] text-muted">{sub}</p>}
        </div>
        {action}
      </div>
      <div className="mt-4 grid gap-4">{children}</div>
    </section>
  );
}

const dateFmt = new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tashkent" });
export const fmtDate = (d: Date | null | undefined) => (d ? dateFmt.format(d) : "—");
