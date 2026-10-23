import type { Metadata } from "next";
import { Suspense } from "react";
import "../globals.css";
import { company } from "@/lib/i18n";

export const metadata: Metadata = {
  title: { default: `Admin panel | ${company.name}`, template: `%s | Admin — ${company.brand}` },
  robots: { index: false, follow: false },
};

// Admin sahifalari har doim yangi ma'lumot bilan ishlaydi — "instant" tekshiruvi kerak emas
export const instant = false;

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className="min-h-dvh bg-paper text-ink">
        <Suspense fallback={<div className="grid min-h-dvh place-items-center text-sm text-muted">Yuklanmoqda…</div>}>{children}</Suspense>
      </body>
    </html>
  );
}
