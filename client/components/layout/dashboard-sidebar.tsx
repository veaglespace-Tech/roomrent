"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bookmark, Building2, CreditCard, Gauge, Inbox, LayoutDashboard, ListPlus, LogOut, Menu, Search, ShieldCheck, UserRound, Users, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { clearAuthSession, getDashboardRoute, getStoredAuthRole } from "@/lib/auth-session";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout as logoutAction } from "@/store/slices/auth-slice";
import { logoutUser } from "@/services/auth-service";

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);
  const role = user?.role || getStoredAuthRole();

  const links = useMemo(() => {
    const common = [
      { href: getDashboardRoute(role), label: "Overview", icon: LayoutDashboard },
      { href: "/dashboard/profile", label: "Profile", icon: UserRound }
    ];

    if (role === "ADMIN") {
      return [
        ...common,
        { href: "/dashboard/admin/review-queue", label: "Review Queue", icon: ShieldCheck },
        { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
        { href: "/dashboard/admin/properties", label: "Manage Properties", icon: Building2 },
        { href: "/dashboard/admin/source-registry", label: "Source Registry", icon: ShieldCheck },
        { href: "/dashboard/admin/ingestion-queue", label: "Ingestion Queue", icon: Gauge }
      ];
    }

    if (role === "OWNER") {
      return [
        ...common,
        { href: "/dashboard/subscription", label: "Subscription", icon: CreditCard },
        { href: "/dashboard/owner/add-property", label: "Add Property", icon: ListPlus },
        { href: "/dashboard/owner/my-listings", label: "My Listings", icon: Building2 },
        { href: "/dashboard/owner/enquiries", label: "Owner Enquiries", icon: Inbox },
        { href: "/dashboard/owner/leads", label: "Leads", icon: Inbox }
      ];
    }

    return [
      ...common,
      { href: "/dashboard/saved-properties", label: "Saved Properties", icon: Bookmark },
      { href: "/dashboard/saved-searches", label: "Saved Searches", icon: Bookmark },
      { href: "/dashboard/my-enquiries", label: "My Enquiries", icon: Inbox },
      { href: "/compare", label: "Compare", icon: Search },
      { href: "/properties", label: "Search Properties", icon: Search }
    ];
  }, [role]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="sidebar-header">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--rf-cyan)]">Workspace</p>
        <h2 className="mt-3 text-2xl font-bold tracking-wide text-[var(--rf-ink)]">Dashboard</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--rf-muted)]">
          Role: <span className="font-semibold text-[var(--rf-ink)]">{role || "USER"}</span>
        </p>
      </div>

      <div className="sidebar-body">
        <ul className="menu gap-2 pr-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn("sidebar-link", pathname === link.href ? "sidebar-link-active" : "")}
                  onClick={onNavigate}
                >
                  <span className="sidebar-icon">
                    <Icon className="size-4" />
                  </span>
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
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Continue with client cleanup if the server logout request fails.
    } finally {
      clearAuthSession();
      dispatch(logoutAction());
      router.push("/login");
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
        <button type="button" className="mobile-menu-button" aria-expanded={open} onClick={() => setOpen(true)}>
          <Menu className="size-5" />
        </button>
        <button type="button" className="landing-secondary-button min-h-11 px-4 text-xs" onClick={handleLogout}>
          <LogOut className="size-4" />
          Logout
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close dashboard sidebar"
            className="drawer-overlay"
            onClick={() => setOpen(false)}
          />
          <aside className="drawer-panel w-[min(88vw,360px)] overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--rf-line)] px-4 py-4">
              <span className="inline-flex items-center gap-3">
                <span className="sidebar-icon">
                  <Building2 className="size-4" />
                </span>
                <span className="text-sm font-bold tracking-wide text-[var(--rf-ink)]">RentFlow</span>
              </span>
              <button type="button" className="mobile-menu-button" onClick={() => setOpen(false)}>
                <X className="size-5" />
              </button>
            </div>
            <div className="h-[calc(100%-73px)] overflow-y-auto">
              <SidebarContent onNavigate={() => setOpen(false)} />
              <div className="border-t border-[var(--rf-line)] p-4">
                <button type="button" className="landing-secondary-button w-full" onClick={handleLogout}>
                  <LogOut className="size-4" />
                  Logout
                </button>
              </div>
            </div>
          </aside>
        </div>
      ) : null}

      <aside className="sidebar-shell hidden w-full min-w-0 lg:sticky lg:top-24 lg:block lg:h-[calc(100vh-7rem)] lg:overflow-y-auto">
        <SidebarContent />
        <div className="sidebar-footer">
          <button type="button" className="landing-secondary-button w-full" onClick={handleLogout}>
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
