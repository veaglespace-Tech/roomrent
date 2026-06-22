export const AUTH_TOKEN_COOKIE = "roomrent_token";
export const AUTH_ROLE_COOKIE = "roomrent_role";
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
export function getDashboardRoute(role) {
    switch (role) {
        case "ADMIN":
            return "/dashboard/admin";
        case "OWNER":
            return "/dashboard/owner";
        case "USER":
        default:
            return "/dashboard/user";
    }
}
export function setAuthSession(auth) {
    if (typeof window === "undefined") {
        return;
    }
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${AUTH_ROLE_COOKIE}=${encodeURIComponent(auth.role)}; Path=/; Max-Age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
}
export function clearAuthSession() {
    if (typeof window === "undefined") {
        return;
    }
    document.cookie = `${AUTH_ROLE_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
export function getStoredAuthRole() {
    if (typeof window === "undefined") {
        return null;
    }
    const cookieRole = document.cookie
        .split("; ")
        .find((entry) => entry.startsWith(`${AUTH_ROLE_COOKIE}=`))
        ?.split("=")[1];
    if (cookieRole === "USER" || cookieRole === "OWNER" || cookieRole === "ADMIN") {
        return cookieRole;
    }
    return null;
}
