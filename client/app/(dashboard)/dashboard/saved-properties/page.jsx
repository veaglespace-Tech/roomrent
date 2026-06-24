"use client";

import { useEffect, useState, useRef } from "react";
import { PropertyCard } from "@/components/property/property-card";
import { getSavedProperties } from "@/services/user-service";
import { Bookmark, ArrowRight } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";

export default function SavedPropertiesPage() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);
    const gridRef = useRef(null);

    const loadSaved = () => {
        getSavedProperties()
            .then(setProperties)
            .catch(() => setProperties([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadSaved();
    }, []);

    useEffect(() => {
        if (loading || properties.length === 0) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(gridRef.current.children,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
            );
        }, containerRef);
        return () => ctx.revert();
    }, [loading, properties.length]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500" ref={containerRef}>
            <div className="surface-card p-6 md:p-8 rounded-[24px] border border-slate-200/60 bg-white shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">Shortlisted</p>
                <h1 className="mt-2 text-3xl font-extrabold text-slate-900 font-heading">Saved Properties</h1>
                <p className="mt-2 text-sm font-medium text-slate-500">Your shortlisted rooms and PGs ready for review.</p>
            </div>

            {loading ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 surface-card rounded-[24px] border border-slate-200/60 bg-white shadow-sm">
                    <span className="loading loading-spinner loading-lg text-indigo-500"></span>
                    <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading saved properties...</p>
                </div>
            ) : properties.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" ref={gridRef}>
                    {properties.map((property) => (
                        <div key={property.id}>
                            <PropertyCard property={property} onSavedChange={loadSaved} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center surface-card rounded-[24px] border border-dashed border-slate-300 bg-slate-50">
                    <span className="flex size-16 items-center justify-center rounded-full bg-white shadow-sm border border-slate-200 mb-4">
                        <Bookmark className="size-6 text-slate-400" />
                    </span>
                    <p className="font-semibold text-slate-600">No properties saved yet.</p>
                    <p className="mt-1 text-xs text-slate-500 max-w-[250px]">Click the bookmark icon on properties you like to save them here for later.</p>
                    <Link href="/properties" className="mt-6 flex items-center gap-2 rounded-full bg-slate-900 px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-600 hover:shadow-md">
                        Explore properties <ArrowRight className="size-3 shrink-0" />
                    </Link>
                </div>
            )}
        </div>
    );
}
