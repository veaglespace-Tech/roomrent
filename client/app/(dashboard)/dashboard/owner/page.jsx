"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { 
    Building2, 
    MessageSquareMore, 
    Inbox, 
    Wallet, 
    ListPlus, 
    ClipboardList, 
    ShieldCheck, 
    Zap, 
    Calendar,
    ArrowRight
} from "lucide-react";
import gsap from "gsap";
import { getOwnerEnquiries, getOwnerLeads, getProfile } from "@/services/user-service";
import { getOwnerProperties } from "@/services/property-service";

export default function OwnerDashboardPage() {
    const [profile, setProfile] = useState(null);
    const [propertyCount, setPropertyCount] = useState(0);
    const [enquiryCount, setEnquiryCount] = useState(0);
    const [leadCount, setLeadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const containerRef = useRef(null);
    const heroRef = useRef(null);
    const statsRef = useRef([]);
    const sectionsRef = useRef([]);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [prof, props, enq, lds] = await Promise.all([
                    getProfile(),
                    getOwnerProperties(),
                    getOwnerEnquiries(),
                    getOwnerLeads()
                ]);
                setProfile(prof);
                setPropertyCount(props.length);
                setEnquiryCount(enq.length);
                setLeadCount(lds.length);
            } catch (err) {
                console.error("Error loading owner dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        void loadDashboard();
    }, []);

    useEffect(() => {
        if (loading) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(heroRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
            );
            gsap.fromTo(statsRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.2 }
            );
            gsap.fromTo(sectionsRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power2.out", delay: 0.4 }
            );
        }, containerRef);
        return () => ctx.revert();
    }, [loading]);

    const summaryCards = useMemo(() => [
        { 
            label: "My Properties", 
            value: propertyCount, 
            icon: Building2, 
            color: "text-cyan-600",
            bg: "bg-cyan-50 border-cyan-100",
            href: "/dashboard/owner/my-listings",
            desc: "Active residential and commercial rooms"
        },
        { 
            label: "Listing Enquiries", 
            value: enquiryCount, 
            icon: MessageSquareMore, 
            color: "text-amber-600",
            bg: "bg-amber-50 border-amber-100",
            href: "/dashboard/owner/enquiries",
            desc: "Direct messages from property seekers"
        },
        { 
            label: "Callback Leads", 
            value: leadCount, 
            icon: Inbox, 
            color: "text-rose-600",
            bg: "bg-rose-50 border-rose-100",
            href: "/dashboard/owner/leads",
            desc: "Direct callback request clicks"
        },
        { 
            label: "Active Plan", 
            value: profile?.subscriptionPlan || "STARTER", 
            icon: Wallet, 
            color: "text-indigo-600",
            bg: "bg-indigo-50 border-indigo-100",
            href: "/dashboard/subscription",
            desc: profile?.subscriptionActive ? "Active & publishing allowed" : "Inactive or expired"
        }
    ], [enquiryCount, leadCount, propertyCount, profile]);

    return (
        <div className="space-y-8" ref={containerRef}>
            {/* Header Hero Banner */}
            <div ref={heroRef} className="relative overflow-hidden rounded-[32px] border border-slate-200/60 bg-gradient-to-r from-indigo-600 via-indigo-600/90 to-indigo-900 p-8 md:p-10 text-white shadow-lg">
                <div className="absolute -right-16 -top-16 size-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-3xl space-y-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-indigo-100">
                        <Zap className="size-3.5 fill-indigo-200 shrink-0" /> Property Workspace
                    </span>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
                        Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-indigo-50">{profile?.name || "Owner"}</span>
                    </h1>
                    <p className="text-sm md:text-base text-indigo-100/90 leading-relaxed font-medium">
                        Manage your rooms, PGs, flats, and commercial properties throughout Maharashtra. Keep track of incoming tenant leads and message enquiries in real time.
                    </p>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {summaryCards.map((item, i) => {
                    const Icon = item.icon;
                    return (
                        <Link 
                            key={item.label} 
                            ref={el => statsRef.current[i] = el}
                            href={item.href} 
                            className="surface-card flex flex-col justify-between p-6 transition duration-300 hover:-translate-y-1 hover:border-indigo-500/30 rounded-[24px] bg-white border-slate-200/60 shadow-sm"
                        >
                            <div>
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                                        {item.label}
                                    </p>
                                    <span className={`flex size-10 items-center justify-center rounded-xl border ${item.bg} ${item.color} shrink-0`}>
                                        <Icon className="size-5 shrink-0" />
                                    </span>
                                </div>
                                <div className="mt-4">
                                    {loading ? (
                                        <div className="h-9 w-20 animate-pulse rounded bg-slate-100" />
                                    ) : (
                                        <p className="text-3xl font-extrabold text-slate-900">
                                            {item.value}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <p className="mt-3 text-xs text-slate-500 font-medium">
                                {item.desc}
                            </p>
                        </Link>
                    );
                })}
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
                {/* Main Actions Panel */}
                <div className="lg:col-span-8 space-y-6">
                    <div ref={el => sectionsRef.current[0] = el} className="surface-card p-6 md:p-8 space-y-6 rounded-[24px] bg-white border-slate-200/60 shadow-sm">
                        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                            <div>
                                <h2 className="text-xl font-extrabold text-slate-900">Listing Actions</h2>
                                <p className="text-xs text-slate-500 font-medium mt-1">Control your active inventory and track client interest.</p>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {/* Add Property */}
                            <Link href="/dashboard/owner/add-property" className="group block p-5 rounded-[20px] transition duration-300 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md border border-slate-100 bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-white text-indigo-600 shadow-sm">
                                        <ListPlus className="size-5 shrink-0" />
                                    </span>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-sm text-slate-900 truncate">Add Property</h3>
                                        <p className="text-xs text-slate-500 mt-0.5 truncate">List a new PG, room, or commercial space.</p>
                                    </div>
                                </div>
                            </Link>

                            {/* My Listings */}
                            <Link href="/dashboard/owner/my-listings" className="group block p-5 rounded-[20px] transition duration-300 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md border border-slate-100 bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-600 shadow-sm">
                                        <ClipboardList className="size-5 shrink-0" />
                                    </span>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-sm text-slate-900 truncate">My Active Listings</h3>
                                        <p className="text-xs text-slate-500 mt-0.5 truncate">Edit parameters, verify status, and save drafts.</p>
                                    </div>
                                </div>
                            </Link>

                            {/* Owner Enquiries */}
                            <Link href="/dashboard/owner/enquiries" className="group block p-5 rounded-[20px] transition duration-300 hover:border-amber-300 hover:bg-amber-50 hover:shadow-md border border-slate-100 bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-amber-100 bg-white text-amber-600 shadow-sm">
                                        <MessageSquareMore className="size-5 shrink-0" />
                                    </span>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-sm text-slate-900 truncate">Owner Enquiries</h3>
                                        <p className="text-xs text-slate-500 mt-0.5 truncate">Review questions sent by prospective tenants.</p>
                                    </div>
                                </div>
                            </Link>

                            {/* Callback Leads */}
                            <Link href="/dashboard/owner/leads" className="group block p-5 rounded-[20px] transition duration-300 hover:border-rose-300 hover:bg-rose-50 hover:shadow-md border border-slate-100 bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-rose-100 bg-white text-rose-600 shadow-sm">
                                        <Inbox className="size-5 shrink-0" />
                                    </span>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-sm text-slate-900 truncate">Callback Leads</h3>
                                        <p className="text-xs text-slate-500 mt-0.5 truncate">Direct callback click history and tenant info.</p>
                                    </div>
                                </div>
                            </Link>

                             {/* Subscription */}
                            <Link href="/dashboard/subscription" className="group block p-5 rounded-[20px] transition duration-300 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md sm:col-span-2 border border-slate-100 bg-slate-50">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-white text-indigo-600 shadow-sm">
                                            <ShieldCheck className="size-5 shrink-0" />
                                        </span>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-sm text-slate-900 truncate">Subscription Access Plan</h3>
                                            <p className="text-xs text-slate-500 mt-0.5 truncate">Extend your listing period and see tier parameters.</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="size-4 shrink-0 text-slate-400 transition duration-200 group-hover:translate-x-1 group-hover:text-indigo-600" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Account Status sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div ref={el => sectionsRef.current[1] = el} className="surface-card p-6 space-y-6 rounded-[24px] bg-white border-slate-200/60 shadow-sm">
                        <div>
                            <h2 className="text-xl font-extrabold text-slate-900">Account Info</h2>
                            <p className="text-xs text-slate-500 font-medium mt-1">Status details for your listing manager session.</p>
                        </div>

                        <div className="space-y-4">
                            {/* Detail 1 - Role */}
                            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account Role</span>
                                <span className="text-xs font-semibold text-slate-900">{profile?.role || "OWNER"}</span>
                            </div>

                            {/* Detail 2 - Active Plan */}
                            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Plan</span>
                                <span className="text-xs font-semibold text-indigo-600">{profile?.subscriptionPlan || "STARTER"}</span>
                            </div>

                            {/* Detail 3 - Status */}
                            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Listing Status</span>
                                <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold ${profile?.subscriptionActive ? 'bg-indigo-50 text-indigo-700' : 'bg-rose-50 text-rose-700'}`}>
                                    {profile?.subscriptionActive ? 'ACTIVE' : 'INACTIVE'}
                                </span>
                            </div>

                            {/* Detail 4 - Created At */}
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Member Since</span>
                                <span className="text-xs font-semibold text-slate-900 flex items-center gap-1 shrink-0">
                                    <Calendar className="size-3.5 shrink-0 text-slate-400" />
                                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short" }) : "N/A"}
                                </span>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-4 text-xs leading-5 text-indigo-700 font-medium">
                            💡 Tip: Make sure your listings are complete with descriptions and clear photos. Accounts with complete profiles get up to 3x more callback leads.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
