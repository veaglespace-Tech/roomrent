"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  Building2,
  CreditCard,
  Gauge,
  Inbox,
  LayoutDashboard,
  ListPlus,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  clearAuthSession,
  getDashboardRoute,
  getStoredAuthRole,
} from "@/lib/auth-session";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout as logoutAction } from "@/store/slices/auth-slice";
import { logoutUser } from "@/services/auth-service";

function SidebarContent({ onNavigate, linksRef }) {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);
  const role = user?.role || getStoredAuthRole();

  const links = useMemo(() => {
    const common = [
      { href: getDashboardRoute(role), label: "Overview", icon: LayoutDashboard },
      { href: "/dashboard/profile", label: "Profile", icon: UserRound },
    ];
    if (role === "ADMIN") {
      return [
        ...common,
        { href: "/dashboard/admin/review-queue", label: "Review Queue", icon: ShieldCheck },
        { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
        { href: "/dashboard/admin/properties", label: "Manage Properties", icon: Building2 },
      ];
    }
    if (role === "OWNER") {
      return [
        ...common,
        { href: "/dashboard/subscription", label: "Subscription", icon: CreditCard },
        { href: "/dashboard/owner/add-property", label: "Add Property", icon: ListPlus },
        { href: "/dashboard/owner/my-listings", label: "My Listings", icon: Building2 },
        { href: "/dashboard/owner/enquiries", label: "Owner Enquiries", icon: Inbox },
        { href: "/dashboard/owner/leads", label: "Leads", icon: Inbox },
      ];
    }
    return [
      ...common,
      { href: "/dashboard/saved-properties", label: "Saved Properties", icon: Bookmark },
      { href: "/dashboard/saved-searches", label: "Saved Searches", icon: Bookmark },
      { href: "/dashboard/my-enquiries", label: "My Enquiries", icon: Inbox },
      { href: "/compare", label: "Compare", icon: Search },
      { href: "/properties", label: "Search Properties", icon: Search },
    ];
  }, [role]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="sidebar-header flex flex-col gap-4">
        {/* User profile mini-card */}
        <div className="flex items-center gap-3 rounded-[16px] border border-indigo-100/60 bg-indigo-50/50 p-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-extrabold text-white shadow-sm">
            {user?.name?.[0] || role?.[0] || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-900">{user?.name || "User"}</p>
            <p className="truncate text-[11px] font-bold uppercase tracking-wider text-indigo-500">{role || "USER"}</p>
          </div>
        </div>
      </div>
      <div className="sidebar-body overflow-y-auto">
        <ul className="menu gap-1 pr-1" ref={linksRef}>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "sidebar-link",
                    isActive ? "sidebar-link-active" : ""
                  )}
                  onClick={onNavigate}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-md bg-indigo-600" />
                  )}
                  <span className="sidebar-icon">
                    <Icon className="size-4" />
                  </span>
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function DashboardSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Refs for GSAP targets
  const drawerRef = useRef(null);
  const overlayRef = useRef(null);
  const desktopLinksRef = useRef(null);

  // Close mobile drawer on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Stagger desktop sidebar links on mount (once)
  useEffect(() => {
    const ul = desktopLinksRef.current;
    if (!ul) return;
    const items = ul.querySelectorAll(".sidebar-link");
    if (!items.length) return;

    let cancelled = false;
    (async () => {
      const { animateSidebarLinks } = await import("@/lib/animations");
      if (!cancelled) animateSidebarLinks(items);
    })();
    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animate mobile drawer in when opened
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      const { animateDrawerIn, animateOverlayIn } = await import("@/lib/animations");
      if (cancelled) return;
      if (overlayRef.current) animateOverlayIn(overlayRef.current);
      if (drawerRef.current) animateDrawerIn(drawerRef.current);
    })();
    return () => {
      cancelled = true;
    };
  }, [open]);

  // Lock body scroll when mobile drawer is open
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

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Continue with client cleanup if the server logout request fails.
    } finally {
      clearAuthSession();
      dispatch(logoutAction());
      router.push("/login");
    }
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
        <button
          type="button"
          className="mobile-menu-button"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu className="size-5" />
        </button>
        <button
          type="button"
          className="flex h-11 items-center justify-center gap-2 rounded-[12px] border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 hover:bg-slate-50"
          onClick={handleLogout}
        >
          <LogOut className="size-4 shrink-0" />
          Logout
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            ref={overlayRef}
            type="button"
            aria-label="Close dashboard sidebar"
            className="drawer-overlay"
            onClick={handleClose}
            style={{ opacity: 0 }}
          />
          <aside
            ref={drawerRef}
            className="drawer-panel w-[min(88vw,360px)] overflow-hidden"
            style={{ transform: "translateX(-100%)", opacity: 0 }}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-4">
              <span className="inline-flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
                  <Building2 className="size-4 shrink-0" />
                </span>
                <span className="text-lg font-extrabold tracking-tight text-slate-900 font-heading">
                  Room<span className="gradient-text">Rent</span>
                </span>
              </span>
              <button
                type="button"
                className="mobile-menu-button"
                onClick={handleClose}
              >
                <X className="size-5" />
              </button>
            </div>
            {/* Drawer content */}
            <div className="h-[calc(100%-73px)] overflow-y-auto">
              <SidebarContent onNavigate={handleClose} />
              <div className="border-t border-slate-100 p-4 bg-slate-50">
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-[12px] border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 hover:bg-slate-50"
                  onClick={handleLogout}
                >
                  <LogOut className="size-4 shrink-0" />
                  Logout
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop persistent sidebar */}
      <aside className="sidebar-shell hidden w-full min-w-0 lg:sticky lg:top-24 lg:block lg:h-[calc(100vh-7rem)] lg:overflow-y-auto">
        <SidebarContent linksRef={desktopLinksRef} />
        <div className="sidebar-footer">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-[12px] border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 hover:bg-slate-50"
            onClick={handleLogout}
          >
            <LogOut className="size-4 shrink-0" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
