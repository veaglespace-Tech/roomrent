"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, Building2, CreditCard, Gauge, Inbox, LayoutDashboard, ListPlus, Menu, ShieldCheck, UserRound, Users, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { useAppSelector } from "@/store/hooks";

function SidebarContent() {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);

  const commonLinks = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/profile", label: "Profile", icon: UserRound },
    { href: "/dashboard/saved-properties", label: "Saved Properties", icon: Bookmark },
    { href: "/dashboard/saved-searches", label: "Saved Searches", icon: Bookmark },
    { href: "/dashboard/my-enquiries", label: "My Enquiries", icon: Inbox }
  ];

  const listingLinks = [
    { href: "/dashboard/subscription", label: "Listing Plan", icon: CreditCard },
    { href: "/dashboard/owner/add-property", label: "Add Property", icon: ListPlus },
    { href: "/dashboard/owner/my-listings", label: "My Listings", icon: Building2 },
    { href: "/dashboard/owner/leads", label: "Callback Leads", icon: Inbox },
    { href: "/dashboard/owner/enquiries", label: "Listing Enquiries", icon: Inbox }
  ];

  const adminLinks = [
    { href: "/dashboard/admin", label: "Superadmin", icon: LayoutDashboard },
    { href: "/dashboard/admin/review-queue", label: "Review Queue", icon: ShieldCheck },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/properties", label: "Manage Properties", icon: Building2 },
    { href: "/dashboard/admin/source-registry", label: "Source Registry", icon: ShieldCheck },
    { href: "/dashboard/admin/ingestion-queue", label: "Ingestion Queue", icon: Gauge }
  ];

  const links = [
    ...commonLinks,
    ...(user ? listingLinks : []),
    ...(user?.role === "ADMIN" ? adminLinks : [])
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="dashboard-sidebar-head">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--rf-cyan)]">Workspace</p>
        <h2 className="mt-3 text-2xl font-bold tracking-wide text-[var(--rf-ink)]">Dashboard</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--rf-muted)]">
          Manage listings, enquiries, saved items, and admin queues from one shell.
        </p>
      </div>
      <div className="min-h-0 p-4">
        <ul className="menu gap-2 pr-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn("dashboard-nav-item", pathname === link.href ? "dashboard-nav-item-active" : "")}
                >
                  <Icon className="size-4" />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function DashboardSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="mb-4 flex justify-end lg:hidden">
        <button type="button" className="mobile-menu-button" aria-expanded={open} onClick={() => setOpen(true)}>
          <Menu className="size-5" />
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close dashboard sidebar"
            className="absolute inset-0 bg-slate-950/20"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-[min(86vw,320px)] overflow-hidden border-r border-[var(--rf-line)] bg-[var(--rf-panel)] shadow-[18px_0_48px_-30px_rgba(15,23,42,0.38)]">
            <div className="flex items-center justify-between border-b border-[var(--rf-line)] px-4 py-4">
              <span className="inline-flex items-center gap-3">
                <span className="flex size-10 items-center justify-center border border-[var(--rf-line)] bg-[var(--rf-panel)] text-[var(--rf-cyan)]">
                  <Building2 className="size-4" />
                </span>
                <span className="text-sm font-bold tracking-wide text-[var(--rf-ink)]">RentFlow</span>
              </span>
              <button type="button" className="mobile-menu-button" onClick={() => setOpen(false)}>
                <X className="size-5" />
              </button>
            </div>
            <div className="h-[calc(100%-73px)] overflow-y-auto">
              <SidebarContent />
            </div>
          </aside>
        </div>
      ) : null}

      <aside className="dashboard-shell hidden w-full min-w-0 lg:sticky lg:top-24 lg:block lg:h-[calc(100vh-7rem)] lg:overflow-y-auto">
        <SidebarContent />
      </aside>
    </>
  );
}
