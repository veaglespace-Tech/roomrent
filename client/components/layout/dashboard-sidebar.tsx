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
    { href: "/dashboard/admin/properties", label: "Manage Properties" },
    { href: "/dashboard/admin/source-registry", label: "Source Registry" },
    { href: "/dashboard/admin/ingestion-queue", label: "Ingestion Queue" }
  ];

  const links = [
    ...commonLinks,
    ...(user?.role === "OWNER" || user?.role === "ADMIN" ? ownerLinks : []),
    ...(user?.role === "ADMIN" ? adminLinks : [])
  ];

  return (
    <aside className="sticky top-24 h-fit overflow-hidden rounded-[32px] border border-base-300/60 bg-white shadow-[0_26px_60px_-40px_rgba(15,23,42,0.34)]">
      <div className="border-b border-base-300/60 bg-[linear-gradient(160deg,#f8fff9_0%,#fff4f8_100%)] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-700">Workspace</p>
        <h2 className="mt-3 text-2xl font-semibold text-neutral">Dashboard</h2>
        <p className="mt-2 text-sm text-base-content/65">Manage profile, saved homes, listings and lead activity.</p>
      </div>
      <div className="p-4">
      <ul className="menu gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                "rounded-2xl px-4 py-3",
                pathname === link.href ? "bg-[#ef3d81] text-white" : "hover:bg-base-200"
              )}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      </div>
    </aside>
  );
}
