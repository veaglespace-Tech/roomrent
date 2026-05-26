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
          <input className="input input-bordered h-14 w-full rounded-[18px] border-base-300/60 bg-white" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input input-bordered h-14 w-full rounded-[18px] border-base-300/60 bg-white" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error ? <p className="text-sm text-error">{error}</p> : null}
          <button className="btn pink-button h-14 w-full rounded-[18px]" disabled={loading}>
            {loading ? "Logging in..." : "Continue"}
          </button>
        </form>
      </AuthCard>
    </section>
  );
}
