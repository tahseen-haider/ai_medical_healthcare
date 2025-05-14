import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Define routes that don't require authentication
const publicRoutes = ["/login", "/signup", "/"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublicRoute = publicRoutes.includes(pathname);

  // Allow public routes to proceed
  if (isPublicRoute) return NextResponse.next();

  const cookieStore = cookies();
  const sessionToken = (await cookieStore).get("session")?.value;

  // Redirect if no session cookie found
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  const session = await decrypt(sessionToken);

  // Redirect if session is invalid or missing userId
  if (!session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // User is authenticated, allow the request
  return NextResponse.next();
}

// Apply middleware to all routes except API, static, and image files
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
