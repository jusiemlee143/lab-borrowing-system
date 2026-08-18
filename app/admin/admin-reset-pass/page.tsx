"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Eye,
  EyeOff,
  ShieldCheck,
  LockKeyhole,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Activity,
  Cpu,
} from "lucide-react"
import { Toaster, toast } from "sonner"

export default function AdminResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // ============================================================
  // GET RESET TOKEN FROM URL
  // ============================================================

  const token = searchParams?.get("token") ?? null

  // ============================================================
  // FORM STATE
  // ============================================================

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // ============================================================
  // RESET PASSWORD
  // ============================================================

  const handleResetPassword = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    // ==========================================================
    // CHECK TOKEN
    // ==========================================================

    if (!token) {
      toast.error(
        "This password reset link is invalid or missing."
      )
      return
    }

    // ==========================================================
    // CHECK PASSWORD FIELDS
    // ==========================================================

    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast.error(
        "Please enter and confirm your new password."
      )
      return
    }

    // ==========================================================
    // PASSWORD LENGTH
    // ==========================================================

    if (newPassword.length < 8) {
      toast.error(
        "Password must be at least 8 characters long."
      )
      return
    }

    // ==========================================================
    // PASSWORD MATCH
    // ==========================================================

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.")
      return
    }

    // ==========================================================
    // START LOADING
    // ==========================================================

    setLoading(true)

    try {
      // ========================================================
      // SEND RESET REQUEST
      //
      // IMPORTANT:
      //
      // The API expects:
      //
      // {
      //   token,
      //   password
      // }
      //
      // NOT:
      //
      // {
      //   token,
      //   newPassword
      // }
      // ========================================================

      const res = await fetch(
        "/api/auth/admin-reset-pass",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            token,
            password: newPassword,
          }),
        }
      )

      const data = await res.json()

      // ========================================================
      // HANDLE ERROR
      // ========================================================

      if (!res.ok) {
        toast.error(
          data.message ||
            "Unable to reset your password."
        )

        return
      }

      // ========================================================
      // SUCCESS
      // ========================================================

      setSuccess(true)

      setNewPassword("")
      setConfirmPassword("")

      toast.success(
        "Your password has been successfully reset."
      )
    } catch (error) {
      console.error(
        "Reset password error:",
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
  // INVALID / MISSING TOKEN SCREEN
  // ============================================================

  if (!token) {
    return (
      <div className="h-screen w-full overflow-hidden bg-[#fafafa] text-gray-800">

        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            className: "rounded-xl",
          }}
        />

        {/* BACKGROUND */}

        <div
          className="fixed inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(#800000 1px, transparent 1px),
              linear-gradient(90deg, #800000 1px, transparent 1px)
            `,
            backgroundSize: "36px 36px",
          }}
        />

        <div className="fixed -top-32 -left-32 w-80 h-80 rounded-full bg-[#800000]/5 blur-3xl pointer-events-none" />

        <div className="fixed -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#FFD700]/10 blur-3xl pointer-events-none" />

        {/* HEADER */}

        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-[3px] bg-gradient-to-r from-[#800000] via-[#FFD700] to-[#800000]" />
        </div>

        {/* CENTER */}

        <main className="relative z-10 h-full flex items-center justify-center px-4 py-4">

          <div className="w-full max-w-[430px]">

            <div className="relative overflow-hidden bg-white border border-gray-200 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)]">

              <div className="h-1 bg-gradient-to-r from-[#800000] via-[#FFD700] to-[#800000]" />

              <div className="p-6 sm:p-8">

                {/* ICON */}

                <div className="flex justify-center mb-5">

                  <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">

                    <AlertCircle className="w-8 h-8 text-red-600" />

                  </div>

                </div>

                {/* TEXT */}

                <div className="text-center">

                  <h1 className="text-2xl font-bold text-[#800000]">
                    Invalid Reset Link
                  </h1>

                  <p className="mt-3 text-sm leading-relaxed text-gray-500">
                    This password reset link is missing or invalid.
                    Please request a new password reset link.
                  </p>

                </div>

                {/* BUTTON */}

                <Button
                  type="button"
                  onClick={() => router.push("/admin")}
                  className="
                    mt-6
                    w-full
                    h-11
                    rounded-xl
                    bg-[#800000]
                    text-[#FFD700]
                    font-semibold
                    hover:bg-[#660000]
                  "
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Admin Login
                </Button>

              </div>

            </div>

          </div>

        </main>

      </div>
    )
  }

  // ============================================================
  // SUCCESS SCREEN
  // ============================================================

  if (success) {
    return (
      <div className="h-screen w-full overflow-hidden bg-[#fafafa] text-gray-800">

        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            className: "rounded-xl",
          }}
        />

        {/* BACKGROUND */}

        <div
          className="fixed inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(#800000 1px, transparent 1px),
              linear-gradient(90deg, #800000 1px, transparent 1px)
            `,
            backgroundSize: "36px 36px",
          }}
        />

        <div className="fixed -top-32 -left-32 w-80 h-80 rounded-full bg-[#800000]/5 blur-3xl pointer-events-none" />

        <div className="fixed -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#FFD700]/10 blur-3xl pointer-events-none" />

        {/* HEADER */}

        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-[3px] bg-gradient-to-r from-[#800000] via-[#FFD700] to-[#800000]" />
        </div>

        {/* CENTER */}

        <main className="relative z-10 h-full flex items-center justify-center px-4 py-4">

          <div className="w-full max-w-[430px]">

            <div className="relative overflow-hidden bg-white border border-gray-200 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)]">

              <div className="h-1 bg-gradient-to-r from-[#800000] via-[#FFD700] to-[#800000]" />

              <div className="p-6 sm:p-8">

                {/* SUCCESS ICON */}

                <div className="flex justify-center mb-5">

                  <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center">

                    <CheckCircle2 className="w-8 h-8 text-green-600" />

                  </div>

                </div>

                {/* TEXT */}

                <div className="text-center">

                  <h1 className="text-2xl font-bold text-[#800000]">
                    Password Reset Successful
                  </h1>

                  <p className="mt-3 text-sm leading-relaxed text-gray-500">
                    Your administrator password has been
                    successfully changed.
                  </p>

                </div>

                {/* LOGIN BUTTON */}

                <Button
                  type="button"
                  onClick={() => router.push("/admin")}
                  className="
                    mt-6
                    w-full
                    h-11
                    rounded-xl
                    bg-[#800000]
                    text-[#FFD700]
                    font-semibold
                    hover:bg-[#660000]
                  "
                >
                  <ShieldCheck className="w-4 h-4" />
                  Go to Admin Login
                </Button>

              </div>

            </div>

          </div>

        </main>

      </div>
    )
  }

  // ============================================================
  // RESET PASSWORD FORM
  // ============================================================

  return (
    <div className="h-screen w-full overflow-hidden bg-[#fafafa] text-gray-800">

      <Toaster
        richColors
        position="top-right"
        toastOptions={{
          className: "rounded-xl",
        }}
      />

      {/* ====================================================== */}
      {/* BACKGROUND */}
      {/* ====================================================== */}

      <div
        className="fixed inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(#800000 1px, transparent 1px),
            linear-gradient(90deg, #800000 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
        }}
      />

      <div className="fixed -top-32 -left-32 w-80 h-80 rounded-full bg-[#800000]/5 blur-3xl pointer-events-none" />

      <div className="fixed -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#FFD700]/10 blur-3xl pointer-events-none" />

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-[3px] bg-gradient-to-r from-[#800000] via-[#FFD700] to-[#800000]" />
      </div>

      {/* ====================================================== */}
      {/* CENTER */}
      {/* ====================================================== */}

      <main className="relative z-10 h-full flex items-center justify-center px-4 py-4 sm:px-6">

        <div className="w-full max-w-[430px]">

          {/* ================================================== */}
          {/* CARD */}
          {/* ================================================== */}

          <div
            className="
              relative
              overflow-hidden
              bg-white
              border
              border-gray-200
              rounded-3xl
              shadow-[0_20px_60px_rgba(0,0,0,0.08)]
            "
          >

            {/* TOP ACCENT */}

            <div className="h-1 bg-gradient-to-r from-[#800000] via-[#FFD700] to-[#800000]" />

            <div className="p-6 sm:p-8">

              {/* ================================================= */}
              {/* LOGO */}
              {/* ================================================= */}

              <div className="flex justify-center mb-5">

                <div
                  className="
                    relative
                    w-[88px]
                    h-[88px]
                    rounded-2xl
                    bg-white
                    border
                    border-[#FFD700]/60
                    shadow-sm
                    flex
                    items-center
                    justify-center
                    overflow-hidden
                  "
                >

                  <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                      backgroundImage: `
                        linear-gradient(#800000 1px, transparent 1px),
                        linear-gradient(90deg, #800000 1px, transparent 1px)
                      `,
                      backgroundSize: "12px 12px",
                    }}
                  />

                  <img
                    src="/logo/OfficialLogo.png"
                    alt="Laboratory Borrowing System Logo"
                    className="
                      relative
                      z-10
                      w-[68px]
                      h-[68px]
                      object-contain
                    "
                  />

                </div>

              </div>

              {/* ================================================= */}
              {/* SYSTEM LABEL */}
              {/* ================================================= */}

              <div className="flex justify-center mb-3">

                <div
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    px-3
                    py-1.5
                    rounded-full
                    bg-[#800000]/5
                    border
                    border-[#800000]/10
                  "
                >

                  <Activity className="w-3 h-3 text-[#800000]" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#800000]">
                    Laboratory System
                  </span>

                </div>

              </div>

              {/* ================================================= */}
              {/* TITLE */}
              {/* ================================================= */}

              <div className="text-center mb-7">

                <div className="flex justify-center mb-4">

                  <div className="w-12 h-12 rounded-2xl bg-[#800000]/5 border border-[#800000]/10 flex items-center justify-center">

                    <KeyRound className="w-6 h-6 text-[#800000]" />

                  </div>

                </div>

                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#800000]">
                  Reset Password
                </h1>

                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  Create a new password for your administrator account.
                </p>

              </div>

              {/* ================================================= */}
              {/* FORM */}
              {/* ================================================= */}

              <form
                onSubmit={handleResetPassword}
                className="space-y-5"
              >

                {/* ================================================= */}
                {/* NEW PASSWORD */}
                {/* ================================================= */}

                <div className="space-y-2">

                  <label
                    htmlFor="newPassword"
                    className="
                      flex
                      items-center
                      gap-2
                      text-sm
                      font-semibold
                      text-gray-700
                    "
                  >

                    <LockKeyhole className="w-4 h-4 text-[#800000]" />

                    New Password

                  </label>

                  <div className="relative">

                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={
                        showNewPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="new-password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(e.target.value)
                      }
                      disabled={loading}
                      className="
                        h-11
                        w-full
                        rounded-xl
                        border-gray-200
                        bg-[#fafafa]
                        pl-4
                        pr-12
                        text-sm
                        transition-all
                        focus:border-[#800000]/40
                        focus:ring-2
                        focus:ring-[#800000]/10
                        focus:bg-white
                      "
                    />

                    <button
                      type="button"
                      aria-label={
                        showNewPassword
                          ? "Hide new password"
                          : "Show new password"
                      }
                      onClick={() =>
                        setShowNewPassword(
                          (prev) => !prev
                        )
                      }
                      disabled={loading}
                      className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        text-gray-400
                        hover:bg-[#800000]/5
                        hover:text-[#800000]
                      "
                    >

                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}

                    </button>

                  </div>

                  <p className="text-[11px] text-gray-400">
                    Password must be at least 8 characters.
                  </p>

                </div>

                {/* ================================================= */}
                {/* CONFIRM PASSWORD */}
                {/* ================================================= */}

                <div className="space-y-2">

                  <label
                    htmlFor="confirmPassword"
                    className="
                      flex
                      items-center
                      gap-2
                      text-sm
                      font-semibold
                      text-gray-700
                    "
                  >

                    <LockKeyhole className="w-4 h-4 text-[#800000]" />

                    Confirm New Password

                  </label>

                  <div className="relative">

                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="new-password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      disabled={loading}
                      className="
                        h-11
                        w-full
                        rounded-xl
                        border-gray-200
                        bg-[#fafafa]
                        pl-4
                        pr-12
                        text-sm
                        transition-all
                        focus:border-[#800000]/40
                        focus:ring-2
                        focus:ring-[#800000]/10
                        focus:bg-white
                      "
                    />

                    <button
                      type="button"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      onClick={() =>
                        setShowConfirmPassword(
                          (prev) => !prev
                        )
                      }
                      disabled={loading}
                      className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        text-gray-400
                        hover:bg-[#800000]/5
                        hover:text-[#800000]
                      "
                    >

                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}

                    </button>

                  </div>

                </div>

                {/* ================================================= */}
                {/* RESET BUTTON */}
                {/* ================================================= */}

                <Button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full
                    h-11
                    rounded-xl
                    bg-[#800000]
                    text-[#FFD700]
                    font-semibold
                    shadow-sm
                    transition-all
                    hover:bg-[#660000]
                    hover:shadow-md
                    active:scale-[0.99]
                    disabled:opacity-60
                  "
                >

                  {loading ? (
                    <>

                      <span
                        className="
                          w-4
                          h-4
                          rounded-full
                          border-2
                          border-[#FFD700]/30
                          border-t-[#FFD700]
                          animate-spin
                        "
                      />

                      Resetting Password...

                    </>
                  ) : (
                    <>

                      <ShieldCheck className="w-4 h-4" />

                      Reset Password

                    </>
                  )}

                </Button>

              </form>

              {/* ================================================= */}
              {/* SECURITY INFO */}
              {/* ================================================= */}

              <div className="mt-6 pt-5 border-t border-gray-100">

                <div className="flex items-center justify-center gap-2">

                  <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">

                    <ShieldCheck className="w-3.5 h-3.5 text-green-600" />

                  </div>

                  <div className="text-left">

                    <p className="text-[11px] font-semibold text-gray-600">
                      Secure Password Reset
                    </p>

                    <p className="text-[10px] text-gray-400">
                      This reset link can only be used once.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ================================================== */}
          {/* FOOTER */}
          {/* ================================================== */}

          <div className="mt-4 flex items-center justify-center gap-2">

            <Cpu className="w-3.5 h-3.5 text-[#800000]/40" />

            <p className="text-[10px] sm:text-xs text-gray-400 text-center">
              Laboratory Borrowing Management System
            </p>

          </div>

        </div>

      </main>

    </div>
  )
}