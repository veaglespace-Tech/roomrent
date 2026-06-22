"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Phone, MessageCircle, BellRing } from "lucide-react";
import { requestLead } from "@/services/user-service";
function digitsOnly(value) {
    return value.replace(/\D/g, "");
}
export function ContactButtons({ property }) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const rawPhone = property.contactNumber || "";
    const dialNumber = digitsOnly(rawPhone);
    const hasPhone = dialNumber.length >= 10;
    const message = encodeURIComponent(`Hi, I am interested in "${property.title}". Please share availability, visit timings and deposit details.`);
    const whatsappHref = hasPhone ? `https://wa.me/${dialNumber}?text=${message}` : "#";
    const handleCallback = async () => {
        try {
            setLoading(true);
            setStatus("");
            await requestLead(property.id);
            setStatus("Callback request saved. The owner can see it in their dashboard.");
        }
        catch {
            setStatus("Login required to request a callback.");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "grid gap-3 sm:grid-cols-3 lg:grid-cols-1", children: [_jsxs("a", { href: hasPhone ? `tel:${dialNumber}` : "#", "aria-disabled": !hasPhone, className: `action-button ${hasPhone ? "action-button-active" : "action-button-disabled"}`, children: [_jsx(Phone, { className: "size-4" }), "Call Now"] }), _jsxs("a", { href: hasPhone ? whatsappHref : "#", target: hasPhone ? "_blank" : undefined, "aria-disabled": !hasPhone, className: `action-button ${hasPhone ? "action-button-active" : "action-button-disabled"}`, children: [_jsx(MessageCircle, { className: "size-4" }), "WhatsApp"] }), _jsxs("button", { type: "button", onClick: handleCallback, disabled: loading, className: "action-button disabled:cursor-not-allowed disabled:opacity-60", children: [_jsx(BellRing, { className: "size-4" }), loading ? "Saving..." : "Request Callback"] })] }), status ? _jsx("p", { className: "text-sm font-medium text-base-content/70", children: status }) : null, _jsx("p", { className: "text-xs leading-6 text-base-content/55", children: "Callback requests are saved against your logged-in profile name and phone number." })] }));
}
