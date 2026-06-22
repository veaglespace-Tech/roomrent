"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { MessageCircle, SendHorizonal } from "lucide-react";
import { sendEnquiry } from "@/services/user-service";
import { enquirySchema, firstZodError } from "@/lib/validation";
export function EnquiryForm({ propertyId }) {
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (event) => {
        event.preventDefault();
        const parsed = enquirySchema.safeParse({ message });
        if (!parsed.success) {
            setStatus(firstZodError(parsed.error));
            return;
        }
        try {
            setLoading(true);
            await sendEnquiry(propertyId, parsed.data.message);
            setMessage("");
            setStatus("Enquiry sent successfully.");
        }
        catch {
            setStatus("Unable to send enquiry. Please login and try again.");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "form-glass space-y-4 p-5", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "icon-tile shrink-0", children: _jsx(MessageCircle, { className: "size-5" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold", children: "Send Enquiry" }), _jsx("p", { className: "text-sm text-base-content/70", children: "Ask about availability, deposit and visit timings." })] })] }), _jsxs("label", { className: "form-glass-field block", children: [_jsx("span", { className: "block text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50", children: "Message" }), _jsx("textarea", { className: "mt-2 min-h-36 w-full resize-none bg-transparent text-sm outline-none", placeholder: "Hi, I am interested in this property. Please share availability, deposit, and visit timings.", value: message, onChange: (event) => setMessage(event.target.value) })] }), status ? _jsx("p", { className: "text-sm text-base-content/70", children: status }) : null, _jsxs("button", { type: "submit", className: "glow-button", disabled: loading, children: [_jsx(SendHorizonal, { className: "relative size-4" }), loading ? "Sending..." : "Send Enquiry"] })] }));
}
