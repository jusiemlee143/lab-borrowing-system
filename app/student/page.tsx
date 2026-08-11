"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Search,
  LogOut,
  FileText,
  Lock,
  User,
  Eye,
  EyeOff,
  FlaskConical,
  Cpu,
  Settings,
  CircuitBoard,
  ArrowRight,
  Activity,
  Wrench,
  Package,
  Layers3,
  RefreshCw,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"

// ============================================================
// DEFAULT STUDENT CREDENTIALS
// ============================================================

const DEFAULT_CREDENTIALS = {
  studentId: "student001",
  password: "password123",
}

// ============================================================
// TYPES
// ============================================================

type Tool = {
  id: string
  name: string
  quantity: number
  status: "available" | "unavailable"
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function StudentPage() {
  const router = useRouter()

  // ============================================================
  // INVENTORY
  // ============================================================

  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [tools, setTools] = useState<Tool[]>([])

  // ============================================================
  // AUTHENTICATION
  // ============================================================

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginId, setLoginId] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // ============================================================
  // CHECK SESSION
  // ============================================================

  useEffect(() => {
    const session = sessionStorage.getItem("studentSession")

    if (session) {
      try {
        const parsed = JSON.parse(session)

        if (parsed.loggedIn) {
          setIsLoggedIn(true)
        }
      } catch {
        sessionStorage.removeItem("studentSession")
      }
    }
  }, [])

  // ============================================================
  // FETCH TOOLS
  // ============================================================

  useEffect(() => {
    if (isLoggedIn) {
      fetchTools()
    } else {
      setLoading(false)
    }
  }, [isLoggedIn])

  const fetchTools = async () => {
    try {
      setLoading(true)

      const res = await fetch("/api/lab-in-charge/tools")

      if (!res.ok) {
        throw new Error("Failed to fetch tools")
      }

      const data = await res.json()

      const normalizedTools: Tool[] = Array.isArray(data)
        ? data.map((t: any) => ({
            id: t._id || t.id,
            name: t.name,
            quantity: Number(t.quantity) || 0,
            status:
              Number(t.quantity) === 0
                ? "unavailable"
                : "available",
          }))
        : []

      setTools(normalizedTools)
    } catch (err) {
      console.error("Failed to fetch tools:", err)
      setTools([])
    } finally {
      setLoading(false)
    }
  }

  // ============================================================
  // LOGIN
  // ============================================================

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoginError("")
    setIsLoggingIn(true)

    await new Promise((resolve) => setTimeout(resolve, 800))

    if (
      loginId.trim() === DEFAULT_CREDENTIALS.studentId &&
      loginPassword === DEFAULT_CREDENTIALS.password
    ) {
      sessionStorage.setItem(
        "studentSession",
        JSON.stringify({
          loggedIn: true,
          studentId: loginId.trim(),
        })
      )

      setIsLoggedIn(true)
      setLoginId("")
      setLoginPassword("")
    } else {
      setLoginError(
        "Invalid Student ID or Password. Please try again."
      )
    }

    setIsLoggingIn(false)
  }

  // ============================================================
  // EXIT / LOGOUT
  // ============================================================

  const handleExit = () => {
    sessionStorage.removeItem("studentSession")
    router.push("/")
  }

  // ============================================================
  // FILTER TOOLS
  // ============================================================

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesFilter =
      filter === "all" || tool.status === filter

    return matchesSearch && matchesFilter
  })

  // ============================================================
  // LOGIN SCREEN
  // ============================================================

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen overflow-hidden bg-[#fafafa]">

        {/* ======================================================
            TECHNOLOGY BACKGROUND
        ====================================================== */}

        <div
          className="fixed inset-0 pointer-events-none opacity-[0.025]"
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

          <div className="absolute left-0 top-[12%] h-px w-[30%] bg-[#800000]/10" />

          <div className="absolute left-[30%] top-[12%] h-28 w-px bg-[#800000]/10" />

          <div className="absolute bottom-[15%] right-0 h-px w-[28%] bg-[#800000]/10" />

          <div className="absolute bottom-[15%] right-[28%] h-28 w-px bg-[#800000]/10" />

          <div className="absolute left-[29.5%] top-[11.4%] h-2 w-2 rounded-full bg-[#FFD700]" />

          <div className="absolute bottom-[14.4%] right-[27.5%] h-2 w-2 rounded-full bg-[#FFD700]" />

          <Settings
            className="absolute -right-24 top-20 h-80 w-80 text-[#800000]/[0.025]"
            strokeWidth={1}
          />

          <Settings
            className="absolute -left-24 bottom-0 h-80 w-80 text-[#800000]/[0.025]"
            strokeWidth={1}
          />

          <Cpu
            className="absolute right-[10%] top-[25%] h-8 w-8 text-[#800000]/10"
            strokeWidth={1.5}
          />

          <CircuitBoard
            className="absolute bottom-[20%] left-[8%] h-9 w-9 text-[#800000]/10"
            strokeWidth={1.5}
          />

          <FlaskConical
            className="absolute left-[15%] top-[25%] h-7 w-7 text-[#800000]/[0.06]"
            strokeWidth={1.5}
          />

          <Wrench
            className="absolute bottom-[28%] right-[15%] h-7 w-7 text-[#800000]/[0.06]"
            strokeWidth={1.5}
          />

        </div>

        {/* ======================================================
            EXIT BUTTON
        ====================================================== */}

        <Button
          onClick={handleExit}
          variant="outline"
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
          <LogOut className="w-4 h-4 mr-2" />

          <span>
            Exit
          </span>
        </Button>

        {/* ======================================================
            LOGIN CONTAINER
        ====================================================== */}

        <div className="relative z-10 flex min-h-screen w-full items-center justify-center p-4 sm:p-6">

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
              lg:grid-cols-[0.9fr_1.1fr]
            "
          >

            {/* ==================================================
                LEFT PANEL
            ================================================== */}

            <div
              className="
                relative
                hidden
                flex-col
                justify-between
                overflow-hidden
                bg-[#800000]
                p-10
                text-white
                lg:flex
              "
            >

              {/* Decorative background */}

              <div className="pointer-events-none absolute inset-0">

                <div className="absolute left-[20%] top-0 h-full w-px bg-[#FFD700]/10" />

                <div className="absolute left-0 top-[28%] h-px w-full bg-[#FFD700]/10" />

                <div className="absolute bottom-[28%] left-0 h-px w-[70%] bg-[#FFD700]/10" />

                <div className="absolute left-[20%] top-[28%] h-2 w-2 rounded-full bg-[#FFD700]" />

                <div className="absolute bottom-[28%] left-[70%] h-2 w-2 rounded-full bg-[#FFD700]" />

                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-[#FFD700]/10" />

                <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-[#FFD700]/10" />

                <Settings
                  className="
                    absolute
                    -bottom-20
                    -right-20
                    h-72
                    w-72
                    text-[#FFD700]/10
                  "
                  strokeWidth={1}
                />

                <Cpu
                  className="
                    absolute
                    right-10
                    top-12
                    h-10
                    w-10
                    text-[#FFD700]/20
                  "
                  strokeWidth={1.5}
                />

                <CircuitBoard
                  className="
                    absolute
                    bottom-28
                    left-8
                    h-10
                    w-10
                    text-[#FFD700]/20
                  "
                  strokeWidth={1.5}
                />

              </div>

              {/* Logo */}

              <div className="relative z-10">

                <div
                  className="
                    flex
                    h-64
                    w-full
                    items-center
                    justify-center
                    rounded-3xl
                    border
                    border-[#FFD700]/30
                    bg-white
                    p-0.5
                    shadow-[0_15px_45px_rgba(0,0,0,0.22)]
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

              {/* Text */}

              <div className="relative z-10 mt-8">

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

                <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
                  A streamlined platform for managing laboratory
                  tools, equipment, and student borrowing activities.
                </p>

              </div>

              {/* Indicators */}

              <div className="relative z-10 mt-8 flex items-center gap-3">

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

            </div>

            {/* ==================================================
                RIGHT LOGIN PANEL
            ================================================== */}

            <div className="flex flex-col justify-center overflow-y-auto p-6 sm:p-10 lg:p-12">

              <div className="mx-auto w-full max-w-md">

                {/* Mobile logo */}

                <div className="mb-6 lg:hidden">

                  <div className="mx-auto flex h-24 w-32 items-center justify-center rounded-2xl bg-[#800000] p-3 shadow-lg">

                    <div className="flex h-full w-full items-center justify-center rounded-xl bg-white p-2">

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

                <div className="mb-8">

                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#800000]/10 bg-[#800000]/5 px-3 py-1.5">

                    <FlaskConical className="h-3.5 w-3.5 text-[#800000]" />

                    <span className="text-xs font-semibold uppercase tracking-wider text-[#800000]">
                      Student Access
                    </span>

                  </div>

                  <h1 className="text-3xl font-bold tracking-tight text-[#800000] sm:text-4xl">
                    Student Portal
                  </h1>

                  <p className="mt-2 text-sm text-gray-500 sm:text-base">
                    Sign in to access lab tools & equipment.
                  </p>

                </div>

                {/* Login Card */}

                <Card className="rounded-2xl border border-gray-200 shadow-sm">

                  <CardContent className="p-5 sm:p-7">

                    <form
                      onSubmit={handleLogin}
                      className="space-y-5"
                    >

                      {/* Student ID */}

                      <div className="space-y-2">

                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">

                          <User
                            size={15}
                            className="text-[#800000]"
                          />

                          Student ID

                        </label>

                        <Input
                          type="text"
                          placeholder="Enter your Student ID"
                          value={loginId}
                          onChange={(e) => {
                            setLoginId(e.target.value)
                            setLoginError("")
                          }}
                          className="
                            h-12
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
                        />

                      </div>

                      {/* Password */}

                      <div className="space-y-2">

                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">

                          <Lock
                            size={15}
                            className="text-[#800000]"
                          />

                          Password

                        </label>

                        <div className="relative">

                          <Input
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
                              h-12
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
                              setShowPassword(!showPassword)
                            }
                            className="
                              absolute
                              right-3
                              top-1/2
                              -translate-y-1/2
                              p-1
                              text-gray-400
                              transition-colors
                              hover:text-[#800000]
                            "
                            tabIndex={-1}
                            aria-label={
                              showPassword
                                ? "Hide password"
                                : "Show password"
                            }
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

                        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                          <span className="font-bold">
                            !
                          </span>

                          <span>
                            {loginError}
                          </span>

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

                    </form>

                  </CardContent>

                </Card>

                {/* Testing Credentials */}

                <div className="mt-5 rounded-xl border border-[#FFD700]/30 bg-[#FFD700]/10 px-4 py-3">

                  <div className="flex items-start gap-3">

                    <div className="mt-0.5 rounded-lg bg-[#FFD700]/20 p-1.5">

                      <Lock
                        className="h-3.5 w-3.5 text-[#800000]"
                        strokeWidth={2}
                      />

                    </div>

                    <div className="text-xs">

                      <p className="mb-1 font-semibold text-[#800000]">
                        Testing Credentials
                      </p>

                      <p className="text-gray-600">

                        ID:{" "}

                        <span className="font-mono font-medium text-gray-800">
                          {DEFAULT_CREDENTIALS.studentId}
                        </span>

                      </p>

                      <p className="text-gray-600">

                        Password:{" "}

                        <span className="font-mono font-medium text-gray-800">
                          {DEFAULT_CREDENTIALS.password}
                        </span>

                      </p>

                    </div>

                  </div>

                </div>

                <p className="mt-6 text-center text-xs text-gray-400">
                  © 2025 Lab Borrowing System • All rights reserved
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    )
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] text-gray-800 relative overflow-x-hidden">

        {/* ======================================================
            SAME TECHNOLOGY BACKGROUND AS LIC DASHBOARD
        ====================================================== */}

        <div
          className="fixed inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(#800000 1px, transparent 1px),
              linear-gradient(90deg, #800000 1px, transparent 1px)
            `,
            backgroundSize: "36px 36px",
          }}
        />

        <div className="pointer-events-none fixed inset-0 overflow-hidden">

          <Settings
            className="absolute -right-24 top-20 h-80 w-80 text-[#800000]/[0.025]"
            strokeWidth={1}
          />

          <Settings
            className="absolute -left-24 bottom-0 h-80 w-80 text-[#800000]/[0.025]"
            strokeWidth={1}
          />

          <Cpu
            className="absolute right-[10%] top-[25%] h-8 w-8 text-[#800000]/10"
            strokeWidth={1.5}
          />

          <CircuitBoard
            className="absolute bottom-[20%] left-[8%] h-9 w-9 text-[#800000]/10"
            strokeWidth={1.5}
          />

        </div>

        <div className="relative z-10 flex min-h-screen items-center justify-center">

          <div className="flex flex-col items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#800000] shadow-lg">

              <Spinner className="h-7 w-7 border-2 border-[#FFD700]/30 border-t-[#FFD700]" />

            </div>

            <div className="text-center">

              <p className="font-semibold text-[#800000]">
                Loading Laboratory
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Preparing available equipment...
              </p>

            </div>

          </div>

        </div>

      </div>
    )
  }

  // ============================================================
  // STATISTICS
  // ============================================================

  const totalTools = tools.length

  const availableTools = tools.filter(
    (t) => t.status === "available"
  ).length

  const unavailableTools = tools.filter(
    (t) => t.status === "unavailable"
  ).length

  // ============================================================
  // DASHBOARD
  // ============================================================

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#fafafa] text-gray-800">

      {/* ======================================================
          TECHNOLOGY BACKGROUND
      ====================================================== */}

      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(#800000 1px, transparent 1px),
            linear-gradient(90deg, #800000 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
        }}
      />

      {/* ======================================================
          SUBTLE TECHNOLOGY DECORATIONS
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        {/* Top circuit */}

        <div className="absolute left-0 top-[12%] h-px w-[28%] bg-[#800000]/10" />

        <div className="absolute left-[28%] top-[12%] h-24 w-px bg-[#800000]/10" />

        <div className="absolute left-[28%] top-[calc(12%+6rem)] h-px w-24 bg-[#800000]/10" />

        {/* Bottom circuit */}

        <div className="absolute bottom-[18%] right-0 h-px w-[28%] bg-[#800000]/10" />

        <div className="absolute bottom-[18%] right-[28%] h-24 w-px bg-[#800000]/10" />

        <div className="absolute bottom-[calc(18%+6rem)] right-[28%] h-px w-24 bg-[#800000]/10" />

        {/* Nodes */}

        <div className="absolute left-[27.5%] top-[11.4%] h-2 w-2 rounded-full bg-[#FFD700]" />

        <div className="absolute left-[calc(28%+5.5rem)] top-[calc(12%+5.5rem)] h-2 w-2 rounded-full bg-[#FFD700]" />

        <div className="absolute bottom-[17.4%] right-[27.5%] h-2 w-2 rounded-full bg-[#FFD700]" />

        {/* Large subtle gears */}

        <Settings
          className="absolute -right-28 top-24 h-96 w-96 text-[#800000]/[0.025]"
          strokeWidth={1}
        />

        <Settings
          className="absolute -left-32 bottom-0 h-[28rem] w-[28rem] text-[#800000]/[0.025]"
          strokeWidth={1}
        />

        {/* Technology icons */}

        <Cpu
          className="absolute right-[8%] top-[24%] h-10 w-10 text-[#800000]/[0.07]"
          strokeWidth={1.5}
        />

        <CircuitBoard
          className="absolute bottom-[22%] left-[8%] h-10 w-10 text-[#800000]/[0.07]"
          strokeWidth={1.5}
        />

        <FlaskConical
          className="absolute left-[17%] top-[30%] h-8 w-8 text-[#800000]/[0.05]"
          strokeWidth={1.5}
        />

        <Wrench
          className="absolute bottom-[30%] right-[15%] h-8 w-8 text-[#800000]/[0.05]"
          strokeWidth={1.5}
        />

      </div>

      {/* ======================================================
          HEADER
          SAME STYLE AS LAB-IN-CHARGE DASHBOARD
      ====================================================== */}

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#800000]/10 shadow-sm">

        <div className="max-w-[1500px] mx-auto px-5 sm:px-7 lg:px-10">

          <div className="h-[76px] flex items-center justify-between gap-4">

            {/* ==================================================
                LEFT
            ================================================== */}

            <div className="flex items-center gap-3 min-w-0">

              {/* LOGO */}

              <div
                className="
                  relative
                  w-[54px]
                  h-[54px]
                  shrink-0
                  rounded-xl
                  bg-white
                  border
                  border-[#FFD700]/70
                  shadow-sm
                  flex
                  items-center
                  justify-center
                  overflow-hidden
                "
              >

                <div
                  className="absolute inset-0 opacity-[0.035]"
                  style={{
                    backgroundImage: `
                      linear-gradient(#800000 1px, transparent 1px),
                      linear-gradient(90deg, #800000 1px, transparent 1px)
                    `,
                    backgroundSize: "10px 10px",
                  }}
                />

                <Image
                  src="/logo/OfficialLogo.png"
                  alt="Lab Borrowing System Logo"
                  width={43}
                  height={43}
                  priority
                  className="relative z-10 w-[43px] h-[43px] object-contain"
                />

              </div>

              {/* TITLE */}

              <div className="min-w-0">

                <div className="flex items-center gap-2">

                  <h1 className="text-lg sm:text-xl font-bold text-[#800000] truncate">
                    Student Dashboard
                  </h1>

                  <span className="hidden sm:flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#800000]/50 font-semibold">

                    <Activity className="w-3 h-3" />

                    Dashboard

                  </span>

                </div>

                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Laboratory Equipment Management
                </p>

              </div>

            </div>

            {/* ==================================================
                RIGHT
            ================================================== */}

            <div className="flex items-center gap-2">

              {/* REFRESH */}

              <Button
                variant="ghost"
                onClick={fetchTools}
                className="
                  hidden sm:flex
                  h-9
                  px-3
                  text-gray-500
                  hover:text-[#800000]
                  hover:bg-[#800000]/5
                "
                title="Refresh inventory"
              >

                <RefreshCw className="w-4 h-4 mr-2" />

                Refresh

              </Button>

              {/* EXIT */}

              <Button
                onClick={handleExit}
                variant="outline"
                className="
                  h-9
                  px-3 sm:px-4
                  flex
                  items-center
                  gap-2
                  border-[#800000]/20
                  text-[#800000]
                  hover:bg-[#800000]
                  hover:text-[#FFD700]
                  rounded-lg
                "
              >

                <LogOut className="w-4 h-4" />

                <span className="hidden sm:inline">
                  Log Out
                </span>

              </Button>

            </div>

          </div>

        </div>

        {/* GOLD ACCENT LINE */}

        <div className="h-[2px] bg-gradient-to-r from-[#800000] via-[#FFD700] to-[#800000]" />

      </header>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="relative z-10 max-w-[1500px] mx-auto px-5 sm:px-7 lg:px-10 py-7">

        {/* ====================================================
            PAGE INTRO
        ==================================================== */}

        <section className="mb-7">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

            <div>

              <div className="flex items-center gap-2 mb-2">

                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />

                <span className="text-xs font-semibold text-green-600">
                  Equipment Inventory Live
                </span>

              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#800000]">
                Laboratory Equipment
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Browse available laboratory tools and submit your borrowing request.
              </p>

            </div>

            <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">

              <CircuitBoard className="w-4 h-4 text-[#800000]/50" />

              Laboratory Technology Platform

            </div>

          </div>

        </section>

        {/* ====================================================
            WELCOME CARD
        ==================================================== */}

        <Card className="relative overflow-hidden rounded-2xl border border-[#800000]/10 bg-white shadow-sm mb-6">

          {/* Decorative */}

          <div className="absolute inset-0 pointer-events-none">

            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#800000]/[0.04] to-transparent" />

            <Settings
              className="absolute -right-10 -top-10 h-40 w-40 text-[#800000]/[0.035]"
              strokeWidth={1}
            />

            <CircuitBoard
              className="absolute bottom-5 right-28 h-10 w-10 text-[#800000]/[0.06]"
              strokeWidth={1.5}
            />

          </div>

          <CardContent className="relative flex flex-col gap-5 p-6 sm:p-7 md:flex-row md:items-center md:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#800000]/10 text-[#800000]">

                <FlaskConical className="h-6 w-6" />

              </div>

              <div>

                <h3 className="text-lg font-bold text-[#800000]">
                  Welcome, Student 👋
                </h3>

                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-gray-500">
                  Browse the current laboratory inventory and check
                  equipment availability before preparing your borrower slip.
                </p>

              </div>

            </div>


          </CardContent>

        </Card>

        {/* ====================================================
            STATISTICS
        ==================================================== */}

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

          {/* TOTAL */}

          <StudentStat
            title="Total Tools"
            value={totalTools}
            label="Items in inventory"
            icon={<Package className="w-5 h-5" />}
            accent="maroon"
          />

          {/* AVAILABLE */}

          <StudentStat
            title="Available"
            value={availableTools}
            label="Ready for borrowing"
            icon={<Activity className="w-5 h-5" />}
            accent="green"
          />

          {/* UNAVAILABLE */}

          <StudentStat
            title="Unavailable"
            value={unavailableTools}
            label="Currently unavailable"
            icon={<Wrench className="w-5 h-5" />}
            accent="red"
          />

        </section>

        {/* ====================================================
            SEARCH + FILTER
        ==================================================== */}

        <Card className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm mb-6">

          <CardHeader className="border-b border-gray-100 bg-white">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div>

                <div className="flex items-center gap-2">

                  <div className="w-9 h-9 rounded-lg bg-[#800000]/5 text-[#800000] flex items-center justify-center">

                    <Search className="w-4 h-4" />

                  </div>

                  <CardTitle className="text-lg font-bold text-[#800000]">
                    Equipment Inventory
                  </CardTitle>

                </div>

                <p className="text-sm text-gray-500 mt-2 ml-11">
                  Search and filter available laboratory equipment.
                </p>

              </div>

              <Button
                onClick={() =>
                  router.push("/student/borrower-slip")
                }
                className="
                  bg-[#800000]
                  text-[#FFD700]
                  hover:bg-[#660000]
                  rounded-lg
                  h-10
                  px-4
                  shadow-sm
                "
              >

                <FileText className="w-4 h-4 mr-2" />

                Borrower Slip

              </Button>

            </div>

          </CardHeader>

          <CardContent className="p-5">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              {/* SEARCH */}

              <div className="relative w-full sm:max-w-md">

                <Search
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    h-4
                    w-4
                    text-gray-400
                  "
                />

                <Input
                  placeholder="Search tools..."
                  className="
                    pl-9
                    h-10
                    bg-white
                    rounded-xl
                    border-gray-200
                    focus:border-[#800000]
                    focus:ring-[#800000]/20
                  "
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

              {/* FILTER */}

              <Select
                onValueChange={setFilter}
                defaultValue="all"
              >

                <SelectTrigger className="w-full sm:w-48 h-10 rounded-xl border-[#800000]/15">

                  <SelectValue placeholder="Filter Status" />

                </SelectTrigger>

                <SelectContent>

                  <SelectItem value="all">
                    Show All
                  </SelectItem>

                  <SelectItem value="available">
                    Available
                  </SelectItem>

                  <SelectItem value="unavailable">
                    Unavailable
                  </SelectItem>

                </SelectContent>

              </Select>

            </div>

          </CardContent>

        </Card>

        {/* ====================================================
            TOOLS TABLE
        ==================================================== */}

        <Card className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* TABLE HEADER */}

          <CardHeader className="border-b border-gray-100 bg-white">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg bg-[#800000]/5 text-[#800000] flex items-center justify-center">

                  <Wrench className="w-4 h-4" />

                </div>

                <div>

                  <CardTitle className="text-lg font-bold text-[#800000]">
                    Tools & Equipment
                  </CardTitle>

                  <p className="text-sm text-gray-500 mt-1">
                    Current laboratory inventory.
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-2 self-start rounded-full border border-[#800000]/10 bg-white px-3 py-1.5 sm:self-auto">

                <span className="h-2 w-2 rounded-full bg-[#800000]" />

                <span className="text-xs font-semibold text-gray-600">

                  {filteredTools.length}{" "}

                  {filteredTools.length === 1
                    ? "Tool"
                    : "Tools"}

                </span>

              </div>

            </div>

          </CardHeader>

          {/* TABLE */}

          <CardContent className="p-0">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[650px] border-collapse text-sm">

                <thead>

                  <tr className="border-b border-[#800000]/10 bg-[#fafafa]">

                    <th className="px-5 py-4 text-left">

                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#800000]">

                        <Wrench className="h-4 w-4" />

                        Tool

                      </div>

                    </th>

                    <th className="px-5 py-4 text-left">

                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#800000]">

                        <Layers3 className="h-4 w-4" />

                        Quantity

                      </div>

                    </th>

                    <th className="px-5 py-4 text-center">

                      <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-[#800000]">

                        <Activity className="h-4 w-4" />

                        Status

                      </div>

                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredTools.length > 0 ? (

                    filteredTools.map((tool) => (

                      <tr
                        key={tool.id}
                        className="
                          group
                          transition-all
                          duration-200
                          hover:bg-[#800000]/[0.025]
                        "
                      >

                        {/* TOOL */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div
                              className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-[#800000]/10
                                text-[#800000]
                                transition-all
                                duration-200
                                group-hover:bg-[#800000]
                                group-hover:text-[#FFD700]
                              "
                            >

                              <Wrench className="h-4 w-4" />

                            </div>

                            <div className="min-w-0">

                              <p className="truncate font-semibold text-gray-900">
                                {tool.name}
                              </p>

                              <p className="mt-0.5 text-xs text-gray-400">
                                Laboratory equipment
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* QUANTITY */}

                        <td className="px-5 py-4">

                          <span className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700">

                            {tool.quantity}

                          </span>

                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4 text-center">

                          <span
                            className={`
                              inline-flex
                              min-w-[105px]
                              items-center
                              justify-center
                              gap-2
                              rounded-full
                              px-3
                              py-1.5
                              text-xs
                              font-semibold
                              ${
                                tool.status === "available"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }
                            `}
                          >

                            <span
                              className={`
                                h-1.5
                                w-1.5
                                rounded-full
                                ${
                                  tool.status === "available"
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }
                              `}
                            />

                            {tool.status === "available"
                              ? "Available"
                              : "Unavailable"}

                          </span>

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>

                      <td
                        colSpan={3}
                        className="px-6 py-14 text-center"
                      >

                        <div className="flex flex-col items-center gap-3">

                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#800000]/5 text-[#800000]/50">

                            <Search className="h-7 w-7" />

                          </div>

                          <div>

                            <p className="text-sm font-semibold text-gray-700">
                              No tools found
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              Try changing your search or filter.
                            </p>

                          </div>

                        </div>

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </CardContent>

          {/* FOOTER */}

          {filteredTools.length > 0 && (

            <div className="border-t border-gray-100 bg-[#fafafa] px-5 py-3">

              <div className="flex items-center justify-between">

                <p className="text-xs text-gray-400">

                  Showing{" "}

                  <span className="font-semibold text-gray-600">
                    {filteredTools.length}
                  </span>{" "}

                  {filteredTools.length === 1
                    ? "tool"
                    : "tools"}

                </p>

                <div className="flex items-center gap-2">

                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                  <span className="text-[11px] font-medium text-gray-400">
                    Live inventory data
                  </span>

                </div>

              </div>

            </div>

          )}

        </Card>

        {/* ====================================================
            FOOTER
        ==================================================== */}

        <footer className="py-8">

          <div className="h-px bg-gradient-to-r from-transparent via-[#800000]/10 to-transparent" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 text-xs text-gray-400">

            <p>
              Laboratory Borrowing Management System
            </p>

            <div className="flex items-center gap-2">

              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />

              <span>
                System Ready
              </span>

            </div>

          </div>

        </footer>

      </main>

    </div>
  )
}

// ============================================================
// STUDENT STAT CARD
// ============================================================

function StudentStat({
  title,
  value,
  label,
  icon,
  accent,
}: {
  title: string
  value: number
  label: string
  icon: React.ReactNode
  accent: "maroon" | "green" | "red"
}) {
  const styles = {
    maroon: {
      border: "border-[#800000]/15",
      iconBg: "bg-[#800000]/5",
      iconColor: "text-[#800000]",
      value: "text-[#800000]",
    },

    green: {
      border: "border-green-200",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      value: "text-green-600",
    },

    red: {
      border: "border-red-200",
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      value: "text-red-600",
    },
  }

  const style = styles[accent]

  return (
    <Card
      className={`
        bg-white
        border
        ${style.border}
        rounded-xl
        shadow-sm
        hover:shadow-md
        transition-shadow
      `}
    >

      <CardContent className="p-5">

        <div className="flex items-center justify-between">

          <span className="text-sm font-medium text-gray-500">
            {title}
          </span>

          <div
            className={`
              w-9
              h-9
              rounded-lg
              ${style.iconBg}
              ${style.iconColor}
              flex
              items-center
              justify-center
            `}
          >
            {icon}
          </div>

        </div>

        <div className="flex items-end gap-2 mt-4">

          <span
            className={`
              text-2xl
              sm:text-3xl
              font-bold
              ${style.value}
            `}
          >
            {value}
          </span>

          <span className="text-xs text-gray-400 mb-1">
            {label}
          </span>

        </div>

      </CardContent>

    </Card>
  )
}