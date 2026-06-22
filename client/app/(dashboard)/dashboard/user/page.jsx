"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bookmark, Building2, Search, MessageSquareMore, ArrowRight, UserRound, HeartHandshake } from "lucide-react";
import { getProfile, getSavedProperties, getMyEnquiries } from "@/services/user-service";
import { getCompareIds } from "@/lib/compare-store";
export default function UserDashboardPage() {
    const [profile, setProfile] = useState(null);
    const [savedCount, setSavedCount] = useState(0);
    const [enquiryCount, setEnquiryCount] = useState(0);
    const [compareCount, setCompareCount] = useState(0);
    useEffect(() => {
        getProfile().then(setProfile).catch(() => setProfile(null));
        getSavedProperties().then((items) => setSavedCount(items.length)).catch(() => setSavedCount(0));
        getMyEnquiries().then((items) => setEnquiryCount(items.length)).catch(() => setEnquiryCount(0));
        getCompareIds().then((ids) => setCompareCount(ids.length)).catch(() => setCompareCount(0));
    }, []);
    const cards = useMemo(() => [
        { label: "Saved items", value: savedCount, href: "/dashboard/saved-properties", icon: Bookmark },
        { label: "My enquiries", value: enquiryCount, href: "/dashboard/my-enquiries", icon: MessageSquareMore },
        { label: "Compare list", value: compareCount, href: "/compare", icon: HeartHandshake },
        { label: "Profile", value: profile?.role ?? "USER", href: "/dashboard/profile", icon: UserRound }
    ], [compareCount, enquiryCount, profile?.role, savedCount]);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "surface-card p-6 md:p-8", children: [_jsx("p", { className: "landing-eyebrow", children: "User workspace" }), _jsxs("h1", { className: "mt-3 text-3xl font-bold", children: ["Welcome", profile?.name ? `, ${profile.name.split(" ")[0]}` : ""] }), _jsx("p", { className: "mt-2 max-w-2xl text-sm leading-7 text-[var(--rf-muted)]", children: "Your search, saved listings, enquiries, and comparison workspace live here." })] }), _jsx("div", { className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4", children: cards.map((item) => {
                    const Icon = item.icon;
                    return (_jsxs(Link, { href: item.href, className: "surface-card p-5 transition hover:-translate-y-1", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.18em] text-[var(--rf-muted)]", children: item.label }), _jsx("span", { className: "icon-tile", children: _jsx(Icon, { className: "size-5" }) })] }), _jsx("div", { className: "mt-5 text-3xl font-bold", children: item.value })] }, item.label));
                }) }), _jsxs("div", { className: "grid gap-4 lg:grid-cols-[1.2fr_0.8fr]", children: [_jsxs("div", { className: "surface-card p-6", children: [_jsx("h2", { className: "text-xl font-bold", children: "Quick actions" }), _jsxs("div", { className: "mt-4 grid gap-3 sm:grid-cols-2", children: [_jsxs(Link, { href: "/properties", className: "landing-primary-button", children: [_jsx(Search, { className: "size-4" }), "Search properties"] }), _jsxs(Link, { href: "/dashboard/saved-properties", className: "landing-secondary-button", children: [_jsx(Bookmark, { className: "size-4" }), "Open saved items"] }), _jsxs(Link, { href: "/dashboard/my-enquiries", className: "landing-secondary-button", children: [_jsx(MessageSquareMore, { className: "size-4" }), "View enquiries"] }), _jsxs(Link, { href: "/compare", className: "landing-secondary-button", children: [_jsx(Building2, { className: "size-4" }), "Compare listings"] })] })] }), _jsxs("div", { className: "surface-card p-6", children: [_jsx("h2", { className: "text-xl font-bold", children: "Account status" }), _jsxs("div", { className: "mt-4 space-y-3 text-sm text-[var(--rf-muted)]", children: [_jsxs("p", { children: ["Role: ", _jsx("span", { className: "font-semibold text-[var(--rf-ink)]", children: "USER" })] }), _jsx("p", { children: "Visible pages: saved items, enquiries, compare, profile." }), _jsx("p", { children: "Protected actions redirect through login before access." })] }), _jsxs(Link, { href: "/dashboard/profile", className: "landing-primary-button mt-6", children: ["Open profile", _jsx(ArrowRight, { className: "size-4" })] })] })] })] }));
}
