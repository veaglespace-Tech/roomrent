import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, MoveRight } from "lucide-react";
import { districtPages, majorCitiesByDistrict } from "@/lib/maharashtra-data";

export function generateStaticParams() {
  return districtPages.map((district) => ({ slug: district.slug }));
}

export default async function DistrictPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const district = districtPages.find((item) => item.slug === slug);

  if (!district) {
    notFound();
  }

  const districtCities = majorCitiesByDistrict[district.name] || [];

  return (
    <section className="page-shell py-10">
      <div className="soft-card p-8 md:p-10">
        <span className="rounded-full bg-[#fff1f4] px-4 py-2 text-sm font-medium text-[#ff385c]">District Guide</span>
        <h1 className="mt-5 text-4xl font-bold text-neutral md:text-5xl">{district.name} rental marketplace</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-base-content/70">
          Browse a cleaner district-level rental structure for {district.name}. We keep the landing experience curated,
          while district pages hold the broader Maharashtra coverage without cluttering the homepage.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {["Hostels", "PG Accommodation", "Rooms & Sharing", "Flats & Commercial"].map((item) => (
          <div key={item} className="soft-card p-6">
            <Building2 className="size-5 text-[#ff385c]" />
            <p className="mt-4 text-lg font-semibold text-neutral">{item}</p>
            <p className="mt-2 text-sm leading-7 text-base-content/68">Browse {item.toLowerCase()} options available in {district.name}.</p>
          </div>
        ))}
      </div>

      <div className="mt-8 soft-card p-8">
        <h2 className="text-2xl font-semibold text-neutral">Main cities in {district.name}</h2>
        <p className="mt-2 text-sm text-base-content/68">District coverage stays here so the landing page remains clean while all major markets stay accessible.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {districtCities.length > 0 ? (
            districtCities.map((city) => (
              <Link
                key={city.slug}
                href={`/cities/${city.slug}`}
                className="rounded-xl border border-base-300/70 bg-white px-4 py-3 text-sm font-medium text-base-content/76 transition hover:border-[#ff385c]/30 hover:text-neutral"
              >
                {city.name}
              </Link>
            ))
          ) : (
            <span className="text-sm text-base-content/60">City pages will be added for this district.</span>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Link href="/properties" className="btn pink-button rounded-xl px-6">
          Browse District Listings
          <MoveRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
