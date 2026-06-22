import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { AUTH_TOKEN_COOKIE } from "@/lib/auth-session";
export default async function DashboardLayout({ children }) {
    const token = (await cookies()).get(AUTH_TOKEN_COOKIE)?.value;
    if (!token) {
        redirect("/login");
    }
    return (_jsx("section", { className: "page-shell py-8 md:py-10", children: _jsxs("div", { className: "grid items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]", children: [_jsx(DashboardSidebar, {}), _jsx("div", { className: "dashboard-content-shell", children: children })] }) }));
}
