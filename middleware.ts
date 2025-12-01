import { getUserRoleFromSession } from "@/lib/dal/session.dal";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const restrictedRoutes = /^\/(login|signup|verify-email(?:\/.*)?)$/;
  const isRestrictedRoute = restrictedRoutes.test(pathname);

  const sessionToken = req.cookies.get("session")?.value;

  // For Unauthenticated
  if (!sessionToken) {
    if (isRestrictedRoute) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // For Authenticated
  try {
    const isAuthRole = await getUserRoleFromSession(sessionToken);

    if (isAuthRole) {
      // If user is logged in and tries to access login/signup, redirect them to home
      if (isRestrictedRoute) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      // Allow only admin to access /admin routes
      if (/^\/admin\/(.*)$/.test(pathname)) {
        if (isAuthRole !== "admin") {
          return NextResponse.redirect(new URL("/", req.url));
        }
      }

      // Allow only doctor to access /dashboard routes
      if (/^\/doctor\/(.*)$/.test(pathname)) {
        if (isAuthRole !== "doctor") {
          return NextResponse.redirect(new URL("/", req.url));
        }
      }
      return NextResponse.next();
    }
  } catch {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.redirect(new URL("/", req.url));
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/verify-email/:path*",
    "/assistant/:path*",
    "/admin/:path*",
    "/doctor/:path*",
    "/appointment",
  ],
};
