"use client";

import { useEffect, useState, useRef } from "react";
import { Check, X, ShieldAlert } from "lucide-react";
import api from "@/services/api";
import { PropertyCard } from "@/components/property/property-card";
import gsap from "gsap";

export default function ReviewQueuePage() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    const containerRef = useRef(null);
    const headerRef = useRef(null);
    const listRef = useRef([]);

    useEffect(() => {
        const fetchQueue = async () => {
            try {
                const { data } = await api.get("/admin/moderation/queue");
                setProperties(data);
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setLoading(false);
            }
        };
        void fetchQueue();
    }, []);

    useEffect(() => {
        if (loading || properties.length === 0) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(headerRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
            gsap.fromTo(listRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.2 }
            );
        }, containerRef);
        return () => ctx.revert();
    }, [loading, properties]);

    const handleApprove = async (id) => {
        try {
            await api.post(`/admin/moderation/properties/${id}/approve`);
            setProperties((prev) => prev.filter((p) => p.id !== id));
        }
        catch (error) {
            console.error(error);
        }
    };
    const handleReject = async (id) => {
        try {
            await api.post(`/admin/moderation/properties/${id}/reject`);
            setProperties((prev) => prev.filter((p) => p.id !== id));
        }
        catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-8" ref={containerRef}>
            <div className="surface-card p-6 md:p-8 rounded-[24px] border border-slate-200/60 bg-white shadow-sm" ref={headerRef}>
                <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 font-heading">Review Queue</h1>
                        <p className="mt-2 text-sm font-medium text-slate-500">
                            Approve or reject pending properties submitted by owners.
                        </p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="h-96 animate-pulse rounded-[24px] bg-slate-100" />
                    <div className="h-96 animate-pulse rounded-[24px] bg-slate-100" />
                    <div className="h-96 animate-pulse rounded-[24px] bg-slate-100 hidden lg:block" />
                </div>
            ) : properties.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {properties.map((property, i) => (
                        <div key={property.id} ref={el => listRef.current[i] = el} className="relative group">
                            <PropertyCard property={property} onSavedChange={() => { }} />
                            <div className="absolute inset-x-0 bottom-[-20px] z-10 flex items-center justify-center gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                <button 
                                    onClick={() => handleReject(property.id)} 
                                    className="flex items-center gap-2 rounded-full border border-rose-200 bg-white px-5 py-2.5 text-sm font-bold text-rose-600 shadow-lg transition hover:bg-rose-50 hover:border-rose-300"
                                >
                                    <X className="size-4 shrink-0" />
                                    Reject
                                </button>
                                <button 
                                    onClick={() => handleApprove(property.id)} 
                                    className="flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-5 py-2.5 text-sm font-bold text-indigo-600 shadow-lg transition hover:bg-indigo-50 hover:border-indigo-300"
                                >
                                    <Check className="size-4 shrink-0" />
                                    Approve
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="surface-card flex min-h-[350px] flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center shadow-sm">
                    <div className="rounded-full bg-indigo-50 border border-indigo-100 p-5 mb-4">
                        <ShieldAlert className="size-8 shrink-0 text-indigo-500" />
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900">All caught up!</h2>
                    <p className="mt-2 text-sm font-medium text-slate-500 max-w-sm">
                        No properties are currently waiting in the review queue. New property submissions will appear here.
                    </p>
                </div>
            )}
        </div>
    );
}
