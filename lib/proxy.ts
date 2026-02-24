import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

/**
 * Server-side auth proxy — replaces Next.js middleware for auth checks.
 *
 * Usage in any Server Component or layout:
 *   const session = await requireAuth();
 *
 * If the user is not authenticated, they are redirected to /auth/login.
 * If authenticated, the session object is returned for use in the component.
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  return session;
}

/**
 * Soft auth check — returns session or null without redirecting.
 * Useful for pages that show different content for logged-in vs anonymous users.
 */
export async function getAuth() {
  const session = await getServerSession(authOptions);
  return session;
}

/**
 * Redirect authenticated users away from auth pages (login/register).
 * Use this on auth pages to redirect logged-in users to the admin dashboard.
 */
export async function redirectIfAuthenticated(redirectTo = "/admin") {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect(redirectTo);
  }

  return null;
}
