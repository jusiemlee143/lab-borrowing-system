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

const DEFAULT_CREDENTIALS = {
  studentId: "student001",
  password: "password123",
}

type Tool = {
  id: string
  name: string
  quantity: number
  status: "available" | "unavailable"
}

export default function StudentPage() {
  const router = useRouter()

  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [tools, setTools] = useState<Tool[]>([])

  // Authentication
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
  // EXIT
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
      <div className="fixed inset-0 overflow-hidden bg-[#faf9f6]">
        {/* ======================================================
            BACKGROUND
        ====================================================== */}

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Circuit lines */}
          <div className="absolute top-[12%] left-0 w-[35%] h-px bg-[#800000]/10" />
          <div className="absolute top-[12%] left-[35%] w-px h-[28%] bg-[#800000]/10" />

          <div className="absolute bottom-[18%] right-0 w-[32%] h-px bg-[#800000]/10" />
          <div className="absolute bottom-[18%] right-[32%] w-px h-[22%] bg-[#800000]/10" />

          {/* Circuit nodes */}
          <div className="absolute top-[11.3%] left-[34.5%] w-2 h-2 rounded-full bg-[#FFD700]" />
          <div className="absolute bottom-[17.3%] right-[31.5%] w-2 h-2 rounded-full bg-[#FFD700]" />

          {/* Large subtle gear */}
          <Settings
            className="absolute -right-20 top-10 w-72 h-72 text-[#800000]/[0.025]"
            strokeWidth={1}
          />

          <Settings
            className="absolute -left-24 bottom-0 w-80 h-80 text-[#800000]/[0.025]"
            strokeWidth={1}
          />

          {/* Small technology icons */}
          <Cpu
            className="absolute top-24 right-[8%] w-8 h-8 text-[#800000]/10"
            strokeWidth={1.5}
          />

          <CircuitBoard
            className="absolute bottom-24 left-[8%] w-9 h-9 text-[#800000]/10"
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
            absolute
            top-5
            right-5
            sm:top-7
            sm:right-7
            z-30
            gap-2
            rounded-xl
            border-[#800000]/20
            bg-white/90
            text-[#800000]
            shadow-sm
            backdrop-blur
            hover:bg-[#800000]
            hover:text-[#FFD700]
            transition-all
          "
        >
          <LogOut size={16} />
          Exit
        </Button>

        {/* ======================================================
            MAIN LOGIN AREA
        ====================================================== */}

        <div className="relative z-10 h-full w-full flex items-center justify-center p-4 sm:p-6">
          <div
            className="
              w-full
              max-w-5xl
              max-h-[calc(100vh-2rem)]
              sm:max-h-[calc(100vh-3rem)]
              grid
              lg:grid-cols-[0.9fr_1.1fr]
              rounded-[2rem]
              overflow-hidden
              bg-white
              border
              border-gray-200
              shadow-[0_25px_80px_rgba(80,0,0,0.14)]
            "
          >
            {/* ==================================================
                LEFT TECHNOLOGY PANEL
            ================================================== */}

            <div
              className="
                relative
                hidden
                lg:flex
                flex-col
                justify-between
                overflow-hidden
                bg-[#800000]
                text-white
                p-10
              "
            >
              {/* Decorative circuit pattern */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-[20%] h-full w-px bg-[#FFD700]/10" />
                <div className="absolute top-[28%] left-0 w-full h-px bg-[#FFD700]/10" />
                <div className="absolute top-[72%] left-0 w-[70%] h-px bg-[#FFD700]/10" />

                <div className="absolute top-[28%] left-[20%] w-2 h-2 rounded-full bg-[#FFD700]" />
                <div className="absolute top-[72%] left-[70%] w-2 h-2 rounded-full bg-[#FFD700]" />

                <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full border border-[#FFD700]/10" />
                <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full border border-[#FFD700]/10" />

                <Settings
                  className="
                    absolute
                    -bottom-20
                    -right-20
                    w-72
                    h-72
                    text-[#FFD700]/10
                  "
                  strokeWidth={1}
                />

                <Cpu
                  className="
                    absolute
                    right-10
                    top-12
                    w-10
                    h-10
                    text-[#FFD700]/20
                  "
                  strokeWidth={1.5}
                />

                <CircuitBoard
                  className="
                    absolute
                    left-8
                    bottom-28
                    w-10
                    h-10
                    text-[#FFD700]/20
                  "
                  strokeWidth={1.5}
                />
              </div>

              {/* Logo */}
              <div className="relative z-10">
                <div
                  className="
                    w-full
                    h-64
                    rounded-3xl
                    bg-white
                    flex
                    items-center
                    justify-center
                    p-0.5
                    shadow-[0_15px_45px_rgba(0,0,0,0.22)]
                    border
                    border-[#FFD700]/30
                  "
                >
                  <Image
                    src="/logo/OfficialLogo.png"
                    alt="Lab Borrowing System Logo"
                    width={300}
                    height={300}
                    priority
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Text */}
              <div className="relative z-10 mt-8">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px w-8 bg-[#FFD700]" />
                  <span className="text-[#FFD700] text-xs font-semibold uppercase tracking-[0.2em]">
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

                <p className="mt-4 text-sm leading-relaxed text-white/70 max-w-sm">
                  A streamlined platform for managing laboratory
                  tools, equipment, and student borrowing activities.
                </p>
              </div>

              {/* Bottom technology indicators */}
              <div className="relative z-10 flex items-center gap-3 mt-8">
                <div className="flex items-center gap-2 rounded-lg bg-white/10 border border-white/10 px-3 py-2">
                  <Activity className="w-4 h-4 text-[#FFD700]" />
                  <span className="text-xs text-white/80">
                    System Ready
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-white/10 border border-white/10 px-3 py-2">
                  <Wrench className="w-4 h-4 text-[#FFD700]" />
                  <span className="text-xs text-white/80">
                    Equipment
                  </span>
                </div>
              </div>
            </div>

            {/* ==================================================
                RIGHT LOGIN PANEL
            ================================================== */}

            <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12 overflow-y-auto">
              <div className="w-full max-w-md mx-auto">
                {/* Mobile logo */}
                <div className="lg:hidden mb-6">
                  <div className="mx-auto w-32 h-24 rounded-2xl bg-[#800000] flex items-center justify-center p-3 shadow-lg">
                    <div className="w-full h-full rounded-xl bg-white flex items-center justify-center p-2">
                      <Image
                        src="/logo/OfficialLogo.png"
                        alt="Lab Borrowing System Logo"
                        width={160}
                        height={120}
                        priority
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>

                {/* Heading */}
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 mb-4 rounded-full bg-[#800000]/5 border border-[#800000]/10 px-3 py-1.5">
                    <FlaskConical className="w-3.5 h-3.5 text-[#800000]" />
                    <span className="text-xs font-semibold text-[#800000] uppercase tracking-wider">
                      Student Access
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-bold text-[#800000] tracking-tight">
                    Student Portal
                  </h1>

                  <p className="text-gray-500 mt-2 text-sm sm:text-base">
                    Sign in to access lab tools & equipment.
                  </p>
                </div>

                {/* Login Card */}
                <Card className="border border-gray-200 shadow-sm rounded-2xl">
                  <CardContent className="p-5 sm:p-7">
                    <form
                      onSubmit={handleLogin}
                      className="space-y-5"
                    >
                      {/* Student ID */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <User
                            size={15}
                            className="text-[#800000]"
                          />
                          Student ID
                        </label>

                        <div className="relative">
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
                      </div>

                      {/* Password */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
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
                              hover:text-[#800000]
                              transition-colors
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
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
                          <span className="font-bold">
                            !
                          </span>

                          <span>{loginError}</span>
                        </div>
                      )}

                      {/* Login button */}
                      <Button
                        type="submit"
                        disabled={
                          isLoggingIn ||
                          !loginId.trim() ||
                          !loginPassword
                        }
                        className="
                          w-full
                          h-12
                          rounded-xl
                          bg-[#800000]
                          text-[#FFD700]
                          hover:bg-[#660000]
                          font-semibold
                          text-base
                          shadow-lg
                          shadow-[#800000]/15
                          transition-all
                        "
                      >
                        {isLoggingIn ? (
                          <span className="flex items-center justify-center gap-2">
                            <Spinner className="w-5 h-5 border-2 border-[#FFD700]/30 border-t-[#FFD700]" />
                            Signing in...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            Sign In
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Testing credentials */}
                <div className="mt-5 rounded-xl border border-[#FFD700]/30 bg-[#FFD700]/10 px-4 py-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-[#FFD700]/20 p-1.5">
                      <Lock
                        className="w-3.5 h-3.5 text-[#800000]"
                        strokeWidth={2}
                      />
                    </div>

                    <div className="text-xs">
                      <p className="font-semibold text-[#800000] mb-1">
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

                <p className="text-center text-xs text-gray-400 mt-6">
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
      <div className="fixed inset-0 flex items-center justify-center bg-[#faf9f6]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#800000] flex items-center justify-center shadow-lg">
            <Spinner className="w-7 h-7 border-2 border-[#FFD700]/30 border-t-[#FFD700]" />
          </div>

          <div className="text-center">
            <p className="font-semibold text-[#800000]">
              Loading Laboratory
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Preparing available equipment...
            </p>
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
    <div className="min-h-screen bg-[#faf9f6] text-gray-900">
      {/* ========================================================
          HEADER
      ======================================================== */}

      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#800000] flex items-center justify-center p-1.5 shadow-sm">
              <div className="w-full h-full rounded-lg bg-white flex items-center justify-center p-0.5">
                <Image
                  src="/logo/OfficialLogo.png"
                  alt="Lab Borrowing System"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div>
              <h1 className="font-bold text-[#800000] text-lg leading-tight">
                Student Dashboard
              </h1>

              <p className="text-[11px] text-gray-400">
                Laboratory Equipment Management
              </p>
            </div>
          </div>

          <Button
            onClick={handleExit}
            variant="outline"
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border-[#800000]/20
              text-[#800000]
              hover:bg-[#800000]
              hover:text-[#FFD700]
            "
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">
              Exit
            </span>
          </Button>
        </div>
      </header>

      {/* ========================================================
          MAIN CONTENT
      ======================================================== */}

      <main className="max-w-7xl mx-auto p-4 sm:p-6 md:p-3 space-y-6">
        {/* ======================================================
            WELCOME
        ====================================================== */}

        <Card className="relative overflow-hidden bg-[#800000] text-[#FFD700] border-none shadow-xl rounded-2xl">
          {/* subtle technology decoration */}
          <Settings
            className="absolute -right-8 -top-8 w-40 h-40 text-white/5"
            strokeWidth={1}
          />

          <CircuitBoard
            className="absolute right-28 bottom-5 w-10 h-10 text-[#FFD700]/10"
            strokeWidth={1.5}
          />

          <CardHeader className="relative">
            <CardTitle className="text-2xl font-bold">
              Welcome, Students 👋
            </CardTitle>
          </CardHeader>

          <CardContent className="relative text-[#fff8e1]">
            Browse and borrow your lab tools and equipment
            efficiently.
          </CardContent>
        </Card>

        {/* ======================================================
            STATS
        ====================================================== */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total */}
          <Card className="bg-white shadow-md rounded-xl border-l-4 border-[#800000]">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Tools
                </p>

                <p className="text-3xl font-bold text-[#800000] mt-1">
                  {totalTools}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-[#800000]/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-[#800000]" />
              </div>
            </CardContent>
          </Card>

          {/* Available */}
          <Card className="bg-white shadow-md rounded-xl border-l-4 border-green-500">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Available
                </p>

                <p className="text-3xl font-bold text-green-600 mt-1">
                  {availableTools}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </CardContent>
          </Card>

          {/* Unavailable */}
          <Card className="bg-white shadow-md rounded-xl border-l-4 border-red-500">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Unavailable
                </p>

                <p className="text-3xl font-bold text-red-500 mt-1">
                  {unavailableTools}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                <Wrench className="w-6 h-6 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ======================================================
            SEARCH + FILTER
        ====================================================== */}

        <Card className="bg-white border shadow-md rounded-2xl">
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search */}
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

                <Input
                  placeholder="Search tools..."
                  className="
                    pl-9
                    h-11
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

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Select
                  onValueChange={setFilter}
                  defaultValue="all"
                >
                  <SelectTrigger className="w-full sm:w-48 h-11 rounded-xl border-[#800000]/20">
                    <SelectValue placeholder="Filter" />
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

                <Button
                  onClick={() =>
                    router.push(
                      "/student/borrower-slip"
                    )
                  }
                  className="
                    gap-2
                    h-11
                    rounded-xl
                    bg-[#800000]
                    text-[#FFD700]
                    hover:bg-[#660000]
                  "
                >
                  <FileText size={16} />
                  Borrower Slip
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ======================================================
            TOOLS TABLE
        ====================================================== */}

        <Card className="bg-white border shadow-md overflow-hidden rounded-2xl">
          <CardHeader className="border-b bg-gray-50/70">
            <CardTitle className="text-[#800000] flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Tools & Equipment
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[500px]">
                <thead className="bg-[#f5f5f5]">
                  <tr>
                    <th className="py-3 px-5 text-left text-[#800000] font-semibold">
                      Tool
                    </th>

                    <th className="py-3 px-5 text-left text-[#800000] font-semibold">
                      Quantity
                    </th>

                    <th className="py-3 px-5 text-center text-[#800000] font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTools.length > 0 ? (
                    filteredTools.map((tool) => (
                      <tr
                        key={tool.id}
                        className="
                          border-b
                          last:border-b-0
                          hover:bg-[#800000]/[0.025]
                          transition-colors
                        "
                      >
                        <td className="py-4 px-5 font-medium">
                          {tool.name}
                        </td>

                        <td className="py-4 px-5">
                          {tool.quantity}
                        </td>

                        <td className="py-4 px-5 text-center">
                          <span
                            className={`
                              inline-flex
                              min-w-[100px]
                              justify-center
                              px-3
                              py-1.5
                              rounded-full
                              text-xs
                              font-semibold
                              ${
                                tool.status ===
                                "available"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }
                            `}
                          >
                            {tool.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="py-12 text-center"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Search className="w-8 h-8 text-gray-300" />

                          <p className="text-sm font-medium text-gray-500">
                            No tools found
                          </p>

                          <p className="text-xs text-gray-400">
                            Try changing your search or filter.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}