import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("ecosphere_session");
  const { pathname } = request.nextUrl;

  const protectedPaths = [
    "/dashboard",
    "/map",
    "/marketplace",
    "/profile",
    "/settings",
    "/analytics",
    "/community",
    "/actions",
    "/reports"
  ];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  const hasSession = !!sessionToken?.value;

  // Redirect to login if user is unauthorized on a protected route
  if (isProtected && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users trying to hit the login page to the dashboard
  if (pathname.startsWith("/login") && hasSession) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
