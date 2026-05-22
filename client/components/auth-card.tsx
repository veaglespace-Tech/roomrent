"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AuthCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto w-full max-w-xl overflow-hidden rounded-[32px] border border-base-300 bg-base-100 p-0 shadow-card">
      <div className="border-b border-base-300 bg-[linear-gradient(135deg,#f8fafc_0%,#eef8f6_100%)] p-3">
        <div className="tabs tabs-boxed mx-auto w-fit rounded-full bg-base-100 p-1">
          <Link href="/login" className={`tab rounded-full px-6 ${pathname === "/login" ? "tab-active !bg-primary !text-primary-content" : ""}`}>
            Login
          </Link>
          <Link href="/register" className={`tab rounded-full px-6 ${pathname === "/register" ? "tab-active !bg-primary !text-primary-content" : ""}`}>
            Register
          </Link>
        </div>
      </div>
      <div className="p-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-base-content/70">{description}</p>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
