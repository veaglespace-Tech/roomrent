"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CircleUserRound,
  House,
  MapPinned,
  MoveRight,
  SearchCheck,
  ShieldEllipsis,
  Store,
  Users
} from "lucide-react";
import { getProperties } from "@/services/property-service";
import { Property } from "@/types";
import { SearchBar } from "@/components/property/search-bar";
import { PropertyCard } from "@/components/property/property-card";
import { SectionHeading } from "@/components/section-heading";

const topCategories = [
  {
    title: "Houses",
    href: "/properties?type=ROOM",
    links: ["One Room Set", "Two Rooms Set", "Three Rooms Set", "Four Rooms Set"],
    icon: House
  },
  {
    title: "Flats",
    href: "/properties?type=FLAT",
    links: ["1 BHK Flats", "2 BHK Flats", "3 BHK Flats", "4 BHK Flats"],
    icon: Building2
  },
  {
    title: "PG / Hostel",
    href: "/properties?type=PG",
    links: ["PG | Hostel for Boys", "PG | Hostel for Girls", "Student Hostel", "Working Mens PG"],
    icon: Users
  },
  {
    title: "Shops & Offices",
    href: "/properties",
    links: ["Office Space", "Shops", "Commercial Floor", "Shared Workspace"],
    icon: Store
  }
];

const popularJaipurAreas = [
  "22 Godam",
  "Adarsh Nagar",
  "Bani Park",
  "C Scheme",
  "Gopalpura",
  "Jagatpura",
  "Jhotwara",
  "Malviya Nagar",
  "Mansarovar",
  "Patrakar Colony",
  "Sodala",
  "Vaishali Nagar",
  "Vidhyadhar Nagar"
];

const testimonials = [
  {
    name: "Suresh Kaler",
    role: "Rented House",
    quote:
      "My 2 BHK house was rented through Room Rent Jaipur and I received calls only from genuine tenants."
  },
  {
    name: "Shiv Kumar",
    role: "Tenant",
    quote:
      "It saved my time and effort in searching rooms and I found a suitable place much faster than expected."
  },
  {
    name: "Mukesh Choudhary",
    role: "Rented Apartment",
    quote:
      "The concept of connecting owners and tenants directly without brokerage is practical and reliable."
  }
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

  const locationCounts = useMemo(() => {
    const counts = properties.reduce<Record<string, number>>((acc, property) => {
      const area = property.location.split(",")[1]?.trim() || property.location;
      acc[area] = (acc[area] || 0) + 1;
      return acc;
    }, {});

    return popularJaipurAreas.map((area) => ({
      area,
      count: counts[area] || 0
    }));
  }, [properties]);

  const typeCounts = useMemo(() => {
    return {
      houses: properties.filter((item) => item.type === "ROOM").length,
      flats: properties.filter((item) => item.type === "FLAT").length,
      pg: properties.filter((item) => item.type === "PG" || item.type === "HOSTEL").length,
      sale: properties.length
    };
  }, [properties]);

  return (
    <div className="pb-20">
      <section className="relative overflow-hidden border-b border-base-300">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,0.24),transparent_26%),radial-gradient(circle_at_right,rgba(251,146,60,0.2),transparent_28%),linear-gradient(135deg,#fcf7ef_0%,#fffdfa_46%,#f5fbf9_100%)]" />
        <div className="page-shell relative py-10 md:py-14">
          <div className="grid gap-10 xl:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-base-content/75">
                <span className="inline-flex items-center gap-2 rounded-full bg-base-100 px-4 py-2 shadow-sm">
                  <BadgeCheck className="size-4 text-primary" />
                  Jaipur rental portal
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-base-300 px-4 py-2">
                  <SearchCheck className="size-4 text-secondary" />
                  Fully dynamic listings
                </span>
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-tight text-neutral md:text-6xl">
                Find Your Dream Home in Jaipur
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-base-content/75 md:text-lg">
                Browse houses, flats, PGs, hostels, shops, and offices with direct owner contact, live search, and a
                complete dashboard flow for owners, seekers, and admins.
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
                  Post Requirement
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {topCategories.map(({ title, href, links, icon: Icon }) => (
                  <Link
                    key={title}
                    href={href}
                    className="group rounded-[28px] border border-base-300 bg-base-100/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-card"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>
                      <MoveRight className="size-4 text-base-content/35 transition group-hover:translate-x-1" />
                    </div>
                    <h2 className="mt-5 text-lg font-semibold">{title}</h2>
                    <div className="mt-3 space-y-1 text-sm text-base-content/65">
                      {links.map((item) => (
                        <p key={item}>{item}</p>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-5">
              <div className="overflow-hidden rounded-[34px] border border-base-300 bg-neutral text-neutral-content shadow-[0_30px_70px_-28px_rgba(15,23,42,0.45)]">
                <div className="relative h-[320px]">
                  <Image
                    src="https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1400&q=80"
                    alt="Jaipur rental marketplace"
                    fill
                    className="object-cover opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral via-neutral/45 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-7">
                    <p className="text-sm uppercase tracking-[0.24em] text-neutral-content/70">What are you looking for?</p>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <Link href="/properties?type=ROOM" className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                        View Houses
                      </Link>
                      <Link href="/properties?type=FLAT" className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                        View Flats
                      </Link>
                      <Link href="/properties?type=PG&gender=BOYS" className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                        Boys Hostel
                      </Link>
                      <Link href="/properties?type=PG&gender=GIRLS" className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                        Girls Hostel
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[28px] border border-base-300 bg-base-100 p-6 shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Live portal count</p>
                  <p className="mt-3 text-4xl font-extrabold text-neutral">{formatCount(properties.length)}</p>
                  <p className="mt-2 text-sm text-base-content/70">Properties available right now from the backend API.</p>
                </div>
                <div className="rounded-[28px] border border-base-300 bg-[linear-gradient(135deg,#115e59_0%,#0f766e_60%,#134e4a_100%)] p-6 text-white shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">Owner to tenant</p>
                  <p className="mt-3 text-2xl font-bold">Direct contact without brokerage-first friction</p>
                  <p className="mt-3 text-sm text-white/75">Login, shortlist, enquire, and manage listings from one place.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell mt-16">
        <div className="grid gap-5 md:grid-cols-4">
          <div className="panel p-6">
            <House className="size-5 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">Houses / Flats</h3>
            <p className="mt-2 text-sm text-base-content/70">Discover one room sets, family flats, and compact homes across Jaipur.</p>
          </div>
          <div className="panel p-6">
            <Users className="size-5 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">PG / Hostel</h3>
            <p className="mt-2 text-sm text-base-content/70">Separate inventory for boys, girls, students, and working professionals.</p>
          </div>
          <div className="panel p-6">
            <Store className="size-5 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">Office Shops</h3>
            <p className="mt-2 text-sm text-base-content/70">Commercial-ready listings with searchable locations and owner details.</p>
          </div>
          <div className="panel p-6">
            <ShieldEllipsis className="size-5 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">People&apos;s Need</h3>
            <p className="mt-2 text-sm text-base-content/70">Room seekers and room partners can use the same auth and enquiry flow.</p>
          </div>
        </div>
      </section>

      <section className="page-shell mt-20">
        <SectionHeading
          eyebrow="Featured"
          title="Featured properties from live Jaipur inventory"
          description="Cards below are populated from the backend and can be managed from owner and admin dashboards."
        />
        {error ? <p className="mt-4 text-sm text-error">{error}</p> : null}
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      <section className="page-shell mt-20">
        <div className="rounded-[36px] border border-base-300 bg-base-100 p-8 shadow-card md:p-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Room Rent Jaipur helps people and homes find each other</p>
              <h2 className="mt-3 text-3xl font-bold text-neutral">Popular Jaipur areas</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-base-content/70">
                Area chips below combine portal-style browsing with live counts from your current property data.
              </p>
            </div>
            <Link href="/properties" className="btn btn-outline rounded-full">
              Advanced Search
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {locationCounts.map(({ area, count }) => (
              <Link
                key={area}
                href={`/properties?location=${encodeURIComponent(area)}`}
                className="flex items-center justify-between rounded-[22px] border border-base-300 bg-base-200/45 px-5 py-4 transition hover:-translate-y-0.5 hover:bg-base-100"
              >
                <div className="flex items-center gap-3">
                  <MapPinned className="size-4 text-secondary" />
                  <span className="font-medium">{area}</span>
                </div>
                <span className="text-sm text-base-content/60">{count} properties</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell mt-20">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[36px] bg-[linear-gradient(135deg,#1f2937_0%,#334155_100%)] p-8 text-white shadow-card">
            <p className="text-sm uppercase tracking-[0.22em] text-white/65">Post property in just 2 steps</p>
            <h2 className="mt-4 text-3xl font-bold">Fast owner onboarding with live listing management</h2>
            <div className="mt-8 space-y-4">
              <div className="rounded-[24px] bg-white/8 p-4">
                <p className="font-semibold">1. Create your account</p>
                <p className="mt-1 text-sm text-white/70">Register as owner or landlord and access the posting dashboard immediately.</p>
              </div>
              <div className="rounded-[24px] bg-white/8 p-4">
                <p className="font-semibold">2. Add property details</p>
                <p className="mt-1 text-sm text-white/70">Publish rent, photos, locality, amenities, and receive enquiries from seekers.</p>
              </div>
            </div>
            <Link href="/register" className="btn btn-secondary mt-8 rounded-full">
              Get Started
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="panel p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Dynamic categories</p>
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between rounded-2xl bg-base-200/60 px-4 py-3">
                  <span>Houses</span>
                  <span className="font-semibold">{typeCounts.houses}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-base-200/60 px-4 py-3">
                  <span>Flats</span>
                  <span className="font-semibold">{typeCounts.flats}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-base-200/60 px-4 py-3">
                  <span>PG / Hostel</span>
                  <span className="font-semibold">{typeCounts.pg}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-base-200/60 px-4 py-3">
                  <span>For Sale / Total Inventory View</span>
                  <span className="font-semibold">{typeCounts.sale}</span>
                </div>
              </div>
            </div>

            <div className="panel p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Platform flow checked</p>
              <div className="mt-5 space-y-3 text-sm text-base-content/72">
                <p>Login and register pages are connected to JWT auth.</p>
                <p>Property listings, filters, saved items, and enquiries are API-driven.</p>
                <p>Owner dashboard supports add, edit, and manage listings.</p>
                <p>Admin dashboard has users, properties, and high-level stats.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell mt-20">
        <SectionHeading
          eyebrow="Testimonials"
          title="What our clients say"
          description="A portal-style trust section adapted into a cleaner card layout."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.name} className="panel p-6">
              <CircleUserRound className="size-10 text-primary" />
              <p className="mt-5 text-sm leading-7 text-base-content/72">{item.quote}</p>
              <div className="mt-5 border-t border-base-300 pt-4">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-base-content/60">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
