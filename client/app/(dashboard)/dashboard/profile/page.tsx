"use client";

import { useEffect, useMemo, useState } from "react";
import { getProfile } from "@/services/user-service";
import { UserProfile } from "@/types";
import { Calendar, CheckCircle2, Mail, Phone, Shield, UserRound } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    getProfile().then(setProfile).catch(() => setProfile(null));
  }, []);

  const initials = useMemo(() => {
    if (!profile?.name) return "?";
    return profile.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }, [profile?.name]);

  if (!profile) {
    return (
      <div className="dashboard-empty-state">
        <UserRound className="size-8" />
        <h1>Profile unavailable</h1>
        <p>Login is required to view dashboard details.</p>
      </div>
    );
  }

  const memberSince = new Date(profile.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const detailCards = [
    { label: "Full name", value: profile.name, icon: UserRound, tone: "cyan" },
    { label: "Email address", value: profile.email, icon: Mail, tone: "pink" },
    { label: "Mobile number", value: profile.phone || "Not added", icon: Phone, tone: "gold" },
    { label: "Member since", value: memberSince, icon: Calendar, tone: "violet" }
  ];

  return (
    <div className="profile-workspace">
      <section className="profile-hero">
        <div className="profile-avatar">{initials}</div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1>{profile.name}</h1>
            <span className="profile-role-chip">
              <Shield className="size-3.5" />
              {profile.role}
            </span>
          </div>
          <p>Account overview, contact identity and dashboard access status.</p>
        </div>
        <div className="profile-status">
          <CheckCircle2 className="size-4" />
          Active
        </div>
      </section>

      <section className="profile-grid">
        {detailCards.map(({ label, value, icon: Icon, tone }) => (
          <article key={label} className={`profile-info-card profile-info-card-${tone}`}>
            <div className="profile-info-icon">
              <Icon className="size-5" />
            </div>
            <div className="min-w-0">
              <p>{label}</p>
              <h2>{value}</h2>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
