"use client";

import { useEffect, useState } from "react";
import { Bell, Trash2 } from "lucide-react";
import { getSavedSearchAlerts, removeSearchAlert, SavedSearchAlert } from "@/lib/search-alerts";

export default function SavedSearchesPage() {
  const [alerts, setAlerts] = useState<SavedSearchAlert[]>([]);

  const load = async () => setAlerts(await getSavedSearchAlerts(true));

  useEffect(() => {
    void load();
    const refresh = async () => setAlerts(await getSavedSearchAlerts());
    window.addEventListener("roomrent-saved-search-updated", refresh);
    return () => window.removeEventListener("roomrent-saved-search-updated", refresh);
  }, []);

  return (
    <div className="panel p-8">
      <h1 className="text-3xl font-extrabold text-[#111827]">Saved Searches</h1>
      <p className="mt-2 text-sm font-medium text-[#64748b]">Search alerts that you can revisit later for the same filters.</p>

      <div className="mt-8 space-y-4">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div key={alert.id} className="rounded-2xl border border-base-300/80 bg-white/80 p-5">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <Bell className="size-4 text-[#ef3d81]" />
                    <h2 className="text-lg font-bold text-[#111827]">{alert.label}</h2>
                  </div>
                  <p className="mt-2 text-sm text-[#64748b]">
                    {[
                      alert.filters.location,
                      alert.filters.type,
                      alert.filters.gender,
                      alert.filters.minPrice ? `Min ${alert.filters.minPrice}` : "",
                      alert.filters.maxPrice ? `Max ${alert.filters.maxPrice}` : ""
                    ]
                      .filter(Boolean)
                      .join(" • ") || "No filters stored"}
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-2 text-xs font-bold text-rose-600 transition hover:border-rose-500/30 hover:bg-rose-500/10"
                  onClick={async () => {
                    await removeSearchAlert(alert.id);
                    await load();
                  }}
                >
                  <Trash2 className="size-3.5" />
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-base-300 py-12 text-center">
            <Bell className="mx-auto mb-3 size-12 text-[#94a3b8]" />
            <p className="font-medium text-[#64748b]">No saved search alerts yet.</p>
            <p className="mt-1 text-xs text-[#94a3b8]">Use the Save search alert button on the search page.</p>
          </div>
        )}
      </div>
    </div>
  );
}
