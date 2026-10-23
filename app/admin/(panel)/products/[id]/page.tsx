import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { deleteProduct, duplicateProduct } from "@/app/admin/actions";
import { Icon } from "@/components/Icon";
import { ConfirmButton } from "@/components/admin/buttons";
import { ProductForm } from "@/components/admin/ProductForm";
import { btnGhost, PageHeader } from "@/components/admin/ui";
import { adminCategories, adminGroups, adminProduct } from "@/lib/admin-data";
import { uploadsEnabled } from "@/lib/upload";

export const metadata: Metadata = { title: "Mahsulotni tahrirlash" };

export default async function EditProductPage({ params }: PageProps<"/admin/products/[id]">) {
  const id = decodeURIComponent((await params).id);
  const [product, cats, groups] = await Promise.all([adminProduct(id), adminCategories(), adminGroups()]);
  if (!product) notFound();
  const options = cats.map((c) => ({ slug: c.slug, name: c.name.uz, groups: groups.filter((g) => g.categorySlug === c.slug).map((g) => ({ id: g.id, name: g.name.uz })) }));

  return (
    <>
      <PageHeader
        title={product.name}
        sub={`${cats.find((c) => c.slug === product.categorySlug)?.name.uz ?? ""} · ID: ${product.id}`}
        back="/admin/products"
        actions={
          <>
            <a href={`/uz/products/${product.categorySlug}`} target="_blank" className={btnGhost}>
              <Icon name="external" className="size-4" /> Saytda
            </a>
            <form action={duplicateProduct}>
              <input type="hidden" name="id" value={product.id} />
              <button className={btnGhost}>
                <Icon name="copy" className="size-4" /> Nusxa olish
              </button>
            </form>
            <form action={deleteProduct}>
              <input type="hidden" name="id" value={product.id} />
              <input type="hidden" name="back" value="/admin/products" />
              <ConfirmButton message={`"${product.name}" mahsulotini butunlay o'chirasizmi?`}>
                <Icon name="trash" className="size-4" /> O&apos;chirish
              </ConfirmButton>
            </form>
          </>
        }
      />
      <ProductForm product={product} categories={options} canUpload={uploadsEnabled} />
    </>
  );
}
