import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, MapPinned, MoveRight } from "lucide-react";
import { categoryBlueprint, cityPages, localityPages, districtPages } from "@/lib/maharashtra-data";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { placeJsonLd } from "@/lib/json-ld";

export function generateStaticParams() {
  return cityPages.map((city) => ({ slug: city.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const city = cityPages.find((item) => item.slug === slug);
    if (!city) {
      return {};
    }

    return {
      title: `Rentals in ${city.city}`,
      description: `${city.highlight}. Explore city-level rental demand, localities and property categories in ${city.city}, Maharashtra.`
    };
  });
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = cityPages.find((item) => item.slug === slug);

  if (!city) {
    notFound();
  }

  const cityLocalities = localityPages.filter((item) => item.citySlug === city.slug).slice(0, 6);
  const districtSlug = districtPages.find((d) => d.name === city.district)?.slug || "";

  const jsonLd = placeJsonLd({
    name: `${city.city}, Maharashtra`,
    description: `${city.highlight}. Explore rental demand, localities and property categories in ${city.city}.`,
    url: `/cities/${city.slug}`,
    containedIn: `${city.district} district, Maharashtra`
  });

  return (
    <section className="page-shell py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: "Cities", href: "/properties" },
          { label: city.city, href: `/cities/${city.slug}` }
        ]}
      />

      <div className="soft-card p-8 md:p-10">
        <div className="flex flex-wrap items-center gap-3 text-sm text-base-content/70">
          <span className="rounded-full bg-[#fff1f4] px-4 py-2 text-[#ff385c]">City Page</span>
          <span className="rounded-full border border-base-300/70 px-4 py-2">{city.district} district</span>
        </div>
        <h1 className="mt-5 text-4xl font-bold text-neutral md:text-5xl">Rentals in {city.city}, Maharashtra</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-base-content/72">
          {city.highlight}. Browse rooms, PGs, flats and commercial spaces across {city.city} with city-level search filters.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/search?location=${encodeURIComponent(city.city)}`} className="btn pink-button rounded-xl px-6">
            Search {city.city}
            <MoveRight className="size-4" />
          </Link>
          <Link href={`/districts/${districtSlug}`} className="btn rounded-xl border border-base-300 bg-white px-6">
            {city.district} District
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {categoryBlueprint.slice(0, 3).map((group) => (
            <Link key={group.label} href={`/search?location=${encodeURIComponent(city.city)}&type=${group.label === "Hostels" ? "HOSTEL" : group.label === "PG Accommodation" ? "PG" : "ROOM"}`} className="rounded-[20px] bg-base-200/60 p-5 transition hover:bg-base-200/90">
              <p className="font-semibold text-neutral">{group.label}</p>
              <p className="mt-2 text-sm leading-7 text-base-content/68">{group.items.join(", ")}</p>
            </Link>
          ))}
        </div>
      </div>

      {cityLocalities.length > 0 ? (
        <div className="mt-8 soft-card p-8">
          <div className="flex items-center gap-3">
            <Building2 className="size-5 text-[#ff385c]" />
            <h2 className="text-2xl font-semibold text-neutral">Featured localities in {city.city}</h2>
          </div>
          <p className="mt-2 text-sm text-base-content/68">
            Explore rental demand by locality for more targeted results in {city.city}.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {cityLocalities.map((locality) => (
              <Link
                key={locality.slug}
                href={`/localities/${locality.slug}`}
                className="rounded-xl border border-base-300/70 bg-white px-4 py-3 text-sm font-medium text-base-content/76 transition hover:border-[#ff385c]/30 hover:text-neutral"
              >
                {locality.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[
          { title: "Browse live listings", icon: Building2, desc: `Active rental listings in ${city.city}` },
          { title: "Map-based locality search", icon: MapPinned, desc: "Visual neighbourhood search" },
          { title: "Owner and broker onboarding", icon: Building2, desc: "Publish your property directly" },
          { title: "Lead capture and contact flow", icon: Building2, desc: "Connect with owners instantly" },
          { title: "Commercial and residential options", icon: Building2, desc: "Shops, offices and homes" },
          { title: "City-specific search filters", icon: MapPinned, desc: `Filters tuned for ${city.city}` }
        ].map((item) => (
          <div key={item.title} className="soft-card p-6">
            <item.icon className="size-5 text-[#ff385c]" />
            <p className="mt-4 text-lg font-semibold text-neutral">{item.title}</p>
            <p className="mt-2 text-sm text-base-content/60">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link href={`/search?location=${encodeURIComponent(city.city)}`} className="btn pink-button rounded-xl px-6">
          Explore Properties in {city.city}
          <MoveRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}

