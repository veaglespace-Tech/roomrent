"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Building2,
  ChevronDown,
  HelpCircle,
  LogIn,
  LogOut,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout as logoutAction } from "@/store/slices/auth-slice";
import { clearAuthSession, getStoredAuthRole } from "@/lib/auth-session";
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
      { label: "Office & Shops", href: "/properties?type=HOSTEL" },
    ],
  },
  {
    label: "Services",
    href: "/#services",
    children: [
      { label: "Post requirement", href: "/contact" },
      { label: "Compare listings", href: "/compare" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-glow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-glow">
        <Building2 className="size-5" />
      </span>
      <span className="text-xl font-extrabold tracking-tight text-slate-900 font-heading">
        Room<span className="gradient-text">Rent</span>
        <span className="text-indigo-400">.</span>
      </span>
    </Link>
  );
}

/** Dropdown item with GSAP-controlled visibility */
function DropdownMenu({ items, dropdownRef }) {
  return (
    <div
      ref={dropdownRef}
      className="nav-dropdown nav-dropdown-center w-60"
      style={{ opacity: 0, pointerEvents: "none" }}
    >
      <div className="grid gap-1 p-2">
        {items.map((child) => (
          <Link
            key={child.label}
            href={child.href}
            className="dropdown-link"
          >
            <span className="text-sm font-semibold text-slate-800">
              {child.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function NavDropdownItem({ item, activeMenu, setActiveMenu }) {
  const dropdownRef = useRef(null);
  const isOpen = activeMenu === item.label;
  const wasOpenRef = useRef(false);

  useEffect(() => {
    const el = dropdownRef.current;
    if (!el) return;

    if (isOpen && !wasOpenRef.current) {
      wasOpenRef.current = true;
      import("@/lib/animations").then(({ animateDropdownOpen }) =>
        animateDropdownOpen(el)
      );
    } else if (!isOpen && wasOpenRef.current) {
      wasOpenRef.current = false;
      import("@/lib/animations").then(({ animateDropdownClose }) =>
        animateDropdownClose(el)
      );
    }
  }, [isOpen]);

  return (
    <div className="nav-dropdown-parent relative">
      <button
        type="button"
        className={`nav-link ${isOpen ? "text-indigo-600 border-indigo-200 bg-indigo-50" : ""}`}
        aria-expanded={isOpen}
        onClick={() =>
          setActiveMenu((current) =>
            current === item.label ? null : item.label
          )
        }
      >
        {item.label}
        <ChevronDown
          className="size-4 transition-transform duration-200"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      <DropdownMenu
        items={item.children}
        dropdownRef={dropdownRef}
      />
    </div>
  );
}

function DesktopTabs({ role, onLogout }) {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState(null);
  const navRef = useRef(null);
  const dashboardHref =
    role === "OWNER"
      ? "/dashboard/owner"
      : role === "ADMIN"
      ? "/dashboard/admin"
      : "/dashboard/user";

  useEffect(() => {
    setActiveMenu(null);
  }, [pathname]);

  // Delegated nav-link hover scale via GSAP
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    let gsapInstance = null;

    import("gsap").then(({ gsap }) => {
      gsapInstance = gsap;
    });

    function onEnter(e) {
      const link = e.target.closest(".nav-link");
      if (!link || !gsapInstance) return;
      gsapInstance.to(link, { scale: 1.04, duration: 0.16, ease: "power1.out", overwrite: true });
    }
    function onLeave(e) {
      const link = e.target.closest(".nav-link");
      if (!link || !gsapInstance) return;
      gsapInstance.to(link, { scale: 1, duration: 0.14, ease: "power1.inOut", overwrite: true });
    }

    nav.addEventListener("mouseenter", onEnter, true);
    nav.addEventListener("mouseleave", onLeave, true);
    return () => {
      nav.removeEventListener("mouseenter", onEnter, true);
      nav.removeEventListener("mouseleave", onLeave, true);
    };
  }, []);

  return (
    <div className="hidden flex-1 items-center justify-between lg:flex pl-8">
      {/* Nav tabs */}
      <nav
        ref={navRef}
        className="flex flex-wrap items-center gap-1"
      >
        {navTabs.map((item) =>
          "children" in item ? (
            <NavDropdownItem
              key={item.label}
              item={item}
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
            />
          ) : (
            <Link
              key={item.label}
              href={item.href}
              className={`nav-link ${pathname === item.href ? "text-indigo-600 bg-indigo-50 border-indigo-200" : ""}`}
            >
              {item.label}
            </Link>
          )
        )}
      </nav>

      {/* Utilities / CTAs */}
      <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
        {!role && (
          <>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-indigo-600 px-3"
            >
              <HelpCircle className="size-3.5 shrink-0" />
              Help
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-indigo-600 px-3"
            >
              <LogIn className="size-3.5 shrink-0" />
              Log in
            </Link>
            <Link
              href="/register"
              className="landing-primary-button min-h-9 px-5 text-xs"
            >
              <Sparkles className="size-3.5 shrink-0 text-indigo-200" />
              Get Started
            </Link>
          </>
        )}
        {role && (
          <>
            <Link
              href={dashboardHref}
              className="inline-flex items-center gap-1.5 rounded-[10px] bg-slate-50 border border-slate-200 px-3 py-2 transition-colors hover:border-indigo-300 hover:text-indigo-600"
            >
              <Building2 className="size-3.5 shrink-0" />
              Dashboard
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-indigo-600 px-3"
              onClick={onLogout}
            >
              <LogOut className="size-3.5 shrink-0" />
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function MobileNav({ role, onLogout }) {
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const pathname = usePathname();
  const drawerRef = useRef(null);
  const overlayRef = useRef(null);
  const dashboardHref =
    role === "OWNER"
      ? "/dashboard/owner"
      : role === "ADMIN"
      ? "/dashboard/admin"
      : "/dashboard/user";

  useEffect(() => {
    setOpen(false);
    setActiveMenu(null);
  }, [pathname]);

  // Animate drawer in/out
  useEffect(() => {
    if (open) {
      import("@/lib/animations").then(({ animateDrawerIn, animateOverlayIn }) => {
        if (drawerRef.current) animateDrawerIn(drawerRef.current);
        if (overlayRef.current) animateOverlayIn(overlayRef.current);
      });
    }
  }, [open]);

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function handleClose() {
    import("@/lib/animations").then(({ animateDrawerOut }) => {
      if (drawerRef.current) {
        animateDrawerOut(drawerRef.current, () => setOpen(false));
      } else {
        setOpen(false);
      }
    });
  }

  return (
    <div className="relative lg:hidden">
      <button
        type="button"
        className="mobile-menu-button"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        {open ? <X className="size-5 shrink-0" /> : <Menu className="size-5 shrink-0" />}
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            ref={overlayRef}
            type="button"
            aria-label="Close menu"
            className="drawer-overlay"
            onClick={handleClose}
            style={{ opacity: 0 }}
          />
          <div
            ref={drawerRef}
            className="drawer-panel w-[min(88vw,360px)]"
            style={{ transform: "translateX(-100%)", opacity: 0 }}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-indigo-100 px-4 py-4">
              <Logo />
              <button
                type="button"
                className="mobile-menu-button"
                onClick={handleClose}
              >
                <X className="size-5 shrink-0" />
              </button>
            </div>

            {/* Drawer content */}
            <div className="grid gap-4 p-4">
              <div className="grid gap-2">
                {role ? (
                  <>
                    <Link
                      href={dashboardHref}
                      className="mobile-nav-direct"
                      onClick={handleClose}
                    >
                      <span className="inline-flex items-center gap-2">
                        <Building2 className="size-4 shrink-0" />
                        Dashboard
                      </span>
                    </Link>
                    <button
                      type="button"
                      className="mobile-nav-direct"
                      onClick={onLogout}
                    >
                      <span className="inline-flex items-center gap-2">
                        <LogOut className="size-4 shrink-0" />
                        Logout
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/contact"
                      className="mobile-nav-direct"
                      onClick={handleClose}
                    >
                      <span className="inline-flex items-center gap-2">
                        <HelpCircle className="size-4 shrink-0" />
                        Help
                      </span>
                    </Link>
                    <Link
                      href="/login"
                      className="mobile-nav-direct"
                      onClick={handleClose}
                    >
                      <span className="inline-flex items-center gap-2">
                        <LogIn className="size-4 shrink-0" />
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
                        onClick={() =>
                          setActiveMenu((c) =>
                            c === item.label ? null : item.label
                          )
                        }
                      >
                        {item.label}
                        <ChevronDown
                          className="size-4 shrink-0 transition-transform duration-200"
                          style={{
                            transform:
                              activeMenu === item.label
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                          }}
                        />
                      </button>
                      {activeMenu === item.label && (
                        <div className="mobile-nav-panel">
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className="mobile-nav-link"
                              onClick={handleClose}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="mobile-nav-direct"
                      onClick={handleClose}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>

              {role ? (
                <button
                  type="button"
                  className="mobile-nav-direct mobile-nav-trigger-featured"
                  onClick={onLogout}
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/register"
                  className="mobile-nav-direct mobile-nav-trigger-featured"
                  onClick={handleClose}
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const role = user?.role || getStoredAuthRole();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <header className={`sticky top-0 z-50 px-3 pt-2 pb-2 md:px-5 transition-all duration-300 ${scrolled ? "header-scrolled" : ""}`}>
      <div className="header-shell">
        <div className="page-shell flex min-h-[64px] items-center justify-between py-2">
          <Logo />
          <DesktopTabs role={role} onLogout={handleLogout} />
          <MobileNav role={role} onLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
}
