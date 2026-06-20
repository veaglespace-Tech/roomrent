"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Building2, Gauge, ShieldCheck, Users, RefreshCw, Inbox, ListChecks } from "lucide-react";
import { getAdminDashboard } from "@/services/user-service";
import { AdminDashboard } from "@/types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboard | null>(null);

  useEffect(() => {
    getAdminDashboard().then(setStats).catch(() => setStats(null));
  }, []);

  const cards = useMemo(
    () => [
      { label: "Users", value: stats?.totalUsers ?? 0, icon: Users, href: "/dashboard/admin/users" },
      { label: "Subscribers", value: stats?.totalSubscribers ?? 0, icon: ShieldCheck, href: "/dashboard/subscription" },
      { label: "Properties", value: stats?.totalProperties ?? 0, icon: Building2, href: "/dashboard/admin/properties" },
      { label: "Enquiries", value: stats?.totalEnquiries ?? 0, icon: Inbox, href: "/dashboard/admin/review-queue" }
    ],
    [stats]
  );

  return (
    <div className="space-y-6">
      <div className="surface-card p-6 md:p-8">
        <p className="landing-eyebrow">Admin workspace</p>
        <h1 className="mt-3 text-3xl font-bold">Admin dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--rf-muted)]">
          Central control for moderation, users, properties, source registry, and ingestion queues.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.label} href={item.href} className="surface-card p-5 transition hover:-translate-y-1">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--rf-muted)]">{item.label}</p>
                <span className="icon-tile">
                  <Icon className="size-5" />
                </span>
              </div>
              <div className="mt-5 text-3xl font-bold">{item.value}</div>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="surface-card p-6">
          <h2 className="text-xl font-bold">Admin tools</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link href="/dashboard/admin/review-queue" className="landing-primary-button">
              <ListChecks className="size-4" />
              Review queue
            </Link>
            <Link href="/dashboard/admin/users" className="landing-secondary-button">
              <Users className="size-4" />
              Manage users
            </Link>
            <Link href="/dashboard/admin/properties" className="landing-secondary-button">
              <Building2 className="size-4" />
              Manage properties
            </Link>
            <Link href="/dashboard/admin/source-registry" className="landing-secondary-button">
              <ShieldCheck className="size-4" />
              Source registry
            </Link>
            <Link href="/dashboard/admin/ingestion-queue" className="landing-secondary-button sm:col-span-2">
              <Gauge className="size-4" />
              Ingestion queue
            </Link>
          </div>
        </div>

        <div className="surface-card p-6">
          <h2 className="text-xl font-bold">Central access</h2>
          <p className="mt-4 text-sm leading-7 text-[var(--rf-muted)]">
            This page is the landing point for all admin routes. Direct access to admin screens is blocked unless the session role is ADMIN.
          </p>
          <Link href="/dashboard/admin/users" className="landing-primary-button mt-6">
            <RefreshCw className="size-4" />
            Open management tools
          </Link>
        </div>
      </div>
    </div>
  );
}
