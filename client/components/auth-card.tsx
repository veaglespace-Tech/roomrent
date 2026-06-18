"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, CheckCircle2, Gauge, Home, LockKeyhole, MessageSquareMore } from "lucide-react";

export function AuthCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="auth-shell">
      <div className="auth-side" style={{ ["--rf-hero-image" as string]: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.88)), radial-gradient(circle at 30% 10%, rgba(15,118,110,0.16), transparent 28%), linear-gradient(135deg, #ffffff, #eef2f7)" }}>
        <div className="relative z-10 flex h-full flex-col justify-between">
          <div>
            <div className="landing-pill">
              <Building2 className="size-4" />
              RentFlow
            </div>
            <h2 className="mt-8 max-w-lg text-4xl font-bold leading-tight text-[var(--rf-ink)]">Access the rental workspace with the same visual language as the product system.</h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-[var(--rf-muted)]">
              One login for seekers, owners, and admins. The forms, cards, and dashboard now use the same light, professional treatment across the app.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="landing-card p-5">
              <div className="landing-icon">
                <Gauge className="size-5" />
              </div>
              <p className="mt-4 text-sm font-bold">Fast workspace</p>
              <p className="mt-2 text-sm leading-6 text-[var(--rf-muted)]">Jump from search to saved items and owner tools without changing design systems.</p>
            </div>
            <div className="landing-card p-5">
              <div className="landing-icon">
                <Home className="size-5" />
              </div>
              <p className="mt-4 text-sm font-bold">Property flow</p>
              <p className="mt-2 text-sm leading-6 text-[var(--rf-muted)]">List properties, track enquiries, and manage visibility in a single shell.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-8">
        <div className="auth-tab-shell">
          <div className="mx-auto flex w-fit items-center gap-1">
            <Link href="/login" className={`auth-tab ${pathname === "/login" ? "auth-tab-active" : ""}`}>
              Login
            </Link>
            <Link href="/register" className={`auth-tab ${pathname === "/register" ? "auth-tab-active" : ""}`}>
              Register
            </Link>
          </div>
        </div>

        <div className="px-2 pb-2 pt-8 sm:px-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[var(--rf-cyan)]">
            <LockKeyhole className="size-4" />
            Secure access
          </div>
          <h1 className="mt-4 text-3xl font-bold">{title}</h1>
          <p className="mt-2 max-w-xl text-sm leading-7 text-[var(--rf-muted)]">{description}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-8 grid gap-3 text-sm text-[var(--rf-muted)] sm:grid-cols-2">
            <div className="flex items-center gap-2 border border-[rgba(148,163,184,0.24)] px-3 py-2">
              <CheckCircle2 className="size-4 text-[var(--rf-cyan)]" />
              Verified account flow
            </div>
            <div className="flex items-center gap-2 border border-[rgba(148,163,184,0.24)] px-3 py-2">
              <MessageSquareMore className="size-4 text-[var(--rf-cyan)]" />
              Owner and seeker support
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
