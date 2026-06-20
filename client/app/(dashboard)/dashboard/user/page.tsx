"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bookmark, Building2, Search, MessageSquareMore, ArrowRight, UserRound, HeartHandshake } from "lucide-react";
import { getProfile, getSavedProperties, getMyEnquiries } from "@/services/user-service";
import { getCompareIds } from "@/lib/compare-store";
import { UserProfile } from "@/types";

export default function UserDashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [savedCount, setSavedCount] = useState(0);
  const [enquiryCount, setEnquiryCount] = useState(0);
  const [compareCount, setCompareCount] = useState(0);

  useEffect(() => {
    getProfile().then(setProfile).catch(() => setProfile(null));
    getSavedProperties().then((items) => setSavedCount(items.length)).catch(() => setSavedCount(0));
    getMyEnquiries().then((items) => setEnquiryCount(items.length)).catch(() => setEnquiryCount(0));
    getCompareIds().then((ids) => setCompareCount(ids.length)).catch(() => setCompareCount(0));
  }, []);

  const cards = useMemo(
    () => [
      { label: "Saved items", value: savedCount, href: "/dashboard/saved-properties", icon: Bookmark },
      { label: "My enquiries", value: enquiryCount, href: "/dashboard/my-enquiries", icon: MessageSquareMore },
      { label: "Compare list", value: compareCount, href: "/compare", icon: HeartHandshake },
      { label: "Profile", value: profile?.role ?? "USER", href: "/dashboard/profile", icon: UserRound }
    ],
    [compareCount, enquiryCount, profile?.role, savedCount]
  );

  return (
    <div className="space-y-6">
      <div className="surface-card p-6 md:p-8">
        <p className="landing-eyebrow">User workspace</p>
        <h1 className="mt-3 text-3xl font-bold">Welcome{profile?.name ? `, ${profile.name.split(" ")[0]}` : ""}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--rf-muted)]">
          Your search, saved listings, enquiries, and comparison workspace live here.
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
          <h2 className="text-xl font-bold">Quick actions</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link href="/properties" className="landing-primary-button">
              <Search className="size-4" />
              Search properties
            </Link>
            <Link href="/dashboard/saved-properties" className="landing-secondary-button">
              <Bookmark className="size-4" />
              Open saved items
            </Link>
            <Link href="/dashboard/my-enquiries" className="landing-secondary-button">
              <MessageSquareMore className="size-4" />
              View enquiries
            </Link>
            <Link href="/compare" className="landing-secondary-button">
              <Building2 className="size-4" />
              Compare listings
            </Link>
          </div>
        </div>

        <div className="surface-card p-6">
          <h2 className="text-xl font-bold">Account status</h2>
          <div className="mt-4 space-y-3 text-sm text-[var(--rf-muted)]">
            <p>Role: <span className="font-semibold text-[var(--rf-ink)]">USER</span></p>
            <p>Visible pages: saved items, enquiries, compare, profile.</p>
            <p>Protected actions redirect through login before access.</p>
          </div>
          <Link href="/dashboard/profile" className="landing-primary-button mt-6">
            Open profile
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
