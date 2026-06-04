"use client";

import { FormEvent, useState } from "react";
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

  const handleSubmit = async (event: FormEvent) => {
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
    } catch (error) {
      setError(getApiErrorMessage(error, "Unable to request reset right now."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-shell flex min-h-[calc(100vh-220px)] items-center py-10">
      <AuthCard title="Forgot password" description="Enter your email and we will send a password reset link.">
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="auth-field">
            <Mail className="auth-field-icon" />
            <input className="form-input auth-field-control" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          {message ? <p className="rounded-[16px] border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-300">{message}</p> : null}
          {error ? <p className="text-sm text-error">{error}</p> : null}
          <button className="glow-button h-14 w-full" disabled={loading}>
            <Send className="relative size-4" />
            {loading ? "Sending..." : "Send reset link"}
          </button>
          <div className="flex items-center justify-between text-sm font-semibold">
            <Link href="/login" className="text-[#0f9f8f] hover:underline">
              Back to login
            </Link>
            <Link href="/register" className="text-[#ef3d81] hover:underline">
              Create account
            </Link>
          </div>
        </form>
      </AuthCard>
    </section>
  );
}
