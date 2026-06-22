"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, CreditCard, ShieldCheck, Sparkles } from "lucide-react";
import { PropertyForm } from "@/components/forms/property-form";
import { activateSubscription, getProfile } from "@/services/user-service";
const plans = [
    {
        plan: "STARTER",
        name: "Starter",
        price: "Rs. 499",
        copy: "For one owner or broker starting with a focused property set.",
        features: ["30 days listing access", "Add and edit properties", "Receive listing enquiries"]
    },
    {
        plan: "PRO",
        name: "Pro",
        price: "Rs. 999",
        copy: "For active property managers listing multiple rooms and flats.",
        features: ["90 days listing access", "Priority property workspace", "Better enquiry tracking"]
    },
    {
        plan: "BUSINESS",
        name: "Business",
        price: "Rs. 1,999",
        copy: "For high-volume operators and admin-grade listing management.",
        features: ["180 days listing access", "Large inventory workflow", "Premium support desk"]
    }
];
export default function AddPropertyPage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activating, setActivating] = useState(null);
    const [error, setError] = useState("");
    useEffect(() => {
        getProfile()
            .then(setProfile)
            .catch(() => setProfile(null))
            .finally(() => setLoading(false));
    }, []);
    const hasListingAccess = profile?.isSuperAdmin || profile?.subscriptionActive;
    const choosePlan = async (plan) => {
        try {
            setActivating(plan);
            setError("");
            const updatedProfile = await activateSubscription(plan);
            setProfile(updatedProfile);
        }
        catch {
            setError("Unable to activate listing plan. Please login again or contact support.");
        }
        finally {
            setActivating(null);
        }
    };
    if (loading) {
        return _jsx("div", { className: "dashboard-empty-state", children: "Loading listing access..." });
    }
    if (!profile) {
        return (_jsxs("div", { className: "landing-card p-8 text-center", children: [_jsx(ShieldCheck, { className: "mx-auto size-10 text-[#ef3d81]" }), _jsx("h1", { className: "mt-5 text-3xl font-extrabold text-[#111827]", children: "Login required" }), _jsx("p", { className: "mx-auto mt-3 max-w-xl text-sm font-medium leading-7 text-[#64748b]", children: "Login before choosing a listing plan and publishing a property." }), _jsx(Link, { href: "/login", className: "landing-primary-button mx-auto mt-7 w-fit", children: "Login" })] }));
    }
    if (!hasListingAccess) {
        return (_jsxs("div", { children: [_jsx("div", { className: "landing-card p-6 md:p-8", children: _jsxs("div", { className: "flex flex-col gap-5 md:flex-row md:items-center md:justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "landing-eyebrow", children: "Listing access required" }), _jsx("h1", { className: "mt-3 text-3xl font-extrabold text-[#111827] md:text-4xl", children: "Choose a plan before adding property." }), _jsx("p", { className: "mt-3 max-w-2xl text-sm font-medium leading-7 text-[#64748b]", children: "Users can browse and enquire freely. Publishing rooms, PGs, flats or shops needs an active listing plan." })] }), _jsx("div", { className: "landing-icon", children: _jsx(CreditCard, { className: "size-5" }) })] }) }), error ? _jsx("p", { className: "mt-5 text-sm text-error", children: error }) : null, _jsx("div", { className: "mt-6 grid gap-5 lg:grid-cols-3", children: plans.map((item) => (_jsxs("article", { className: "landing-card flex min-h-[330px] flex-col justify-between p-6", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-extrabold uppercase text-[#ef3d81]", children: item.name }), _jsx("h2", { className: "mt-2 text-3xl font-extrabold text-[#111827]", children: item.price })] }), _jsx("div", { className: "icon-tile", children: _jsx(Sparkles, { className: "size-5" }) })] }), _jsx("p", { className: "mt-4 text-sm font-medium leading-7 text-[#64748b]", children: item.copy }), _jsx("div", { className: "mt-5 grid gap-3", children: item.features.map((feature) => (_jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold text-[#475569]", children: [_jsx(CheckCircle2, { className: "size-4 text-[#0f9f8f]" }), feature] }, feature))) })] }), _jsx("button", { className: "landing-primary-button mt-7", onClick: () => choosePlan(item.plan), disabled: activating !== null, children: activating === item.plan ? "Activating..." : "Choose Plan" })] }, item.plan))) })] }));
    }
    return (_jsxs("div", { children: [_jsxs("div", { className: "landing-card p-6", children: [_jsx("p", { className: "landing-eyebrow", children: profile.isSuperAdmin ? "Superadmin access" : `${profile.subscriptionPlan} plan active` }), _jsx("h1", { className: "mt-2 text-3xl font-extrabold text-[#111827]", children: "Add Property" }), _jsx("p", { className: "mt-2 text-sm font-medium leading-7 text-[#64748b]", children: "Publish a verified room, PG, flat, hostel or commercial listing." })] }), _jsx("div", { className: "mt-8", children: _jsx(PropertyForm, {}) })] }));
}
