"use client";

import { useActionState } from "react";
import { saveContacts, type FormState } from "@/app/admin/actions";
import { SubmitButton } from "./buttons";
import { field, label, Section } from "./ui";

const fields = [
  ["phone", "Telefon", "+998 99 879 46 09", "tel"],
  ["email", "Email", "info@company.uz", "email"],
  ["telegram", "Telegram havolasi", "https://t.me/username", "url"],
  ["instagram", "Instagram havolasi", "https://instagram.com/username", "url"],
  ["facebook", "Facebook havolasi", "https://facebook.com/page", "url"],
] as const;

export function ContactsForm({ values }: { values: Record<string, string> }) {
  const [state, action] = useActionState<FormState, FormData>(saveContacts, {});
  return (
    <form action={action}>
      <Section title="Kontaktlar" sub="Sayt sarlavhasi, footer, aloqa bo'limi va Google uchun ma'lumotda ishlatiladi">
        {state.error && <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}
        {state.message && <p className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{state.message}</p>}
        {fields.map(([k, l, ph, type]) => (
          <label key={k} className={label}>
            {l}
            <input name={k} type={type} defaultValue={values[k] ?? ""} placeholder={ph} className={field} />
          </label>
        ))}
        <div>
          <SubmitButton>Saqlash</SubmitButton>
        </div>
      </Section>
    </form>
  );
}
