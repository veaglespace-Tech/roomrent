"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Shield, UserRound, UserPlus } from "lucide-react";
import { registerUser } from "@/services/auth-service";
import { AuthCard } from "@/components/auth-card";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/auth-slice";

type AccountType = "OWNER" | "SEEKER" | "PARTNER";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    accountType: "OWNER" as AccountType
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      const name = `${form.firstName} ${form.lastName}`.trim();
      const data = await registerUser({
        name,
        email: form.email,
        password: form.password,
        role: form.accountType === "OWNER" ? "OWNER" : "USER"
      });
      localStorage.setItem("roomrent_token", data.token);
      localStorage.setItem("roomrent_user", JSON.stringify(data));
      dispatch(setCredentials(data));
      router.push("/dashboard/profile");
    } catch {
      setError("Unable to register. Use a different email or verify the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-shell flex min-h-[calc(100vh-220px)] items-center py-10">
      <AuthCard title="Register" description="Create an account as owner, buyer, room seeker, or room partner to start using the portal.">
        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <label className="auth-field">
            <UserRound className="auth-field-icon" />
            <input className="form-input auth-field-control" placeholder="First Name *" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          </label>
          <label className="auth-field">
            <UserRound className="auth-field-icon" />
            <input className="form-input auth-field-control" placeholder="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </label>
          <label className="auth-field md:col-span-2">
            <Mail className="auth-field-icon" />
            <input className="form-input auth-field-control" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label className="auth-field md:col-span-2">
            <Shield className="auth-field-icon" />
            <input className="form-input auth-field-control" type="password" placeholder="Password *" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </label>
          <select
            className="form-select md:col-span-2"
            value={form.accountType}
            onChange={(e) => setForm({ ...form, accountType: e.target.value as AccountType })}
          >
            <option value="OWNER">Property Owner / Landlord</option>
            <option value="SEEKER">Buyer / Room Seeker</option>
            <option value="PARTNER">Looking for Room Partner</option>
          </select>
          {error ? <p className="text-sm text-error md:col-span-2">{error}</p> : null}
          <button className="glow-button h-14 w-full md:col-span-2" disabled={loading}>
            <UserPlus className="relative size-4" />
            {loading ? "Creating account..." : "Continue"}
          </button>
        </form>
      </AuthCard>
    </section>
  );
}
