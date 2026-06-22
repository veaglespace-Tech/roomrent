"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Building, Calendar, MessageSquare } from "lucide-react";
import { getMyEnquiries } from "@/services/user-service";
export default function MyEnquiriesPage() {
    const [enquiries, setEnquiries] = useState([]);
    useEffect(() => {
        getMyEnquiries().then(setEnquiries).catch(() => setEnquiries([]));
    }, []);
    return (_jsxs("div", { className: "panel p-8", children: [_jsx("h1", { className: "text-3xl font-extrabold text-[#111827]", children: "My Enquiries" }), _jsx("p", { className: "mt-2 text-sm font-medium text-[#64748b]", children: "Track and view enquiries sent to property publishers." }), _jsx("div", { className: "mt-8 space-y-4", children: enquiries.length > 0 ? (enquiries.map((enquiry) => (_jsxs("div", { className: "group relative overflow-hidden rounded-2xl border border-base-300/80 bg-white/80 p-6 transition duration-300 hover:border-[#ef3d81]/30 hover:bg-white", children: [_jsx("div", { className: "absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#ef3d81] to-transparent opacity-50 transition group-hover:opacity-100" }), _jsxs("div", { className: "flex flex-col justify-between gap-4 md:flex-row md:items-center", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2 text-[#111827]", children: [_jsx(Building, { className: "size-4 text-[#ef3d81]" }), _jsx("span", { className: "text-lg font-bold", children: enquiry.propertyTitle })] }), _jsxs("div", { className: "flex items-start gap-2 text-[#64748b]", children: [_jsx(MessageSquare, { className: "mt-1 size-4 flex-shrink-0 text-[#0f9f8f]" }), _jsxs("p", { className: "text-sm italic leading-relaxed", children: ["\"", enquiry.message, "\""] })] })] }), _jsxs("div", { className: "flex items-center gap-2 self-start text-xs font-semibold text-[#64748b] md:self-center", children: [_jsx(Calendar, { className: "size-4" }), _jsx("span", { children: new Date(enquiry.createdAt).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric"
                                            }) })] })] })] }, enquiry.id)))) : (_jsxs("div", { className: "rounded-2xl border border-dashed border-base-300 py-12 text-center", children: [_jsx(MessageSquare, { className: "mx-auto mb-3 size-12 text-[#94a3b8]" }), _jsx("p", { className: "font-medium text-[#64748b]", children: "No enquiries submitted yet." }), _jsxs(Link, { href: "/properties", className: "mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#ef3d81] hover:underline", children: ["Browse properties to enquire ", _jsx(ArrowRight, { className: "size-3" })] })] })) })] }));
}
