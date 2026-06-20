import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_ROLE_COOKIE, AUTH_TOKEN_COOKIE, getDashboardRoute } from "@/lib/auth-session";
import { Role } from "@/types";

export default async function DashboardIndexPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;
  const role = cookieStore.get(AUTH_ROLE_COOKIE)?.value as Role | undefined;

  if (!token || !role) {
    redirect("/login");
  }

  redirect(getDashboardRoute(role));
}
