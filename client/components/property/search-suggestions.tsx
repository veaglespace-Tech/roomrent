"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Building2, Map, MapPin, Search } from "lucide-react";
import { cityPages, localityPages, maharashtraDistricts } from "@/lib/maharashtra-data";

interface SearchSuggestionsProps {
  value: string;
  onChange: (value: string) => void;
}

interface SuggestionItem {
  label: string;
  value: string;
  type: "city" | "locality" | "district";
  sublabel: string;
}

export function SearchSuggestions({ value, onChange }: SearchSuggestionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const allItems: SuggestionItem[] = useMemo(() => {
    const items: SuggestionItem[] = [];

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

  const featuredSuggestions: SuggestionItem[] = useMemo(() => {
    const featured = ["Mumbai", "Pune", "Thane", "Nagpur", "Nashik"];
    return allItems.filter((item) => item.type === "city" && featured.includes(item.value));
  }, [allItems]);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions(featuredSuggestions);
      return;
    }

    const cleanQuery = query.toLowerCase().trim();
    const filtered = allItems.filter(
      (item) =>
        item.label.toLowerCase().includes(cleanQuery) ||
        item.value.toLowerCase().includes(cleanQuery) ||
        item.sublabel.toLowerCase().includes(cleanQuery)
    );

    const sorted = filtered.sort((a, b) => {
      const aStarts = a.label.toLowerCase().startsWith(cleanQuery) || a.value.toLowerCase().startsWith(cleanQuery);
      const bStarts = b.label.toLowerCase().startsWith(cleanQuery) || b.value.toLowerCase().startsWith(cleanQuery);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.label.localeCompare(b.label);
    });

    setSuggestions(sorted.slice(0, 8));
  }, [query, allItems, featuredSuggestions]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: SuggestionItem) => {
    setQuery(item.value);
    onChange(item.value);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (event.key === "Enter") {
      if (isOpen && activeIndex >= 0 && activeIndex < suggestions.length) {
        event.preventDefault();
        handleSelect(suggestions[activeIndex]);
      }
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  const getIcon = (type: SuggestionItem["type"]) => {
    switch (type) {
      case "locality":
        return <MapPin className="size-4 text-[var(--rf-cyan)]" />;
      case "city":
        return <Building2 className="size-4 text-[var(--rf-cyan-soft)]" />;
      case "district":
        return <Map className="size-4 text-[var(--rf-muted)]" />;
    }
  };

  return (
    <div ref={containerRef} className="relative flex-1">
      <div className="relative flex items-center">
        <span className="absolute left-4 text-[var(--rf-dim)]">
          <Search className="size-4 text-[var(--rf-cyan)]" />
        </span>
        <input
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            onChange(event.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search city, area or locality in Maharashtra..."
          className="form-input w-full pl-11 pr-4"
        />
      </div>

      {isOpen && suggestions.length > 0 ? (
        <div className="absolute left-0 right-0 top-full z-[100] mt-1.5 max-h-72 overflow-y-auto border border-[rgba(28,183,200,0.38)] bg-[#0c1216]/98 p-1 shadow-[0_26px_76px_-46px_rgba(0,0,0,0.88)] backdrop-blur-md">
          <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--rf-cyan)] opacity-70">
            {!query.trim() ? "Featured Cities" : "Suggestions"}
          </div>
          {suggestions.map((item, index) => (
            <button
              key={`${item.type}-${item.label}`}
              type="button"
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors duration-150 ${
                index === activeIndex
                  ? "bg-[rgba(28,183,200,0.12)] text-[var(--rf-cyan)]"
                  : "text-[var(--rf-ink)] hover:bg-[rgba(28,183,200,0.06)]"
              }`}
            >
              <span className="shrink-0">{getIcon(item.type)}</span>
              <div className="flex-1 truncate">
                <span className="font-semibold text-white">{item.label}</span>
                <span className="ml-2 text-xs text-[var(--rf-muted)] opacity-80">- {item.sublabel}</span>
              </div>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
