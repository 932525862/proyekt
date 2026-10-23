import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteCategory, deleteGroup, saveGroup } from "@/app/admin/actions";
import { Icon } from "@/components/Icon";
import { ConfirmButton, SubmitButton } from "@/components/admin/buttons";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { btnGhost, card, field, Notice, PageHeader } from "@/components/admin/ui";
import { adminCategory } from "@/lib/admin-data";
import { uploadsEnabled } from "@/lib/upload";

export const metadata: Metadata = { title: "Yo'nalishni tahrirlash" };

const small = "w-full rounded-md border border-line bg-card px-2.5 py-1.5 text-sm outline-none focus:border-accent";

export default async function EditCategoryPage({ params, searchParams }: PageProps<"/admin/categories/[slug]">) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const cat = await adminCategory(slug);
  if (!cat) notFound();
  const total = cat.groups.reduce((n, g) => n + g.productCount, 0);

  return (
    <>
      <PageHeader
        title={cat.name.uz}
        sub={`${cat.brand} · ${total} ta mahsulot`}
        back="/admin/categories"
        actions={
          <>
            <a href={`/uz/products/${cat.slug}`} target="_blank" className={btnGhost}>
              <Icon name="external" className="size-4" /> Saytda
            </a>
            <Link href={`/admin/products?category=${cat.slug}`} className={btnGhost}>
              <Icon name="package" className="size-4" /> Mahsulotlar
            </Link>
          </>
        }
      />
      {sp.created && <Notice tone="ok">Yo&apos;nalish yaratildi. Endi guruhlar va mahsulotlar qo&apos;shing.</Notice>}

      <div className="grid gap-6">
        <CategoryForm category={cat} nextSort={cat.sort} canUpload={uploadsEnabled} />

        <section className={`${card} p-5 sm:p-6`}>
          <h2 className="text-base font-semibold tracking-tight">Model guruhlari</h2>
          <p className="mt-0.5 text-[13px] text-muted">Sahifadagi filtr tugmalari va bo&apos;limlar. Mahsulotlari bor guruhni o&apos;chirib bo&apos;lmaydi.</p>
          <div className="mt-4 grid gap-2">
            {cat.groups.map((g) => (
              <div key={g.id} className="grid gap-2 rounded-md border border-line p-3 lg:grid-cols-[1fr_auto] lg:items-center">
                <form action={saveGroup} className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_80px_auto] sm:items-center">
                  <input type="hidden" name="id" value={g.id} />
                  <input type="hidden" name="categorySlug" value={cat.slug} />
                  <input name="name_uz" defaultValue={g.name.uz} required aria-label="Nomi (uz)" className={small} />
                  <input name="name_ru" defaultValue={g.name.ru} aria-label="Nomi (ru)" placeholder="ru" className={small} />
                  <input name="name_en" defaultValue={g.name.en} aria-label="Nomi (en)" placeholder="en" className={small} />
                  <input name="sort" type="number" defaultValue={g.sort} aria-label="Tartib" className={small} />
                  <SubmitButton className="h-8 rounded-md border border-line px-3 text-xs font-semibold hover:border-accent hover:text-accent" pendingText="…">
                    Saqlash
                  </SubmitButton>
                </form>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/products?category=${cat.slug}`} className="text-xs text-muted hover:text-accent">
                    {g.productCount} ta mahsulot
                  </Link>
                  {g.productCount === 0 && (
                    <form action={deleteGroup}>
                      <input type="hidden" name="id" value={g.id} />
                      <ConfirmButton message={`"${g.name.uz}" guruhini o'chirasizmi?`} className="grid size-8 place-items-center rounded-md border border-line text-muted hover:border-red-400 hover:text-red-600" pendingText="…">
                        <Icon name="trash" className="size-4" />
                      </ConfirmButton>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
          <form action={saveGroup} className="mt-4 grid gap-2 rounded-md border border-dashed border-accent/40 bg-accent/[0.03] p-3 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-center">
            <input type="hidden" name="categorySlug" value={cat.slug} />
            <input name="name_uz" required placeholder="Yangi guruh nomi (uz) *" className={field} />
            <input name="name_ru" placeholder="ru" className={field} />
            <input name="name_en" placeholder="en" className={field} />
            <SubmitButton pendingText="…">
              <Icon name="plus" className="size-4" /> Guruh qo&apos;shish
            </SubmitButton>
          </form>
        </section>

        <form action={deleteCategory} className={`${card} border-red-200 p-5 sm:p-6`}>
          <input type="hidden" name="slug" value={cat.slug} />
          <h2 className="font-semibold text-red-700">Yo&apos;nalishni o&apos;chirish</h2>
          <p className="mt-1 text-sm text-muted">
            Yo&apos;nalish, uning {cat.groups.length} ta guruhi va {total} ta mahsuloti butunlay o&apos;chiriladi. Vaqtincha yashirish uchun yuqoridagi “Saytda ko&apos;rsatish” belgisini olib tashlang.
          </p>
          <div className="mt-4">
            <ConfirmButton message={`"${cat.name.uz}" yo'nalishi va undagi ${total} ta mahsulot butunlay o'chiriladi. Davom etasizmi?`}>
              <Icon name="trash" className="size-4" /> Yo&apos;nalishni o&apos;chirish
            </ConfirmButton>
          </div>
        </form>
      </div>
    </>
  );
}
