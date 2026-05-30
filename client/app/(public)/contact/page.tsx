"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Mail, MapPin, MessageCircle, Phone, SendHorizonal, Sparkles } from "lucide-react";
import { contactSchema, firstZodError } from "@/lib/validation";

const contactReasons = ["Room enquiry", "Post property", "Owner support", "Partnership"];

export default function ContactPage() {
  const [reason, setReason] = useState(contactReasons[0]);
  const [status, setStatus] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const parsed = contactSchema.safeParse({
      name: data.get("name"),
      phone: data.get("phone"),
      email: data.get("email"),
      message: data.get("message")
    });
    if (!parsed.success) {
      setStatus(firstZodError(parsed.error));
      return;
    }

    setStatus("Thanks. Your message is ready for the RoomRent Maharashtra team.");
    event.currentTarget.reset();
    setReason(contactReasons[0]);
  };

  return (
    <section className="page-shell py-10">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bento-shell min-h-[620px]">
          <div className="relative flex h-full flex-col justify-between p-6 sm:p-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                <Sparkles className="size-4 text-[#ff9f74]" />
                Contact us
              </div>
              <h1 className="mt-7 text-4xl font-bold leading-tight text-white md:text-5xl">
                Tell us what you need. We will help you move faster.
              </h1>
              <p className="mt-5 text-sm leading-7 text-white/65">
                Reach out for rooms, PGs, owner listing support, commercial spaces or city coverage questions across Maharashtra.
              </p>
            </div>

            <div className="mt-10 grid gap-4">
              <div className="bento-card">
                <Mail className="size-6 text-[#75e6d8]" />
                <p className="mt-4 text-sm text-white/60">Email</p>
                <p className="text-lg font-semibold">hello@roomrentmaharashtra.com</p>
              </div>
              <div className="bento-card">
                <Phone className="size-6 text-[#ff9f74]" />
                <p className="mt-4 text-sm text-white/60">Support</p>
                <p className="text-lg font-semibold">Owner and seeker assistance</p>
              </div>
              <div className="bento-card">
                <MapPin className="size-6 text-[#ff7fac]" />
                <p className="mt-4 text-sm text-white/60">Coverage</p>
                <p className="text-lg font-semibold">Mumbai, Pune, Nagpur, Nashik, Thane and more</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form-glass space-y-6 p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-base-300/70 pb-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ef3d81]">Message details</p>
              <h2 className="mt-2 text-3xl font-bold text-neutral">Contact RoomRent Maharashtra</h2>
            </div>
            <div className="icon-tile">
              <MessageCircle className="size-5" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="form-glass-field">
              <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">Full name</span>
              <input name="name" required className="mt-2 w-full bg-transparent text-sm outline-none" placeholder="Your name" />
            </label>
            <label className="form-glass-field">
              <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">Phone</span>
              <input name="phone" required inputMode="numeric" maxLength={10} className="mt-2 w-full bg-transparent text-sm outline-none" placeholder="Mobile number" />
            </label>
            <label className="form-glass-field sm:col-span-2">
              <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">Email</span>
              <input name="email" type="email" required className="mt-2 w-full bg-transparent text-sm outline-none" placeholder="you@example.com" />
            </label>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-base-content/75">I need help with</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {contactReasons.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setReason(item)}
                  className={`rounded-[16px] border px-4 py-3 text-left text-sm font-semibold transition ${
                    reason === item
                      ? "border-[#ff5c8a]/40 bg-[#fff1f4] text-neutral shadow-[0_18px_40px_-32px_rgba(255,92,138,0.75)]"
                      : "border-base-300/70 bg-base-200/55 text-base-content/68 hover:border-[#ff5c8a]/28"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <input type="hidden" name="reason" value={reason} />
          </div>

          <label className="form-glass-field block">
            <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">Message</span>
            <textarea name="message" required className="mt-2 min-h-36 w-full resize-none bg-transparent text-sm outline-none" placeholder="Write your requirement, city, budget, and preferred move-in date." />
          </label>

          {status ? <p className="rounded-[16px] bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{status}</p> : null}

          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" className="glow-button">
              <SendHorizonal className="relative size-4" />
              Send Message
            </button>
            <Link href="/properties" className="inline-flex min-h-12 items-center gap-2 rounded-[14px] border border-base-300/70 px-5 text-sm font-semibold text-base-content/70 transition hover:border-[#ff5c8a]/30 hover:text-neutral">
              Browse first
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
