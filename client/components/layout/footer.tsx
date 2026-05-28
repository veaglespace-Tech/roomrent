import Link from "next/link";

export function Footer() {
  return (
    <footer className="px-3 pb-8 pt-16 md:px-5">
      <div className="footer-shell">
        <div className="page-shell grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <h3 className="bg-[linear-gradient(135deg,#00a99a,#ff385c,#ff7a2f)] bg-clip-text text-2xl font-extrabold text-transparent">RoomRent Maharashtra</h3>
            <p className="mt-3 max-w-md text-sm font-medium leading-7 text-[#64748b]">
              Discover rooms, PG accommodation, hostels, flats and rental workspaces across Maharashtra with a clean search experience and city-first navigation.
            </p>
            <p className="mt-5 text-sm font-semibold text-[#475569]">Email: roomrentmaharashtra@gmail.com</p>
            <p className="mt-2 text-sm font-medium text-[#64748b]">Office: Maharashtra rental support desk, Mumbai - Pune growth corridor.</p>
            <p className="mt-2 text-sm font-medium text-[#64748b]">Serving Mumbai, Pune, Nagpur, Nashik, Thane, Navi Mumbai and statewide growth markets.</p>
          </div>

          <div>
            <h4 className="font-extrabold text-[#111827]">Explore</h4>
            <ul className="mt-4 space-y-2 text-sm font-semibold text-[#64748b]">
              <li><Link className="footer-link" href="/properties">Browse Properties</Link></li>
              <li><Link className="footer-link" href="/cities/mumbai">City Pages</Link></li>
              <li><Link className="footer-link" href="/districts/pune">District Pages</Link></li>
              <li><Link className="footer-link" href="/register">Post Your Property</Link></li>
              <li><Link className="footer-link" href="/register">Room Partners</Link></li>
              <li><Link className="footer-link" href="/register">Room Seekers</Link></li>
              <li><Link className="footer-link" href="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-[#111827]">Account</h4>
            <ul className="mt-4 space-y-2 text-sm font-semibold text-[#64748b]">
              <li><Link className="footer-link" href="/properties">Browse Properties</Link></li>
              <li><Link className="footer-link" href="/dashboard/profile">My Account</Link></li>
              <li><Link className="footer-link" href="/dashboard/saved-properties">Saved Properties</Link></li>
              <li><Link className="footer-link" href="/login">Login</Link></li>
              <li><Link className="footer-link" href="/contact">Support</Link></li>
              <li><Link className="footer-link" href="/contact">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#e2e8f0]/80">
          <div className="page-shell flex flex-col gap-2 py-4 text-sm font-medium text-[#64748b] md:flex-row md:items-center md:justify-between">
            <p>Copyright (c) 2026 RoomRent Maharashtra. All rights reserved.</p>
            <p>Search rentals by city, district, locality and budget.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
