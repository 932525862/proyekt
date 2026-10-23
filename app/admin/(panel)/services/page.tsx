import type { Metadata } from "next";
import Link from "next/link";
import { deleteService, moveService, toggleService } from "@/app/admin/actions";
import { Icon } from "@/components/Icon";
import { ConfirmButton } from "@/components/admin/buttons";
import { ServicesSectionForm } from "@/components/admin/ServiceForm";
import { Badge, btnPrimary, card, Notice, PageHeader } from "@/components/admin/ui";
import { adminServices, savedServicesSection } from "@/lib/admin-data";
import { getDictionary, locales, type T } from "@/lib/i18n";

export const metadata: Metadata = { title: "Xizmatlar" };

const iconBtn = "grid size-8 place-items-center rounded-md border border-line text-ink/70 transition hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-line disabled:hover:text-ink/70";

export default async function ServicesPage({ searchParams }: PageProps<"/admin/services">) {
  const sp = await searchParams;
  const [services, section] = await Promise.all([adminServices(), savedServicesSection()]);
  const defaults = {
    title: Object.fromEntries(locales.map((l) => [l, getDictionary(l).services.title])) as T,
    text: Object.fromEntries(locales.map((l) => [l, getDictionary(l).services.text])) as T,
  };

  return (
    <>
      <PageHeader
        title="Xizmatlar"
        sub="Bosh sahifadagi “Xizmatlar” bo'limi"
        actions={
          <>
            <a href="/uz#services" target="_blank" className="inline-flex h-10 items-center gap-2 rounded-md border border-line bg-card px-4 text-sm font-semibold hover:border-accent/50 hover:text-accent">
              <Icon name="external" className="size-4" /> Saytda
            </a>
            <Link href="/admin/services/new" className={btnPrimary}>
              <Icon name="plus" className="size-4" /> Yangi xizmat
            </Link>
          </>
        }
      />
      {sp.saved && <Notice tone="ok">Xizmat qo&apos;shildi va saytda paydo bo&apos;ldi.</Notice>}

      <div className={`${card} mb-6 overflow-hidden`}>
        {services.length === 0 ? (
          <p className="px-5 py-14 text-center text-sm text-muted">Hozircha xizmat yo&apos;q.</p>
        ) : (
          <ul className="divide-y divide-line">
            {services.map((s, i) => (
              <li key={s.id} className={`flex flex-wrap items-center gap-3 px-4 py-3 sm:flex-nowrap ${s.published ? "" : "bg-sunk/50"}`}>
                <span className="w-6 shrink-0 text-center text-xs font-semibold tech text-muted">{String(i + 1).padStart(2, "0")}</span>
                <span className="grid size-11 shrink-0 place-items-center rounded-md border border-accent/15 bg-accent/[0.07] text-accent">
                  <Icon name={s.icon} className="size-5" strokeWidth={1.5} />
                </span>
                <div className="min-w-0 flex-1 basis-[calc(100%-6rem)] sm:basis-0">
                  <Link href={`/admin/services/${s.id}`} className="font-semibold hover:text-accent">
                    {s.title.uz}
                  </Link>
                  <p className="truncate text-[13px] text-muted">{s.text.uz}</p>
                  {!s.published && <Badge>Yashirin</Badge>}
                </div>
                <div className="ml-[5.75rem] flex shrink-0 items-center gap-1.5 sm:ml-0">
                  {(["up", "down"] as const).map((dir) => (
                    <form key={dir} action={moveService}>
                      <input type="hidden" name="id" value={s.id} />
                      <input type="hidden" name="dir" value={dir} />
                      <button
                        className={iconBtn}
                        disabled={dir === "up" ? i === 0 : i === services.length - 1}
                        title={dir === "up" ? "Yuqoriga" : "Pastga"}
                        aria-label={dir === "up" ? "Yuqoriga" : "Pastga"}
                      >
                        <Icon name="up" className={`size-4 ${dir === "down" ? "rotate-180" : ""}`} />
                      </button>
                    </form>
                  ))}
                  <form action={toggleService}>
                    <input type="hidden" name="id" value={s.id} />
                    <button className={iconBtn} title={s.published ? "Saytda yashirish" : "Saytda ko'rsatish"} aria-label={s.published ? "Yashirish" : "Ko'rsatish"}>
                      <Icon name={s.published ? "eye" : "eyeOff"} className="size-4" />
                    </button>
                  </form>
                  <Link href={`/admin/services/${s.id}`} className={iconBtn} title="Tahrirlash" aria-label="Tahrirlash">
                    <Icon name="edit" className="size-4" />
                  </Link>
                  <form action={deleteService}>
                    <input type="hidden" name="id" value={s.id} />
                    <ConfirmButton message={`"${s.title.uz}" xizmatini o'chirasizmi?`} className={`${iconBtn} hover:border-red-400 hover:text-red-600`} pendingText="…">
                      <Icon name="trash" className="size-4" />
                    </ConfirmButton>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ServicesSectionForm value={section} defaults={defaults} />
    </>
  );
}
