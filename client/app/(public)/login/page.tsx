"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/auth-service";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/auth-slice";
import { AuthCard } from "@/components/auth-card";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      const data = await loginUser({ email, password });
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
          <input className="input input-bordered w-full" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input input-bordered w-full" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error ? <p className="text-sm text-error">{error}</p> : null}
          <button className="btn btn-primary w-full rounded-full" disabled={loading}>
            {loading ? "Logging in..." : "Continue"}
          </button>
        </form>
        <div className="mt-6 rounded-[24px] bg-base-200/70 p-4 text-sm text-base-content/75">
          <p className="font-semibold text-base-content">Production note</p>
          <p className="mt-2">Demo credentials and seeded demo listings have been disabled for the Maharashtra-wide rollout.</p>
        </div>
      </AuthCard>
    </section>
  );
}
