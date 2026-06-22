"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, ChevronDown, HelpCircle, LogIn, LogOut, Menu, Sparkles, X } from "lucide-react";
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
];
function Logo() {
    return (_jsxs(Link, { href: "/", className: "flex items-center gap-3", children: [_jsx("span", { className: "flex size-10 items-center justify-center border border-[var(--rf-line)] bg-[var(--rf-panel)] text-[var(--rf-cyan)]", children: _jsx(Building2, { className: "size-4" }) }), _jsx("span", { className: "text-sm font-bold tracking-wide text-[var(--rf-ink)]", children: "RentFlow" })] }));
}
function DesktopTabs({ role, onLogout }) {
    const pathname = usePathname();
    const [activeMenu, setActiveMenu] = useState(null);
    const dashboardHref = role === "OWNER" ? "/dashboard/owner" : role === "ADMIN" ? "/dashboard/admin" : "/dashboard/user";
    useEffect(() => {
        setActiveMenu(null);
    }, [pathname]);
    return (_jsxs("div", { className: "hidden w-full flex-col gap-2 lg:flex", children: [_jsxs("div", { className: "flex items-center justify-between gap-4 border-b border-[var(--rf-line)] pb-3", children: [_jsx("span", { className: "text-xs uppercase tracking-[0.22em] text-[var(--rf-cyan)]", children: "Property Technology" }), _jsxs("div", { className: "flex flex-wrap items-center justify-end gap-3 text-xs text-[var(--rf-muted)]", children: [role ? null : (_jsxs(_Fragment, { children: [_jsxs(Link, { href: "/contact", className: "inline-flex items-center gap-1.5 transition hover:text-[var(--rf-cyan)]", children: [_jsx(HelpCircle, { className: "size-3.5" }), "Help"] }), _jsxs(Link, { href: "/register", className: "landing-primary-button min-h-9 px-4 text-xs", children: [_jsx(Sparkles, { className: "size-4" }), "Get Started"] })] })), role ? (_jsxs(_Fragment, { children: [_jsxs(Link, { href: dashboardHref, className: "inline-flex items-center gap-1.5 transition hover:text-[var(--rf-cyan)]", children: [_jsx(Building2, { className: "size-3.5" }), "Dashboard"] }), _jsxs("button", { type: "button", className: "inline-flex items-center gap-1.5 transition hover:text-[var(--rf-cyan)]", onClick: onLogout, children: [_jsx(LogOut, { className: "size-3.5" }), "Logout"] })] })) : null] })] }), _jsx("nav", { className: "flex flex-wrap items-center justify-center gap-0.5 pt-0.5", children: navTabs.map((item) => "children" in item ? (_jsxs("div", { className: "nav-dropdown-parent relative", children: [_jsxs("button", { type: "button", className: `nav-link ${activeMenu === item.label ? "text-[var(--rf-cyan)]" : ""}`, "aria-expanded": activeMenu === item.label, onClick: () => setActiveMenu((current) => (current === item.label ? null : item.label)), children: [item.label, _jsx(ChevronDown, { className: "size-4 transition" })] }), _jsx("div", { className: `nav-dropdown nav-dropdown-center w-64 ${activeMenu === item.label ? "nav-dropdown-open" : ""}`, children: _jsx("div", { className: "grid gap-1 p-2", children: item.children.map((child) => (_jsx(Link, { href: child.href, className: "dropdown-link", onClick: () => setActiveMenu(null), children: _jsx("span", { className: "text-sm font-semibold text-[var(--rf-ink)]", children: child.label }) }, child.label))) }) })] }, item.label)) : (_jsx(Link, { href: item.href, className: `nav-link ${pathname === item.href ? "text-[var(--rf-cyan)]" : ""}`, children: item.label }, item.label))) })] }));
}
function MobileNav({ role, onLogout }) {
    const [open, setOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
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
    return (_jsxs("div", { className: "relative lg:hidden", children: [_jsx("button", { type: "button", className: "mobile-menu-button", "aria-expanded": open, onClick: () => setOpen((value) => !value), children: open ? _jsx(X, { className: "size-5" }) : _jsx(Menu, { className: "size-5" }) }), open ? (_jsxs("div", { className: "fixed inset-0 z-50", children: [_jsx("button", { type: "button", "aria-label": "Close menu", className: "drawer-overlay", onClick: () => setOpen(false) }), _jsxs("div", { className: "drawer-panel w-[min(88vw,360px)]", children: [_jsxs("div", { className: "flex items-center justify-between border-b border-[var(--rf-line)] px-4 py-4", children: [_jsx(Logo, {}), _jsx("button", { type: "button", className: "mobile-menu-button", onClick: () => setOpen(false), children: _jsx(X, { className: "size-5" }) })] }), _jsxs("div", { className: "grid gap-4 p-4", children: [_jsx("div", { className: "grid gap-2", children: role ? (_jsxs(_Fragment, { children: [_jsx(Link, { href: dashboardHref, className: "mobile-nav-direct", onClick: () => setOpen(false), children: _jsxs("span", { className: "inline-flex items-center gap-2", children: [_jsx(Building2, { className: "size-4" }), "Dashboard"] }) }), _jsx("button", { type: "button", className: "mobile-nav-direct", onClick: onLogout, children: _jsxs("span", { className: "inline-flex items-center gap-2", children: [_jsx(LogOut, { className: "size-4" }), "Logout"] }) })] })) : (_jsxs(_Fragment, { children: [_jsx(Link, { href: "/contact", className: "mobile-nav-direct", onClick: () => setOpen(false), children: _jsxs("span", { className: "inline-flex items-center gap-2", children: [_jsx(HelpCircle, { className: "size-4" }), "Help"] }) }), _jsx(Link, { href: "/login", className: "mobile-nav-direct", onClick: () => setOpen(false), children: _jsxs("span", { className: "inline-flex items-center gap-2", children: [_jsx(LogIn, { className: "size-4" }), "Log in"] }) })] })) }), _jsx("div", { className: "grid gap-2", children: navTabs.map((item) => "children" in item ? (_jsxs("div", { className: "mobile-nav-group", children: [_jsxs("button", { type: "button", className: "mobile-nav-trigger", "aria-expanded": activeMenu === item.label, onClick: () => setActiveMenu((current) => (current === item.label ? null : item.label)), children: [item.label, _jsx(ChevronDown, { className: "size-4" })] }), activeMenu === item.label ? (_jsx("div", { className: "mobile-nav-panel", children: item.children.map((child) => (_jsx(Link, { href: child.href, className: "mobile-nav-link", onClick: () => setOpen(false), children: child.label }, child.label))) })) : null] }, item.label)) : (_jsx(Link, { href: item.href, className: "mobile-nav-direct", onClick: () => setOpen(false), children: item.label }, item.label))) }), role ? (_jsx("button", { type: "button", className: "mobile-nav-direct mobile-nav-trigger-featured", onClick: onLogout, children: "Logout" })) : (_jsx(Link, { href: "/register", className: "mobile-nav-direct mobile-nav-trigger-featured", onClick: () => setOpen(false), children: "Get Started" }))] })] })] })) : null] }));
}
export function Header() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const role = user?.role || getStoredAuthRole();
    const handleLogout = async () => {
        try {
            await logoutUser();
        }
        catch {
            // Fall back to client-side cleanup even if the network call fails.
        }
        finally {
            clearAuthSession();
            dispatch(logoutAction());
            router.push("/login");
        }
    };
    return (_jsx("header", { className: "sticky top-0 z-50 px-3 pt-2 md:px-5", children: _jsx("div", { className: "header-shell", children: _jsxs("div", { className: "page-shell flex min-h-[84px] flex-col gap-2 py-3", children: [_jsxs("div", { className: "flex items-center justify-between gap-4", children: [_jsx(Logo, {}), _jsx(MobileNav, { role: role, onLogout: handleLogout })] }), _jsx(DesktopTabs, { role: role, onLogout: handleLogout })] }) }) }));
}
