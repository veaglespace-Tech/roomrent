"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Pencil, Trash2, Building, MapPin, BadgeIndianRupee, Plus, AlertCircle, ArrowRight } from "lucide-react";
import { deleteProperty, getOwnerProperties } from "@/services/property-service";
import { Property } from "@/types";

export default function MyListingsPage() {
  const [properties, setProperties] = useState<Property[]>([]);

  const loadListings = () => getOwnerProperties().then(setProperties).catch(() => setProperties([]));

  useEffect(() => {
    loadListings();
  }, []);

  return (
    <div className="panel p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white animate-fade-in">My Listings</h1>
          <p className="mt-2 text-sm text-slate-400">Manage and edit your published properties.</p>
        </div>
        <Link href="/dashboard/owner/add-property" className="glow-button flex items-center gap-1.5 px-5 py-2.5 text-sm self-start sm:self-center">
          <Plus className="size-4" />
          Add Property
        </Link>
      </div>

      <div className="mt-8 space-y-4">
        {properties.length > 0 ? (
          properties.map((property) => (
            <div key={property.id} className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition duration-300 hover:border-cyan-500/30 hover:bg-white/[0.04] group">
              <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-cyan-400 to-transparent opacity-50 group-hover:opacity-100 transition" />
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
                      {property.type}
                    </span>
                    {property.category && (
                      <span className="inline-flex items-center rounded-full bg-pink-500/10 px-2.5 py-0.5 text-xs font-semibold text-pink-400 border border-pink-500/20">
                        {property.category}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-white transition">{property.title}</h3>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="size-4 text-cyan-400 flex-shrink-0" />
                      <span>{property.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BadgeIndianRupee className="size-4 text-emerald-400 flex-shrink-0" />
                      <span className="font-semibold text-slate-200">₹{property.price} / month</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end lg:self-center">
                  <Link 
                    className="btn-outline flex items-center gap-1.5 px-4 py-2 text-xs font-bold" 
                    href={`/dashboard/owner/edit-property/${property.id}`}
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </Link>
                  <button
                    className="flex items-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-2 text-xs font-bold text-rose-400 transition hover:bg-rose-500/10 hover:border-rose-500/30"
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
          <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
            <Building className="size-12 mx-auto text-slate-600 mb-3" />
            <p className="text-slate-400 font-medium">You haven't listed any properties yet.</p>
            <p className="text-xs text-slate-500 mt-1">Start renting by listing your first accommodation.</p>
            <Link href="/dashboard/owner/add-property" className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-cyan-400 hover:underline">
              Add your first listing <ArrowRight className="size-3" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
