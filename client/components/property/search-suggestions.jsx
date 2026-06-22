"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Building2, Map, MapPin, Search } from "lucide-react";
import { cityPages, localityPages, maharashtraDistricts } from "@/lib/maharashtra-data";
export function SearchSuggestions({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState(value);
    const [suggestions, setSuggestions] = useState([]);
    const [activeIndex, setActiveIndex] = useState(-1);
    const containerRef = useRef(null);
    useEffect(() => {
        setQuery(value);
    }, [value]);
    const allItems = useMemo(() => {
        const items = [];
        localityPages.forEach((loc) => {
            items.push({
                label: `${loc.name}, ${loc.city}`,
                value: loc.name,
                type: "locality",
                sublabel: `Locality in ${loc.city}`
            });
        });
        cityPages.forEach((city) => {
            items.push({
                label: city.city,
                value: city.city,
                type: "city",
                sublabel: `City in ${city.district}`
            });
        });
        maharashtraDistricts.forEach((district) => {
            items.push({
                label: `${district} District`,
                value: district,
                type: "district",
                sublabel: "District in Maharashtra"
            });
        });
        return items;
    }, []);
    const featuredSuggestions = useMemo(() => {
        const featured = ["Mumbai", "Pune", "Thane", "Nagpur", "Nashik", "Kolhapur", "Solapur", "Chhatrapati Sambhajinagar", "Raigad", "Satara"];
        return allItems.filter((item) => (item.type === "city" || item.type === "district") && featured.includes(item.value));
    }, [allItems]);
    useEffect(() => {
        if (!query.trim()) {
            setSuggestions(featuredSuggestions);
            return;
        }
        const cleanQuery = query.toLowerCase().trim();
        const filtered = allItems.filter((item) => item.label.toLowerCase().includes(cleanQuery) ||
            item.value.toLowerCase().includes(cleanQuery) ||
            item.sublabel.toLowerCase().includes(cleanQuery));
        const sorted = filtered.sort((a, b) => {
            const aStarts = a.label.toLowerCase().startsWith(cleanQuery) || a.value.toLowerCase().startsWith(cleanQuery);
            const bStarts = b.label.toLowerCase().startsWith(cleanQuery) || b.value.toLowerCase().startsWith(cleanQuery);
            if (aStarts && !bStarts)
                return -1;
            if (!aStarts && bStarts)
                return 1;
            return a.label.localeCompare(b.label);
        });
        setSuggestions(sorted.slice(0, 8));
    }, [query, allItems, featuredSuggestions]);
    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const handleSelect = (item) => {
        setQuery(item.value);
        onChange(item.value);
        setIsOpen(false);
        setActiveIndex(-1);
    };
    const handleKeyDown = (event) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setIsOpen(true);
            setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        }
        else if (event.key === "ArrowUp") {
            event.preventDefault();
            setIsOpen(true);
            setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        }
        else if (event.key === "Enter") {
            if (isOpen && activeIndex >= 0 && activeIndex < suggestions.length) {
                event.preventDefault();
                handleSelect(suggestions[activeIndex]);
            }
        }
        else if (event.key === "Escape") {
            setIsOpen(false);
        }
    };
    const getIcon = (type) => {
        switch (type) {
            case "locality":
                return _jsx(MapPin, { className: "size-4 text-[var(--rf-cyan)]" });
            case "city":
                return _jsx(Building2, { className: "size-4 text-[var(--rf-accent)]" });
            case "district":
                return _jsx(Map, { className: "size-4 text-[var(--rf-muted)]" });
        }
    };
    return (_jsxs("div", { ref: containerRef, className: "relative flex-1", children: [_jsxs("div", { className: "relative flex items-center", children: [_jsx("span", { className: "absolute left-4 text-[var(--rf-dim)]", children: _jsx(Search, { className: "size-4 text-[var(--rf-cyan)]" }) }), _jsx("input", { type: "text", value: query, onChange: (event) => {
                            setQuery(event.target.value);
                            onChange(event.target.value);
                            setIsOpen(true);
                            setActiveIndex(-1);
                        }, onFocus: () => setIsOpen(true), onKeyDown: handleKeyDown, placeholder: "Search city, area or locality in Maharashtra...", className: "form-input w-full pl-11 pr-4" })] }), isOpen && suggestions.length > 0 ? (_jsxs("div", { className: "absolute left-0 right-0 top-full z-[100] mt-1.5 max-h-72 overflow-y-auto border border-[rgba(15,23,42,0.12)] bg-[rgba(249,251,253,0.98)] p-1 shadow-[0_26px_76px_-46px_rgba(15,23,42,0.28)] backdrop-blur-md", children: [_jsx("div", { className: "px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--rf-cyan)] opacity-70", children: !query.trim() ? "Featured Cities" : "Suggestions" }), suggestions.map((item, index) => (_jsxs("button", { type: "button", onClick: () => handleSelect(item), onMouseEnter: () => setActiveIndex(index), className: `flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors duration-150 ${index === activeIndex
                            ? "bg-[rgba(15,118,110,0.08)] text-[var(--rf-cyan)]"
                            : "text-[var(--rf-ink)] hover:bg-[rgba(15,118,110,0.06)]"}`, children: [_jsx("span", { className: "shrink-0", children: getIcon(item.type) }), _jsxs("div", { className: "flex-1 truncate", children: [_jsx("span", { className: "font-semibold text-[var(--rf-ink)]", children: item.label }), _jsxs("span", { className: "ml-2 text-xs text-[var(--rf-muted)] opacity-80", children: ["- ", item.sublabel] })] })] }, `${item.type}-${item.label}`)))] })) : null] }));
}
