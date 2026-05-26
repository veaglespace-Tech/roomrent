"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AuthCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-[36px] border border-base-300/60 bg-white shadow-[0_40px_90px_-48px_rgba(15,23,42,0.35)] lg:grid-cols-[0.95fr_1.05fr]">
      <div className="hidden bg-[linear-gradient(160deg,#f8fff9_0%,#ffffff_45%,#fff1f6_100%)] p-10 lg:block">
        <p className="text-sm font-semibold uppercase tracking-[0.26em] text-green-700">RoomRent Maharashtra</p>
        <h2 className="mt-6 text-4xl font-bold leading-tight text-neutral">Access the rental workspace built for modern property discovery.</h2>
        <p className="mt-5 text-sm leading-7 text-base-content/68">
          Search city inventory, manage saved homes, list properties and track enquiries from a single dashboard.
        </p>
        <div className="mt-10 grid gap-4">
          <div className="soft-card p-5">
            <p className="text-sm font-semibold text-neutral">Fast search</p>
            <p className="mt-2 text-sm text-base-content/65">Filter rentals by city, district, category, budget and sharing type.</p>
          </div>
          <div className="soft-card p-5">
            <p className="text-sm font-semibold text-neutral">Owner tools</p>
            <p className="mt-2 text-sm text-base-content/65">Publish, manage and update listings from your account panel.</p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-8">
        <div className="rounded-[28px] border border-base-300/60 bg-[linear-gradient(180deg,#fff_0%,#fff9fb_100%)] p-3">
          <div className="tabs tabs-boxed mx-auto w-fit rounded-full bg-white p-1 shadow-sm">
            <Link href="/login" className={`tab rounded-full px-6 ${pathname === "/login" ? "tab-active !border-none !bg-[#ef3d81] !text-white" : ""}`}>
            Login
            </Link>
            <Link href="/register" className={`tab rounded-full px-6 ${pathname === "/register" ? "tab-active !border-none !bg-[#ef3d81] !text-white" : ""}`}>
            Register
            </Link>
          </div>
        </div>
        <div className="px-2 pb-2 pt-8 sm:px-4">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-base-content/70">{description}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
