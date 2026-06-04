"use client";

import { FormEvent, useEffect, useState } from "react";
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

  const handleSubmit = async (event: FormEvent) => {
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
    } catch (error) {
      setError(getApiErrorMessage(error, "Unable to reset password. The link may have expired."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-shell flex min-h-[calc(100vh-220px)] items-center py-10">
      <AuthCard title="Reset password" description="Enter the new password for your account.">
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="auth-field">
            <KeyRound className="auth-field-icon" />
            <input className="form-input auth-field-control" autoComplete="one-time-code" placeholder="Reset token" value={token} onChange={(e) => setToken(e.target.value)} />
          </label>
          <label className="auth-field">
            <Shield className="auth-field-icon" />
            <input
              className="form-input auth-field-control pr-12"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
          <label className="auth-field">
            <CheckCircle2 className="auth-field-icon" />
            <input
              className="form-input auth-field-control pr-12"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((current) => !current)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/50 transition hover:text-[#0f172a]"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </label>
          {message ? <p className="rounded-[16px] border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-300">{message}</p> : null}
          {error ? <p className="text-sm text-error">{error}</p> : null}
          <button className="glow-button h-14 w-full" disabled={loading}>
            {loading ? "Updating..." : "Update password"}
          </button>
          <div className="flex items-center justify-between text-sm font-semibold">
            <Link href="/login" className="text-[#0f9f8f] hover:underline">
              Back to login
            </Link>
            <Link href="/forgot-password" className="text-[#ef3d81] hover:underline">
              Request new link
            </Link>
          </div>
        </form>
      </AuthCard>
    </section>
  );
}
