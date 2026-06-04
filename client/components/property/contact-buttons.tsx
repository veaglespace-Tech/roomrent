"use client";

import { useState } from "react";
import { Phone, MessageCircle, BellRing } from "lucide-react";
import { requestLead } from "@/services/user-service";
import { Property } from "@/types";

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function ContactButtons({ property }: { property: Property }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const rawPhone = property.contactNumber || "";
  const dialNumber = digitsOnly(rawPhone);
  const hasPhone = dialNumber.length >= 10;
  const message = encodeURIComponent(
    `Hi, I am interested in "${property.title}". Please share availability, visit timings and deposit details.`
  );
  const whatsappHref = hasPhone ? `https://wa.me/${dialNumber}?text=${message}` : "#";

  const handleCallback = async () => {
    try {
      setLoading(true);
      setStatus("");
      await requestLead(property.id);
      setStatus("Callback request saved. The owner can see it in their dashboard.");
    } catch {
      setStatus("Login required to request a callback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
        <a
          href={hasPhone ? `tel:${dialNumber}` : "#"}
          aria-disabled={!hasPhone}
          className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition ${
            hasPhone
              ? "bg-[#0f9f8f] text-white shadow-[0_18px_36px_-22px_rgba(15,159,143,0.9)] hover:brightness-95"
              : "cursor-not-allowed bg-base-200 text-base-content/40"
          }`}
        >
          <Phone className="size-4" />
          Call Now
        </a>

        <a
          href={hasPhone ? whatsappHref : "#"}
          target={hasPhone ? "_blank" : undefined}
          aria-disabled={!hasPhone}
          className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition ${
            hasPhone
              ? "bg-[#25D366] text-white shadow-[0_18px_36px_-22px_rgba(37,211,102,0.9)] hover:brightness-95"
              : "cursor-not-allowed bg-base-200 text-base-content/40"
          }`}
        >
          <MessageCircle className="size-4" />
          WhatsApp
        </a>

        <button
          type="button"
          onClick={handleCallback}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-2xl border border-[#ef3d81]/20 bg-[#fff1f4] px-4 py-3 text-sm font-bold text-[#d92f71] transition hover:border-[#ef3d81]/30 hover:bg-[#ffe8ee] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <BellRing className="size-4" />
          {loading ? "Saving..." : "Request Callback"}
        </button>
      </div>
      {status ? <p className="text-sm font-medium text-base-content/70">{status}</p> : null}
      <p className="text-xs leading-6 text-base-content/55">
        Callback requests are saved against your logged-in profile name and phone number.
      </p>
    </div>
  );
}
