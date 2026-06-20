"use client";

import { useEffect, useState } from "react";
import { Check, X, Clock } from "lucide-react";
import { Property } from "@/types";
import api from "@/services/api";
import { PropertyCard } from "@/components/property/property-card";

export default function ReviewQueuePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const { data } = await api.get<Property[]>("/admin/moderation/queue");
        setProperties(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    void fetchQueue();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await api.post(`/admin/moderation/properties/${id}/approve`);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await api.post(`/admin/moderation/properties/${id}/reject`);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral">Review Queue</h1>
        <p className="mt-1 text-sm text-base-content/70">Approve or reject pending properties.</p>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-96 animate-pulse rounded-[28px] bg-base-300" />
          <div className="h-96 animate-pulse rounded-[28px] bg-base-300" />
        </div>
      ) : properties.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <div key={property.id} className="relative">
              <PropertyCard property={property} onSavedChange={() => {}} />
              <div className="absolute inset-x-0 bottom-[-20px] z-10 flex items-center justify-center gap-3">
                <button
                  onClick={() => handleReject(property.id)}
                  className="flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-red-600 shadow-[0_12px_24px_-12px_rgba(220,38,38,0.5)] transition hover:bg-red-50 hover:shadow-none"
                >
                  <X className="size-5" />
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(property.id)}
                  className="flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-emerald-600 shadow-[0_12px_24px_-12px_rgba(5,150,105,0.5)] transition hover:bg-emerald-50 hover:shadow-none"
                >
                  <Check className="size-5" />
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-base-300 bg-base-100 p-8 text-center">
          <div className="rounded-full bg-emerald-50 p-4">
            <Check className="size-8 text-emerald-500" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-neutral">All caught up!</h2>
          <p className="mt-2 text-sm text-base-content/70">No properties waiting in the review queue.</p>
        </div>
      )}
    </div>
  );
}
