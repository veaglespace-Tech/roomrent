"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { Bookmark, Building2, Search, MessageSquareMore, ArrowRight, UserRound, HeartHandshake, Eye, History, ShieldAlert } from "lucide-react";
import gsap from "gsap";
import { getProfile, getSavedProperties, getMyEnquiries } from "@/services/user-service";
import { getCompareIds } from "@/lib/compare-store";
import Image from "next/image";

export default function UserDashboardPage() {
    const [profile, setProfile] = useState(null);
    const [savedCount, setSavedCount] = useState(0);
    const [enquiryCount, setEnquiryCount] = useState(0);
    const [compareCount, setCompareCount] = useState(0);
    const [recentlyViewed, setRecentlyViewed] = useState([]);

    const containerRef = useRef(null);
    const statsRef = useRef([]);
    const sectionsRef = useRef([]);

    useEffect(() => {
        getProfile().then(setProfile).catch(() => setProfile(null));
        getSavedProperties().then((items) => setSavedCount(items.length)).catch(() => setSavedCount(0));
        getMyEnquiries().then((items) => setEnquiryCount(items.length)).catch(() => setEnquiryCount(0));
        getCompareIds().then((ids) => setCompareCount(ids.length)).catch(() => setCompareCount(0));
        
        try {
            const raw = localStorage.getItem("recently_viewed");
            if (raw) {
                setRecentlyViewed(JSON.parse(raw));
            }
        } catch (e) {
            console.error("Failed to load recently viewed from localStorage", e);
        }
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(statsRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
            );
            gsap.fromTo(sectionsRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power2.out", delay: 0.2 }
            );
        }, containerRef);
        return () => ctx.revert();
    }, [recentlyViewed]);

    const cards = useMemo(() => [
        { label: "Saved items", value: savedCount, href: "/dashboard/saved-properties", icon: Bookmark },
        { label: "My enquiries", value: enquiryCount, href: "/dashboard/my-enquiries", icon: MessageSquareMore },
        { label: "Compare list", value: compareCount, href: "/compare", icon: HeartHandshake },
        { label: "Profile", value: profile?.role ?? "USER", href: "/dashboard/profile", icon: UserRound }
    ], [compareCount, enquiryCount, profile?.role, savedCount]);

    const activities = useMemo(() => {
        const list = [];
        if (recentlyViewed.length > 0) {
            recentlyViewed.slice(0, 3).forEach((item) => {
                list.push({
                    text: `Viewed property "${item.title}"`,
                    meta: item.location,
                    icon: Eye,
                    time: "Recently"
                });
            });
        }
        if (savedCount > 0) {
            list.push({
                text: `${savedCount} listings saved in your list`,
                meta: "Ready to review or enquire",
                icon: Bookmark,
                time: "Active"
            });
        }
        if (compareCount > 0) {
            list.push({
                text: `${compareCount} listings in comparison stack`,
                meta: "Side-by-side active",
                icon: HeartHandshake,
                time: "Active"
            });
        }
        if (enquiryCount > 0) {
            list.push({
                text: `Submitted ${enquiryCount} interest enquiries`,
                meta: "Waiting for owner response",
                icon: MessageSquareMore,
                time: "In Progress"
            });
        }
        if (list.length === 0) {
            list.push({
                text: "No recent workspace activities",
                meta: "Explore listings to get started",
                icon: History,
                time: "Get Started"
            });
        }
        return list;
    }, [recentlyViewed, savedCount, compareCount, enquiryCount]);

    return (
        <div className="space-y-6" ref={containerRef}>
            <div ref={el => sectionsRef.current[0] = el} className="surface-card p-6 md:p-8 rounded-[24px] border border-slate-200/60 bg-white shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">User workspace</p>
                <h1 className="mt-3 text-3xl font-bold font-heading text-slate-900">
                    Welcome{profile?.name ? `, ${profile.name.split(" ")[0]}` : ""}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
                    Your search, saved listings, enquiries, and comparison workspace live here.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((item, i) => {
                    const Icon = item.icon;
                    return (
                        <Link 
                            key={item.label}
                            ref={el => statsRef.current[i] = el}
                            href={item.href} 
                            className="surface-card p-5 transition hover:-translate-y-1 rounded-[24px] border border-slate-200/60 bg-white shadow-sm block group"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-xs uppercase tracking-[0.18em] text-slate-500 font-bold">{item.label}</p>
                                <span className="icon-tile flex size-10 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 transition-colors group-hover:bg-indigo-500 group-hover:text-white">
                                    <Icon className="size-4 shrink-0" />
                                </span>
                            </div>
                            <div className="mt-5 text-3xl font-extrabold text-slate-900 font-heading">{item.value}</div>
                        </Link>
                    );
                })}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-6">
                    {recentlyViewed.length > 0 && (
                        <div ref={el => sectionsRef.current[1] = el} className="surface-card p-6 rounded-[24px] border border-slate-200/60 bg-white shadow-sm">
                            <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
                                <Eye className="size-5 shrink-0 text-indigo-500" />
                                Recently Viewed Properties
                            </h2>
                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                {recentlyViewed.slice(0, 4).map((item) => (
                                    <Link 
                                        key={item.id}
                                        href={`/property/${item.id}`}
                                        className="flex gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:border-indigo-300 hover:shadow-md transition-all group"
                                    >
                                        <div className="relative size-16 rounded-[12px] overflow-hidden shrink-0">
                                            <Image 
                                                src={item.imageUrls?.[0] || "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"} 
                                                alt={item.title} 
                                                fill 
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-grow flex flex-col justify-between">
                                            <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                                            <p className="text-[11px] font-semibold text-slate-500 truncate">{item.location}</p>
                                            <p className="text-sm font-extrabold text-indigo-600 font-heading">
                                                ₹{item.price > 0 ? item.price.toLocaleString("en-IN") : "On request"}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    <div ref={el => sectionsRef.current[2] = el} className="surface-card p-6 rounded-[24px] border border-slate-200/60 bg-white shadow-sm">
                        <h2 className="text-xl font-bold font-heading text-slate-900">Quick actions</h2>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <Link href="/properties" className="landing-primary-button w-full shadow-sm">
                                <Search className="size-4 shrink-0" />
                                Search properties
                            </Link>
                            <Link href="/dashboard/saved-properties" className="landing-secondary-button w-full shadow-sm bg-slate-50 border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300">
                                <Bookmark className="size-4 shrink-0" />
                                Open saved items
                            </Link>
                            <Link href="/dashboard/my-enquiries" className="landing-secondary-button w-full shadow-sm bg-slate-50 border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300">
                                <MessageSquareMore className="size-4 shrink-0" />
                                View enquiries
                            </Link>
                            <Link href="/compare" className="landing-secondary-button w-full shadow-sm bg-slate-50 border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300">
                                <Building2 className="size-4 shrink-0" />
                                Compare listings
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div ref={el => sectionsRef.current[3] = el} className="surface-card p-6 rounded-[24px] border border-slate-200/60 bg-white shadow-sm">
                        <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
                            <History className="size-5 shrink-0 text-indigo-500" />
                            Recent Activity
                        </h2>
                        <div className="mt-4 space-y-4">
                            {activities.map((act, index) => {
                                const ActIcon = act.icon;
                                return (
                                    <div key={index} className="flex gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                        <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-indigo-100 border border-indigo-200 text-indigo-600">
                                            <ActIcon className="size-4 shrink-0" />
                                        </span>
                                        <div className="min-w-0 flex flex-col justify-center">
                                            <p className="text-xs font-bold text-slate-900 leading-snug">{act.text}</p>
                                            <p className="text-[11px] font-semibold text-slate-500 mt-0.5 truncate">{act.meta}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div ref={el => sectionsRef.current[4] = el} className="surface-card p-6 rounded-[24px] border border-slate-200/60 bg-white shadow-sm">
                        <h2 className="text-xl font-bold font-heading text-slate-900">Account status</h2>
                        <div className="mt-4 space-y-3 text-sm text-slate-600 font-medium">
                            <p className="flex items-center gap-2">
                                <ShieldAlert className="size-4 shrink-0 text-indigo-500" />
                                Role: <span className="font-bold text-slate-900">USER</span>
                            </p>
                            <p className="text-xs leading-relaxed">
                                Visible pages: saved items, enquiries, compare, profile.
                            </p>
                            <p className="text-xs leading-relaxed">
                                Protected actions redirect through login before access.
                            </p>
                        </div>
                        <Link href="/dashboard/profile" className="landing-primary-button mt-6 w-full shadow-sm">
                            Open profile
                            <ArrowRight className="size-4 shrink-0" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
