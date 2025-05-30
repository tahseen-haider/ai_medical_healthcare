import { isUserAuthenticated } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

// Routes that should not be accessible to authenticated users
const authRestrictedRoutes = ["/login", "/signup", "/verify-email"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isRestrictedRoute = authRestrictedRoutes.includes(pathname);
  const isRoot = pathname === "/";

  const sessionToken = req.cookies.get("session")?.value;

  // If not authenticated
  if (!sessionToken) {
    // Allow access to login, signup, and root
    if (isRestrictedRoute || isRoot) return NextResponse.next();

    // Block access to all other routes
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If authenticated
  try {
    const isAuth = await isUserAuthenticated(sessionToken)

    if (isAuth) {
      // Prevent access to login and signup
      if (isRestrictedRoute) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      // Allow access to root and all other routes
      return NextResponse.next();
    }
  } catch {
    // Invalid session → redirect to root
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Session token exists but no valid user → redirect to root
  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
