import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, MapPinned, MoveRight } from "lucide-react";
import { localityPages } from "@/lib/maharashtra-data";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { placeJsonLd } from "@/lib/json-ld";

export function generateStaticParams() {
  return localityPages.map((locality) => ({ slug: locality.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const locality = localityPages.find((item) => item.slug === slug);
    if (!locality) {
      return {};
    }

    return {
      title: `${locality.name} rentals`,
      description: `Browse rentals in ${locality.name}, ${locality.city}, ${locality.district}. ${locality.highlight}.`
    };
  });
}

export default async function LocalityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locality = localityPages.find((item) => item.slug === slug);

  if (!locality) {
    notFound();
  }

  const jsonLd = placeJsonLd({
    name: `${locality.name}, ${locality.city}`,
    description: `${locality.highlight}. Browse rentals in ${locality.name}, ${locality.city}, Maharashtra.`,
    url: `/localities/${locality.slug}`,
    containedIn: `${locality.city}, ${locality.district} district, Maharashtra`
  });

  return (
    <section className="page-shell py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: locality.city, href: `/cities/${locality.citySlug}` },
          { label: locality.name, href: `/localities/${locality.slug}` }
        ]}
      />

      <div className="soft-card p-8 md:p-10">
        <div className="flex flex-wrap items-center gap-3 text-sm text-base-content/70">
          <span className="rounded-full bg-[#fff1f4] px-4 py-2 text-[#ff385c]">Locality Page</span>
          <span className="rounded-full border border-base-300/70 px-4 py-2">{locality.city}</span>
          <span className="rounded-full border border-base-300/70 px-4 py-2">{locality.district}</span>
        </div>
        <h1 className="mt-5 text-4xl font-bold text-neutral md:text-5xl">Rentals in {locality.name}</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-base-content/72">
          {locality.highlight}. Browse rooms, PGs, flats and commercial spaces in {locality.name}, {locality.city}.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[
          { title: "City context", copy: locality.city, icon: Building2, href: `/cities/${locality.citySlug}` },
          { title: "District context", copy: locality.district, icon: MapPinned, href: `/districts/${locality.districtSlug}` },
          { title: "Search action", copy: "Browse live listings in this locality", icon: MoveRight, href: `/search?location=${encodeURIComponent(locality.name)}` }
        ].map((item) => {
          const Icon = item.icon;

          return (
            <Link key={item.title} href={item.href} className="soft-card p-6 transition hover:border-[#ff385c]/20">
              <Icon className="size-5 text-[#ff385c]" />
              <p className="mt-4 text-lg font-semibold text-neutral">{item.title}</p>
              <p className="mt-2 text-sm leading-7 text-base-content/68">{item.copy}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={`/search?location=${encodeURIComponent(locality.name)}`} className="btn pink-button rounded-xl px-6">
          Search {locality.name}
          <MoveRight className="size-4" />
        </Link>
        <Link href={`/cities/${locality.citySlug}`} className="btn rounded-xl border border-base-300 bg-white px-6">
          {locality.city} City Page
        </Link>
        <Link href={`/districts/${locality.districtSlug}`} className="btn rounded-xl border border-base-300 bg-white px-6">
          {locality.district} District
        </Link>
      </div>
    </section>
  );
}
