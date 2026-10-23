import { AdminNav } from "@/components/admin/AdminNav";
import { isPersistent } from "@/db";
import { leadCounts } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-session";
import { usingDefaultPassword } from "@/lib/auth";
import { uploadsEnabled } from "@/lib/upload";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const counts = await leadCounts();
  const warnings = [
    !isPersistent && "Doimiy ma'lumotlar bazasi ulanmagan: o'zgarishlar va zayavkalar server qayta ishga tushganda yo'qoladi. Vercel → Storage → Turso ni ulang (TURSO_DATABASE_URL, TURSO_AUTH_TOKEN).",
    !uploadsEnabled && "Rasm yuklash o'chiq: Vercel → Storage → Blob ni ulang (BLOB_READ_WRITE_TOKEN). Hozircha rasm uchun URL kiritish mumkin.",
    usingDefaultPassword() && process.env.VERCEL && "Standart parol ishlatilmoqda — ADMIN_PASSWORD ni o'rnating.",
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
