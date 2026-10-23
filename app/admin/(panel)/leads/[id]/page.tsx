import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { deleteLead, updateLead } from "@/app/admin/actions";
import { Icon } from "@/components/Icon";
import { ConfirmButton, SubmitButton } from "@/components/admin/buttons";
import { Badge, card, field, fmtDate, label, PageHeader } from "@/components/admin/ui";
import { adminCategories, adminLead, leadStatuses } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Zayavka" };

export default async function LeadPage({ params }: PageProps<"/admin/leads/[id]">) {
  const id = Number((await params).id);
  const [lead, cats] = await Promise.all([adminLead(id), adminCategories()]);
  if (!lead) notFound();
  const st = leadStatuses.find((s) => s.value === lead.status)!;
  const interest = cats.find((c) => c.slug === lead.interest);
  const tel = lead.phone.replace(/[^\d+]/g, "");

  const rows: [string, React.ReactNode][] = [
    ["Ism", lead.name],
    ["Tashkilot", lead.company || "—"],
    ["Telefon", <a key="t" href={`tel:${tel}`} className="font-semibold text-accent">{lead.phone}</a>],
    ["Email", lead.email ? <a key="e" href={`mailto:${lead.email}`} className="text-accent">{lead.email}</a> : "—"],
    ["Yo'nalish", interest ? interest.name.uz : lead.interest || "—"],
    ["Model", lead.model || "—"],
    ["Til", (lead.lang || "—").toUpperCase()],
    ["Yuborilgan", fmtDate(lead.createdAt)],
    ["Oxirgi o'zgarish", fmtDate(lead.updatedAt)],
  ];

  return (
    <>
      <PageHeader title={`Zayavka #${lead.id}`} sub={lead.name} back="/admin/leads" actions={<Badge tone={st.tone}>{st.label}</Badge>} />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className={`${card} p-5 sm:p-6`}>
          <dl className="grid gap-3 text-sm">
            {rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[9rem_1fr] gap-3 border-b border-line pb-3 last:border-0">
                <dt className="text-muted">{k}</dt>
                <dd className="min-w-0 break-words">{v}</dd>
              </div>
            ))}
          </dl>
          <h2 className="mt-6 text-sm font-semibold">Xabar</h2>
          <p className="mt-2 whitespace-pre-wrap rounded-md bg-sunk/70 p-4 text-sm leading-relaxed">{lead.message || "Xabar qoldirilmagan."}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a href={`tel:${tel}`} className="inline-flex h-10 items-center gap-2 rounded-md bg-accent px-4 text-sm font-semibold text-accent-ink">
              <Icon name="phone" className="size-4" /> Qo&apos;ng&apos;iroq qilish
            </a>
            <a href={`https://t.me/${tel}`} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-md border border-line px-4 text-sm font-semibold hover:border-accent hover:text-accent">
              <Icon name="telegram" className="size-4" /> Telegram
            </a>
            {lead.email && (
              <a href={`mailto:${lead.email}`} className="inline-flex h-10 items-center gap-2 rounded-md border border-line px-4 text-sm font-semibold hover:border-accent hover:text-accent">
                <Icon name="mail" className="size-4" /> Email
              </a>
            )}
          </div>
        </section>

        <div className="grid content-start gap-6">
          {/* key: saqlangandan so'ng forma yangi qiymatlar bilan qayta chiziladi */}
          <form key={lead.updatedAt?.getTime() ?? 0} action={updateLead} className={`${card} grid gap-4 p-5 sm:p-6`}>
            <input type="hidden" name="id" value={lead.id} />
            <h2 className="font-semibold">Ishlov berish</h2>
            <label className={label}>
              Holat
              <select name="status" defaultValue={lead.status} className={field}>
                {leadStatuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <label className={label}>
              Ichki izoh (faqat adminlar ko&apos;radi)
              <textarea name="note" rows={5} defaultValue={lead.note ?? ""} placeholder="Masalan: tijorat taklifi yuborildi, 25-oktyabr qayta qo'ng'iroq…" className={field} />
            </label>
            <SubmitButton>Saqlash</SubmitButton>
          </form>

          <form action={deleteLead} className={`${card} p-5 sm:p-6`}>
            <input type="hidden" name="id" value={lead.id} />
            <h2 className="font-semibold">Zayavkani o&apos;chirish</h2>
            <p className="mt-1 text-sm text-muted">Spam yoki takroriy so&apos;rovlar uchun. Qaytarib bo&apos;lmaydi.</p>
            <div className="mt-4">
              <ConfirmButton message={`#${lead.id} zayavkani butunlay o'chirasizmi?`}>
                <Icon name="trash" className="size-4" /> O&apos;chirish
              </ConfirmButton>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
