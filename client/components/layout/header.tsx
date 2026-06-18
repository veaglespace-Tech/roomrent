"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, ChevronDown, Globe, HelpCircle, LogIn, Menu, MessageSquare, Sparkles, X } from "lucide-react";
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
] as const;

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <span className="flex size-10 items-center justify-center border border-[var(--rf-line)] bg-[var(--rf-panel)] text-[var(--rf-cyan)]">
        <Building2 className="size-4" />
      </span>
      <span className="text-sm font-bold tracking-wide text-[var(--rf-ink)]">RentFlow</span>
    </Link>
  );
}

function DesktopTabs() {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    setActiveMenu(null);
  }, [pathname]);

  return (
    <div className="hidden w-full flex-col gap-2 lg:flex">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--rf-line)] pb-3">
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
          "children" in item ? (
            <div key={item.label} className="nav-dropdown-parent relative">
              <button
                type="button"
                className={`nav-link ${activeMenu === item.label ? "text-[var(--rf-cyan)]" : ""}`}
                aria-expanded={activeMenu === item.label}
                onClick={() => setActiveMenu((current) => (current === item.label ? null : item.label))}
              >
                {item.label}
                <ChevronDown className="size-4 transition" />
              </button>
              <div className={`nav-dropdown nav-dropdown-center w-64 ${activeMenu === item.label ? "nav-dropdown-open" : ""}`}>
                <div className="grid gap-1 p-2">
                  {item.children.map((child) => (
                    <Link key={child.label} href={child.href} className="dropdown-link" onClick={() => setActiveMenu(null)}>
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

function CompactTabs() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const activeItem = navTabs.find((item) => item.label === activeMenu);
  const activeChildren = activeItem && "children" in activeItem ? activeItem.children : null;

  useEffect(() => {
    setActiveMenu(null);
  }, [pathname]);

  return (
    <div className="lg:hidden">
      <div className="compact-nav-strip">
        {navTabs.map((item) =>
          "children" in item ? (
            <button
              key={item.label}
              type="button"
              className={`compact-nav-tab ${activeMenu === item.label ? "compact-nav-tab-active" : ""}`}
              onClick={() => setActiveMenu((current) => (current === item.label ? null : item.label))}
            >
              {item.label}
              <ChevronDown className="size-3.5" />
            </button>
          ) : (
            <Link key={item.label} href={item.href} className={`compact-nav-tab ${pathname === item.href ? "compact-nav-tab-active" : ""}`}>
              {item.label}
            </Link>
          )
        )}
      </div>
      {activeChildren ? (
        <div className="compact-nav-panel">
          {activeChildren.map((child) => (
              <Link key={child.label} href={child.href} className="compact-nav-link" onClick={() => setActiveMenu(null)}>
                {child.label}
              </Link>
            ))}
        </div>
      ) : null}
    </div>
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
    setActiveMenu(null);
  }, [pathname]);

  return (
    <div className="relative lg:hidden">
      <button type="button" className="mobile-menu-button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open ? (
        <div className="fixed inset-0 z-50">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-slate-950/20" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[min(86vw,320px)] border-r border-[var(--rf-line)] bg-[var(--rf-panel)] shadow-[18px_0_48px_-30px_rgba(15,23,42,0.38)]">
            <div className="flex items-center justify-between border-b border-[var(--rf-line)] px-4 py-4">
              <Logo />
              <button type="button" className="mobile-menu-button" onClick={() => setOpen(false)}>
                <X className="size-5" />
              </button>
            </div>
            <div className="grid gap-4 p-4">
              <div className="grid gap-2">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="mobile-nav-direct"
                      onClick={() => setOpen(false)}
                    >
                      <span className="inline-flex items-center gap-2">
                        <Icon className="size-4" />
                        {link.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
              <div className="grid gap-2">
                {navTabs.map((item) =>
                  "children" in item ? (
                    <div key={item.label} className="mobile-nav-group">
                      <button
                        type="button"
                        className="mobile-nav-trigger"
                        aria-expanded={activeMenu === item.label}
                        onClick={() => setActiveMenu((current) => (current === item.label ? null : item.label))}
                      >
                        {item.label}
                        <ChevronDown className="size-4" />
                      </button>
                      {activeMenu === item.label ? (
                        <div className="mobile-nav-panel">
                          {item.children.map((child) => (
                            <Link key={child.label} href={child.href} className="mobile-nav-link" onClick={() => setOpen(false)}>
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <Link key={item.label} href={item.href} className="mobile-nav-direct" onClick={() => setOpen(false)}>
                      {item.label}
                    </Link>
                  )
                )}
              </div>
              <Link href="/register" className="mobile-nav-direct mobile-nav-trigger-featured" onClick={() => setOpen(false)}>
                Get Started
              </Link>
            </div>
          </div>
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
          <CompactTabs />
        </div>
      </div>
    </header>
  );
}
