"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LogIn, Mail, Shield } from "lucide-react";
import { loginUser } from "@/services/auth-service";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/auth-slice";
import { AuthCard } from "@/components/auth-card";
import { firstZodError, loginSchema } from "@/lib/validation";
import { getApiErrorMessage } from "@/lib/api-error";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const validation = useMemo(() => loginSchema.safeParse({ email, password }), [email, password]);
  const fieldErrors = validation.success ? {} : validation.error.flatten().fieldErrors;

  useEffect(() => {
    setRegistered(new URLSearchParams(window.location.search).get("registered") === "1");
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setTouched({ email: true, password: true });
    if (!validation.success) {
      setError(firstZodError(validation.error));
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await loginUser(validation.data);
      localStorage.setItem("roomrent_token", data.token);
      localStorage.setItem("roomrent_user", JSON.stringify(data));
      dispatch(setCredentials(data));
      router.push("/dashboard");
    } catch (loginError) {
      setError(getApiErrorMessage(loginError, "Invalid email or password."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-shell flex min-h-[calc(100vh-220px)] items-center py-10">
      <AuthCard title="Log in" description="Use your account to access saved properties, owner tools, enquiries, and admin controls.">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {registered ? (
            <p className="border border-[rgba(83,211,138,0.35)] bg-[rgba(83,211,138,0.08)] px-4 py-3 text-sm font-medium text-[var(--rf-success)]">
              Registration complete. Sign in to continue.
            </p>
          ) : null}
          <label className="auth-field block">
            <Mail className="auth-field-icon" />
            <input className="form-input auth-field-control" type="email" autoComplete="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setTouched((current) => ({ ...current, email: true }))} aria-invalid={touched.email && Boolean(fieldErrors.email?.[0])} />
            {touched.email && fieldErrors.email?.[0] ? <p className="mt-1 text-xs font-semibold text-error">{fieldErrors.email[0]}</p> : null}
          </label>
          <label className="auth-field block">
            <Shield className="auth-field-icon" />
            <input
              className="form-input auth-field-control"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((current) => ({ ...current, password: true }))}
              aria-invalid={touched.password && Boolean(fieldErrors.password?.[0])}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--rf-muted)] transition hover:text-[var(--rf-cyan)]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            {touched.password && fieldErrors.password?.[0] ? <p className="mt-1 text-xs font-semibold text-error">{fieldErrors.password[0]}</p> : null}
          </label>
          {error ? <p className="text-sm text-error">{error}</p> : null}
          <div className="flex items-center justify-between gap-3 text-sm">
            <Link href="/forgot-password" className="font-medium text-[var(--rf-cyan)] hover:underline">
              Forgot password?
            </Link>
            <Link href="/register" className="font-medium text-[var(--rf-cyan)] hover:underline">
              Create account
            </Link>
          </div>
          <button className="glow-button h-14 w-full" disabled={loading}>
            <LogIn className="relative size-4" />
            {loading ? "Logging in..." : "Continue"}
          </button>
        </form>
      </AuthCard>
    </section>
  );
}
