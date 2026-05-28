"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Building2, Gauge, Inbox, LayoutDashboard, ListPlus, ShieldCheck, UserRound, Users } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAppSelector } from "@/store/hooks";

export function DashboardSidebar() {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);

  const commonLinks = [
    { href: "/dashboard/profile", label: "Profile", icon: UserRound },
    { href: "/dashboard/saved-properties", label: "Saved Properties", icon: Bookmark },
    { href: "/dashboard/my-enquiries", label: "My Enquiries", icon: Inbox }
  ];

  const ownerLinks = [
    { href: "/dashboard/owner/add-property", label: "Add Property", icon: ListPlus },
    { href: "/dashboard/owner/my-listings", label: "My Listings", icon: Building2 },
    { href: "/dashboard/owner/enquiries", label: "Owner Enquiries", icon: Inbox }
  ];

  const adminLinks = [
    { href: "/dashboard/admin", label: "Admin Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/properties", label: "Manage Properties", icon: Building2 },
    { href: "/dashboard/admin/source-registry", label: "Source Registry", icon: ShieldCheck },
    { href: "/dashboard/admin/ingestion-queue", label: "Ingestion Queue", icon: Gauge }
  ];

  const links = [
    ...commonLinks,
    ...(user?.role === "OWNER" || user?.role === "ADMIN" ? ownerLinks : []),
    ...(user?.role === "ADMIN" ? adminLinks : [])
  ];

  return (
    <aside className="dashboard-shell sticky top-24 h-fit">
      <div className="dashboard-sidebar-head">
        <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#ff385c]">Workspace</p>
        <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.02em] text-[#111827]">Dashboard</h2>
        <p className="mt-2 text-sm font-medium leading-6 text-[#64748b]">Manage profile, saved homes, listings and lead activity.</p>
      </div>
      <div className="p-4">
      <ul className="menu gap-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                "dashboard-nav-item",
                pathname === link.href ? "dashboard-nav-item-active" : ""
              )}
            >
              <Icon className="size-4" />
              {link.label}
            </Link>
          </li>
          );
        })}
      </ul>
      </div>
    </aside>
  );
}
