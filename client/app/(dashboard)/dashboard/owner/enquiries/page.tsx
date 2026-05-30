"use client";

import { useEffect, useState } from "react";
import { getOwnerEnquiries } from "@/services/user-service";
import { Enquiry } from "@/types";
import { MessageSquare, Calendar, Building, User, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function OwnerEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  useEffect(() => {
    getOwnerEnquiries().then(setEnquiries).catch(() => setEnquiries([]));
  }, []);

  return (
    <div className="panel p-8">
      <h1 className="text-3xl font-extrabold text-white">Owner Enquiries</h1>
      <p className="mt-2 text-sm text-slate-400">Manage inquiries received from interested seekers.</p>

      <div className="mt-8 space-y-4">
        {enquiries.length > 0 ? (
          enquiries.map((enquiry) => (
            <div key={enquiry.id} className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition duration-300 hover:border-pink-500/30 hover:bg-white/[0.04] group">
              <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-pink-500 to-transparent opacity-50 group-hover:opacity-100 transition" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 text-slate-200">
                    <Building className="size-4 text-pink-400" />
                    <span className="font-bold text-lg">{enquiry.propertyTitle}</span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-400">
                    <div className="flex items-center gap-1.5 rounded-lg bg-white/[0.03] px-2.5 py-1">
                      <User className="size-3.5 text-cyan-400" />
                      <span>{enquiry.userName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg bg-white/[0.03] px-2.5 py-1">
                      <Mail className="size-3.5 text-cyan-400" />
                      <span>{enquiry.userEmail}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 text-slate-300 bg-white/[0.01] p-3 rounded-xl border border-white/5">
                    <MessageSquare className="size-4 mt-1 flex-shrink-0 text-amber-400" />
                    <p className="text-sm italic leading-relaxed">"{enquiry.message}"</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 self-start md:self-center">
                  <Calendar className="size-4" />
                  <span>{new Date(enquiry.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
            <MessageSquare className="size-12 mx-auto text-slate-600 mb-3" />
            <p className="text-slate-400 font-medium">No inquiries received yet.</p>
            <p className="text-xs text-slate-500 mt-1">Once room seekers ask about your listings, they will show up here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
