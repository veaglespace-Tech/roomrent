"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, BedDouble, Heart, MapPin, ShieldCheck, Star, Wallet } from "lucide-react";
import { toggleSaveProperty } from "@/services/user-service";
import { CompareButton } from "@/components/property/compare-button";
export function PropertyCard({ property, onSavedChange }) {
    const [isSaving, setIsSaving] = useState(false);
    const displayPrice = property.price > 0 ? `Rs. ${property.price}` : "On request";
    const handleSave = async () => {
        try {
            setIsSaving(true);
            await toggleSaveProperty(property.id);
            onSavedChange?.();
        }
        catch {
            // Silent in list context.
        }
        finally {
            setIsSaving(false);
        }
    };
    return (_jsxs("div", { className: "surface-card group overflow-hidden p-0", children: [_jsxs("figure", { className: "relative h-64", children: [_jsx(Image, { src: property.imageUrls[0] || "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85", alt: property.title, fill: true, sizes: "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw", loading: "lazy", className: "object-cover transition duration-500 group-hover:scale-105" }), _jsx("div", { className: "absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0)_44%,rgba(15,23,42,0.7)_100%)]" }), _jsx("div", { className: "absolute left-4 top-4 rounded-full border border-white/55 bg-white/90 px-3 py-1 text-xs font-bold text-[var(--rf-cyan)] shadow-sm backdrop-blur", children: property.availableFromDate || "Available now" }), _jsx("button", { className: "mobile-menu-button absolute right-4 top-4 size-10 rounded-full bg-white/95", onClick: handleSave, disabled: isSaving, "aria-label": "Save property", children: _jsx(Heart, { className: `size-4 ${property.saved ? "fill-current text-[var(--rf-cyan)]" : ""}` }) })] }), _jsxs("div", { className: "space-y-4 p-5", children: [_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx("div", { className: "pill-badge", children: property.type }), property.category ? _jsx("div", { className: "pill-badge", children: property.category }) : null, property.sharingType ? _jsx("div", { className: "pill-badge", children: property.sharingType }) : null, _jsxs("div", { className: "pill-badge", children: [_jsx(Star, { className: "mr-1 size-3.5" }), "Verified"] })] }), _jsx("h3", { className: "line-clamp-2 text-xl font-semibold leading-snug", children: property.title })] }), _jsxs("div", { children: [_jsx("p", { className: "text-3xl font-extrabold leading-none text-[var(--rf-cyan)]", children: displayPrice }), _jsx("p", { className: "mt-1 text-xs uppercase tracking-[0.15em] text-[var(--rf-muted)]", children: property.price > 0 ? "Monthly rent" : "Source price" })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-[var(--rf-muted)]", children: [_jsx(MapPin, { className: "size-4" }), [property.areaLocality, property.city, property.district].filter(Boolean).join(", ") || property.location] }), _jsx("p", { className: "line-clamp-2 text-sm text-[var(--rf-muted)]", children: property.description }), _jsxs("div", { className: "grid gap-2 sm:grid-cols-2", children: [_jsxs("div", { className: "surface-card p-3 text-xs text-[var(--rf-muted)]", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Wallet, { className: "size-3.5 text-[var(--rf-cyan)]" }), "Deposit"] }), _jsx("p", { className: "mt-1 font-semibold text-[var(--rf-ink)]", children: property.securityDeposit ? `Rs. ${property.securityDeposit}` : "On request" })] }), _jsxs("div", { className: "surface-card p-3 text-xs text-[var(--rf-muted)]", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(BedDouble, { className: "size-3.5 text-[var(--rf-cyan)]" }), "Furnishing"] }), _jsx("p", { className: "mt-1 font-semibold text-[var(--rf-ink)]", children: property.furnishedStatus ? property.furnishedStatus.replaceAll("_", " ") : "Not specified" })] })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: property.amenities.slice(0, 3).map((amenity) => (_jsx("span", { className: "sidebar-chip", children: amenity }, amenity))) }), _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(15,23,42,0.08)] pt-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-[var(--rf-muted)]", children: [_jsx(ShieldCheck, { className: "size-4 text-[var(--rf-cyan)]" }), property.availabilityStatus || "AVAILABLE", " | ", property.gender] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsx(CompareButton, { propertyId: property.id, compact: true }), _jsxs(Link, { href: `/property/${property.id}`, className: "landing-primary-button min-h-11 px-5", children: ["View Details", _jsx(ArrowUpRight, { className: "size-4" })] })] })] })] })] }));
}
