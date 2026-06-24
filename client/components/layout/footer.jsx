"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Building2, Mail, MapPin, Phone, Sparkles, Github, Twitter, Instagram, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useAppSelector } from "@/store/hooks";
import { getDashboardRoute, getStoredAuthRole } from "@/lib/auth-session";
import { featuredMaharashtraCities } from "@/lib/maharashtra-data";

export function Footer() {
  const user = useAppSelector((state) => state.auth.user);
  const role = user?.role || getStoredAuthRole();
  const dashboardHref = getDashboardRoute(role);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  
  const footerRef = useRef(null);
  const footerElementsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        footerElementsRef.current.filter(Boolean),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out", delay: 0.1, scrollTrigger: { trigger: footerRef.current, start: "top 95%" } }
      );
    }, footerRef);
    return () => ctx.revert();
  }, []);

  const workspaceLinks = role === "ADMIN"
    ? [
        { href: "/dashboard/admin", label: "Admin dashboard" },
        { href: "/dashboard/admin/review-queue", label: "Review queue" },
        { href: "/dashboard/admin/users", label: "Manage users" }
      ]
    : role === "OWNER"
      ? [
          { href: "/dashboard/owner", label: "Owner dashboard" },
          { href: "/dashboard/owner/my-listings", label: "My listings" },
          { href: "/dashboard/owner/add-property", label: "Add property" }
        ]
      : user
        ? [
            { href: "/dashboard/user", label: "User dashboard" },
            { href: "/dashboard/saved-properties", label: "Saved properties" },
            { href: "/dashboard/my-enquiries", label: "My enquiries" }
          ]
        : [
            { href: "/login", label: "Login" },
            { href: "/register", label: "Create account" }
          ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="px-3 pb-6 pt-16 md:px-5" ref={footerRef}>
      <div className="footer-shell">
        {/* Main footer grid */}
        <div className="page-shell grid gap-10 py-12 lg:grid-cols-[1.5fr_0.8fr_1fr_1.2fr]">

          {/* Brand column */}
          <div className="space-y-6" ref={el => footerElementsRef.current[0] = el}>
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-glow-sm">
                <Building2 className="size-5 shrink-0" />
              </span>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 font-heading">
                Room<span className="gradient-text">Rent</span>
              </span>
            </div>
            <p className="max-w-sm text-[15px] leading-7 text-slate-500">
              A premium rental platform connecting seekers, owners, and administrators across Maharashtra.
            </p>
            <div className="space-y-3 text-sm text-slate-500">
              <a href="mailto:contact@roomrent.com" className="flex items-center gap-3 hover:text-indigo-600 transition-colors">
                <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500"><Mail className="size-4 shrink-0" /></span>
                contact@roomrent.com
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-3 hover:text-indigo-600 transition-colors">
                <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500"><Phone className="size-4 shrink-0" /></span>
                +91 98765 43210
              </a>
              <p className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500"><MapPin className="size-4 shrink-0" /></span>
                Maharashtra, India
              </p>
            </div>
          </div>

          {/* Explore column */}
          <div ref={el => footerElementsRef.current[1] = el}>
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-indigo-600">Explore</h4>
            <ul className="mt-6 space-y-3.5 text-sm">
              <li>
                <Link className="footer-link font-semibold hover:text-indigo-600" href="/properties">
                  Browse properties
                </Link>
              </li>
              <li>
                <Link className="footer-link font-semibold hover:text-indigo-600" href="/contact">
                  Contact support
                </Link>
              </li>
              <li>
                <Link className="footer-link font-semibold hover:text-indigo-600" href="/compare">
                  Compare listings
                </Link>
              </li>
              <li>
                <Link className="footer-link font-semibold hover:text-indigo-600" href="/cities">
                  Browse by city
                </Link>
              </li>
            </ul>
          </div>

          {/* Workspace column */}
          <div ref={el => footerElementsRef.current[2] = el}>
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-indigo-600">Workspace</h4>
            <ul className="mt-6 space-y-3.5 text-sm">
              <li>
                <Link className="footer-link font-semibold hover:text-indigo-600" href={dashboardHref}>
                  Dashboard
                </Link>
              </li>
              {workspaceLinks.map((item) => (
                <li key={item.href}>
                  <Link className="footer-link font-semibold hover:text-indigo-600" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter column */}
          <div className="space-y-5" ref={el => footerElementsRef.current[3] = el}>
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-indigo-600">Newsletter</h4>
            <p className="text-[13px] text-slate-500 leading-relaxed max-w-xs">
              Stay updated with new listings, price trends, and Maharashtra real estate news.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-700 animate-bounce-in">
                <Sparkles className="size-4 shrink-0" />
                Thanks for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2 relative max-w-xs">
                <input
                  type="email"
                  placeholder="Email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-indigo-100 bg-indigo-50/50 pl-4 pr-12 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 flex items-center justify-center rounded-lg bg-indigo-600 px-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-indigo-500 active:scale-95"
                >
                  <ArrowRight className="size-4" />
                </button>
              </form>
            )}

            {/* Social links */}
            <div className="flex items-center gap-3 pt-3">
              <a href="#" aria-label="Twitter" className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-500 transition-all hover:-translate-y-1 hover:border-indigo-300 hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:shadow-indigo-500/30">
                <Twitter className="size-4 shrink-0" />
              </a>
              <a href="#" aria-label="Instagram" className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-500 transition-all hover:-translate-y-1 hover:border-indigo-300 hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:shadow-indigo-500/30">
                <Instagram className="size-4 shrink-0" />
              </a>
              <a href="#" aria-label="Github" className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-500 transition-all hover:-translate-y-1 hover:border-indigo-300 hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:shadow-indigo-500/30">
                <Github className="size-4 shrink-0" />
              </a>
            </div>
          </div>
        </div>

        {/* Cities Grid Section */}
        <div className="border-t border-indigo-100/60 bg-gradient-to-b from-transparent to-indigo-50/30">
          <div className="page-shell py-8">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-indigo-600 mb-6 text-center">Popular Cities</h4>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
              {featuredMaharashtraCities.map((city) => (
                <Link 
                  key={city.name} 
                  href={`/properties?city=${encodeURIComponent(city.name)}`}
                  className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  {city.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-indigo-100/60" ref={el => footerElementsRef.current[4] = el}>
          <div className="page-shell flex flex-col gap-3 py-6 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
            <p className="font-semibold text-slate-500">© {new Date().getFullYear()} RoomRent Maharashtra. All rights reserved.</p>
            <p className="flex items-center gap-2 font-bold text-slate-500">
              <Sparkles className="size-4 shrink-0 text-indigo-500" />
              Premium rental platform for Maharashtra
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
