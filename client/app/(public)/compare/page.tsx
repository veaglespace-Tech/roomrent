"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import { getPropertyById } from "@/services/property-service";
import { clearCompareIds, getCompareIds, removeCompared } from "@/lib/compare-store";
import { Property } from "@/types";

export default function ComparePage() {
  const [properties, setProperties] = useState<Property[]>([]);

  const load = async () => {
    const ids = await getCompareIds(true);
    if (ids.length === 0) {
      setProperties([]);
      return;
    }

    try {
      const data = await Promise.all(ids.map((id) => getPropertyById(id)));
      setProperties(data);
    } catch {
      setProperties([]);
    }
  };

  useEffect(() => {
    void load();
    const refresh = () => void load();
    window.addEventListener("roomrent-compare-updated", refresh);
    return () => window.removeEventListener("roomrent-compare-updated", refresh);
  }, []);

  if (properties.length === 0) {
    return (
      <section className="page-shell py-12">
        <div className="panel flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--rf-cyan)]">Compare</p>
          <h1 className="mt-3 text-3xl font-extrabold text-[var(--rf-ink)]">No properties selected yet</h1>
          <p className="mt-3 max-w-xl text-sm font-medium leading-7 text-[var(--rf-muted)]">
            Add listings to compare from search cards or property details. You can compare up to 3 properties side by side.
          </p>
          <Link href="/search" className="landing-primary-button mt-7">
            <ArrowLeft className="size-4" />
            Go back to search
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--rf-cyan)]">Compare</p>
          <h1 className="mt-2 text-3xl font-extrabold text-[var(--rf-ink)]">Side by side listing comparison</h1>
          <p className="mt-2 text-sm font-medium text-[var(--rf-muted)]">Review price, furnishing, location, and availability without opening tabs.</p>
        </div>
        <button
          type="button"
          className="rounded-2xl border border-[rgba(15,23,42,0.1)] bg-white px-4 py-3 text-sm font-bold text-[var(--rf-ink)] transition hover:border-[rgba(15,118,110,0.28)] hover:text-[var(--rf-cyan)]"
          onClick={() => {
            void clearCompareIds().then(() => setProperties([]));
          }}
        >
          Clear compare
        </button>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-[rgba(15,23,42,0.1)] bg-white shadow-[0_24px_70px_-48px_rgba(15,23,42,0.38)]">
        <div className="grid gap-4 border-b border-base-300 bg-base-100 p-4 md:grid-cols-3">
          {properties.map((property) => (
            <div key={property.id} className="overflow-hidden rounded-[22px] border border-[rgba(15,23,42,0.1)] bg-white">
              <div className="relative h-52">
                <Image src={property.imageUrls[0] || "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"} alt={property.title} fill className="object-cover" />
              </div>
              <div className="space-y-3 p-4">
                <div className="flex flex-wrap gap-2">
                  <span className="pill-badge border-[rgba(15,118,110,0.18)] bg-[rgba(15,118,110,0.08)] text-[var(--rf-cyan)]">{property.type}</span>
                  <span className="pill-badge border-[rgba(51,65,85,0.18)] bg-[rgba(51,65,85,0.06)] text-[var(--rf-accent)]">Verified listing</span>
                </div>
                <h2 className="text-lg font-bold text-[var(--rf-ink)]">{property.title}</h2>
                <p className="text-sm text-[var(--rf-muted)]">{[property.areaLocality, property.city, property.district].filter(Boolean).join(", ") || property.location}</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-extrabold text-[var(--rf-cyan)]">Rs. {property.price}</p>
                  <button
                    type="button"
                    className="rounded-xl border border-[rgba(15,23,42,0.1)] bg-white px-3 py-2 text-xs font-bold text-[var(--rf-ink)] hover:border-[rgba(15,118,110,0.28)] hover:text-[var(--rf-cyan)]"
                    onClick={async () => {
                      await removeCompared(property.id);
                      await load();
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-0 md:grid-cols-3">
          {[
            { label: "Deposit", render: (property: Property) => property.securityDeposit ? `Rs. ${property.securityDeposit}` : "On request" },
            { label: "Availability", render: (property: Property) => property.availabilityStatus || "AVAILABLE" },
            { label: "Furnishing", render: (property: Property) => property.furnishedStatus ? property.furnishedStatus.replaceAll("_", " ") : "Not specified" },
            { label: "Preference", render: (property: Property) => property.gender },
            { label: "Listed by", render: (property: Property) => property.listedByType || "OWNER" },
            { label: "Available from", render: (property: Property) => property.availableFromDate || "Immediate" },
            { label: "Amenities", render: (property: Property) => property.amenities.slice(0, 4).join(", ") || "No amenities" },
            { label: "Owner", render: (property: Property) => property.owner.name }
          ].map((row) => (
            <div key={row.label} className="border-t border-base-300 md:contents">
              <div className="border-b border-base-300 bg-base-100 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-base-content/50 md:border-b-0 md:border-r">
                {row.label}
              </div>
              {properties.map((property) => (
                <div key={`${row.label}-${property.id}`} className="border-b border-base-300 px-4 py-3 text-sm font-semibold text-[var(--rf-ink)] md:border-b-0 md:border-r">
                  {row.render(property)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
