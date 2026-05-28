"use client";

import Link from "next/link";
import { Building2, ChevronDown, Facebook, Instagram, Linkedin, Mail, Menu, Twitter } from "lucide-react";

const navGroups = [
  {
    label: "Houses",
    href: "/properties?type=ROOM",
    links: [
      { label: "One Room Set", href: "/properties?type=ROOM&sharingType=Single Room", description: "Private single room homes" },
      { label: "Two Rooms Set", href: "/properties?type=ROOM&sharingType=2 Sharing", description: "Compact 2 room options" },
      { label: "Three Rooms Set", href: "/properties?type=ROOM&sharingType=3 Sharing", description: "Family-ready houses" },
      { label: "Four Rooms Set", href: "/properties?type=ROOM&sharingType=4 Sharing", description: "Large home rentals" }
    ]
  },
  {
    label: "Flats",
    href: "/properties?type=FLAT",
    links: [
      { label: "1 BHK Flats", href: "/properties?type=FLAT&bhk=1", description: "Starter apartments" },
      { label: "2 BHK Flats", href: "/properties?type=FLAT&bhk=2", description: "Popular city flats" },
      { label: "3 BHK Flats", href: "/properties?type=FLAT&bhk=3", description: "Family apartments" },
      { label: "4 BHK Flats", href: "/properties?type=FLAT&bhk=4", description: "Premium large flats" }
    ]
  },
  {
    label: "P.G/Hostel",
    href: "/properties?type=PG",
    links: [
      { label: "PG | Hostel for Boys", href: "/properties?type=PG&gender=BOYS", description: "Boys PG and hostel beds" },
      { label: "PG | Hostel for Girls", href: "/properties?type=PG&gender=GIRLS", description: "Girls PG and hostel beds" },
      { label: "Student Hostels", href: "/properties?type=HOSTEL", description: "Student-focused stays" }
    ]
  },
  {
    label: "People's Need",
    href: "/register",
    links: [
      { label: "Room Seekers", href: "/register", description: "Find a room faster" },
      { label: "Room Partners", href: "/register", description: "Find someone to share with" }
    ]
  }
];

const navLinks = [
  { label: "Shops & Offices", href: "/properties?category=Commercial" },
  { label: "For Sale", href: "/properties?listing=SALE" },
  { label: "Explore", href: "/properties", featured: true }
];

const exploreLinks = [
  { label: "All Properties", href: "/properties", description: "Browse every available listing" },
  { label: "Login", href: "/login", description: "Access saved homes and account tools" },
  { label: "Register", href: "/register", description: "Create owner, seeker or partner account" }
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com", icon: Instagram },
  { label: "Facebook", href: "https://facebook.com", icon: Facebook },
  { label: "Twitter", href: "https://twitter.com", icon: Twitter },
  { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin }
];

function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <span className="flex size-9 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#00a99a,#ff385c_58%,#ff7a2f)] text-white shadow-[0_18px_32px_-18px_rgba(255,56,92,0.8)] transition duration-300 group-hover:-translate-y-0.5">
        <Building2 className="size-4" />
      </span>
      <span className="text-sm font-extrabold tracking-[-0.01em] text-[#111827] md:text-base">RoomRent Maharashtra</span>
    </Link>
  );
}

function SocialIcons() {
  return (
    <div className="flex items-center gap-2">
      {socialLinks.map(({ label, href, icon: Icon }) => (
        <Link key={label} href={href} aria-label={label} className="top-social-link" target="_blank" rel="noreferrer">
          <Icon className="size-4" />
        </Link>
      ))}
    </div>
  );
}

function NavDropdown({ group }: { group: (typeof navGroups)[number] }) {
  return (
    <div className="nav-dropdown-parent relative">
      <Link href={group.href} className="nav-link">
        {group.label}
        <ChevronDown className="size-4 transition duration-300" />
      </Link>
      <div className="nav-dropdown">
        <div className="grid gap-2 p-2">
          {group.links.map((link) => (
            <Link key={link.label} href={link.href} className="dropdown-link">
              <span className="text-sm font-bold text-[#111827]">{link.label}</span>
              <span className="mt-1 text-xs font-medium text-[#64748b]">{link.description}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExploreDropdown() {
  return (
    <div className="nav-dropdown-parent relative">
      <Link href="/properties" className="nav-link nav-link-featured">
        Explore
        <ChevronDown className="size-4 transition duration-300" />
      </Link>
      <div className="nav-dropdown">
        <div className="grid gap-2 p-2">
          {exploreLinks.map((link) => (
            <Link key={link.label} href={link.href} className="dropdown-link">
              <span className="text-sm font-bold text-[#111827]">{link.label}</span>
              <span className="mt-1 text-xs font-medium text-[#64748b]">{link.description}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function DesktopNav() {
  return (
    <nav className="hidden items-center gap-1 xl:flex">
      {navGroups.map((group) => (
        <NavDropdown key={group.label} group={group} />
      ))}
      {navLinks.map((link) => (
        link.featured ? (
          <ExploreDropdown key={link.label} />
        ) : (
          <Link key={link.label} href={link.href} className="nav-link">
            {link.label}
          </Link>
        )
      ))}
    </nav>
  );
}

function MobileNav() {
  return (
    <div className="dropdown dropdown-end xl:hidden">
      <div tabIndex={0} role="button" className="mobile-menu-button">
        <Menu className="size-5" />
      </div>
      <ul tabIndex={0} className="mobile-nav-menu">
        {navGroups.map((group) => (
          <li key={group.label}>
            <details>
              <summary>{group.label}</summary>
              <ul>
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        ))}
        {navLinks.map((link) => (
          <li key={link.label}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
        <li className="menu-title mt-2">Explore</li>
        {exploreLinks.map((link) => (
          <li key={link.label}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 px-3 pt-2 md:px-5">
      <div className="header-shell">
        <div className="page-shell flex min-h-11 items-center justify-between gap-4 border-b border-[#e2e8f0]/80">
          <Link href="mailto:roomrentmaharashtra@gmail.com" className="inline-flex min-w-0 items-center gap-2 text-xs font-bold text-[#64748b] transition hover:text-[#ff385c]">
            <Mail className="size-4" />
            <span className="truncate">roomrentmaharashtra@gmail.com</span>
          </Link>
          <SocialIcons />
        </div>
        <div className="page-shell flex min-h-[50px] items-center justify-between gap-4">
          <div className="-ml-3 sm:-ml-4">
            <Logo />
          </div>
          <DesktopNav />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
