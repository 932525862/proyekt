"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { Logo } from "@/components/Logo";
import { logout } from "@/app/admin/actions";

const items = [
  { href: "/admin", label: "Boshqaruv paneli", icon: "dashboard" },
  { href: "/admin/leads", label: "Zayavkalar", icon: "inbox", badge: true },
  { href: "/admin/products", label: "Mahsulotlar", icon: "package" },
  { href: "/admin/categories", label: "Yo'nalishlar", icon: "folders" },
  { href: "/admin/services", label: "Xizmatlar", icon: "wrench" },
  { href: "/admin/settings", label: "Sozlamalar", icon: "settings" },
];

export function AdminNav({ newLeads }: { newLeads: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const nav = (
    <nav className="grid gap-1">
      {items.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-[14.5px] font-medium transition-colors ${
            isActive(it.href) ? "bg-white/10 text-white" : "text-on-band/70 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Icon name={it.icon} className="size-[18px]" />
          <span className="flex-1">{it.label}</span>
          {it.badge && newLeads > 0 && <span className="rounded-sm bg-signal px-1.5 py-0.5 text-[11px] font-bold text-band">{newLeads}</span>}
        </Link>
      ))}
    </nav>
  );

  const footer = (
    <div className="grid gap-1 border-t border-white/10 pt-3">
      <a href="/uz" target="_blank" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-on-band/60 hover:bg-white/5 hover:text-white">
        <Icon name="external" className="size-4" /> Saytni ochish
      </a>
      <form action={logout}>
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-on-band/60 hover:bg-white/5 hover:text-white">
          <Icon name="logout" className="size-4" /> Chiqish
        </button>
      </form>
    </div>
  );

  return (
    <>
      {/* Kompyuter: chap panel */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-6 bg-band p-4 text-on-band lg:flex">
        <Link href="/admin" className="px-2 pt-2">
          <Logo inverted id="mark-adm-side" />
        </Link>
        <div className="flex-1">{nav}</div>
        {footer}
      </aside>

      {/* Telefon: yuqori panel + ochiladigan menyu */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between bg-band px-4 text-on-band lg:hidden">
        <Link href="/admin">
          <Logo inverted id="mark-adm-top" />
        </Link>
        <button type="button" aria-label="Menyu" aria-expanded={open} onClick={() => setOpen((v) => !v)} className="relative grid size-10 place-items-center rounded-md border border-white/15">
          <Icon name={open ? "close" : "menu"} className="size-5" />
          {!open && newLeads > 0 && <span className="absolute -right-1 -top-1 size-3 rounded-full bg-signal ring-2 ring-band" />}
        </button>
      </header>
      {open && (
        <div className="fixed inset-x-0 bottom-0 top-14 z-30 flex flex-col gap-6 bg-band p-4 text-on-band lg:hidden">
          <div className="flex-1">{nav}</div>
          {footer}
        </div>
      )}
    </>
  );
}
