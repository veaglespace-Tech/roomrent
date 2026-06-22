"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { CheckCircle2, Crown, CreditCard, Sparkles } from "lucide-react";
import { activateSubscription, getProfile } from "@/services/user-service";
const plans = [
    { plan: "STARTER", label: "Starter", price: "Managed access", duration: "30 days", accent: "from-[#0f9f8f] to-[#14b8a6]" },
    { plan: "PRO", label: "Pro", price: "Managed access", duration: "90 days", accent: "from-[#ef3d81] to-[#fb7185]" },
    { plan: "BUSINESS", label: "Business", price: "Managed access", duration: "180 days", accent: "from-[#ff7a35] to-[#facc15]" }
];
export default function SubscriptionPage() {
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
    const choosePlan = async (plan) => {
        try {
            setActivating(plan);
            setError("");
            setProfile(await activateSubscription(plan));
        }
        catch {
            setError("Unable to activate plan. Please try again.");
        }
        finally {
            setActivating(null);
        }
    };
    if (loading) {
        return _jsx("div", { className: "dashboard-empty-state", children: "Loading plan details..." });
    }
    return (_jsxs("div", { children: [_jsxs("section", { className: "profile-hero", children: [_jsx("div", { className: "profile-avatar", children: profile?.isSuperAdmin ? _jsx(Crown, { className: "size-8" }) : _jsx(CreditCard, { className: "size-8" }) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [_jsx("h1", { children: "Listing Plan" }), profile?.subscriptionActive || profile?.isSuperAdmin ? (_jsxs("span", { className: "profile-status", children: [_jsx(CheckCircle2, { className: "size-4" }), "Active"] })) : null] }), _jsx("p", { children: profile?.isSuperAdmin
                                    ? "Superadmin has full website-owner access without a paid plan requirement."
                                    : profile?.subscriptionActive
                                        ? `${profile.subscriptionPlan} plan is active for property publishing.`
                                        : "Activate a plan before publishing any property." })] })] }), error ? _jsx("p", { className: "mt-5 text-sm text-error", children: error }) : null, _jsx("section", { className: "mt-6 grid gap-5 lg:grid-cols-3", children: plans.map((item) => {
                    const isActive = profile?.subscriptionPlan === item.plan && profile.subscriptionActive;
                    return (_jsxs("article", { className: "landing-card flex min-h-[300px] flex-col justify-between p-6", children: [_jsxs("div", { children: [_jsx("div", { className: `mb-5 flex size-12 items-center justify-center rounded-[16px] bg-gradient-to-br ${item.accent} text-white shadow-[0_18px_34px_-24px_rgba(15,23,42,0.65)]`, children: _jsx(Sparkles, { className: "size-5" }) }), _jsx("p", { className: "text-sm font-extrabold uppercase text-[#64748b]", children: item.label }), _jsx("h2", { className: "mt-2 text-3xl font-extrabold text-[#111827]", children: item.price }), _jsxs("p", { className: "mt-2 text-sm font-semibold text-[#64748b]", children: [item.duration, " listing access"] }), _jsxs("div", { className: "mt-5 grid gap-3 text-sm font-semibold text-[#475569]", children: [_jsx("span", { children: "Add properties after activation" }), _jsx("span", { children: "Edit and manage own listings" }), _jsx("span", { children: "Receive enquiries in dashboard" })] })] }), _jsx("button", { className: isActive ? "landing-secondary-button mt-7" : "landing-primary-button mt-7", onClick: () => choosePlan(item.plan), disabled: activating !== null || profile?.isSuperAdmin, children: profile?.isSuperAdmin ? "Included" : activating === item.plan ? "Activating..." : isActive ? "Current Plan" : "Activate Plan" })] }, item.plan));
                }) })] }));
}
