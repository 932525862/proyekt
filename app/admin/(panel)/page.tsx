import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Badge, btnGhost, btnPrimary, card, fmtDate, PageHeader } from "@/components/admin/ui";
import { adminCategories, adminLeads, leadCounts, leadStatuses, productStats } from "@/lib/admin-data";

export default async function Dashboard() {
  const [counts, stats, cats, recent] = await Promise.all([leadCounts(), productStats(), adminCategories(), adminLeads({})]);
  const tiles = [
    { label: "Yangi zayavkalar", value: counts.new ?? 0, href: "/admin/leads?status=new", icon: "inbox", accent: true },
    { label: "So'nggi 7 kunda", value: counts.week, href: "/admin/leads", icon: "inbox" },
    { label: "Mahsulotlar", value: stats.total, href: "/admin/products", icon: "package", sub: `${stats.hidden} ta yashirin` },
    { label: "Yo'nalishlar", value: cats.length, href: "/admin/categories", icon: "folders" },
  ];

  return (
    <>
      <PageHeader
        title="Boshqaruv paneli"
        sub="Sayt ma'lumotlari va kelib tushgan zayavkalar"
        actions={
          <>
            <Link href="/admin/products/new" className={btnPrimary}>
              <Icon name="plus" className="size-4" /> Mahsulot qo&apos;shish
            </Link>
            <Link href="/admin/leads" className={btnGhost}>
              <Icon name="inbox" className="size-4" /> Zayavkalar
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.label} href={t.href} className={`${card} group p-4 transition hover:border-accent/40 sm:p-5`}>
            <div className="flex items-center justify-between text-muted">
              <span className="text-[13px] font-medium">{t.label}</span>
              <Icon name={t.icon} className={`size-[18px] ${t.accent && t.value > 0 ? "text-accent" : ""}`} />
            </div>
            <div className={`mt-2 text-3xl font-semibold tracking-tight ${t.accent && t.value > 0 ? "text-accent" : ""}`}>{t.value}</div>
            {t.sub && <div className="mt-0.5 text-xs text-muted">{t.sub}</div>}
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className={card}>
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-semibold">So&apos;nggi zayavkalar</h2>
            <Link href="/admin/leads" className="text-sm font-medium text-accent">
              Barchasi →
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted">Hozircha zayavka yo&apos;q. Saytdagi formadan yuborilgan so&apos;rovlar shu yerda paydo bo&apos;ladi.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recent.slice(0, 6).map((l) => {
                const st = leadStatuses.find((s) => s.value === l.status)!;
                return (
                  <li key={l.id}>
                    <Link href={`/admin/leads/${l.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-sunk/60">
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">
                          {l.name} {l.company && <span className="font-normal text-muted">· {l.company}</span>}
                        </div>
                        <div className="truncate text-[13px] text-muted">{l.model || l.interest || l.message || l.phone}</div>
                      </div>
                      <div className="shrink-0 text-right">
                        <Badge tone={st.tone}>{st.label}</Badge>
                        <div className="mt-1 text-[11.5px] text-muted">{fmtDate(l.createdAt)}</div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className={`${card} p-5`}>
          <h2 className="font-semibold">Katalog holati</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            {[
              ["Jami mahsulotlar", stats.total],
              ["Saytda yashirin", stats.hidden],
              ["Tanlangan (bosh sahifa)", stats.featured],
              ["Rasmsiz mahsulotlar", stats.noImage],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-line pb-2 last:border-0">
                <dt className="text-muted">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 grid gap-2">
            <Link href="/admin/products?status=featured" className={btnGhost}>
              <Icon name="star" className="size-4" /> Tanlangan mahsulotlar
            </Link>
            <Link href="/admin/categories" className={btnGhost}>
              <Icon name="folders" className="size-4" /> Yo&apos;nalishlarni boshqarish
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
