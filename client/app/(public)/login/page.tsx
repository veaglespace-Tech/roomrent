"use client";

import { FormEvent, useEffect, useState } from "react";
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

  useEffect(() => {
    setRegistered(new URLSearchParams(window.location.search).get("registered") === "1");
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(firstZodError(parsed.error));
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await loginUser(parsed.data);
      localStorage.setItem("roomrent_token", data.token);
      localStorage.setItem("roomrent_user", JSON.stringify(data));
      dispatch(setCredentials(data));
      router.push("/dashboard/profile");
    } catch (error) {
      setError(getApiErrorMessage(error, "Invalid email or password."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-shell flex min-h-[calc(100vh-220px)] items-center py-10">
      <AuthCard title="Login" description="Use your account to access saved properties, owner tools, enquiries, and admin controls.">
        <form onSubmit={handleSubmit} className="space-y-5">
          {registered ? (
            <p className="rounded-[16px] border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-300">
              Registration complete. Check your email for the welcome message, then login to open your dashboard.
            </p>
          ) : null}
          <label className="auth-field">
            <Mail className="auth-field-icon" />
            <input className="form-input auth-field-control" type="email" autoComplete="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="auth-field">
            <Shield className="auth-field-icon" />
            <input
              className="form-input auth-field-control pr-12"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/50 transition hover:text-[#0f172a]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </label>
          {error ? <p className="text-sm text-error">{error}</p> : null}
          <div className="flex items-center justify-between gap-3 text-sm">
            <Link href="/forgot-password" className="font-semibold text-[#0f9f8f] hover:underline">
              Forgot password?
            </Link>
            <Link href="/register" className="font-semibold text-[#ef3d81] hover:underline">
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
