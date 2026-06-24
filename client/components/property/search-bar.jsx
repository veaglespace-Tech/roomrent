"use client";
import React, { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { SearchSuggestions } from "./search-suggestions";

export function SearchBar({ dark = false }) {
    const router = useRouter();
    const [location, setLocation] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        const params = new URLSearchParams();
        if (location) {
            params.set("location", location);
        }
        router.push(`/search?${params.toString()}`);
    };

    return (
        <form 
            onSubmit={handleSubmit} 
            className="mx-auto flex w-full max-w-2xl flex-col gap-3 rounded-xl border border-[var(--rf-line)] bg-slate-900/40 p-2 shadow-[0_24px_70px_-42px_rgba(0,0,0,0.8)] md:flex-row backdrop-blur-md"
        >
            <div className="flex-1 min-w-0">
                <SearchSuggestions value={location} onChange={setLocation} />
            </div>
            <button 
                type="submit" 
                className="landing-primary-button h-12 md:h-11 shrink-0 px-8 rounded-lg"
            >
                <SlidersHorizontal className="relative size-4" />
                Search
            </button>
        </form>
    );
}
