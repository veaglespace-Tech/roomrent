"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Link from "next/link";
import { Mail, Send } from "lucide-react";
import { AuthCard } from "@/components/auth-card";
import { firstZodError, forgotPasswordSchema } from "@/lib/validation";
import { requestPasswordReset } from "@/services/auth-service";
import { getApiErrorMessage } from "@/lib/api-error";
export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (event) => {
        event.preventDefault();
        const parsed = forgotPasswordSchema.safeParse({ email });
        if (!parsed.success) {
            setError(firstZodError(parsed.error));
            return;
        }
        try {
            setLoading(true);
            setError("");
            const data = await requestPasswordReset(parsed.data);
            setMessage(data.message || "If the email exists, a reset link has been sent.");
        }
        catch (error) {
            setError(getApiErrorMessage(error, "Unable to request reset right now."));
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("section", { className: "page-shell flex min-h-[calc(100dvh-220px)] items-center py-10", children: _jsx(AuthCard, { title: "Forgot password", description: "Enter your email and we will send a password reset link.", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [_jsxs("label", { className: "auth-field", children: [_jsx(Mail, { className: "auth-field-icon" }), _jsx("input", { className: "form-input auth-field-control", placeholder: "Email address", value: email, onChange: (e) => setEmail(e.target.value) })] }), message ? _jsx("p", { className: "rounded-[16px] border border-indigo-400/20 bg-indigo-400/10 px-4 py-3 text-sm font-semibold text-indigo-300", children: message }) : null, error ? _jsx("p", { className: "text-sm text-error", children: error }) : null, _jsxs("button", { className: "glow-button h-14 w-full", disabled: loading, children: [_jsx(Send, { className: "relative size-4" }), loading ? "Sending..." : "Send reset link"] }), _jsxs("div", { className: "flex items-center justify-between text-sm font-semibold", children: [_jsx(Link, { href: "/login", className: "text-[var(--rf-cyan)] hover:underline", children: "Back to login" }), _jsx(Link, { href: "/register", className: "text-[#ef3d81] hover:underline", children: "Create account" })] })] }) }) }));
}
