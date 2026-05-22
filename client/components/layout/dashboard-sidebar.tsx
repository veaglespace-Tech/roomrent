"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { useAppSelector } from "@/store/hooks";

export function DashboardSidebar() {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);

  const commonLinks = [
    { href: "/dashboard/profile", label: "Profile" },
    { href: "/dashboard/saved-properties", label: "Saved Properties" },
    { href: "/dashboard/my-enquiries", label: "My Enquiries" }
  ];

  const ownerLinks = [
    { href: "/dashboard/owner/add-property", label: "Add Property" },
    { href: "/dashboard/owner/my-listings", label: "My Listings" },
    { href: "/dashboard/owner/enquiries", label: "Owner Enquiries" }
  ];

  const adminLinks = [
    { href: "/dashboard/admin", label: "Admin Dashboard" },
    { href: "/dashboard/admin/users", label: "Manage Users" },
    { href: "/dashboard/admin/properties", label: "Manage Properties" }
  ];

  const links = [
    ...commonLinks,
    ...(user?.role === "OWNER" || user?.role === "ADMIN" ? ownerLinks : []),
    ...(user?.role === "ADMIN" ? adminLinks : [])
  ];

  return (
    <aside className="panel sticky top-24 h-fit p-4">
      <p className="px-3 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">Dashboard</p>
      <ul className="menu gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                "rounded-2xl",
                pathname === link.href ? "bg-primary text-primary-content" : "hover:bg-base-200"
              )}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
