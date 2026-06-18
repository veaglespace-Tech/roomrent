import Link from "next/link";
import { ArrowRight, ChartColumn, ChevronRight, Clock3, Home, MessageSquare, Search, ShieldCheck } from "lucide-react";

const listingCategories = [
  { title: "Rooms", href: "/properties?type=ROOM", copy: "Single room and shared room inventory." },
  { title: "Flats", href: "/properties?type=FLAT", copy: "1, 2 and 3 BHK rental listings." },
  { title: "PG / Hostel", href: "/properties?type=PG", copy: "Girls and boys PG inventory." },
  { title: "Office & Shops", href: "/contact", copy: "Commercial requirements and local support." }
];

const serviceCards = [
  { icon: Search, title: "Fast search", copy: "Search by locality, budget, gender preference, furnishing, and availability." },
  { icon: MessageSquare, title: "Post requirement", copy: "Capture what you need and direct owners to the right listing request." },
  { icon: ShieldCheck, title: "Verified listings", copy: "Keep the workflow focused on direct owners, active inventory, and clean records." },
  { icon: ChartColumn, title: "Compare and save", copy: "Save alerts, compare listings, and keep shortlist actions together." }
];

const metrics = [
  { label: "Active listings", value: "2,400+" },
  { label: "Covered cities", value: "25+" },
  { label: "Saved searches", value: "Fast alerts" }
];

function SectionLabel({ children }: { children: string }) {
  return <div className="landing-eyebrow w-fit">{children}</div>;
}

function HeroMockup() {
  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-[rgba(28,183,200,0.18)] px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--rf-cyan)]">Live workspace</p>
            <p className="mt-2 text-lg font-bold">Rental operations dashboard</p>
          </div>
          <span className="pill-badge px-3 py-1 text-xs">8 active listings</span>
        </div>
      </div>
      <div className="grid gap-4 p-5 md:grid-cols-2">
        <div className="surface-card p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--rf-muted)]">Monthly rent</p>
          <p className="mt-3 text-3xl font-bold text-[var(--rf-cyan)]">Rs. 1,20,000</p>
          <p className="mt-2 text-sm text-[var(--rf-muted)]">Collected across current active properties.</p>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--rf-muted)]">Pending alerts</p>
          <p className="mt-3 text-3xl font-bold text-[var(--rf-cyan)]">12</p>
          <p className="mt-2 text-sm text-[var(--rf-muted)]">Payments, renewals, and maintenance follow-ups.</p>
        </div>
        <div className="surface-card p-4 md:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--rf-muted)]">Recent activity</p>
              <p className="mt-2 text-sm text-[var(--rf-muted)]">Tenant payment received, new property enquiry, reminder sent.</p>
            </div>
            <Link href="/properties" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--rf-cyan)]">
              Open listings
              <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="page-shell py-8 md:py-10">
      <section className="landing-hero reveal-up">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <SectionLabel>Real estate rent tracking system</SectionLabel>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--rf-cyan)]">RentFlow</p>
              <h1 className="mt-3 max-w-xl text-5xl font-bold leading-tight md:text-7xl">A professional rental platform for owners and tenants.</h1>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[var(--rf-muted)] md:text-base">
              Built for production use with a consistent light UI, clear navigation, aligned forms, responsive cards, and a focused dashboard experience.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/properties" className="landing-primary-button">
                Explore properties
                <ArrowRight className="size-4" />
              </Link>
              <Link href="/register" className="landing-secondary-button">
                Get started
              </Link>
            </div>
            <p className="text-sm uppercase tracking-[0.24em] text-[var(--rf-muted)]">Trusted rental operations for Maharashtra</p>
            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              {metrics.map((item) => (
                <div key={item.label} className="surface-card p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--rf-muted)]">{item.label}</p>
                  <p className="mt-2 text-lg font-bold text-[var(--rf-cyan)]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <HeroMockup />
        </div>
      </section>

      <section id="about" className="mt-16 scroll-mt-32 reveal-up">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <SectionLabel>About us</SectionLabel>
            <h2 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">Built around a clear rental workflow.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Home, title: "Add properties", copy: "Create listings, attach documents, and define rent details." },
              { icon: Clock3, title: "Track activity", copy: "See due payments, reminders, and owner updates in one dashboard." },
              { icon: ShieldCheck, title: "Operate consistently", copy: "Keep the system structured with standard cards, forms, and alerts." }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="surface-card p-5">
                  <span className="flex size-11 items-center justify-center border border-[rgba(15,118,110,0.18)] bg-[rgba(15,118,110,0.08)] text-[var(--rf-cyan)]">
                    <Icon className="size-5" />
                  </span>
                  <p className="mt-4 text-lg font-bold">{item.title}</p>
                  <p className="mt-3 text-sm leading-7 text-[var(--rf-muted)]">{item.copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="properties" className="mt-16 scroll-mt-32 reveal-up">
        <SectionLabel>Properties</SectionLabel>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {listingCategories.map((item) => (
            <Link key={item.title} href={item.href} className="surface-card block p-5">
              <p className="text-lg font-bold">{item.title}</p>
              <p className="mt-3 text-sm leading-7 text-[var(--rf-muted)]">{item.copy}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--rf-cyan)]">
                Browse
                <ChevronRight className="size-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="services" className="mt-16 scroll-mt-32 reveal-up">
        <SectionLabel>Services</SectionLabel>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {serviceCards.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="surface-card p-5">
                <span className="flex size-11 items-center justify-center border border-[rgba(15,118,110,0.18)] bg-[rgba(15,118,110,0.08)] text-[var(--rf-cyan)]">
                  <Icon className="size-5" />
                </span>
                <p className="mt-4 text-lg font-bold">{item.title}</p>
                <p className="mt-3 text-sm leading-7 text-[var(--rf-muted)]">{item.copy}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-16 reveal-up">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="surface-card p-6">
            <h3 className="text-2xl font-bold">Ready for production UI work.</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--rf-muted)]">
              The homepage now keeps only the sections that support a real product flow and matches the same light system used across the app.
            </p>
          </div>
          <Link href="/contact" className="landing-primary-button">
            Contact us
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
