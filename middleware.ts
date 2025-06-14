import { isUserAuthenticated } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const restrictedRoutes = /^\/(login|signup|verify-email(?:\/.*)?)$/;
  const publicRoutes =
    /^\/$|^\/(appointment|contact-us|about-us|reset-password(?:\/.*)?)$/;

  const isRestrictedRoute = restrictedRoutes.test(pathname);
  const isPublicRoutes = publicRoutes.test(pathname);

  const sessionToken = req.cookies.get("session")?.value;

  // If not authenticated
  if (!sessionToken) {
    if (isRestrictedRoute || isPublicRoutes) return NextResponse.next();

    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If authenticated
  try {
    const isAuth = await isUserAuthenticated(sessionToken);

    if (isAuth) {
      if (isRestrictedRoute) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      return NextResponse.next();
    }
  } catch {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.redirect(new URL("/", req.url));
}

export const config = {
  matcher: ["/login", "/signup", "/verify-email(:/.*)?", "/assistant(:/.*)?"],
};
