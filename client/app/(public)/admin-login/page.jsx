"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/auth-service";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/auth-slice";
import { getDashboardRoute, getStoredAuthRole, clearAuthSession } from "@/lib/auth-session";
import { Eye, EyeOff, Mail, Lock, ShieldCheck } from "lucide-react";
import { loginSchema, firstZodError } from "@/lib/validation";
import { getApiErrorMessage } from "@/lib/api-error";
import { logoutUser } from "@/services/auth-service";
import { logout as logoutAction } from "@/store/slices/auth-slice";
import { AuthCard } from "@/components/auth-card";

export default function AdminLoginPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState({ email: false, password: false });

    const validation = useMemo(() => loginSchema.safeParse({ email, password }), [email, password]);
    const fieldErrors = validation.success ? {} : validation.error.flatten().fieldErrors;
    const canSubmit = validation.success && !loading;

    useEffect(() => {
        const role = getStoredAuthRole();
        if (role === "ADMIN") {
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

            if (data.role !== "ADMIN") {
                setError("Access denied: You are not authorized as an administrator.");
                try {
                    await logoutUser();
                } catch (e) {
                    // Ignore logout failure
                }
                clearAuthSession();
                dispatch(logoutAction());
                return;
            }

            dispatch(setCredentials(data));
            setSuccess(`${data.message || "Admin authentication successful."} Redirecting...`);
            window.setTimeout(() => {
                router.replace(getDashboardRoute(data.role));
            }, 800);
        } catch (loginError) {
            setError(getApiErrorMessage(loginError, "Invalid admin email or password."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex min-h-[calc(100dvh-100px)] items-center justify-center p-4">
            <AuthCard 
                title="Admin Console" 
                description="Please sign in with administrative email and password."
            >
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
                            <span className="sr-only">Admin Email Address</span>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Mail className="size-5 text-slate-400" />
                            </div>
                            <input 
                                className={`w-full rounded-[16px] border ${touched.email && fieldErrors.email?.[0] ? "border-rose-500 ring-1 ring-rose-500 bg-rose-50/50" : "border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-indigo-500"} pl-12 pr-4 py-3.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 transition-colors`}
                                type="email" 
                                autoComplete="email" 
                                placeholder="Admin Email Address" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                onBlur={() => setTouched((current) => ({ ...current, email: true }))} 
                            />
                            {touched.email && fieldErrors.email?.[0] && (
                                <p className="mt-1.5 ml-1 text-xs font-bold text-rose-500">{fieldErrors.email[0]}</p>
                            )}
                        </label>

                        <label className="block relative">
                            <span className="sr-only">Password</span>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Lock className="size-5 text-slate-400" />
                            </div>
                            <input 
                                className={`w-full rounded-[16px] border ${touched.password && fieldErrors.password?.[0] ? "border-rose-500 ring-1 ring-rose-500 bg-rose-50/50" : "border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-indigo-500"} pl-12 pr-12 py-3.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 transition-colors`}
                                type={showPassword ? "text" : "password"} 
                                autoComplete="current-password" 
                                placeholder="Password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                onBlur={() => setTouched((current) => ({ ...current, password: true }))} 
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword((current) => !current)} 
                                className="absolute right-4 top-[18px] text-slate-400 hover:text-indigo-600 transition-colors" 
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                            </button>
                            {touched.password && fieldErrors.password?.[0] && (
                                <p className="mt-1.5 ml-1 text-xs font-bold text-rose-500">{fieldErrors.password[0]}</p>
                            )}
                        </label>
                    </div>

                    <button 
                        type="submit"
                        className="landing-primary-button w-full h-14 mt-6 text-[15px] shadow-sm flex items-center justify-center gap-2"
                        disabled={!canSubmit}
                    >
                        {loading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            <ShieldCheck className="size-5" />
                        )}
                        {loading ? "Authenticating..." : "Login to Console"}
                    </button>
                </form>
            </AuthCard>
        </section>
    );
}
