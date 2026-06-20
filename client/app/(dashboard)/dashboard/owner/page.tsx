"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Building2, ClipboardList, Inbox, ListPlus, MessageSquareMore, ShieldCheck, Wallet } from "lucide-react";
import { getOwnerEnquiries, getOwnerLeads, getProfile } from "@/services/user-service";
import { getOwnerProperties } from "@/services/property-service";
import { UserProfile } from "@/types";

export default function OwnerDashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [propertyCount, setPropertyCount] = useState(0);
  const [enquiryCount, setEnquiryCount] = useState(0);
  const [leadCount, setLeadCount] = useState(0);

  useEffect(() => {
    getProfile().then(setProfile).catch(() => setProfile(null));
    getOwnerProperties().then((items) => setPropertyCount(items.length)).catch(() => setPropertyCount(0));
    getOwnerEnquiries().then((items) => setEnquiryCount(items.length)).catch(() => setEnquiryCount(0));
    getOwnerLeads().then((items) => setLeadCount(items.length)).catch(() => setLeadCount(0));
  }, []);

  const summaryCards = useMemo(
    () => [
      { label: "Listings", value: propertyCount, icon: Building2, href: "/dashboard/owner/my-listings" },
      { label: "Enquiries", value: enquiryCount, icon: MessageSquareMore, href: "/dashboard/owner/enquiries" },
      { label: "Leads", value: leadCount, icon: Inbox, href: "/dashboard/owner/leads" },
      { label: "Plan", value: profile?.subscriptionPlan || "STARTER", icon: Wallet, href: "/dashboard/subscription" }
    ],
    [enquiryCount, leadCount, propertyCount, profile?.subscriptionPlan]
  );

  return (
    <div className="space-y-6">
      <div className="surface-card p-6 md:p-8">
        <p className="landing-eyebrow">Owner workspace</p>
        <h1 className="mt-3 text-3xl font-bold">Property management dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--rf-muted)]">
          Manage listings, enquiries, callback leads, and your subscription from one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => {
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
          <h2 className="text-xl font-bold">Owner actions</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link href="/dashboard/owner/add-property" className="landing-primary-button">
              <ListPlus className="size-4" />
              Add property
            </Link>
            <Link href="/dashboard/owner/my-listings" className="landing-secondary-button">
              <ClipboardList className="size-4" />
              My listings
            </Link>
            <Link href="/dashboard/owner/enquiries" className="landing-secondary-button">
              <MessageSquareMore className="size-4" />
              Owner enquiries
            </Link>
            <Link href="/dashboard/owner/leads" className="landing-secondary-button">
              <Inbox className="size-4" />
              Callback leads
            </Link>
            <Link href="/dashboard/subscription" className="landing-secondary-button sm:col-span-2">
              <ShieldCheck className="size-4" />
              Subscription and plan access
            </Link>
          </div>
        </div>

        <div className="surface-card p-6">
          <h2 className="text-xl font-bold">Owner status</h2>
          <div className="mt-4 space-y-3 text-sm text-[var(--rf-muted)]">
            <p>Role: <span className="font-semibold text-[var(--rf-ink)]">{profile?.role || "OWNER"}</span></p>
            <p>Allowed pages: add property, listings, leads, enquiries, subscription.</p>
            <p>Admin users can also reach this area, but regular users cannot.</p>
          </div>
          <Link href="/dashboard/owner/my-listings" className="landing-primary-button mt-6">
            <Building2 className="size-4" />
            Open listings
          </Link>
        </div>
      </div>
    </div>
  );
}
