import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Badge, btnPrimary, card, Notice, PageHeader } from "@/components/admin/ui";
import { adminCategories } from "@/lib/admin-data";
import { optimizable } from "@/lib/media";

export const metadata: Metadata = { title: "Yo'nalishlar" };

export default async function CategoriesPage({ searchParams }: PageProps<"/admin/categories">) {
  const sp = await searchParams;
  const cats = await adminCategories();
  return (
    <>
      <PageHeader
        title="Yo'nalishlar"
        sub="Mahsulot yo'nalishlari (katalog bo'limlari) va ulardagi guruhlar"
        actions={
          <Link href="/admin/categories/new" className={btnPrimary}>
            <Icon name="plus" className="size-4" /> Yangi yo&apos;nalish
          </Link>
        }
      />
      {sp.deleted && <Notice tone="ok">Yo&apos;nalish va undagi mahsulotlar o&apos;chirildi.</Notice>}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cats.map((c) => (
          <Link key={c.slug} href={`/admin/categories/${c.slug}`} className={`${card} group flex gap-4 p-4 transition hover:border-accent/40 ${c.published ? "" : "opacity-70"}`}>
            <span className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-md border border-line bg-white">
              {c.image ? (
                <Image src={c.image} alt="" fill sizes="64px" unoptimized={!optimizable(c.image)} className={c.imageFit === "cover" ? "object-cover" : "object-contain p-1"} />
              ) : (
                <Icon name={c.slug} className="size-6 text-muted" />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-semibold group-hover:text-accent">{c.name.uz}</span>
              <span className="block text-[13px] text-muted">{c.brand}</span>
              <span className="mt-1.5 flex flex-wrap gap-1.5">
                <Badge>{c.productCount} ta mahsulot</Badge>
                {!c.published && <Badge tone="bg-amber-100 text-amber-800">Yashirin</Badge>}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
