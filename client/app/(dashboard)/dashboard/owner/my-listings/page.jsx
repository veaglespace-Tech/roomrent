"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { ArrowRight, BadgeIndianRupee, Building, MapPin, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import { deleteProperty, getOwnerProperties } from "@/services/property-service";
import gsap from "gsap";

export default function MyListingsPage() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const containerRef = useRef(null);
    const headerRef = useRef(null);
    const statsRef = useRef([]);
    const listRef = useRef([]);

    const loadListings = () => {
        setLoading(true);
        getOwnerProperties()
            .then(setProperties)
            .catch(() => setProperties([]))
            .finally(() => setLoading(false));
    };

    const activeProperties = properties.filter((property) => (property.availabilityStatus || "AVAILABLE") === "AVAILABLE");
    const totalValue = properties.reduce((sum, property) => sum + (property.price || 0), 0);
    const averageRent = properties.length > 0 ? Math.round(totalValue / properties.length) : 0;
    
    useEffect(() => {
        loadListings();
    }, []);

    useEffect(() => {
        if (loading) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(headerRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
            gsap.fromTo(statsRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.1 }
            );
            if (properties.length > 0) {
                gsap.fromTo(listRef.current,
                    { opacity: 0, x: -20 },
                    { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, ease: "power2.out", delay: 0.2 }
                );
            }
        }, containerRef);
        return () => ctx.revert();
    }, [loading, properties]);

    return (
        <div className="space-y-6" ref={containerRef}>
            <div className="surface-card p-6 md:p-8 rounded-[24px] border border-slate-200/60 bg-white shadow-sm" ref={headerRef}>
                <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 font-heading">My Listings</h1>
                        <p className="mt-2 text-sm font-medium text-slate-500">
                            Manage and edit your published properties.
                        </p>
                    </div>
                    <Link href="/dashboard/owner/add-property" className="flex items-center gap-1.5 rounded-[12px] bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 self-start sm:self-center">
                        <Plus className="size-4 shrink-0" />
                        Add Property
                    </Link>
                </div>
            </div>

            {!loading && (
                <div className="grid gap-4 md:grid-cols-3">
                    {[
                        { label: "Total listings", value: properties.length, hint: "All published properties" },
                        { label: "Active listings", value: activeProperties.length, hint: "Currently available" },
                        { label: "Average rent", value: averageRent ? `Rs. ${averageRent}` : "Rs. 0", hint: "Across your inventory" }
                    ].map((item, i) => (
                        <div key={item.label} ref={el => statsRef.current[i] = el} className="surface-card p-6 rounded-[24px] border border-slate-200/60 bg-white shadow-sm transition hover:shadow-md hover:border-indigo-200">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">{item.label}</p>
                                    <p className="mt-3 text-3xl font-extrabold text-slate-900">{item.value}</p>
                                    <p className="mt-2 text-sm text-slate-500">{item.hint}</p>
                                </div>
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                                    <Sparkles className="size-5 shrink-0" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="space-y-4">
                {loading ? (
                    <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 surface-card rounded-[24px] border border-slate-200/60 bg-slate-50/50">
                        <span className="loading loading-spinner loading-md text-indigo-500"></span>
                        <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading listings...</p>
                    </div>
                ) : properties.length > 0 ? (
                    properties.map((property, i) => (
                        <div key={property.id} ref={el => listRef.current[i] = el} className="group relative overflow-hidden rounded-[24px] border border-slate-200/60 bg-white p-6 shadow-sm transition duration-300 hover:border-indigo-300 hover:shadow-md">
                            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-indigo-500 to-indigo-300 opacity-0 transition group-hover:opacity-100" />
                            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                                <div className="flex-1 space-y-3 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 shrink-0">
                                            {property.type}
                                        </span>
                                        {property.category && (
                                            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-700 shrink-0">
                                                {property.category}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 truncate" title={property.title}>{property.title}</h3>
                                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <MapPin className="size-4 shrink-0 text-indigo-500" />
                                            <span className="truncate" title={property.location}>{property.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <BadgeIndianRupee className="size-4 shrink-0 text-indigo-500" />
                                            <span className="font-semibold text-slate-900">Rs. {property.price} / month</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 self-end lg:self-center shrink-0">
                                    <Link 
                                        href={`/dashboard/owner/edit-property/${property.id}`}
                                        className="flex items-center gap-1.5 rounded-[12px] border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600"
                                    >
                                        <Pencil className="size-3.5 shrink-0" />
                                        Edit
                                    </Link>
                                    <button 
                                        onClick={async () => {
                                            if (confirm("Are you sure you want to delete this listing?")) {
                                                await deleteProperty(property.id);
                                                loadListings();
                                            }
                                        }}
                                        className="flex items-center gap-1.5 rounded-[12px] border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 shadow-sm transition hover:border-rose-300 hover:bg-rose-100"
                                    >
                                        <Trash2 className="size-3.5 shrink-0" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="surface-card flex min-h-[300px] flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-slate-50 py-12 text-center shadow-sm">
                        <Building className="mx-auto mb-3 size-12 shrink-0 text-slate-300" />
                        <p className="font-medium text-slate-600">You haven&apos;t listed any properties yet.</p>
                        <p className="mt-1 text-xs text-slate-400">Activate a plan and list your first accommodation.</p>
                        <Link href="/dashboard/owner/add-property" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
                            Add your first listing <ArrowRight className="size-3 shrink-0" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
