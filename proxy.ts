import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Protect admin & LIC dashboards
  if (
    (pathname.startsWith("/admin/dashboard") ||
      pathname.startsWith("/lab-in-charge/dashboard")) &&
    !token
  ) {
    let loginPath = "/admin"; // default

    // ✅ Detect which login page to use
    if (pathname.startsWith("/lab-in-charge")) {
      loginPath = "/lab-in-charge";
    }

    const loginUrl = new URL(loginPath, request.url);
    loginUrl.searchParams.set("error", "login-required");
    loginUrl.searchParams.set("from", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/lab-in-charge/dashboard/:path*",
  ],
};