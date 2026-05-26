import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPinned, MoveRight } from "lucide-react";
import { categoryBlueprint, cityPages } from "@/lib/maharashtra-data";

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
      <div className="soft-card p-8 md:p-10">
        <div className="flex flex-wrap items-center gap-3 text-sm text-base-content/70">
          <span className="rounded-full bg-[#fff1f4] px-4 py-2 text-[#ff385c]">City Page</span>
          <span className="rounded-full border border-base-300/70 px-4 py-2">{city.district} district</span>
        </div>
        <h1 className="mt-5 text-4xl font-bold text-neutral md:text-5xl">Rentals in {city.city}, Maharashtra</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-base-content/72">
          {city.highlight}. This city page is where full local coverage lives, while the homepage remains focused and uncluttered.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {categoryBlueprint.slice(0, 3).map((group) => (
            <div key={group.label} className="rounded-[20px] bg-base-200/60 p-5">
              <p className="font-semibold text-neutral">{group.label}</p>
              <p className="mt-2 text-sm leading-7 text-base-content/68">{group.items.join(", ")}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[
          "Browse live listings",
          "Map-based locality search",
          "Owner and broker onboarding",
          "Lead capture and contact flow",
          "Commercial and residential options",
          "City-specific search filters"
        ].map((item) => (
          <div key={item} className="soft-card p-6">
            <MapPinned className="size-5 text-[#ff385c]" />
            <p className="mt-4 text-lg font-semibold text-neutral">{item}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link href="/properties" className="btn pink-button rounded-xl px-6">
          Explore Properties
          <MoveRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
