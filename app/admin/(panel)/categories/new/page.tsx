import type { Metadata } from "next";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { PageHeader } from "@/components/admin/ui";
import { adminCategories } from "@/lib/admin-data";
import { uploadsEnabled } from "@/lib/upload";

export const metadata: Metadata = { title: "Yangi yo'nalish" };

export default async function NewCategoryPage() {
  const cats = await adminCategories();
  return (
    <>
      <PageHeader title="Yangi yo'nalish" sub="Yaratilgandan so'ng guruhlar va mahsulotlar qo'shasiz" back="/admin/categories" />
      <CategoryForm nextSort={Math.max(0, ...cats.map((c) => c.sort)) + 1} canUpload={uploadsEnabled} />
    </>
  );
}
