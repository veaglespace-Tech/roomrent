"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { getProfile } from "@/services/user-service";
import { Calendar, CheckCircle2, Mail, Phone, Shield, UserRound } from "lucide-react";
export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    useEffect(() => {
        getProfile().then(setProfile).catch(() => setProfile(null));
    }, []);
    const initials = useMemo(() => {
        if (!profile?.name)
            return "?";
        return profile.name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join("");
    }, [profile?.name]);
    if (!profile) {
        return (_jsxs("div", { className: "dashboard-empty-state", children: [_jsx(UserRound, { className: "size-8" }), _jsx("h1", { children: "Profile unavailable" }), _jsx("p", { children: "Login is required to view dashboard details." })] }));
    }
    const memberSince = new Date(profile.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
    const detailCards = [
        { label: "Full name", value: profile.name, icon: UserRound, tone: "cyan" },
        { label: "Email address", value: profile.email, icon: Mail, tone: "pink" },
        { label: "Mobile number", value: profile.phone || "Not added", icon: Phone, tone: "gold" },
        { label: "Member since", value: memberSince, icon: Calendar, tone: "violet" }
    ];
    return (_jsxs("div", { className: "profile-workspace", children: [_jsxs("section", { className: "profile-hero", children: [_jsx("div", { className: "profile-avatar", children: initials }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [_jsx("h1", { children: profile.name }), _jsxs("span", { className: "profile-role-chip", children: [_jsx(Shield, { className: "size-3.5" }), profile.role] })] }), _jsx("p", { children: "Account overview, contact identity and dashboard access status." })] }), _jsxs("div", { className: "profile-status", children: [_jsx(CheckCircle2, { className: "size-4" }), "Active"] })] }), _jsx("section", { className: "profile-grid", children: detailCards.map(({ label, value, icon: Icon, tone }) => (_jsxs("article", { className: `profile-info-card profile-info-card-${tone}`, children: [_jsx("div", { className: "profile-info-icon", children: _jsx(Icon, { className: "size-5" }) }), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { children: label }), _jsx("h2", { children: value })] })] }, label))) })] }));
}
