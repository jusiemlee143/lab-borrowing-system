"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import {
  Info,
  LogOut,
  Target,
  Eye,
  Cpu,
  ClipboardList,
  Shield,
  Activity,
  CircuitBoard,
  Settings,
  FlaskConical,
  Wrench,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"

// ============================================================
// ABOUT PAGE
// ============================================================

export default function AboutPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)

  // ============================================================
  // PAGE LOADING
  // ============================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  // ============================================================
  // LOADING SCREEN
  // ============================================================

  if (loading) {
    return <AboutLoadingScreen />
  }

  // ============================================================
  // MAIN PAGE
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
                  className="
                    relative
                    z-10
                    h-[38px]
                    w-[38px]
                    object-contain
                    sm:h-[43px]
                    sm:w-[43px]
                  "
                />

              </div>

              {/* TITLE */}

              <div className="min-w-0">

                <div className="flex items-center gap-2">

                  <h1 className="truncate text-base font-bold text-[#800000] sm:text-xl">
                    About the System
                  </h1>

                  <span className="hidden items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#800000]/50 md:flex">

                    <Activity className="h-3 w-3" />

                    Information

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

              {/* EXIT */}

              <Button
                onClick={() => router.push("/")}
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
                  Exit
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
                  System Information
                </span>

              </div>

              <h2 className="text-2xl font-bold tracking-tight text-[#800000] sm:text-3xl">
                About the Laboratory Borrowing System
              </h2>

              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Learn more about the purpose, vision, and features of the
                laboratory equipment management platform.
              </p>

            </div>

            <div className="hidden items-center gap-2 text-xs text-gray-400 md:flex">

              <CircuitBoard className="h-4 w-4 text-[#800000]/50" />

              Laboratory Technology Platform

            </div>

          </div>

        </section>

        {/* ====================================================
            HERO
        ==================================================== */}

        <Card className="relative mb-6 overflow-hidden rounded-2xl border border-[#800000]/10 bg-white shadow-sm">

          <div className="pointer-events-none absolute inset-0">

            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#800000]/[0.05] to-transparent" />

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

                <Info className="h-6 w-6" />

              </div>

              <div>

                <h3 className="text-lg font-bold text-[#800000]">
                  Laboratory Borrowing System
                </h3>

                <p className="mt-1 max-w-3xl text-sm leading-relaxed text-gray-500">
                  The Laboratory Borrowing System is designed to streamline
                  the process of borrowing laboratory tools and equipment.
                  It allows students to easily request items while enabling
                  lab administrators to monitor availability, manage
                  borrowing slips, and maintain organized records.
                </p>

              </div>

            </div>

          </CardContent>

        </Card>

        {/* ====================================================
            MISSION & VISION
        ==================================================== */}

        <section className="mb-6 grid gap-4 md:grid-cols-2">

          {/* MISSION */}

          <Card
            className="
              rounded-2xl
              border
              border-[#800000]/10
              bg-white
              shadow-sm
              transition-shadow
              hover:shadow-md
            "
          >

            <CardContent className="p-5 sm:p-6">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                  <Target className="h-6 w-6" />

                </div>

                <div>

                  <h3 className="text-lg font-bold text-[#800000]">
                    Our Mission
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    To provide an efficient and reliable system for managing
                    laboratory equipment borrowing, ensuring students and
                    faculty have quick and organized access to necessary
                    tools.
                  </p>

                </div>

              </div>

            </CardContent>

          </Card>

          {/* VISION */}

          <Card
            className="
              rounded-2xl
              border
              border-[#800000]/10
              bg-white
              shadow-sm
              transition-shadow
              hover:shadow-md
            "
          >

            <CardContent className="p-5 sm:p-6">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">

                  <Eye className="h-6 w-6" />

                </div>

                <div>

                  <h3 className="text-lg font-bold text-[#800000]">
                    Our Vision
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    To modernize laboratory resource management through
                    digital solutions that promote transparency,
                    accountability, and efficiency in academic environments.
                  </p>

                </div>

              </div>

            </CardContent>

          </Card>

        </section>

        {/* ====================================================
            SYSTEM FEATURES
        ==================================================== */}

        <section className="mb-6">

          <div className="mb-4 flex items-center gap-2">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#800000]/5 text-[#800000]">

              <Info className="h-4 w-4" />

            </div>

            <div>

              <h2 className="text-xl font-bold text-[#800000] sm:text-2xl">
                System Features
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Key features that support laboratory resource management.
              </p>

            </div>

          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {/* EQUIPMENT MONITORING */}

            <Card
              className="
                group
                overflow-hidden
                rounded-2xl
                border
                border-gray-200
                bg-white
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-md
              "
            >

              <CardContent className="p-5">

                <div className="flex items-start gap-4">

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-blue-50
                      text-blue-600
                      transition-all
                      duration-200
                      group-hover:bg-[#800000]
                      group-hover:text-[#FFD700]
                    "
                  >

                    <Cpu className="h-5 w-5" />

                  </div>

                  <div>

                    <h3 className="font-bold text-[#800000]">
                      Equipment Monitoring
                    </h3>

                    <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                      Track available and borrowed laboratory tools in
                      real time.
                    </p>

                  </div>

                </div>

              </CardContent>

            </Card>

            {/* BORROWING SLIP */}

            <Card
              className="
                group
                overflow-hidden
                rounded-2xl
                border
                border-gray-200
                bg-white
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-md
              "
            >

              <CardContent className="p-5">

                <div className="flex items-start gap-4">

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-green-50
                      text-green-600
                      transition-all
                      duration-200
                      group-hover:bg-[#800000]
                      group-hover:text-[#FFD700]
                    "
                  >

                    <ClipboardList className="h-5 w-5" />

                  </div>

                  <div>

                    <h3 className="font-bold text-[#800000]">
                      Borrowing Slip System
                    </h3>

                    <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                      Generate and manage borrowing requests digitally.
                    </p>

                  </div>

                </div>

              </CardContent>

            </Card>

            {/* SECURE MANAGEMENT */}

            <Card
              className="
                group
                overflow-hidden
                rounded-2xl
                border
                border-gray-200
                bg-white
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-md
              "
            >

              <CardContent className="p-5">

                <div className="flex items-start gap-4">

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-orange-50
                      text-orange-600
                      transition-all
                      duration-200
                      group-hover:bg-[#800000]
                      group-hover:text-[#FFD700]
                    "
                  >

                    <Shield className="h-5 w-5" />

                  </div>

                  <div>

                    <h3 className="font-bold text-[#800000]">
                      Secure Management
                    </h3>

                    <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                      Ensures proper tracking and accountability of
                      laboratory resources.
                    </p>

                  </div>

                </div>

              </CardContent>

            </Card>

          </div>

        </section>

        {/* ====================================================
            HOW THE SYSTEM WORKS
        ==================================================== */}

        <section className="mb-6">

          <div className="mb-4 flex items-center gap-2">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#800000]/5 text-[#800000]">

              <Activity className="h-4 w-4" />

            </div>

            <div>

              <h2 className="text-xl font-bold text-[#800000] sm:text-2xl">
                How the System Works
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                A simple digital workflow for laboratory equipment borrowing.
              </p>

            </div>

          </div>

          <Card className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            <CardContent className="p-5 sm:p-7">

              <div className="grid gap-6 md:grid-cols-3">

                {/* STEP 1 */}

                <div className="relative">

                  <div className="flex items-start gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#800000] text-sm font-bold text-[#FFD700] shadow-sm">
                      01
                    </div>

                    <div>

                      <h3 className="font-bold text-[#800000]">
                        Browse Equipment
                      </h3>

                      <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                        Students can view the current laboratory inventory
                        and check which equipment is available.
                      </p>

                    </div>

                  </div>

                </div>

                {/* STEP 2 */}

                <div className="relative">

                  <div className="flex items-start gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#800000] text-sm font-bold text-[#FFD700] shadow-sm">
                      02
                    </div>

                    <div>

                      <h3 className="font-bold text-[#800000]">
                        Submit Request
                      </h3>

                      <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                        Students prepare and submit a digital borrower slip
                        containing their requested equipment.
                      </p>

                    </div>

                  </div>

                </div>

                {/* STEP 3 */}

                <div className="relative">

                  <div className="flex items-start gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#800000] text-sm font-bold text-[#FFD700] shadow-sm">
                      03
                    </div>

                    <div>

                      <h3 className="font-bold text-[#800000]">
                        Manage & Track
                      </h3>

                      <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                        Laboratory personnel review requests, manage
                        equipment, and maintain borrowing records.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </CardContent>

          </Card>

        </section>

        {/* ====================================================
            SYSTEM STATUS
        ==================================================== */}

        <Card className="overflow-hidden rounded-2xl border border-[#800000]/10 bg-white shadow-sm">

          <CardContent className="p-5 sm:p-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#800000]/10 text-[#800000]">

                  <FlaskConical className="h-5 w-5" />

                </div>

                <div>

                  <h3 className="font-bold text-[#800000]">
                    Laboratory Borrowing Management System
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Digital platform for efficient laboratory equipment
                    management.
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-2 self-start rounded-full border border-green-200 bg-green-50 px-3 py-1.5 sm:self-auto">

                <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_7px_rgba(34,197,94,0.5)]" />

                <span className="text-xs font-semibold text-green-700">
                  System Ready
                </span>

              </div>

            </div>

          </CardContent>

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
// LOADING SCREEN
// ============================================================

function AboutLoadingScreen() {
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
              Loading system information...
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Please wait...
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}