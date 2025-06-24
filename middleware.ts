import { getUserRoleFromSession, isUserAuthenticated } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const restrictedRoutes = /^\/(login|signup|verify-email(?:\/.*)?|dashboard)$/;
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
      if (isRestrictedRoute) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      if(/^\/admin\/(.*)$/.test(pathname)){
        if("admin" !== isAuthRole){
          return NextResponse.redirect(new URL("/", req.url))
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
    "/settings",
    "/your-profile",
    "/verify-email(:/.*)?",
    "/assistant(:/.*)?",
    "/admin(:/.*)?"
  ],
};
