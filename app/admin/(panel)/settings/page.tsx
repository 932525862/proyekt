import type { Metadata } from "next";
import { ContactsForm } from "@/components/admin/ContactsForm";
import { card, PageHeader } from "@/components/admin/ui";
import { isPersistent } from "@/db";
import { savedContacts } from "@/lib/admin-data";
import { adminLogin, usingDefaultPassword } from "@/lib/auth";
import { company } from "@/lib/i18n";
import { blobEnabled } from "@/lib/upload";

export const metadata: Metadata = { title: "Sozlamalar" };

export default async function SettingsPage() {
  const saved = await savedContacts();
  const defaults = { phone: company.phone, email: company.email, telegram: company.telegram, instagram: company.instagram, facebook: company.facebook };
  const status: [string, boolean, string][] = [
    ["Ma'lumotlar bazasi", isPersistent, isPersistent ? (process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL ? "Turso / libSQL ulangan" : "Lokal fayl (.data/spectrum.db)") : "Ulanmagan — o'zgarishlar saqlanmaydi"],
    ["Rasm saqlash (Vercel Blob)", blobEnabled || !process.env.VERCEL, blobEnabled ? "Ulangan" : process.env.VERCEL ? "Ulanmagan" : "Lokal (.data/uploads)"],
    ["Telegram xabarnoma", Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID), process.env.TELEGRAM_BOT_TOKEN ? "Yoqilgan" : "O'chiq (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID)"],
    ["Admin parol", !usingDefaultPassword(), usingDefaultPassword() ? "Standart (faqat lokal)" : `O'rnatilgan (login: ${adminLogin()})`],
  ];
  return (
    <>
      <PageHeader title="Sozlamalar" sub="Saytdagi kontaktlar va tizim holati" />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <ContactsForm values={{ ...defaults, ...Object.fromEntries(Object.entries(saved).filter(([, v]) => v)) }} />
        <section className={`${card} p-5 sm:p-6`}>
          <h2 className="font-semibold">Tizim holati</h2>
          <ul className="mt-4 grid gap-3 text-sm">
            {status.map(([k, ok, v]) => (
              <li key={k} className="flex items-start gap-3">
                <span className={`mt-1.5 size-2 shrink-0 rounded-full ${ok ? "bg-emerald-500" : "bg-amber-500"}`} />
                <span>
                  <span className="block font-medium">{k}</span>
                  <span className="text-muted">{v}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
