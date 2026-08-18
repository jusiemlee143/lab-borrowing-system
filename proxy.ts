import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("token")?.value

  // ============================================================
  // PROTECTED DASHBOARD ROUTES
  // ============================================================

  const isAdminDashboard =
    pathname === "/admin/dashboard" ||
    pathname.startsWith("/admin/dashboard/")

  const isLicDashboard =
    pathname === "/lab-in-charge/dashboard" ||
    pathname.startsWith("/lab-in-charge/dashboard/")

  // ============================================================
  // IF USER IS NOT ACCESSING A PROTECTED DASHBOARD
  // ============================================================

  if (!isAdminDashboard && !isLicDashboard) {
    return NextResponse.next()
  }

  // ============================================================
  // NO TOKEN
  // ============================================================

  if (!token) {
    return redirectToLogin(request, pathname)
  }

  // ============================================================
  // VERIFY JWT
  // ============================================================

  try {
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured.")
      return redirectToLogin(request, pathname, "session-expired")
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as {
      id: string
      role: string
    }

    // ==========================================================
    // ADMIN DASHBOARD
    // ==========================================================

    if (isAdminDashboard) {
      if (decoded.role !== "admin") {
        return redirectToLogin(
          request,
          pathname,
          "unauthorized"
        )
      }
    }

    // ==========================================================
    // LAB-IN-CHARGE DASHBOARD
    // ==========================================================

    if (isLicDashboard) {
      if (decoded.role !== "lic") {
        return redirectToLogin(
          request,
          pathname,
          "unauthorized"
        )
      }
    }

    // ==========================================================
    // TOKEN IS VALID
    // ==========================================================

    return NextResponse.next()
  } catch (error) {
    console.error("JWT verification failed:", error)

    // Remove invalid/expired token
    const response = redirectToLogin(
      request,
      pathname,
      "session-expired"
    )

    response.cookies.delete("token")

    return response
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
  let loginPath = "/admin"

  if (pathname.startsWith("/lab-in-charge")) {
    loginPath = "/lab-in-charge"
  }

  const loginUrl = new URL(
    loginPath,
    request.url
  )

  loginUrl.searchParams.set(
    "error",
    error || "login-required"
  )

  loginUrl.searchParams.set(
    "from",
    pathname
  )

  return NextResponse.redirect(loginUrl)
}

// ============================================================
// PROTECTED ROUTES
// ============================================================

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/lab-in-charge/dashboard/:path*",
  ],
}