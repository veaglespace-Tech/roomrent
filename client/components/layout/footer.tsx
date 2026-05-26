import Link from "next/link";

export function Footer() {
  return (
    <footer className="px-3 pb-8 pt-16 md:px-5">
      <div className="app-frame">
        <div className="page-shell grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <h3 className="text-xl font-semibold">RoomRent Maharashtra</h3>
            <p className="mt-3 max-w-md text-sm leading-7 text-base-content/68">
              Discover rooms, PG accommodation, hostels, flats and rental workspaces across Maharashtra with a clean search experience and city-first navigation.
            </p>
            <p className="mt-5 text-sm text-base-content/70">Email: hello@roomrentmaharashtra.com</p>
            <p className="mt-2 text-sm text-base-content/70">Serving Mumbai, Pune, Nagpur, Nashik, Thane, Navi Mumbai and statewide growth markets.</p>
          </div>

          <div>
            <h4 className="font-semibold">Explore</h4>
            <ul className="mt-4 space-y-3 text-sm text-base-content/70">
              <li><Link href="/properties">Browse Properties</Link></li>
              <li><Link href="/cities/mumbai">City Pages</Link></li>
              <li><Link href="/districts/pune">District Pages</Link></li>
              <li><Link href="/register">Post Your Property</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Account</h4>
            <ul className="mt-4 space-y-3 text-sm text-base-content/70">
              <li><Link href="/properties">Browse Properties</Link></li>
              <li><Link href="/dashboard/profile">My Account</Link></li>
              <li><Link href="/dashboard/saved-properties">Saved Properties</Link></li>
              <li><Link href="/login">Login</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-base-300/60">
          <div className="page-shell flex flex-col gap-2 py-4 text-sm text-base-content/60 md:flex-row md:items-center md:justify-between">
            <p>Copyright (c) 2026 RoomRent Maharashtra. All rights reserved.</p>
            <p>Search rentals by city, district, locality and budget.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
