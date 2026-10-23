import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/ProductForm";
import { PageHeader } from "@/components/admin/ui";
import { adminCategories, adminGroups } from "@/lib/admin-data";
import { uploadsEnabled } from "@/lib/upload";

export const metadata: Metadata = { title: "Yangi mahsulot" };

export default async function NewProductPage({ searchParams }: PageProps<"/admin/products/new">) {
  const category = (await searchParams).category;
  const [cats, groups] = await Promise.all([adminCategories(), adminGroups()]);
  const options = cats.map((c) => ({ slug: c.slug, name: c.name.uz, groups: groups.filter((g) => g.categorySlug === c.slug).map((g) => ({ id: g.id, name: g.name.uz })) }));
  const defaultGroup = typeof category === "string" ? options.find((c) => c.slug === category)?.groups[0]?.id : undefined;
  return (
    <>
      <PageHeader title="Yangi mahsulot" sub="Saqlangandan so'ng saytda darhol paydo bo'ladi" back="/admin/products" />
      <ProductForm categories={options} defaultGroup={defaultGroup} canUpload={uploadsEnabled} />
    </>
  );
}
