import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { deleteProduct, duplicateProduct, toggleProduct } from "@/app/admin/actions";
import { Icon } from "@/components/Icon";
import { ConfirmButton } from "@/components/admin/buttons";
import { Badge, btnGhost, btnPrimary, card, field, Notice, PageHeader } from "@/components/admin/ui";
import { adminCategories, adminGroups, adminProducts } from "@/lib/admin-data";
import { optimizable } from "@/lib/media";

export const metadata: Metadata = { title: "Mahsulotlar" };

const iconBtn = "grid size-8 place-items-center rounded-md border border-line text-ink/70 transition hover:border-accent hover:text-accent";

export default async function ProductsPage({ searchParams }: PageProps<"/admin/products">) {
  const sp = await searchParams;
  const category = typeof sp.category === "string" ? sp.category : "";
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const status = typeof sp.status === "string" ? sp.status : "";
  const [products, cats, groups] = await Promise.all([adminProducts({ category, q, status }), adminCategories(), adminGroups()]);
  const catName = (slug: string) => cats.find((c) => c.slug === slug)?.name.uz ?? slug;
  const groupName = (id: string) => groups.find((g) => g.id === id)?.name.uz ?? "—";
  const back = `/admin/products?${new URLSearchParams({ ...(category ? { category } : {}), ...(q ? { q } : {}), ...(status ? { status } : {}) })}`;

  return (
    <>
      <PageHeader
        title="Mahsulotlar"
        sub={`${products.length} ta topildi`}
        actions={
          <Link href={`/admin/products/new${category ? `?category=${category}` : ""}`} className={btnPrimary}>
            <Icon name="plus" className="size-4" /> Yangi mahsulot
          </Link>
        }
      />
      {sp.saved && <Notice tone="ok">Mahsulot qo&apos;shildi va saytda paydo bo&apos;ldi.</Notice>}

      <form className={`${card} mb-4 grid gap-3 p-4 sm:grid-cols-[1fr_1fr_1.4fr_auto]`}>
        <select name="category" defaultValue={category} className={field} aria-label="Yo'nalish">
          <option value="">Barcha yo&apos;nalishlar</option>
          {cats.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name.uz} ({c.productCount})
            </option>
          ))}
        </select>
        <select name="status" defaultValue={status} className={field} aria-label="Holat">
          <option value="">Barcha holatlar</option>
          <option value="hidden">Faqat yashirinlar</option>
          <option value="featured">Bosh sahifadagilar (tanlangan)</option>
        </select>
        <input name="q" defaultValue={q} placeholder="Nom yoki katalog raqami…" className={field} />
        <button className={btnGhost}>
          <Icon name="search" className="size-4" /> Filtr
        </button>
      </form>

      {products.length === 0 ? (
        <div className={`${card} px-5 py-14 text-center text-sm text-muted`}>Mahsulot topilmadi.</div>
      ) : (
        <div className={`${card} overflow-hidden`}>
          <ul className="divide-y divide-line">
            {products.map((p) => (
              <li key={p.id} className={`flex flex-wrap items-center gap-3 px-4 py-3 sm:flex-nowrap ${p.published ? "" : "bg-sunk/50"}`}>
                <Link href={`/admin/products/${encodeURIComponent(p.id)}`} className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-md border border-line bg-white">
                  {p.image ? (
                    <Image src={p.image} alt="" fill sizes="56px" unoptimized={!optimizable(p.image)} className={p.imageFit === "cover" ? "object-cover" : "object-contain p-1"} />
                  ) : (
                    <Icon name="imagePlus" className="size-5 text-muted" />
                  )}
                </Link>
                <div className="min-w-0 flex-1 basis-[calc(100%-4.5rem)] sm:basis-0">
                  <Link href={`/admin/products/${encodeURIComponent(p.id)}`} className="font-semibold hover:text-accent">
                    {p.name}
                  </Link>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[12.5px] text-muted">
                    <span>{catName(p.categorySlug)}</span>
                    <span>·</span>
                    <span>{groupName(p.groupId)}</span>
                    {p.catNo && <span className="tech">· №{p.catNo}</span>}
                    {!p.published && <Badge>Yashirin</Badge>}
                    {p.featured && <Badge tone="bg-amber-100 text-amber-800">★ Bosh sahifada</Badge>}
                  </div>
                </div>
                <div className="ml-[4.25rem] flex shrink-0 items-center gap-1.5 sm:ml-0">
                  <form action={toggleProduct}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="field" value="published" />
                    <button className={iconBtn} title={p.published ? "Saytda yashirish" : "Saytda ko'rsatish"} aria-label={p.published ? "Yashirish" : "Ko'rsatish"}>
                      <Icon name={p.published ? "eye" : "eyeOff"} className="size-4" />
                    </button>
                  </form>
                  <form action={toggleProduct}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="field" value="featured" />
                    <button className={`${iconBtn} ${p.featured ? "border-amber-300 text-amber-600" : ""}`} title="Bosh sahifadagi tanlanganlar" aria-label="Tanlangan">
                      <Icon name="star" className="size-4" />
                    </button>
                  </form>
                  <form action={duplicateProduct}>
                    <input type="hidden" name="id" value={p.id} />
                    <button className={iconBtn} title="Nusxa olish" aria-label="Nusxa olish">
                      <Icon name="copy" className="size-4" />
                    </button>
                  </form>
                  <Link href={`/admin/products/${encodeURIComponent(p.id)}`} className={iconBtn} title="Tahrirlash" aria-label="Tahrirlash">
                    <Icon name="edit" className="size-4" />
                  </Link>
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="back" value={back} />
                    <ConfirmButton message={`"${p.name}" mahsulotini butunlay o'chirasizmi?`} className={`${iconBtn} hover:border-red-400 hover:text-red-600`} pendingText="…">
                      <Icon name="trash" className="size-4" />
                    </ConfirmButton>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
