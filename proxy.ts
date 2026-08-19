import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// ============================================================
// JWT PAYLOAD TYPE
// ============================================================

interface JwtPayload {
  userId: string;
  role: string;
  mustChangePassword?: boolean;
  iat?: number;
  exp?: number;
}

// ============================================================
// PROXY
// ============================================================

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ============================================================
  // PROTECTED DASHBOARD ROUTES
  // ============================================================

  const isAdminDashboard =
    pathname === "/admin/dashboard" ||
    pathname.startsWith("/admin/dashboard/");

  const isLicDashboard =
    pathname === "/lab-in-charge/dashboard" ||
    pathname.startsWith("/lab-in-charge/dashboard/");

  // ============================================================
  // IF NOT A PROTECTED DASHBOARD
  // ============================================================

  if (!isAdminDashboard && !isLicDashboard) {
    return NextResponse.next();
  }

  // ============================================================
  // GET THE CORRECT COOKIE
  //
  // ADMIN  -> token
  // LIC    -> licToken
  // ============================================================

  let token: string | undefined;

  if (isAdminDashboard) {
    token = request.cookies.get("token")?.value;
  }

  if (isLicDashboard) {
    token = request.cookies.get("licToken")?.value;
  }

  // ============================================================
  // NO TOKEN
  // ============================================================

  if (!token) {
    console.log("==================================");
    console.log("PROXY: NO AUTHENTICATION COOKIE");
    console.log("Path:", pathname);
    console.log(
      "Expected Cookie:",
      isAdminDashboard ? "token" : "licToken"
    );
    console.log("==================================");

    return redirectToLogin(request, pathname);
  }

  // ============================================================
  // VERIFY JWT
  // ============================================================

  try {
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured.");

      return redirectToLogin(
        request,
        pathname,
        "session-expired"
      );
    }

    // ==========================================================
    // VERIFY TOKEN
    // ==========================================================

    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ==========================================================
    // MAKE SURE PAYLOAD IS AN OBJECT
    // ==========================================================

    if (typeof verified === "string") {
      console.error("JWT payload is invalid.");

      return redirectToLogin(
        request,
        pathname,
        "session-expired"
      );
    }

    const decoded = verified as JwtPayload;

    // ==========================================================
    // MAKE SURE USER ID AND ROLE EXIST
    // ==========================================================

    if (!decoded.userId || !decoded.role) {
      console.error("JWT is missing userId or role.");

      return redirectToLogin(
        request,
        pathname,
        "session-expired"
      );
    }

    console.log("==================================");
    console.log("PROXY AUTHENTICATION");
    console.log("Path:", pathname);
    console.log(
      "Cookie:",
      isAdminDashboard ? "token" : "licToken"
    );
    console.log("User ID:", decoded.userId);
    console.log("Role:", decoded.role);
    console.log("==================================");

    // ==========================================================
    // ADMIN DASHBOARD
    // ==========================================================

    if (isAdminDashboard) {
      if (decoded.role !== "admin") {
        console.log(
          "PROXY: User is not authorized for ADMIN dashboard."
        );

        return redirectToLogin(
          request,
          pathname,
          "unauthorized"
        );
      }
    }

    // ==========================================================
    // LAB-IN-CHARGE DASHBOARD
    // ==========================================================

    if (isLicDashboard) {
      if (decoded.role !== "lic") {
        console.log(
          "PROXY: User is not authorized for LIC dashboard."
        );

        return redirectToLogin(
          request,
          pathname,
          "unauthorized"
        );
      }
    }

    // ==========================================================
    // TOKEN VALID
    // ==========================================================

    console.log("PROXY: ACCESS GRANTED");

    return NextResponse.next();
  } catch (error) {
    console.error("==================================");
    console.error("JWT VERIFICATION FAILED");
    console.error(error);
    console.error("==================================");

    // ==========================================================
    // REMOVE THE CORRECT INVALID COOKIE
    // ==========================================================

    const response = redirectToLogin(
      request,
      pathname,
      "session-expired"
    );

    if (isAdminDashboard) {
      response.cookies.delete("token");
    }

    if (isLicDashboard) {
      response.cookies.delete("licToken");
    }

    return response;
  }
}

// ============================================================
// LOGIN REDIRECT HELPER
// ============================================================

function redirectToLogin(
  request: NextRequest,
  pathname: string,
  error?: string
) {
  let loginPath = "/admin";

  if (pathname.startsWith("/lab-in-charge")) {
    loginPath = "/lab-in-charge";
  }

  const loginUrl = new URL(
    loginPath,
    request.url
  );

  loginUrl.searchParams.set(
    "error",
    error || "login-required"
  );

  loginUrl.searchParams.set(
    "from",
    pathname
  );

  return NextResponse.redirect(loginUrl);
}

// ============================================================
// PROTECTED ROUTES
// ============================================================

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/lab-in-charge/dashboard/:path*",
  ],
};