"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import {
  Menu,
  Loader2,
  BookOpen,
  Star,
  MessageSquare,
  Users,
  FlaskConical,
  HelpCircle,
  Phone,
  Info,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function LandingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(false)

  const handleClick = (key: string) => {
    setLoading(key)
  }

  return (
    <div className="h-screen bg-[#fffaf8] flex overflow-hidden">

      {/* DESKTOP SIDEBAR */}
      <aside
        className={`hidden md:flex bg-[#800000] text-[#FFD700] flex-col fixed h-full shadow-xl z-20 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <LogoSection collapsed={collapsed} />
        <SidebarMenu
          loading={loading}
          setLoading={setLoading}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </aside>

      {/* MOBILE SIDEBAR */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" className="bg-[#800000] hover:bg-[#660000] rounded-xl shadow-lg">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 bg-[#800000] text-[#FFD700] w-64">
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

      {/* MAIN CONTENT */}
      <main
        className={`flex-1 w-full flex flex-col overflow-hidden transition-all duration-300 ${
          collapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >

        <div
          className="fixed inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #800000 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            left: collapsed ? "5rem" : "16rem",
          }}
        />

        <div className="relative flex-1 flex flex-col p-6 md:px-10 md:py-8 max-w-[1800px] mx-auto w-full min-h-0">

          {/* HERO */}
          <section className="flex-none relative overflow-hidden bg-white rounded-2xl shadow-lg border border-red-100/50 hover:shadow-2xl transition-shadow duration-500">

            <div className="relative px-8 py-8 md:px-12 md:py-10 text-center">

              <Badge className="mb-4 bg-[#FFD700]/15 text-[#800000] border-[#FFD700]/30 font-medium px-3.5 py-1 text-xs">
                <FlaskConical className="w-3.5 h-3.5 mr-1.5" />
                Lab Management
              </Badge>

              <h1 className="text-3xl md:text-[2.5rem] font-bold text-[#800000] mb-3">
                Lab Borrowing System
              </h1>

              <p className="text-gray-500 max-w-xl mx-auto mb-8 text-[15px]">
                Manage student and lab-in-charge accounts, track borrowed items,
                and streamline laboratory operations efficiently.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">

                <Link href="/student" onClick={() => handleClick("student")}>
                  <Button
                    className="bg-[#800000] hover:bg-[#660000] w-full sm:w-auto px-9 py-2.5"
                    disabled={loading === "student"}
                  >
                    {loading === "student" && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                    <Users className="w-4 h-4 mr-2" />
                    Student
                  </Button>
                </Link>

                <Link href="/lab-in-charge" onClick={() => handleClick("lab")}>
                  <Button
                    variant="outline"
                    className="border-[#800000]/30 text-[#800000] w-full sm:w-auto px-9 py-2.5"
                    disabled={loading === "lab"}
                  >
                    {loading === "lab" && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                    <FlaskConical className="w-4 h-4 mr-2" />
                    Lab-in-Charge
                  </Button>
                </Link>

              </div>
            </div>
          </section>

          <Separator className="my-8 bg-red-100/60" />

          {/* QUICK ACCESS */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#800000]">
              Quick Access
            </h2>
          </div>

          {/* FEATURES */}
          <section className="flex-1 grid gap-7 sm:grid-cols-2 lg:grid-cols-3 min-h-0 auto-rows-fr">

            <Link href="/help" className="h-full">
              <FeatureCard
                title="Help"
                desc="Access guides and FAQs to navigate the system smoothly."
                icon={<BookOpen className="w-6 h-6" />}
                gradient="from-blue-500 to-blue-600"
                shadowColor="shadow-blue-500/20"
                hoverColor="hover:text-blue-600"
              />
            </Link>

            <Link href="/rate-us" className="h-full">
              <FeatureCard
                title="Rate Us"
                desc="Share your experience and feedback about the system."
                icon={<Star className="w-6 h-6" />}
                gradient="from-amber-400 to-orange-500"
                shadowColor="shadow-amber-500/20"
                hoverColor="hover:text-amber-600"
              />
            </Link>

            <Link href="/contact" className="h-full">
              <FeatureCard
                title="Contact"
                desc="Reach out anytime for assistance or inquiries."
                icon={<MessageSquare className="w-6 h-6" />}
                gradient="from-[#800000] to-[#a00000]"
                shadowColor="shadow-[#800000]/20"
                hoverColor="hover:text-[#800000]"
              />
            </Link>

          </section>
        </div>
      </main>
    </div>
  )
}

/* ================= LOGO ================= */

function LogoSection({ collapsed }: { collapsed?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center transition-all duration-300 ${
        collapsed ? "px-2 py-4" : "px-4 py-6"
      }`}
    >
      <div
        className={`relative flex items-center justify-center bg-white rounded-2xl border-2 border-[#FFD700] shadow-lg transition-all duration-300 ${
          collapsed
            ? "w-14 h-14 p-1.5"
            : "w-full max-w-[210x] h-[200px] px-4 py-5"
        }`}
      >
        {/* Subtle gold glow */}
        <div className="absolute inset-0 rounded-2xl bg-[#FFD700]/10 pointer-events-none" />

        <Image
          src="/logo/OfficialLogo.png"
          alt="Lab Borrowing System Logo"
          width={collapsed ? 48 : 170}
          height={collapsed ? 48 : 100}
          priority
          className={`relative z-10 object-contain transition-all duration-300 ${
            collapsed ? "w-11 h-11" : "w-[170px] h-auto"
          }`}
        />
      </div>
    </div>
  )
}
/* ================= SIDEBAR ================= */

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
      href: "/student",
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
      icon: Star,
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

      {/* ================= MENU HEADER ================= */}
      <div
        className={`flex items-center mb-4 ${
          collapsed ? "justify-center" : "justify-between px-2"
        }`}
      >
        {!collapsed && (
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#FFD700]/60 font-semibold">
              Navigation
            </p>

            <div className="mt-1 h-[2px] w-8 bg-[#FFD700] rounded-full" />
          </div>
        )}

        {/* COLLAPSE BUTTON */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="
            flex items-center justify-center
            w-8 h-8
            rounded-lg
            bg-white/5
            border border-[#FFD700]/20
            text-[#FFD700]
            hover:bg-[#FFD700]/15
            hover:border-[#FFD700]/40
            transition-all duration-200
            shadow-sm
          "
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="text-sm font-semibold">
            {collapsed ? "→" : "←"}
          </span>
        </button>
      </div>

      {/* ================= MENU ITEMS ================= */}
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
                flex items-center
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

                border border-transparent

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

              {/* GOLD ACTIVE / HOVER INDICATOR */}
              <span
                className={`
                  absolute
                  left-0
                  top-1/2
                  -translate-y-1/2
                  w-[3px]
                  rounded-r-full
                  bg-[#FFD700]
                  transition-all duration-200
                  ${
                    isLoading
                      ? "h-7 opacity-100"
                      : "h-0 opacity-0 group-hover:h-5 group-hover:opacity-100"
                  }
                `}
              />

              {/* ICON CONTAINER */}
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
                  border border-white/5

                  text-[#FFD700]

                  group-hover:bg-[#FFD700]/15
                  group-hover:border-[#FFD700]/20

                  transition-all duration-200

                  ${
                    isLoading
                      ? "bg-[#FFD700]/15 border-[#FFD700]/20"
                      : ""
                  }
                `}
              >
                <Icon className="w-4 h-4" />
              </span>

              {/* TEXT */}
              {!collapsed && (
                <span className="truncate">
                  {item.name}
                </span>
              )}

              {/* LOADING INDICATOR */}
              {!collapsed && isLoading && (
                <span className="ml-auto">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FFD700]" />
                </span>
              )}
            </Link>
          )
        })}

      </div>

      {/* ================= BOTTOM DECORATION ================= */}
      {!collapsed && (
        <div className="mt-auto pb-5 pt-6">

          <div className="mx-2 h-px bg-gradient-to-r from-transparent via-[#FFD700]/25 to-transparent" />

          <div className="mt-4 px-2 text-center">
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

/* ================= FEATURE CARD ================= */

function FeatureCard({
  title,
  desc,
  icon,
  gradient,
  shadowColor,
  hoverColor,
}: {
  title: string
  desc: string
  icon: React.ReactNode
  gradient: string
  shadowColor: string
  hoverColor: string
}) {
  return (
    <Card
      className="
        h-full rounded-2xl border border-gray-100
        shadow-sm
        transition-all duration-300 ease-out
        cursor-pointer group overflow-hidden
        hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]
        hover:border-[#800000]/20
        relative
      "
    >
      {/* glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#800000]/10 blur-2xl rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-400/10 blur-2xl rounded-full" />
      </div>

      <CardContent className="p-8 flex flex-col items-center text-center h-full relative">

        <div
          className={`
            w-18 h-18 rounded-2xl
            bg-gradient-to-br ${gradient}
            ${shadowColor}
            shadow-lg
            flex items-center justify-center
            text-white mb-6
            transition-all duration-300
            group-hover:scale-110 group-hover:rotate-3
          `}
        >
          {icon}
        </div>

        <h3 className="font-bold text-[#800000] text-xl mb-2 group-hover:tracking-wide transition-all">
          {title}
        </h3>

        <p className="text-gray-500 text-sm leading-relaxed mb-6 px-2">
          {desc}
        </p>

        <div
          className={`mt-auto flex items-center gap-2 text-sm font-medium text-gray-400 ${hoverColor} transition-all duration-300 group-hover:gap-3 group-hover:text-[#800000]`}
        >
          <span>Learn more</span>

          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}