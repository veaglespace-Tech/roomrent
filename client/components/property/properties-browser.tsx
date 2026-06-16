"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowDownUp, Building2, Filter, MapPinned, PlusCircle, SlidersHorizontal } from "lucide-react";
import { FiltersSidebar } from "@/components/property/filters-sidebar";
import { PropertyCard } from "@/components/property/property-card";
import { SearchSuggestions } from "@/components/property/search-suggestions";
import dynamic from "next/dynamic";
const MapView = dynamic(
  () => import("@/components/property/map-view").then((mod) => mod.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse rounded-[24px] bg-base-300" style={{ height: "320px" }} />
    ),
  }
);
import { getProperties } from "@/services/property-service";
import { Property, PropertyFilters } from "@/types";
import { getCompareIds } from "@/lib/compare-store";
import { saveSearchAlert } from "@/lib/search-alerts";

interface PropertiesBrowserProps {
  title: string;
  subtitle: string;
}

function parseFiltersFromParams(searchParams: ReturnType<typeof useSearchParams>): PropertyFilters {
  return {
    location: searchParams?.get("location") || searchParams?.get("area") || "",
    minPrice: searchParams?.get("minPrice") || "",
    maxPrice: searchParams?.get("maxPrice") || "",
    type: (searchParams?.get("type") as PropertyFilters["type"]) || "",
    gender: (searchParams?.get("gender") as PropertyFilters["gender"]) || "",
    furnishedStatus: (searchParams?.get("furnishedStatus") as PropertyFilters["furnishedStatus"]) || "",
    sharingType: searchParams?.get("sharingType") || "",
    listedByType: (searchParams?.get("listedByType") as PropertyFilters["listedByType"]) || "",
    amenities: searchParams?.get("amenities") ? searchParams.get("amenities")!.split(",").map((item) => item.trim()).filter(Boolean) : [],
    sortBy: (searchParams?.get("sortBy") as PropertyFilters["sortBy"]) || "",
    page: 0,
    size: 24
  };
}

function PropertiesContent({ title, subtitle }: PropertiesBrowserProps) {
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams?.toString() || "";
  const [filters, setFilters] = useState<PropertyFilters>(() => parseFiltersFromParams(searchParams));
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mapViewOpen, setMapViewOpen] = useState(false);
  const [compareCount, setCompareCount] = useState(0);
  const [alertNotice, setAlertNotice] = useState("");

  const loadProperties = async (nextFilters: PropertyFilters) => {
    try {
      setLoading(true);
      setError("");
      const data = await getProperties(nextFilters);
      setProperties(data.content);
    } catch {
      setProperties([]);
      setError("Unable to load properties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFilters(parseFiltersFromParams(searchParams));
  }, [searchParamsKey]);

  useEffect(() => {
    const refresh = async () => setCompareCount((await getCompareIds()).length);
    void refresh();
    window.addEventListener("roomrent-compare-updated", refresh);
    return () => window.removeEventListener("roomrent-compare-updated", refresh);
  }, []);

  useEffect(() => {
    if (!alertNotice) {
      return;
    }

    const timeout = setTimeout(() => setAlertNotice(""), 2400);
    return () => clearTimeout(timeout);
  }, [alertNotice]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      void loadProperties(filters);
    }, 250);
    return () => clearTimeout(timeout);
  }, [filters]);

  const sortedProperties = [...properties].sort((a, b) => {
    if (filters.sortBy === "price_asc") return a.price - b.price;
    if (filters.sortBy === "price_desc") return b.price - a.price;
    if (filters.sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  });

  return (
    <section className="page-shell py-8 lg:py-10">
      <div className="grid items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)] 2xl:grid-cols-[336px_minmax(0,1fr)]">
        <div className="hidden min-w-0 lg:block lg:sticky lg:top-24 lg:self-start">
          <FiltersSidebar filters={filters} onChange={setFilters} />
        </div>
        <div className="min-w-0">
          <div className="mb-6 space-y-4 border-b border-[rgba(21,197,206,0.2)] pb-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--rf-cyan)]">Live rental search</p>
                <h1 className="mt-2 text-3xl font-bold tracking-wide">{title}</h1>
                <p className="mt-2 text-sm leading-7 text-[var(--rf-muted)]">{subtitle}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="border border-[rgba(21,197,206,0.28)] px-4 py-3 text-sm font-bold text-[var(--rf-cyan)]">
                  {properties.length} results
                </div>
                <button
                  type="button"
                  className="landing-secondary-button lg:hidden"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <Filter className="size-4" />
                  Filters
                </button>
              </div>
            </div>
          </div>

          <form
            className="mb-6 flex flex-col gap-3 border border-[rgba(21,197,206,0.22)] bg-[rgba(8,15,19,0.82)] p-3 shadow-[0_24px_60px_-48px_rgba(0,0,0,0.38)] md:flex-row md:items-center"
            onSubmit={(event) => {
              event.preventDefault();
              void loadProperties(filters);
            }}
          >
            <SearchSuggestions
              value={filters.location || ""}
              onChange={(value) => setFilters({ ...filters, location: value })}
            />
            <button type="submit" className="landing-primary-button md:w-auto">
              Search
            </button>
          </form>

          <div className="mb-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="landing-secondary-button"
              onClick={async () => {
                const label = [filters.location, filters.type, filters.gender].filter(Boolean).join(" | ") || "Saved search";
                try {
                  await saveSearchAlert(label, filters);
                  setAlertNotice("Search alert saved.");
                } catch {
                  setAlertNotice("Please login to save search alerts.");
                }
              }}
            >
              <SlidersHorizontal className="size-4" />
              Save search alert
            </button>
            <button
              type="button"
              className="landing-secondary-button"
              onClick={() => setMapViewOpen((value) => !value)}
            >
              <MapPinned className="size-4" />
              {mapViewOpen ? "Hide map view" : "Map view"}
            </button>
            {compareCount > 0 ? (
              <Link href="/compare" className="landing-primary-button">
                Compare {compareCount}
              </Link>
            ) : null}
            {alertNotice ? <span className="text-sm font-semibold text-[var(--rf-success)]">{alertNotice}</span> : null}
          </div>

          {mapViewOpen ? (
            <div className="mb-6 overflow-hidden border border-[rgba(21,197,206,0.22)] bg-[rgba(8,15,19,0.82)]">
              <div className="grid gap-4 p-5 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--rf-cyan)]">Locality focus</p>
                    <h2 className="mt-2 text-2xl font-bold">Fast neighborhood scan</h2>
                    <p className="mt-2 text-sm leading-7 text-[var(--rf-muted)]">
                      Use this as a locality-first view for your current search. It stays lightweight and requires no API key.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      { label: "Nearby transit", value: "Station / bus stop access" },
                      { label: "Demand level", value: "High if rent matches budget" },
                      { label: "Trust signal", value: "Verified listing badge shown" },
                      { label: "Quick action", value: "Call or WhatsApp from detail page" }
                    ].map((item) => (
                      <div key={item.label} className="border border-[rgba(21,197,206,0.18)] p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--rf-muted)]">{item.label}</p>
                        <p className="mt-2 text-sm font-semibold text-[var(--rf-ink)]">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="overflow-hidden border border-[rgba(21,197,206,0.18)]">
                  <MapView properties={properties} height="320px" />
                </div>
              </div>
            </div>
          ) : null}

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Under 10k", minPrice: "", maxPrice: "10000" },
                { label: "Under 15k", minPrice: "", maxPrice: "15000" },
                { label: "Flats", type: "FLAT" as PropertyFilters["type"] },
                { label: "PG", type: "PG" as PropertyFilters["type"] },
                { label: "Boys", gender: "BOYS" as PropertyFilters["gender"] },
                { label: "Girls", gender: "GIRLS" as PropertyFilters["gender"] }
              ].map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  className="pill-badge px-4 py-2 text-xs"
                  onClick={() =>
                    setFilters((current) => ({
                      ...current,
                      ...(chip.minPrice !== undefined ? { minPrice: chip.minPrice } : {}),
                      ...(chip.maxPrice !== undefined ? { maxPrice: chip.maxPrice } : {}),
                      ...(chip.type ? { type: chip.type } : {}),
                      ...(chip.gender ? { gender: chip.gender } : {})
                    }))
                  }
                >
                  {chip.label}
                </button>
              ))}
            </div>
            <select
              className="form-select min-h-11 w-auto px-4 text-sm"
              value={filters.sortBy || ""}
              onChange={(event) => setFilters({ ...filters, sortBy: event.target.value as PropertyFilters["sortBy"] })}
            >
              <option value="">Sort by</option>
              <option value="newest">Newest first</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          {error ? <p className="mb-4 text-sm text-error">{error}</p> : null}

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-96 animate-pulse border border-[rgba(21,197,206,0.18)] bg-[rgba(8,15,19,0.82)]" />
              ))}
            </div>
          ) : sortedProperties.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
              {sortedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} onSavedChange={() => void loadProperties(filters)} />
              ))}
            </div>
          ) : (
            <div className="landing-card flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
              <div className="landing-icon mx-auto">
                <Building2 className="size-5" />
              </div>
              <h2 className="mt-6 text-3xl font-bold">No properties published yet</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--rf-muted)]">
                Seeded records are removed. Real listings will appear here after owners publish properties or an approved data source is connected.
              </p>
              <Link href="/register" className="landing-primary-button mt-7 w-fit">
                <PlusCircle className="size-4" />
                Choose Listing Plan
              </Link>
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-black/45"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-[18px] border border-[rgba(21,197,206,0.22)] bg-[rgba(8,15,19,0.98)] p-4 shadow-[0_-24px_80px_-30px_rgba(0,0,0,0.55)]">
            <FiltersSidebar
              filters={filters}
              onChange={setFilters}
              mobile
              onClose={() => setMobileFiltersOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function PropertiesBrowser(props: PropertiesBrowserProps) {
  return (
    <Suspense fallback={<section className="page-shell py-10">Loading properties...</section>}>
      <PropertiesContent {...props} />
    </Suspense>
  );
}
