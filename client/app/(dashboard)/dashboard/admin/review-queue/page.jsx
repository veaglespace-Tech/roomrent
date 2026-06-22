"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import api from "@/services/api";
import { PropertyCard } from "@/components/property/property-card";
export default function ReviewQueuePage() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
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
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-neutral", children: "Review Queue" }), _jsx("p", { className: "mt-1 text-sm text-base-content/70", children: "Approve or reject pending properties." })] }), loading ? (_jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [_jsx("div", { className: "h-96 animate-pulse rounded-[28px] bg-base-300" }), _jsx("div", { className: "h-96 animate-pulse rounded-[28px] bg-base-300" })] })) : properties.length > 0 ? (_jsx("div", { className: "grid gap-6 md:grid-cols-2 xl:grid-cols-3", children: properties.map((property) => (_jsxs("div", { className: "relative", children: [_jsx(PropertyCard, { property: property, onSavedChange: () => { } }), _jsxs("div", { className: "absolute inset-x-0 bottom-[-20px] z-10 flex items-center justify-center gap-3", children: [_jsxs("button", { onClick: () => handleReject(property.id), className: "flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-red-600 shadow-[0_12px_24px_-12px_rgba(220,38,38,0.5)] transition hover:bg-red-50 hover:shadow-none", children: [_jsx(X, { className: "size-5" }), "Reject"] }), _jsxs("button", { onClick: () => handleApprove(property.id), className: "flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-emerald-600 shadow-[0_12px_24px_-12px_rgba(5,150,105,0.5)] transition hover:bg-emerald-50 hover:shadow-none", children: [_jsx(Check, { className: "size-5" }), "Approve"] })] })] }, property.id))) })) : (_jsxs("div", { className: "flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-base-300 bg-base-100 p-8 text-center", children: [_jsx("div", { className: "rounded-full bg-emerald-50 p-4", children: _jsx(Check, { className: "size-8 text-emerald-500" }) }), _jsx("h2", { className: "mt-4 text-xl font-bold text-neutral", children: "All caught up!" }), _jsx("p", { className: "mt-2 text-sm text-base-content/70", children: "No properties waiting in the review queue." })] }))] }));
}
