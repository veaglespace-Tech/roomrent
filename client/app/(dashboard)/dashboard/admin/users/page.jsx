"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { getAdminUsers } from "@/services/user-service";
export default function ManageUsersPage() {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        getAdminUsers().then(setUsers).catch(() => setUsers([]));
    }, []);
    return (_jsxs("div", { className: "panel overflow-x-auto p-8", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Manage Users" }), _jsxs("table", { className: "table mt-6", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Name" }), _jsx("th", { children: "Email" }), _jsx("th", { children: "Role" })] }) }), _jsx("tbody", { children: users.map((user) => (_jsxs("tr", { children: [_jsx("td", { children: user.name }), _jsx("td", { children: user.email }), _jsx("td", { children: user.role })] }, user.id))) })] })] }));
}
