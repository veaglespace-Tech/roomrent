"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, CheckCircle2, LockKeyhole } from "lucide-react";

export function AuthCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="auth-shell">
      <div
        className="auth-side"
        style={{
          ["--rf-hero-image" as string]:
            "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(248,250,252,0.96)), radial-gradient(circle at 18% 8%, rgba(15,118,110,0.14), transparent 26%), linear-gradient(135deg, #ffffff, #eef3f8)"
        }}
      >
        <div className="relative z-10 flex h-full flex-col justify-between">
          <div className="space-y-6">
            <div className="landing-pill">
              <Building2 className="size-4" />
              RentFlow
            </div>
            <div className="space-y-4">
              <h2 className="max-w-lg text-4xl font-bold leading-tight text-[var(--rf-ink)]">A clean login surface for owners, tenants, and admins.</h2>
              <p className="max-w-lg text-sm leading-7 text-[var(--rf-muted)]">
                The auth flow uses the same system language as the rest of the app, without extra marketing panels or redundant UI.
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="surface-card p-4">
              <div className="flex items-center gap-3">
                <div className="landing-icon">
                  <CheckCircle2 className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">Verified account flow</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--rf-muted)]">Consistent sign-in and sign-up validation.</p>
                </div>
              </div>
            </div>
            <div className="surface-card p-4">
              <div className="flex items-center gap-3">
                <div className="landing-icon">
                  <LockKeyhole className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">Secure access</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--rf-muted)]">Single route for protected workspace access.</p>
                </div>
              </div>
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
        </div>
      </div>
    </div>
  );
}
