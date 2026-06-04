"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Building, Calendar, MessageSquare } from "lucide-react";
import { getMyEnquiries } from "@/services/user-service";
import { Enquiry } from "@/types";

export default function MyEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  useEffect(() => {
    getMyEnquiries().then(setEnquiries).catch(() => setEnquiries([]));
  }, []);

  return (
    <div className="panel p-8">
      <h1 className="text-3xl font-extrabold text-[#111827]">My Enquiries</h1>
      <p className="mt-2 text-sm font-medium text-[#64748b]">Track and view enquiries sent to property publishers.</p>

      <div className="mt-8 space-y-4">
        {enquiries.length > 0 ? (
          enquiries.map((enquiry) => (
            <div key={enquiry.id} className="group relative overflow-hidden rounded-2xl border border-base-300/80 bg-white/80 p-6 transition duration-300 hover:border-[#ef3d81]/30 hover:bg-white">
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#ef3d81] to-transparent opacity-50 transition group-hover:opacity-100" />

              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#111827]">
                    <Building className="size-4 text-[#ef3d81]" />
                    <span className="text-lg font-bold">{enquiry.propertyTitle}</span>
                  </div>

                  <div className="flex items-start gap-2 text-[#64748b]">
                    <MessageSquare className="mt-1 size-4 flex-shrink-0 text-[#0f9f8f]" />
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
            <p className="font-medium text-[#64748b]">No enquiries submitted yet.</p>
            <Link href="/properties" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#ef3d81] hover:underline">
              Browse properties to enquire <ArrowRight className="size-3" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
