"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, MessageCircle, Phone, SendHorizonal, Sparkles } from "lucide-react";
import gsap from "gsap";
import { contactSchema, firstZodError } from "@/lib/validation";

const contactReasons = ["Room enquiry", "Post property", "Owner support", "Partnership"];

export default function ContactPage() {
    const [reason, setReason] = useState(contactReasons[0]);
    const [status, setStatus] = useState("");
    
    // Refs for GSAP
    const containerRef = useRef(null);
    const leftPanelRef = useRef(null);
    const rightPanelRef = useRef(null);
    const infoCardsRef = useRef([]);
    const formFieldsRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Initial state
            gsap.set(leftPanelRef.current, { opacity: 0, x: -50 });
            gsap.set(rightPanelRef.current, { opacity: 0, x: 50 });
            gsap.set(infoCardsRef.current, { opacity: 0, y: 30 });
            gsap.set(formFieldsRef.current, { opacity: 0, y: 30 });

            // Animate panels
            gsap.to(leftPanelRef.current, { opacity: 1, x: 0, duration: 0.9, ease: "power4.out" });
            gsap.to(rightPanelRef.current, { opacity: 1, x: 0, duration: 0.9, ease: "power4.out", delay: 0.1 });

            // Stagger info cards
            gsap.to(infoCardsRef.current, { 
                opacity: 1, 
                y: 0, 
                duration: 0.7, 
                stagger: 0.15, 
                ease: "power3.out", 
                delay: 0.4 
            });

            // Stagger form fields
            gsap.to(formFieldsRef.current, { 
                opacity: 1, 
                y: 0, 
                duration: 0.7, 
                stagger: 0.1, 
                ease: "power3.out", 
                delay: 0.5 
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleSubmit = (event) => {
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
        <section className="flex items-center justify-center min-h-[calc(100dvh-100px)] p-4 sm:p-6 lg:p-8" ref={containerRef}>
            <div className="w-full max-w-6xl grid overflow-hidden rounded-[40px] border border-slate-200/80 bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] lg:grid-cols-[1fr_1.3fr] m-auto">
                
                {/* Left Panel */}
                <div ref={leftPanelRef} className="flex flex-col justify-between bg-slate-50/50 p-8 sm:p-12 lg:p-14 border-r border-slate-100">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-600 shadow-sm">
                            <Sparkles className="size-3.5 shrink-0" />
                            Get in touch
                        </div>
                        <h1 className="mt-8 text-4xl font-extrabold leading-[1.15] text-slate-900 md:text-5xl lg:text-[52px]">
                            We're here to help you move faster.
                        </h1>
                        <p className="mt-6 text-[17px] leading-relaxed text-slate-500 max-w-md font-medium">
                            Reach out for rooms, PGs, owner listing support, commercial spaces or city coverage questions across Maharashtra.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-4">
                        <div ref={el => infoCardsRef.current[0] = el} className="group flex items-center gap-5 rounded-[24px] border border-slate-200/60 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-indigo-200">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                                <Mail className="size-6 shrink-0" />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Email Us</p>
                                <p className="mt-1 text-[15px] font-bold text-slate-800">hello@roomrent.com</p>
                            </div>
                        </div>
                        
                        <div ref={el => infoCardsRef.current[1] = el} className="group flex items-center gap-5 rounded-[24px] border border-slate-200/60 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-indigo-200">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                                <Phone className="size-6 shrink-0" />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Call Support</p>
                                <p className="mt-1 text-[15px] font-bold text-slate-800">+91 98765 43210</p>
                            </div>
                        </div>

                        <div ref={el => infoCardsRef.current[2] = el} className="group flex items-center gap-5 rounded-[24px] border border-slate-200/60 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-indigo-200">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                                <MapPin className="size-6 shrink-0" />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Our Coverage</p>
                                <p className="mt-1 text-[15px] font-bold text-slate-800">Mumbai, Pune, Nagpur, Nashik</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div ref={rightPanelRef} className="bg-white p-8 sm:p-12 lg:p-16">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-500">Send a message</p>
                            <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">Contact RoomRent</h2>
                        </div>
                        <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50 text-indigo-600 sm:flex">
                            <MessageCircle className="size-6 shrink-0" />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <label ref={el => formFieldsRef.current[0] = el} className="block relative">
                                <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Full name</span>
                                <input name="name" required className="w-full rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3.5 text-[15px] font-semibold text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm" placeholder="John Doe" />
                            </label>
                            
                            <label ref={el => formFieldsRef.current[1] = el} className="block relative">
                                <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Phone number</span>
                                <input name="phone" required inputMode="numeric" maxLength={10} className="w-full rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3.5 text-[15px] font-semibold text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm" placeholder="10-digit mobile" />
                            </label>

                            <label ref={el => formFieldsRef.current[2] = el} className="block sm:col-span-2 relative">
                                <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Email address</span>
                                <input name="email" type="email" required className="w-full rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3.5 text-[15px] font-semibold text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm" placeholder="you@example.com" />
                            </label>
                        </div>

                        <div ref={el => formFieldsRef.current[3] = el}>
                            <p className="mb-3 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">I need help with</p>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {contactReasons.map((item) => (
                                    <button 
                                        key={item}
                                        type="button" 
                                        onClick={() => setReason(item)} 
                                        className={`rounded-[16px] border px-4 py-3.5 text-center text-[14px] font-bold transition-all duration-300 ${reason === item
                                            ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm"
                                            : "border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:bg-slate-50 hover:text-slate-700"
                                        }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                            <input type="hidden" name="reason" value={reason} />
                        </div>

                        <label ref={el => formFieldsRef.current[4] = el} className="block relative">
                            <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Your message</span>
                            <textarea name="message" required className="w-full rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3.5 text-[15px] font-semibold text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm min-h-[120px] resize-y" placeholder="Write your requirement, city, budget, and preferred move-in date." />
                        </label>

                        {status && (
                            <p ref={el => formFieldsRef.current[5] = el} className="rounded-[16px] bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700 border border-emerald-200 shadow-sm">
                                {status}
                            </p>
                        )}

                        <div ref={el => formFieldsRef.current[6] = el} className="mt-8 flex flex-wrap items-center gap-4">
                            <button type="submit" className="landing-primary-button h-14 min-w-[200px] text-[15px] flex items-center justify-center gap-2 shadow-sm flex-1 sm:flex-none">
                                <SendHorizonal className="size-5 shrink-0" />
                                Send Message
                            </button>
                            
                            <Link href="/properties" className="inline-flex h-14 items-center justify-center gap-2 rounded-[16px] border border-slate-200 bg-white px-6 text-[15px] font-bold text-slate-600 transition-all hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 shadow-sm flex-1 sm:flex-none">
                                Browse first
                                <ArrowRight className="size-4 shrink-0" />
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
