"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "./Icon";
import type { Locale } from "@/lib/i18n";
import { searchCatalog, type SearchEntry } from "@/lib/search";

export type SearchProps = { entries: SearchEntry[]; label: string; empty: string };

const MAX_PRODUCTS = 20;

export function HeaderSearch({ lang, entries, label, empty }: SearchProps & { lang: Locale }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const { cats, prods } = useMemo(() => searchCatalog(entries, q), [entries, q]);
  const shown = prods.slice(0, MAX_PRODUCTS);
  const searching = q.trim().length > 0;

  const close = () => {
    setOpen(false);
    setQ("");
  };

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const onDown = (e: MouseEvent) => !box.current?.contains(e.target as Node) && close();
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  return (
    <div ref={box} className="sm:relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={label}
        aria-expanded={open}
        className="grid size-10 place-items-center rounded-md border border-line text-muted transition-colors hover:border-ink/30 hover:text-ink"
      >
        <Icon name="search" className="size-[17px]" />
      </button>

      {open && (
        <div className="absolute inset-x-4 top-full mt-2 overflow-hidden rounded-lg border border-line bg-card shadow-[0_24px_50px_-20px_rgb(7_22_41/0.35)] sm:inset-x-auto sm:right-0 sm:w-[26rem]">
          <label className="flex h-12 items-center gap-2 border-b border-line px-4">
            <Icon name="search" className="size-[18px] text-muted" />
            <input
              ref={input}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={label}
              aria-label={label}
              className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted"
            />
          </label>
          {searching && (
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {cats.length + prods.length === 0 && <p className="px-3 py-6 text-center text-sm text-muted">{empty}</p>}
              {cats.map((e) => (
                <Link key={e.slug} href={`/${lang}/products/${e.slug}`} onClick={close} className="flex items-center gap-3 rounded-md px-3 py-2.5 hover:bg-sunk">
                  <span className="grid size-8 shrink-0 place-items-center rounded-md bg-accent/10 text-accent">
                    <Icon name={e.slug} className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{e.category}</span>
                    <span className="block truncate text-xs text-muted">{e.brand}</span>
                  </span>
                </Link>
              ))}
              {shown.map((p) => (
                <Link key={`${p.slug}:${p.name}`} href={`/${lang}/products/${p.slug}`} onClick={close} className="block rounded-md px-3 py-2 hover:bg-sunk">
                  <span className="block truncate text-sm font-medium">{p.name}</span>
                  <span className="block truncate text-xs text-muted">
                    {p.category} · {p.group}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
