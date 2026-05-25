import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-base-300 bg-base-100">
      <div className="page-shell grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <h3 className="text-lg font-semibold">RoomRent Maharashtra</h3>
          <p className="mt-3 max-w-md text-sm text-base-content/70">
            Maharashtra-wide rental marketplace for hostels, PGs, rooms, flats, apartments, shops, offices, and co-working spaces.
          </p>
          <p className="mt-5 text-sm text-base-content/70">Email: hello@roomrentmaharashtra.com</p>
          <p className="mt-2 text-sm text-base-content/70">Serving Mumbai, Pune, Nagpur, Nashik, Thane, Navi Mumbai and every district across Maharashtra.</p>
        </div>
        <div>
          <h4 className="font-semibold">Helpful Links</h4>
          <ul className="mt-4 space-y-3 text-sm text-base-content/70">
            <li><Link href="/properties">Browse Properties</Link></li>
            <li><Link href="/dashboard/profile">My Account</Link></li>
            <li><Link href="/register">Post Your Property</Link></li>
            <li><Link href="/dashboard/saved-properties">Saved Properties</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Marketplace</h4>
          <ul className="mt-4 space-y-3 text-sm text-base-content/70">
            <li>Room Partners</li>
            <li>Room Seekers</li>
            <li>Search by location and budget</li>
            <li>Connect directly with owners</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-base-300">
        <div className="page-shell py-4 text-sm text-base-content/60">
          Copyright (c) 2026 RoomRent Maharashtra. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
