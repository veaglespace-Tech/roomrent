"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
import { Building2, Mail, MapPin, Sparkles } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { getDashboardRoute, getStoredAuthRole } from "@/lib/auth-session";
export function Footer() {
    const user = useAppSelector((state) => state.auth.user);
    const role = user?.role || getStoredAuthRole();
    const dashboardHref = getDashboardRoute(role);
    const workspaceLinks = role === "ADMIN"
        ? [
            { href: "/dashboard/admin", label: "Admin dashboard" },
            { href: "/dashboard/admin/review-queue", label: "Review queue" },
            { href: "/dashboard/admin/users", label: "Manage users" }
        ]
        : role === "OWNER"
            ? [
                { href: "/dashboard/owner", label: "Owner dashboard" },
                { href: "/dashboard/owner/my-listings", label: "My listings" },
                { href: "/dashboard/owner/add-property", label: "Add property" }
            ]
            : user
                ? [
                    { href: "/dashboard/user", label: "User dashboard" },
                    { href: "/dashboard/saved-properties", label: "Saved properties" },
                    { href: "/dashboard/my-enquiries", label: "My enquiries" }
                ]
                : [
                    { href: "/login", label: "Login" },
                    { href: "/register", label: "Create account" }
                ];
    return (_jsx("footer", { className: "px-3 pb-8 pt-16 md:px-5", children: _jsxs("div", { className: "footer-shell", children: [_jsxs("div", { className: "page-shell grid gap-10 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr]", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "flex size-10 items-center justify-center border border-[var(--rf-cyan)] bg-[rgba(15,118,110,0.12)] text-[var(--rf-cyan)]", children: _jsx(Building2, { className: "size-4" }) }), _jsx("h3", { className: "text-2xl font-bold tracking-wide", children: "RentFlow" })] }), _jsx("p", { className: "max-w-md text-sm leading-7 text-[var(--rf-muted)]", children: "A light, focused rental workspace for owners, seekers, and administrators across Maharashtra." }), _jsxs("div", { className: "space-y-2 text-sm text-[var(--rf-muted)]", children: [_jsxs("p", { className: "flex items-center gap-2", children: [_jsx(Mail, { className: "size-4 text-[var(--rf-cyan)]" }), " roomrentmaharashtra@gmail.com"] }), _jsxs("p", { className: "flex items-center gap-2", children: [_jsx(MapPin, { className: "size-4 text-[var(--rf-cyan)]" }), " Maharashtra statewide"] })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-bold uppercase tracking-[0.2em] text-[var(--rf-cyan)]", children: "Explore" }), _jsxs("ul", { className: "mt-4 space-y-2 text-sm", children: [_jsx("li", { children: _jsx(Link, { className: "footer-link", href: "/properties", children: "Browse properties" }) }), _jsx("li", { children: _jsx(Link, { className: "footer-link", href: "/contact", children: "Contact support" }) }), _jsx("li", { children: _jsx(Link, { className: "footer-link", href: "/compare", children: "Compare listings" }) })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-bold uppercase tracking-[0.2em] text-[var(--rf-cyan)]", children: "Workspace" }), _jsxs("ul", { className: "mt-4 space-y-2 text-sm", children: [_jsx("li", { children: _jsx(Link, { className: "footer-link", href: dashboardHref, children: "Dashboard" }) }), workspaceLinks.map((item) => (_jsx("li", { children: _jsx(Link, { className: "footer-link", href: item.href, children: item.label }) }, item.href)))] })] })] }), _jsx("div", { className: "border-t border-[rgba(15,118,110,0.14)]", children: _jsxs("div", { className: "page-shell flex flex-col gap-2 py-4 text-sm text-[var(--rf-muted)] md:flex-row md:items-center md:justify-between", children: [_jsx("p", { children: "Copyright (c) 2026 RentFlow Maharashtra." }), _jsxs("p", { className: "flex items-center gap-2", children: [_jsx(Sparkles, { className: "size-4 text-[var(--rf-cyan)]" }), " Auth-aware navigation and dashboard routing."] })] }) })] }) }));
}
