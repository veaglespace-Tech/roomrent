"use client";

import { useEffect, useState } from "react";
import { Check, Clock, Phone, UserRound, X } from "lucide-react";
import api from "@/services/api";

interface Lead {
  id: number;
  propertyId: number;
  propertyTitle: string;
  contactName: string;
  contactPhone: string;
  status: string;
  createdAt: string;
}

export default function OwnerLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const { data } = await api.get<Lead[]>("/owner/leads");
        setLeads(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    void fetchLeads();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      const { data } = await api.put<Lead>(`/owner/leads/${id}/status`, { status });
      setLeads((prev) => prev.map((l) => (l.id === id ? data : l)));
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-50 border-blue-100 text-blue-600";
      case "CONTACTED":
        return "bg-amber-50 border-amber-100 text-amber-700";
      case "CLOSED":
        return "bg-emerald-50 border-emerald-100 text-emerald-700";
      default:
        return "bg-slate-50 border-slate-200 text-slate-600";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Callback Leads</h1>
        <p className="mt-1 text-sm text-slate-500">Manage prospective tenants who requested a callback.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      ) : leads.length > 0 ? (
        <div className="grid gap-4">
          {leads.map((lead) => (
            <div key={lead.id} className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 md:flex-row md:items-center md:justify-between hover:border-[#6366f1]/25 hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition duration-300">
              <div className="flex gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <UserRound className="size-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{lead.contactName}</h3>
                  <a href={`tel:${lead.contactPhone}`} className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600">
                    <Phone className="size-3.5" />
                    {lead.contactPhone}
                  </a>
                  <p className="mt-1 text-xs text-slate-400">
                    For: <span className="font-bold text-slate-600">{lead.propertyTitle}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 md:justify-end">
                <select
                  className={`rounded-lg border px-3 py-1.5 text-xs font-bold outline-none cursor-pointer transition ${getStatusClass(lead.status)}`}
                  value={lead.status}
                  onChange={(e) => updateStatus(lead.id, e.target.value)}
                >
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="CLOSED">Closed</option>
                </select>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
          <div className="rounded-2xl bg-indigo-50 p-4 text-indigo-500">
            <UserRound className="size-8" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-800">No leads yet</h2>
          <p className="mt-2 text-sm text-slate-500">When a user requests a callback on your properties, it will appear here.</p>
        </div>
      )}
    </div>
  );
}
