"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gauge, Home } from "lucide-react";

export function AuthCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="auth-shell">
      <div className="auth-side">
        <div className="relative z-10">
        <p className="text-sm font-extrabold uppercase tracking-[0.26em] text-[#ff385c]">RoomRent Maharashtra</p>
        <h2 className="mt-6 text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#111827]">Access the rental workspace built for modern property discovery.</h2>
        <p className="mt-5 text-sm font-semibold leading-7 text-[#64748b]">
          Search city inventory, manage saved homes, list properties and track enquiries from a single dashboard.
        </p>
        <div className="mt-10 grid gap-4">
          <div className="landing-card p-5">
            <div className="icon-tile mb-4">
              <Gauge className="size-5" />
            </div>
            <p className="text-sm font-bold text-[#111827]">Fast search</p>
            <p className="mt-2 text-sm font-medium leading-6 text-[#64748b]">Filter rentals by city, district, category, budget and sharing type.</p>
          </div>
          <div className="landing-card p-5">
            <div className="icon-tile mb-4">
              <Home className="size-5" />
            </div>
            <p className="text-sm font-bold text-[#111827]">Owner tools</p>
            <p className="mt-2 text-sm font-medium leading-6 text-[#64748b]">Publish, manage and update listings from your account panel.</p>
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
          <h1 className="text-3xl font-extrabold tracking-[-0.02em] text-[#111827]">{title}</h1>
          <p className="mt-2 text-sm font-medium leading-7 text-[#64748b]">{description}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
