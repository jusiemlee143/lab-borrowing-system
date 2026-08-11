"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Activity,
  ArrowRight,
  CircuitBoard,
  CheckCircle2,
  Cpu,
  Eye,
  EyeOff,
  FlaskConical,
  KeyRound,
  LockKeyhole,
  LogOut,
  Mail,
  Settings,
  ShieldCheck,
  User,
  Wrench,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast, Toaster } from "sonner"

// ============================================================
// LIC USER TYPE
// ============================================================

type LicUser = {
  userId: string
  mustChangePassword: boolean
  fullName?: string
  email?: string
}

// ============================================================
// CHANGE PASSWORD PAGE
// ============================================================

export default function ChangePasswordPage() {
  const router = useRouter()

  // ============================================================
  // STATE
  // ============================================================

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  const [user, setUser] = useState<LicUser | null>(null)

  // ============================================================
  // LOAD LIC SESSION
  // ============================================================

  useEffect(() => {
    const storedUser = localStorage.getItem("licUser")

    if (!storedUser) {
      toast.error("Please log in first.")

      router.replace("/lab-in-charge/login")
      return
    }

    try {
      const parsedUser: LicUser = JSON.parse(storedUser)

      // --------------------------------------------------------
      // Validate session
      // --------------------------------------------------------

      if (!parsedUser.userId) {
        toast.error("Invalid session. Please log in again.")

        localStorage.removeItem("licUser")

        router.replace("/lab-in-charge/login")
        return
      }

      setUser(parsedUser)
      setCheckingSession(false)
    } catch (error) {
      console.error("Failed to parse LIC user:", error)

      localStorage.removeItem("licUser")

      toast.error(
        "Your session is invalid. Please log in again."
      )

      router.replace("/lab-in-charge/login")
    }
  }, [router])

  // ============================================================
  // PASSWORD VALIDATION
  // ============================================================

  const passwordLengthValid = newPassword.length >= 8

  const passwordsMatch =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    if (loading) return

    if (!user) {
      toast.error("User session not found.")
      return
    }

    // ----------------------------------------------------------
    // Validate password
    // ----------------------------------------------------------

    if (!passwordLengthValid) {
      toast.error(
        "Password must contain at least 8 characters."
      )
      return
    }

    if (!passwordsMatch) {
      toast.error("Passwords do not match.")
      return
    }

    setLoading(true)

    try {
      // --------------------------------------------------------
      // Change password API
      // --------------------------------------------------------

      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.userId,
          newPassword,
        }),
      })

      const data = await res.json().catch(() => null)

      // --------------------------------------------------------
      // API error
      // --------------------------------------------------------

      if (!res.ok) {
        toast.error(
          data?.message ||
            "Failed to change password."
        )

        return
      }

      // --------------------------------------------------------
      // Update local session
      // --------------------------------------------------------

      const updatedUser: LicUser = {
        ...user,
        mustChangePassword: false,
      }

      localStorage.setItem(
        "licUser",
        JSON.stringify(updatedUser)
      )

      // --------------------------------------------------------
      // Success
      // --------------------------------------------------------

      toast.success(
        "Password changed successfully!"
      )

      setNewPassword("")
      setConfirmPassword("")

      // --------------------------------------------------------
      // Redirect
      // --------------------------------------------------------

      setTimeout(() => {
        router.replace("/lab-in-charge")
      }, 800)
    } catch (error) {
      console.error(
        "CHANGE PASSWORD ERROR:",
        error
      )

      toast.error(
        "Unable to connect to the server. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  // ============================================================
  // EXIT
  // ============================================================

  const handleExit = () => {
    if (loading) return

    localStorage.removeItem("licUser")

    router.replace("/lab-in-charge/login")
  }

  // ============================================================
  // LOADING SCREEN
  // ============================================================

  if (checkingSession) {
    return (
      <div className="relative flex h-screen max-h-screen w-full items-center justify-center overflow-hidden bg-[#fafafa]">
        <Toaster
          richColors
          position="top-right"
        />

        {/* Background grid */}

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

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#800000] shadow-lg">
            <ShieldCheck
              className="h-7 w-7 text-[#FFD700]"
              strokeWidth={1.8}
            />
          </div>

          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-[#800000]" />

          <p className="text-xs font-medium text-gray-400">
            Loading your account...
          </p>
        </div>
      </div>
    )
  }

  // ============================================================
  // MAIN PAGE
  // ============================================================

  return (
    <div className="relative h-screen max-h-screen w-full overflow-hidden bg-[#fafafa]">
      <Toaster
        richColors
        position="top-right"
        closeButton
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
          TECHNOLOGY / LABORATORY DECORATIONS
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Top-left circuit */}

        <div className="absolute left-0 top-[14%] h-px w-[25%] bg-[#800000]/10" />

        <div className="absolute left-[25%] top-[14%] h-24 w-px bg-[#800000]/10" />

        <div className="absolute left-[25%] top-[calc(14%+6rem)] h-px w-24 bg-[#800000]/10" />

        {/* Bottom-right circuit */}

        <div className="absolute bottom-[15%] right-0 h-px w-[25%] bg-[#800000]/10" />

        <div className="absolute bottom-[15%] right-[25%] h-24 w-px bg-[#800000]/10" />

        <div className="absolute bottom-[calc(15%+6rem)] right-[25%] h-px w-24 bg-[#800000]/10" />

        {/* Circuit nodes */}

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
        disabled={loading}
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
          px-4
          py-4
          sm:px-6
        "
      >
        {/* ====================================================
            MAIN CARD
        ==================================================== */}

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
            {/* Panel decorations */}

            <div className="pointer-events-none absolute inset-0">
              {/* Vertical circuit */}

              <div className="absolute left-[20%] top-0 h-full w-px bg-[#FFD700]/10" />

              {/* Horizontal circuits */}

              <div className="absolute left-0 top-[28%] h-px w-full bg-[#FFD700]/10" />

              <div className="absolute bottom-[28%] left-0 h-px w-[70%] bg-[#FFD700]/10" />

              {/* Nodes */}

              <div className="absolute left-[20%] top-[28%] h-2 w-2 rounded-full bg-[#FFD700]" />

              <div className="absolute bottom-[28%] left-[70%] h-2 w-2 rounded-full bg-[#FFD700]" />

              {/* Decorative circles */}

              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-[#FFD700]/10" />

              <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-[#FFD700]/10" />

              {/* Gear */}

              <Settings
                className="absolute -bottom-20 -right-20 h-72 w-72 text-[#FFD700]/10"
                strokeWidth={1}
              />

              {/* CPU */}

              <Cpu
                className="absolute right-10 top-12 h-10 w-10 text-[#FFD700]/20"
                strokeWidth={1.5}
              />

              {/* Circuit board */}

              <CircuitBoard
                className="absolute bottom-28 left-8 h-10 w-10 text-[#FFD700]/20"
                strokeWidth={1.5}
              />

              {/* Flask */}

              <FlaskConical
                className="absolute right-16 top-[42%] h-9 w-9 text-[#FFD700]/15"
                strokeWidth={1.5}
              />

              {/* Wrench */}

              <Wrench
                className="absolute bottom-12 right-[38%] h-8 w-8 text-[#FFD700]/15"
                strokeWidth={1.5}
              />
            </div>

            {/* =================================================
                LOGO
            ================================================= */}

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
                  width={300}
                  height={300}
                  priority
                  className="h-full w-full object-contain"
                />
              </div>
            </div>

            {/* =================================================
                BRANDING
            ================================================= */}

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
                Secure laboratory account management
                for Laboratory-in-Charge personnel,
                equipment, and student borrowing
                activities.
              </p>
            </div>

            {/* =================================================
                SECURITY STATUS
            ================================================= */}

            <div className="relative z-10 flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2">
                <Activity
                  className="h-4 w-4 text-[#FFD700]"
                />

                <span className="text-xs text-white/80">
                  System Secure
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2">
                <ShieldCheck
                  className="h-4 w-4 text-[#FFD700]"
                />

                <span className="text-xs text-white/80">
                  Account Protected
                </span>
              </div>
            </div>
          </section>

          {/* ==================================================
              RIGHT FORM PANEL
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
              {/* =================================================
                  MOBILE BRANDING
              ================================================= */}

              <div className="mb-5 flex items-center gap-3 lg:hidden">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#800000] shadow-sm">
                  <ShieldCheck
                    className="h-5 w-5 text-[#FFD700]"
                  />
                </div>

                <div>
                  <p className="text-sm font-bold text-[#800000]">
                    Lab Borrowing System
                  </p>

                  <p className="text-[10px] text-gray-400">
                    Laboratory Technology
                  </p>
                </div>
              </div>

              {/* =================================================
                  HEADER
              ================================================= */}

              <div className="mb-5">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#800000]/10 bg-[#800000]/5 px-3 py-1.5">
                  <KeyRound
                    className="h-3.5 w-3.5 text-[#800000]"
                  />

                  <span className="text-xs font-semibold uppercase tracking-wider text-[#800000]">
                    Account Security
                  </span>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-[#800000] sm:text-4xl">
                  Change Password
                </h1>

                <p className="mt-1.5 text-sm leading-relaxed text-gray-500 sm:text-base">
                  Create a secure personal password
                  before accessing your laboratory
                  dashboard.
                </p>
              </div>

              {/* =================================================
                  USER INFORMATION
              ================================================= */}

              {user && (
                <div
                  className="
                    mb-4
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50/80
                    px-3.5
                    py-3
                  "
                >
                  {/* Avatar */}

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#800000] text-sm font-bold text-[#FFD700] shadow-sm">
                    {(user.fullName || "L")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  {/* User details */}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3 w-3 shrink-0 text-[#800000]" />

                      <p className="truncate text-xs font-semibold text-gray-800">
                        {user.fullName ||
                          "Laboratory-in-Charge"}
                      </p>
                    </div>

                    {user.email && (
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <Mail className="h-3 w-3 shrink-0 text-gray-400" />

                        <p className="truncate text-[11px] text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Security badge */}

                  <div className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-[#FFD700]/30 bg-[#FFD700]/10 px-2 py-1 sm:flex">
                    <ShieldCheck className="h-3 w-3 text-[#800000]" />

                    <span className="text-[10px] font-semibold text-[#800000]">
                      Secure
                    </span>
                  </div>
                </div>
              )}

              {/* =================================================
                  FORM
              ================================================= */}

              <form
                onSubmit={handleSubmit}
                className="space-y-3.5"
              >
                {/* =================================================
                    NEW PASSWORD
                ================================================= */}

                <div className="space-y-1.5">
                  <label
                    htmlFor="new-password"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                  >
                    <LockKeyhole
                      className="h-3.5 w-3.5 text-[#800000]"
                    />

                    New Password
                  </label>

                  <div className="relative">
                    <Input
                      id="new-password"
                      type={
                        showNewPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Enter your new password"
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(e.target.value)
                      }
                      disabled={loading}
                      autoComplete="new-password"
                      autoFocus
                      className="
                        h-11
                        rounded-xl
                        border-gray-200
                        bg-gray-50/70
                        pl-4
                        pr-12
                        text-base
                        focus:border-[#800000]
                        focus:ring-[#800000]/20
                      "
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowNewPassword(
                          (previous) => !previous
                        )
                      }
                      disabled={loading}
                      tabIndex={-1}
                      aria-label={
                        showNewPassword
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
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* =================================================
                    CONFIRM PASSWORD
                ================================================= */}

                <div className="space-y-1.5">
                  <label
                    htmlFor="confirm-password"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                  >
                    <LockKeyhole
                      className="h-3.5 w-3.5 text-[#800000]"
                    />

                    Confirm New Password
                  </label>

                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Re-enter your new password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      disabled={loading}
                      autoComplete="new-password"
                      className={`
                        h-11
                        rounded-xl
                        bg-gray-50/70
                        pl-4
                        pr-12
                        text-base
                        ${
                          confirmPassword.length > 0 &&
                          !passwordsMatch
                            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                            : confirmPassword.length > 0 &&
                                passwordsMatch
                              ? "border-green-300 focus:border-green-400 focus:ring-green-100"
                              : "border-gray-200 focus:border-[#800000] focus:ring-[#800000]/20"
                        }
                      `}
                      required
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
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Password mismatch */}

                  {confirmPassword.length > 0 &&
                    !passwordsMatch && (
                      <p className="text-[11px] font-medium text-red-500">
                        Passwords do not match.
                      </p>
                    )}
                </div>

                {/* =================================================
                    PASSWORD REQUIREMENTS
                ================================================= */}

                <div
                  className="
                    rounded-xl
                    border
                    border-[#FFD700]/30
                    bg-[#FFD700]/10
                    px-4
                    py-3
                  "
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#FFD700]/25">
                      <ShieldCheck
                        className="h-3.5 w-3.5 text-[#800000]"
                      />
                    </div>

                    <p className="text-xs font-semibold text-[#800000]">
                      Password Requirements
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                    {/* 8 characters */}

                    <div className="flex items-center gap-1.5">
                      <CheckCircle2
                        className={`h-3.5 w-3.5 ${
                          passwordLengthValid
                            ? "text-green-600"
                            : "text-gray-300"
                        }`}
                      />

                      <span
                        className={`text-[10px] ${
                          passwordLengthValid
                            ? "font-medium text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        8+ characters
                      </span>
                    </div>

                    {/* Match */}

                    <div className="flex items-center gap-1.5">
                      <CheckCircle2
                        className={`h-3.5 w-3.5 ${
                          passwordsMatch
                            ? "text-green-600"
                            : "text-gray-300"
                        }`}
                      />

                      <span
                        className={`text-[10px] ${
                          passwordsMatch
                            ? "font-medium text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        Passwords match
                      </span>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    SUBMIT BUTTON
                ================================================= */}

                <Button
                  type="submit"
                  disabled={
                    loading ||
                    !passwordLengthValid ||
                    !passwordsMatch
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
                    hover:shadow-xl
                    hover:shadow-[#800000]/20
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#FFD700]/30 border-t-[#FFD700]" />

                      Updating Password...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Secure My Account

                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>

              {/* =================================================
                  SECURITY NOTE
              ================================================= */}

              <div className="mt-3 flex items-center justify-center gap-2">
                <ShieldCheck className="h-3 w-3 text-[#800000]/60" />

                <p className="text-center text-[10px] text-gray-400">
                  Your new password will be used for
                  future laboratory account logins.
                </p>
              </div>

              {/* =================================================
                  FOOTER
              ================================================= */}

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