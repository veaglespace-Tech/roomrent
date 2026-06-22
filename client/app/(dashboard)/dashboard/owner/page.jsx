"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Building2, ClipboardList, Inbox, ListPlus, MessageSquareMore, ShieldCheck, Wallet } from "lucide-react";
import { getOwnerEnquiries, getOwnerLeads, getProfile } from "@/services/user-service";
import { getOwnerProperties } from "@/services/property-service";
export default function OwnerDashboardPage() {
    const [profile, setProfile] = useState(null);
    const [propertyCount, setPropertyCount] = useState(0);
    const [enquiryCount, setEnquiryCount] = useState(0);
    const [leadCount, setLeadCount] = useState(0);
    useEffect(() => {
        getProfile().then(setProfile).catch(() => setProfile(null));
        getOwnerProperties().then((items) => setPropertyCount(items.length)).catch(() => setPropertyCount(0));
        getOwnerEnquiries().then((items) => setEnquiryCount(items.length)).catch(() => setEnquiryCount(0));
        getOwnerLeads().then((items) => setLeadCount(items.length)).catch(() => setLeadCount(0));
    }, []);
    const summaryCards = useMemo(() => [
        { label: "Listings", value: propertyCount, icon: Building2, href: "/dashboard/owner/my-listings" },
        { label: "Enquiries", value: enquiryCount, icon: MessageSquareMore, href: "/dashboard/owner/enquiries" },
        { label: "Leads", value: leadCount, icon: Inbox, href: "/dashboard/owner/leads" },
        { label: "Plan", value: profile?.subscriptionPlan || "STARTER", icon: Wallet, href: "/dashboard/subscription" }
    ], [enquiryCount, leadCount, propertyCount, profile?.subscriptionPlan]);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "surface-card p-6 md:p-8", children: [_jsx("p", { className: "landing-eyebrow", children: "Owner workspace" }), _jsx("h1", { className: "mt-3 text-3xl font-bold", children: "Property management dashboard" }), _jsx("p", { className: "mt-2 max-w-2xl text-sm leading-7 text-[var(--rf-muted)]", children: "Manage listings, enquiries, callback leads, and your subscription from one place." })] }), _jsx("div", { className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4", children: summaryCards.map((item) => {
                    const Icon = item.icon;
                    return (_jsxs(Link, { href: item.href, className: "surface-card p-5 transition hover:-translate-y-1", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.18em] text-[var(--rf-muted)]", children: item.label }), _jsx("span", { className: "icon-tile", children: _jsx(Icon, { className: "size-5" }) })] }), _jsx("div", { className: "mt-5 text-3xl font-bold", children: item.value })] }, item.label));
                }) }), _jsxs("div", { className: "grid gap-4 lg:grid-cols-[1.2fr_0.8fr]", children: [_jsxs("div", { className: "surface-card p-6", children: [_jsx("h2", { className: "text-xl font-bold", children: "Owner actions" }), _jsxs("div", { className: "mt-4 grid gap-3 sm:grid-cols-2", children: [_jsxs(Link, { href: "/dashboard/owner/add-property", className: "landing-primary-button", children: [_jsx(ListPlus, { className: "size-4" }), "Add property"] }), _jsxs(Link, { href: "/dashboard/owner/my-listings", className: "landing-secondary-button", children: [_jsx(ClipboardList, { className: "size-4" }), "My listings"] }), _jsxs(Link, { href: "/dashboard/owner/enquiries", className: "landing-secondary-button", children: [_jsx(MessageSquareMore, { className: "size-4" }), "Owner enquiries"] }), _jsxs(Link, { href: "/dashboard/owner/leads", className: "landing-secondary-button", children: [_jsx(Inbox, { className: "size-4" }), "Callback leads"] }), _jsxs(Link, { href: "/dashboard/subscription", className: "landing-secondary-button sm:col-span-2", children: [_jsx(ShieldCheck, { className: "size-4" }), "Subscription and plan access"] })] })] }), _jsxs("div", { className: "surface-card p-6", children: [_jsx("h2", { className: "text-xl font-bold", children: "Owner status" }), _jsxs("div", { className: "mt-4 space-y-3 text-sm text-[var(--rf-muted)]", children: [_jsxs("p", { children: ["Role: ", _jsx("span", { className: "font-semibold text-[var(--rf-ink)]", children: profile?.role || "OWNER" })] }), _jsx("p", { children: "Allowed pages: add property, listings, leads, enquiries, subscription." }), _jsx("p", { children: "Admin users can also reach this area, but regular users cannot." })] }), _jsxs(Link, { href: "/dashboard/owner/my-listings", className: "landing-primary-button mt-6", children: [_jsx(Building2, { className: "size-4" }), "Open listings"] })] })] })] }));
}
