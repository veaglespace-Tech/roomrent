import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-base-300 bg-base-100">
      <div className="page-shell grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <h3 className="text-lg font-semibold">Room Rent Jaipur</h3>
          <p className="mt-3 max-w-md text-sm text-base-content/70">
            Jaipur-focused rental marketplace with direct owner-tenant enquiry flow, dynamic listings, and dashboard-based property management.
          </p>
          <p className="mt-5 text-sm text-base-content/70">Email: roomrentjaipur@gmail.com</p>
          <p className="mt-2 text-sm text-base-content/70">Plot no. 40, Katewa Nagar, Gujar ki Thadi, New Sanganer Road, Jaipur - 302020</p>
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
          Copyright (c) 2026 Room Rent Jaipur. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
