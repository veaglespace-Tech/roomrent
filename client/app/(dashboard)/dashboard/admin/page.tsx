"use client";

import { useEffect, useState } from "react";
import { getAdminDashboard } from "@/services/user-service";
import { AdminDashboard } from "@/types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboard | null>(null);

  useEffect(() => {
    getAdminDashboard().then(setStats).catch(() => setStats(null));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats && Object.entries(stats).map(([key, value]) => (
          <div key={key} className="panel p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-base-content/60">{key}</p>
            <p className="mt-4 text-4xl font-bold text-primary">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

