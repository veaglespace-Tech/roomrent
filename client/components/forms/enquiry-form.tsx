"use client";

import { FormEvent, useState } from "react";
import { MessageCircle, SendHorizonal } from "lucide-react";
import { sendEnquiry } from "@/services/user-service";
import { enquirySchema, firstZodError } from "@/lib/validation";

export function EnquiryForm({ propertyId }: { propertyId: number }) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const parsed = enquirySchema.safeParse({ message });
    if (!parsed.success) {
      setStatus(firstZodError(parsed.error));
      return;
    }

    try {
      setLoading(true);
      await sendEnquiry(propertyId, parsed.data.message);
      setMessage("");
      setStatus("Enquiry sent successfully.");
    } catch {
      setStatus("Unable to send enquiry. Please login and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-glass space-y-4 p-5">
      <div className="flex items-start gap-3">
        <div className="icon-tile shrink-0">
          <MessageCircle className="size-5" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Send Enquiry</h3>
          <p className="text-sm text-base-content/70">Ask about availability, deposit and visit timings.</p>
        </div>
      </div>
      <label className="form-glass-field block">
        <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">Message</span>
        <textarea
          className="mt-2 min-h-36 w-full resize-none bg-transparent text-sm outline-none"
          placeholder="Hi, I am interested in this property. Please share availability, deposit, and visit timings."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </label>
      {status ? <p className="text-sm text-base-content/70">{status}</p> : null}
      <button type="submit" className="glow-button" disabled={loading}>
        <SendHorizonal className="relative size-4" />
        {loading ? "Sending..." : "Send Enquiry"}
      </button>
    </form>
  );
}
