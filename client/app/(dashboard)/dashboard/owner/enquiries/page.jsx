"use client";

import { useEffect, useState, useRef } from "react";
import { Building, Calendar, Mail, MessageSquare, User } from "lucide-react";
import gsap from "gsap";
import { getOwnerEnquiries } from "@/services/user-service";

export default function OwnerEnquiriesPage() {
    const [enquiries, setEnquiries] = useState([]);
    const containerRef = useRef(null);
    const headerRef = useRef(null);
    const listRef = useRef([]);

    useEffect(() => {
        getOwnerEnquiries().then(setEnquiries).catch(() => setEnquiries([]));
    }, []);

    useEffect(() => {
        if (enquiries.length === 0) return;
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
    }, [enquiries]);

    return (
        <div className="surface-card p-6 md:p-8 rounded-[24px] border border-slate-200/60 bg-white shadow-sm" ref={containerRef}>
            <div ref={headerRef}>
                <h1 className="text-3xl font-extrabold text-slate-900 font-heading">Listing Enquiries</h1>
                <p className="mt-2 text-sm font-medium text-slate-500">Manage enquiries received from interested seekers.</p>
            </div>

            <div className="mt-8 space-y-4">
                {enquiries.length > 0 ? (
                    enquiries.map((enquiry, i) => (
                        <div 
                            key={enquiry.id} 
                            ref={el => listRef.current[i] = el}
                            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 transition duration-300 hover:border-indigo-300 hover:shadow-md"
                        >
                            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-indigo-500 to-indigo-100 opacity-50 transition group-hover:opacity-100" />
                            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                                <div className="flex-1 space-y-3 min-w-0">
                                    <div className="flex items-center gap-2 text-slate-900">
                                        <Building className="size-4 shrink-0 text-indigo-500" />
                                        <span className="text-lg font-bold truncate">{enquiry.propertyTitle}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-3 text-xs font-semibold text-slate-600">
                                        <div className="flex items-center gap-1.5 rounded-xl bg-slate-50 border border-slate-100 px-3 py-1.5">
                                            <User className="size-3.5 shrink-0 text-indigo-500" />
                                            <span className="truncate max-w-[150px] sm:max-w-none">{enquiry.userName}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 rounded-xl bg-slate-50 border border-slate-100 px-3 py-1.5">
                                            <Mail className="size-3.5 shrink-0 text-indigo-500" />
                                            <span className="truncate max-w-[200px] sm:max-w-none">{enquiry.userEmail}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 rounded-[16px] border border-slate-100 bg-slate-50 p-4 text-slate-700">
                                        <MessageSquare className="mt-0.5 size-4 shrink-0 text-indigo-500" />
                                        <p className="text-sm italic leading-relaxed break-words">
                                            &quot;{enquiry.message}&quot;
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 self-start text-xs font-bold text-slate-500 md:self-center shrink-0">
                                    <Calendar className="size-4 shrink-0" />
                                    <span>
                                        {new Date(enquiry.createdAt).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric"
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rounded-[24px] border border-dashed border-slate-200 py-16 text-center bg-slate-50" ref={headerRef}>
                        <MessageSquare className="mx-auto mb-4 size-12 shrink-0 text-slate-300" />
                        <p className="font-bold text-slate-600">No enquiries received yet.</p>
                        <p className="mt-2 text-sm text-slate-400 max-w-sm mx-auto">Once room seekers ask about your listings, they will show up here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
