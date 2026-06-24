"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Eye, EyeOff, Shield, KeyRound } from "lucide-react";
import { AuthCard } from "@/components/auth-card";
import { firstZodError, resetPasswordSchema } from "@/lib/validation";
import { resetPassword } from "@/services/auth-service";
import { getApiErrorMessage } from "@/lib/api-error";
export default function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    useEffect(() => {
        setToken(searchParams.get("token") || "");
    }, [searchParams]);
    const handleSubmit = async (event) => {
        event.preventDefault();
        const parsed = resetPasswordSchema.safeParse({ token, newPassword, confirmPassword });
        if (!parsed.success) {
            setError(firstZodError(parsed.error));
            return;
        }
        try {
            setLoading(true);
            setError("");
            const data = await resetPassword({ token: parsed.data.token, newPassword: parsed.data.newPassword });
            setMessage(data.message || "Password updated successfully.");
            setTimeout(() => router.push("/login"), 1200);
        }
        catch (error) {
            setError(getApiErrorMessage(error, "Unable to reset password. The link may have expired."));
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("section", { className: "page-shell flex min-h-[calc(100dvh-220px)] items-center py-10", children: _jsx(AuthCard, { title: "Reset password", description: "Enter the new password for your account.", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [_jsxs("label", { className: "auth-field", children: [_jsx(KeyRound, { className: "auth-field-icon" }), _jsx("input", { className: "form-input auth-field-control", autoComplete: "one-time-code", placeholder: "Reset token", value: token, onChange: (e) => setToken(e.target.value) })] }), _jsxs("label", { className: "auth-field", children: [_jsx(Shield, { className: "auth-field-icon" }), _jsx("input", { className: "form-input auth-field-control pr-12", type: showPassword ? "text" : "password", autoComplete: "new-password", placeholder: "New password", value: newPassword, onChange: (e) => setNewPassword(e.target.value) }), _jsx("button", { type: "button", onClick: () => setShowPassword((current) => !current), className: "absolute right-4 top-1/2 -translate-y-1/2 text-base-content/50 transition hover:text-[#0f172a]", "aria-label": showPassword ? "Hide password" : "Show password", children: showPassword ? _jsx(EyeOff, { className: "size-4" }) : _jsx(Eye, { className: "size-4" }) })] }), _jsxs("label", { className: "auth-field", children: [_jsx(CheckCircle2, { className: "auth-field-icon" }), _jsx("input", { className: "form-input auth-field-control pr-12", type: showConfirmPassword ? "text" : "password", autoComplete: "new-password", placeholder: "Confirm password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value) }), _jsx("button", { type: "button", onClick: () => setShowConfirmPassword((current) => !current), className: "absolute right-4 top-1/2 -translate-y-1/2 text-base-content/50 transition hover:text-[#0f172a]", "aria-label": showConfirmPassword ? "Hide confirm password" : "Show confirm password", children: showConfirmPassword ? _jsx(EyeOff, { className: "size-4" }) : _jsx(Eye, { className: "size-4" }) })] }), message ? _jsx("p", { className: "rounded-[16px] border border-indigo-400/20 bg-indigo-400/10 px-4 py-3 text-sm font-semibold text-indigo-300", children: message }) : null, error ? _jsx("p", { className: "text-sm text-error", children: error }) : null, _jsx("button", { className: "glow-button h-14 w-full", disabled: loading, children: loading ? "Updating..." : "Update password" }), _jsxs("div", { className: "flex items-center justify-between text-sm font-semibold", children: [_jsx(Link, { href: "/login", className: "text-[var(--rf-cyan)] hover:underline", children: "Back to login" }), _jsx(Link, { href: "/forgot-password", className: "text-[#ef3d81] hover:underline", children: "Request new link" })] })] }) }) }));
}
