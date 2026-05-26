"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, CircleDollarSign, Home, SearchCheck, ShieldCheck, Users } from "lucide-react";
import { SearchBar } from "@/components/property/search-bar";
import { featuredMaharashtraCities, majorCitiesByDistrict } from "@/lib/maharashtra-data";

const roomImages = [
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80"
];

const categoryTiles = [
  { title: "Houses / Flats", href: "/properties?type=FLAT", description: "One room set to 4 BHK apartments", icon: Home },
  { title: "Office Shops", href: "/properties?category=Commercial", description: "Shops, offices and co-working spaces", icon: Building2 },
  { title: "PG / Hostel", href: "/properties?type=PG", description: "Boys and girls PG or hostel options", icon: Users },
  { title: "For Sale", href: "/properties", description: "Mixed residential and commercial inventory", icon: CircleDollarSign }
];

const popularMarkets = [
  { name: "Mumbai", district: "Mumbai City", count: "1,240+" },
  { name: "Pune", district: "Pune", count: "980+" },
  { name: "Thane", district: "Thane", count: "840+" },
  { name: "Nashik", district: "Nashik", count: "620+" },
  { name: "Nagpur", district: "Nagpur", count: "590+" },
  { name: "Aurangabad", district: "Aurangabad", count: "420+" }
];

const testimonials = [
  {
    name: "Suresh Patil",
    role: "Property Owner",
    quote: "I received inquiries only from genuine tenants and the process of renting my property felt much faster."
  },
  {
    name: "Shiv Kumar",
    role: "Tenant",
    quote: "It saved my time and effort while searching for rooms, and I could compare options much more clearly."
  },
  {
    name: "Babita Choudhary",
    role: "PG Owner",
    quote: "The direct owner to tenant model feels cleaner and more reliable than the usual listing experience."
  }
];

const allDistricts = Object.entries(majorCitiesByDistrict).slice(0, 12);

export default function HomePage() {
  return (
    <div className="page-shell pb-16 pt-8">
      <section className="app-frame overflow-hidden">
        <div className="px-4 py-12 sm:px-8 md:px-12 md:py-16">
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-center text-center">
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-neutral md:text-6xl">
              Use us to fill a spare room or find one to live in.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-base-content/65 md:text-lg">
              Search rooms, PGs, hostels, flats and workspaces across Maharashtra with a cleaner city-first discovery flow.
            </p>
            <div className="mt-8 w-full">
              <SearchBar />
            </div>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
            {roomImages.map((image, index) => (
              <div key={`${image}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-[0_16px_40px_-30px_rgba(15,23,42,0.45)]">
                <Image
                  src={image}
                  alt={`Room rental preview ${index + 1}`}
                  fill
                  className="object-cover transition duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-6 border-t border-base-300/70 pt-10 md:grid-cols-2">
            <div className="flex flex-col items-center rounded-xl bg-base-100 px-6 py-8 text-center shadow-[0_16px_40px_-32px_rgba(15,23,42,0.3)]">
              <h2 className="text-3xl font-semibold text-neutral">Rent out a room</h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-base-content/65">
                Find the right flatmate for your room among active seekers and publish your property in just a few steps.
              </p>
              <Link href="/register" className="btn pink-button mt-8 h-12 rounded-xl px-6 text-sm font-semibold">
                Get Started
              </Link>
            </div>

            <div className="flex flex-col items-center rounded-xl bg-base-100 px-6 py-8 text-center shadow-[0_16px_40px_-32px_rgba(15,23,42,0.3)]">
              <h2 className="text-3xl font-semibold text-neutral">Find a room</h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-base-content/65">
                Pick your city, check budgets, and browse listings designed for people moving fast without messy navigation.
              </p>
              <Link href="/properties" className="btn pink-button mt-8 h-12 rounded-xl px-6 text-sm font-semibold">
                Explore Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-4">
        {categoryTiles.map(({ title, href, description, icon: Icon }) => (
          <Link key={title} href={href} className="soft-card group p-6 transition hover:-translate-y-1">
            <div className="flex size-12 items-center justify-center rounded-xl bg-[#fff1f4] text-[#ff385c]">
              <Icon className="size-5" />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-neutral">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-base-content/68">{description}</p>
            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#ff385c]">
              View now
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="soft-card p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ff385c]">What are you looking for?</p>
          <h2 className="mt-4 text-3xl font-bold text-neutral">RoomRent Maharashtra helps people and homes find each other</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {popularMarkets.map((market) => (
              <Link
                key={market.name}
                href={`/districts/${market.district.toLowerCase().replace(/\s+/g, "-")}`}
                className="rounded-xl border border-base-300/70 bg-white p-5 transition hover:border-[#ff385c]/30"
              >
                <p className="text-lg font-semibold text-neutral">{market.name}</p>
                <p className="mt-1 text-sm text-base-content/60">{market.district} district</p>
                <p className="mt-4 text-sm font-semibold text-[#ff385c]">{market.count} properties</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="soft-card p-8">
          <div className="flex items-center gap-3">
            <SearchCheck className="size-5 text-[#ff385c]" />
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ff385c]">Coverage</p>
          </div>
          <h3 className="mt-4 text-2xl font-bold text-neutral">All Maharashtra districts are wired in</h3>
          <p className="mt-3 text-sm leading-7 text-base-content/68">
            Homepage stays curated. Full district and city coverage lives in dedicated routes so the UI does not become cluttered.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {allDistricts.map(([district]) => (
              <Link
                key={district}
                href={`/districts/${district.toLowerCase().replace(/\s+/g, "-")}`}
                className="rounded-lg border border-base-300/70 px-3 py-2 text-sm text-base-content/72 transition hover:border-[#ff385c]/30 hover:text-neutral"
              >
                {district}
              </Link>
            ))}
          </div>
          <Link href="/districts/pune" className="btn btn-outline mt-6 rounded-xl">
            Explore district pages
          </Link>
        </div>
      </section>

      <section className="mt-10 soft-card p-8 md:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ff385c]">Post property in just 2 steps</p>
            <h2 className="mt-4 text-3xl font-bold text-neutral">A simpler owner flow for Maharashtra rentals</h2>
            <p className="mt-4 text-sm leading-7 text-base-content/68">
              Create your account and add property details with pricing, photos and location data. The listing form is ready for statewide categories.
            </p>
            <Link href="/register" className="btn pink-button mt-8 rounded-xl px-6">
              Post Free Ad
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-base-200/60 p-6">
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#ff385c] text-sm font-bold text-white">1</span>
              <h3 className="mt-4 text-xl font-semibold text-neutral">Create your account</h3>
              <p className="mt-3 text-sm leading-7 text-base-content/68">Register as owner, seeker or room partner with a clean account setup flow.</p>
            </div>
            <div className="rounded-xl bg-base-200/60 p-6">
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#ff385c] text-sm font-bold text-white">2</span>
              <h3 className="mt-4 text-xl font-semibold text-neutral">Add property details</h3>
              <p className="mt-3 text-sm leading-7 text-base-content/68">Add price, photos, amenities, city, district and occupancy details from the owner dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-6 flex items-center gap-3">
          <ShieldCheck className="size-5 text-[#ff385c]" />
          <h2 className="text-3xl font-bold text-neutral">What our clients say</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.name} className="soft-card p-6">
              <p className="text-sm leading-7 text-base-content/70">“{item.quote}”</p>
              <div className="mt-5">
                <p className="font-semibold text-neutral">{item.name}</p>
                <p className="text-sm text-base-content/60">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="soft-card p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ff385c]">Featured city pages</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {featuredMaharashtraCities.map((city) => (
              <Link
                key={city.slug}
                href={`/cities/${city.slug}`}
                className="rounded-lg border border-base-300/70 px-4 py-3 text-sm text-base-content/75 transition hover:border-[#ff385c]/30 hover:text-neutral"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="soft-card p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ff385c]">People’s need</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Link href="/register" className="rounded-xl bg-base-200/60 p-5 transition hover:bg-base-200">
              <p className="text-lg font-semibold text-neutral">Room Seekers</p>
              <p className="mt-2 text-sm leading-7 text-base-content/68">Search verified listings by city, district and property type.</p>
            </Link>
            <Link href="/register" className="rounded-xl bg-base-200/60 p-5 transition hover:bg-base-200">
              <p className="text-lg font-semibold text-neutral">Room Partners</p>
              <p className="mt-2 text-sm leading-7 text-base-content/68">Connect with people who want to share a room or a flat.</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
