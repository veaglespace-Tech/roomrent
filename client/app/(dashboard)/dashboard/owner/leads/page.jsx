"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Phone, UserRound } from "lucide-react";
import api from "@/services/api";
export default function OwnerLeadsPage() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
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
                return "bg-blue-50 border-blue-100 text-blue-600";
            case "CONTACTED":
                return "bg-amber-50 border-amber-100 text-amber-700";
            case "CLOSED":
                return "bg-emerald-50 border-emerald-100 text-emerald-700";
            default:
                return "bg-slate-50 border-slate-200 text-slate-600";
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-slate-900 tracking-tight", children: "Callback Leads" }), _jsx("p", { className: "mt-1 text-sm text-slate-500", children: "Manage prospective tenants who requested a callback." })] }), loading ? (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "h-24 animate-pulse rounded-2xl bg-slate-100" }), _jsx("div", { className: "h-24 animate-pulse rounded-2xl bg-slate-100" })] })) : leads.length > 0 ? (_jsx("div", { className: "grid gap-4", children: leads.map((lead) => (_jsxs("div", { className: "flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 md:flex-row md:items-center md:justify-between hover:border-[#6366f1]/25 hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition duration-300", children: [_jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: "flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600", children: _jsx(UserRound, { className: "size-5" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-slate-800", children: lead.contactName }), _jsxs("a", { href: `tel:${lead.contactPhone}`, className: "mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600", children: [_jsx(Phone, { className: "size-3.5" }), lead.contactPhone] }), _jsxs("p", { className: "mt-1 text-xs text-slate-400", children: ["For: ", _jsx("span", { className: "font-bold text-slate-600", children: lead.propertyTitle })] })] })] }), _jsxs("div", { className: "flex items-center gap-3 md:justify-end", children: [_jsxs("select", { className: `rounded-lg border px-3 py-1.5 text-xs font-bold outline-none cursor-pointer transition ${getStatusClass(lead.status)}`, value: lead.status, onChange: (e) => updateStatus(lead.id, e.target.value), children: [_jsx("option", { value: "NEW", children: "New" }), _jsx("option", { value: "CONTACTED", children: "Contacted" }), _jsx("option", { value: "CLOSED", children: "Closed" })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-xs font-bold text-slate-400", children: new Date(lead.createdAt).toLocaleDateString() }), _jsx("p", { className: "text-xs text-slate-400", children: new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })] })] })] }, lead.id))) })) : (_jsxs("div", { className: "flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center", children: [_jsx("div", { className: "rounded-2xl bg-indigo-50 p-4 text-indigo-500", children: _jsx(UserRound, { className: "size-8" }) }), _jsx("h2", { className: "mt-4 text-xl font-bold text-slate-800", children: "No leads yet" }), _jsx("p", { className: "mt-2 text-sm text-slate-500", children: "When a user requests a callback on your properties, it will appear here." })] }))] }));
}
