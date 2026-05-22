"use client";

import Link from "next/link";
import { Building2, ChevronDown, Heart, LayoutDashboard, LogOut, Menu, Search, UserCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/auth-slice";

const categoryGroups = [
  {
    label: "Houses",
    links: [
      { href: "/properties?type=ROOM", label: "One Room Set" },
      { href: "/properties?type=ROOM", label: "Two Rooms Set" },
      { href: "/properties?type=ROOM", label: "Three Rooms Set" },
      { href: "/properties?type=ROOM", label: "Four Rooms Set" }
    ]
  },
  {
    label: "Flats",
    links: [
      { href: "/properties?type=FLAT", label: "1 BHK Flats" },
      { href: "/properties?type=FLAT", label: "2 BHK Flats" },
      { href: "/properties?type=FLAT", label: "3 BHK Flats" },
      { href: "/properties?type=FLAT", label: "4 BHK Flats" }
    ]
  },
  {
    label: "PG / Hostel",
    links: [
      { href: "/properties?type=PG&gender=BOYS", label: "PG | Hostel for Boys" },
      { href: "/properties?type=PG&gender=GIRLS", label: "PG | Hostel for Girls" },
      { href: "/properties?type=HOSTEL", label: "Student Hostels" }
    ]
  }
];

export function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    localStorage.removeItem("roomrent_token");
    localStorage.removeItem("roomrent_user");
    dispatch(logout());
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-base-100/95 backdrop-blur">
      <div className="border-b border-base-300 bg-neutral text-neutral-content">
        <div className="page-shell flex min-h-10 items-center justify-between text-xs">
          <p>roomrentjaipur@gmail.com</p>
          <div className="flex items-center gap-4">
            <Link href="/properties" className="hover:text-white">Post Requirement</Link>
            {user ? (
              <button onClick={handleLogout} className="hover:text-white">Logout</button>
            ) : (
              <Link href="/login" className="hover:text-white">Login / Register</Link>
            )}
          </div>
        </div>
      </div>

      <div className="border-b border-base-300">
        <div className="navbar page-shell min-h-[84px]">
          <div className="navbar-start gap-3">
            <div className="dropdown lg:hidden">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                <Menu className="size-5" />
              </div>
              <ul tabIndex={0} className="menu dropdown-content z-[1] mt-3 w-64 rounded-box bg-base-100 p-2 shadow">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/properties">Browse Listings</Link></li>
                <li><Link href="/dashboard/profile">Dashboard</Link></li>
              </ul>
            </div>
            <Link href="/" className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-content">
                <Building2 className="size-5" />
              </div>
              <div>
                <p className="text-lg font-semibold leading-none">Room Rent Jaipur</p>
                <p className="text-xs text-base-content/60">Rooms, PGs, flats and rental marketplace</p>
              </div>
            </Link>
          </div>

          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal items-center gap-1 px-2">
              {categoryGroups.map((group) => (
                <li key={group.label}>
                  <details>
                    <summary className="rounded-full">{group.label} <ChevronDown className="size-4" /></summary>
                    <ul className="w-52 rounded-2xl bg-base-100 p-2 shadow-card">
                      {group.links.map((item) => (
                        <li key={item.label}><Link href={item.href}>{item.label}</Link></li>
                      ))}
                    </ul>
                  </details>
                </li>
              ))}
              <li><Link href="/properties" className="rounded-full">All Listings</Link></li>
              <li><Link href="/dashboard/profile" className="rounded-full">My Account</Link></li>
            </ul>
          </div>

          <div className="navbar-end gap-2">
            <Link href="/properties" className="btn btn-ghost hidden rounded-full md:inline-flex">
              <Search className="size-4" />
              Explore
            </Link>
            {user ? (
              <>
                <Link href="/dashboard/saved-properties" className="btn btn-ghost btn-circle">
                  <Heart className="size-5" />
                </Link>
                <Link href="/dashboard/profile" className="btn btn-ghost hidden rounded-full md:inline-flex">
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </Link>
                <button className="btn btn-primary rounded-full" onClick={handleLogout}>
                  <LogOut className="size-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost rounded-full">
                  <UserCircle2 className="size-4" />
                  Login
                </Link>
                <Link href="/register" className="btn btn-primary rounded-full">
                  Post Free Ad
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
