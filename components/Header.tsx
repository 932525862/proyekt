"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { LanguageMenu, LanguageTabs } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { company, type Dictionary, type Locale } from "@/lib/i18n";

type Props = { lang: Locale; nav: Dictionary["nav"]; hours: string; address: string };

export function Header({ lang, nav, hours, address }: Props) {
  const pathname = usePathname() ?? `/${lang}`;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const links = [
    { href: `/${lang}/products`, label: nav.products },
    { href: `/${lang}#services`, label: nav.services },
    { href: `/${lang}#applications`, label: nav.applications },
    { href: `/${lang}#about`, label: nav.about },
    { href: `/${lang}#faq`, label: nav.faq },
    { href: `/${lang}#contact`, label: nav.contact },
  ];

  const toggleTheme = () => {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {}
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Yuqori kontakt qatori */}
      <div
        className={`overflow-hidden bg-band text-on-band/70 transition-[height] duration-300 ${scrolled ? "h-0" : "h-9"}`}
      >
        <div className="mx-auto flex h-9 max-w-7xl items-center gap-6 px-4 text-[12.5px] sm:px-6">
          <a href={company.phoneHref} className="inline-flex items-center gap-2 hover:text-white">
            <Icon name="phone" className="size-3.5" />
            {company.phone}
          </a>
          <a href={`mailto:${company.email}`} className="hidden items-center gap-2 hover:text-white sm:inline-flex">
            <Icon name="mail" className="size-3.5" />
            {company.email}
          </a>
          <span className="hidden items-center gap-2 md:inline-flex">
            <Icon name="clock" className="size-3.5" />
            {hours}
          </span>
          <span className="ml-auto hidden items-center gap-2 lg:inline-flex">
            <Icon name="pin" className="size-3.5" />
            {address}
          </span>
        </div>
      </div>

      {/* Asosiy panel */}
      <div
        className={`border-b transition-[background,border-color,box-shadow] duration-300 ${
          scrolled || open
            ? "border-line bg-card/90 shadow-[0_8px_30px_-12px_rgb(7_22_41/0.18)] backdrop-blur-xl"
            : "border-line bg-card"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:h-[76px]">
          <Link href={`/${lang}`} aria-label="NovaLab" onClick={() => setOpen(false)}>
            <Logo />
          </Link>

          <nav className="ml-auto hidden h-full items-stretch lg:flex">
            {links.map((l) => {
              const active = l.href.includes("/products") && pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative flex items-center px-4 text-[14.5px] font-medium transition-colors hover:text-accent ${
                    active ? "text-accent" : "text-ink/75"
                  } after:absolute after:inset-x-4 after:bottom-0 after:h-0.5 after:origin-left after:bg-accent after:transition-transform ${
                    active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-4">
            <LanguageMenu lang={lang} label={nav.language} />

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={nav.theme}
              className="grid size-10 place-items-center rounded-md border border-line text-muted transition-colors hover:border-ink/30 hover:text-ink"
            >
              <Icon name="moon" className="size-[17px] dark:hidden" />
              <Icon name="sun" className="hidden size-[17px] dark:block" />
            </button>

            <Link
              href={`/${lang}#contact`}
              className="hidden h-10 items-center gap-2 rounded-md bg-accent px-5 text-sm font-semibold text-accent-ink transition-colors hover:bg-ink sm:inline-flex dark:hover:bg-white dark:hover:text-band"
            >
              {nav.quote}
              <Icon name="arrow" className="size-4" />
            </Link>

            <button
              type="button"
              aria-label={nav.menu}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="relative grid size-10 place-items-center rounded-md border border-line lg:hidden"
            >
              <span className={`absolute h-[1.5px] w-5 bg-current transition-transform ${open ? "rotate-45" : "-translate-y-[4px]"}`} />
              <span className={`absolute h-[1.5px] w-5 bg-current transition-transform ${open ? "-rotate-45" : "translate-y-[4px]"}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobil menyu */}
      <div
        className={`fixed inset-x-0 bottom-0 bg-card transition-[opacity,visibility] duration-300 lg:hidden ${
          scrolled ? "top-16" : "top-25"
        } ${open ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        <nav className="flex flex-col px-4 pt-2">
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between border-b border-line py-4 text-xl font-medium tracking-tight"
            >
              <span className="flex items-baseline gap-4">
                <span className="text-xs font-semibold tech text-accent">0{i + 1}</span>
                {l.label}
              </span>
              <Icon name="arrow" className="size-4 text-muted" />
            </Link>
          ))}
          <div className="mt-6">
            <span className="mb-2 block eyebrow text-muted">{nav.language}</span>
            <LanguageTabs lang={lang} onDone={() => setOpen(false)} />
          </div>
          <Link
            href={`/${lang}#contact`}
            onClick={() => setOpen(false)}
            className="mt-4 rounded-md bg-accent py-3.5 text-center font-semibold text-accent-ink"
          >
            {nav.quote}
          </Link>
        </nav>
      </div>
    </header>
  );
}
