"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Icon } from "./Icon";
import { localeCookie, localeNames, locales, type Locale } from "@/lib/i18n";

/** Joriy yo'lni boshqa tilga o'tkazadi: /uz/products/nmr → /ru/products/nmr */
export const swapLocale = (pathname: string, l: Locale) => pathname.replace(/^\/(uz|ru|en)(?=\/|$)/, `/${l}`);

function remember(l: Locale) {
  document.cookie = `${localeCookie}=${l}; path=/; max-age=31536000; samesite=lax`;
}

/** Tanlovni eslab qoladi va sahifadagi bo'limni (#hash) saqlagan holda o'tadi */
function useSwitch() {
  const pathname = usePathname() ?? "/uz";
  const router = useRouter();
  return {
    href: (l: Locale) => swapLocale(pathname, l),
    onClick: (l: Locale) => (e: MouseEvent) => {
      remember(l);
      const { hash, search } = window.location;
      if (hash || search) {
        e.preventDefault();
        router.push(swapLocale(pathname, l) + search + hash);
      }
    },
  };
}

/** Panel uchun ochiladigan menyu */
export function LanguageMenu({ lang, label }: { lang: Locale; label: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { href, onClick } = useSwitch();

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${label}: ${lang.toUpperCase()}`}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 items-center gap-1.5 rounded-md border border-line px-2.5 text-sm font-semibold text-ink/80 transition-colors hover:border-ink/30 hover:text-ink"
      >
        <Icon name="globe" className="size-[17px] text-muted" />
        <span className="uppercase">{lang}</span>
        <Icon name="chevron" className={`size-3.5 text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <ul
        role="menu"
        className={`absolute right-0 top-full mt-2 w-44 origin-top-right overflow-hidden rounded-lg border border-line bg-card p-1 shadow-[0_20px_40px_-16px_rgb(7_22_41/0.3)] transition-[opacity,transform,visibility] duration-150 ${
          open ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0"
        }`}
      >
        {locales.map((l) => (
          <li key={l} role="none">
            <Link
              role="menuitem"
              href={href(l)}
              hrefLang={l}
              lang={l}
              aria-current={l === lang ? "true" : undefined}
              onClick={(e) => {
                onClick(l)(e);
                setOpen(false);
              }}
              className={`flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                l === lang ? "bg-accent/10 font-semibold text-accent" : "text-ink/80 hover:bg-sunk hover:text-ink"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="w-6 text-[11px] font-semibold uppercase text-muted">{l}</span>
                {localeNames[l]}
              </span>
              {l === lang && <Icon name="check" className="size-4" />}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Mobil menyu uchun segmentli tanlagich */
export function LanguageTabs({ lang, onDone }: { lang: Locale; onDone?: () => void }) {
  const { href, onClick } = useSwitch();
  return (
    <div className="grid grid-cols-3 gap-1 rounded-lg border border-line bg-sunk p-1">
      {locales.map((l) => (
        <Link
          key={l}
          href={href(l)}
          hrefLang={l}
          lang={l}
          aria-current={l === lang ? "true" : undefined}
          onClick={(e) => {
            onClick(l)(e);
            onDone?.();
          }}
          className={`rounded-md py-2.5 text-center text-sm font-semibold transition-colors ${
            l === lang ? "bg-card text-accent shadow-sm" : "text-ink/70"
          }`}
        >
          {localeNames[l]}
        </Link>
      ))}
    </div>
  );
}
