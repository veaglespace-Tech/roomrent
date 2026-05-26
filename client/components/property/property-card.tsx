"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BedDouble, Heart, MapPin, ShieldCheck, Wallet } from "lucide-react";
import { toggleSaveProperty } from "@/services/user-service";
import { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
  onSavedChange?: () => void;
}

export function PropertyCard({ property, onSavedChange }: PropertyCardProps) {
  const [isSaving, setIsSaving] = useState(false);

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
    <div className="card overflow-hidden rounded-[28px] border border-base-300/60 bg-white shadow-[0_26px_60px_-38px_rgba(15,23,42,0.32)] transition duration-200 hover:-translate-y-1.5 hover:shadow-[0_35px_80px_-38px_rgba(15,23,42,0.4)]">
      <figure className="relative h-64">
        <Image
          src={property.imageUrls[0] || "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"}
          alt={property.title}
          fill
          className="object-cover"
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-green-700 shadow-sm">
          {property.availableFromDate || "Available now"}
        </div>
        <button
          className="btn btn-circle btn-sm absolute right-4 top-4 border-none bg-base-100/90"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Heart className={`size-4 ${property.saved ? "fill-current text-secondary" : ""}`} />
        </button>
      </figure>
      <div className="card-body gap-4 p-5">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <div className="badge border-none bg-green-50 px-3 text-green-700">{property.type}</div>
            {property.category ? <div className="badge border-none bg-pink-50 px-3 text-[#d92f71]">{property.category}</div> : null}
            {property.sharingType ? <div className="badge border-none bg-base-200 px-3 text-base-content/70">{property.sharingType}</div> : null}
          </div>
          <h3 className="line-clamp-2 text-xl font-semibold leading-snug">{property.title}</h3>
        </div>
        <div>
          <p className="text-3xl font-bold leading-none text-[#d92f71]">Rs. {property.price}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.15em] text-base-content/55">monthly rent</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-base-content/70">
          <MapPin className="size-4" />
          {[property.areaLocality, property.city, property.district].filter(Boolean).join(", ") || property.location}
        </div>
        <p className="line-clamp-2 text-sm text-base-content/70">{property.description}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-2xl bg-base-200/70 px-3 py-2 text-xs text-base-content/70">
            <div className="flex items-center gap-2">
              <Wallet className="size-3.5 text-primary" />
              Deposit
            </div>
            <p className="mt-1 font-semibold text-base-content">{property.securityDeposit ? `Rs. ${property.securityDeposit}` : "On request"}</p>
          </div>
          <div className="rounded-2xl bg-base-200/70 px-3 py-2 text-xs text-base-content/70">
            <div className="flex items-center gap-2">
              <BedDouble className="size-3.5 text-primary" />
              Furnishing
            </div>
            <p className="mt-1 font-semibold text-base-content">{property.furnishedStatus ? property.furnishedStatus.replaceAll("_", " ") : "Not specified"}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {property.amenities.slice(0, 3).map((amenity) => (
            <span key={amenity} className="rounded-full bg-base-200 px-3 py-1 text-xs text-base-content/70">
              {amenity}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-base-300/60 pt-4">
          <div className="flex items-center gap-2 text-sm text-base-content/70">
            <ShieldCheck className="size-4 text-primary" />
            {property.availabilityStatus || "AVAILABLE"} | {property.gender}
          </div>
          <Link href={`/properties/${property.id}`} className="btn pink-button rounded-full px-5">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
