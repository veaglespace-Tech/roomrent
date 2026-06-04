"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, ChevronDown, Facebook, Instagram, Linkedin, Menu, Twitter } from "lucide-react";

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
  { label: "Compare", href: "/compare" },
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
      <button type="button" className="nav-link nav-link-featured">
        Explore
        <ChevronDown className="size-4 transition duration-300" />
      </button>
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const closeMenu = () => {
    setMenuOpen(false);
    setOpenGroup(null);
  };

  return (
    <div className="relative xl:hidden">
      <button type="button" aria-expanded={menuOpen} className="mobile-menu-button" onClick={() => setMenuOpen((value) => !value)}>
        <Menu className="size-5" />
      </button>
      {menuOpen ? (
        <div className="mobile-nav-menu">
          {navGroups.map((group) => {
            const isOpen = openGroup === group.label;
            return (
              <div key={group.label} className="mobile-nav-group">
                <button type="button" className="mobile-nav-trigger" onClick={() => setOpenGroup(isOpen ? null : group.label)}>
                  {group.label}
                  <ChevronDown className={`size-4 transition ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen ? (
                  <div className="mobile-nav-panel">
                    {group.links.map((link) => (
                      <Link key={link.label} href={link.href} onClick={closeMenu}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
          <div className="mobile-nav-divider" />
          {navLinks.filter((link) => !link.featured).map((link) => (
            <Link key={link.label} href={link.href} className="mobile-nav-direct" onClick={closeMenu}>
              {link.label}
            </Link>
          ))}
          <div className="mobile-nav-group">
            <button type="button" className="mobile-nav-trigger mobile-nav-trigger-featured" onClick={() => setOpenGroup(openGroup === "Explore" ? null : "Explore")}>
              Explore
              <ChevronDown className={`size-4 transition ${openGroup === "Explore" ? "rotate-180" : ""}`} />
            </button>
            {openGroup === "Explore" ? (
              <div className="mobile-nav-panel">
                {exploreLinks.map((link) => (
                  <Link key={link.label} href={link.href} onClick={closeMenu}>
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 px-3 pt-2 md:px-5">
      <div className="social-dock flex">
        <SocialIcons />
      </div>
      <div className="header-shell">
        <div className="page-shell flex min-h-[64px] items-center justify-between gap-4">
          <div className="-ml-3 sm:-ml-4">
            <Logo />
          </div>
          <DesktopNav />
          <div className="flex items-center gap-3">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
