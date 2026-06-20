"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, ChevronDown, HelpCircle, LogIn, LogOut, Menu, Sparkles, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout as logoutAction } from "@/store/slices/auth-slice";
import { clearAuthSession, getDashboardRoute, getStoredAuthRole } from "@/lib/auth-session";
import { logoutUser } from "@/services/auth-service";

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
      { label: "Compare listings", href: "/compare" }
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

function DesktopTabs({ role, onLogout }: { role: string | null; onLogout: () => void }) {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const dashboardHref = role === "OWNER" ? "/dashboard/owner" : role === "ADMIN" ? "/dashboard/admin" : "/dashboard/user";

  useEffect(() => {
    setActiveMenu(null);
  }, [pathname]);

  return (
    <div className="hidden w-full flex-col gap-2 lg:flex">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--rf-line)] pb-3">
        <span className="text-xs uppercase tracking-[0.22em] text-[var(--rf-cyan)]">Property Technology</span>
        <div className="flex flex-wrap items-center justify-end gap-3 text-xs text-[var(--rf-muted)]">
          {role ? null : (
            <>
              <Link href="/contact" className="inline-flex items-center gap-1.5 transition hover:text-[var(--rf-cyan)]">
                <HelpCircle className="size-3.5" />
                Help
              </Link>
              <Link href="/register" className="landing-primary-button min-h-9 px-4 text-xs">
                <Sparkles className="size-4" />
                Get Started
              </Link>
            </>
          )}
          {role ? (
            <>
              <Link href={dashboardHref} className="inline-flex items-center gap-1.5 transition hover:text-[var(--rf-cyan)]">
                <Building2 className="size-3.5" />
                Dashboard
              </Link>
              <button type="button" className="inline-flex items-center gap-1.5 transition hover:text-[var(--rf-cyan)]" onClick={onLogout}>
                <LogOut className="size-3.5" />
                Logout
              </button>
            </>
          ) : null}
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

function MobileNav({ role, onLogout }: { role: string | null; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const dashboardHref = role === "OWNER" ? "/dashboard/owner" : role === "ADMIN" ? "/dashboard/admin" : "/dashboard/user";

  useEffect(() => {
    setOpen(false);
    setActiveMenu(null);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <div className="relative lg:hidden">
      <button type="button" className="mobile-menu-button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open ? (
        <div className="fixed inset-0 z-50">
          <button type="button" aria-label="Close menu" className="drawer-overlay" onClick={() => setOpen(false)} />
          <div className="drawer-panel w-[min(88vw,360px)]">
            <div className="flex items-center justify-between border-b border-[var(--rf-line)] px-4 py-4">
              <Logo />
              <button type="button" className="mobile-menu-button" onClick={() => setOpen(false)}>
                <X className="size-5" />
              </button>
            </div>
            <div className="grid gap-4 p-4">
              <div className="grid gap-2">
                {role ? (
                  <>
                    <Link href={dashboardHref} className="mobile-nav-direct" onClick={() => setOpen(false)}>
                      <span className="inline-flex items-center gap-2">
                        <Building2 className="size-4" />
                        Dashboard
                      </span>
                    </Link>
                    <button type="button" className="mobile-nav-direct" onClick={onLogout}>
                      <span className="inline-flex items-center gap-2">
                        <LogOut className="size-4" />
                        Logout
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/contact" className="mobile-nav-direct" onClick={() => setOpen(false)}>
                      <span className="inline-flex items-center gap-2">
                        <HelpCircle className="size-4" />
                        Help
                      </span>
                    </Link>
                    <Link href="/login" className="mobile-nav-direct" onClick={() => setOpen(false)}>
                      <span className="inline-flex items-center gap-2">
                        <LogIn className="size-4" />
                        Log in
                      </span>
                    </Link>
                  </>
                )}
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
              {role ? (
                <button type="button" className="mobile-nav-direct mobile-nav-trigger-featured" onClick={onLogout}>
                  Logout
                </button>
              ) : (
                <Link href="/register" className="mobile-nav-direct mobile-nav-trigger-featured" onClick={() => setOpen(false)}>
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const role = user?.role || getStoredAuthRole();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Fall back to client-side cleanup even if the network call fails.
    } finally {
      clearAuthSession();
      dispatch(logoutAction());
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 px-3 pt-2 md:px-5">
      <div className="header-shell">
        <div className="page-shell flex min-h-[84px] flex-col gap-2 py-3">
          <div className="flex items-center justify-between gap-4">
            <Logo />
            <MobileNav role={role} onLogout={handleLogout} />
          </div>
          <DesktopTabs role={role} onLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
}
