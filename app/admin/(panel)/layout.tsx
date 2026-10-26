import { AdminNav } from "@/components/admin/AdminNav";
import { isPersistent } from "@/db";
import { leadCounts } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-session";
import { loginEnabled } from "@/lib/auth";
import { uploadsEnabled } from "@/lib/upload";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const counts = await leadCounts();
  const warnings = [
    !isPersistent && "Doimiy ma'lumotlar bazasi ulanmagan: App Platform'dagi vaqtinchalik diskka yozuvlar saqlanmaydi. Turso/libSQL ulab TURSO_DATABASE_URL va TURSO_AUTH_TOKEN ni o'rnating.",
    !uploadsEnabled && "Rasm yuklash o'chiq: DigitalOcean Spaces sozlang. Hozircha rasm URL manzilini kiritishingiz mumkin.",
    !loginEnabled() && (process.env.VERCEL || process.env.DO_APP_PLATFORM) && "ADMIN_PASSWORD va AUTH_SECRET o'rnatilmagan — admin kirishi o'chiq.",
  ].filter(Boolean) as string[];

  return (
    <div className="lg:flex">
      <AdminNav newLeads={counts.new ?? 0} />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        {warnings.map((w) => (
          <div key={w} className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {w}
          </div>
        ))}
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
