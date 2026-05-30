"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Shield } from "lucide-react";
import { loginUser } from "@/services/auth-service";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/auth-slice";
import { AuthCard } from "@/components/auth-card";
import { firstZodError, loginSchema } from "@/lib/validation";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

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
    } catch {
      setError("Invalid email or password.");
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
              Registration complete. Login to open your dashboard.
            </p>
          ) : null}
          <label className="auth-field">
            <Mail className="auth-field-icon" />
            <input className="form-input auth-field-control" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="auth-field">
            <Shield className="auth-field-icon" />
            <input className="form-input auth-field-control" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          {error ? <p className="text-sm text-error">{error}</p> : null}
          <button className="glow-button h-14 w-full" disabled={loading}>
            <LogIn className="relative size-4" />
            {loading ? "Logging in..." : "Continue"}
          </button>
        </form>
      </AuthCard>
    </section>
  );
}
