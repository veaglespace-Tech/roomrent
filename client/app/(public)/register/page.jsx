"use client";

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
            const data = await registerUser({
                name,
                phone: validation.data.phone,
                email: validation.data.email,
                password: validation.data.password,
                role: validation.data.accountType
            });
            setSuccess(`${data?.message || "Registration successful."} Redirecting to login...`);
            window.setTimeout(() => {
                router.push("/login?registered=1");
            }, 700);
        } catch (registerError) {
            setError(getApiErrorMessage(registerError, "Unable to register. Use a different email or verify the form."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex min-h-[calc(100dvh-100px)] items-center justify-center p-4">
            <AuthCard title="Create Account" description="Create a user account for room search, enquiries, saved properties, and listing tools after plan activation.">
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    {success && (
                        <p className="rounded-[16px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                            {success}
                        </p>
                    )}
                    {error && (
                        <p className="rounded-[16px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
                            {error}
                        </p>
                    )}

                    <div className="space-y-4">
                        <label className="block relative">
                            <span className="sr-only">First Name</span>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <UserRound className="size-5 text-slate-400" />
                            </div>
                            <input 
                                className={`w-full rounded-[16px] border ${touched.firstName && fieldErrors.firstName?.[0] ? "border-rose-500 ring-1 ring-rose-500 bg-rose-50/50" : "border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-indigo-500"} pl-12 pr-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 transition-colors`}
                                placeholder="First Name *" 
                                value={form.firstName} 
                                onChange={(e) => setForm({ ...form, firstName: e.target.value })} 
                                onBlur={() => setTouched((current) => ({ ...current, firstName: true }))} 
                            />
                            {touched.firstName && fieldErrors.firstName?.[0] && (
                                <p className="mt-1.5 ml-1 text-xs font-bold text-rose-500">{fieldErrors.firstName[0]}</p>
                            )}
                        </label>

                        <label className="block relative">
                            <span className="sr-only">Last Name</span>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <UserRound className="size-5 text-slate-400" />
                            </div>
                            <input 
                                className={`w-full rounded-[16px] border ${touched.lastName && fieldErrors.lastName?.[0] ? "border-rose-500 ring-1 ring-rose-500 bg-rose-50/50" : "border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-indigo-500"} pl-12 pr-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 transition-colors`}
                                placeholder="Last name" 
                                value={form.lastName} 
                                onChange={(e) => setForm({ ...form, lastName: e.target.value })} 
                                onBlur={() => setTouched((current) => ({ ...current, lastName: true }))} 
                            />
                            {touched.lastName && fieldErrors.lastName?.[0] && (
                                <p className="mt-1.5 ml-1 text-xs font-bold text-rose-500">{fieldErrors.lastName[0]}</p>
                            )}
                        </label>

                        <label className="block relative">
                            <span className="sr-only">Phone Number</span>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Phone className="size-5 text-slate-400" />
                            </div>
                            <input 
                                className={`w-full rounded-[16px] border ${touched.phone && fieldErrors.phone?.[0] ? "border-rose-500 ring-1 ring-rose-500 bg-rose-50/50" : "border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-indigo-500"} pl-12 pr-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 transition-colors`}
                                inputMode="numeric" 
                                placeholder="Mobile number (10 digits)" 
                                value={form.phone} 
                                onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} 
                                onBlur={() => setTouched((current) => ({ ...current, phone: true }))} 
                            />
                            {touched.phone && fieldErrors.phone?.[0] && (
                                <p className="mt-1.5 ml-1 text-xs font-bold text-rose-500">{fieldErrors.phone[0]}</p>
                            )}
                        </label>

                        <label className="block relative">
                            <span className="sr-only">Email</span>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Mail className="size-5 text-slate-400" />
                            </div>
                            <input 
                                className={`w-full rounded-[16px] border ${touched.email && fieldErrors.email?.[0] ? "border-rose-500 ring-1 ring-rose-500 bg-rose-50/50" : "border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-indigo-500"} pl-12 pr-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 transition-colors`}
                                type="email" 
                                autoComplete="email" 
                                placeholder="Email address *" 
                                value={form.email} 
                                onChange={(e) => setForm({ ...form, email: e.target.value })} 
                                onBlur={() => setTouched((current) => ({ ...current, email: true }))} 
                            />
                            {touched.email && fieldErrors.email?.[0] && (
                                <p className="mt-1.5 ml-1 text-xs font-bold text-rose-500">{fieldErrors.email[0]}</p>
                            )}
                        </label>

                        <label className="block relative">
                            <span className="sr-only">Password</span>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Shield className="size-5 text-slate-400" />
                            </div>
                            <input 
                                className={`w-full rounded-[16px] border ${touched.password && fieldErrors.password?.[0] ? "border-rose-500 ring-1 ring-rose-500 bg-rose-50/50" : "border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-indigo-500"} pl-12 pr-12 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 transition-colors`}
                                type={showPassword ? "text" : "password"} 
                                autoComplete="new-password" 
                                placeholder="Password *" 
                                value={form.password} 
                                onChange={(e) => setForm({ ...form, password: e.target.value })} 
                                onBlur={() => setTouched((current) => ({ ...current, password: true }))} 
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword((current) => !current)} 
                                className="absolute right-4 top-[14px] text-slate-400 hover:text-indigo-600 transition-colors" 
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                            </button>
                            {touched.password && fieldErrors.password?.[0] ? (
                                <p className="mt-1.5 ml-1 text-xs font-bold text-rose-500">{fieldErrors.password[0]}</p>
                            ) : (
                                <p className="mt-1.5 ml-1 text-[11px] font-medium text-slate-500">Use 8+ characters with upper, lower, number, and symbol.</p>
                            )}
                        </label>

                        <label className="block relative">
                            <span className="sr-only">Confirm Password</span>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <CheckCircle2 className="size-5 text-slate-400" />
                            </div>
                            <input 
                                className={`w-full rounded-[16px] border ${touched.confirmPassword && fieldErrors.confirmPassword?.[0] ? "border-rose-500 ring-1 ring-rose-500 bg-rose-50/50" : "border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-indigo-500"} pl-12 pr-12 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 transition-colors`}
                                type={showConfirmPassword ? "text" : "password"} 
                                autoComplete="new-password" 
                                placeholder="Confirm password *" 
                                value={form.confirmPassword} 
                                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} 
                                onBlur={() => setTouched((current) => ({ ...current, confirmPassword: true }))} 
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowConfirmPassword((current) => !current)} 
                                className="absolute right-4 top-[14px] text-slate-400 hover:text-indigo-600 transition-colors" 
                                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                            >
                                {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                            </button>
                            {touched.confirmPassword && fieldErrors.confirmPassword?.[0] && (
                                <p className="mt-1.5 ml-1 text-xs font-bold text-rose-500">{fieldErrors.confirmPassword[0]}</p>
                            )}
                        </label>

                        <div>
                            <select 
                                className={`w-full rounded-[16px] border ${touched.accountType && fieldErrors.accountType?.[0] ? "border-rose-500 ring-1 ring-rose-500 bg-rose-50/50" : "border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-indigo-500"} px-4 py-3 text-sm font-semibold text-slate-900 transition-colors cursor-pointer appearance-none`}
                                value={form.accountType} 
                                onChange={(e) => setForm({ ...form, accountType: e.target.value })} 
                                onBlur={() => setTouched((current) => ({ ...current, accountType: true }))} 
                            >
                                <option value="OWNER">List property as owner</option>
                                <option value="USER">Search as user</option>
                            </select>
                            {touched.accountType && fieldErrors.accountType?.[0] && (
                                <p className="mt-1.5 ml-1 text-xs font-bold text-rose-500">{fieldErrors.accountType[0]}</p>
                            )}
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="landing-primary-button w-full h-14 mt-8 text-[15px] shadow-sm flex items-center justify-center gap-2"
                        disabled={!canSubmit}
                    >
                        {loading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            <UserPlus className="size-5" />
                        )}
                        {loading ? "Creating account..." : "Continue"}
                    </button>
                </form>
            </AuthCard>
        </section>
    );
}


