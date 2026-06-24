"use client";

import { useEffect, useState, useRef } from "react";
import { Phone, UserRound } from "lucide-react";
import api from "@/services/api";
import gsap from "gsap";

export default function OwnerLeadsPage() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    const containerRef = useRef(null);
    const headerRef = useRef(null);
    const listRef = useRef([]);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const { data } = await api.get("/owner/leads");
                setLeads(data);
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setLoading(false);
            }
        };
        void fetchLeads();
    }, []);

    useEffect(() => {
        if (loading || leads.length === 0) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(headerRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
            gsap.fromTo(listRef.current,
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, ease: "power2.out", delay: 0.2 }
            );
        }, containerRef);
        return () => ctx.revert();
    }, [loading, leads]);

    const updateStatus = async (id, status) => {
        try {
            const { data } = await api.put(`/owner/leads/${id}/status`, { status });
            setLeads((prev) => prev.map((l) => (l.id === id ? data : l)));
        }
        catch (error) {
            console.error(error);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "NEW":
                return "bg-blue-50 border-blue-200 text-blue-700";
            case "CONTACTED":
                return "bg-amber-50 border-amber-200 text-amber-800";
            case "CLOSED":
                return "bg-indigo-50 border-indigo-200 text-indigo-700";
            default:
                return "bg-slate-50 border-slate-200 text-slate-700";
        }
    };

    return (
        <div className="space-y-6" ref={containerRef}>
            <div className="surface-card p-6 md:p-8 rounded-[24px] border border-slate-200/60 bg-white shadow-sm" ref={headerRef}>
                <h1 className="text-3xl font-extrabold text-slate-900 font-heading">Callback Leads</h1>
                <p className="mt-2 text-sm font-medium text-slate-500">
                    Manage prospective tenants who requested a callback.
                </p>
            </div>

            {loading ? (
                <div className="space-y-4">
                    <div className="h-24 animate-pulse rounded-[24px] bg-slate-100" />
                    <div className="h-24 animate-pulse rounded-[24px] bg-slate-100" />
                </div>
            ) : leads.length > 0 ? (
                <div className="grid gap-4">
                    {leads.map((lead, i) => (
                        <div key={lead.id} ref={el => listRef.current[i] = el} className="flex flex-col gap-4 rounded-[24px] border border-slate-200/60 bg-white p-5 md:flex-row md:items-center md:justify-between shadow-sm hover:border-indigo-300 hover:shadow-md transition duration-300">
                            <div className="flex gap-4 min-w-0">
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-indigo-50 text-indigo-600">
                                    <UserRound className="size-5 shrink-0" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-slate-900 truncate">{lead.contactName}</h3>
                                    <a href={`tel:${lead.contactPhone}`} className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 truncate">
                                        <Phone className="size-3.5 shrink-0" />
                                        {lead.contactPhone}
                                    </a>
                                    <p className="mt-1 text-xs text-slate-400 truncate">
                                        For: <span className="font-bold text-slate-700">{lead.propertyTitle}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 md:justify-end shrink-0">
                                <select 
                                    className={`rounded-xl border px-3 py-1.5 text-xs font-bold outline-none cursor-pointer transition focus:ring-4 focus:ring-indigo-500/10 ${getStatusClass(lead.status)}`} 
                                    value={lead.status} 
                                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                                >
                                    <option value="NEW">New</option>
                                    <option value="CONTACTED">Contacted</option>
                                    <option value="CLOSED">Closed</option>
                                </select>
                                <div className="text-right shrink-0">
                                    <p className="text-xs font-bold text-slate-500">{new Date(lead.createdAt).toLocaleDateString()}</p>
                                    <p className="text-xs text-slate-400">{new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="surface-card flex min-h-[300px] flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-slate-50 py-12 text-center shadow-sm">
                    <div className="rounded-full bg-indigo-50 border border-indigo-100 p-5 mb-4 text-indigo-500">
                        <UserRound className="size-8 shrink-0" />
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900">No leads yet</h2>
                    <p className="mt-2 text-sm font-medium text-slate-500 max-w-sm">
                        When a user requests a callback on your properties, it will appear here.
                    </p>
                </div>
            )}
        </div>
    );
}
