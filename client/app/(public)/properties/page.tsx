"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FiltersSidebar } from "@/components/property/filters-sidebar";
import { PropertyCard } from "@/components/property/property-card";
import { getProperties } from "@/services/property-service";
import { Property, PropertyFilters } from "@/types";

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
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Available Properties in Jaipur</h1>
              <p className="mt-2 text-base-content/70">Explore rooms, PGs, hostels, flats, and rental options with live filters and direct owner enquiry flow.</p>
            </div>
            <div className="badge badge-lg border-none bg-secondary/10 px-4 py-4 text-secondary">
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
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} onSavedChange={() => loadProperties(filters)} />
              ))}
            </div>
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
