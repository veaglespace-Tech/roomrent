"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LockKeyhole } from "lucide-react";
import gsap from "gsap";

export function AuthCard({ title, description, children }) {
  const pathname = usePathname();
  const cardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    }, cardRef);
    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={cardRef}
      className="mx-auto w-full max-w-md auth-shell flex-col p-8 sm:p-10"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <Link href="/" className="group flex flex-col items-center gap-3">
          <span className="flex size-14 items-center justify-center rounded-[18px] bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-glow-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-glow">
            <Building2 className="size-6" />
          </span>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 font-heading">
            Room<span className="gradient-text">Rent</span>
          </span>
        </Link>
        
        <div className="flex w-full max-w-[200px] items-center justify-center gap-1 rounded-full bg-slate-100 p-1 border border-slate-200 shadow-inner mt-4">
          <Link 
            href="/login" 
            className={`flex-1 rounded-full px-4 py-1.5 text-xs font-bold text-center transition-colors ${pathname === "/login" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Login
          </Link>
          <Link 
            href="/register" 
            className={`flex-1 rounded-full px-4 py-1.5 text-xs font-bold text-center transition-colors ${pathname === "/register" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Register
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-indigo-500 justify-center">
          <LockKeyhole className="size-3.5" />
          Secure Gateway
        </div>
        <h1 className="mt-3 text-2xl font-extrabold font-heading text-slate-900 text-center">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed font-medium text-slate-500 text-center">{description}</p>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
