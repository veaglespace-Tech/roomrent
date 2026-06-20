import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_ROLE_COOKIE, AUTH_TOKEN_COOKIE, getDashboardRoute } from "@/lib/auth-session";
import { Role } from "@/types";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;
  const role = cookieStore.get(AUTH_ROLE_COOKIE)?.value as Role | undefined;

  if (!token) {
    redirect("/login");
  }

  if (role !== "ADMIN") {
    redirect(role ? getDashboardRoute(role) : "/login");
  }

  return <>{children}</>;
}
