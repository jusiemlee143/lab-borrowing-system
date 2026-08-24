"use client"

import RequestsManager from "@/components/requests/RequestsManager"
import HistoryManager from "@/components/history/HistoryManager"
import ToolList from "@/components/tools/ToolList"

import { useState, useEffect } from "react"

import {
  LogOut,
  User,
  Package,
  AlertCircle,
  Cpu,
  CircuitBoard,
  Boxes,
  Activity,
  ShieldCheck,
  RefreshCw,
  Settings,
  FlaskConical,
  Wrench,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"

// ============================================================
// TYPES
// ============================================================

interface Tool {
  _id: string
  name: string
  quantity: number
  status: "available" | "low stock" | "unavailable"
}

interface DashboardStats {
  totalTools: number
  availableTools: number
  lowStock: number
  unavailable: number

  pending: number
  approved: number
  released: number
  returned: number
  rejected: number

  borrowedToday: number
  returnedToday: number
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function LabInChargePage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)

  const [tools, setTools] = useState<Tool[]>([])

  const [stats, setStats] =
    useState<DashboardStats>({
      totalTools: 0,
      availableTools: 0,
      lowStock: 0,
      unavailable: 0,

      pending: 0,
      approved: 0,
      released: 0,
      returned: 0,
      rejected: 0,

      borrowedToday: 0,
      returnedToday: 0,
    })

  // ============================================================
  // FETCH DATA
  // ============================================================

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      const [
        toolsRes,
        dashboardRes,
      ] = await Promise.all([
        fetch(
          "/api/lab-in-charge/tools",
          {
            cache: "no-store",
          }
        ),

        fetch(
          "/api/lab-in-charge/dashboard",
          {
            cache: "no-store",
          }
        ),
      ])

      const toolsData =
        await toolsRes.json()

      const dashboardData =
        await dashboardRes.json()

      // ========================================================
      // NORMALIZE TOOLS
      // ========================================================

      const normalizedTools: Tool[] =
        Array.isArray(toolsData)
          ? toolsData.map((t: any) => ({
              _id: t._id,
              name: t.name,
              quantity: t.quantity,

              status:
                t.quantity === 0
                  ? "unavailable"
                  : t.quantity < 5
                  ? "low stock"
                  : "available",
            }))
          : []

      setTools(normalizedTools)

      // ========================================================
      // DASHBOARD STATISTICS
      // ========================================================

      setStats({
        totalTools:
          dashboardData?.totalTools ??
          normalizedTools.length,

        availableTools:
          dashboardData?.availableTools ??
          0,

        lowStock:
          dashboardData?.lowStock ??
          0,

        unavailable:
          dashboardData?.unavailable ??
          0,

        pending:
          dashboardData?.pending ??
          0,

        approved:
          dashboardData?.approved ??
          0,

        released:
          dashboardData?.released ??
          0,

        returned:
          dashboardData?.returned ??
          0,

        rejected:
          dashboardData?.rejected ??
          0,

        borrowedToday:
          dashboardData?.borrowedToday ??
          0,

        returnedToday:
          dashboardData?.returnedToday ??
          0,
      })
    } catch (err) {
      console.error(
        "Fetch error:",
        err
      )

      setTools([])

      toast.error(
        "Unable to load dashboard data."
      )
    } finally {
      setLoading(false)
    }
  }

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = async () => {
    try {
      await fetch(
        "/api/auth/logout",
        {
          method: "POST",
        }
      )
    } catch (error) {
      console.error(
        "Logout error:",
        error
      )
    }

    router.push(
      "/lab-in-charge"
    )
  }

  // ============================================================
  // LOADING SCREEN
  // ============================================================

  if (loading) {
    return <LabLoadingScreen />
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#fafafa] text-gray-800">

      {/* ====================================================== */}
      {/* TECHNOLOGY BACKGROUND */}
      {/* ====================================================== */}

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

      {/* ====================================================== */}
      {/* DECORATIVE TECHNOLOGY ELEMENTS */}
      {/* ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        {/* TOP CIRCUIT */}

        <div className="absolute left-0 top-[12%] h-px w-[28%] bg-[#800000]/10" />

        <div className="absolute left-[28%] top-[12%] h-24 w-px bg-[#800000]/10" />

        <div className="absolute left-[28%] top-[calc(12%+6rem)] h-px w-24 bg-[#800000]/10" />

        {/* BOTTOM CIRCUIT */}

        <div className="absolute bottom-[18%] right-0 h-px w-[28%] bg-[#800000]/10" />

        <div className="absolute bottom-[18%] right-[28%] h-24 w-px bg-[#800000]/10" />

        <div className="absolute bottom-[calc(18%+6rem)] right-[28%] h-px w-24 bg-[#800000]/10" />

        {/* GOLD NODES */}

        <div className="absolute left-[27.5%] top-[11.4%] h-2 w-2 rounded-full bg-[#FFD700]" />

        <div className="absolute left-[calc(28%+5.5rem)] top-[calc(12%+5.5rem)] h-2 w-2 rounded-full bg-[#FFD700]" />

        <div className="absolute bottom-[17.4%] right-[27.5%] h-2 w-2 rounded-full bg-[#FFD700]" />

        {/* LARGE GEARS */}

        <Settings
          className="absolute -right-28 top-24 h-96 w-96 text-[#800000]/[0.025]"
          strokeWidth={1}
        />

        <Settings
          className="absolute -left-32 bottom-0 h-[28rem] w-[28rem] text-[#800000]/[0.025]"
          strokeWidth={1}
        />

        {/* TECHNOLOGY ICONS */}

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

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-[#800000]/10 bg-white/95 shadow-sm backdrop-blur-md">

        <div className="mx-auto max-w-[1500px] px-5 sm:px-7 lg:px-10">

          <div className="flex h-[76px] items-center justify-between gap-4">

            {/* LEFT */}

            <div className="flex min-w-0 items-center gap-3">

              {/* LOGO */}

              <div
                className="
                  relative
                  flex
                  h-[54px]
                  w-[54px]
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-xl
                  border
                  border-[#FFD700]/70
                  bg-white
                  shadow-sm
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

                <img
                  src="/logo/OfficialLogo.png"
                  alt="Lab Borrowing System Logo"
                  className="relative z-10 h-[43px] w-[43px] object-contain"
                />

              </div>

              {/* TITLE */}

              <div className="min-w-0">

                <div className="flex items-center gap-2">

                  <h1 className="truncate text-lg font-bold text-[#800000] sm:text-xl">
                    Lab-in-Charge
                  </h1>

                  <span className="hidden items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#800000]/50 sm:flex">

                    <Activity className="h-3 w-3" />

                    Dashboard

                  </span>

                </div>

                <p className="truncate text-xs text-gray-500 sm:text-sm">
                  Inventory & Request Management
                </p>

              </div>

            </div>

            {/* RIGHT */}

            <div className="flex items-center gap-2">

              {/* DESKTOP REFRESH */}

              <Button
                variant="ghost"
                onClick={fetchData}
                className="
                  hidden
                  h-9
                  px-3
                  text-gray-500
                  hover:bg-[#800000]/5
                  hover:text-[#800000]
                  sm:flex
                "
                title="Refresh dashboard"
              >

                <RefreshCw className="mr-2 h-4 w-4" />

                Refresh

              </Button>

              {/* MOBILE REFRESH */}

              <Button
                variant="ghost"
                size="icon"
                onClick={fetchData}
                className="
                  h-9
                  w-9
                  text-gray-500
                  hover:bg-[#800000]/5
                  hover:text-[#800000]
                  sm:hidden
                "
                title="Refresh dashboard"
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

        {/* GOLD ACCENT */}

        <div className="h-[2px] bg-gradient-to-r from-[#800000] via-[#FFD700] to-[#800000]" />

      </header>

      {/* ====================================================== */}
      {/* MAIN */}
      {/* ====================================================== */}

      <main className="relative z-10 mx-auto max-w-[1500px] px-5 py-7 sm:px-7 lg:px-10">

        {/* ====================================================
            PAGE INTRO
        ==================================================== */}

        <section className="mb-7">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="mb-2 flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />

                <span className="text-xs font-semibold text-green-600">
                  System Ready
                </span>

              </div>

              <h2 className="text-2xl font-bold tracking-tight text-[#800000] sm:text-3xl">
                Laboratory Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Monitor laboratory inventory and manage student borrowing requests.
              </p>

            </div>

            <div className="hidden items-center gap-2 text-xs text-gray-400 md:flex">

              <CircuitBoard className="h-4 w-4 text-[#800000]/50" />

              Laboratory Technology Platform

            </div>

          </div>

        </section>

        {/* ====================================================
            INVENTORY STATS
        ==================================================== */}

        <section className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

          <DashboardStat
            title="Total Tools"
            value={tools.length}
            label="tool types"
            icon={
              <Package className="h-5 w-5" />
            }
            accent="maroon"
          />

          <DashboardStat
            title="Available"
            value={stats.availableTools}
            label="items"
            icon={
              <Boxes className="h-5 w-5" />
            }
            accent="green"
          />

          <DashboardStat
            title="Low Stock"
            value={stats.lowStock}
            label="items"
            icon={
              <AlertCircle className="h-5 w-5" />
            }
            accent="gold"
          />

          <DashboardStat
            title="Unavailable"
            value={stats.unavailable}
            label="items"
            icon={
              <Package className="h-5 w-5" />
            }
            accent="red"
          />

        </section>

        {/* ====================================================
            REQUEST STATS
        ==================================================== */}

        <section className="mb-8">

          <div className="mb-4 flex items-center gap-3">

            <div className="h-px flex-1 bg-gray-200" />

            <div className="flex items-center gap-2 px-3">

              <Activity className="h-4 w-4 text-[#800000]" />

              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#800000]/60">
                Request Activity
              </span>

            </div>

            <div className="h-px flex-1 bg-gray-200" />

          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">

            <SmallStat
              title="Pending"
              value={stats.pending}
              label="requests"
              icon={
                <User className="h-4 w-4" />
              }
              iconClass="bg-blue-50 text-blue-600"
            />

            <SmallStat
              title="Approved"
              value={stats.approved}
              label="requests"
              icon={
                <ShieldCheck className="h-4 w-4" />
              }
              iconClass="bg-green-50 text-green-600"
            />

            <SmallStat
              title="Released"
              value={stats.released}
              label="borrowed"
              icon={
                <Package className="h-4 w-4" />
              }
              iconClass="bg-indigo-50 text-indigo-600"
            />

            <SmallStat
              title="Returned"
              value={stats.returned}
              label="completed"
              icon={
                <RefreshCw className="h-4 w-4" />
              }
              iconClass="bg-purple-50 text-purple-600"
            />

            <SmallStat
              title="Rejected"
              value={stats.rejected}
              label="requests"
              icon={
                <AlertCircle className="h-4 w-4" />
              }
              iconClass="bg-red-50 text-red-600"
            />

          </div>

        </section>

        {/* ====================================================
            TODAY
        ==================================================== */}

        <section className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">

          <TodayCard
            title="Borrowed Today"
            value={stats.borrowedToday}
            icon={
              <Package className="h-5 w-5" />
            }
            accent="cyan"
          />

          <TodayCard
            title="Returned Today"
            value={stats.returnedToday}
            icon={
              <RefreshCw className="h-5 w-5" />
            }
            accent="emerald"
          />

        </section>

        {/* ====================================================
            REQUEST MANAGER
        ==================================================== */}

        <section className="mb-8">

          <div className="mb-4 flex items-center gap-2">

            <div className="h-6 w-1 rounded-full bg-[#800000]" />

            <h2 className="text-xl font-bold text-[#800000]">
              Borrowing Requests
            </h2>

          </div>

          <RequestsManager />

        </section>

        {/* ====================================================
            REQUEST HISTORY
        ==================================================== */}

        <section className="mb-8">

          <div className="mb-4 flex items-center gap-2">

            <div className="h-6 w-1 rounded-full bg-[#800000]" />

            <h2 className="text-xl font-bold text-[#800000]">
              Request History
            </h2>

          </div>

          <HistoryManager />

        </section>

        {/* ====================================================
            TOOL LIST
        ==================================================== */}

        <section className="mb-8">

          <div className="mb-4 flex items-center gap-2">

            <div className="h-6 w-1 rounded-full bg-[#800000]" />

            <h2 className="text-xl font-bold text-[#800000]">
              Tool Inventory
            </h2>

          </div>

          <ToolList />

        </section>

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
// LOADING SCREEN
// ============================================================

function LabLoadingScreen() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fafafa]">

      {/* TECHNOLOGY GRID */}

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

      {/* DECORATIONS */}

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

        <FlaskConical
          className="absolute left-[17%] top-[30%] h-8 w-8 text-[#800000]/[0.05]"
          strokeWidth={1.5}
        />

        <Wrench
          className="absolute bottom-[30%] right-[15%] h-8 w-8 text-[#800000]/[0.05]"
          strokeWidth={1.5}
        />

      </div>

      {/* LOADING */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5">

        <div className="flex flex-col items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#800000] shadow-lg">

            <Spinner className="h-7 w-7 border-2 border-[#FFD700]/30 border-t-[#FFD700]" />

          </div>

          <div className="text-center">

            <p className="font-semibold text-[#800000]">
              Loading laboratory dashboard...
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Preparing inventory and request data...
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}

// ============================================================
// DASHBOARD STAT
// ============================================================

function DashboardStat({
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
  accent:
    | "maroon"
    | "green"
    | "gold"
    | "red"
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

    gold: {
      border: "border-[#FFD700]/40",
      iconBg: "bg-[#FFD700]/10",
      iconColor: "text-[#b88600]",
      value: "text-[#b88600]",
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

// ============================================================
// SMALL REQUEST STAT
// ============================================================

function SmallStat({
  title,
  value,
  label,
  icon,
  iconClass,
}: {
  title: string
  value: number
  label: string
  icon: React.ReactNode
  iconClass: string
}) {
  return (
    <Card className="rounded-xl border border-gray-100 bg-white shadow-sm">

      <CardContent className="p-4">

        <div className="flex items-center justify-between">

          <span className="text-sm font-medium text-gray-500">
            {title}
          </span>

          <div
            className={`
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              ${iconClass}
            `}
          >
            {icon}
          </div>

        </div>

        <div className="mt-3 flex items-end gap-2">

          <span className="text-2xl font-bold text-gray-800">
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

// ============================================================
// TODAY CARD
// ============================================================

function TodayCard({
  title,
  value,
  icon,
  accent,
}: {
  title: string
  value: number
  icon: React.ReactNode
  accent: "cyan" | "emerald"
}) {
  const styles = {
    cyan: {
      bg: "bg-cyan-50",
      text: "text-cyan-600",
      border: "border-cyan-100",
    },

    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-100",
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
      `}
    >

      <CardContent className="p-5">

        <div className="flex items-center gap-3">

          <div
            className={`
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-lg
              ${style.bg}
              ${style.text}
            `}
          >
            {icon}
          </div>

          <div>

            <p className="text-sm text-gray-500">
              {title}
            </p>

            <p
              className={`
                text-2xl
                font-bold
                ${style.text}
              `}
            >
              {value}
            </p>

          </div>

        </div>

      </CardContent>

    </Card>
  )
}