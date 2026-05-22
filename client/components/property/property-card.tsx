"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, ShieldCheck } from "lucide-react";
import { Property } from "@/types";
import { toggleSaveProperty } from "@/services/user-service";
import { useState } from "react";

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
    <div className="card overflow-hidden rounded-[24px] border border-base-300 bg-base-100 shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(15,23,42,0.35)]">
      <figure className="relative h-64">
        <Image
          src={property.imageUrls[0] || "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"}
          alt={property.title}
          fill
          className="object-cover"
        />
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
          <div className="badge badge-outline border-primary/30 px-3 text-primary">{property.type}</div>
          <h3 className="line-clamp-2 text-xl font-semibold leading-snug">{property.title}</h3>
        </div>
        <div>
          <p className="text-3xl font-bold leading-none text-primary">Rs. {property.price}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.15em] text-base-content/55">monthly rent</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-base-content/70">
          <MapPin className="size-4" />
          {property.location}
        </div>
        <p className="line-clamp-2 text-sm text-base-content/70">{property.description}</p>
        <div className="flex flex-wrap gap-2">
          {property.amenities.slice(0, 3).map((amenity) => (
            <span key={amenity} className="rounded-full bg-base-200 px-3 py-1 text-xs text-base-content/70">
              {amenity}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-base-300 pt-4">
          <div className="flex items-center gap-2 text-sm text-base-content/70">
            <ShieldCheck className="size-4 text-primary" />
            {property.gender} friendly
          </div>
          <Link href={`/properties/${property.id}`} className="btn btn-primary rounded-full">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

