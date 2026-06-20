import { NextRequest, NextResponse } from "next/server";
import { AUTH_ROLE_COOKIE, AUTH_TOKEN_COOKIE, getDashboardRoute } from "./lib/auth-session";
import { Role } from "./types";

function getCookieValue(request: NextRequest, name: string) {
  return request.cookies.get(name)?.value || null;
}

function normalizeRole(role: string | null): Role | null {
  if (role === "USER" || role === "OWNER" || role === "ADMIN") {
    return role;
  }

  return null;
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const token = getCookieValue(request, AUTH_TOKEN_COOKIE);
  const role = normalizeRole(getCookieValue(request, AUTH_ROLE_COOKIE));
  const isAuthenticated = Boolean(token && role);

  const redirectTo = (target: string) => {
    const url = request.nextUrl.clone();
    url.pathname = target;
    url.search = "";
    return NextResponse.redirect(url);
  };

  const redirectLogin = () => {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    if (pathname !== "/login" && pathname !== "/register") {
      url.searchParams.set("next", pathname);
    }
    return NextResponse.redirect(url);
  };

  if (pathname === "/login" || pathname === "/register") {
    if (isAuthenticated && role) {
      return redirectTo(getDashboardRoute(role));
    }
    return NextResponse.next();
  }

  if (pathname === "/compare") {
    if (!isAuthenticated) {
      return redirectLogin();
    }
    return NextResponse.next();
  }

  if (
    pathname === "/dashboard/saved-properties" ||
    pathname === "/dashboard/saved-searches" ||
    pathname === "/dashboard/my-enquiries"
  ) {
    if (!isAuthenticated || !role) {
      return redirectLogin();
    }

    return role === "USER" ? NextResponse.next() : redirectTo(getDashboardRoute(role));
  }

  if (pathname === "/dashboard/subscription") {
    if (!isAuthenticated || !role) {
      return redirectLogin();
    }

    return role === "OWNER" || role === "ADMIN" ? NextResponse.next() : redirectTo(getDashboardRoute(role));
  }

  if (pathname === "/dashboard" || pathname === "/dashboard/") {
    if (!isAuthenticated || !role) {
      return redirectLogin();
    }
    return redirectTo(getDashboardRoute(role));
  }

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  if (!isAuthenticated || !role) {
    return redirectLogin();
  }

  if (pathname.startsWith("/dashboard/admin")) {
    return role === "ADMIN" ? NextResponse.next() : redirectTo(getDashboardRoute(role));
  }

  if (pathname.startsWith("/dashboard/owner")) {
    return role === "OWNER" || role === "ADMIN" ? NextResponse.next() : redirectTo(getDashboardRoute(role));
  }

  if (pathname.startsWith("/dashboard/user")) {
    return role === "USER" ? NextResponse.next() : redirectTo(getDashboardRoute(role));
  }

  if (pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/compare", "/login", "/register", "/dashboard/:path*"]
};
