"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Search,
  LogOut,
  FileText,
  FlaskConical,
  Cpu,
  Settings,
  CircuitBoard,
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
// TYPES
// ============================================================

type Tool = {
  id: string
  name: string
  quantity: number
  status: "available" | "unavailable"
}

// ============================================================
// MAIN STUDENT DASHBOARD
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
  // SESSION CHECK
  // ============================================================

  const [checkingSession, setCheckingSession] = useState(true)
  const [authError, setAuthError] = useState(false)

  // ============================================================
  // CHECK STUDENT SESSION
  // ============================================================

  useEffect(() => {
    const session = sessionStorage.getItem("studentSession")

    // ==========================================================
    // NO SESSION
    // ==========================================================

    if (!session) {
      setAuthError(true)
      setCheckingSession(false)

      const timer = setTimeout(() => {
        router.replace("/student/login")
      }, 2000)

      return () => clearTimeout(timer)
    }

    // ==========================================================
    // CHECK SESSION
    // ==========================================================

    try {
      const parsed = JSON.parse(session)

      // ========================================================
      // INVALID SESSION
      // ========================================================

      if (!parsed?.loggedIn) {
        sessionStorage.removeItem("studentSession")

        setAuthError(true)
        setCheckingSession(false)

        const timer = setTimeout(() => {
          router.replace("/student/login")
        }, 2000)

        return () => clearTimeout(timer)
      }

      // ========================================================
      // VALID SESSION
      // ========================================================

      setCheckingSession(false)
      setAuthError(false)

    } catch {
      // ========================================================
      // CORRUPTED SESSION
      // ========================================================

      sessionStorage.removeItem("studentSession")

      setAuthError(true)
      setCheckingSession(false)

      const timer = setTimeout(() => {
        router.replace("/student/login")
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [router])

  // ============================================================
  // FETCH TOOLS
  // ============================================================

  useEffect(() => {
    if (!checkingSession && !authError) {
      fetchTools()
    }
  }, [checkingSession, authError])

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
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    sessionStorage.removeItem("studentSession")
    router.replace("/student/login")
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
  // UNAUTHORIZED ACCESS SCREEN
  // ============================================================

  if (authError) {
    return <StudentUnauthorizedScreen />
  }

  // ============================================================
  // SESSION CHECKING SCREEN
  // ============================================================

  if (checkingSession) {
    return (
      <StudentLoadingScreen
        message="Checking student session..."
      />
    )
  }

  // ============================================================
  // INVENTORY LOADING SCREEN
  // ============================================================

  if (loading) {
    return (
      <StudentLoadingScreen
        message="Loading laboratory inventory..."
        subtitle="Preparing available equipment..."
      />
    )
  }

  // ============================================================
  // STATISTICS
  // ============================================================

  const totalTools = tools.length

  const availableTools = tools.filter(
    (tool) => tool.status === "available"
  ).length

  const unavailableTools = tools.filter(
    (tool) => tool.status === "unavailable"
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

        {/* Large gears */}

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
      ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-[#800000]/10 bg-white/95 shadow-sm backdrop-blur-md">

        <div className="mx-auto max-w-[1500px] px-4 sm:px-7 lg:px-10">

          <div className="flex h-[72px] items-center justify-between gap-3 sm:h-[76px]">

            {/* ==================================================
                LEFT SIDE
            ================================================== */}

            <div className="flex min-w-0 items-center gap-3">

              {/* LOGO */}

              <div
                className="
                  relative
                  flex
                  h-[48px]
                  w-[48px]
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-xl
                  border
                  border-[#FFD700]/70
                  bg-white
                  shadow-sm
                  sm:h-[54px]
                  sm:w-[54px]
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
                  className="relative z-10 h-[38px] w-[38px] object-contain sm:h-[43px] sm:w-[43px]"
                />

              </div>

              {/* TITLE */}

              <div className="min-w-0">

                <div className="flex items-center gap-2">

                  <h1 className="truncate text-base font-bold text-[#800000] sm:text-xl">
                    Student Dashboard
                  </h1>

                  <span className="hidden items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#800000]/50 md:flex">

                    <Activity className="h-3 w-3" />

                    Dashboard

                  </span>

                </div>

                <p className="truncate text-[11px] text-gray-500 sm:text-sm">
                  Laboratory Equipment Management
                </p>

              </div>

            </div>

            {/* ==================================================
                RIGHT SIDE
            ================================================== */}

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">

              {/* REFRESH */}

              <Button
                variant="ghost"
                onClick={fetchTools}
                className="
                  hidden
                  h-9
                  px-3
                  text-gray-500
                  hover:bg-[#800000]/5
                  hover:text-[#800000]
                  sm:flex
                "
                title="Refresh inventory"
              >

                <RefreshCw className="mr-2 h-4 w-4" />

                Refresh

              </Button>

              {/* MOBILE REFRESH */}

              <Button
                variant="ghost"
                size="icon"
                onClick={fetchTools}
                className="
                  h-9
                  w-9
                  text-gray-500
                  hover:bg-[#800000]/5
                  hover:text-[#800000]
                  sm:hidden
                "
                title="Refresh inventory"
              >

                <RefreshCw className="h-4 w-4" />

              </Button>

              {/* LOGOUT */}

              <Button
                onClick={handleLogout}
                variant="outline"
                className="
                  flex
                  h-9
                  items-center
                  gap-2
                  rounded-lg
                  border-[#800000]/20
                  px-3
                  text-[#800000]
                  hover:bg-[#800000]
                  hover:text-[#FFD700]
                  sm:px-4
                "
              >

                <LogOut className="h-4 w-4" />

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

      <main className="relative z-10 mx-auto max-w-[1500px] px-4 py-6 sm:px-7 sm:py-7 lg:px-10">

        {/* ====================================================
            PAGE INTRO
        ==================================================== */}

        <section className="mb-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="mb-2 flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />

                <span className="text-xs font-semibold text-green-600">
                  Equipment Inventory Live
                </span>

              </div>

              <h2 className="text-2xl font-bold tracking-tight text-[#800000] sm:text-3xl">
                Laboratory Equipment
              </h2>

              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Browse available laboratory tools and submit your
                borrowing request.
              </p>

            </div>

            <div className="hidden items-center gap-2 text-xs text-gray-400 md:flex">

              <CircuitBoard className="h-4 w-4 text-[#800000]/50" />

              Laboratory Technology Platform

            </div>

          </div>

        </section>

        {/* ====================================================
            WELCOME CARD
        ==================================================== */}

        <Card className="relative mb-6 overflow-hidden rounded-2xl border border-[#800000]/10 bg-white shadow-sm">

          <div className="pointer-events-none absolute inset-0">

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

          <CardContent className="relative flex flex-col gap-5 p-5 sm:p-7 md:flex-row md:items-center md:justify-between">

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
                  equipment availability before preparing your borrower
                  slip.
                </p>

              </div>

            </div>

          </CardContent>

        </Card>

        {/* ====================================================
            STATISTICS
        ==================================================== */}

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <StudentStat
            title="Total Tools"
            value={totalTools}
            label="Items in inventory"
            icon={<Package className="h-5 w-5" />}
            accent="maroon"
          />

          <StudentStat
            title="Available"
            value={availableTools}
            label="Ready for borrowing"
            icon={<Activity className="h-5 w-5" />}
            accent="green"
          />

          <StudentStat
            title="Unavailable"
            value={unavailableTools}
            label="Currently unavailable"
            icon={<Wrench className="h-5 w-5" />}
            accent="red"
          />

        </section>

        {/* ====================================================
            SEARCH + FILTER
        ==================================================== */}

        <Card className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <CardHeader className="border-b border-gray-100 bg-white">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#800000]/5 text-[#800000]">

                    <Search className="h-4 w-4" />

                  </div>

                  <CardTitle className="text-lg font-bold text-[#800000]">
                    Equipment Inventory
                  </CardTitle>

                </div>

                <p className="ml-11 mt-2 text-sm text-gray-500">
                  Search and filter available laboratory equipment.
                </p>

              </div>

              {/* BORROWER SLIP */}

              <Button
                onClick={() =>
                  router.push("/student/borrower-slip")
                }
                className="
                  h-10
                  rounded-lg
                  bg-[#800000]
                  px-4
                  text-[#FFD700]
                  shadow-sm
                  hover:bg-[#660000]
                "
              >

                <FileText className="mr-2 h-4 w-4" />

                Borrower Slip

              </Button>

            </div>

          </CardHeader>

          <CardContent className="p-5">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              {/* SEARCH */}

              <div className="relative w-full sm:max-w-md">

                <Search
                  className="
                    absolute
                    left-3
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <Input
                  placeholder="Search tools..."
                  className="
                    h-10
                    rounded-xl
                    border-gray-200
                    bg-white
                    pl-9
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

                <SelectTrigger className="h-10 w-full rounded-xl border-[#800000]/15 sm:w-48">

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

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#800000]/5 text-[#800000]">

                  <Wrench className="h-4 w-4" />

                </div>

                <div>

                  <CardTitle className="text-lg font-bold text-[#800000]">
                    Tools & Equipment
                  </CardTitle>

                  <p className="mt-1 text-sm text-gray-500">
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

          <div className="flex flex-col items-center justify-between gap-3 pt-5 text-xs text-gray-400 sm:flex-row">

            <p>
              Laboratory Borrowing Management System
            </p>

            <div className="flex items-center gap-2">

              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

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
// UNAUTHORIZED ACCESS SCREEN
// ============================================================

function StudentUnauthorizedScreen() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fafafa]">

      {/* ======================================================
          TECHNOLOGY BACKGROUND
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
          DECORATIONS
      ====================================================== */}

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

      {/* ======================================================
          ERROR NOTIFICATION
      ====================================================== */}

      <div
        className="
          fixed
          right-0
          top-4
          z-[9999]
          w-[calc(100%-16px)]
          max-w-[443px]
          rounded-r-xl
          border
          border-red-200
          bg-red-50
          px-5
          py-5
          shadow-lg
          sm:top-5
        "
      >

        <div className="flex items-start gap-3">

          {/* ERROR ICON */}

          <div
            className="
              mt-0.5
              flex
              h-5
              w-5
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-red-600
              text-white
            "
          >

            <span className="text-xs font-bold">
              !
            </span>

          </div>

          {/* MESSAGE */}

          <p className="text-sm font-semibold leading-6 text-red-600">
            You must login first before accessing the Student Dashboard.
          </p>

        </div>

      </div>

      {/* ======================================================
          CENTER MESSAGE
      ====================================================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5">

        <div className="text-center">

          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-[#800000]
              shadow-lg
            "
          >

            <LogOut className="h-7 w-7 text-[#FFD700]" />

          </div>

          <p className="mt-4 font-semibold text-[#800000]">
            Redirecting to Student Login...
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Please login before accessing the dashboard.
          </p>

        </div>

      </div>

    </div>
  )
}

// ============================================================
// LOADING SCREEN
// ============================================================

function StudentLoadingScreen({
  message,
  subtitle = "Please wait...",
}: {
  message: string
  subtitle?: string
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fafafa]">

      {/* Background */}

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

      {/* Decorations */}

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

      {/* Loading */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5">

        <div className="flex flex-col items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#800000] shadow-lg">

            <Spinner className="h-7 w-7 border-2 border-[#FFD700]/30 border-t-[#FFD700]" />

          </div>

          <div className="text-center">

            <p className="font-semibold text-[#800000]">
              {message}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              {subtitle}
            </p>

          </div>

        </div>

      </div>

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
        rounded-xl
        border
        bg-white
        ${style.border}
        shadow-sm
        transition-shadow
        hover:shadow-md
      `}
    >

      <CardContent className="p-5">

        <div className="flex items-center justify-between">

          <span className="text-sm font-medium text-gray-500">
            {title}
          </span>

          <div
            className={`
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              ${style.iconBg}
              ${style.iconColor}
            `}
          >
            {icon}
          </div>

        </div>

        <div className="mt-4 flex items-end gap-2">

          <span
            className={`
              text-2xl
              font-bold
              sm:text-3xl
              ${style.value}
            `}
          >
            {value}
          </span>

          <span className="mb-1 text-xs text-gray-400">
            {label}
          </span>

        </div>

      </CardContent>

    </Card>
  )
}