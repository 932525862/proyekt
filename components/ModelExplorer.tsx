"use client";

import { useMemo, useRef, useState } from "react";
import { Icon } from "./Icon";
import { LeadForm } from "./LeadForm";
import { ProductImage } from "./ProductImage";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { Media } from "@/lib/media";

type Model = { name: string; image?: Media; cat?: string; std?: string; specs?: [string, string][] };
type Group = { name: string; models: Model[] };

type Props = {
  lang: Locale;
  groups: Group[];
  dict: Pick<Dictionary, "catalog" | "form">;
  options: { value: string; label: string }[];
  slug: string;
};

export function ModelExplorer({ lang, groups, dict, options, slug }: Props) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<string>("all");
  const [model, setModel] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return groups
      .filter((g) => active === "all" || g.name === active)
      .map((g) => ({ ...g, models: g.models.filter((m) => m.name.toLowerCase().includes(needle)) }))
      .filter((g) => g.models.length);
  }, [groups, q, active]);

  const pick = (m: string) => {
    setModel(m);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const c = dict.catalog;

  return (
    <>
      <div className="sticky top-16 z-20 -mx-4 border-b border-line bg-paper/90 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:top-[76px]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {groups.length > 1 && (
            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
              {[{ name: "all", label: c.all }, ...groups.map((g) => ({ name: g.name, label: g.name }))].map((t) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setActive(t.name)}
                  className={`shrink-0 rounded-md border px-3.5 py-2 text-sm font-medium transition-colors ${
                    active === t.name ? "border-accent bg-accent text-accent-ink" : "border-line bg-card text-ink/70 hover:border-accent/50 hover:text-ink"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
          <label className="flex h-11 items-center gap-2 rounded-md border border-line bg-card px-4 transition focus-within:border-accent md:ml-auto md:w-72">
            <Icon name="search" className="size-[18px] text-muted" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={c.search}
              className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted"
            />
          </label>
        </div>
      </div>

      <div className="mt-10 space-y-14">
        {visible.length === 0 && <p className="py-16 text-center text-muted">{c.empty}</p>}
        {visible.map((g) => (
          <div key={g.name}>
            <h2 className="mb-5 flex items-center gap-3 border-b border-line pb-3 text-lg font-semibold tracking-tight">
              {g.name}
              <span className="rounded-sm bg-accent/10 px-2 py-0.5 text-xs font-semibold tech text-accent">{g.models.length}</span>
            </h2>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {g.models.map((m) => (
                <li key={m.name}>
                  <button
                    type="button"
                    onClick={() => pick(m.name)}
                    className={`group flex size-full flex-col overflow-hidden rounded-lg border text-left transition-[border-color,box-shadow] ${
                      model === m.name ? "border-accent ring-2 ring-accent/20" : "border-line bg-card hover:border-accent/50 hover:shadow-[0_16px_36px_-22px_rgb(11_92_213/0.4)]"
                    }`}
                  >
                    {m.image ? (
                      <ProductImage media={m.image} sizes="(min-width:1280px) 240px, (min-width:640px) 30vw, 50vw" pad="p-4" className="aspect-[4/3] w-full" />
                    ) : (
                      <span className="bg-dots flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 bg-sunk text-ink/35">
                        <Icon name={slug} className="size-8" strokeWidth={1.25} />
                        <span className="text-sm font-semibold tracking-tight">
                          {m.name.match(/\(([^)]+)\)/)?.[1] ?? m.name.split(/[\s-]/)[0]}
                        </span>
                      </span>
                    )}
                    <span className="flex flex-1 flex-col gap-2 border-t border-line bg-card p-3.5">
                      <span className="text-[14.5px] font-semibold leading-snug tracking-tight">{m.name}</span>
                      {m.std && (
                        <span className="inline-flex w-fit items-center gap-1 rounded-sm bg-accent/10 px-1.5 py-0.5 text-[11px] font-medium leading-tight tech text-accent">
                          <Icon name="badge" className="size-3 shrink-0" />
                          {m.std}
                        </span>
                      )}
                      {(m.specs?.length || m.cat) && (
                        <dl className="grid gap-1 text-[12px] leading-tight">
                          {m.specs?.slice(0, 3).map(([k, v]) => (
                            <div key={k} className="flex justify-between gap-2">
                              <dt className="text-muted">{k}</dt>
                              <dd className="text-right font-medium">{v}</dd>
                            </div>
                          ))}
                          {m.cat && (
                            <div className="flex justify-between gap-2">
                              <dt className="text-muted">{c.cat}</dt>
                              <dd className="font-mono text-[11.5px]">{m.cat}</dd>
                            </div>
                          )}
                        </dl>
                      )}
                      <span className="mt-auto inline-flex items-center gap-1 text-[13px] font-medium text-muted transition-colors group-hover:text-accent">
                        {c.request}
                        <Icon name="arrowUp" className="size-3.5" />
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="text-xs text-muted">{c.imageNote}</p>
      </div>

      <div ref={formRef} className="scroll-mt-32 pt-20">
        <div className="grid gap-10 rounded-lg bg-band p-6 text-on-band sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <span className="eyebrow text-signal">{dict.form.submit}</span>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.025em] text-white sm:text-4xl">{c.quoteTitle}</h2>
          </div>
          <div className="text-ink">
            <LeadForm
              lang={lang}
              f={dict.form}
              requestFor={c.requestFor}
              options={options}
              defaultInterest={slug}
              model={model}
              onClearModel={() => setModel(null)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
