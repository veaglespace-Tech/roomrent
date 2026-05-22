"use client";

import { FormEvent, useState } from "react";
import { sendEnquiry } from "@/services/user-service";

export function EnquiryForm({ propertyId }: { propertyId: number }) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (message.trim().length < 10) {
      setStatus("Please enter at least 10 characters.");
      return;
    }

    try {
      setLoading(true);
      await sendEnquiry(propertyId, message);
      setMessage("");
      setStatus("Enquiry sent successfully.");
    } catch {
      setStatus("Unable to send enquiry. Please login and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="panel space-y-4 p-6">
      <div>
        <h3 className="text-xl font-semibold">Send Enquiry</h3>
        <p className="text-sm text-base-content/70">Introduce yourself and ask about availability or amenities.</p>
      </div>
      <textarea
        className="textarea textarea-bordered min-h-36 w-full"
        placeholder="Hi, I’m interested in this property. Please share availability, deposit, and visit timings."
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      {status ? <p className="text-sm text-base-content/70">{status}</p> : null}
      <button type="submit" className="btn btn-primary rounded-full" disabled={loading}>
        {loading ? "Sending..." : "Send Enquiry"}
      </button>
    </form>
  );
}

