import Link from "next/link";
import { Icon } from "@/components/Icon";

const text = [
  { lang: "uz", title: "Sahifa topilmadi", back: "Bosh sahifa", catalog: "Katalog" },
  { lang: "ru", title: "Страница не найдена", back: "Главная", catalog: "Каталог" },
  { lang: "en", title: "Page not found", back: "Home", catalog: "Catalog" },
] as const;

/** 404 — sahifa yoki mahsulot yo'nalishi topilmadi (uch tilda) */
export default function NotFound() {
  return (
    <section className="bg-blueprint relative isolate flex min-h-[70vh] items-center bg-band px-4 pb-20 pt-40 text-on-band">
      <div className="mx-auto w-full max-w-3xl">
        <p className="font-mono text-6xl font-semibold text-signal">404</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {text.map((t) => (
            <div key={t.lang} lang={t.lang} className="rounded-lg border border-white/10 bg-white/5 p-5">
              <h1 className="text-lg font-semibold text-white">{t.title}</h1>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <Link href={`/${t.lang}`} className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-2 font-semibold text-accent-ink">
                  {t.back}
                </Link>
                <Link href={`/${t.lang}/products`} className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-3 py-2 font-semibold text-white hover:border-white">
                  {t.catalog} <Icon name="arrow" className="size-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
