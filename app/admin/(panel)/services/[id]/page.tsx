import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { deleteService } from "@/app/admin/actions";
import { Icon } from "@/components/Icon";
import { ConfirmButton } from "@/components/admin/buttons";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { PageHeader } from "@/components/admin/ui";
import { adminService } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Xizmatni tahrirlash" };

export default async function EditServicePage({ params }: PageProps<"/admin/services/[id]">) {
  const service = await adminService((await params).id);
  if (!service) notFound();
  return (
    <>
      <PageHeader
        title={service.title.uz}
        sub="Xizmatni tahrirlash"
        back="/admin/services"
        actions={
          <form action={deleteService}>
            <input type="hidden" name="id" value={service.id} />
            <input type="hidden" name="back" value="/admin/services" />
            <ConfirmButton message={`"${service.title.uz}" xizmatini o'chirasizmi?`}>
              <Icon name="trash" className="size-4" /> O&apos;chirish
            </ConfirmButton>
          </form>
        }
      />
      <ServiceForm service={service} />
    </>
  );
}
