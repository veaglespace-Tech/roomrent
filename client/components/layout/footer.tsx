"use client";

import Link from "next/link";
import { Building2, Mail, MapPin, Sparkles } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { getDashboardRoute, getStoredAuthRole } from "@/lib/auth-session";

export function Footer() {
  const user = useAppSelector((state) => state.auth.user);
  const role = user?.role || getStoredAuthRole();
  const dashboardHref = getDashboardRoute(role);

  const workspaceLinks =
    role === "ADMIN"
      ? [
          { href: "/dashboard/admin", label: "Admin dashboard" },
          { href: "/dashboard/admin/review-queue", label: "Review queue" },
          { href: "/dashboard/admin/users", label: "Manage users" }
        ]
      : role === "OWNER"
        ? [
            { href: "/dashboard/owner", label: "Owner dashboard" },
            { href: "/dashboard/owner/my-listings", label: "My listings" },
            { href: "/dashboard/owner/add-property", label: "Add property" }
          ]
        : user
          ? [
              { href: "/dashboard/user", label: "User dashboard" },
              { href: "/dashboard/saved-properties", label: "Saved properties" },
              { href: "/dashboard/my-enquiries", label: "My enquiries" }
            ]
          : [
              { href: "/login", label: "Login" },
              { href: "/register", label: "Create account" }
            ];

  return (
    <footer className="px-3 pb-8 pt-16 md:px-5">
      <div className="footer-shell">
        <div className="page-shell grid gap-10 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center border border-[var(--rf-cyan)] bg-[rgba(15,118,110,0.12)] text-[var(--rf-cyan)]">
                <Building2 className="size-4" />
              </span>
              <h3 className="text-2xl font-bold tracking-wide">RentFlow</h3>
            </div>
            <p className="max-w-md text-sm leading-7 text-[var(--rf-muted)]">
              A light, focused rental workspace for owners, seekers, and administrators across Maharashtra.
            </p>
            <div className="space-y-2 text-sm text-[var(--rf-muted)]">
              <p className="flex items-center gap-2"><Mail className="size-4 text-[var(--rf-cyan)]" /> roomrentmaharashtra@gmail.com</p>
              <p className="flex items-center gap-2"><MapPin className="size-4 text-[var(--rf-cyan)]" /> Maharashtra statewide</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--rf-cyan)]">Explore</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link className="footer-link" href="/properties">Browse properties</Link></li>
              <li><Link className="footer-link" href="/contact">Contact support</Link></li>
              <li><Link className="footer-link" href="/compare">Compare listings</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--rf-cyan)]">Workspace</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link className="footer-link" href={dashboardHref}>Dashboard</Link></li>
              {workspaceLinks.map((item) => (
                <li key={item.href}>
                  <Link className="footer-link" href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[rgba(15,118,110,0.14)]">
          <div className="page-shell flex flex-col gap-2 py-4 text-sm text-[var(--rf-muted)] md:flex-row md:items-center md:justify-between">
            <p>Copyright (c) 2026 RentFlow Maharashtra.</p>
            <p className="flex items-center gap-2"><Sparkles className="size-4 text-[var(--rf-cyan)]" /> Auth-aware navigation and dashboard routing.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
