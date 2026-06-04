"use client";

import { useEffect, useState } from "react";
import { Building, Calendar, Phone, User } from "lucide-react";
import { getOwnerLeads } from "@/services/user-service";
import { Lead } from "@/types";

export default function OwnerLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    getOwnerLeads().then(setLeads).catch(() => setLeads([]));
  }, []);

  return (
    <div className="panel p-8">
      <h1 className="text-3xl font-extrabold text-[#111827]">Callback Leads</h1>
      <p className="mt-2 text-sm font-medium text-[#64748b]">Users who requested a callback on your listings appear here.</p>

      <div className="mt-8 space-y-4">
        {leads.length > 0 ? (
          leads.map((lead) => (
            <div key={lead.id} className="group relative overflow-hidden rounded-2xl border border-base-300/80 bg-white/80 p-6 transition duration-300 hover:border-[#0f9f8f]/30 hover:bg-white">
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#0f9f8f] to-transparent opacity-50 transition group-hover:opacity-100" />

              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 text-[#111827]">
                    <Building className="size-4 text-[#0f9f8f]" />
                    <span className="text-lg font-bold">{lead.propertyTitle}</span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs font-semibold text-[#64748b]">
                    <div className="flex items-center gap-1.5 rounded-lg bg-base-200/80 px-2.5 py-1">
                      <User className="size-3.5 text-[#0f9f8f]" />
                      <span>{lead.contactName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg bg-base-200/80 px-2.5 py-1">
                      <Phone className="size-3.5 text-[#0f9f8f]" />
                      <span>{lead.contactPhone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start text-xs font-semibold text-[#64748b] md:self-center">
                  <Calendar className="size-4" />
                  <span>
                    {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-base-300 py-12 text-center">
            <Phone className="mx-auto mb-3 size-12 text-[#94a3b8]" />
            <p className="font-medium text-[#64748b]">No callback leads yet.</p>
            <p className="mt-1 text-xs text-[#94a3b8]">When seekers click Request Callback, their lead will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
