"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FiltersSidebar } from "@/components/property/filters-sidebar";
import { PropertyCard } from "@/components/property/property-card";
import { getProperties } from "@/services/property-service";
import { Property, PropertyFilters } from "@/types";
import Link from "next/link";
import { Building2, PlusCircle } from "lucide-react";

function PropertiesContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<PropertyFilters>({
    location: searchParams?.get("location") || "",
    type: (searchParams?.get("type") as PropertyFilters["type"]) || "",
    amenities: []
  });
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProperties = async (nextFilters: PropertyFilters) => {
    try {
      setLoading(true);
      setError("");
      const data = await getProperties(nextFilters);
      setProperties(data);
    } catch {
      setProperties([]);
      setError("Unable to load properties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties(filters);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadProperties(filters);
    }, 250);
    return () => clearTimeout(timeout);
  }, [filters]);

  return (
    <section className="page-shell py-10">
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <FiltersSidebar filters={filters} onChange={setFilters} />
        <div>
          <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-white/80 bg-white/85 p-5 shadow-[0_28px_80px_-56px_rgba(15,23,42,0.45)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ef3d81]">Live rental search</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.02em] text-[#111827]">Available Properties Across Maharashtra</h1>
              <p className="mt-2 font-medium leading-7 text-[#64748b]">Explore hostels, PGs, rooms, flats, and commercial rentals with live filters and direct owner enquiry flow.</p>
            </div>
            <div className="badge badge-lg border-none bg-[linear-gradient(135deg,rgba(239,61,129,0.12),rgba(255,122,53,0.14))] px-4 py-4 font-bold text-[#d92f71]">
              {properties.length} results
            </div>
          </div>
          {error ? <p className="mb-4 text-sm text-error">{error}</p> : null}

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-96 animate-pulse rounded-[28px] bg-base-300" />
              ))}
            </div>
          ) : (
            properties.length ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} onSavedChange={() => loadProperties(filters)} />
                ))}
              </div>
            ) : (
              <div className="landing-card flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
                <div className="landing-icon mx-auto">
                  <Building2 className="size-5" />
                </div>
                <h2 className="mt-6 text-3xl font-extrabold tracking-[-0.02em] text-[#111827]">No properties published yet</h2>
                <p className="mt-3 max-w-xl text-sm font-medium leading-7 text-[#64748b]">
                  Seeded records are removed. Real listings will appear here after owners publish properties or an approved data source is connected.
                </p>
                <Link href="/register" className="landing-primary-button mt-7 w-fit">
                  <PlusCircle className="size-4" />
                  Post Free Ad
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<section className="page-shell py-10">Loading properties...</section>}>
      <PropertiesContent />
    </Suspense>
  );
}
