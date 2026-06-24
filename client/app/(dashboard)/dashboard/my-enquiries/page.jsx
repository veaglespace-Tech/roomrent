"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { ArrowRight, Building, Calendar, MessageSquare, ExternalLink } from "lucide-react";
import { getMyEnquiries } from "@/services/user-service";
import gsap from "gsap";

export default function MyEnquiriesPage() {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);
    const listRef = useRef([]);

    useEffect(() => {
        getMyEnquiries()
            .then(setEnquiries)
            .catch(() => setEnquiries([]))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (loading || enquiries.length === 0) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(listRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
            );
        }, containerRef);
        return () => ctx.revert();
    }, [loading, enquiries]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500" ref={containerRef}>
            <div className="surface-card p-6 md:p-8 rounded-[24px] border border-slate-200/60 bg-white shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">History</p>
                <h1 className="mt-2 text-3xl font-extrabold text-slate-900 font-heading">My Enquiries</h1>
                <p className="mt-2 text-sm font-medium text-slate-500">Track and view enquiries sent to property publishers.</p>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 surface-card rounded-[24px] border border-slate-200/60 bg-white shadow-sm">
                        <span className="loading loading-spinner loading-lg text-indigo-500"></span>
                        <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading your enquiries...</p>
                    </div>
                ) : enquiries.length > 0 ? (
                    enquiries.map((enquiry, index) => (
                        <div 
                            key={enquiry.id} 
                            ref={el => listRef.current[index] = el}
                            className="group relative overflow-hidden rounded-[24px] border border-slate-200/60 bg-white p-6 transition-all duration-300 hover:border-indigo-300 hover:shadow-md hover:translate-y-[-2px] flex flex-col justify-between gap-4 md:flex-row md:items-center"
                        >
                            <div className="space-y-3">
                                <Link href={`/property/${enquiry.propertyId}`} className="inline-flex items-center gap-2 text-slate-900 transition-colors hover:text-indigo-600">
                                    <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-indigo-50 border border-indigo-100 text-indigo-600">
                                        <Building className="size-4 shrink-0" />
                                    </span>
                                    <span className="text-lg font-bold truncate max-w-[300px] sm:max-w-[500px]">{enquiry.propertyTitle}</span>
                                    <ExternalLink className="size-3.5 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                                </Link>
                                <div className="flex items-start gap-3 rounded-[16px] bg-slate-50 p-4 border border-slate-100">
                                    <MessageSquare className="mt-0.5 size-4 shrink-0 text-slate-400" />
                                    <p className="text-sm font-medium leading-relaxed text-slate-600 italic">"{enquiry.message}"</p>
                                </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-500 shadow-sm md:self-start mt-2 md:mt-0">
                                <Calendar className="size-3.5 shrink-0" />
                                <span>{new Date(enquiry.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center surface-card rounded-[24px] border border-dashed border-slate-300 bg-slate-50">
                        <span className="flex size-16 items-center justify-center rounded-full bg-white shadow-sm border border-slate-200 mb-4">
                            <MessageSquare className="size-6 text-slate-400" />
                        </span>
                        <p className="font-semibold text-slate-600">No enquiries submitted yet.</p>
                        <p className="mt-1 text-xs text-slate-500 max-w-[250px]">When you show interest in a property, your message will appear here.</p>
                        <Link href="/properties" className="mt-6 flex items-center gap-2 rounded-full bg-slate-900 px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-600 hover:shadow-md">
                            Browse properties <ArrowRight className="size-3 shrink-0" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
