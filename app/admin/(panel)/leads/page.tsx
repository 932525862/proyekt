import type { Metadata } from "next";
import Link from "next/link";
import { quickLeadStatus } from "@/app/admin/actions";
import { Icon } from "@/components/Icon";
import { Badge, btnGhost, card, field, fmtDate, Notice, PageHeader } from "@/components/admin/ui";
import { adminLeads, leadCounts, leadStatuses } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Zayavkalar" };

export default async function LeadsPage({ searchParams }: PageProps<"/admin/leads">) {
  const sp = await searchParams;
  const status = typeof sp.status === "string" ? sp.status : "all";
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const [leads, counts] = await Promise.all([adminLeads({ status, q }), leadCounts()]);
  const tabs = [{ value: "all", label: "Barchasi", n: counts.total }, ...leadStatuses.map((s) => ({ value: s.value, label: s.label, n: counts[s.value] ?? 0 }))];
  const qs = (patch: Record<string, string>) => {
    const p = new URLSearchParams({ ...(status !== "all" ? { status } : {}), ...(q ? { q } : {}), ...patch }).toString();
    return p ? `?${p}` : "";
  };

  return (
    <>
      <PageHeader
        title="Zayavkalar"
        sub="Saytdagi formalardan kelgan so'rovlar"
        actions={
          <a href={`/admin/leads/export${qs({})}`} className={btnGhost}>
            <Icon name="download" className="size-4" /> CSV (Excel)
          </a>
        }
      />
      {sp.deleted && <Notice tone="ok">Zayavka o&apos;chirildi.</Notice>}

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 md:mx-0 md:px-0">
          {tabs.map((t) => (
            <Link
              key={t.value}
              href={`/admin/leads${t.value === "all" ? (q ? `?q=${encodeURIComponent(q)}` : "") : `?status=${t.value}${q ? `&q=${encodeURIComponent(q)}` : ""}`}`}
              className={`shrink-0 rounded-md border px-3 py-1.5 text-sm font-medium ${status === t.value ? "border-accent bg-accent text-accent-ink" : "border-line bg-card text-ink/70 hover:text-ink"}`}
            >
              {t.label} <span className="opacity-70">{t.n}</span>
            </Link>
          ))}
        </div>
        <form className="flex gap-2 md:w-80">
          {status !== "all" && <input type="hidden" name="status" value={status} />}
          <input name="q" defaultValue={q} placeholder="Ism, telefon, tashkilot…" className={field} />
          <button className={btnGhost} aria-label="Qidirish">
            <Icon name="search" className="size-4" />
          </button>
        </form>
      </div>

      {leads.length === 0 ? (
        <div className={`${card} px-5 py-14 text-center text-sm text-muted`}>Zayavka topilmadi.</div>
      ) : (
        <div className={`${card} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-sunk/70 text-left text-[12px] uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">#</th>
                  <th className="px-4 py-3 font-semibold">Mijoz</th>
                  <th className="px-4 py-3 font-semibold">Aloqa</th>
                  <th className="px-4 py-3 font-semibold">Qiziqish</th>
                  <th className="px-4 py-3 font-semibold">Sana</th>
                  <th className="px-4 py-3 font-semibold">Holat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {leads.map((l) => {
                  const st = leadStatuses.find((s) => s.value === l.status)!;
                  return (
                    <tr key={l.id} className={l.status === "new" ? "bg-accent/[0.04]" : ""}>
                      <td className="px-4 py-3 text-muted tech">{l.id}</td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/leads/${l.id}`} className="font-semibold hover:text-accent">
                          {l.name}
                        </Link>
                        {l.company && <div className="text-[13px] text-muted">{l.company}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <a href={`tel:${l.phone.replace(/[^\d+]/g, "")}`} className="block hover:text-accent">
                          {l.phone}
                        </a>
                        {l.email && (
                          <a href={`mailto:${l.email}`} className="block text-[13px] text-muted hover:text-accent">
                            {l.email}
                          </a>
                        )}
                      </td>
                      <td className="max-w-56 px-4 py-3">
                        <div className="truncate">{l.model || l.interest || "—"}</div>
                        {l.message && <div className="truncate text-[13px] text-muted">{l.message}</div>}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-[13px] text-muted">{fmtDate(l.createdAt)}</td>
                      <td className="px-4 py-3">
                        <form action={quickLeadStatus} className="flex items-center gap-2">
                          <input type="hidden" name="id" value={l.id} />
                          <Badge tone={st.tone}>{st.label}</Badge>
                          <select
                            name="status"
                            defaultValue={l.status}
                            aria-label="Holatni o'zgartirish"
                            className="rounded-md border border-line bg-card px-1.5 py-1 text-xs"
                          >
                            {leadStatuses.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                          <button className="rounded-md border border-line px-2 py-1 text-xs font-semibold hover:border-accent hover:text-accent">OK</button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
