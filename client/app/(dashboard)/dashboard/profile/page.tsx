"use client";

import { useEffect, useState } from "react";
import { getProfile } from "@/services/user-service";
import { UserProfile } from "@/types";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    getProfile().then(setProfile).catch(() => setProfile(null));
  }, []);

  return (
    <div className="panel p-8">
      <h1 className="text-3xl font-bold">Profile</h1>
      <p className="mt-2 text-base-content/70">Your account summary and access role.</p>
      {profile ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-base-200 p-5">
            <p className="text-sm text-base-content/60">Name</p>
            <p className="mt-2 text-xl font-semibold">{profile.name}</p>
          </div>
          <div className="rounded-3xl bg-base-200 p-5">
            <p className="text-sm text-base-content/60">Email</p>
            <p className="mt-2 text-xl font-semibold">{profile.email}</p>
          </div>
          <div className="rounded-3xl bg-base-200 p-5">
            <p className="text-sm text-base-content/60">Role</p>
            <p className="mt-2 text-xl font-semibold">{profile.role}</p>
          </div>
          <div className="rounded-3xl bg-base-200 p-5">
            <p className="text-sm text-base-content/60">Created</p>
            <p className="mt-2 text-xl font-semibold">{new Date(profile.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      ) : (
        <p className="mt-6 text-base-content/70">Login required to view profile.</p>
      )}
    </div>
  );
}

