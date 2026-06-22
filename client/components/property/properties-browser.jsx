"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Building2, Filter, MapPinned, PlusCircle, SlidersHorizontal } from "lucide-react";
import { FiltersSidebar } from "@/components/property/filters-sidebar";
import { PropertyCard } from "@/components/property/property-card";
import { SearchSuggestions } from "@/components/property/search-suggestions";
import dynamic from "next/dynamic";
const MapView = dynamic(() => import("@/components/property/map-view").then((mod) => mod.MapView), {
    ssr: false,
    loading: () => (_jsx("div", { className: "animate-pulse rounded-[24px] bg-base-300", style: { height: "320px" } })),
});
import { getProperties } from "@/services/property-service";
import { getCompareIds } from "@/lib/compare-store";
import { saveSearchAlert } from "@/lib/search-alerts";
function parseFiltersFromParams(searchParams) {
    return {
        location: searchParams?.get("location") || searchParams?.get("area") || "",
        minPrice: searchParams?.get("minPrice") || "",
        maxPrice: searchParams?.get("maxPrice") || "",
        type: searchParams?.get("type") || "",
        gender: searchParams?.get("gender") || "",
        furnishedStatus: searchParams?.get("furnishedStatus") || "",
        sharingType: searchParams?.get("sharingType") || "",
        listedByType: searchParams?.get("listedByType") || "",
        amenities: searchParams?.get("amenities") ? searchParams.get("amenities").split(",").map((item) => item.trim()).filter(Boolean) : [],
        sortBy: searchParams?.get("sortBy") || "",
        page: 0,
        size: 24
    };
}
function PropertiesContent({ title, subtitle }) {
    const searchParams = useSearchParams();
    const searchParamsKey = searchParams?.toString() || "";
    const [filters, setFilters] = useState(() => parseFiltersFromParams(searchParams));
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [mapViewOpen, setMapViewOpen] = useState(false);
    const [compareCount, setCompareCount] = useState(0);
    const [alertNotice, setAlertNotice] = useState("");
    const loadProperties = async (nextFilters) => {
        try {
            setLoading(true);
            setError("");
            const data = await getProperties(nextFilters);
            setProperties(data.content);
        }
        catch {
            setProperties([]);
            setError("Unable to load properties.");
        }
        finally {
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
    useEffect(() => {
        if (!mobileFiltersOpen) {
            return;
        }
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [mobileFiltersOpen]);
    const sortedProperties = useMemo(() => [...properties].sort((a, b) => {
        if (filters.sortBy === "price_asc")
            return a.price - b.price;
        if (filters.sortBy === "price_desc")
            return b.price - a.price;
        if (filters.sortBy === "newest")
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return 0;
    }), [filters.sortBy, properties]);
    return (_jsxs("section", { className: "page-shell py-8 lg:py-10", children: [_jsxs("div", { className: "grid items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)] 2xl:grid-cols-[336px_minmax(0,1fr)]", children: [_jsx("div", { className: "hidden min-w-0 lg:block lg:sticky lg:top-24 lg:self-start", children: _jsx(FiltersSidebar, { filters: filters, onChange: setFilters }) }), _jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "mb-6 space-y-4 border-b border-[rgba(15,23,42,0.12)] pb-6", children: _jsxs("div", { className: "flex flex-col gap-3 md:flex-row md:items-end md:justify-between", children: [_jsxs("div", { className: "max-w-3xl", children: [_jsx("p", { className: "text-xs font-bold uppercase tracking-[0.22em] text-[var(--rf-cyan)]", children: "Live rental search" }), _jsx("h1", { className: "mt-2 text-3xl font-bold tracking-wide", children: title }), _jsx("p", { className: "mt-2 text-sm leading-7 text-[var(--rf-muted)]", children: subtitle })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [_jsxs("div", { className: "border border-[rgba(15,23,42,0.12)] px-4 py-3 text-sm font-bold text-[var(--rf-cyan)]", children: [properties.length, " results"] }), _jsxs("button", { type: "button", className: "landing-secondary-button lg:hidden", onClick: () => setMobileFiltersOpen(true), children: [_jsx(Filter, { className: "size-4" }), "Filters"] })] })] }) }), _jsxs("form", { className: "mb-6 flex flex-col gap-3 border border-[rgba(15,23,42,0.12)] bg-[rgba(249,251,253,0.94)] p-3 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.28)] md:flex-row md:items-center", onSubmit: (event) => {
                                    event.preventDefault();
                                    void loadProperties(filters);
                                }, children: [_jsx(SearchSuggestions, { value: filters.location || "", onChange: (value) => setFilters({ ...filters, location: value }) }), _jsx("button", { type: "submit", className: "landing-primary-button md:w-auto", children: "Search" })] }), _jsxs("div", { className: "mb-6 flex flex-wrap items-center gap-3", children: [_jsxs("button", { type: "button", className: "landing-secondary-button", onClick: async () => {
                                            const label = [filters.location, filters.type, filters.gender].filter(Boolean).join(" | ") || "Saved search";
                                            try {
                                                await saveSearchAlert(label, filters);
                                                setAlertNotice("Search alert saved.");
                                            }
                                            catch {
                                                setAlertNotice("Please login to save search alerts.");
                                            }
                                        }, children: [_jsx(SlidersHorizontal, { className: "size-4" }), "Save search alert"] }), _jsxs("button", { type: "button", className: "landing-secondary-button", onClick: () => setMapViewOpen((value) => !value), children: [_jsx(MapPinned, { className: "size-4" }), mapViewOpen ? "Hide map view" : "Map view"] }), compareCount > 0 ? (_jsxs(Link, { href: "/compare", className: "landing-primary-button", children: ["Compare ", compareCount] })) : null, alertNotice ? _jsx("span", { className: "text-sm font-semibold text-[var(--rf-success)]", children: alertNotice }) : null] }), mapViewOpen ? (_jsx("div", { className: "mb-6 overflow-hidden border border-[rgba(15,23,42,0.12)] bg-[rgba(249,251,253,0.94)]", children: _jsxs("div", { className: "grid gap-4 p-5 lg:grid-cols-[1.2fr_0.8fr]", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold uppercase tracking-[0.22em] text-[var(--rf-cyan)]", children: "Locality focus" }), _jsx("h2", { className: "mt-2 text-2xl font-bold", children: "Fast neighborhood scan" }), _jsx("p", { className: "mt-2 text-sm leading-7 text-[var(--rf-muted)]", children: "Use this as a locality-first view for your current search. It stays lightweight and requires no API key." })] }), _jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: [
                                                        { label: "Nearby transit", value: "Station / bus stop access" },
                                                        { label: "Demand level", value: "High if rent matches budget" },
                                                        { label: "Trust signal", value: "Verified listing badge shown" },
                                                        { label: "Quick action", value: "Call or WhatsApp from detail page" }
                                                    ].map((item) => (_jsxs("div", { className: "border border-[rgba(15,23,42,0.1)] bg-white/70 p-4", children: [_jsx("p", { className: "text-xs font-bold uppercase tracking-[0.18em] text-[var(--rf-muted)]", children: item.label }), _jsx("p", { className: "mt-2 text-sm font-semibold text-[var(--rf-ink)]", children: item.value })] }, item.label))) })] }), _jsx("div", { className: "overflow-hidden border border-[rgba(15,23,42,0.1)] bg-white/80", children: _jsx(MapView, { properties: properties, height: "320px" }) })] }) })) : null, _jsxs("div", { className: "mb-6 flex flex-wrap items-center justify-between gap-3", children: [_jsx("div", { className: "flex flex-wrap gap-2", children: [
                                            { label: "Under 10k", minPrice: "", maxPrice: "10000" },
                                            { label: "Under 15k", minPrice: "", maxPrice: "15000" },
                                            { label: "Flats", type: "FLAT" },
                                            { label: "PG", type: "PG" },
                                            { label: "Boys", gender: "BOYS" },
                                            { label: "Girls", gender: "GIRLS" }
                                        ].map((chip) => (_jsx("button", { type: "button", className: "pill-badge px-4 py-2 text-xs", onClick: () => setFilters((current) => ({
                                                ...current,
                                                ...(chip.minPrice !== undefined ? { minPrice: chip.minPrice } : {}),
                                                ...(chip.maxPrice !== undefined ? { maxPrice: chip.maxPrice } : {}),
                                                ...(chip.type ? { type: chip.type } : {}),
                                                ...(chip.gender ? { gender: chip.gender } : {})
                                            })), children: chip.label }, chip.label))) }), _jsxs("select", { className: "form-select min-h-11 w-auto px-4 text-sm", value: filters.sortBy || "", onChange: (event) => setFilters({ ...filters, sortBy: event.target.value }), children: [_jsx("option", { value: "", children: "Sort by" }), _jsx("option", { value: "newest", children: "Newest first" }), _jsx("option", { value: "price_asc", children: "Price: Low to High" }), _jsx("option", { value: "price_desc", children: "Price: High to Low" })] })] }), error ? _jsx("p", { className: "mb-4 text-sm text-error", children: error }) : null, loading ? (_jsx("div", { className: "grid gap-6 md:grid-cols-2 xl:grid-cols-3", children: Array.from({ length: 6 }).map((_, index) => (_jsx("div", { className: "h-96 animate-pulse border border-[rgba(15,23,42,0.1)] bg-[rgba(249,251,253,0.94)]" }, index))) })) : sortedProperties.length ? (_jsx("div", { className: "grid gap-6 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3", children: sortedProperties.map((property) => (_jsx(PropertyCard, { property: property, onSavedChange: () => void loadProperties(filters) }, property.id))) })) : (_jsxs("div", { className: "landing-card flex min-h-[420px] flex-col items-center justify-center p-8 text-center", children: [_jsx("div", { className: "landing-icon mx-auto", children: _jsx(Building2, { className: "size-5" }) }), _jsx("h2", { className: "mt-6 text-3xl font-bold", children: "No live properties published yet" }), _jsx("p", { className: "mt-3 max-w-xl text-sm leading-7 text-[var(--rf-muted)]", children: "Listings will appear here once owners publish properties or verified inventory is connected." }), _jsxs(Link, { href: "/register", className: "landing-primary-button mt-7 w-fit", children: [_jsx(PlusCircle, { className: "size-4" }), "Choose Listing Plan"] })] }))] })] }), mobileFiltersOpen ? (_jsxs("div", { className: "fixed inset-0 z-50 lg:hidden", children: [_jsx("button", { type: "button", "aria-label": "Close filters", className: "drawer-overlay", onClick: () => setMobileFiltersOpen(false) }), _jsx("div", { className: "drawer-panel w-[min(88vw,360px)]", children: _jsx(FiltersSidebar, { filters: filters, onChange: setFilters, mobile: true, onClose: () => setMobileFiltersOpen(false) }) })] })) : null] }));
}
export function PropertiesBrowser(props) {
    return (_jsx(Suspense, { fallback: _jsx("section", { className: "page-shell py-10", children: "Loading properties..." }), children: _jsx(PropertiesContent, { ...props }) }));
}

