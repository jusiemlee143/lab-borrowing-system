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
  isActive?: boolean;
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
  // ADMIN -> token
  // LIC   -> licToken
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

    return redirectToLogin(request, pathname, "login-required");
  }

  // ============================================================
  // VERIFY JWT
  // ============================================================

  try {
    // ==========================================================
    // CHECK JWT SECRET
    // ==========================================================

    if (!process.env.JWT_SECRET) {
      console.error("PROXY: JWT_SECRET is not configured.");

      return removeAuthCookieAndRedirect(
        request,
        pathname,
        isAdminDashboard,
        isLicDashboard,
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
      console.error("PROXY: JWT payload is invalid.");

      return removeAuthCookieAndRedirect(
        request,
        pathname,
        isAdminDashboard,
        isLicDashboard,
        "session-expired"
      );
    }

    const decoded = verified as JwtPayload;

    // ==========================================================
    // MAKE SURE USER ID AND ROLE EXIST
    // ==========================================================

    if (!decoded.userId || !decoded.role) {
      console.error(
        "PROXY: JWT is missing userId or role."
      );

      return removeAuthCookieAndRedirect(
        request,
        pathname,
        isAdminDashboard,
        isLicDashboard,
        "session-expired"
      );
    }

    // ==========================================================
    // LOG AUTHENTICATION
    // ==========================================================

    console.log("==================================");
    console.log("PROXY AUTHENTICATION");
    console.log("Path:", pathname);
    console.log(
      "Cookie:",
      isAdminDashboard ? "token" : "licToken"
    );
    console.log("User ID:", decoded.userId);
    console.log("Role:", decoded.role);
    console.log("isActive:", decoded.isActive);
    console.log(
      "mustChangePassword:",
      decoded.mustChangePassword
    );
    console.log("==================================");

    // ==========================================================
    // ADMIN DASHBOARD
    // ==========================================================

    if (isAdminDashboard) {
      // --------------------------------------------------------
      // ROLE CHECK
      // --------------------------------------------------------

      if (decoded.role !== "admin") {
        console.log(
          "PROXY: User is not authorized for ADMIN dashboard."
        );

        return removeAuthCookieAndRedirect(
          request,
          pathname,
          true,
          false,
          "unauthorized"
        );
      }

      // --------------------------------------------------------
      // ADMIN ACCESS GRANTED
      // --------------------------------------------------------

      console.log("PROXY: ADMIN ACCESS GRANTED");

      return NextResponse.next();
    }

    // ==========================================================
    // LAB-IN-CHARGE DASHBOARD
    // ==========================================================

    if (isLicDashboard) {
      // --------------------------------------------------------
      // ROLE CHECK
      // --------------------------------------------------------

      if (decoded.role !== "lic") {
        console.log(
          "PROXY: User is not authorized for LIC dashboard."
        );

        return removeAuthCookieAndRedirect(
          request,
          pathname,
          false,
          true,
          "unauthorized"
        );
      }

      // --------------------------------------------------------
      // ACCOUNT STATUS CHECK
      // --------------------------------------------------------
      //
      // This protects tokens that were created with:
      //
      // isActive: false
      //
      // However, if an account is disabled AFTER the token
      // was created, the old JWT may still contain true.
      //
      // API routes should therefore also verify the current
      // account status from MongoDB.
      // --------------------------------------------------------

      if (decoded.isActive === false) {
        console.log(
          "PROXY: LIC ACCOUNT IS DISABLED."
        );

        return removeAuthCookieAndRedirect(
          request,
          pathname,
          false,
          true,
          "account-disabled"
        );
      }

      // --------------------------------------------------------
      // LIC ACCESS GRANTED
      // --------------------------------------------------------

      console.log("PROXY: LIC ACCESS GRANTED");

      return NextResponse.next();
    }

    // ==========================================================
    // FALLBACK
    // ==========================================================

    return NextResponse.next();
  } catch (error) {
    // ==========================================================
    // JWT VERIFICATION FAILED
    // ==========================================================

    console.error("==================================");
    console.error("JWT VERIFICATION FAILED");
    console.error(error);
    console.error("==================================");

    return removeAuthCookieAndRedirect(
      request,
      pathname,
      isAdminDashboard,
      isLicDashboard,
      "session-expired"
    );
  }
}

// ============================================================
// REMOVE AUTH COOKIE + REDIRECT
// ============================================================

function removeAuthCookieAndRedirect(
  request: NextRequest,
  pathname: string,
  isAdminDashboard: boolean,
  isLicDashboard: boolean,
  error: string
) {
  const response = redirectToLogin(
    request,
    pathname,
    error
  );

  // ==========================================================
  // REMOVE ADMIN COOKIE
  // ==========================================================

  if (isAdminDashboard) {
    response.cookies.delete("token");
  }

  // ==========================================================
  // REMOVE LIC COOKIE
  // ==========================================================

  if (isLicDashboard) {
    response.cookies.delete("licToken");
  }

  return response;
}

// ============================================================
// LOGIN REDIRECT HELPER
// ============================================================

function redirectToLogin(
  request: NextRequest,
  pathname: string,
  error?: string
) {
  // ==========================================================
  // DEFAULT LOGIN
  // ==========================================================

  let loginPath = "/admin";

  // ==========================================================
  // LIC LOGIN
  // ==========================================================

  if (pathname.startsWith("/lab-in-charge")) {
    loginPath = "/lab-in-charge";
  }

  // ==========================================================
  // CREATE LOGIN URL
  // ==========================================================

  const loginUrl = new URL(
    loginPath,
    request.url
  );

  // ==========================================================
  // ERROR
  // ==========================================================

  loginUrl.searchParams.set(
    "error",
    error || "login-required"
  );

  // ==========================================================
  // ORIGINAL PAGE
  // ==========================================================

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

