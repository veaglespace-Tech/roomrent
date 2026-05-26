"use client";

import Link from "next/link";
import { Building2, ChevronDown, Menu } from "lucide-react";

const navGroups = [
  {
    label: "Houses",
    links: [
      { label: "One Room Set", href: "/properties?type=ROOM&sharingType=Single Room" },
      { label: "Two Room Set", href: "/properties?type=ROOM&sharingType=2 Sharing" },
      { label: "Three Room Set", href: "/properties?type=ROOM&sharingType=3 Sharing" },
      { label: "Four Room Set", href: "/properties?type=ROOM&sharingType=4 Sharing" }
    ]
  },
  {
    label: "Flats",
    links: [
      { label: "1 BHK Flats", href: "/properties?type=FLAT&category=Flats / Apartments" },
      { label: "2 BHK Flats", href: "/properties?type=FLAT&category=Flats / Apartments" },
      { label: "3 BHK Flats", href: "/properties?type=FLAT&category=Flats / Apartments" },
      { label: "4 BHK Flats", href: "/properties?type=FLAT&category=Flats / Apartments" }
    ]
  },
  {
    label: "P.G/Hostel",
    links: [
      { label: "PG | Hostel for Boys", href: "/properties?type=PG&gender=BOYS" },
      { label: "PG | Hostel for Girls", href: "/properties?type=PG&gender=GIRLS" },
      { label: "Student Hostels", href: "/properties?type=HOSTEL" }
    ]
  },
  {
    label: "Shops & Offices",
    links: [
      { label: "Shops", href: "/properties?category=Commercial" },
      { label: "Offices", href: "/properties?category=Commercial" },
      { label: "Co-working Spaces", href: "/properties?category=Commercial" }
    ]
  },
  {
    label: "People’s Need",
    links: [
      { label: "Room Seekers", href: "/register" },
      { label: "Room Partners", href: "/register" }
    ]
  }
];

const quickLinks = [
  { label: "For Sale", href: "/properties" },
  { label: "LearnTheta", href: "/properties" }
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 px-3 pt-4 md:px-5">
      <div className="app-frame nav-frame">
        <div className="border-b border-base-300/70">
          <nav className="page-shell flex min-h-[72px] items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#ff385c] text-white shadow-[0_18px_30px_-18px_rgba(255,56,92,0.75)]">
                  <Building2 className="size-5" />
                </div>
                <span className="text-base font-semibold text-neutral md:text-lg">RoomRent Maharashtra</span>
              </Link>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-base-content/72 transition hover:bg-base-200 hover:text-neutral">
                Login
              </Link>
              <Link href="/register" className="rounded-lg px-3 py-2 text-sm font-medium text-base-content/72 transition hover:bg-base-200 hover:text-neutral">
                Register
              </Link>
              <Link href="/properties" className="btn pink-button h-11 rounded-xl px-5 text-sm font-semibold">
                Explore
              </Link>
            </div>

            <div className="dropdown md:hidden">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                <Menu className="size-5" />
              </div>
              <ul tabIndex={0} className="menu dropdown-content right-0 z-50 mt-3 w-64 rounded-2xl bg-base-100 p-2 shadow-card">
                {navGroups.map((group) => (
                  <li key={group.label}>
                    <details>
                      <summary>{group.label}</summary>
                      <ul>
                        {group.links.map((link) => (
                          <li key={link.label}><Link href={link.href}>{link.label}</Link></li>
                        ))}
                      </ul>
                    </details>
                  </li>
                ))}
                {quickLinks.map((link) => (
                  <li key={link.label}><Link href={link.href}>{link.label}</Link></li>
                ))}
                <li><Link href="/login">Login</Link></li>
                <li><Link href="/register">Register</Link></li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="hidden md:block">
          <div className="page-shell flex min-h-[56px] flex-wrap items-center gap-3 overflow-visible">
            {navGroups.map((group) => (
              <div key={group.label} className="dropdown dropdown-hover relative">
                <div tabIndex={0} role="button" className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-base-content/72 transition hover:bg-base-200 hover:text-neutral">
                  {group.label}
                  <ChevronDown className="size-4" />
                </div>
                <ul tabIndex={0} className="dropdown-content z-50 mt-3 w-60 rounded-2xl border border-base-300/70 bg-base-100 p-2 shadow-card">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="rounded-xl px-3 py-2 text-sm text-base-content/75 hover:bg-base-200 hover:text-neutral">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-base-content/72 transition hover:bg-base-200 hover:text-neutral"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
