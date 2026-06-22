"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { getPropertyById } from "@/services/property-service";
import { clearCompareIds, getCompareIds, removeCompared } from "@/lib/compare-store";
export default function ComparePage() {
    const [properties, setProperties] = useState([]);
    const load = async () => {
        const ids = await getCompareIds(true);
        if (ids.length === 0) {
            setProperties([]);
            return;
        }
        try {
            const data = await Promise.all(ids.map((id) => getPropertyById(id)));
            setProperties(data);
        }
        catch {
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
        return (_jsx("section", { className: "page-shell py-12", children: _jsxs("div", { className: "panel flex min-h-[420px] flex-col items-center justify-center p-8 text-center", children: [_jsx("p", { className: "text-xs font-bold uppercase tracking-[0.22em] text-[var(--rf-cyan)]", children: "Compare" }), _jsx("h1", { className: "mt-3 text-3xl font-extrabold text-[var(--rf-ink)]", children: "No properties selected yet" }), _jsx("p", { className: "mt-3 max-w-xl text-sm font-medium leading-7 text-[var(--rf-muted)]", children: "Add listings to compare from search cards or property details. You can compare up to 3 properties side by side." }), _jsxs(Link, { href: "/search", className: "landing-primary-button mt-7", children: [_jsx(ArrowLeft, { className: "size-4" }), "Go back to search"] })] }) }));
    }
    return (_jsxs("section", { className: "page-shell py-10", children: [_jsxs("div", { className: "mb-6 flex flex-wrap items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold uppercase tracking-[0.22em] text-[var(--rf-cyan)]", children: "Compare" }), _jsx("h1", { className: "mt-2 text-3xl font-extrabold text-[var(--rf-ink)]", children: "Side by side listing comparison" }), _jsx("p", { className: "mt-2 text-sm font-medium text-[var(--rf-muted)]", children: "Review price, furnishing, location, and availability without opening tabs." })] }), _jsx("button", { type: "button", className: "rounded-2xl border border-[rgba(15,23,42,0.1)] bg-white px-4 py-3 text-sm font-bold text-[var(--rf-ink)] transition hover:border-[rgba(15,118,110,0.28)] hover:text-[var(--rf-cyan)]", onClick: () => {
                            void clearCompareIds().then(() => setProperties([]));
                        }, children: "Clear compare" })] }), _jsxs("div", { className: "overflow-hidden rounded-[28px] border border-[rgba(15,23,42,0.1)] bg-white shadow-[0_24px_70px_-48px_rgba(15,23,42,0.38)]", children: [_jsx("div", { className: "grid gap-4 border-b border-base-300 bg-base-100 p-4 md:grid-cols-3", children: properties.map((property) => (_jsxs("div", { className: "overflow-hidden rounded-[22px] border border-[rgba(15,23,42,0.1)] bg-white", children: [_jsx("div", { className: "relative h-52", children: _jsx(Image, { src: property.imageUrls[0] || "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85", alt: property.title, fill: true, className: "object-cover" }) }), _jsxs("div", { className: "space-y-3 p-4", children: [_jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx("span", { className: "pill-badge border-[rgba(15,118,110,0.18)] bg-[rgba(15,118,110,0.08)] text-[var(--rf-cyan)]", children: property.type }), _jsx("span", { className: "pill-badge border-[rgba(51,65,85,0.18)] bg-[rgba(51,65,85,0.06)] text-[var(--rf-accent)]", children: "Verified listing" })] }), _jsx("h2", { className: "text-lg font-bold text-[var(--rf-ink)]", children: property.title }), _jsx("p", { className: "text-sm text-[var(--rf-muted)]", children: [property.areaLocality, property.city, property.district].filter(Boolean).join(", ") || property.location }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("p", { className: "text-2xl font-extrabold text-[var(--rf-cyan)]", children: ["Rs. ", property.price] }), _jsx("button", { type: "button", className: "rounded-xl border border-[rgba(15,23,42,0.1)] bg-white px-3 py-2 text-xs font-bold text-[var(--rf-ink)] hover:border-[rgba(15,118,110,0.28)] hover:text-[var(--rf-cyan)]", onClick: async () => {
                                                        await removeCompared(property.id);
                                                        await load();
                                                    }, children: "Remove" })] })] })] }, property.id))) }), _jsx("div", { className: "grid gap-0 md:grid-cols-3", children: [
                            { label: "Deposit", render: (property) => property.securityDeposit ? `Rs. ${property.securityDeposit}` : "On request" },
                            { label: "Availability", render: (property) => property.availabilityStatus || "AVAILABLE" },
                            { label: "Furnishing", render: (property) => property.furnishedStatus ? property.furnishedStatus.replaceAll("_", " ") : "Not specified" },
                            { label: "Preference", render: (property) => property.gender },
                            { label: "Listed by", render: (property) => property.listedByType || "OWNER" },
                            { label: "Available from", render: (property) => property.availableFromDate || "Immediate" },
                            { label: "Amenities", render: (property) => property.amenities.slice(0, 4).join(", ") || "No amenities" },
                            { label: "Owner", render: (property) => property.owner.name }
                        ].map((row) => (_jsxs("div", { className: "border-t border-base-300 md:contents", children: [_jsx("div", { className: "border-b border-base-300 bg-base-100 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-base-content/50 md:border-b-0 md:border-r", children: row.label }), properties.map((property) => (_jsx("div", { className: "border-b border-base-300 px-4 py-3 text-sm font-semibold text-[var(--rf-ink)] md:border-b-0 md:border-r", children: row.render(property) }, `${row.label}-${property.id}`)))] }, row.label))) })] })] }));
}
