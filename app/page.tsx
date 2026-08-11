"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import {
  Menu,
  Loader2,
  BookOpen,
  MessageSquare,
  Users,
  FlaskConical,
  HelpCircle,
  Phone,
  Info,
  Cpu,
  CircuitBoard,
  Database,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Boxes,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function LandingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(false)

  const handleClick = (key: string) => {
    setLoading(key)
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] text-gray-800 overflow-hidden">

      {/* ========================================================= */}
      {/* DESKTOP SIDEBAR */}
      {/* ========================================================= */}

      <aside
        className={`
          hidden md:flex
          fixed
          left-0
          top-0
          h-screen
          z-40
          flex-col
          bg-[#800000]
          text-[#FFD700]
          shadow-[8px_0_30px_rgba(128,0,0,0.12)]
          border-r
          border-[#FFD700]/10
          transition-all
          duration-300
          ${collapsed ? "w-20" : "w-64"}
        `}
      >
        <LogoSection collapsed={collapsed} />

        <SidebarMenu
          loading={loading}
          setLoading={setLoading}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </aside>

      {/* ========================================================= */}
      {/* MOBILE SIDEBAR */}
      {/* ========================================================= */}

      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="
                bg-[#800000]
                hover:bg-[#660000]
                text-[#FFD700]
                rounded-xl
                shadow-lg
                border
                border-[#FFD700]/20
              "
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="
              p-0
              bg-[#800000]
              text-[#FFD700]
              w-72
              border-r
              border-[#FFD700]/10
            "
          >
            <LogoSection collapsed={false} />

            <SidebarMenu
              loading={loading}
              setLoading={setLoading}
              collapsed={false}
              setCollapsed={() => {}}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* ========================================================= */}
      {/* MAIN CONTENT */}
      {/* ========================================================= */}

      <main
        className={`
          min-h-screen
          transition-all
          duration-300
          ${collapsed ? "md:ml-20" : "md:ml-64"}
        `}
      >

        {/* TECH BACKGROUND */}

        <div
          className="fixed inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(#800000 1px, transparent 1px),
              linear-gradient(90deg, #800000 1px, transparent 1px)
            `,
            backgroundSize: "36px 36px",
            left: collapsed ? "5rem" : "16rem",
          }}
        />

        <div className="relative max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12 py-6 md:py-10">

          {/* ===================================================== */}
          {/* HERO */}
          {/* ===================================================== */}

          <section
            className="
              relative
              overflow-hidden
              rounded-[28px]
              bg-white
              border
              border-[#800000]/10
              shadow-[0_20px_60px_rgba(128,0,0,0.08)]
            "
          >

            {/* Gold top line */}

            <div className="h-1.5 bg-gradient-to-r from-[#800000] via-[#FFD700] to-[#800000]" />

            {/* Decorative circuit lines */}

            <div className="absolute right-0 top-0 w-[300px] h-[300px] pointer-events-none opacity-20">

              <div className="absolute top-16 right-10 w-32 h-px bg-[#800000]" />
              <div className="absolute top-16 right-10 w-px h-20 bg-[#800000]" />

              <div className="absolute top-36 right-20 w-20 h-px bg-[#FFD700]" />
              <div className="absolute top-36 right-20 w-px h-16 bg-[#FFD700]" />

              <div className="absolute top-56 right-32 w-16 h-px bg-[#800000]" />

              <div className="absolute top-[62px] right-[38px] w-2.5 h-2.5 rounded-full bg-[#800000]" />
              <div className="absolute top-[132px] right-[78px] w-2.5 h-2.5 rounded-full bg-[#FFD700]" />
              <div className="absolute top-[212px] right-[125px] w-2.5 h-2.5 rounded-full bg-[#800000]" />

            </div>

            <div className="relative grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-center px-7 py-10 sm:px-10 md:px-14 md:py-14">

              {/* LEFT */}

              <div>

                <Badge
                  className="
                    mb-5
                    bg-[#800000]/5
                    text-[#800000]
                    border-[#800000]/15
                    px-4
                    py-1.5
                    rounded-full
                  "
                >
                  <Cpu className="w-3.5 h-3.5 mr-2" />
                  Laboratory Technology Platform
                </Badge>

                <h1
                  className="
                    text-4xl
                    sm:text-5xl
                    lg:text-6xl
                    font-bold
                    tracking-tight
                    text-[#800000]
                    leading-[1.05]
                  "
                >
                  Lab Borrowing
                  <span className="block text-gray-800">
                    System
                  </span>
                </h1>

                <p
                  className="
                    mt-5
                    max-w-xl
                    text-gray-500
                    text-sm
                    sm:text-base
                    leading-7
                  "
                >
                  A centralized laboratory management platform for
                  students and lab-in-charge personnel to manage,
                  monitor, and streamline laboratory equipment borrowing.
                </p>

                {/* ACCESS BUTTONS */}

                <div className="flex flex-col sm:flex-row gap-3 mt-8">

                  <Link
                    href="/student/login"
                    onClick={() => handleClick("student")}
                  >
                    <Button
                      disabled={loading === "student"}
                      className="
                        w-full
                        sm:w-auto
                        h-12
                        px-7
                        bg-[#800000]
                        hover:bg-[#660000]
                        text-[#FFD700]
                        rounded-xl
                        shadow-lg
                        shadow-[#800000]/20
                        font-semibold
                      "
                    >
                      {loading === "student" ? (
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      ) : (
                        <Users className="mr-2 w-4 h-4" />
                      )}

                      Student Portal

                      {!loading && (
                        <ArrowRight className="ml-3 w-4 h-4" />
                      )}
                    </Button>
                  </Link>

                  <Link
                    href="/lab-in-charge"
                    onClick={() => handleClick("lab")}
                  >
                    <Button
                      disabled={loading === "lab"}
                      variant="outline"
                      className="
                        w-full
                        sm:w-auto
                        h-12
                        px-7
                        rounded-xl
                        border-[#800000]/20
                        text-[#800000]
                        hover:bg-[#800000]
                        hover:text-[#FFD700]
                        transition-all
                      "
                    >
                      {loading === "lab" ? (
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      ) : (
                        <FlaskConical className="mr-2 w-4 h-4" />
                      )}

                      Lab-in-Charge
                    </Button>
                  </Link>

                </div>

                {/* SYSTEM STATUS */}

                <div className="flex items-center gap-5 mt-8 text-xs text-gray-400">

                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    System Ready
                  </div>

                  <div className="h-4 w-px bg-gray-200" />

                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#800000]" />
                    Secure Access
                  </div>

                </div>

              </div>

              {/* RIGHT TECHNOLOGY VISUAL */}

              <div className="hidden lg:flex justify-center">

                <div className="relative w-[330px] h-[330px]">

                  {/* Outer rings */}

                  <div className="absolute inset-4 rounded-full border border-[#800000]/10" />

                  <div className="absolute inset-10 rounded-full border border-[#FFD700]/30" />

                  <div className="absolute inset-16 rounded-full border border-[#800000]/10 border-dashed" />

                  {/* Logo container */}

                  <div
                    className="
                      absolute
                      inset-[85px]
                      rounded-[30px]
                      bg-white
                      border
                      border-[#800000]/10
                      shadow-[0_20px_50px_rgba(128,0,0,0.12)]
                      flex
                      items-center
                      justify-center
                    "
                  >

                    <div
                      className="
                        absolute
                        inset-3
                        rounded-[24px]
                        bg-[#800000]/[0.025]
                        border
                        border-[#FFD700]/20
                      "
                    />

                    <Image
                      src="/logo/OfficialLogo.png"
                      alt="Lab Borrowing System Logo"
                      width={200}
                      height={180}
                      priority
                      className="relative z-10 w-44 h-44 object-contain"
                    />

                  </div>

                  {/* Technology nodes */}

                  <div
                    className="
                      absolute
                      top-7
                      left-1/2
                      -translate-x-1/2
                      w-11
                      h-11
                      rounded-xl
                      bg-[#800000]
                      text-[#FFD700]
                      flex
                      items-center
                      justify-center
                      shadow-lg
                    "
                  >
                    <Cpu className="w-5 h-5" />
                  </div>

                  <div
                    className="
                      absolute
                      bottom-8
                      left-10
                      w-11
                      h-11
                      rounded-xl
                      bg-white
                      border
                      border-[#800000]/15
                      text-[#800000]
                      flex
                      items-center
                      justify-center
                      shadow-md
                    "
                  >
                    <Database className="w-5 h-5" />
                  </div>

                  <div
                    className="
                      absolute
                      bottom-8
                      right-10
                      w-11
                      h-11
                      rounded-xl
                      bg-[#FFD700]
                      text-[#800000]
                      flex
                      items-center
                      justify-center
                      shadow-md
                    "
                  >
                    <CircuitBoard className="w-5 h-5" />
                  </div>

                </div>

              </div>

            </div>
          </section>

          {/* ===================================================== */}
          {/* QUICK ACCESS */}
          {/* ===================================================== */}

          <div className="flex items-center justify-between mt-10 mb-5">

            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#800000]/50">
                System Resources
              </p>

              <h2 className="text-xl font-bold text-[#800000] mt-1">
                Quick Access
              </h2>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
              <Boxes className="w-4 h-4" />
              Laboratory Services
            </div>

          </div>

          <Separator className="mb-6 bg-[#800000]/10" />

          {/* ===================================================== */}
          {/* FEATURE CARDS */}
          {/* ===================================================== */}

          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            <Link href="/help" className="group h-full">

              <FeatureCard
                title="Help Center"
                desc="Access guides, instructions, and frequently asked questions."
                icon={<BookOpen className="w-6 h-6" />}
                accent="blue"
              />

            </Link>

            <Link href="/rate-us" className="group h-full">

              <FeatureCard
                title="System Feedback"
                desc="Share your experience and help improve the laboratory system."
                icon={<MessageSquare className="w-6 h-6" />}
                accent="gold"
              />

            </Link>

            <Link href="/contact" className="group h-full">

              <FeatureCard
                title="Technical Support"
                desc="Contact the system team for assistance and inquiries."
                icon={<Phone className="w-6 h-6" />}
                accent="maroon"
              />

            </Link>

          </section>

          {/* ===================================================== */}
          {/* FOOTER */}
          {/* ===================================================== */}

          <footer className="mt-10 pb-4">

            <div className="h-px bg-gradient-to-r from-transparent via-[#800000]/10 to-transparent" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 text-[11px] text-gray-400">

              <p>
                Laboratory Borrowing Management System
              </p>

              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                System Ready
              </div>

            </div>

          </footer>

        </div>
      </main>
    </div>
  )
}

/* ============================================================= */
/* LOGO SECTION */
/* ============================================================= */

function LogoSection({
  collapsed,
}: {
  collapsed?: boolean
}) {
  return (
    <div
      className={`
        flex
        items-center
        justify-center
        transition-all
        duration-300
        ${collapsed ? "px-2 py-5" : "px-4 py-6"}
      `}
    >

      <div
        className={`
          relative
          flex
          items-center
          justify-center
          bg-white
          rounded-2xl
          border-2
          border-[#FFD700]/70
          shadow-[0_10px_30px_rgba(0,0,0,0.15)]
          overflow-hidden
          transition-all
          duration-300

          ${
            collapsed
              ? "w-14 h-14 p-1.5"
              : "w-full max-w-[210px] h-[185px] px-4 py-5"
          }
        `}
      >

        {/* subtle tech grid */}

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(#800000 1px, transparent 1px),
              linear-gradient(90deg, #800000 1px, transparent 1px)
            `,
            backgroundSize: "14px 14px",
          }}
        />

        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FFD700]" />
        <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-[#800000]" />

        <Image
          src="/logo/OfficialLogo.png"
          alt="Lab Borrowing System Logo"
          width={180}
          height={120}
          priority
          className={`
            relative
            z-10
            object-contain
            transition-all
            duration-300

            ${
              collapsed
                ? "w-11 h-11"
                : "w-[250px] h-[240px]"
            }
          `}
        />

      </div>
    </div>
  )
}

/* ============================================================= */
/* SIDEBAR MENU */
/* ============================================================= */

function SidebarMenu({
  loading,
  setLoading,
  collapsed,
  setCollapsed,
}: {
  loading: string | null
  setLoading: (v: string | null) => void
  collapsed: boolean
  setCollapsed: (v: boolean) => void
}) {

  const menu = [
    {
      name: "Student",
      href: "/student/login",
      icon: Users,
    },
    {
      name: "Lab-in-Charge",
      href: "/lab-in-charge",
      icon: FlaskConical,
    },
    {
      name: "Help",
      href: "/help",
      icon: HelpCircle,
    },
    {
      name: "Rate Us",
      href: "/rate-us",
      icon: MessageSquare,
    },
    {
      name: "About",
      href: "/about",
      icon: Info,
    },
    {
      name: "Contact",
      href: "/contact",
      icon: Phone,
    },
  ]

  return (
    <nav className="flex flex-col flex-1 px-3">

      {/* MENU HEADER */}

      <div
        className={`
          flex
          items-center
          mb-4
          ${
            collapsed
              ? "justify-center"
              : "justify-between px-2"
          }
        `}
      >

        {!collapsed && (
          <div>

            <p className="text-[10px] uppercase tracking-[0.2em] text-[#FFD700]/60 font-semibold">
              Navigation
            </p>

            <div className="mt-1 h-[2px] w-8 bg-[#FFD700] rounded-full" />

          </div>
        )}

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="
            flex
            items-center
            justify-center
            w-8
            h-8
            rounded-lg
            bg-white/5
            border
            border-[#FFD700]/20
            text-[#FFD700]
            hover:bg-[#FFD700]/15
            hover:border-[#FFD700]/40
            transition-all
            duration-200
          "
          aria-label={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
        >
          <span className="text-sm font-semibold">
            {collapsed ? "→" : "←"}
          </span>
        </button>

      </div>

      {/* MENU */}

      <div className="space-y-2">

        {menu.map((item) => {

          const Icon = item.icon
          const isLoading = loading === item.name

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setLoading(item.name)}
              className={`
                group
                relative
                flex
                items-center
                ${
                  collapsed
                    ? "justify-center px-2"
                    : "gap-3 px-3"
                }
                h-11
                rounded-xl
                text-sm
                font-medium
                text-white/85
                border
                border-transparent

                hover:bg-[#FFD700]/10
                hover:border-[#FFD700]/15
                hover:text-[#FFD700]

                transition-all
                duration-200

                ${
                  isLoading
                    ? "bg-[#FFD700]/15 text-[#FFD700] border-[#FFD700]/20"
                    : ""
                }
              `}
            >

              {/* ACTIVE INDICATOR */}

              <span
                className={`
                  absolute
                  left-0
                  top-1/2
                  -translate-y-1/2
                  w-[3px]
                  rounded-r-full
                  bg-[#FFD700]
                  transition-all
                  duration-200

                  ${
                    isLoading
                      ? "h-7 opacity-100"
                      : "h-0 opacity-0 group-hover:h-5 group-hover:opacity-100"
                  }
                `}
              />

              {/* ICON */}

              <span
                className={`
                  flex
                  items-center
                  justify-center
                  shrink-0
                  w-8
                  h-8
                  rounded-lg
                  bg-white/5
                  border
                  border-white/5
                  text-[#FFD700]

                  group-hover:bg-[#FFD700]/15
                  group-hover:border-[#FFD700]/20

                  transition-all
                  duration-200

                  ${
                    isLoading
                      ? "bg-[#FFD700]/15 border-[#FFD700]/20"
                      : ""
                  }
                `}
              >
                <Icon className="w-4 h-4" />
              </span>

              {!collapsed && (
                <span className="truncate">
                  {item.name}
                </span>
              )}

              {!collapsed && isLoading && (
                <span className="ml-auto">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FFD700]" />
                </span>
              )}

            </Link>
          )
        })}

      </div>

      {/* SIDEBAR FOOTER */}

      {!collapsed && (
        <div className="mt-auto pb-5 pt-6">

          <div className="mx-2 h-px bg-gradient-to-r from-transparent via-[#FFD700]/25 to-transparent" />

          <div className="mt-4 px-2 text-center">

            <div className="flex justify-center mb-2">
              <CircuitBoard className="w-4 h-4 text-[#FFD700]/40" />
            </div>

            <p className="text-[10px] uppercase tracking-[0.18em] text-[#FFD700]/40">
              Laboratory
            </p>

            <p className="mt-1 text-[10px] text-white/30">
              Borrowing Management System
            </p>

          </div>

        </div>
      )}

    </nav>
  )
}

/* ============================================================= */
/* FEATURE CARD */
/* ============================================================= */

function FeatureCard({
  title,
  desc,
  icon,
  accent,
}: {
  title: string
  desc: string
  icon: React.ReactNode
  accent: "blue" | "gold" | "maroon"
}) {

  const styles = {
    blue: {
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      border: "group-hover:border-blue-200",
      glow: "group-hover:shadow-blue-500/10",
    },

    gold: {
      iconBg: "bg-[#FFD700]/10",
      iconColor: "text-[#b88600]",
      border: "group-hover:border-[#FFD700]/40",
      glow: "group-hover:shadow-[#FFD700]/10",
    },

    maroon: {
      iconBg: "bg-[#800000]/5",
      iconColor: "text-[#800000]",
      border: "group-hover:border-[#800000]/20",
      glow: "group-hover:shadow-[#800000]/10",
    },
  }

  const style = styles[accent]

  return (
    <Card
      className={`
        relative
        h-full
        overflow-hidden
        bg-white
        border
        border-gray-100
        rounded-2xl
        shadow-sm

        ${style.border}
        ${style.glow}

        group-hover:shadow-xl
        group-hover:-translate-y-1

        transition-all
        duration-300
      `}
    >

      {/* top accent */}

      <div className="absolute left-0 top-0 w-full h-1 bg-gradient-to-r from-[#800000] to-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity" />

      <CardContent className="p-7">

        <div className="flex items-start gap-5">

          {/* ICON */}

          <div
            className={`
              shrink-0
              w-14
              h-14
              rounded-xl
              ${style.iconBg}
              ${style.iconColor}
              flex
              items-center
              justify-center
              border
              border-current/10

              group-hover:scale-105

              transition-transform
              duration-300
            `}
          >
            {icon}
          </div>

          {/* CONTENT */}

          <div className="min-w-0">

            <h3
              className="
                font-bold
                text-[#800000]
                text-lg
                group-hover:text-[#660000]
                transition-colors
              "
            >
              {title}
            </h3>

            <p
              className="
                text-gray-500
                text-sm
                leading-6
                mt-2
              "
            >
              {desc}
            </p>

            <div
              className="
                flex
                items-center
                gap-1.5
                mt-4
                text-xs
                font-semibold
                text-gray-400
                group-hover:text-[#800000]
                transition-all
              "
            >
              <span>
                Open
              </span>

              <ChevronRight
                className="
                  w-3.5
                  h-3.5
                  group-hover:translate-x-1
                  transition-transform
                "
              />

            </div>

          </div>

        </div>

      </CardContent>

    </Card>
  )
}