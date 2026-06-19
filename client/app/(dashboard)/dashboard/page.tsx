"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Activity, AlertCircle, ArrowUpRight, Building2, CheckCircle2, Clock3, CreditCard, TrendingUp, Users } from "lucide-react";
import { getProfile } from "@/services/user-service";
import { UserProfile } from "@/types";

type CityKey = "All" | "Mumbai" | "Pune" | "Nagpur" | "Thane" | "Nashik" | "Kolhapur" | "Solapur" | "Chhatrapati Sambhajinagar";

interface Transaction {
  id: string;
  tenantName: string;
  tenantEmail: string;
  propertyUnit: string;
  dueDate: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  city: CityKey;
}

const mockTransactions: Transaction[] = [
  { id: "TX-1001", tenantName: "Rahul Sharma", tenantEmail: "rahul.sharma@gmail.com", propertyUnit: "Flat 202 - Raymond The Address", dueDate: "Jun 10, 2026", amount: 24500, status: "Paid", city: "Mumbai" },
  { id: "TX-1002", tenantName: "Priya Patil", tenantEmail: "priya.p@gmail.com", propertyUnit: "Flat 101 - Viman Nagar Heights", dueDate: "Jun 12, 2026", amount: 18000, status: "Paid", city: "Pune" },
  { id: "TX-1003", tenantName: "Amit Deshmukh", tenantEmail: "amit.d@yahoo.com", propertyUnit: "Room 3 - Boys PG, Hinjewadi", dueDate: "Jun 05, 2026", amount: 8500, status: "Overdue", city: "Pune" },
  { id: "TX-1004", tenantName: "Sneha Joshi", tenantEmail: "sneha.j@gmail.com", propertyUnit: "Flat 4B - Signia High, BKC", dueDate: "Jun 15, 2026", amount: 45000, status: "Pending", city: "Mumbai" },
  { id: "TX-1005", tenantName: "Vikram Kadam", tenantEmail: "vikram.k@outlook.com", propertyUnit: "Shop 12 - Sadar Market", dueDate: "Jun 04, 2026", amount: 12000, status: "Overdue", city: "Nagpur" },
  { id: "TX-1006", tenantName: "Anjali Gupta", tenantEmail: "anjali.g@gmail.com", propertyUnit: "Flat 304 - Juhu Ocean View", dueDate: "Jun 08, 2026", amount: 32000, status: "Paid", city: "Mumbai" }
];

export default function DashboardOverviewPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<CityKey>("All");

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  const filteredTransactions = useMemo(() => {
    if (selectedCity === "All") return mockTransactions;
    return mockTransactions.filter((transaction) => transaction.city === selectedCity);
  }, [selectedCity]);

  const stats = useMemo(() => {
    const totalCollected = filteredTransactions.filter((item) => item.status === "Paid").reduce((sum, item) => sum + item.amount, 0);
    const overdueCount = filteredTransactions.filter((item) => item.status === "Overdue").length;
    const pendingCount = filteredTransactions.filter((item) => item.status === "Pending").length;
    const paidCount = filteredTransactions.filter((item) => item.status === "Paid").length;

    return { totalCollected, overdueCount, pendingCount, paidCount };
  }, [filteredTransactions]);

  if (loading) {
    return (
      <div className="flex min-h-[450px] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-[var(--rf-cyan)]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="dashboard-empty-state">
        <Users className="size-8 text-[var(--rf-cyan)]" />
        <h1 className="text-xl font-bold">Profile unavailable</h1>
        <p>Login is required to view dashboard details.</p>
        <Link href="/login" className="landing-primary-button mt-4 px-6 py-2">
          Login account
        </Link>
      </div>
    );
  }

  const monthSeries = [
    { label: "Jan", value: 38 },
    { label: "Feb", value: 52 },
    { label: "Mar", value: 64 },
    { label: "Apr", value: 45 },
    { label: "May", value: 72 },
    { label: "Jun", value: 84 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-[rgba(15,23,42,0.12)] pb-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--rf-cyan)]">For owner</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight">Greetings, Dashboard</h1>
          <p className="mt-2 text-sm text-[var(--rf-muted)]">Your personalized owner-investor dashboard.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["All", "Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Kolhapur", "Solapur", "Chhatrapati Sambhajinagar"] as CityKey[]).map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => setSelectedCity(city)}
              className={`border px-4 py-2 text-xs font-bold transition ${
                selectedCity === city
                  ? "border-[var(--rf-cyan)] bg-[rgba(15,118,110,0.08)] text-[var(--rf-cyan)]"
                  : "border-[rgba(15,23,42,0.12)] text-[var(--rf-muted)] hover:border-[var(--rf-cyan)] hover:text-[var(--rf-cyan)]"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Orders", value: "123", change: "+8.2%", icon: CheckCircle2 },
          { label: "Approved", value: "45", change: "+3.4%", icon: Building2 },
          { label: "Month total", value: `Rs. ${stats.totalCollected.toLocaleString("en-IN")}`, change: "+4.7%", icon: TrendingUp },
          { label: "Revenue", value: `Rs. ${(stats.totalCollected / 10).toLocaleString("en-IN")}`, change: "+0.4%", icon: CreditCard }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="surface-card p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--rf-muted)]">{item.label}</p>
                <span className="flex size-10 items-center justify-center border border-[rgba(15,118,110,0.18)] bg-[rgba(15,118,110,0.08)] text-[var(--rf-cyan)]">
                  <Icon className="size-5" />
                </span>
              </div>
              <h3 className="mt-5 text-2xl font-bold">{item.value}</h3>
              <p className="mt-2 text-xs font-semibold text-[var(--rf-cyan)]">{item.change}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <div className="surface-card p-5">
            <div className="flex items-center justify-between border-b border-[rgba(15,23,42,0.12)] pb-4">
              <div>
                <h2 className="text-base font-bold">Greetings, Dashboard</h2>
                <p className="text-xs text-[var(--rf-muted)]">Your personalized owner-investor dashboard.</p>
              </div>
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--rf-cyan)]">
                View report <ArrowUpRight className="size-4" />
              </span>
            </div>
            <div className="mt-6 grid h-56 grid-cols-6 items-end gap-3">
              {monthSeries.map((month) => (
                <div key={month.label} className="group flex h-full flex-col items-center justify-end gap-2">
                  <div className="w-full rounded-t-[4px] border border-[rgba(15,118,110,0.18)] bg-[rgba(15,118,110,0.08)] transition group-hover:bg-[var(--rf-cyan)]" style={{ height: `${month.value}%` }} />
                  <span className="text-xs text-[var(--rf-muted)]">{month.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="surface-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--rf-muted)]">Paid invoices</p>
                  <h3 className="mt-2 text-2xl font-bold">Rs. {stats.totalCollected.toLocaleString("en-IN")}</h3>
                </div>
                <div className="flex size-12 items-center justify-center border border-[rgba(15,118,110,0.18)] bg-[rgba(15,118,110,0.08)] text-[var(--rf-cyan)]">
                  <Activity className="size-5" />
                </div>
              </div>
              <p className="mt-4 text-sm text-[var(--rf-muted)]">Current fiscal year collected total.</p>
            </div>
            <div className="surface-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--rf-muted)]">Pending cases</p>
                  <h3 className="mt-2 text-2xl font-bold">{stats.pendingCount}</h3>
                </div>
                <div className="flex size-12 items-center justify-center border border-[rgba(15,118,110,0.18)] bg-[rgba(15,118,110,0.08)] text-[var(--rf-cyan)]">
                  <Clock3 className="size-5" />
                </div>
              </div>
              <p className="mt-4 text-sm text-[var(--rf-muted)]">Requires follow-up this month.</p>
            </div>
          </div>

          <div className="surface-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-[rgba(15,23,42,0.12)] p-5">
              <div>
                <h2 className="text-base font-bold">Bookings</h2>
                <p className="text-xs text-[var(--rf-muted)]">Latest invoices and occupancy status.</p>
              </div>
              <button className="landing-secondary-button min-h-10 px-4 text-xs" type="button">
                Add booking
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="text-xs uppercase tracking-[0.18em] text-[var(--rf-muted)]">
                    <th className="px-5 py-4">Tenant</th>
                    <th className="px-5 py-4">Property</th>
                    <th className="px-5 py-4">Due</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-t border-[rgba(15,23,42,0.08)] text-sm">
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-semibold">{transaction.tenantName}</p>
                          <p className="text-xs text-[var(--rf-muted)]">{transaction.tenantEmail}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[var(--rf-muted)]">{transaction.propertyUnit}</td>
                      <td className="px-5 py-4 text-[var(--rf-muted)]">{transaction.dueDate}</td>
                      <td className="px-5 py-4 font-semibold">Rs. {transaction.amount.toLocaleString("en-IN")}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 border px-2.5 py-1 text-xs font-semibold ${
                          transaction.status === "Paid"
                            ? "border-[rgba(83,211,138,0.38)] text-[var(--rf-success)]"
                            : transaction.status === "Pending"
                              ? "border-[rgba(255,184,77,0.38)] text-[var(--rf-warning)]"
                              : "border-[rgba(255,107,107,0.38)] text-[var(--rf-danger)]"
                        }`}>
                          <span className={`size-1.5 rounded-full ${
                            transaction.status === "Paid"
                              ? "bg-[var(--rf-success)]"
                              : transaction.status === "Pending"
                                ? "bg-[var(--rf-warning)]"
                                : "bg-[var(--rf-danger)]"
                          }`} />
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--rf-muted)]">Occupancy Status</p>
                <h3 className="mt-2 text-xl font-bold">Inventory allocation</h3>
              </div>
              <AlertCircle className="size-5 text-[var(--rf-cyan)]" />
            </div>
            <div className="mt-6 flex flex-col items-center gap-5">
              <div className="relative size-32">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(15,118,110,0.12)" strokeWidth="3.5" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--rf-cyan)" strokeWidth="3.5" strokeDasharray="72 28" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">72%</span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--rf-muted)]">Occupied</span>
                </div>
              </div>
              <div className="w-full space-y-2 text-sm">
                {[
                  { label: "Occupied", value: "72%" },
                  { label: "Vacant", value: "20%" },
                  { label: "Maintenance", value: "8%" }
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between border border-[rgba(15,23,42,0.08)] px-3 py-2">
                    <span className="text-[var(--rf-muted)]">{item.label}</span>
                    <span className="font-semibold text-[var(--rf-ink)]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="surface-card p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--rf-muted)]">Active summary</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--rf-muted)]">Occupied listings</span>
                <span className="text-sm font-semibold">{stats.paidCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--rf-muted)]">Pending invoices</span>
                <span className="text-sm font-semibold">{stats.pendingCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--rf-muted)]">Overdue</span>
                <span className="text-sm font-semibold text-[var(--rf-danger)]">{stats.overdueCount}</span>
              </div>
            </div>
          </div>

          <div className="surface-card p-5">
            <h3 className="text-lg font-bold">Quick actions</h3>
            <div className="mt-4 grid gap-3">
              <Link href="/dashboard/owner/add-property" className="landing-primary-button">
                Add property
              </Link>
              <Link href="/dashboard/owner/my-listings" className="landing-secondary-button">
                View my listings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
