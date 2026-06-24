"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BedDouble, Heart, MapPin, ShieldCheck, Star, Wallet } from "lucide-react";
import { toggleSaveProperty } from "@/services/user-service";
import { CompareButton } from "@/components/property/compare-button";

export function PropertyCard({ property, onSavedChange }) {
  const [isSaving, setIsSaving] = useState(false);
  const displayPrice = property.price > 0 ? `₹${property.price.toLocaleString("en-IN")}` : "On request";

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
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
    <div className="surface-card group overflow-hidden p-0 rounded-2xl border border-[var(--rf-line)] bg-slate-900/30 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:border-indigo-500/30 hover:shadow-[0_20px_50px_-20px_rgba(99,102,241,0.15)] flex flex-col h-full">
      <figure className="relative h-64 overflow-hidden w-full flex-shrink-0">
        <Image
          src={property.imageUrls[0] || "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"}
          alt={property.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          loading="lazy"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        
        {/* Sleek Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Availability Badge */}
        <div className="absolute left-4 top-4 rounded-full border border-indigo-500/20 bg-slate-950/70 px-3.5 py-1 text-xs font-semibold text-indigo-400 shadow-lg backdrop-blur-md">
          {property.availableFromDate || "Available now"}
        </div>
        
        {/* Save Button */}
        <button
          className={`absolute right-4 top-4 flex size-10 items-center justify-center rounded-full border border-slate-700/40 bg-slate-950/70 text-slate-300 backdrop-blur-md transition-all hover:scale-105 active:scale-95 ${property.saved ? "border-indigo-500/30 text-indigo-400" : "hover:text-white"}`}
          onClick={handleSave}
          disabled={isSaving}
          aria-label="Save property"
        >
          <Heart className={`size-4 transition-all duration-300 ${property.saved ? "fill-current scale-110" : ""}`} />
        </button>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-4 left-4 z-10">
          <p className="text-2xl font-extrabold leading-none text-white font-heading tracking-tight">
            {displayPrice}
            {property.price > 0 && <span className="text-xs font-normal text-slate-300 tracking-normal">/mo</span>}
          </p>
        </div>
      </figure>

      <div className="flex flex-col flex-grow p-5 space-y-4">
        {/* Badges and Title */}
        <div className="space-y-3 flex-grow">
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              {property.type}
            </span>
            {property.category && (
              <span className="inline-flex items-center rounded-md bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-300 border border-slate-700/30">
                {property.category}
              </span>
            )}
            {property.sharingType && (
              <span className="inline-flex items-center rounded-md bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-300 border border-slate-700/30">
                {property.sharingType}
              </span>
            )}
            <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/20">
              <Star className="mr-1 size-3 fill-current" /> Verified
            </span>
          </div>
          
          <h3 className="line-clamp-2 text-lg font-bold text-white font-heading leading-snug group-hover:text-indigo-400 transition-colors">
            {property.title}
          </h3>
        </div>

        {/* Location */}
        <div className="flex items-start gap-1.5 text-xs text-[var(--rf-muted)]">
          <MapPin className="size-4 text-indigo-500 flex-shrink-0 mt-0.5" />
          <span className="line-clamp-1">
            {[property.areaLocality, property.city, property.district].filter(Boolean).join(", ") || property.location}
          </span>
        </div>

        {/* Description Snippet */}
        <p className="line-clamp-2 text-xs text-[var(--rf-muted)] leading-relaxed">
          {property.description}
        </p>

        {/* Specifications Grid */}
        <div className="grid gap-2 grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 text-xs text-[var(--rf-muted)]">
            <div className="flex items-center gap-1.5">
              <Wallet className="size-3.5 text-indigo-400" />
              <span>Deposit</span>
            </div>
            <p className="mt-1 font-bold text-white">
              {property.securityDeposit ? `₹${property.securityDeposit.toLocaleString("en-IN")}` : "On request"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 text-xs text-[var(--rf-muted)]">
            <div className="flex items-center gap-1.5">
              <BedDouble className="size-3.5 text-indigo-400" />
              <span>Furnishing</span>
            </div>
            <p className="mt-1 font-bold text-white line-clamp-1">
              {property.furnishedStatus ? property.furnishedStatus.replace(/_/g, " ") : "Not specified"}
            </p>
          </div>
        </div>

        {/* Amenities Chips */}
        {property.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {property.amenities.slice(0, 3).map((amenity) => (
              <span key={amenity} className="inline-flex items-center rounded-full bg-slate-800/60 border border-slate-700/40 px-2.5 py-0.5 text-[10px] font-semibold text-slate-300">
                {amenity}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="inline-flex items-center rounded-full bg-slate-800/60 border border-slate-700/40 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer Meta Row */}
        <div className="flex items-center justify-between gap-3 border-t border-slate-800 pt-4 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-[var(--rf-muted)]">
            <ShieldCheck className="size-4 text-indigo-500" />
            <span className="uppercase tracking-wider font-semibold text-[10px] text-slate-300">
              {property.availabilityStatus || "AVAILABLE"}
            </span>
            <span>|</span>
            <span className="text-[10px] font-medium text-slate-400">{property.gender}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <CompareButton propertyId={property.id} compact={true} />
            <Link
              href={`/property/${property.id}`}
              className="inline-flex items-center gap-1 min-h-9 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 hover:scale-[1.02] active:scale-95 transition-all shadow-md"
            >
              Details
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
