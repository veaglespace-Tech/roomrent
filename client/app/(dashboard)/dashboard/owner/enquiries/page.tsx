"use client";

import { useEffect, useState } from "react";
import { Building, Calendar, Mail, MessageSquare, User } from "lucide-react";
import { getOwnerEnquiries } from "@/services/user-service";
import { Enquiry } from "@/types";

export default function OwnerEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  useEffect(() => {
    getOwnerEnquiries().then(setEnquiries).catch(() => setEnquiries([]));
  }, []);

  return (
    <div className="panel p-8">
      <h1 className="text-3xl font-extrabold text-[#111827]">Listing Enquiries</h1>
      <p className="mt-2 text-sm font-medium text-[#64748b]">Manage enquiries received from interested seekers.</p>

      <div className="mt-8 space-y-4">
        {enquiries.length > 0 ? (
          enquiries.map((enquiry) => (
            <div key={enquiry.id} className="group relative overflow-hidden rounded-2xl border border-base-300/80 bg-white/80 p-6 transition duration-300 hover:border-[#ef3d81]/30 hover:bg-white">
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#ef3d81] to-transparent opacity-50 transition group-hover:opacity-100" />

              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 text-[#111827]">
                    <Building className="size-4 text-[#ef3d81]" />
                    <span className="text-lg font-bold">{enquiry.propertyTitle}</span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs font-semibold text-[#64748b]">
                    <div className="flex items-center gap-1.5 rounded-lg bg-base-200/80 px-2.5 py-1">
                      <User className="size-3.5 text-[#0f9f8f]" />
                      <span>{enquiry.userName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg bg-base-200/80 px-2.5 py-1">
                      <Mail className="size-3.5 text-[#0f9f8f]" />
                      <span>{enquiry.userEmail}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 rounded-xl border border-base-300/70 bg-white p-3 text-[#475569]">
                    <MessageSquare className="mt-1 size-4 flex-shrink-0 text-[#ff7a35]" />
                    <p className="text-sm italic leading-relaxed">"{enquiry.message}"</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start text-xs font-semibold text-[#64748b] md:self-center">
                  <Calendar className="size-4" />
                  <span>
                    {new Date(enquiry.createdAt).toLocaleDateString("en-IN", {
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
            <MessageSquare className="mx-auto mb-3 size-12 text-[#94a3b8]" />
            <p className="font-medium text-[#64748b]">No enquiries received yet.</p>
            <p className="mt-1 text-xs text-[#94a3b8]">Once room seekers ask about your listings, they will show up here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
