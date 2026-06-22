"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Building2, Gauge, ShieldCheck, Users, RefreshCw, Inbox, ListChecks } from "lucide-react";
import { getAdminDashboard } from "@/services/user-service";
export default function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    useEffect(() => {
        getAdminDashboard().then(setStats).catch(() => setStats(null));
    }, []);
    const cards = useMemo(() => [
        { label: "Users", value: stats?.totalUsers ?? 0, icon: Users, href: "/dashboard/admin/users" },
        { label: "Subscribers", value: stats?.totalSubscribers ?? 0, icon: ShieldCheck, href: "/dashboard/subscription" },
        { label: "Properties", value: stats?.totalProperties ?? 0, icon: Building2, href: "/dashboard/admin/properties" },
        { label: "Enquiries", value: stats?.totalEnquiries ?? 0, icon: Inbox, href: "/dashboard/admin/review-queue" }
    ], [stats]);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "surface-card p-6 md:p-8", children: [_jsx("p", { className: "landing-eyebrow", children: "Admin workspace" }), _jsx("h1", { className: "mt-3 text-3xl font-bold", children: "Admin dashboard" }), _jsx("p", { className: "mt-2 max-w-2xl text-sm leading-7 text-[var(--rf-muted)]", children: "Central control for moderation, users, properties, source registry, and ingestion queues." })] }), _jsx("div", { className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4", children: cards.map((item) => {
                    const Icon = item.icon;
                    return (_jsxs(Link, { href: item.href, className: "surface-card p-5 transition hover:-translate-y-1", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.18em] text-[var(--rf-muted)]", children: item.label }), _jsx("span", { className: "icon-tile", children: _jsx(Icon, { className: "size-5" }) })] }), _jsx("div", { className: "mt-5 text-3xl font-bold", children: item.value })] }, item.label));
                }) }), _jsxs("div", { className: "grid gap-4 lg:grid-cols-[1.2fr_0.8fr]", children: [_jsxs("div", { className: "surface-card p-6", children: [_jsx("h2", { className: "text-xl font-bold", children: "Admin tools" }), _jsxs("div", { className: "mt-4 grid gap-3 sm:grid-cols-2", children: [_jsxs(Link, { href: "/dashboard/admin/review-queue", className: "landing-primary-button", children: [_jsx(ListChecks, { className: "size-4" }), "Review queue"] }), _jsxs(Link, { href: "/dashboard/admin/users", className: "landing-secondary-button", children: [_jsx(Users, { className: "size-4" }), "Manage users"] }), _jsxs(Link, { href: "/dashboard/admin/properties", className: "landing-secondary-button", children: [_jsx(Building2, { className: "size-4" }), "Manage properties"] }), _jsxs(Link, { href: "/dashboard/admin/source-registry", className: "landing-secondary-button", children: [_jsx(ShieldCheck, { className: "size-4" }), "Source registry"] }), _jsxs(Link, { href: "/dashboard/admin/ingestion-queue", className: "landing-secondary-button sm:col-span-2", children: [_jsx(Gauge, { className: "size-4" }), "Ingestion queue"] })] })] }), _jsxs("div", { className: "surface-card p-6", children: [_jsx("h2", { className: "text-xl font-bold", children: "Central access" }), _jsx("p", { className: "mt-4 text-sm leading-7 text-[var(--rf-muted)]", children: "This page is the landing point for all admin routes. Direct access to admin screens is blocked unless the session role is ADMIN." }), _jsxs(Link, { href: "/dashboard/admin/users", className: "landing-primary-button mt-6", children: [_jsx(RefreshCw, { className: "size-4" }), "Open management tools"] })] })] })] }));
}
