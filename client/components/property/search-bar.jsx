"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
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
    return (_jsxs("form", { onSubmit: handleSubmit, className: dark
            ? "mx-auto flex w-full max-w-2xl flex-col gap-3 rounded-lg border border-[var(--rf-line)] bg-[rgba(249,251,253,0.9)] p-2 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.4)] md:flex-row"
            : "mx-auto flex w-full max-w-2xl flex-col gap-3 rounded-lg border border-[var(--rf-line)] bg-[rgba(249,251,253,0.9)] p-2 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.34)] md:flex-row", children: [_jsxs("label", { className: dark
                    ? "flex h-14 flex-1 items-center gap-3 rounded-md bg-white/70 px-4 text-[var(--rf-ink)] transition focus-within:bg-white focus-within:ring-2 focus-within:ring-[rgba(15,118,110,0.14)]"
                    : "flex h-14 flex-1 items-center gap-3 rounded-md bg-base-200/60 px-4 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-[rgba(15,118,110,0.14)]", children: [_jsx(Search, { className: "size-4 text-[var(--rf-cyan)]" }), _jsx("input", { value: location, onChange: (event) => setLocation(event.target.value), placeholder: "Enter your location", className: "w-full bg-transparent text-sm text-[var(--rf-ink)] outline-none placeholder:text-[var(--rf-dim)]" })] }), _jsxs("button", { type: "submit", className: "landing-primary-button h-14 shrink-0 px-8", children: [_jsx(SlidersHorizontal, { className: "relative size-4" }), "Search"] })] }));
}
