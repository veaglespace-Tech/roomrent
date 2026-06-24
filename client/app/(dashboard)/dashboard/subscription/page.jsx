"use client";

import { useEffect, useState, useRef } from "react";
import { CheckCircle2, Crown, CreditCard, Sparkles } from "lucide-react";
import { activateSubscription, getProfile } from "@/services/user-service";
import gsap from "gsap";

const plans = [
    { plan: "STARTER", label: "Starter", price: "Managed access", duration: "30 days", accent: "from-indigo-500 to-indigo-600", text: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
    { plan: "PRO", label: "Pro", price: "Managed access", duration: "90 days", accent: "from-rose-500 to-rose-600", text: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
    { plan: "BUSINESS", label: "Business", price: "Managed access", duration: "180 days", accent: "from-amber-500 to-amber-600", text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" }
];

export default function SubscriptionPage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activating, setActivating] = useState(null);
    const [error, setError] = useState("");
    
    const containerRef = useRef(null);
    const elementsRef = useRef([]);

    useEffect(() => {
        getProfile()
            .then(setProfile)
            .catch(() => setProfile(null))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (loading) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(elementsRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
            );
        }, containerRef);
        return () => ctx.revert();
    }, [loading]);

    const choosePlan = async (plan) => {
        try {
            setActivating(plan);
            setError("");
            setProfile(await activateSubscription(plan));
        } catch {
            setError("Unable to activate plan. Please try again.");
        } finally {
            setActivating(null);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 surface-card rounded-[24px] border border-slate-200/60 bg-white shadow-sm">
                <span className="loading loading-spinner loading-lg text-indigo-500"></span>
                <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading plan details...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500" ref={containerRef}>
            <section 
                ref={el => elementsRef.current[0] = el}
                className="surface-card p-6 md:p-8 rounded-[24px] border border-slate-200/60 bg-white shadow-sm flex flex-col md:flex-row items-center gap-6"
            >
                <div className="flex items-center justify-center font-extrabold text-white text-3xl size-20 bg-slate-900 rounded-[20px] shadow-sm shrink-0">
                    {profile?.isSuperAdmin ? <Crown className="size-8" /> : <CreditCard className="size-8" />}
                </div>
                <div className="min-w-0 flex-1 space-y-2 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <h1 className="text-2xl font-extrabold text-slate-900 font-heading">Listing Plan</h1>
                        {profile?.subscriptionActive || profile?.isSuperAdmin ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" /> Active
                            </span>
                        ) : null}
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                        {profile?.isSuperAdmin
                            ? "Superadmin has full website-owner access without a paid plan requirement."
                            : profile?.subscriptionActive
                                ? `${profile.subscriptionPlan} plan is active for property publishing.`
                                : "Activate a plan before publishing any property."}
                    </p>
                </div>
            </section>

            {error && (
                <div className="rounded-[16px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
                    {error}
                </div>
            )}

            <section className="grid gap-6 lg:grid-cols-3">
                {plans.map((item, index) => {
                    const isActive = profile?.subscriptionPlan === item.plan && profile.subscriptionActive;
                    return (
                        <article 
                            key={item.plan}
                            ref={el => elementsRef.current[index + 1] = el}
                            className={`surface-card flex min-h-[350px] flex-col justify-between p-6 rounded-[24px] border ${isActive ? 'border-indigo-300 shadow-md ring-1 ring-indigo-500' : 'border-slate-200/60 shadow-sm'} bg-white transition-all hover:border-indigo-300 hover:shadow-md hover:-translate-y-1 relative overflow-hidden`}
                        >
                            {isActive && (
                                <div className="absolute top-0 right-0 rounded-bl-[16px] bg-indigo-500 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                                    Current
                                </div>
                            )}
                            <div>
                                <div className={`mb-6 flex size-14 items-center justify-center rounded-[16px] bg-gradient-to-br ${item.accent} text-white shadow-sm`}>
                                    <Sparkles className="size-6" />
                                </div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                                <h2 className="mt-2 text-3xl font-extrabold text-slate-900 font-heading">{item.price}</h2>
                                <p className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-600">
                                    <span className={`inline-flex px-2 py-0.5 rounded-md ${item.bg} ${item.text} ${item.border} border text-xs`}>{item.duration}</span>
                                    <span>listing access</span>
                                </p>
                                
                                <div className="mt-6 space-y-3 text-sm font-medium text-slate-600">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className={`size-4 shrink-0 mt-0.5 ${item.text}`} />
                                        <span>Add properties after activation</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className={`size-4 shrink-0 mt-0.5 ${item.text}`} />
                                        <span>Edit and manage own listings</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className={`size-4 shrink-0 mt-0.5 ${item.text}`} />
                                        <span>Receive enquiries in dashboard</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                className={`mt-8 w-full rounded-full px-5 py-3 text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 ${
                                    isActive || profile?.isSuperAdmin 
                                        ? 'bg-slate-50 text-slate-500 border border-slate-200 cursor-not-allowed' 
                                        : 'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-md'
                                }`}
                                onClick={() => choosePlan(item.plan)} 
                                disabled={activating !== null || profile?.isSuperAdmin || isActive}
                            >
                                {activating === item.plan && <span className="loading loading-spinner loading-sm"></span>}
                                {profile?.isSuperAdmin 
                                    ? "Included" 
                                    : activating === item.plan 
                                        ? "Activating..." 
                                        : isActive 
                                            ? "Current Plan" 
                                            : "Activate Plan"}
                            </button>
                        </article>
                    );
                })}
            </section>
        </div>
    );
}
