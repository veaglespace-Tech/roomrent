"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Eye, EyeOff, Mail, Phone, Shield, UserRound, UserPlus } from "lucide-react";
import { registerUser } from "@/services/auth-service";
import { AuthCard } from "@/components/auth-card";
import { firstZodError, registerSchema } from "@/lib/validation";
import { getApiErrorMessage } from "@/lib/api-error";
export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        accountType: "OWNER"
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [touched, setTouched] = useState({
        firstName: false,
        lastName: false,
        phone: false,
        email: false,
        password: false,
        confirmPassword: false,
        accountType: false
    });
    const validation = useMemo(() => registerSchema.safeParse(form), [form]);
    const fieldErrors = validation.success ? {} : validation.error.flatten().fieldErrors;
    const canSubmit = validation.success && !loading;
    const handleSubmit = async (event) => {
        event.preventDefault();
        setTouched({
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
            password: true,
            confirmPassword: true,
            accountType: true
        });
        if (!validation.success) {
            setError(firstZodError(validation.error));
            return;
        }
        try {
            setLoading(true);
            setError("");
            setSuccess("");
            const name = `${validation.data.firstName} ${validation.data.lastName || ""}`.trim();
            await registerUser({
                name,
                phone: validation.data.phone,
                email: validation.data.email,
                password: validation.data.password,
                role: validation.data.accountType
            });
            setSuccess(`${data.message || "Registration successful."} Redirecting to login...`);
            window.setTimeout(() => {
                router.push("/login?registered=1");
            }, 700);
        }
        catch (registerError) {
            setError(getApiErrorMessage(registerError, "Unable to register. Use a different email or verify the form."));
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("section", { className: "page-shell flex min-h-[calc(100dvh-220px)] items-center py-10", children: _jsx(AuthCard, { title: "Register", description: "Create a user account for room search, enquiries, saved properties, and listing tools after plan activation.", children: _jsxs("form", { onSubmit: handleSubmit, className: "grid gap-5 md:grid-cols-2", noValidate: true, children: [success ? (_jsx("p", { className: "rounded-xl border border-[rgba(83,211,138,0.35)] bg-[rgba(83,211,138,0.12)] px-4 py-3 text-sm font-medium text-[var(--rf-success)] md:col-span-2", role: "status", "aria-live": "polite", children: success })) : null, error ? (_jsx("p", { className: "rounded-xl border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.08)] px-4 py-3 text-sm font-medium text-error md:col-span-2", role: "alert", "aria-live": "assertive", children: error })) : null, _jsxs("label", { className: "auth-field block", children: [_jsx(UserRound, { className: "auth-field-icon" }), _jsx("input", { className: `form-input auth-field-control ${touched.firstName && fieldErrors.firstName?.[0] ? "auth-field-control-error" : ""}`, placeholder: "Name *", value: form.firstName, onChange: (e) => setForm({ ...form, firstName: e.target.value }), onBlur: () => setTouched((current) => ({ ...current, firstName: true })), "aria-invalid": touched.firstName && Boolean(fieldErrors.firstName?.[0]) }), touched.firstName && fieldErrors.firstName?.[0] ? _jsx("p", { className: "mt-1 text-xs font-semibold text-error", children: fieldErrors.firstName[0] }) : null] }), _jsxs("label", { className: "auth-field block", children: [_jsx(UserRound, { className: "auth-field-icon" }), _jsx("input", { className: `form-input auth-field-control ${touched.lastName && fieldErrors.lastName?.[0] ? "auth-field-control-error" : ""}`, placeholder: "Last name", value: form.lastName, onChange: (e) => setForm({ ...form, lastName: e.target.value }), onBlur: () => setTouched((current) => ({ ...current, lastName: true })), "aria-invalid": touched.lastName && Boolean(fieldErrors.lastName?.[0]) }), touched.lastName && fieldErrors.lastName?.[0] ? _jsx("p", { className: "mt-1 text-xs font-semibold text-error", children: fieldErrors.lastName[0] }) : null] }), _jsxs("label", { className: "auth-field md:col-span-2 block", children: [_jsx(Phone, { className: "auth-field-icon" }), _jsx("input", { className: `form-input auth-field-control ${touched.phone && fieldErrors.phone?.[0] ? "auth-field-control-error" : ""}`, inputMode: "numeric", placeholder: "Mobile number (10 digits)", value: form.phone, onChange: (e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }), onBlur: () => setTouched((current) => ({ ...current, phone: true })), "aria-invalid": touched.phone && Boolean(fieldErrors.phone?.[0]) }), touched.phone && fieldErrors.phone?.[0] ? _jsx("p", { className: "mt-1 text-xs font-semibold text-error", children: fieldErrors.phone[0] }) : null] }), _jsxs("label", { className: "auth-field md:col-span-2 block", children: [_jsx(Mail, { className: "auth-field-icon" }), _jsx("input", { className: `form-input auth-field-control ${touched.email && fieldErrors.email?.[0] ? "auth-field-control-error" : ""}`, type: "email", autoComplete: "email", placeholder: "Email address", value: form.email, onChange: (e) => setForm({ ...form, email: e.target.value }), onBlur: () => setTouched((current) => ({ ...current, email: true })), "aria-invalid": touched.email && Boolean(fieldErrors.email?.[0]) }), touched.email && fieldErrors.email?.[0] ? _jsx("p", { className: "mt-1 text-xs font-semibold text-error", children: fieldErrors.email[0] }) : null] }), _jsxs("label", { className: "auth-field md:col-span-2 block", children: [_jsx(Shield, { className: "auth-field-icon" }), _jsx("input", { className: `form-input auth-field-control ${touched.password && fieldErrors.password?.[0] ? "auth-field-control-error" : ""}`, type: showPassword ? "text" : "password", autoComplete: "new-password", placeholder: "Password *", value: form.password, onChange: (e) => setForm({ ...form, password: e.target.value }), onBlur: () => setTouched((current) => ({ ...current, password: true })), "aria-invalid": touched.password && Boolean(fieldErrors.password?.[0]) }), _jsx("button", { type: "button", onClick: () => setShowPassword((current) => !current), className: "absolute right-4 top-1/2 -translate-y-1/2 text-[var(--rf-muted)] transition hover:text-[var(--rf-cyan)]", "aria-label": showPassword ? "Hide password" : "Show password", children: showPassword ? _jsx(EyeOff, { className: "size-4" }) : _jsx(Eye, { className: "size-4" }) }), touched.password && fieldErrors.password?.[0] ? _jsx("p", { className: "mt-1 text-xs font-semibold text-error", children: fieldErrors.password[0] }) : null, _jsx("p", { className: "mt-1 text-xs text-[var(--rf-muted)]", children: "Use 8+ characters with upper, lower, number, and symbol." })] }), _jsxs("label", { className: "auth-field md:col-span-2 block", children: [_jsx(CheckCircle2, { className: "auth-field-icon" }), _jsx("input", { className: `form-input auth-field-control ${touched.confirmPassword && fieldErrors.confirmPassword?.[0] ? "auth-field-control-error" : ""}`, type: showConfirmPassword ? "text" : "password", autoComplete: "new-password", placeholder: "Confirm password *", value: form.confirmPassword, onChange: (e) => setForm({ ...form, confirmPassword: e.target.value }), onBlur: () => setTouched((current) => ({ ...current, confirmPassword: true })), "aria-invalid": touched.confirmPassword && Boolean(fieldErrors.confirmPassword?.[0]) }), _jsx("button", { type: "button", onClick: () => setShowConfirmPassword((current) => !current), className: "absolute right-4 top-1/2 -translate-y-1/2 text-[var(--rf-muted)] transition hover:text-[var(--rf-cyan)]", "aria-label": showConfirmPassword ? "Hide confirm password" : "Show confirm password", children: showConfirmPassword ? _jsx(EyeOff, { className: "size-4" }) : _jsx(Eye, { className: "size-4" }) }), touched.confirmPassword && fieldErrors.confirmPassword?.[0] ? _jsx("p", { className: "mt-1 text-xs font-semibold text-error", children: fieldErrors.confirmPassword[0] }) : null] }), _jsxs("select", { className: `form-select md:col-span-2 ${touched.accountType && fieldErrors.accountType?.[0] ? "auth-field-control-error" : ""}`, value: form.accountType, onChange: (e) => setForm({ ...form, accountType: e.target.value }), onBlur: () => setTouched((current) => ({ ...current, accountType: true })), "aria-invalid": touched.accountType && Boolean(fieldErrors.accountType?.[0]), children: [_jsx("option", { value: "OWNER", children: "List property as owner" }), _jsx("option", { value: "USER", children: "Search as user" })] }), touched.accountType && fieldErrors.accountType?.[0] ? _jsx("p", { className: "text-xs font-semibold text-error md:col-span-2", children: fieldErrors.accountType[0] }) : null, _jsxs("button", { className: "glow-button h-14 w-full md:col-span-2 disabled:cursor-not-allowed disabled:opacity-60", disabled: !canSubmit, children: [_jsx(UserPlus, { className: "relative size-4" }), loading ? "Creating account..." : "Continue"] })] }) }) }));
}


