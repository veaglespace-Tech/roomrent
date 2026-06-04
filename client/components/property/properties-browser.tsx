"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Building2, Filter, MapPinned, PlusCircle, Search, SlidersHorizontal } from "lucide-react";
import { FiltersSidebar } from "@/components/property/filters-sidebar";
import { PropertyCard } from "@/components/property/property-card";
import { getProperties } from "@/services/property-service";
import { Property, PropertyFilters } from "@/types";
import { getCompareIds } from "@/lib/compare-store";
import { saveSearchAlert } from "@/lib/search-alerts";

interface PropertiesBrowserProps {
  title: string;
  subtitle: string;
}

function PropertiesContent({ title, subtitle }: PropertiesBrowserProps) {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<PropertyFilters>({
    location: searchParams?.get("location") || "",
    type: (searchParams?.get("type") as PropertyFilters["type"]) || "",
    amenities: []
  });
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
      setProperties(data);
    } catch {
      setProperties([]);
      setError("Unable to load properties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProperties(filters);
  }, []);

  useEffect(() => {
    const refresh = async () => setCompareCount((await getCompareIds()).length);
    void refresh();
    window.addEventListener("roomrent-compare-updated", refresh);
    return () => window.removeEventListener("roomrent-compare-updated", refresh);
  }, [properties, filters]);

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

  return (
    <section className="page-shell py-10">
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <FiltersSidebar filters={filters} onChange={setFilters} />
        </div>
        <div>
          <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-white/80 bg-white/85 p-5 shadow-[0_28px_80px_-56px_rgba(15,23,42,0.45)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ef3d81]">Live rental search</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.02em] text-[#111827]">{title}</h1>
              <p className="mt-2 font-medium leading-7 text-[#64748b]">{subtitle}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="badge badge-lg border-none bg-[linear-gradient(135deg,rgba(239,61,129,0.12),rgba(255,122,53,0.14))] px-4 py-4 font-bold text-[#d92f71]">
                {properties.length} results
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-2xl border border-base-300 bg-white px-4 py-3 text-sm font-bold text-[#111827] shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)] lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <Filter className="size-4 text-[#ef3d81]" />
                Filters
              </button>
            </div>
          </div>

          <form
            className="mb-6 flex flex-col gap-3 rounded-[24px] border border-base-300/70 bg-white/90 p-4 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.38)] md:flex-row md:items-center"
            onSubmit={(event) => {
              event.preventDefault();
              void loadProperties(filters);
            }}
          >
            <label className="flex min-h-14 flex-1 items-center gap-3 rounded-[16px] border border-base-300/70 bg-base-100 px-4">
              <Search className="size-4 text-[#ef3d81]" />
              <input
                className="w-full bg-transparent text-sm font-medium outline-none"
                placeholder="Search city, area or locality"
                value={filters.location || ""}
                onChange={(event) => setFilters({ ...filters, location: event.target.value })}
              />
            </label>
            <button type="submit" className="landing-primary-button md:w-auto">
              Search
            </button>
          </form>

          <div className="mb-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl border border-base-300 bg-white px-4 py-3 text-sm font-bold text-[#111827] transition hover:border-[#ef3d81]/25 hover:text-[#ef3d81]"
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
              className="inline-flex items-center gap-2 rounded-2xl border border-base-300 bg-white px-4 py-3 text-sm font-bold text-[#111827] transition hover:border-[#0f9f8f]/25 hover:text-[#0f766e]"
              onClick={() => setMapViewOpen((value) => !value)}
            >
              <MapPinned className="size-4" />
              {mapViewOpen ? "Hide locality view" : "Map view"}
            </button>
            {compareCount > 0 ? (
              <Link href="/compare" className="inline-flex items-center gap-2 rounded-2xl border border-[#0f9f8f]/20 bg-[#ecfdf8] px-4 py-3 text-sm font-bold text-[#0f766e]">
                Compare {compareCount}
              </Link>
            ) : null}
            {alertNotice ? <span className="text-sm font-semibold text-emerald-600">{alertNotice}</span> : null}
          </div>

          {mapViewOpen ? (
            <div className="mb-6 overflow-hidden rounded-[28px] border border-base-300/70 bg-white/90 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.38)]">
              <div className="grid gap-4 p-5 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ef3d81]">Locality focus</p>
                    <h2 className="mt-2 text-2xl font-extrabold text-[#111827]">Fast neighborhood scan</h2>
                    <p className="mt-2 text-sm font-medium leading-7 text-[#64748b]">
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
                      <div key={item.label} className="rounded-[18px] border border-base-300 bg-base-100 p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-base-content/45">{item.label}</p>
                        <p className="mt-2 text-sm font-semibold text-[#111827]">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="overflow-hidden rounded-[24px] border border-base-300 bg-base-100">
                  <iframe
                    title="Locality map"
                    src={`https://www.openstreetmap.org/export/embed.html?search=${encodeURIComponent(filters.location || "Maharashtra rentals")}`}
                    className="h-[320px] w-full"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          ) : null}

          <div className="mb-6 flex flex-wrap gap-2">
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
                className="rounded-full border border-base-300 bg-white px-4 py-2 text-xs font-bold text-[#64748b] transition hover:border-[#ef3d81]/30 hover:text-[#ef3d81]"
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
          {error ? <p className="mb-4 text-sm text-error">{error}</p> : null}

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-96 animate-pulse rounded-[28px] bg-base-300" />
              ))}
            </div>
          ) : properties.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} onSavedChange={() => void loadProperties(filters)} />
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
          <div className="absolute inset-x-0 bottom-0 rounded-t-[32px] border border-base-300 bg-[#fffdfb] p-4 shadow-[0_-24px_80px_-30px_rgba(15,23,42,0.55)]">
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
