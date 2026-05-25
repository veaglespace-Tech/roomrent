import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPinned, MoveRight } from "lucide-react";
import { cityPages, categoryBlueprint } from "@/lib/maharashtra-data";

export function generateStaticParams() {
  return cityPages.map((city) => ({ slug: city.slug }));
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = cityPages.find((item) => item.slug === slug);

  if (!city) {
    notFound();
  }

  return (
    <section className="page-shell py-10">
      <div className="rounded-[36px] border border-base-300 bg-base-100 p-8 shadow-card">
        <div className="flex flex-wrap items-center gap-3 text-sm text-base-content/70">
          <span className="rounded-full bg-primary/10 px-4 py-2 text-primary">City Page</span>
          <span className="rounded-full border border-base-300 px-4 py-2">{city.district} district</span>
        </div>
        <h1 className="mt-5 text-4xl font-extrabold text-neutral md:text-5xl">Rentals in {city.city}, Maharashtra</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-base-content/72">
          {city.highlight}. This page is the Maharashtra rollout template for city-specific listings, SEO content,
          location filters, map search, and city onboarding.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {categoryBlueprint.slice(0, 3).map((group) => (
            <div key={group.label} className="rounded-[24px] bg-base-200/60 p-5">
              <p className="font-semibold">{group.label}</p>
              <p className="mt-2 text-sm text-base-content/68">{group.items.join(", ")}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[
          "Browse live listings",
          "Map-based locality search",
          "Owner and broker onboarding",
          "District and city SEO blocks",
          "Verified lead capture",
          "Commercial and residential taxonomy"
        ].map((item) => (
          <div key={item} className="panel p-6">
            <MapPinned className="size-5 text-primary" />
            <p className="mt-4 text-lg font-semibold">{item}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <Link href="/properties" className="btn btn-primary rounded-full">
          Explore Properties
          <MoveRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
