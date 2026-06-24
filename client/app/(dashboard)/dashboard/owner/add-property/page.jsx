"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { CheckCircle2, CreditCard, ShieldCheck, Sparkles } from "lucide-react";
import { PropertyForm } from "@/components/forms/property-form";
import { activateSubscription, getProfile } from "@/services/user-service";
import gsap from "gsap";

const plans = [
    {
        plan: "STARTER",
        name: "Starter",
        price: "Managed access",
        copy: "For one owner or broker starting with a focused property set.",
        features: ["30 days listing access", "Add and edit properties", "Receive listing enquiries"]
    },
    {
        plan: "PRO",
        name: "Pro",
        price: "Managed access",
        copy: "For active property managers listing multiple rooms and flats.",
        features: ["90 days listing access", "Priority property workspace", "Better enquiry tracking"]
    },
    {
        plan: "BUSINESS",
        name: "Business",
        price: "Managed access",
        copy: "For high-volume operators and admin-grade listing management.",
        features: ["180 days listing access", "Large inventory workflow", "Premium support desk"]
    }
];

export default function AddPropertyPage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activating, setActivating] = useState(null);
    const [error, setError] = useState("");
    
    const containerRef = useRef(null);
    const plansRef = useRef([]);

    useEffect(() => {
        getProfile()
            .then(setProfile)
            .catch(() => setProfile(null))
            .finally(() => setLoading(false));
    }, []);

    const hasListingAccess = profile?.isSuperAdmin || profile?.subscriptionActive;

    useEffect(() => {
        if (!loading && !hasListingAccess && profile && plansRef.current.length > 0) {
            gsap.fromTo(plansRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.1 }
            );
        }
    }, [loading, hasListingAccess, profile]);

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
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
                <span className="loading loading-spinner loading-lg text-indigo-500"></span>
                <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading listing access...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="surface-card flex flex-col items-center justify-center rounded-[24px] border border-slate-200/60 bg-white p-12 text-center shadow-sm">
                <div className="rounded-full bg-rose-50 p-5 mb-5 border border-rose-100">
                    <ShieldCheck className="size-10 shrink-0 text-rose-500" />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 font-heading">Login required</h1>
                <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-7 text-slate-500">
                    Login before choosing a listing plan and publishing a property.
                </p>
                <Link href="/login" className="mt-8 rounded-[14px] bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700">
                    Login
                </Link>
            </div>
        );
    }

    if (!hasListingAccess) {
        return (
            <div className="space-y-6" ref={containerRef}>
                <div className="surface-card p-6 md:p-8 rounded-[24px] border border-slate-200/60 bg-white shadow-sm">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">Listing access required</p>
                            <h1 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl font-heading">Choose a plan before adding property.</h1>
                            <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-slate-500">
                                Users can browse and enquire freely. Publishing rooms, PGs, flats or shops needs an active listing plan.
                            </p>
                        </div>
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-[16px] bg-indigo-50 text-indigo-600">
                            <CreditCard className="size-6 shrink-0" />
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
                        {error}
                    </div>
                )}

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                    {plans.map((item, i) => (
                        <article key={item.plan} ref={el => plansRef.current[i] = el} className="surface-card flex min-h-[350px] flex-col justify-between rounded-[24px] border border-slate-200/60 bg-white p-8 shadow-sm transition duration-300 hover:border-indigo-300 hover:shadow-lg">
                            <div>
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-extrabold uppercase text-indigo-500">{item.name}</p>
                                        <h2 className="mt-2 text-2xl font-extrabold text-slate-900">{item.price}</h2>
                                    </div>
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-500">
                                        <Sparkles className="size-5 shrink-0" />
                                    </div>
                                </div>
                                <p className="mt-4 text-sm font-medium leading-7 text-slate-500">{item.copy}</p>
                                <div className="mt-6 space-y-3">
                                    {item.features.map((feature) => (
                                        <div key={feature} className="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
                                            <CheckCircle2 className="size-4 shrink-0 text-indigo-500" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button 
                                className="mt-8 w-full rounded-[14px] bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed" 
                                onClick={() => choosePlan(item.plan)} 
                                disabled={activating !== null}
                            >
                                {activating === item.plan ? "Activating..." : "Choose Plan"}
                            </button>
                        </article>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="surface-card p-6 md:p-8 rounded-[24px] border border-slate-200/60 bg-white shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">
                    {profile.isSuperAdmin ? "Superadmin access" : `${profile.subscriptionPlan} plan active`}
                </p>
                <h1 className="mt-2 text-3xl font-extrabold text-slate-900 font-heading">Add Property</h1>
                <p className="mt-2 text-sm font-medium leading-7 text-slate-500">
                    Publish a verified room, PG, flat, hostel or commercial listing.
                </p>
            </div>
            
            <div className="surface-card p-6 md:p-8 rounded-[24px] border border-slate-200/60 bg-white shadow-sm">
                <PropertyForm />
            </div>
        </div>
    );
}
