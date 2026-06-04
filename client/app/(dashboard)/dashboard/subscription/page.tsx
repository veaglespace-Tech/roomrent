"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Crown, CreditCard, Sparkles } from "lucide-react";
import { activateSubscription, getProfile } from "@/services/user-service";
import { SubscriptionPlan, UserProfile } from "@/types";

const plans: Array<{ plan: SubscriptionPlan; label: string; price: string; duration: string; accent: string }> = [
  { plan: "STARTER", label: "Starter", price: "Rs. 499", duration: "30 days", accent: "from-[#0f9f8f] to-[#14b8a6]" },
  { plan: "PRO", label: "Pro", price: "Rs. 999", duration: "90 days", accent: "from-[#ef3d81] to-[#fb7185]" },
  { plan: "BUSINESS", label: "Business", price: "Rs. 1,999", duration: "180 days", accent: "from-[#ff7a35] to-[#facc15]" }
];

export default function SubscriptionPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState<SubscriptionPlan | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  const choosePlan = async (plan: SubscriptionPlan) => {
    try {
      setActivating(plan);
      setError("");
      setProfile(await activateSubscription(plan));
    } catch {
      setError("Unable to activate plan. Please try again.");
    } finally {
      setActivating(null);
    }
  };

  if (loading) {
    return <div className="dashboard-empty-state">Loading plan details...</div>;
  }

  return (
    <div>
      <section className="profile-hero">
        <div className="profile-avatar">
          {profile?.isSuperAdmin ? <Crown className="size-8" /> : <CreditCard className="size-8" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1>Listing Plan</h1>
            {profile?.subscriptionActive || profile?.isSuperAdmin ? (
              <span className="profile-status">
                <CheckCircle2 className="size-4" />
                Active
              </span>
            ) : null}
          </div>
          <p>
            {profile?.isSuperAdmin
              ? "Superadmin has full website-owner access without a paid plan requirement."
              : profile?.subscriptionActive
                ? `${profile.subscriptionPlan} plan is active for property publishing.`
                : "Activate a plan before publishing any property."}
          </p>
        </div>
      </section>

      {error ? <p className="mt-5 text-sm text-error">{error}</p> : null}

      <section className="mt-6 grid gap-5 lg:grid-cols-3">
        {plans.map((item) => {
          const isActive = profile?.subscriptionPlan === item.plan && profile.subscriptionActive;
          return (
            <article key={item.plan} className="landing-card flex min-h-[300px] flex-col justify-between p-6">
              <div>
                <div className={`mb-5 flex size-12 items-center justify-center rounded-[16px] bg-gradient-to-br ${item.accent} text-white shadow-[0_18px_34px_-24px_rgba(15,23,42,0.65)]`}>
                  <Sparkles className="size-5" />
                </div>
                <p className="text-sm font-extrabold uppercase text-[#64748b]">{item.label}</p>
                <h2 className="mt-2 text-3xl font-extrabold text-[#111827]">{item.price}</h2>
                <p className="mt-2 text-sm font-semibold text-[#64748b]">{item.duration} listing access</p>
                <div className="mt-5 grid gap-3 text-sm font-semibold text-[#475569]">
                  <span>Add properties after activation</span>
                  <span>Edit and manage own listings</span>
                  <span>Receive enquiries in dashboard</span>
                </div>
              </div>
              <button className={isActive ? "landing-secondary-button mt-7" : "landing-primary-button mt-7"} onClick={() => choosePlan(item.plan)} disabled={activating !== null || profile?.isSuperAdmin}>
                {profile?.isSuperAdmin ? "Included" : activating === item.plan ? "Activating..." : isActive ? "Current Plan" : "Activate Plan"}
              </button>
            </article>
          );
        })}
      </section>
    </div>
  );
}
