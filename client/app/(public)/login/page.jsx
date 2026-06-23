"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LogIn, Mail, Shield } from "lucide-react";
import { loginUser } from "@/services/auth-service";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/auth-slice";
import { AuthCard } from "@/components/auth-card";
import { firstZodError, loginSchema } from "@/lib/validation";
import { getApiErrorMessage } from "@/lib/api-error";
import { getDashboardRoute, getStoredAuthRole } from "@/lib/auth-session";
export default function LoginPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [registered, setRegistered] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState({ email: false, password: false });
    const validation = useMemo(() => loginSchema.safeParse({ email, password }), [email, password]);
    const fieldErrors = validation.success ? {} : validation.error.flatten().fieldErrors;
    const canSubmit = validation.success && !loading;
    useEffect(() => {
        setRegistered(new URLSearchParams(window.location.search).get("registered") === "1");
    }, []);
    useEffect(() => {
        const role = getStoredAuthRole();
        if (role) {
            router.replace(getDashboardRoute(role));
        }
    }, [router]);
    const handleSubmit = async (event) => {
        event.preventDefault();
        setTouched({ email: true, password: true });
        if (!validation.success) {
            setError(firstZodError(validation.error));
            return;
        }
        try {
            setLoading(true);
            setError("");
            setSuccess("");
            const data = await loginUser(validation.data);
            dispatch(setCredentials(data));
            setSuccess(`${data.message || "Login successful."} Redirecting...`);
            window.setTimeout(() => {
                router.replace(getDashboardRoute(data.role));
            }, 500);
        }
        catch (loginError) {
            setError(getApiErrorMessage(loginError, "Invalid email or password."));
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("section", { className: "page-shell flex min-h-[calc(100dvh-220px)] items-center py-10", children: _jsx(AuthCard, { title: "Log in", description: "Use your account to access saved properties, owner tools, enquiries, and admin controls.", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", noValidate: true, children: [registered ? (_jsx("p", { className: "rounded-xl border border-[rgba(83,211,138,0.35)] bg-[rgba(83,211,138,0.12)] px-4 py-3 text-sm font-medium text-[var(--rf-success)]", role: "status", "aria-live": "polite", children: "Registration complete. Sign in to continue." })) : null, success ? (_jsx("p", { className: "rounded-xl border border-[rgba(83,211,138,0.35)] bg-[rgba(83,211,138,0.12)] px-4 py-3 text-sm font-medium text-[var(--rf-success)]", role: "status", "aria-live": "polite", children: success })) : null, error ? (_jsx("p", { className: "rounded-xl border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.08)] px-4 py-3 text-sm font-medium text-error", role: "alert", "aria-live": "assertive", children: error })) : null, _jsxs("label", { className: "auth-field block", children: [_jsx(Mail, { className: "auth-field-icon" }), _jsx("input", { className: `form-input auth-field-control ${touched.email && fieldErrors.email?.[0] ? "auth-field-control-error" : ""}`, type: "email", autoComplete: "email", placeholder: "Email address", value: email, onChange: (e) => setEmail(e.target.value), onBlur: () => setTouched((current) => ({ ...current, email: true })), "aria-invalid": touched.email && Boolean(fieldErrors.email?.[0]) }), touched.email && fieldErrors.email?.[0] ? _jsx("p", { className: "mt-1 text-xs font-semibold text-error", children: fieldErrors.email[0] }) : null] }), _jsxs("label", { className: "auth-field block", children: [_jsx(Shield, { className: "auth-field-icon" }), _jsx("input", { className: `form-input auth-field-control ${touched.password && fieldErrors.password?.[0] ? "auth-field-control-error" : ""}`, type: showPassword ? "text" : "password", autoComplete: "current-password", placeholder: "Password", value: password, onChange: (e) => setPassword(e.target.value), onBlur: () => setTouched((current) => ({ ...current, password: true })), "aria-invalid": touched.password && Boolean(fieldErrors.password?.[0]) }), _jsx("button", { type: "button", onClick: () => setShowPassword((current) => !current), className: "absolute right-4 top-1/2 -translate-y-1/2 text-[var(--rf-muted)] transition hover:text-[var(--rf-cyan)]", "aria-label": showPassword ? "Hide password" : "Show password", children: showPassword ? _jsx(EyeOff, { className: "size-4" }) : _jsx(Eye, { className: "size-4" }) }), touched.password && fieldErrors.password?.[0] ? _jsx("p", { className: "mt-1 text-xs font-semibold text-error", children: fieldErrors.password[0] }) : null] }), _jsxs("div", { className: "flex items-center justify-between gap-3 text-sm", children: [_jsx(Link, { href: "/forgot-password", className: "font-medium text-[var(--rf-cyan)] hover:underline", children: "Forgot password?" }), _jsx(Link, { href: "/register", className: "font-medium text-[var(--rf-cyan)] hover:underline", children: "Create account" })] }), _jsxs("button", { className: "glow-button h-14 w-full disabled:cursor-not-allowed disabled:opacity-60", disabled: !canSubmit, children: [_jsx(LogIn, { className: "relative size-4" }), loading ? "Logging in..." : "Continue"] })] }) }) }));
}


