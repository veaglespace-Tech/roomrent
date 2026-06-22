import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_ROLE_COOKIE, AUTH_TOKEN_COOKIE, getDashboardRoute } from "@/lib/auth-session";
export default async function UserDashboardLayout({ children }) {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;
    const role = cookieStore.get(AUTH_ROLE_COOKIE)?.value;
    if (!token) {
        redirect("/login");
    }
    if (role !== "USER") {
        redirect(role ? getDashboardRoute(role) : "/login");
    }
    return _jsx(_Fragment, { children: children });
}
