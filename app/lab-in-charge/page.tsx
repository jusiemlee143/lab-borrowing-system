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
  KeyRound,
  Lock,
  LogOut,
  Settings,
  ShieldCheck,
  UserRound,
  Wrench,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Toaster, toast } from "sonner"

// ============================================================
// MAIN LOGIN PAGE
// ============================================================

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // ==========================================================
  // FORM STATE
  // ==========================================================

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // ==========================================================
  // REDIRECT NOTIFICATIONS
  // ==========================================================

  useEffect(() => {
    const error = searchParams?.get("error")
    const from = searchParams?.get("from")

    if (error === "login-required") {
      let page = "this page"

      if (from?.includes("admin")) {
        page = "Admin Dashboard"
      }

      if (from?.includes("lab-in-charge")) {
        page = "Lab-In-Charge Dashboard"
      }

      toast.error(
        `You must login first before accessing the ${page}.`
      )
    }

    if (error === "session-expired") {
      toast.error(
        "Your session expired. Please login again."
      )
    }
  }, [searchParams])

  // ==========================================================
  // EXIT
  // ==========================================================

  const handleExit = () => {
    router.push("/")
  }

  // ==========================================================
  // LOGIN
  // ==========================================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    if (loading) return

    const cleanEmail = email.trim()
    const cleanPassword = password.trim()

    if (!cleanEmail || !cleanPassword) {
      toast.error("Please enter your email and password.")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/lic-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPassword,
        }),
      })

      const data = await res.json()

      console.log("LOGIN RESPONSE:", data)

      if (!res.ok) {
        toast.error(
          data?.message || "Invalid email or password."
        )

        return
      }

      // ======================================================
      // SAVE LIC SESSION
      // ======================================================

      localStorage.setItem(
        "licUser",
        JSON.stringify({
          userId: data.userId,
          fullName: data.fullName,
          email: data.email,
          mustChangePassword: data.mustChangePassword,
          role: data.role,
        })
      )

      toast.success(
        `Welcome, ${data.fullName || "Lab-In-Charge"}!`
      )

      // ======================================================
      // REDIRECT
      // ======================================================

      if (data.mustChangePassword) {
        router.push("/lab-in-charge/change-password")
      } else {
        router.push("/lab-in-charge/dashboard")
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error)

      toast.error(
        "Unable to connect to the server. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div className="relative h-screen overflow-hidden bg-[#fafafa]">
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
          BACKGROUND DECORATIONS
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Top circuit */}

        <div className="absolute left-0 top-[15%] h-px w-[24%] bg-[#800000]/10" />

        <div className="absolute left-[24%] top-[15%] h-20 w-px bg-[#800000]/10" />

        <div className="absolute left-[24%] top-[calc(15%+5rem)] h-px w-20 bg-[#800000]/10" />

        {/* Bottom circuit */}

        <div className="absolute bottom-[16%] right-0 h-px w-[24%] bg-[#800000]/10" />

        <div className="absolute bottom-[16%] right-[24%] h-20 w-px bg-[#800000]/10" />

        <div className="absolute bottom-[calc(16%+5rem)] right-[24%] h-px w-20 bg-[#800000]/10" />

        {/* Nodes */}

        <div className="absolute left-[23.5%] top-[14.4%] h-2 w-2 rounded-full bg-[#FFD700]" />

        <div className="absolute bottom-[15.4%] right-[23.5%] h-2 w-2 rounded-full bg-[#FFD700]" />

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
          className="absolute right-[9%] top-[23%] h-10 w-10 text-[#800000]/[0.06]"
          strokeWidth={1.5}
        />

        <CircuitBoard
          className="absolute bottom-[21%] left-[8%] h-10 w-10 text-[#800000]/[0.06]"
          strokeWidth={1.5}
        />

        <FlaskConical
          className="absolute left-[14%] top-[29%] h-8 w-8 text-[#800000]/[0.05]"
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
        className="
          fixed
          right-5
          top-5
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
        <span>Exit</span>
      </Button>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="relative z-10 flex h-screen items-center justify-center p-4 sm:p-6">
        <div
          className="
            grid
            h-auto
            max-h-[calc(100vh-2rem)]
            w-full
            max-w-5xl
            overflow-hidden
            rounded-[2rem]
            border
            border-gray-200
            bg-white
            shadow-[0_25px_80px_rgba(80,0,0,0.14)]
            lg:grid-cols-[0.9fr_1.1fr]
          "
        >
          {/* ==================================================
              LEFT BRAND PANEL
          ================================================== */}

          <section
            className="
              relative
              hidden
              overflow-hidden
              bg-[#800000]
              p-10
              text-white
              lg:flex
              lg:flex-col
              lg:justify-between
            "
          >
            {/* Decorative elements */}

            <div className="pointer-events-none absolute inset-0">
              {/* Circuit */}

              <div className="absolute left-[20%] top-0 h-full w-px bg-[#FFD700]/10" />

              <div className="absolute left-0 top-[27%] h-px w-full bg-[#FFD700]/10" />

              <div className="absolute bottom-[27%] left-0 h-px w-[70%] bg-[#FFD700]/10" />

              <div className="absolute left-[20%] top-[27%] h-2 w-2 rounded-full bg-[#FFD700]" />

              <div className="absolute bottom-[27%] left-[70%] h-2 w-2 rounded-full bg-[#FFD700]" />

              {/* Circles */}

              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-[#FFD700]/10" />

              <div className="absolute -right-14 -top-14 h-52 w-52 rounded-full border border-[#FFD700]/10" />

              {/* Gear */}

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

            {/* ==================================================
                LOGO
            ================================================== */}

            <div className="relative z-10">
              <div
                className="
                  flex
                  h-56
                  w-full
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-3xl
                  border
                  border-[#FFD700]/30
                  bg-white
                  shadow-[0_15px_45px_rgba(0,0,0,0.22)]
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

            {/* ==================================================
                BRANDING
            ================================================== */}

            <div className="relative z-10 mt-7">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-px w-8 bg-[#FFD700]" />

                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFD700]">
                  Laboratory Management
                </span>
              </div>

              <h2 className="text-3xl font-bold leading-tight">
                Lab Borrowing
                <br />
                <span className="text-[#FFD700]">
                  System
                </span>
              </h2>

              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
                Manage laboratory equipment, student requests,
                inventory, and borrowing activities from one
                centralized platform.
              </p>
            </div>

            {/* ==================================================
                STATUS
            ================================================== */}

            <div className="relative z-10 mt-7 flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2">
                <Activity className="h-4 w-4 text-[#FFD700]" />

                <span className="text-xs text-white/80">
                  System Ready
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2">
                <ShieldCheck className="h-4 w-4 text-[#FFD700]" />

                <span className="text-xs text-white/80">
                  Secure Access
                </span>
              </div>
            </div>
          </section>

          {/* ==================================================
              RIGHT LOGIN PANEL
          ================================================== */}

          <section className="flex min-h-0 flex-col justify-center p-6 sm:p-10 lg:p-12">
            <div className="mx-auto w-full max-w-md">
              {/* ==================================================
                  MOBILE LOGO
              ================================================== */}

              <div className="mb-5 lg:hidden">
                <div className="mx-auto flex h-20 w-28 items-center justify-center rounded-2xl bg-[#800000] p-2.5 shadow-lg">
                  <div className="flex h-full w-full items-center justify-center rounded-xl bg-white p-2">
                    <Image
                      src="/logo/OfficialLogo.png"
                      alt="Lab Borrowing System Logo"
                      width={150}
                      height={100}
                      priority
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* ==================================================
                  HEADING
              ================================================== */}

              <div className="mb-7">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#800000]/10 bg-[#800000]/5 px-3 py-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#800000]" />

                  <span className="text-xs font-semibold uppercase tracking-wider text-[#800000]">
                    Authorized Access
                  </span>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-[#800000] sm:text-4xl">
                  Lab-In-Charge
                </h1>

                <p className="mt-2 text-sm text-gray-500 sm:text-base">
                  Sign in to manage your laboratory equipment
                  and borrowing requests.
                </p>
              </div>

              {/* ==================================================
                  LOGIN CARD
              ================================================== */}

              <div
                className="
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  p-5
                  shadow-sm
                  sm:p-7
                "
              >
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* ==================================================
                      EMAIL
                  ================================================== */}

                  <div className="space-y-2">
                    <label
                      htmlFor="lic-email"
                      className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        font-semibold
                        text-gray-700
                      "
                    >
                      <UserRound
                        className="h-4 w-4 text-[#800000]"
                      />

                      Email Address
                    </label>

                    <Input
                      id="lic-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      disabled={loading}
                      autoComplete="username"
                      autoFocus
                      className="
                        h-12
                        rounded-xl
                        border-gray-200
                        bg-gray-50/70
                        px-4
                        text-base
                        focus:border-[#800000]
                        focus:ring-[#800000]/20
                      "
                    />
                  </div>

                  {/* ==================================================
                      PASSWORD
                  ================================================== */}

                  <div className="space-y-2">
                    <label
                      htmlFor="lic-password"
                      className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        font-semibold
                        text-gray-700
                      "
                    >
                      <Lock
                        className="h-4 w-4 text-[#800000]"
                      />

                      Password
                    </label>

                    <div className="relative">
                      <Input
                        id="lic-password"
                        name="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                        disabled={loading}
                        autoComplete="current-password"
                        className="
                          h-12
                          rounded-xl
                          border-gray-200
                          bg-gray-50/70
                          px-4
                          pr-12
                          text-base
                          focus:border-[#800000]
                          focus:ring-[#800000]/20
                        "
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
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* ==================================================
                      SECURITY NOTE
                  ================================================== */}

                  <div
                    className="
                      flex
                      items-start
                      gap-3
                      rounded-xl
                      border
                      border-[#800000]/10
                      bg-[#800000]/[0.035]
                      px-4
                      py-3
                    "
                  >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#800000]/10">
                      <KeyRound className="h-4 w-4 text-[#800000]" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-[#800000]">
                        Authorized personnel only
                      </p>

                      <p className="mt-0.5 text-[11px] leading-relaxed text-gray-500">
                        Use the credentials provided by the
                        laboratory administrator.
                      </p>
                    </div>
                  </div>

                  {/* ==================================================
                      LOGIN BUTTON
                  ================================================== */}

                  <Button
                    type="submit"
                    disabled={
                      loading ||
                      !email.trim() ||
                      !password
                    }
                    className="
                      h-12
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
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span
                          className="
                            h-5
                            w-5
                            animate-spin
                            rounded-full
                            border-2
                            border-[#FFD700]/30
                            border-t-[#FFD700]
                          "
                        />

                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Sign In

                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </form>
              </div>

              {/* ==================================================
                  FOOTER
              ================================================== */}

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                <span>
                  Laboratory Management System
                </span>
              </div>

              <p className="mt-2 text-center text-[11px] text-gray-400">
                Secure access for authorized laboratory
                personnel
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}