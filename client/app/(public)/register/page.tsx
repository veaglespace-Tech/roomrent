"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Eye, EyeOff, Mail, Phone, Shield, UserRound, UserPlus } from "lucide-react";
import { registerUser } from "@/services/auth-service";
import { AuthCard } from "@/components/auth-card";
import { firstZodError, registerSchema } from "@/lib/validation";
import { getApiErrorMessage } from "@/lib/api-error";

type AccountType = "OWNER" | "USER";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "OWNER" as AccountType
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

  const handleSubmit = async (event: FormEvent) => {
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
      setSuccess("Registration successful. Redirecting to login...");
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
    <section className="page-shell flex min-h-[calc(100dvh-220px)] items-center py-10">
      <AuthCard title="Register" description="Create a user account for room search, enquiries, saved properties, and listing tools after plan activation.">
        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2" noValidate>
          {success ? (
            <p className="rounded-xl border border-[rgba(83,211,138,0.35)] bg-[rgba(83,211,138,0.12)] px-4 py-3 text-sm font-medium text-[var(--rf-success)] md:col-span-2" role="status" aria-live="polite">
              {success}
            </p>
          ) : null}
          {error ? (
            <p className="rounded-xl border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.08)] px-4 py-3 text-sm font-medium text-error md:col-span-2" role="alert" aria-live="assertive">
              {error}
            </p>
          ) : null}
          <label className="auth-field block">
            <UserRound className="auth-field-icon" />
            <input className={`form-input auth-field-control ${touched.firstName && fieldErrors.firstName?.[0] ? "auth-field-control-error" : ""}`} placeholder="Name *" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} onBlur={() => setTouched((current) => ({ ...current, firstName: true }))} aria-invalid={touched.firstName && Boolean(fieldErrors.firstName?.[0])} />
            {touched.firstName && fieldErrors.firstName?.[0] ? <p className="mt-1 text-xs font-semibold text-error">{fieldErrors.firstName[0]}</p> : null}
          </label>
          <label className="auth-field block">
            <UserRound className="auth-field-icon" />
            <input className={`form-input auth-field-control ${touched.lastName && fieldErrors.lastName?.[0] ? "auth-field-control-error" : ""}`} placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} onBlur={() => setTouched((current) => ({ ...current, lastName: true }))} aria-invalid={touched.lastName && Boolean(fieldErrors.lastName?.[0])} />
            {touched.lastName && fieldErrors.lastName?.[0] ? <p className="mt-1 text-xs font-semibold text-error">{fieldErrors.lastName[0]}</p> : null}
          </label>
          <label className="auth-field md:col-span-2 block">
            <Phone className="auth-field-icon" />
            <input className={`form-input auth-field-control ${touched.phone && fieldErrors.phone?.[0] ? "auth-field-control-error" : ""}`} inputMode="numeric" placeholder="Mobile number (10 digits)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} onBlur={() => setTouched((current) => ({ ...current, phone: true }))} aria-invalid={touched.phone && Boolean(fieldErrors.phone?.[0])} />
            {touched.phone && fieldErrors.phone?.[0] ? <p className="mt-1 text-xs font-semibold text-error">{fieldErrors.phone[0]}</p> : null}
          </label>
          <label className="auth-field md:col-span-2 block">
            <Mail className="auth-field-icon" />
            <input className={`form-input auth-field-control ${touched.email && fieldErrors.email?.[0] ? "auth-field-control-error" : ""}`} type="email" autoComplete="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} onBlur={() => setTouched((current) => ({ ...current, email: true }))} aria-invalid={touched.email && Boolean(fieldErrors.email?.[0])} />
            {touched.email && fieldErrors.email?.[0] ? <p className="mt-1 text-xs font-semibold text-error">{fieldErrors.email[0]}</p> : null}
          </label>
          <label className="auth-field md:col-span-2 block">
            <Shield className="auth-field-icon" />
            <input
              className={`form-input auth-field-control ${touched.password && fieldErrors.password?.[0] ? "auth-field-control-error" : ""}`}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Password *"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
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
            <p className="mt-1 text-xs text-[var(--rf-muted)]">Use 8+ characters with upper, lower, number, and symbol.</p>
          </label>
          <label className="auth-field md:col-span-2 block">
            <CheckCircle2 className="auth-field-icon" />
            <input
              className={`form-input auth-field-control ${touched.confirmPassword && fieldErrors.confirmPassword?.[0] ? "auth-field-control-error" : ""}`}
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm password *"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              onBlur={() => setTouched((current) => ({ ...current, confirmPassword: true }))}
              aria-invalid={touched.confirmPassword && Boolean(fieldErrors.confirmPassword?.[0])}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((current) => !current)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--rf-muted)] transition hover:text-[var(--rf-cyan)]"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            {touched.confirmPassword && fieldErrors.confirmPassword?.[0] ? <p className="mt-1 text-xs font-semibold text-error">{fieldErrors.confirmPassword[0]}</p> : null}
          </label>
          <select className={`form-select md:col-span-2 ${touched.accountType && fieldErrors.accountType?.[0] ? "auth-field-control-error" : ""}`} value={form.accountType} onChange={(e) => setForm({ ...form, accountType: e.target.value as AccountType })} onBlur={() => setTouched((current) => ({ ...current, accountType: true }))} aria-invalid={touched.accountType && Boolean(fieldErrors.accountType?.[0])}>
            <option value="OWNER">List property as owner</option>
            <option value="USER">Search as user</option>
          </select>
          {touched.accountType && fieldErrors.accountType?.[0] ? <p className="text-xs font-semibold text-error md:col-span-2">{fieldErrors.accountType[0]}</p> : null}
          <button className="glow-button h-14 w-full md:col-span-2 disabled:cursor-not-allowed disabled:opacity-60" disabled={!canSubmit}>
            <UserPlus className="relative size-4" />
            {loading ? "Creating account..." : "Continue"}
          </button>
        </form>
      </AuthCard>
    </section>
  );
}
