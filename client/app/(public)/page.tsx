"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BedDouble, Building2, Camera, CheckCircle2, Home, KeyRound, MapPin, Search, ShieldCheck, Store, Users } from "lucide-react";

const searchTypes = ["Any type", "Houses", "Flats", "Boys PG / Hostel", "Girls PG / Hostel", "Office / Shops"];

const imageCards = [
  {
    title: "City apartments",
    label: "Mumbai | Pune",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80",
    href: "/properties?type=FLAT"
  },
  {
    title: "Private rooms",
    label: "Single rooms",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80",
    href: "/properties?type=ROOM"
  },
  {
    title: "PG and hostels",
    label: "Students | Working",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80",
    href: "/properties?type=PG"
  },
  {
    title: "Work spaces",
    label: "Shops | Offices",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=80",
    href: "/properties?category=Commercial"
  }
];

const postSteps = [
  { title: "Create your account", description: "Register as an owner, seeker or room partner using your phone number and email.", icon: Users },
  { title: "Add property details", description: "Add rent, deposit, photos, amenities, city, district and occupancy details.", icon: Camera }
];

const needCards = [
  {
    title: "Are you alone and looking to share your room?",
    description: "Create a room partner requirement and connect with people who want to share a flat, PG or room.",
    href: "/register",
    action: "Find a roommate",
    icon: Users
  },
  {
    title: "Landlords can contact tenants directly",
    description: "Owners can find seekers, respond to genuine enquiries and keep the rental process direct.",
    href: "/register",
    action: "Find tenants",
    icon: Store
  }
];

const featureCards = [
  { title: "Verified spaces", description: "Cleaner listings with rent, deposit, furnishing and location details visible before you call.", icon: ShieldCheck },
  { title: "City-first search", description: "Move quickly between districts, localities, budgets and room categories across Maharashtra.", icon: MapPin },
  { title: "Direct owner flow", description: "Tenants and owners can connect without a crowded, confusing discovery experience.", icon: KeyRound }
];

const actionCards = [
  {
    title: "Rent out a room",
    description: "List a spare room, PG bed, hostel, flat or commercial space with photos, price and location details.",
    href: "/register",
    action: "Post Free Ad",
    icon: Home
  },
  {
    title: "Find a room",
    description: "Search rentals by city, locality, budget, sharing type and property category from one focused page.",
    href: "/properties",
    action: "Explore Rentals",
    icon: BedDouble
  }
];

const testimonials = [
  {
    name: "Suresh Patil",
    role: "Property Owner",
    quote: "I listed my room and started receiving genuine tenant calls quickly. The clean layout made it easy to show rent, photos and location."
  },
  {
    name: "Shiv Kumar",
    role: "Tenant",
    quote: "Finding a room felt simple because I could compare the area, budget and room type without opening too many confusing pages."
  },
  {
    name: "Babita Choudhary",
    role: "PG Owner",
    quote: "The direct owner-to-tenant flow is useful for PG owners. It keeps enquiries focused and saves time during admissions season."
  }
];

function SectionHeader({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="landing-eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold leading-tight text-[#111827] md:text-4xl">{title}</h2>
      <p className="mt-4 text-sm font-medium leading-7 text-[#64748b] md:text-base">{copy}</p>
    </div>
  );
}

function HeroSearch() {
  return (
    <div className="mx-auto mt-8 max-w-4xl">
      <div className="flex flex-wrap justify-center gap-2">
        {searchTypes.map((type) => (
          <Link key={type} href="/properties" className="rounded-full border border-[#e2e8f0] bg-white/80 px-4 py-2 text-xs font-bold text-[#64748b] transition hover:border-[#ff385c]/30 hover:text-[#ff385c]">
            {type}
          </Link>
        ))}
      </div>
      <form className="landing-search mx-auto mt-4">
        <label className="flex min-h-14 flex-1 items-center gap-3 px-5">
          <Search className="size-5 text-[#ff385c]" />
          <input className="w-full bg-transparent text-sm font-medium text-[#111827] outline-none placeholder:text-[#94a3b8]" placeholder="Search by city, area or property type" />
        </label>
        <Link href="/properties" className="landing-primary-button">
          Search
          <ArrowRight className="size-4" />
        </Link>
      </form>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-[#64748b]">
        <span>Owner-published listings appear live after verification.</span>
        <Link href="/properties" className="text-[#ff385c] hover:underline">Advanced Search</Link>
      </div>
    </div>
  );
}

function ImageGridCard({ card }: { card: (typeof imageCards)[number] }) {
  return (
    <Link href={card.href} className="landing-card group p-2">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[22px]">
        <Image src={card.image} alt={card.title} fill className="object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02)_0%,rgba(15,23,42,0.08)_44%,rgba(15,23,42,0.74)_100%)]" />
        <div className="absolute inset-x-4 bottom-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">{card.label}</p>
          <h3 className="mt-1 text-xl font-bold text-white">{card.title}</h3>
        </div>
      </div>
    </Link>
  );
}

function FeatureCard({ card }: { card: (typeof featureCards)[number] }) {
  const Icon = card.icon;

  return (
    <div className="landing-card p-6">
      <div className="landing-icon">
        <Icon className="size-5" />
      </div>
      <h3 className="mt-5 text-xl font-bold text-[#111827]">{card.title}</h3>
      <p className="mt-3 text-sm font-medium leading-7 text-[#64748b]">{card.description}</p>
    </div>
  );
}

function ActionCard({ card }: { card: (typeof actionCards)[number] }) {
  const Icon = card.icon;

  return (
    <Link href={card.href} className="landing-card group flex min-h-[280px] flex-col justify-between p-7">
      <div>
        <div className="landing-icon">
          <Icon className="size-5" />
        </div>
        <h3 className="mt-6 text-3xl font-bold leading-tight text-[#111827]">{card.title}</h3>
        <p className="mt-4 text-sm font-medium leading-7 text-[#64748b]">{card.description}</p>
      </div>
      <div className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#ff385c]">
        {card.action}
        <ArrowRight className="size-4 transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function StepCard({ step, index }: { step: (typeof postSteps)[number]; index: number }) {
  const Icon = step.icon;

  return (
    <div className="landing-card p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="landing-icon">
          <Icon className="size-5" />
        </div>
        <span className="text-4xl font-extrabold text-[#ff385c]/20">{index + 1}</span>
      </div>
      <h3 className="mt-6 text-2xl font-bold text-[#111827]">{step.title}</h3>
      <p className="mt-3 text-sm font-medium leading-7 text-[#64748b]">{step.description}</p>
    </div>
  );
}

function NeedCard({ card }: { card: (typeof needCards)[number] }) {
  const Icon = card.icon;

  return (
    <Link href={card.href} className="landing-card group flex min-h-[220px] flex-col justify-between p-6">
      <div>
        <div className="landing-icon">
          <Icon className="size-5" />
        </div>
        <h3 className="mt-5 text-2xl font-bold leading-tight text-[#111827]">{card.title}</h3>
        <p className="mt-3 text-sm font-medium leading-7 text-[#64748b]">{card.description}</p>
      </div>
      <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#ff385c]">
        {card.action}
        <ArrowRight className="size-4 transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function TestimonialCard({ item }: { item: (typeof testimonials)[number] }) {
  return (
    <div className="landing-card flex min-h-[250px] flex-col justify-between p-6">
      <div>
        <p className="text-5xl font-extrabold leading-none text-[#ff385c]/25">"</p>
        <p className="mt-2 text-sm font-medium leading-7 text-[#475569]">{item.quote}</p>
      </div>
      <div className="mt-6 border-t border-[#e2e8f0] pt-5">
        <p className="font-bold text-[#111827]">{item.name}</p>
        <p className="mt-1 text-sm font-semibold text-[#94a3b8]">{item.role}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="page-shell pb-16 pt-7">
      <section className="landing-hero">
        <div className="mx-auto max-w-4xl text-center">
          <div className="landing-pill mx-auto">
            <Building2 className="size-4" />
            RoomRent Maharashtra
          </div>
          <h1 className="mt-7 text-4xl font-extrabold leading-tight text-[#111827] md:text-6xl">
            Find rooms, PGs and flats with a cleaner rental experience.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-8 text-[#64748b] md:text-lg">
            Search modern rental spaces across Maharashtra, compare budgets quickly, and connect with owners from a focused Airbnb-inspired interface.
          </p>
          <HeroSearch />
        </div>
      </section>

      <section className="mt-10">
        <SectionHeader
          eyebrow="What are you looking for?"
          title="Choose the rental category that fits your need"
          copy="Browse houses, flats, PGs, hostels and commercial spaces with the same clean card experience."
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {imageCards.map((card) => (
            <ImageGridCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeader
          eyebrow="Built for fast decisions"
          title="One consistent system for every rental type"
          copy="Every section uses the same card spacing, radius, border, shadow and hover treatment so the page feels polished instead of mixed."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {featureCards.map((card) => (
            <FeatureCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <div className="grid gap-5 lg:grid-cols-2">
          {actionCards.map((card) => (
            <ActionCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <div className="landing-card p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="landing-eyebrow">Post property in just 2 steps</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-[#111827] md:text-4xl">It is free to advertise your rental space.</h2>
              <p className="mt-4 text-sm font-medium leading-7 text-[#64748b]">Owners can publish room, PG, hostel, flat and shop details with pricing, photos and location data.</p>
              <Link href="/register" className="landing-primary-button mt-7 w-fit">
                Get Started
                <CheckCircle2 className="size-4" />
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {postSteps.map((step, index) => (
                <StepCard key={step.title} step={step} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="grid gap-5 lg:grid-cols-2">
          {needCards.map((card) => (
            <NeedCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeader
          eyebrow="Trusted renters"
          title="What our clients say"
          copy="Demo reviews from owners and tenants show how the platform helps both sides move faster with less clutter."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <TestimonialCard key={item.name} item={item} />
          ))}
        </div>
      </section>

      <section className="landing-card mt-10 grid gap-5 p-5 md:grid-cols-[1fr_auto] md:items-center md:p-7">
        <div className="flex items-start gap-4">
          <div className="landing-icon">
            <Users className="size-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#111827]">Community, support and owner tools stay one click away.</h2>
            <p className="mt-2 text-sm font-medium leading-7 text-[#64748b]">Use the compact navigation to reach help, accounts and rental exploration without adding height to the header.</p>
          </div>
        </div>
        <Link href="/contact" className="landing-secondary-button">
          Contact Support
        </Link>
      </section>
    </div>
  );
}
