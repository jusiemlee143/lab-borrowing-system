"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Activity,
  ArrowRight,
  CircuitBoard,
  Cpu,
  Eye,
  EyeOff,
  FlaskConical,
  Lock,
  LogOut,
  Settings,
  User,
  Wrench,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"

import { Toaster, toast } from "sonner"

// ============================================================
// STUDENT LOGIN PAGE
// ============================================================

export default function StudentLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [loginId, setLoginId] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // ============================================================
  // REDIRECT NOTIFICATIONS
  // ============================================================

  useEffect(() => {
    const error = searchParams?.get("error")

    if (error === "login-required") {
      toast.error(
        "You must login first to access the Student Dashboard."
      )
    }

    if (error === "session-expired") {
      toast.error(
        "Your session has expired. Please login again."
      )
    }
  }, [searchParams])

  // ============================================================
  // CHECK EXISTING SESSION
  // ============================================================

  useEffect(() => {
    const session = sessionStorage.getItem("studentSession")

    if (!session) return

    try {
      const parsed = JSON.parse(session)

      if (parsed?.loggedIn === true) {
        router.replace("/student/dashboard")
      }
    } catch {
      sessionStorage.removeItem("studentSession")
    }
  }, [router])

  // ============================================================
  // LOGIN
  // ============================================================

const handleLogin = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault()

  if (isLoggingIn) return

  setLoginError("")

  const studentId = loginId.trim()

  // ============================================================
  // VALIDATION
  // ============================================================

  if (!studentId || !loginPassword) {
    setLoginError(
      "Please enter your Student ID and Password."
    )
    return
  }

  setIsLoggingIn(true)

  try {
    // ==========================================================
    // SEND LOGIN INFORMATION TO BACKEND
    // ==========================================================

    const response = await fetch("/api/auth/login", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      // Allows the browser to receive/save the JWT cookie
      credentials: "include",

      body: JSON.stringify({
        studentId: studentId,
        password: loginPassword,
      }),
    })

    // ==========================================================
    // GET BACKEND RESPONSE
    // ==========================================================

    const data = await response.json()

    console.log("=================================")
    console.log("STUDENT LOGIN RESPONSE")
    console.log("Status:", response.status)
    console.log("Data:", data)
    console.log("=================================")

    // ==========================================================
    // LOGIN FAILED
    // ==========================================================

    if (!response.ok) {
      setLoginError(
        data.message ||
          "Invalid Student ID or Password."
      )

      return
    }

    // ==========================================================
    // LOGIN SUCCESSFUL
    // ==========================================================

    console.log("✅ Student login successful")

    // ==========================================================
    // CREATE FRONTEND SESSION
    // ==========================================================

    sessionStorage.setItem(
      "studentSession",
      JSON.stringify({
        loggedIn: true,
        studentId: data.studentId,
        userId: data.userId,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
      })
    )

    // ==========================================================
    // SUCCESS MESSAGE
    // ==========================================================

    toast.success("Login successful!")

    // ==========================================================
    // GO TO STUDENT DASHBOARD
    // ==========================================================

    router.replace("/student/dashboard")

  } catch (error) {
    console.error(
      "Student login error:",
      error
    )

    setLoginError(
      "Unable to connect to the server. Please try again."
    )

  } finally {
    setIsLoggingIn(false)
  }
}

  // ============================================================
  // EXIT
  // ============================================================

  const handleExit = () => {
    sessionStorage.removeItem("studentSession")

    router.push("/")
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="relative h-screen max-h-screen w-full overflow-hidden bg-[#fafafa]">
      <Toaster
        richColors
        position="top-right"
      />

      {/* ======================================================
          BACKGROUND GRID
      ====================================================== */}

      <div
        className="pointer-events-none fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(#800000 1px, transparent 1px),
            linear-gradient(90deg, #800000 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
        }}
      />

      {/* ======================================================
          DECORATIVE TECHNOLOGY ELEMENTS
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Circuit lines */}

        <div className="absolute left-0 top-[14%] h-px w-[25%] bg-[#800000]/10" />

        <div className="absolute left-[25%] top-[14%] h-24 w-px bg-[#800000]/10" />

        <div className="absolute left-[25%] top-[calc(14%+6rem)] h-px w-24 bg-[#800000]/10" />

        <div className="absolute bottom-[15%] right-0 h-px w-[25%] bg-[#800000]/10" />

        <div className="absolute bottom-[15%] right-[25%] h-24 w-px bg-[#800000]/10" />

        <div className="absolute bottom-[calc(15%+6rem)] right-[25%] h-px w-24 bg-[#800000]/10" />

        {/* Nodes */}

        <div className="absolute left-[24.5%] top-[13.4%] h-2 w-2 rounded-full bg-[#FFD700]" />

        <div className="absolute bottom-[14.4%] right-[24.5%] h-2 w-2 rounded-full bg-[#FFD700]" />

        {/* Large gears */}

        <Settings
          className="absolute -right-28 top-16 h-96 w-96 text-[#800000]/[0.025]"
          strokeWidth={1}
        />

        <Settings
          className="absolute -left-28 bottom-[-8rem] h-96 w-96 text-[#800000]/[0.025]"
          strokeWidth={1}
        />

        {/* Technology icons */}

        <Cpu
          className="absolute right-[9%] top-[25%] h-10 w-10 text-[#800000]/[0.07]"
          strokeWidth={1.5}
        />

        <CircuitBoard
          className="absolute bottom-[20%] left-[8%] h-10 w-10 text-[#800000]/[0.07]"
          strokeWidth={1.5}
        />

        <FlaskConical
          className="absolute left-[14%] top-[30%] h-8 w-8 text-[#800000]/[0.05]"
          strokeWidth={1.5}
        />

        <Wrench
          className="absolute bottom-[30%] right-[14%] h-8 w-8 text-[#800000]/[0.05]"
          strokeWidth={1.5}
        />
      </div>

      {/* ======================================================
          EXIT BUTTON
      ====================================================== */}

      <Button
        type="button"
        variant="outline"
        onClick={handleExit}
        disabled={isLoggingIn}
        className="
          fixed
          right-4
          top-4
          z-50
          h-9
          rounded-lg
          border-[#800000]/20
          bg-white/95
          px-3
          text-[#800000]
          shadow-sm
          backdrop-blur-md
          hover:bg-[#800000]
          hover:text-[#FFD700]
          sm:right-7
          sm:top-7
        "
      >
        <LogOut className="mr-2 h-4 w-4" />
        Exit
      </Button>

      {/* ======================================================
          MAIN LOGIN CONTAINER
      ====================================================== */}

      <main
        className="
          relative
          z-10
          flex
          h-screen
          max-h-screen
          w-full
          items-center
          justify-center
          overflow-hidden
          px-4
          py-4
          sm:px-6
        "
      >
        <div
          className="
            grid
            w-full
            max-w-5xl
            overflow-hidden
            rounded-[2rem]
            border
            border-gray-200
            bg-white
            shadow-[0_25px_80px_rgba(80,0,0,0.14)]
            lg:h-[min(650px,calc(100vh-48px))]
            lg:grid-cols-[0.9fr_1.1fr]
          "
        >
          {/* ==================================================
              LEFT BRANDING PANEL
          ================================================== */}

          <section
            className="
              relative
              hidden
              overflow-hidden
              bg-[#800000]
              p-8
              text-white
              lg:flex
              lg:flex-col
              lg:justify-between
              xl:p-10
            "
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-[20%] top-0 h-full w-px bg-[#FFD700]/10" />

              <div className="absolute left-0 top-[28%] h-px w-full bg-[#FFD700]/10" />

              <div className="absolute bottom-[28%] left-0 h-px w-[70%] bg-[#FFD700]/10" />

              <div className="absolute left-[20%] top-[28%] h-2 w-2 rounded-full bg-[#FFD700]" />

              <div className="absolute bottom-[28%] left-[70%] h-2 w-2 rounded-full bg-[#FFD700]" />

              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-[#FFD700]/10" />

              <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-[#FFD700]/10" />

              <Settings
                className="absolute -bottom-20 -right-20 h-72 w-72 text-[#FFD700]/10"
                strokeWidth={1}
              />

              <Cpu
                className="absolute right-10 top-12 h-10 w-10 text-[#FFD700]/20"
                strokeWidth={1.5}
              />

              <CircuitBoard
                className="absolute bottom-28 left-8 h-10 w-10 text-[#FFD700]/20"
                strokeWidth={1.5}
              />
            </div>

            {/* Logo */}

            <div className="relative z-10">
              <div
                className="
                  flex
                  h-52
                  w-full
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-3xl
                  border
                  border-[#FFD700]/30
                  bg-white
                  shadow-[0_15px_45px_rgba(0,0,0,0.22)]
                  xl:h-56
                "
              >
                <Image
                  src="/logo/OfficialLogo.png"
                  alt="Lab Borrowing System Logo"
                  width={300}
                  height={300}
                  priority
                  className="h-full w-full object-contain"
                />
              </div>
            </div>

            {/* Branding text */}

            <div className="relative z-10">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-px w-8 bg-[#FFD700]" />

                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFD700]">
                  Laboratory Technology
                </span>
              </div>

              <h2 className="text-3xl font-bold leading-tight">
                Lab Borrowing
                <br />
                <span className="text-[#FFD700]">
                  System
                </span>
              </h2>

              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
                A streamlined platform for managing
                laboratory tools, equipment, and student
                borrowing activities.
              </p>
            </div>

            {/* Status indicators */}

            <div className="relative z-10 flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2">
                <Activity className="h-4 w-4 text-[#FFD700]" />

                <span className="text-xs text-white/80">
                  System Ready
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2">
                <Wrench className="h-4 w-4 text-[#FFD700]" />

                <span className="text-xs text-white/80">
                  Equipment
                </span>
              </div>
            </div>
          </section>

          {/* ==================================================
              RIGHT LOGIN PANEL
          ================================================== */}

          <section
            className="
              flex
              h-full
              min-h-0
              flex-col
              justify-center
              overflow-hidden
              p-5
              sm:p-8
              lg:p-10
              xl:p-12
            "
          >
            <div className="mx-auto w-full max-w-md">

              {/* Mobile logo */}

              <div className="mb-4 lg:hidden">
                <div className="mx-auto flex h-20 w-28 items-center justify-center rounded-2xl bg-[#800000] p-2.5 shadow-lg">
                  <div className="flex h-full w-full items-center justify-center rounded-xl bg-white p-1.5">
                    <Image
                      src="/logo/OfficialLogo.png"
                      alt="Lab Borrowing System Logo"
                      width={160}
                      height={120}
                      priority
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Heading */}

              <div className="mb-5">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#800000]/10 bg-[#800000]/5 px-3 py-1.5">
                  <FlaskConical
                    className="h-3.5 w-3.5 text-[#800000]"
                  />

                  <span className="text-xs font-semibold uppercase tracking-wider text-[#800000]">
                    Student Access
                  </span>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-[#800000] sm:text-4xl">
                  Student Portal
                </h1>

                <p className="mt-1.5 text-sm text-gray-500 sm:text-base">
                  Sign in to access lab tools & equipment.
                </p>
              </div>

              {/* Login Card */}

              <Card className="rounded-2xl border border-gray-200 shadow-sm">
                <CardContent className="p-4 sm:p-6">

                  <form
                    onSubmit={handleLogin}
                    className="space-y-4"
                  >

                    {/* Student ID */}

                    <div className="space-y-1.5">
                      <label
                        htmlFor="student-id"
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                      >
                        <User
                          size={15}
                          className="text-[#800000]"
                        />

                        Student ID
                      </label>

                      <Input
                        id="student-id"
                        type="text"
                        placeholder="Enter your Student ID"
                        value={loginId}
                        onChange={(e) => {
                          setLoginId(e.target.value)
                          setLoginError("")
                        }}
                        className="
                          h-11
                          rounded-xl
                          border-gray-200
                          bg-gray-50/70
                          pl-4
                          text-base
                          focus:border-[#800000]
                          focus:ring-[#800000]/20
                        "
                        disabled={isLoggingIn}
                        autoComplete="username"
                        autoFocus
                      />
                    </div>

                    {/* Password */}

                    <div className="space-y-1.5">
                      <label
                        htmlFor="student-password"
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                      >
                        <Lock
                          size={15}
                          className="text-[#800000]"
                        />

                        Password
                      </label>

                      <div className="relative">
                        <Input
                          id="student-password"
                          type={
                            showPassword
                              ? "text"
                              : "password"
                          }
                          placeholder="Enter your password"
                          value={loginPassword}
                          onChange={(e) => {
                            setLoginPassword(e.target.value)
                            setLoginError("")
                          }}
                          className="
                            h-11
                            rounded-xl
                            border-gray-200
                            bg-gray-50/70
                            pr-12
                            text-base
                            focus:border-[#800000]
                            focus:ring-[#800000]/20
                          "
                          disabled={isLoggingIn}
                          autoComplete="current-password"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(
                              (previous) => !previous
                            )
                          }
                          disabled={isLoggingIn}
                          tabIndex={-1}
                          aria-label={
                            showPassword
                              ? "Hide password"
                              : "Show password"
                          }
                          className="
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2
                            rounded-md
                            p-1
                            text-gray-400
                            transition-colors
                            hover:text-[#800000]
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                          "
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Error */}

                    {loginError && (
                      <div
                        role="alert"
                        className="
                          flex
                          items-start
                          gap-2
                          rounded-xl
                          border
                          border-red-200
                          bg-red-50
                          px-4
                          py-2.5
                          text-sm
                          text-red-700
                        "
                      >
                        <span className="font-bold">
                          !
                        </span>

                        <span>{loginError}</span>
                      </div>
                    )}

                    {/* Login Button */}

                    <Button
                      type="submit"
                      disabled={
                        isLoggingIn ||
                        !loginId.trim() ||
                        !loginPassword
                      }
                      className="
                        h-11
                        w-full
                        rounded-xl
                        bg-[#800000]
                        text-base
                        font-semibold
                        text-[#FFD700]
                        shadow-lg
                        shadow-[#800000]/15
                        transition-all
                        hover:bg-[#660000]
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      {isLoggingIn ? (
                        <span className="flex items-center justify-center gap-2">
                          <Spinner className="h-5 w-5 border-2 border-[#FFD700]/30 border-t-[#FFD700]" />

                          Signing in...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Sign In

                          <ArrowRight className="h-4 w-4" />
                        </span>
                      )}
                    </Button>

                    {/* Create Account Button */}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        router.push(
                          "/student/create-account"
                        )
                      }
                      disabled={isLoggingIn}
                      className="
                        h-11
                        w-full
                        rounded-xl
                        border-[#800000]/30
                        bg-white
                        text-base
                        font-semibold
                        text-[#800000]
                        transition-all
                        hover:bg-[#800000]
                        hover:text-[#FFD700]
                        hover:border-[#800000]
                      "
                    >
                      <User className="mr-2 h-4 w-4" />

                      Create Account
                    </Button>

                  </form>

                </CardContent>
              </Card>

              {/* Footer */}

              <p className="mt-3 text-center text-xs text-gray-400">
                © 2026 Lab Borrowing System • All rights reserved
              </p>

            </div>
          </section>
        </div>
      </main>
    </div>
  )
}