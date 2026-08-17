"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  CircuitBoard,
  Cpu,
  Eye,
  EyeOff,
  FlaskConical,
  Lock,
  Settings,
  User,
  Wrench,
  Mail,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"

import { Toaster, toast } from "sonner"

// ============================================================
// STUDENT CREATE ACCOUNT PAGE
// ============================================================

export default function CreateAccountPage() {
  const router = useRouter()

  // ============================================================
  // FORM STATE
  // ============================================================

  const [studentId, setStudentId] = useState("")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // ============================================================
  // UI STATE
  // ============================================================

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // ============================================================
  // CREATE ACCOUNT
  // ============================================================

  const handleCreateAccount = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    if (loading) return

    setError("")
    setSuccess("")

    // ==========================================================
    // BASIC VALIDATION
    // ==========================================================

    const trimmedStudentId = studentId.trim()
    const trimmedFullName = fullName.trim()
    const trimmedEmail = email.trim()

    if (
      !trimmedStudentId ||
      !trimmedFullName ||
      !trimmedEmail ||
      !password ||
      !confirmPassword
    ) {
      setError("Please complete all required fields.")
      return
    }

    // ==========================================================
    // PASSWORD VALIDATION
    // ==========================================================

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    // ==========================================================
    // START REGISTRATION
    // ==========================================================

    try {
      setLoading(true)

      const response = await fetch(
        "/api/auth/student-register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId: trimmedStudentId,
            fullName: trimmedFullName,
            email: trimmedEmail,
            password,
          }),
        }
      )

      const data = await response.json()

      console.log("=================================")
      console.log("STUDENT REGISTRATION RESPONSE")
      console.log("Status:", response.status)
      console.log("Data:", data)
      console.log("=================================")

      // ========================================================
      // REGISTRATION FAILED
      // ========================================================

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to create account. Please try again."
        )

        return
      }

      // ========================================================
      // REGISTRATION SUCCESSFUL
      // ========================================================

      setSuccess(
        "Account created successfully! Redirecting to login..."
      )

      toast.success("Account created successfully!")

      // ========================================================
      // REDIRECT TO LOGIN
      // ========================================================

      setTimeout(() => {
        router.push("/student/login")
      }, 1500)
    } catch (error) {
      console.error("Registration error:", error)

      setError(
        "Unable to connect to the server. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  // ============================================================
  // BACK TO LOGIN
  // ============================================================

  const handleBack = () => {
    if (loading) return

    router.push("/student/login")
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
          BACK BUTTON
      ====================================================== */}

      <Button
        type="button"
        variant="outline"
        onClick={handleBack}
        disabled={loading}
        className="
          fixed
          left-4
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
          sm:left-7
          sm:top-7
        "
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* ======================================================
          MAIN CONTAINER
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
          px-3
          py-3
          sm:px-5
          sm:py-4
        "
      >
        <div
          className="
            grid
            w-full
            max-w-5xl
            overflow-hidden
            rounded-[1.75rem]
            border
            border-gray-200
            bg-white
            shadow-[0_25px_80px_rgba(80,0,0,0.14)]
            lg:h-[min(620px,calc(100vh-32px))]
            lg:grid-cols-[0.9fr_1.1fr]
            xl:h-[min(640px,calc(100vh-40px))]
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
              p-7
              text-white
              lg:flex
              lg:flex-col
              lg:justify-between
              xl:p-9
            "
          >
            {/* Decorative elements */}

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
                  h-44
                  w-full
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-3xl
                  border
                  border-[#FFD700]/30
                  bg-white
                  shadow-[0_15px_45px_rgba(0,0,0,0.22)]
                  xl:h-48
                "
              >
                <Image
                  src="/logo/OfficialLogo.png"
                  alt="Lab Borrowing System Logo"
                  width={280}
                  height={280}
                  priority
                  className="h-full w-full object-contain"
                />
              </div>
            </div>

            {/* Branding */}

            <div className="relative z-10">
              <div className="mb-2 flex items-center gap-2">
                <div className="h-px w-7 bg-[#FFD700]" />

                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FFD700]">
                  Laboratory Technology
                </span>
              </div>

              <h2 className="text-2xl font-bold leading-tight xl:text-3xl">
                Lab Borrowing
                <br />
                <span className="text-[#FFD700]">
                  System
                </span>
              </h2>

              <p className="mt-2 max-w-sm text-xs leading-relaxed text-white/70 xl:text-sm">
                A streamlined platform for managing
                laboratory tools, equipment, and student
                borrowing activities.
              </p>
            </div>

            {/* Status */}

            <div className="relative z-10 flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-2.5 py-1.5">
                <Activity className="h-3.5 w-3.5 text-[#FFD700]" />

                <span className="text-[11px] text-white/80">
                  System Ready
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-2.5 py-1.5">
                <Wrench className="h-3.5 w-3.5 text-[#FFD700]" />

                <span className="text-[11px] text-white/80">
                  Equipment
                </span>
              </div>
            </div>
          </section>

          {/* ==================================================
              RIGHT REGISTRATION PANEL
          ================================================== */}

          <section
            className="
              flex
              h-full
              min-h-0
              flex-col
              justify-center
              overflow-hidden
              px-5
              py-4
              sm:px-7
              sm:py-5
              lg:px-8
              lg:py-5
              xl:px-10
            "
          >
            <div className="mx-auto w-full max-w-md">

              {/* ==================================================
                  MOBILE LOGO
              ================================================== */}

              <div className="mb-2.5 lg:hidden">
                <div className="mx-auto flex h-14 w-24 items-center justify-center rounded-xl bg-[#800000] p-2 shadow-lg">
                  <div className="flex h-full w-full items-center justify-center rounded-lg bg-white p-1">
                    <Image
                      src="/logo/OfficialLogo.png"
                      alt="Lab Borrowing System Logo"
                      width={140}
                      height={100}
                      priority
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* ==================================================
                  HEADER
              ================================================== */}

              <div className="mb-3.5">
                <div className="mb-1.5 inline-flex items-center gap-2 rounded-full border border-[#800000]/10 bg-[#800000]/5 px-2.5 py-1">
                  <User
                    className="h-3 w-3 text-[#800000]"
                  />

                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#800000]">
                    Student Registration
                  </span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-[#800000] sm:text-3xl">
                  Create Account
                </h1>

                <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                  Register your student account to access
                  laboratory tools.
                </p>
              </div>

              {/* ==================================================
                  REGISTRATION CARD
              ================================================== */}

              <Card className="rounded-2xl border border-gray-200 shadow-sm">
                <CardContent className="p-4 sm:p-5">

                  <form
                    onSubmit={handleCreateAccount}
                    className="space-y-2.5"
                  >

                    {/* ==================================================
                        STUDENT ID
                    ================================================== */}

                    <div className="space-y-1">
                      <label
                        htmlFor="student-id"
                        className="flex items-center gap-2 text-xs font-semibold text-gray-700 sm:text-sm"
                      >
                        <User
                          size={14}
                          className="text-[#800000]"
                        />

                        Student ID
                      </label>

                      <Input
                        id="student-id"
                        type="text"
                        placeholder="Enter your Student ID"
                        value={studentId}
                        onChange={(e) => {
                          setStudentId(e.target.value)
                          setError("")
                        }}
                        className="
                          h-9
                          rounded-lg
                          border-gray-200
                          bg-gray-50/70
                          px-3
                          text-sm
                          focus:border-[#800000]
                          focus:ring-[#800000]/20
                          sm:h-10
                        "
                        disabled={loading}
                        autoComplete="username"
                        autoFocus
                      />
                    </div>

                    {/* ==================================================
                        FULL NAME
                    ================================================== */}

                    <div className="space-y-1">
                      <label
                        htmlFor="full-name"
                        className="flex items-center gap-2 text-xs font-semibold text-gray-700 sm:text-sm"
                      >
                        <User
                          size={14}
                          className="text-[#800000]"
                        />

                        Full Name
                      </label>

                      <Input
                        id="full-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value)
                          setError("")
                        }}
                        className="
                          h-9
                          rounded-lg
                          border-gray-200
                          bg-gray-50/70
                          px-3
                          text-sm
                          focus:border-[#800000]
                          focus:ring-[#800000]/20
                          sm:h-10
                        "
                        disabled={loading}
                        autoComplete="name"
                      />
                    </div>

                    {/* ==================================================
                        EMAIL
                    ================================================== */}

                    <div className="space-y-1">
                      <label
                        htmlFor="email"
                        className="flex items-center gap-2 text-xs font-semibold text-gray-700 sm:text-sm"
                      >
                        <Mail
                          size={14}
                          className="text-[#800000]"
                        />

                        Email Address
                      </label>

                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          setError("")
                        }}
                        className="
                          h-9
                          rounded-lg
                          border-gray-200
                          bg-gray-50/70
                          px-3
                          text-sm
                          focus:border-[#800000]
                          focus:ring-[#800000]/20
                          sm:h-10
                        "
                        disabled={loading}
                        autoComplete="email"
                      />
                    </div>

                    {/* ==================================================
                        PASSWORD
                    ================================================== */}

                    <div className="space-y-1">
                      <label
                        htmlFor="password"
                        className="flex items-center gap-2 text-xs font-semibold text-gray-700 sm:text-sm"
                      >
                        <Lock
                          size={14}
                          className="text-[#800000]"
                        />

                        Password
                      </label>

                      <div className="relative">
                        <Input
                          id="password"
                          type={
                            showPassword
                              ? "text"
                              : "password"
                          }
                          placeholder="Create a password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value)
                            setError("")
                          }}
                          className="
                            h-9
                            rounded-lg
                            border-gray-200
                            bg-gray-50/70
                            px-3
                            pr-10
                            text-sm
                            focus:border-[#800000]
                            focus:ring-[#800000]/20
                            sm:h-10
                          "
                          disabled={loading}
                          autoComplete="new-password"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(
                              (previous) => !previous
                            )
                          }
                          disabled={loading}
                          tabIndex={-1}
                          aria-label={
                            showPassword
                              ? "Hide password"
                              : "Show password"
                          }
                          className="
                            absolute
                            right-2.5
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
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* ==================================================
                        CONFIRM PASSWORD
                    ================================================== */}

                    <div className="space-y-1">
                      <label
                        htmlFor="confirm-password"
                        className="flex items-center gap-2 text-xs font-semibold text-gray-700 sm:text-sm"
                      >
                        <Lock
                          size={14}
                          className="text-[#800000]"
                        />

                        Confirm Password
                      </label>

                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={
                            showConfirmPassword
                              ? "text"
                              : "password"
                          }
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(
                              e.target.value
                            )
                            setError("")
                          }}
                          className="
                            h-9
                            rounded-lg
                            border-gray-200
                            bg-gray-50/70
                            px-3
                            pr-10
                            text-sm
                            focus:border-[#800000]
                            focus:ring-[#800000]/20
                            sm:h-10
                          "
                          disabled={loading}
                          autoComplete="new-password"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(
                              (previous) => !previous
                            )
                          }
                          disabled={loading}
                          tabIndex={-1}
                          aria-label={
                            showConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
                          className="
                            absolute
                            right-2.5
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
                          {showConfirmPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* ==================================================
                        ERROR
                    ================================================== */}

                    {error && (
                      <div
                        role="alert"
                        className="
                          flex
                          items-start
                          gap-2
                          rounded-lg
                          border
                          border-red-200
                          bg-red-50
                          px-3
                          py-2
                          text-xs
                          text-red-700
                        "
                      >
                        <span className="font-bold">
                          !
                        </span>

                        <span>{error}</span>
                      </div>
                    )}

                    {/* ==================================================
                        SUCCESS
                    ================================================== */}

                    {success && (
                      <div
                        role="status"
                        className="
                          flex
                          items-start
                          gap-2
                          rounded-lg
                          border
                          border-green-200
                          bg-green-50
                          px-3
                          py-2
                          text-xs
                          text-green-700
                        "
                      >
                        <span className="font-bold">
                          ✓
                        </span>

                        <span>{success}</span>
                      </div>
                    )}

                    {/* ==================================================
                        CREATE ACCOUNT BUTTON
                    ================================================== */}

                    <Button
                      type="submit"
                      disabled={
                        loading ||
                        !studentId.trim() ||
                        !fullName.trim() ||
                        !email.trim() ||
                        !password ||
                        !confirmPassword
                      }
                      className="
                        mt-1
                        h-9
                        w-full
                        rounded-lg
                        bg-[#800000]
                        text-sm
                        font-semibold
                        text-[#FFD700]
                        shadow-lg
                        shadow-[#800000]/15
                        transition-all
                        hover:bg-[#660000]
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                        sm:h-10
                      "
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Spinner className="h-4 w-4 border-2 border-[#FFD700]/30 border-t-[#FFD700]" />

                          Creating Account...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Create Account

                          <ArrowRight className="h-4 w-4" />
                        </span>
                      )}
                    </Button>

                  </form>

                  {/* ==================================================
                      SIGN IN
                  ================================================== */}

                  <div className="mt-3 border-t border-gray-100 pt-3">
                    <p className="text-center text-xs text-gray-500">
                      Already have an account?{" "}

                      <button
                        type="button"
                        onClick={handleBack}
                        disabled={loading}
                        className="
                          font-semibold
                          text-[#800000]
                          transition-colors
                          hover:text-[#660000]
                          hover:underline
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >
                        Sign In
                      </button>
                    </p>
                  </div>

                </CardContent>
              </Card>

              {/* ==================================================
                  FOOTER
              ================================================== */}

              <p className="mt-2 text-center text-[10px] text-gray-400 sm:text-xs">
                © 2026 Lab Borrowing System • All rights reserved
              </p>

            </div>
          </section>
        </div>
      </main>
    </div>
  )
}