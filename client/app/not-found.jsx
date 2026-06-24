"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
import { AlertCircle, Home } from "lucide-react";
export default function NotFound() {
    return (_jsxs("div", { className: "flex min-h-[60vh] flex-col items-center justify-center px-4 text-center reveal-up", children: [_jsx("div", { className: "border border-[var(--rf-cyan)] bg-indigo-500/5 p-4 text-[var(--rf-cyan)]", children: _jsx(AlertCircle, { className: "size-10" }) }), _jsx("h1", { className: "mt-6 text-4xl font-bold md:text-5xl", children: "404 - Page Not Found" }), _jsx("p", { className: "mx-auto mt-4 max-w-md text-base leading-7 text-[var(--rf-muted)]", children: "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable." }), _jsx("div", { className: "mt-8", children: _jsxs(Link, { href: "/", className: "landing-primary-button", children: [_jsx(Home, { className: "size-4" }), "Go back home"] }) })] }));
}
