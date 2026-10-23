import type { Metadata } from "next";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { PageHeader } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Yangi xizmat" };

export default function NewServicePage() {
  return (
    <>
      <PageHeader title="Yangi xizmat" sub="Saqlangandan so'ng bosh sahifada darhol paydo bo'ladi" back="/admin/services" />
      <ServiceForm />
    </>
  );
}
