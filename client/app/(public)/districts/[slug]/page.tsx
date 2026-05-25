import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, MoveRight } from "lucide-react";
import { districtPages } from "@/lib/maharashtra-data";

export function generateStaticParams() {
  return districtPages.map((district) => ({ slug: district.slug }));
}

export default async function DistrictPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const district = districtPages.find((item) => item.slug === slug);

  if (!district) {
    notFound();
  }

  return (
    <section className="page-shell py-10">
      <div className="rounded-[36px] border border-base-300 bg-base-100 p-8 shadow-card">
        <span className="rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary">District Page</span>
        <h1 className="mt-5 text-4xl font-extrabold text-neutral md:text-5xl">{district.name} Rental Marketplace</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-base-content/72">
          This district template supports district-wise SEO, city grouping, listing discovery, ingestion coverage,
          and future district landing pages across Maharashtra.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {["Hostels", "PG Accommodation", "Rooms & Sharing", "Flats & Commercial"].map((item) => (
          <div key={item} className="panel p-6">
            <Building2 className="size-5 text-primary" />
            <p className="mt-4 text-lg font-semibold">{item}</p>
            <p className="mt-2 text-sm text-base-content/68">District-specific category inventory block.</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <Link href="/properties" className="btn btn-primary rounded-full">
          Browse District Listings
          <MoveRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
