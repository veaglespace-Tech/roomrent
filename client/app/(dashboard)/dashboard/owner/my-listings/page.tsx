"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BadgeIndianRupee, Building, MapPin, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import { deleteProperty, getOwnerProperties } from "@/services/property-service";
import { Property } from "@/types";

export default function MyListingsPage() {
  const [properties, setProperties] = useState<Property[]>([]);

  const loadListings = () => getOwnerProperties().then(setProperties).catch(() => setProperties([]));
  const activeProperties = properties.filter((property) => (property.availabilityStatus || "AVAILABLE") === "AVAILABLE");
  const totalValue = properties.reduce((sum, property) => sum + (property.price || 0), 0);
  const averageRent = properties.length > 0 ? Math.round(totalValue / properties.length) : 0;

  useEffect(() => {
    loadListings();
  }, []);

  return (
    <div className="space-y-6">
      <div className="panel p-8">
      <div className="flex flex-col justify-between gap-4 border-b border-base-300/70 pb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-[#111827]">My Listings</h1>
          <p className="mt-2 text-sm font-medium text-[#64748b]">Manage and edit your published properties.</p>
        </div>
        <Link href="/dashboard/owner/add-property" className="glow-button flex items-center gap-1.5 px-5 py-2.5 text-sm self-start sm:self-center">
          <Plus className="size-4" />
          Add Property
        </Link>
      </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Total listings", value: properties.length, hint: "All published properties" },
          { label: "Active listings", value: activeProperties.length, hint: "Currently available" },
          { label: "Average rent", value: averageRent ? `Rs. ${averageRent}` : "Rs. 0", hint: "Across your inventory" }
        ].map((item) => (
          <div key={item.label} className="panel p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ef3d81]">{item.label}</p>
                <p className="mt-3 text-3xl font-extrabold text-[#111827]">{item.value}</p>
                <p className="mt-2 text-sm text-[#64748b]">{item.hint}</p>
              </div>
              <div className="icon-tile">
                <Sparkles className="size-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {properties.length > 0 ? (
          properties.map((property) => (
            <div key={property.id} className="group relative overflow-hidden rounded-2xl border border-base-300/80 bg-white/80 p-6 transition duration-300 hover:border-[#0f9f8f]/30 hover:bg-white">
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#0f9f8f] to-transparent opacity-50 transition group-hover:opacity-100" />

              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-[#0f9f8f]/20 bg-[#0f9f8f]/10 px-2.5 py-0.5 text-xs font-semibold text-[#0f766e]">
                      {property.type}
                    </span>
                    {property.category ? (
                      <span className="inline-flex items-center rounded-full border border-[#ef3d81]/20 bg-[#ef3d81]/10 px-2.5 py-0.5 text-xs font-semibold text-[#d92f71]">
                        {property.category}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="text-lg font-bold text-[#111827]">{property.title}</h3>

                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#64748b]">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="size-4 flex-shrink-0 text-[#0f9f8f]" />
                      <span>{property.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BadgeIndianRupee className="size-4 flex-shrink-0 text-emerald-600" />
                      <span className="font-semibold text-[#111827]">Rs. {property.price} / month</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end lg:self-center">
                  <Link className="btn-outline flex items-center gap-1.5 px-4 py-2 text-xs font-bold" href={`/dashboard/owner/edit-property/${property.id}`}>
                    <Pencil className="size-3.5" />
                    Edit
                  </Link>
                  <button
                    className="flex items-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-2 text-xs font-bold text-rose-600 transition hover:border-rose-500/30 hover:bg-rose-500/10"
                    onClick={async () => {
                      if (confirm("Are you sure you want to delete this listing?")) {
                        await deleteProperty(property.id);
                        loadListings();
                      }
                    }}
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-base-300 py-12 text-center">
            <Building className="mx-auto mb-3 size-12 text-[#94a3b8]" />
            <p className="font-medium text-[#64748b]">You haven't listed any properties yet.</p>
            <p className="mt-1 text-xs text-[#94a3b8]">Activate a plan and list your first accommodation.</p>
            <Link href="/dashboard/owner/add-property" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#0f9f8f] hover:underline">
              Add your first listing <ArrowRight className="size-3" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
