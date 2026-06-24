"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  ChevronRight,
  Home,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Zap,
  BedDouble,
  Briefcase,
} from "lucide-react";
import { featuredMaharashtraCities } from "@/lib/maharashtra-data";

/* ─── Static data ──────────────────────────────────────────── */

const listingCategories = [
  {
    title: "Rooms",
    desc: "Shared & private rooms for singles and couples.",
    href: "/properties?type=ROOM",
    icon: BedDouble,
    color: "#6366f1",
    glow: "rgba(99,102,241,0.14)",
    from: "#6366f1",
    to: "#8b5cf6",
    count: "900+",
  },
  {
    title: "Flats & BHKs",
    desc: "1, 2 & 3 BHK apartments across Maharashtra.",
    href: "/properties?type=FLAT",
    icon: Home,
    color: "#7c3aed",
    glow: "rgba(124,58,237,0.14)",
    from: "#7c3aed",
    to: "#a855f7",
    count: "1,200+",
  },
  {
    title: "PG / Hostel",
    desc: "Girls & boys PG with meals and facilities.",
    href: "/properties?type=PG",
    icon: Users,
    color: "#0ea5e9",
    glow: "rgba(14,165,233,0.12)",
    from: "#0ea5e9",
    to: "#6366f1",
    count: "500+",
  },
  {
    title: "Commercial",
    desc: "Office spaces, shops & co-working units.",
    href: "/contact",
    icon: Briefcase,
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.12)",
    from: "#f59e0b",
    to: "#ef4444",
    count: "200+",
  },
];

const serviceCards = [
  {
    icon: Search,
    title: "Smart Search",
    copy: "Filter by locality, budget, furnishing, gender preference, and occupancy type.",
    accent: "#6366f1",
  },
  {
    icon: ShieldCheck,
    title: "Verified Listings",
    copy: "Direct-owner verified properties with clean records and honest descriptions.",
    accent: "#7c3aed",
  },
  {
    icon: BarChart3,
    title: "Track Everything",
    copy: "Save listings, compare options, send enquiries, and manage callback leads.",
    accent: "#0ea5e9",
  },
];

const platformStats = [
  { value: "3,500+", label: "Active Listings", icon: Building2 },
  { value: "28", label: "Districts Covered", icon: MapPin },
  { value: "800+", label: "Property Owners", icon: Users },
  { value: "4.8★", label: "Average Rating", icon: Star },
];

/* ─── Marquee city data — duplicate for seamless loop ─────── */
const marqueeItems = [...featuredMaharashtraCities, ...featuredMaharashtraCities];

/* ─── Sub-components ───────────────────────────────────────── */

function SectionEyebrow({ children }) {
  return (
    <div className="landing-eyebrow w-fit">
      <Sparkles className="size-3.5" />
      {children}
    </div>
  );
}

function HeroMockupCard() {
  return (
    <div className="surface-card overflow-hidden p-0 animate-float" style={{ animationDelay: "0.3s" }}>
      {/* Card header */}
      <div
        className="flex items-center justify-between gap-4 px-5 py-4"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))",
          borderBottom: "1px solid rgba(99,102,241,0.1)",
        }}
      >
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] font-bold text-indigo-500">Live workspace</p>
          <p className="mt-1 text-sm font-extrabold text-slate-900">Rental dashboard</p>
        </div>
        <span className="pill-badge">Active</span>
      </div>

      {/* Stats mini grid */}
      <div className="grid grid-cols-2 gap-3 p-5">
        {[
          { label: "Properties", val: "3,500+", color: "#6366f1" },
          { label: "Cities", val: "350+", color: "#7c3aed" },
          { label: "Enquiries today", val: "128", color: "#0ea5e9" },
          { label: "Owners online", val: "46", color: "#f59e0b" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-[14px] p-3"
            style={{
              border: "1px solid rgba(99,102,241,0.1)",
              background: "rgba(248,250,255,0.8)",
            }}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">{s.label}</p>
            <p className="mt-1.5 text-xl font-extrabold" style={{ color: s.color }}>
              {s.val}
            </p>
          </div>
        ))}
      </div>

      {/* Footer row */}
      <div
        className="flex items-center justify-between gap-3 px-5 py-3"
        style={{
          borderTop: "1px solid rgba(99,102,241,0.08)",
          background: "rgba(248,250,255,0.5)",
        }}
      >
        <p className="text-[11px] font-medium text-slate-400">Updated every minute</p>
        <Link
          href="/properties"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-600"
        >
          Browse all <ChevronRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}

/* ─── Main page ────────────────────────────────────────────── */

export default function HomePage() {
  const statsRef = useRef([]);
  const [statsVisible, setStatsVisible] = useState(false);

  // Animate stats on scroll into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    const container = document.getElementById("stats-band");
    if (container) observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="page-shell space-y-10 py-6 md:py-8">

      {/* ═══════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════ */}
      <section className="landing-hero reveal-up">
        {/* Decorative floating orbs */}
        <div className="hero-orb-1" />
        <div className="hero-orb-2" />

        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          {/* Left — text column */}
          <div className="space-y-7 max-w-2xl">
            <SectionEyebrow>Maharashtra's Premier Rental Platform</SectionEyebrow>

            <div className="space-y-3">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-indigo-500/80">
                RoomRent Maharashtra
              </p>
              <h1
                className="text-[clamp(2.6rem,6vw,4.8rem)] font-extrabold leading-[1.08] tracking-tight"
              >
                Find your{" "}
                <span className="gradient-text">perfect room</span>{" "}
                across Maharashtra.
              </h1>
            </div>

            <p className="text-base leading-8 text-slate-500 max-w-lg">
              Verified rooms, PGs, flats, and commercial spaces across 350+ cities in Maharashtra.
              Direct owner listings. No brokerage.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <Link href="/properties" className="landing-primary-button px-7 py-3 text-base">
                Explore Properties <ArrowRight className="size-4 shrink-0" />
              </Link>
              <Link href="/register" className="landing-secondary-button px-6">
                List your property
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center gap-5 pt-1">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="flex size-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <ShieldCheck className="size-3" />
                </span>
                <span className="font-semibold">Direct owner listings</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="flex size-5 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                  <Zap className="size-3" />
                </span>
                <span className="font-semibold">Zero brokerage</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="flex size-5 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                  <MapPin className="size-3" />
                </span>
                <span className="font-semibold">350+ cities</span>
              </div>
            </div>
          </div>

          {/* Right — floating dashboard card */}
          <div className="hidden lg:block">
            <HeroMockupCard />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CITY MARQUEE STRIP
          ═══════════════════════════════════════════════════ */}
      <section className="reveal-up" data-reveal>
        <div className="mb-4 flex items-center justify-between gap-4">
          <SectionEyebrow>Browse by City</SectionEyebrow>
          <Link
            href="/cities"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            View all cities <ChevronRight className="size-4" />
          </Link>
        </div>
        <div className="marquee-wrapper py-2">
          <div className="marquee-track">
            {marqueeItems.map((city, i) => (
              <Link
                key={`${city.name}-${i}`}
                href={`/properties?city=${encodeURIComponent(city.name)}`}
                className="city-chip"
              >
                <span className="city-chip-dot" />
                {city.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CATEGORY BENTO GRID
          ═══════════════════════════════════════════════════ */}
      <section id="properties" className="scroll-mt-32" data-reveal>
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <SectionEyebrow>Property Types</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
              Browse by <span className="gradient-text">category</span>
            </h2>
          </div>
          <Link
            href="/properties"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            All listings <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {listingCategories.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="bento-card group"
                style={{
                  "--bento-from": item.from,
                  "--bento-to": item.to,
                  "--bento-glow": item.glow,
                }}
              >
                {/* Count badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                    style={{
                      background: `${item.glow}`,
                      color: item.color,
                      border: `1px solid ${item.color}22`,
                    }}
                  >
                    {item.count}
                  </span>
                </div>

                <div className="bento-icon mb-5" style={{ color: item.color }}>
                  <Icon className="size-6" />
                </div>

                <h3 className="text-lg font-extrabold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.desc}</p>

                <div
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold transition-all duration-200 group-hover:gap-3"
                  style={{ color: item.color }}
                >
                  Browse <ChevronRight className="size-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          STATS BAND
          ═══════════════════════════════════════════════════ */}
      <section id="stats-band" className="stats-band" data-reveal>
        <div className="text-center mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-200">
            Platform at a glance
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-white md:text-4xl">
            Trusted across Maharashtra
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {platformStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-3 text-center"
                style={{
                  animation: statsVisible
                    ? `countUp 0.6s ${i * 0.12}s cubic-bezier(0.22,1,0.36,1) both`
                    : "none",
                  opacity: statsVisible ? 1 : 0,
                }}
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-white/10 border border-white/20">
                  <Icon className="size-5 text-indigo-200" />
                </div>
                <div>
                  <p className="text-4xl font-extrabold text-white">{stat.value}</p>
                  <p className="mt-1 text-sm font-semibold text-indigo-200">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SERVICE FEATURES
          ═══════════════════════════════════════════════════ */}
      <section id="services" className="scroll-mt-32" data-reveal>
        <div className="mb-6">
          <SectionEyebrow>Why RoomRent?</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
            Built for <span className="gradient-text">real seekers</span>
          </h2>
          <p className="mt-3 max-w-xl text-base leading-7 text-slate-500">
            Every feature is designed to make finding your next room fast, transparent, and effortless.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {serviceCards.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="surface-card p-6 group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className="mb-5 flex size-12 items-center justify-center rounded-[14px] border transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: `${item.accent}14`,
                    borderColor: `${item.accent}22`,
                    color: item.accent,
                  }}
                >
                  <Icon className="size-6" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-500">{item.copy}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CTA BANNER
          ═══════════════════════════════════════════════════ */}
      <section className="reveal-up" data-reveal>
        <div
          className="relative overflow-hidden rounded-[24px] px-8 py-12 md:px-14 md:py-16"
          style={{
            background: "linear-gradient(135deg, #3730a3 0%, #4f46e5 45%, #7c3aed 100%)",
            boxShadow: "0 20px 60px -16px rgba(99,102,241,0.4)",
          }}
        >
          {/* Dot grid overlay */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          {/* Glow blobs */}
          <div
            className="absolute -top-20 -right-20 size-64 rounded-full opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, #a855f7, transparent 70%)" }}
          />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-indigo-200">
                <Zap className="size-3.5" /> Property owners
              </p>
              <h2 className="text-3xl font-extrabold text-white md:text-4xl leading-tight">
                List your property and reach<br />
                thousands of verified seekers.
              </h2>
              <p className="max-w-lg text-indigo-200 text-base leading-7">
                Join 800+ active owners across Maharashtra. Set your own terms, manage leads, and get direct enquiries — no middlemen.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-white px-7 py-3.5 text-sm font-extrabold text-indigo-600 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
              >
                Get started free <ArrowRight className="size-4 shrink-0" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-[12px] border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
