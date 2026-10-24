"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { Icon } from "./Icon";
import type { Dictionary, Locale } from "@/lib/i18n";
import { searchCatalog, type SearchEntry } from "@/lib/search";

type Props = {
  lang: Locale;
  entries: SearchEntry[];
  dict: Pick<Dictionary, "catalog">;
  /** So'rov bo'sh bo'lganda ko'rsatiladigan yo'nalishlar to'ri */
  children: ReactNode;
};

export function CatalogSearch({ lang, entries, dict, children }: Props) {
  const [q, setQ] = useState("");
  const c = dict.catalog;
  const needle = q.trim();
  const { cats, prods } = useMemo(() => searchCatalog(entries, needle), [entries, needle]);

  const total = cats.length + prods.length;

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <label className="flex h-12 items-center gap-2 rounded-md border border-line bg-card px-4 transition focus-within:border-accent sm:max-w-xl">
          <Icon name="search" className="size-[18px] text-muted" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={c.searchAll}
            aria-label={c.searchAll}
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted"
          />
        </label>
      </div>

      {!needle ? (
        children
      ) : (
        <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6">
          <p className="mb-5 text-sm text-muted" aria-live="polite">
            {c.results}: {total}
          </p>
          {total === 0 && <p className="py-12 text-center text-muted">{c.empty}</p>}

          {cats.length > 0 && (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cats.map((e) => (
                <li key={e.slug}>
                  <Link
                    href={`/${lang}/products/${e.slug}`}
                    className="group flex h-full items-center gap-3 rounded-lg border border-line bg-card p-4 transition-colors hover:border-accent/40"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-md bg-accent/10 text-accent">
                      <Icon name={e.slug} className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{e.category}</span>
                      <span className="block truncate text-xs text-muted">{e.brand}</span>
                    </span>
                    <Icon name="arrow" className="ml-auto size-4 shrink-0 text-accent transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {prods.length > 0 && (
            <ul className={`divide-y divide-line overflow-hidden rounded-lg border border-line bg-card ${cats.length ? "mt-8" : ""}`}>
              {prods.map((p) => (
                <li key={`${p.slug}:${p.name}`}>
                  <Link
                    href={`/${lang}/products/${p.slug}`}
                    className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-sunk"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-medium">{p.name}</span>
                      <span className="block truncate text-xs text-muted">
                        {p.category} · {p.group}
                        {p.cat ? ` · ${c.cat} ${p.cat}` : ""}
                      </span>
                    </span>
                    <Icon name="arrow" className="size-4 shrink-0 text-accent transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}
