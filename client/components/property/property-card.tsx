"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, BedDouble, Heart, MapPin, ShieldCheck, Star, Wallet } from "lucide-react";
import { toggleSaveProperty } from "@/services/user-service";
import { Property } from "@/types";
import { CompareButton } from "@/components/property/compare-button";

interface PropertyCardProps {
  property: Property;
  onSavedChange?: () => void;
}

export function PropertyCard({ property, onSavedChange }: PropertyCardProps) {
  const [isSaving, setIsSaving] = useState(false);
  const displayPrice = property.price > 0 ? `Rs. ${property.price}` : "On request";

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await toggleSaveProperty(property.id);
      onSavedChange?.();
    } catch {
      // Silent in list context.
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="surface-card group overflow-hidden p-0">
      <figure className="relative h-64">
        <Image
          src={property.imageUrls[0] || "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"}
          alt={property.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          loading="lazy"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0)_44%,rgba(15,23,42,0.7)_100%)]" />
        <div className="absolute left-4 top-4 rounded-full border border-white/55 bg-white/90 px-3 py-1 text-xs font-bold text-[var(--rf-cyan)] shadow-sm backdrop-blur">
          {property.availableFromDate || "Available now"}
        </div>
        <button
          className="mobile-menu-button absolute right-4 top-4 size-10 rounded-full bg-white/95"
          onClick={handleSave}
          disabled={isSaving}
          aria-label="Save property"
        >
          <Heart className={`size-4 ${property.saved ? "fill-current text-[var(--rf-cyan)]" : ""}`} />
        </button>
      </figure>

      <div className="space-y-4 p-5">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <div className="pill-badge">{property.type}</div>
            {property.category ? <div className="pill-badge">{property.category}</div> : null}
            {property.sharingType ? <div className="pill-badge">{property.sharingType}</div> : null}
            <div className="pill-badge">
              <Star className="mr-1 size-3.5" />
              Verified
            </div>
          </div>
          <h3 className="line-clamp-2 text-xl font-semibold leading-snug">{property.title}</h3>
        </div>

        <div>
          <p className="text-3xl font-extrabold leading-none text-[var(--rf-cyan)]">{displayPrice}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.15em] text-[var(--rf-muted)]">
            {property.price > 0 ? "Monthly rent" : "Source price"}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-[var(--rf-muted)]">
          <MapPin className="size-4" />
          {[property.areaLocality, property.city, property.district].filter(Boolean).join(", ") || property.location}
        </div>

        <p className="line-clamp-2 text-sm text-[var(--rf-muted)]">{property.description}</p>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="surface-card p-3 text-xs text-[var(--rf-muted)]">
            <div className="flex items-center gap-2">
              <Wallet className="size-3.5 text-[var(--rf-cyan)]" />
              Deposit
            </div>
            <p className="mt-1 font-semibold text-[var(--rf-ink)]">{property.securityDeposit ? `Rs. ${property.securityDeposit}` : "On request"}</p>
          </div>
          <div className="surface-card p-3 text-xs text-[var(--rf-muted)]">
            <div className="flex items-center gap-2">
              <BedDouble className="size-3.5 text-[var(--rf-cyan)]" />
              Furnishing
            </div>
            <p className="mt-1 font-semibold text-[var(--rf-ink)]">{property.furnishedStatus ? property.furnishedStatus.replaceAll("_", " ") : "Not specified"}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {property.amenities.slice(0, 3).map((amenity) => (
            <span key={amenity} className="sidebar-chip">
              {amenity}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(15,23,42,0.08)] pt-4">
          <div className="flex items-center gap-2 text-sm text-[var(--rf-muted)]">
            <ShieldCheck className="size-4 text-[var(--rf-cyan)]" />
            {property.availabilityStatus || "AVAILABLE"} | {property.gender}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <CompareButton propertyId={property.id} compact />
            <Link href={`/property/${property.id}`} className="landing-primary-button min-h-11 px-5">
              View Details
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
