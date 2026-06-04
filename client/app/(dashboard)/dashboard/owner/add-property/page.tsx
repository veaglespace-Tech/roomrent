"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, CreditCard, ShieldCheck, Sparkles } from "lucide-react";
import { PropertyForm } from "@/components/forms/property-form";
import { activateSubscription, getProfile } from "@/services/user-service";
import { SubscriptionPlan, UserProfile } from "@/types";

const plans: Array<{ plan: SubscriptionPlan; name: string; price: string; copy: string; features: string[] }> = [
  {
    plan: "STARTER",
    name: "Starter",
    price: "Rs. 499",
    copy: "For one owner or broker starting with a focused property set.",
    features: ["30 days listing access", "Add and edit properties", "Receive listing enquiries"]
  },
  {
    plan: "PRO",
    name: "Pro",
    price: "Rs. 999",
    copy: "For active property managers listing multiple rooms and flats.",
    features: ["90 days listing access", "Priority property workspace", "Better enquiry tracking"]
  },
  {
    plan: "BUSINESS",
    name: "Business",
    price: "Rs. 1,999",
    copy: "For high-volume operators and admin-grade listing management.",
    features: ["180 days listing access", "Large inventory workflow", "Premium support desk"]
  }
];

export default function AddPropertyPage() {
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

  const hasListingAccess = profile?.isSuperAdmin || profile?.subscriptionActive;

  const choosePlan = async (plan: SubscriptionPlan) => {
    try {
      setActivating(plan);
      setError("");
      const updatedProfile = await activateSubscription(plan);
      setProfile(updatedProfile);
    } catch {
      setError("Unable to activate listing plan. Please login again or contact support.");
    } finally {
      setActivating(null);
    }
  };

  if (loading) {
    return <div className="dashboard-empty-state">Loading listing access...</div>;
  }

  if (!profile) {
    return (
      <div className="landing-card p-8 text-center">
        <ShieldCheck className="mx-auto size-10 text-[#ef3d81]" />
        <h1 className="mt-5 text-3xl font-extrabold text-[#111827]">Login required</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-7 text-[#64748b]">Login before choosing a listing plan and publishing a property.</p>
        <Link href="/login" className="landing-primary-button mx-auto mt-7 w-fit">Login</Link>
      </div>
    );
  }

  if (!hasListingAccess) {
    return (
      <div>
        <div className="landing-card p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="landing-eyebrow">Listing access required</p>
              <h1 className="mt-3 text-3xl font-extrabold text-[#111827] md:text-4xl">Choose a plan before adding property.</h1>
              <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-[#64748b]">
                Users can browse and enquire freely. Publishing rooms, PGs, flats or shops needs an active listing plan.
              </p>
            </div>
            <div className="landing-icon">
              <CreditCard className="size-5" />
            </div>
          </div>
        </div>

        {error ? <p className="mt-5 text-sm text-error">{error}</p> : null}

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {plans.map((item) => (
            <article key={item.plan} className="landing-card flex min-h-[330px] flex-col justify-between p-6">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-extrabold uppercase text-[#ef3d81]">{item.name}</p>
                    <h2 className="mt-2 text-3xl font-extrabold text-[#111827]">{item.price}</h2>
                  </div>
                  <div className="icon-tile">
                    <Sparkles className="size-5" />
                  </div>
                </div>
                <p className="mt-4 text-sm font-medium leading-7 text-[#64748b]">{item.copy}</p>
                <div className="mt-5 grid gap-3">
                  {item.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm font-semibold text-[#475569]">
                      <CheckCircle2 className="size-4 text-[#0f9f8f]" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
              <button className="landing-primary-button mt-7" onClick={() => choosePlan(item.plan)} disabled={activating !== null}>
                {activating === item.plan ? "Activating..." : "Choose Plan"}
              </button>
            </article>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="landing-card p-6">
        <p className="landing-eyebrow">{profile.isSuperAdmin ? "Superadmin access" : `${profile.subscriptionPlan} plan active`}</p>
        <h1 className="mt-2 text-3xl font-extrabold text-[#111827]">Add Property</h1>
        <p className="mt-2 text-sm font-medium leading-7 text-[#64748b]">Publish a verified room, PG, flat, hostel or commercial listing.</p>
      </div>
      <div className="mt-8">
        <PropertyForm />
      </div>
    </div>
  );
}
