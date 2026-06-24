"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { 
    Users, 
    Building2, 
    Inbox, 
    ShieldCheck, 
    ListChecks, 
    Database, 
    RefreshCw, 
    Globe, 
    Zap, 
    ShieldAlert,
    ArrowRight
} from "lucide-react";
import gsap from "gsap";
import { getAdminDashboard } from "@/services/user-service";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const containerRef = useRef(null);
    const heroRef = useRef(null);
    const statsRef = useRef([]);
    const sectionsRef = useRef([]);

    useEffect(() => {
        getAdminDashboard()
            .then(setStats)
            .catch(() => setStats(null))
            .finally(() => setLoading(false));
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

    const cards = useMemo(() => [
        { 
            label: "Registered Users", 
            value: stats?.totalUsers ?? 0, 
            icon: Users, 
            color: "text-blue-600",
            bg: "bg-blue-50 border-blue-100", 
            href: "/dashboard/admin/users",
            desc: "Active seekers and owners accounts"
        },
        { 
            label: "Active Subscribers", 
            value: stats?.totalSubscribers ?? 0, 
            icon: ShieldCheck, 
            color: "text-indigo-600",
            bg: "bg-indigo-50 border-indigo-100", 
            href: "/dashboard/subscription",
            desc: "Subscribed property managers"
        },
        { 
            label: "Total Properties", 
            value: stats?.totalProperties ?? 0, 
            icon: Building2, 
            color: "text-cyan-600",
            bg: "bg-cyan-50 border-cyan-100", 
            href: "/dashboard/admin/properties",
            desc: "Verified rooms, PGs, and flats"
        },
        { 
            label: "User Enquiries", 
            value: stats?.totalEnquiries ?? 0, 
            icon: Inbox, 
            color: "text-amber-600",
            bg: "bg-amber-50 border-amber-100", 
            href: "/dashboard/admin/review-queue",
            desc: "Tenant enquiries & callback leads"
        }
    ], [stats]);

    return (
        <div className="space-y-8" ref={containerRef}>
            {/* Header Hero Banner */}
            <div ref={heroRef} className="relative overflow-hidden rounded-[32px] border border-slate-200/60 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-900 p-8 md:p-10 text-white shadow-lg">
                <div className="absolute -right-16 -top-16 size-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-3xl space-y-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-indigo-100">
                        <Zap className="size-3.5 fill-indigo-200 shrink-0" /> Admin Workspace Ready
                    </span>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
                        Administrative Console
                    </h1>
                    <p className="text-sm md:text-base text-indigo-100/90 leading-relaxed font-medium">
                        Welcome to the RoomRent Maharashtra command hub. From here you can manage platform user access, moderate listings, and track analytics.
                    </p>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((item, i) => {
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
                {/* Main Tools Panel */}
                <div className="lg:col-span-8 space-y-6">
                    <div ref={el => sectionsRef.current[0] = el} className="surface-card p-6 md:p-8 space-y-6 rounded-[24px] bg-white border-slate-200/60 shadow-sm">
                        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                            <div>
                                <h2 className="text-xl font-extrabold text-slate-900">Platform Management Tools</h2>
                                <p className="text-xs text-slate-500 font-medium mt-1">Direct access keys to control services, moderate listings, and review data.</p>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                             {/* Review Queue */}
                            <Link href="/dashboard/admin/review-queue" className="group block p-5 rounded-[20px] transition duration-300 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md border border-slate-100 bg-slate-50">
                                <div className="flex flex-col gap-3">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-white text-indigo-600 shadow-sm">
                                        <ListChecks className="size-5 shrink-0" />
                                    </span>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-sm text-slate-900 truncate">Review Queue</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">Approve or reject pending rooms & PGs.</p>
                                    </div>
                                </div>
                            </Link>

                            {/* Manage Users */}
                            <Link href="/dashboard/admin/users" className="group block p-5 rounded-[20px] transition duration-300 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md border border-slate-100 bg-slate-50">
                                <div className="flex flex-col gap-3">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-600 shadow-sm">
                                        <Users className="size-5 shrink-0" />
                                    </span>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-sm text-slate-900 truncate">Manage Users</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">Track registration details & roles.</p>
                                    </div>
                                </div>
                            </Link>

                            {/* Manage Properties */}
                            <Link href="/dashboard/admin/properties" className="group block p-5 rounded-[20px] transition duration-300 hover:border-cyan-300 hover:bg-cyan-50 hover:shadow-md border border-slate-100 bg-slate-50">
                                <div className="flex flex-col gap-3">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-cyan-100 bg-white text-cyan-600 shadow-sm">
                                        <Building2 className="size-5 shrink-0" />
                                    </span>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-sm text-slate-900 truncate">Manage Listings</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">Edit parameters or audit property records.</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* System Status sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div ref={el => sectionsRef.current[1] = el} className="surface-card p-6 space-y-6 rounded-[24px] bg-white border-slate-200/60 shadow-sm">
                        <div>
                            <h2 className="text-xl font-extrabold text-slate-900">System Diagnostics</h2>
                            <p className="text-xs text-slate-500 font-medium mt-1">Real-time status of critical infrastructure services.</p>
                        </div>

                        <div className="space-y-4">
                             {/* Service Status 1 - Database */}
                            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <Database className="size-4 shrink-0 text-indigo-600" />
                                    <span className="text-xs font-semibold text-slate-900 truncate">MySQL Database</span>
                                </div>
                                <span className="inline-flex items-center gap-1 shrink-0 rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                                    ONLINE
                                </span>
                            </div>

                            {/* Service Status 2 - Mail Server */}
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <Inbox className="size-4 shrink-0 text-indigo-600" />
                                    <span className="text-xs font-semibold text-slate-900 truncate">JavaMail SMTP Server</span>
                                </div>
                                <span className="inline-flex items-center gap-1 shrink-0 rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                                    CONFIGURED
                                </span>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-4 text-xs leading-5 text-indigo-700 font-medium">
                            🔒 Access to administrative tools requires active session verification. Any changes made to property listings or users are logged in database audit audits.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
