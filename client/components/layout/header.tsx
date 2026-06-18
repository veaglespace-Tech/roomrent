"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, ChevronDown, Globe, HelpCircle, LogIn, Menu, MessageSquare, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

const quickLinks = [
  { label: "Help", href: "/contact", icon: HelpCircle },
  { label: "Support", href: "/contact", icon: MessageSquare },
  { label: "En", href: "#", icon: Globe },
  { label: "Log in", href: "/login", icon: LogIn }
];

const navTabs = [
  { label: "About Us", href: "/#about" },
  {
    label: "Properties",
    href: "/#properties",
    children: [
      { label: "Rooms", href: "/properties?type=ROOM" },
      { label: "Flats", href: "/properties?type=FLAT" },
      { label: "PG / Hostel", href: "/properties?type=PG" },
      { label: "Office & Shops", href: "/properties?type=HOSTEL" }
    ]
  },
  {
    label: "Services",
    href: "/#services",
    children: [
      { label: "Post requirement", href: "/contact" },
      { label: "Compare listings", href: "/compare" },
      { label: "Saved searches", href: "/dashboard/saved-searches" },
      { label: "Owner tools", href: "/dashboard/owner/add-property" }
    ]
  },
  { label: "Contact", href: "/contact" }
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <span className="flex size-10 items-center justify-center border border-[var(--rf-cyan)] bg-[rgba(21,197,206,0.12)] text-[var(--rf-cyan)]">
        <Building2 className="size-4" />
      </span>
      <span className="text-sm font-bold tracking-wide">RentFlow</span>
    </Link>
  );
}

function DesktopTabs() {
  const pathname = usePathname();

  return (
    <div className="hidden w-full flex-col gap-2 lg:flex">
      <div className="flex items-center justify-between gap-4 border-b border-[rgba(21,197,206,0.18)] pb-3">
        <span className="text-xs uppercase tracking-[0.22em] text-[var(--rf-cyan)]">Property Technology</span>
        <div className="flex flex-wrap items-center justify-end gap-3 text-xs text-[var(--rf-muted)]">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.label} href={link.href} className="inline-flex items-center gap-1.5 transition hover:text-[var(--rf-cyan)]">
                <Icon className="size-3.5" />
                {link.label}
              </Link>
            );
          })}
          <Link href="/register" className="landing-primary-button min-h-9 px-4 text-xs">
            <Sparkles className="size-4" />
            Get Started
          </Link>
        </div>
      </div>

      <nav className="flex flex-wrap items-center justify-center gap-0.5 pt-0.5">
        {navTabs.map((item) =>
          item.children ? (
            <div key={item.label} className="nav-dropdown-parent relative">
              <Link href={item.href} className={`nav-link ${pathname === item.href ? "text-[var(--rf-cyan)]" : ""}`}>
                {item.label}
                <ChevronDown className="size-4 transition" />
              </Link>
              <div className="nav-dropdown nav-dropdown-center w-64">
                <div className="grid gap-1 p-2">
                  {item.children.map((child) => (
                    <Link key={child.label} href={child.href} className="dropdown-link">
                      <span className="text-sm font-semibold text-[var(--rf-ink)]">{child.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Link key={item.label} href={item.href} className={`nav-link ${pathname === item.href ? "text-[var(--rf-cyan)]" : ""}`}>
              {item.label}
            </Link>
          )
        )}
      </nav>
    </div>
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative xl:hidden">
      <button type="button" className="mobile-menu-button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <Menu className="size-5" />
      </button>
      {open ? (
        <div className="mobile-nav-menu">
          <Link href="/properties?type=ROOM" className="mobile-nav-direct" onClick={() => setOpen(false)}>
            Rooms
          </Link>
          <Link href="/properties?type=FLAT" className="mobile-nav-direct" onClick={() => setOpen(false)}>
            Flats
          </Link>
          <Link href="/contact" className="mobile-nav-direct" onClick={() => setOpen(false)}>
            Post requirement
          </Link>
          <Link href="/compare" className="mobile-nav-direct" onClick={() => setOpen(false)}>
            Compare
          </Link>
          <Link href="/login" className="mobile-nav-direct" onClick={() => setOpen(false)}>Log in</Link>
          <Link href="/register" className="mobile-nav-direct mobile-nav-trigger-featured" onClick={() => setOpen(false)}>
            Get Started
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 px-3 pt-2 md:px-5">
      <div className="header-shell">
        <div className="page-shell flex min-h-[84px] flex-col gap-2 py-3">
          <div className="flex items-center justify-between gap-4">
            <Logo />
            <div className="hidden items-center gap-3 text-xs text-[var(--rf-muted)] md:flex lg:hidden">
              <Link href="/contact" className="inline-flex items-center gap-1.5 transition hover:text-[var(--rf-cyan)]">
                <HelpCircle className="size-3.5" />
                Help
              </Link>
              <Link href="/register" className="landing-primary-button min-h-9 px-4 text-xs">
                <Sparkles className="size-4" />
                Get Started
              </Link>
            </div>
            <MobileNav />
          </div>
          <DesktopTabs />
        </div>
      </div>
    </header>
  );
}
