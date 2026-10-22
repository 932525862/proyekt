import Link from "next/link";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { categories } from "@/lib/catalog";
import { company, tr, type Dictionary, type Locale } from "@/lib/i18n";

async function currentYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const year = await currentYear();
  const col = "eyebrow text-signal mb-5";
  return (
    <footer className="bg-band text-on-band">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo inverted />
          <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-on-band/60">{dict.footer.about}</p>
          <div className="mt-6 flex gap-2">
            {(["telegram", "instagram", "facebook"] as const).map((s) => (
              <a
                key={s}
                href={company[s]}
                aria-label={s}
                target="_blank"
                rel="noreferrer"
                className="grid size-10 place-items-center rounded-md border border-white/15 text-on-band/70 transition-colors hover:border-signal hover:text-signal"
              >
                <Icon name={s} className="size-[18px]" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className={col}>{dict.nav.products}</h4>
          <ul className="space-y-2.5 text-[15px] text-on-band/75">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/${lang}/products/${c.slug}`} className="hover:text-white">
                  {tr(c.name, lang)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className={col}>{dict.footer.company}</h4>
          <ul className="space-y-2.5 text-[15px] text-on-band/75">
            {(["services", "applications", "about", "faq"] as const).map((k) => (
              <li key={k}>
                <Link href={`/${lang}#${k}`} className="hover:text-white">
                  {dict.nav[k]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className={col}>{dict.nav.contact}</h4>
          <ul className="space-y-2.5 text-[15px] text-on-band/75">
            <li><a href={company.phoneHref} className="hover:text-white">{company.phone}</a></li>
            <li><a href={`mailto:${company.email}`} className="hover:text-white">{company.email}</a></li>
            <li className="text-on-band/50">{dict.contact.addressV}</li>
            <li className="text-on-band/50">{dict.contact.hoursV}</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-white/10 px-4 py-6 text-sm text-on-band/50 sm:px-6">
        <span>
          © {year} NovaLab. {dict.footer.rights}
        </span>
        <a href="#top" aria-label={dict.nav.top} className="grid size-10 place-items-center rounded-md border border-white/15 hover:border-white hover:text-white">
          <Icon name="arrow" className="size-4 -rotate-90" />
        </a>
      </div>
    </footer>
  );
}
