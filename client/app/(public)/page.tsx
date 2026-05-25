"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  House,
  MapPinned,
  MoveRight,
  SearchCheck,
  ShieldCheck,
  Store,
  Users
} from "lucide-react";
import { getProperties } from "@/services/property-service";
import { Property } from "@/types";
import { SearchBar } from "@/components/property/search-bar";
import { PropertyCard } from "@/components/property/property-card";
import { SectionHeading } from "@/components/section-heading";
import {
  brandNameOptions,
  categoryBlueprint,
  featuredMaharashtraCities,
  maharashtraDistricts
} from "@/lib/maharashtra-data";

const categoryCards = [
  {
    title: "Hostels",
    href: "/properties?type=HOSTEL",
    subtitle: "Boys Hostel, Girls Hostel, student stays",
    icon: Users
  },
  {
    title: "PG Accommodation",
    href: "/properties?type=PG",
    subtitle: "Boys PG, Girls PG, furnished shared stays",
    icon: Building2
  },
  {
    title: "Rooms & Sharing",
    href: "/properties?type=ROOM",
    subtitle: "Single room, 1 sharing, 2 sharing, 3 sharing, 4 sharing",
    icon: House
  },
  {
    title: "Flats & Commercial",
    href: "/properties?type=FLAT",
    subtitle: "1 RK to 4 BHK+, shops, offices, co-working spaces",
    icon: Store
  }
];

const trustSignals = [
  "Owner and broker submissions",
  "District-wise rollout structure",
  "Advanced filters and map-ready schema"
];

const formatCount = (count: number) => new Intl.NumberFormat("en-IN").format(count);

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getProperties()
      .then(setProperties)
      .catch(() => {
        setProperties([]);
        setError("Featured properties are unavailable right now.");
      });
  }, []);

  const featuredProperties = properties.slice(0, 6);

  const inventoryStats = useMemo(
    () => ({
      rooms: properties.filter((item) => item.type === "ROOM").length,
      flats: properties.filter((item) => item.type === "FLAT").length,
      pgHostels: properties.filter((item) => item.type === "PG" || item.type === "HOSTEL").length,
      total: properties.length
    }),
    [properties]
  );

  return (
    <div className="pb-20">
      <section className="relative overflow-hidden border-b border-base-300">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,0.24),transparent_26%),radial-gradient(circle_at_right,rgba(251,146,60,0.2),transparent_28%),linear-gradient(135deg,#fcf7ef_0%,#fffdfa_46%,#f5fbf9_100%)]" />
        <div className="page-shell relative py-10 md:py-14">
          <div className="grid gap-10 xl:grid-cols-[1.08fr_0.92fr]">
            <div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-base-content/75">
                <span className="inline-flex items-center gap-2 rounded-full bg-base-100 px-4 py-2 shadow-sm">
                  <BadgeCheck className="size-4 text-primary" />
                  Maharashtra rental portal
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-base-300 px-4 py-2">
                  <SearchCheck className="size-4 text-secondary" />
                  City and district search
                </span>
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-tight text-neutral md:text-6xl">
                Find rooms, PGs, hostels, flats, and commercial rentals across Maharashtra
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-base-content/75 md:text-lg">
                Explore Maharashtra-wide rental discovery for Mumbai, Pune, Nagpur, Nashik, Thane, Navi Mumbai,
                Aurangabad, Kolhapur, Solapur, Sangli, Satara, Ahmednagar, and every district rollout after that.
              </p>

              <div className="mt-8">
                <SearchBar />
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-sm">
                <Link href="/register" className="btn btn-primary rounded-full px-8">
                  Post Free Ad
                  <ArrowRight className="size-4" />
                </Link>
                <Link href="/properties" className="btn btn-outline rounded-full px-8">
                  Browse Listings
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {brandNameOptions.slice(0, 4).map((name) => (
                  <span key={name} className="rounded-full border border-base-300 bg-base-100 px-4 py-2 text-xs font-medium text-base-content/70">
                    {name}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-5">
              <div className="overflow-hidden rounded-[34px] border border-base-300 bg-neutral text-neutral-content shadow-[0_30px_70px_-28px_rgba(15,23,42,0.45)]">
                <div className="relative h-[340px]">
                  <Image
                    src="https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1600&q=80"
                    alt="Maharashtra rental marketplace"
                    fill
                    className="object-cover opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral via-neutral/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-7">
                    <p className="text-sm uppercase tracking-[0.24em] text-neutral-content/70">What are you looking for?</p>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <Link href="/properties?type=HOSTEL" className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                        Hostels
                      </Link>
                      <Link href="/properties?type=PG" className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                        PG Accommodation
                      </Link>
                      <Link href="/properties?type=ROOM" className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                        Rooms & Sharing
                      </Link>
                      <Link href="/properties?type=FLAT" className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                        Flats & Apartments
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-[28px] border border-base-300 bg-base-100 p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Coverage</p>
                  <p className="mt-3 text-3xl font-extrabold text-neutral">{maharashtraDistricts.length}</p>
                  <p className="mt-1 text-sm text-base-content/70">districts prepared</p>
                </div>
                <div className="rounded-[28px] border border-base-300 bg-base-100 p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Launch cities</p>
                  <p className="mt-3 text-3xl font-extrabold text-neutral">{featuredMaharashtraCities.length}</p>
                  <p className="mt-1 text-sm text-base-content/70">priority city pages</p>
                </div>
                <div className="rounded-[28px] border border-base-300 bg-[linear-gradient(135deg,#115e59_0%,#0f766e_60%,#134e4a_100%)] p-5 text-white shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Live listings</p>
                  <p className="mt-3 text-3xl font-extrabold">{formatCount(inventoryStats.total)}</p>
                  <p className="mt-1 text-sm text-white/75">after demo cleanup</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell mt-14">
        <div className="grid gap-4 lg:grid-cols-4">
          {categoryCards.map(({ title, subtitle, href, icon: Icon }) => (
            <Link
              key={title}
              href={href}
              className="group rounded-[28px] border border-base-300 bg-base-100 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-card"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <MoveRight className="size-4 text-base-content/35 transition group-hover:translate-x-1" />
              </div>
              <h2 className="mt-5 text-xl font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-base-content/68">{subtitle}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-shell mt-20">
        <div className="flex items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Live Listings"
            title="Featured inventory"
            description="This grid now shows only live records from the backend. Jaipur demo properties were removed."
          />
          <div className="hidden rounded-full border border-base-300 bg-base-100 px-5 py-3 text-sm text-base-content/70 md:block">
            {trustSignals.join(" • ")}
          </div>
        </div>
        {error ? <p className="mt-4 text-sm text-error">{error}</p> : null}
        {featuredProperties.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-[32px] border border-dashed border-base-300 bg-base-100 p-8 shadow-sm">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-2xl font-semibold text-neutral">No live listings yet</p>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-base-content/70">
                  The fake Jaipur dataset is removed. Add verified owner listings from the dashboard, or start the
                  Maharashtra ingestion pipeline using legally permitted public sources.
                </p>
              </div>
              <Link href="/register" className="btn btn-primary rounded-full">
                Add First Listing
              </Link>
            </div>
          </div>
        )}
      </section>

      <section className="page-shell mt-20">
        <SectionHeading
          eyebrow="Explore by City"
          title="Major Maharashtra markets"
          description="Initial rollout markets for city pages, district landing pages, and inventory onboarding."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredMaharashtraCities.map((item) => (
            <div key={item.city} className="panel p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-2xl font-semibold">{item.city}</p>
                  <p className="mt-1 text-sm text-base-content/55">{item.district} district</p>
                </div>
                <div className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">Launch city</div>
              </div>
              <p className="mt-4 text-sm leading-7 text-base-content/70">{item.highlight}</p>
              <div className="mt-5 flex items-center gap-2 text-sm text-primary">
                <MapPinned className="size-4" />
                Maharashtra coverage node
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="page-shell mt-20">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[36px] bg-[linear-gradient(135deg,#1f2937_0%,#334155_100%)] p-8 text-white shadow-card">
            <p className="text-sm uppercase tracking-[0.22em] text-white/65">Category blueprint</p>
            <h2 className="mt-4 text-3xl font-bold">The full Maharashtra inventory model is now defined</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {categoryBlueprint.map((group) => (
                <div key={group.label} className="rounded-[24px] bg-white/8 p-4">
                  <p className="font-semibold">{group.label}</p>
                  <p className="mt-2 text-sm text-white/72">{group.items.join(", ")}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <div className="panel p-6">
              <div className="flex items-center gap-3">
                <BadgeCheck className="size-5 text-primary" />
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Inventory snapshot</p>
              </div>
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between rounded-2xl bg-base-200/60 px-4 py-3">
                  <span>Rooms</span>
                  <span className="font-semibold">{inventoryStats.rooms}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-base-200/60 px-4 py-3">
                  <span>Flats</span>
                  <span className="font-semibold">{inventoryStats.flats}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-base-200/60 px-4 py-3">
                  <span>PG / Hostels</span>
                  <span className="font-semibold">{inventoryStats.pgHostels}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-base-200/60 px-4 py-3">
                  <span>Total Live</span>
                  <span className="font-semibold">{inventoryStats.total}</span>
                </div>
              </div>
            </div>

            <div className="panel p-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-5 text-primary" />
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Original data path</p>
              </div>
              <div className="mt-4 space-y-3 text-sm leading-7 text-base-content/72">
                <p>Official Maharashtra district and city reference data is added for rollout planning and routing.</p>
                <p>Fake demo listing seeds are removed and purged from the backend bootstrap.</p>
                <p>Real listing inventory should now come from owner submissions or compliant public-source ingestion.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
