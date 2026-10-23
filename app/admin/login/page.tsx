import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/Logo";
import { loginEnabled, usingDefaultPassword } from "@/lib/auth";

export const metadata: Metadata = { title: "Kirish" };

/** "next" parametri Suspense ichida o'qiladi — sahifa qobig'i darhol ko'rinadi */
async function LoginFormWithNext({ searchParams }: { searchParams: PageProps<"/admin/login">["searchParams"] }) {
  const next = (await searchParams).next;
  return <LoginForm next={typeof next === "string" ? next : ""} />;
}

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  // parol sozlamasi server ishga tushganda o'qiladi (build vaqtida "muzlab" qolmasligi uchun)
  await connection();
  return (
    <main className="grid min-h-dvh place-items-center bg-band px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo inverted />
        </div>
        <div className="rounded-lg border border-line bg-card p-6 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)] sm:p-8">
          <h1 className="text-xl font-semibold tracking-tight">Admin panelga kirish</h1>
          <p className="mt-1 text-sm text-muted">Mahsulotlar, yo&apos;nalishlar va zayavkalarni boshqarish</p>
          {!loginEnabled() ? (
            <p className="mt-6 rounded-md bg-red-50 p-3 text-sm text-red-700">
              Kirish o&apos;chirilgan: serverda <b>ADMIN_PASSWORD</b> muhit o&apos;zgaruvchisi o&apos;rnatilmagan.
            </p>
          ) : (
            <Suspense fallback={<LoginForm next="" />}>
              <LoginFormWithNext searchParams={searchParams} />
            </Suspense>
          )}
          {usingDefaultPassword() && loginEnabled() && (
            <p className="mt-5 rounded-md bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
              Lokal rejim: login <b>admin</b>, parol <b>admin123</b>. Production&apos;da ADMIN_LOGIN va ADMIN_PASSWORD ni o&apos;rnating.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
