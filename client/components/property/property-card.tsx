"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
      // Save action stays silent in list context.
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="card light-bento-card group overflow-hidden p-0 hover:-translate-y-1">
      <figure className="relative h-64">
        <Image
          src={property.imageUrls[0] || "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"}
          alt={property.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.0)_38%,rgba(15,23,42,0.68)_100%)]" />
        <div className="absolute left-4 top-4 rounded-full border border-white/55 bg-white/90 px-3 py-1 text-xs font-bold text-[var(--rf-cyan)] shadow-sm backdrop-blur">
          {property.availableFromDate || "Available now"}
        </div>
        <button
          className="btn btn-circle btn-sm absolute right-4 top-4 border border-white/60 bg-white/95 text-[var(--rf-ink)] shadow-sm transition hover:scale-105 hover:border-[var(--rf-cyan)] hover:text-[var(--rf-cyan)]"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Heart className={`size-4 ${property.saved ? "fill-current text-secondary" : ""}`} />
        </button>
      </figure>
      <div className="card-body relative gap-4 p-5">
        <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
            <div className="pill-badge">{property.type}</div>
            {property.category ? <div className="pill-badge">{property.category}</div> : null}
            {property.sharingType ? <div className="pill-badge">{property.sharingType}</div> : null}
            <div className="pill-badge">
              <Star className="mr-1 size-3.5" />
              Verified listing
            </div>
          </div>
          <h3 className="line-clamp-2 text-xl font-semibold leading-snug">{property.title}</h3>
        </div>
        <div>
          <p className="bg-[linear-gradient(135deg,#0f766e,#334155)] bg-clip-text text-3xl font-extrabold leading-none text-transparent">{displayPrice}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.15em] text-base-content/55">{property.price > 0 ? "monthly rent" : "source price"}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-base-content/70">
          <MapPin className="size-4" />
          {[property.areaLocality, property.city, property.district].filter(Boolean).join(", ") || property.location}
        </div>
        <p className="line-clamp-2 text-sm text-base-content/70">{property.description}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-md border border-base-300/60 bg-white/78 px-3 py-2 text-xs text-base-content/70 shadow-[0_14px_28px_-24px_rgba(15,23,42,0.5)]">
            <div className="flex items-center gap-2">
              <Wallet className="size-3.5 text-primary" />
              Deposit
            </div>
            <p className="mt-1 font-semibold text-base-content">{property.securityDeposit ? `Rs. ${property.securityDeposit}` : "On request"}</p>
          </div>
          <div className="rounded-md border border-base-300/60 bg-white/78 px-3 py-2 text-xs text-base-content/70 shadow-[0_14px_28px_-24px_rgba(15,23,42,0.5)]">
            <div className="flex items-center gap-2">
              <BedDouble className="size-3.5 text-primary" />
              Furnishing
            </div>
            <p className="mt-1 font-semibold text-base-content">{property.furnishedStatus ? property.furnishedStatus.replaceAll("_", " ") : "Not specified"}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {property.amenities.slice(0, 3).map((amenity) => (
            <span key={amenity} className="rounded-md border border-base-300/60 bg-base-200/70 px-3 py-1 text-xs text-base-content/70">
              {amenity}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-base-300/60 pt-4">
          <div className="flex items-center gap-2 text-sm text-base-content/70">
            <ShieldCheck className="size-4 text-primary" />
            {property.availabilityStatus || "AVAILABLE"} | {property.gender}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <CompareButton propertyId={property.id} compact />
            <Link href={`/property/${property.id}`} className="glow-button min-h-11 px-5">
              View Details
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
