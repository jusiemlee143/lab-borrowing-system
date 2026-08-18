"use client"

import { useState, useEffect, type FormEvent } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Eye,
  EyeOff,
  ShieldCheck,
  LockKeyhole,
  Mail,
  Cpu,
  Activity,
  ArrowLeft,
  KeyRound,
  Send,
} from "lucide-react"
import { Toaster, toast } from "sonner"

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // ============================================================
  // LOGIN STATE
  // ============================================================

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // ============================================================
  // FORGOT PASSWORD STATE
  // ============================================================

  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotLoading, setForgotLoading] = useState(false)

  // ============================================================
  // SHOW NOTIFICATION FROM PROXY
  // ============================================================

  useEffect(() => {
    if (!searchParams) return

    const error = searchParams.get("error")
    const from = searchParams.get("from")

    if (error === "login-required") {
      let page = "this page"

      if (from?.includes("admin")) {
        page = "Admin Dashboard"
      }

      if (from?.includes("lab-in-charge")) {
        page = "Lab-In-Charge Dashboard"
      }

      toast.error(`You must login first to access the ${page}`)
    }

    if (error === "session-expired") {
      toast.error("Session expired. Please login again")
    }
  }, [searchParams])

  // ============================================================
  // LOGIN
  // ============================================================

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter your email and password.")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(`Welcome, ${data.role.toUpperCase()}!`)

        if (data.role === "admin") {
          router.push("/admin/dashboard")
        } else if (data.role === "lic") {
          router.push("/lab-in-charge/dashboard")
        } else {
          toast.error("Unknown account role.")
          setLoading(false)
        }
      } else {
        toast.error(data.message || "Invalid credentials")
        setLoading(false)
      }
    } catch (err) {
      console.error("Login error:", err)
      toast.error("Unable to connect to the server.")
      setLoading(false)
    }
  }

  // ============================================================
  // FORGOT PASSWORD
  // ============================================================

  const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!forgotEmail.trim()) {
      toast.error("Please enter your admin email address.")
      return
    }

    setForgotLoading(true)

    try {
      const res = await fetch("/api/auth/admin-forgot-pass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: forgotEmail.trim(),
        }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(
          "If an admin account exists with that email, a password reset link has been sent."
        )
      } else {
        toast.error(
          data.message || "Unable to process your request."
        )
      }
    } catch (err) {
      console.error("Forgot password error:", err)

      toast.error(
        "Unable to connect to the server. Please try again."
      )
    } finally {
      setForgotLoading(false)
    }
  }

  // ============================================================
  // SWITCH TO FORGOT PASSWORD
  // ============================================================

  const openForgotPassword = () => {
    setForgotEmail(email)
    setPassword("")
    setShowForgotPassword(true)
  }

  // ============================================================
  // BACK TO LOGIN
  // ============================================================

  const backToLogin = () => {
    setShowForgotPassword(false)
    setForgotEmail("")
  }

  // ============================================================
  // PAGE
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
      {/* TECHNOLOGY BACKGROUND */}
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

      {/* Decorative glow */}

      <div className="fixed -top-32 -left-32 w-80 h-80 rounded-full bg-[#800000]/5 blur-3xl pointer-events-none" />

      <div className="fixed -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#FFD700]/10 blur-3xl pointer-events-none" />

      {/* ====================================================== */}
      {/* HEADER ACCENT */}
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
          {/* AUTH CARD */}
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

            {/* ================================================= */}
            {/* CARD TOP ACCENT */}
            {/* ================================================= */}

            <div className="h-1 bg-gradient-to-r from-[#800000] via-[#FFD700] to-[#800000]" />

            <div className="p-6 sm:p-8">

              {/* =============================================== */}
              {/* LOGO */}
              {/* =============================================== */}

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

              {/* =============================================== */}
              {/* SYSTEM LABEL */}
              {/* =============================================== */}

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
              {/* LOGIN MODE */}
              {/* ================================================= */}

              {!showForgotPassword ? (
                <>
                  {/* ============================================= */}
                  {/* TITLE */}
                  {/* ============================================= */}

                  <div className="text-center mb-7">

                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#800000]">
                      Admin Login
                    </h1>

                    <p className="mt-2 text-sm leading-relaxed text-gray-500">
                      Sign in to manage the laboratory borrowing system.
                    </p>

                  </div>

                  {/* ============================================= */}
                  {/* LOGIN FORM */}
                  {/* ============================================= */}

                  <form
                    onSubmit={handleLogin}
                    className="space-y-5"
                  >

                    {/* EMAIL */}

                    <div className="space-y-2">

                      <label
                        htmlFor="email"
                        className="
                          flex
                          items-center
                          gap-2
                          text-sm
                          font-semibold
                          text-gray-700
                        "
                      >
                        <Mail className="w-4 h-4 text-[#800000]" />
                        Email Address
                      </label>

                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        className="
                          h-11
                          w-full
                          rounded-xl
                          border-gray-200
                          bg-[#fafafa]
                          pl-4
                          pr-4
                          text-sm
                          transition-all
                          focus:border-[#800000]/40
                          focus:ring-2
                          focus:ring-[#800000]/10
                          focus:bg-white
                        "
                      />

                    </div>

                    {/* PASSWORD */}

                    <div className="space-y-2">

                      <div className="flex items-center justify-between">

                        <label
                          htmlFor="password"
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
                          Password
                        </label>

                        {/* FORGOT PASSWORD */}

                        <button
                          type="button"
                          onClick={openForgotPassword}
                          disabled={loading}
                          className="
                            text-xs
                            font-semibold
                            text-[#800000]
                            hover:text-[#660000]
                            hover:underline
                            transition-colors
                            disabled:opacity-50
                          "
                        >
                          Forgot Password?
                        </button>

                      </div>

                      <div className="relative">

                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
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
                            showPassword
                              ? "Hide password"
                              : "Show password"
                          }
                          onClick={() =>
                            setShowPassword((prev) => !prev)
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
                            transition-colors
                            hover:bg-[#800000]/5
                            hover:text-[#800000]
                            disabled:pointer-events-none
                          "
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>

                      </div>

                    </div>

                    {/* LOGIN BUTTON */}

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

                          Signing in...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          Sign In
                        </>
                      )}

                    </Button>

                  </form>

                  {/* SECURITY INFO */}

                  <div className="mt-6 pt-5 border-t border-gray-100">

                    <div className="flex items-center justify-center gap-2">

                      <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
                        <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                      </div>

                      <div className="text-left">

                        <p className="text-[11px] font-semibold text-gray-600">
                          Secure Access
                        </p>

                        <p className="text-[10px] text-gray-400">
                          Authorized laboratory personnel only
                        </p>

                      </div>

                    </div>

                  </div>
                </>
              ) : (
                /* ================================================= */
                /* FORGOT PASSWORD MODE */
                /* ================================================= */

                <>
                  {/* ============================================= */}
                  {/* TITLE */}
                  {/* ============================================= */}

                  <div className="text-center mb-7">

                    <div className="flex justify-center mb-4">

                      <div className="w-12 h-12 rounded-2xl bg-[#800000]/5 border border-[#800000]/10 flex items-center justify-center">
                        <KeyRound className="w-6 h-6 text-[#800000]" />
                      </div>

                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#800000]">
                      Forgot Password?
                    </h1>

                    <p className="mt-2 text-sm leading-relaxed text-gray-500">
                      Enter your admin email address and we'll send you a secure password reset link.
                    </p>

                  </div>

                  {/* ============================================= */}
                  {/* FORGOT PASSWORD FORM */}
                  {/* ============================================= */}

                  <form
                    onSubmit={handleForgotPassword}
                    className="space-y-5"
                  >

                    <div className="space-y-2">

                      <label
                        htmlFor="forgotEmail"
                        className="
                          flex
                          items-center
                          gap-2
                          text-sm
                          font-semibold
                          text-gray-700
                        "
                      >
                        <Mail className="w-4 h-4 text-[#800000]" />
                        Admin Email Address
                      </label>

                      <Input
                        id="forgotEmail"
                        name="forgotEmail"
                        type="email"
                        autoComplete="email"
                        placeholder="admin@example.com"
                        value={forgotEmail}
                        onChange={(e) =>
                          setForgotEmail(e.target.value)
                        }
                        disabled={forgotLoading}
                        autoFocus
                        className="
                          h-11
                          w-full
                          rounded-xl
                          border-gray-200
                          bg-[#fafafa]
                          pl-4
                          pr-4
                          text-sm
                          transition-all
                          focus:border-[#800000]/40
                          focus:ring-2
                          focus:ring-[#800000]/10
                          focus:bg-white
                        "
                      />

                    </div>

                    {/* SEND RESET LINK */}

                    <Button
                      type="submit"
                      disabled={forgotLoading}
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

                      {forgotLoading ? (
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

                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Reset Link
                        </>
                      )}

                    </Button>

                  </form>

                  {/* ============================================= */}
                  {/* BACK TO LOGIN */}
                  {/* ============================================= */}

                  <div className="mt-6 text-center">

                    <button
                      type="button"
                      onClick={backToLogin}
                      disabled={forgotLoading}
                      className="
                        inline-flex
                        items-center
                        gap-2
                        text-sm
                        font-semibold
                        text-gray-500
                        hover:text-[#800000]
                        transition-colors
                        disabled:opacity-50
                      "
                    >

                      <ArrowLeft className="w-4 h-4" />

                      Back to Admin Login

                    </button>

                  </div>

                  {/* SECURITY INFO */}

                  <div className="mt-6 pt-5 border-t border-gray-100">

                    <div className="text-center">

                      <p className="text-[10px] text-gray-400 leading-relaxed">
                        For security purposes, reset instructions
                        will only be sent to a registered admin email.
                      </p>

                    </div>

                  </div>
                </>
              )}

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