"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, Trash2, Search, ArrowRight } from "lucide-react";
import { getSavedSearchAlerts, removeSearchAlert } from "@/lib/search-alerts";
import Link from "next/link";
import gsap from "gsap";

export default function SavedSearchesPage() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);
    const listRef = useRef([]);

    const load = async () => {
        const data = await getSavedSearchAlerts(true);
        setAlerts(data);
        setLoading(false);
    };

    useEffect(() => {
        void load();
        const refresh = async () => setAlerts(await getSavedSearchAlerts());
        window.addEventListener("roomrent-saved-search-updated", refresh);
        return () => window.removeEventListener("roomrent-saved-search-updated", refresh);
    }, []);

    useEffect(() => {
        if (loading || alerts.length === 0) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(listRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
            );
        }, containerRef);
        return () => ctx.revert();
    }, [loading, alerts.length]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500" ref={containerRef}>
            <div className="surface-card p-6 md:p-8 rounded-[24px] border border-slate-200/60 bg-white shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">Alerts</p>
                <h1 className="mt-2 text-3xl font-extrabold text-slate-900 font-heading">Saved Searches</h1>
                <p className="mt-2 text-sm font-medium text-slate-500">Search alerts that you can revisit later for the same filters.</p>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 surface-card rounded-[24px] border border-slate-200/60 bg-white shadow-sm">
                        <span className="loading loading-spinner loading-lg text-indigo-500"></span>
                        <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading search alerts...</p>
                    </div>
                ) : alerts.length > 0 ? (
                    alerts.map((alert, index) => (
                        <div 
                            key={alert.id}
                            ref={el => listRef.current[index] = el}
                            className="group relative overflow-hidden rounded-[24px] border border-slate-200/60 bg-white p-6 transition-all duration-300 hover:border-indigo-300 hover:shadow-md hover:translate-y-[-2px]"
                        >
                            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-indigo-50 border border-indigo-100 text-indigo-600">
                                            <Bell className="size-4 shrink-0" />
                                        </span>
                                        <h2 className="text-lg font-bold text-slate-900">{alert.label}</h2>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {[
                                            alert.filters.location,
                                            alert.filters.type,
                                            alert.filters.gender,
                                            alert.filters.minPrice ? `Min ₹${alert.filters.minPrice}` : "",
                                            alert.filters.maxPrice ? `Max ₹${alert.filters.maxPrice}` : ""
                                        ]
                                        .filter(Boolean)
                                        .map((filterItem, idx) => (
                                            <span key={idx} className="inline-flex items-center rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-xs font-bold text-slate-600 shadow-sm">
                                                {filterItem}
                                            </span>
                                        ))}
                                        {(!alert.filters.location && !alert.filters.type && !alert.filters.gender && !alert.filters.minPrice && !alert.filters.maxPrice) && (
                                            <span className="text-sm text-slate-500 font-medium italic">No specific filters stored</span>
                                        )}
                                    </div>
                                </div>
                                <button 
                                    type="button" 
                                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 shadow-sm transition hover:border-rose-300 hover:bg-rose-100 hover:text-rose-700 shrink-0 self-start md:self-center"
                                    onClick={async () => {
                                        await removeSearchAlert(alert.id);
                                        await load();
                                    }}
                                >
                                    <Trash2 className="size-3.5 shrink-0" /> Remove
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center surface-card rounded-[24px] border border-dashed border-slate-300 bg-slate-50">
                        <span className="flex size-16 items-center justify-center rounded-full bg-white shadow-sm border border-slate-200 mb-4">
                            <Bell className="size-6 text-slate-400" />
                        </span>
                        <p className="font-semibold text-slate-600">No saved search alerts yet.</p>
                        <p className="mt-1 text-xs text-slate-500 max-w-[250px]">Use the Save search alert button on the search page to track specific properties.</p>
                        <Link href="/properties" className="mt-6 flex items-center gap-2 rounded-full bg-slate-900 px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-600 hover:shadow-md">
                            Go to Search <ArrowRight className="size-3 shrink-0" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
