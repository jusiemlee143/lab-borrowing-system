// File path: app/help/page.tsx

"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Search,
  LogOut,
  ChevronDown,
  MessageCircle,
  BookOpen,
  Phone,
  ArrowRight,
  Cpu,
  Settings,
  CircuitBoard,
  Activity,
  Wrench,
  FlaskConical,
  HelpCircle,
  CircleHelp,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"

// ============================================================
// DATA: FAQ ITEMS
// ============================================================

const faqData = [
  {
    id: 1,
    question: "How do I borrow a laboratory tool?",
    answer:
      "To borrow a tool, log in to the Student Dashboard, search for the equipment you need, verify its availability, and click the 'Borrower Slip' button. Fill out the form and submit it to the Lab-in-Charge.",
  },
  {
    id: 2,
    question: "What should I do if the tool I need is unavailable?",
    answer:
      "If a tool shows as 'Unavailable', it means all units are currently checked out. Please check back periodically, or contact the Lab-in-Charge directly to inquire about the expected return date.",
  },
  {
    id: 3,
    question: "How long can I keep the borrowed equipment?",
    answer:
      "Standard borrowing period is typically 3 days. Extensions may be granted depending on demand. Please return items on time to avoid penalties.",
  },
  {
    id: 4,
    question: "Who do I contact if I accidentally damage equipment?",
    answer:
      "Report any damage immediately to the Lab-in-Charge. Do not attempt to fix it yourself. Honest reporting helps us maintain safety for all students.",
  },
  {
    id: 5,
    question: "Where can I find my borrowing history?",
    answer:
      "Your active and past borrowing slips can be viewed in the 'My Slip' section of your dashboard.",
  },
]

// ============================================================
// DATA: QUICK HELP TOPICS
// ============================================================

const helpTopics = [
  {
    title: "Borrowing Process",
    icon: BookOpen,
    color: "text-blue-600",
    bg: "bg-blue-50",
    desc: "Step-by-step guide on how to request laboratory equipment.",
  },
  {
    title: "Returning Items",
    icon: ArrowRight,
    color: "text-green-600",
    bg: "bg-green-50",
    desc: "Learn the proper procedures for returning equipment safely.",
  },
  {
    title: "Contact Support",
    icon: Phone,
    color: "text-orange-600",
    bg: "bg-orange-50",
    desc: "Get direct assistance from the Lab-in-Charge.",
  },
]

// ============================================================
// MAIN HELP PAGE
// ============================================================

export default function HelpPage() {
  const router = useRouter()

  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [openFaqId, setOpenFaqId] = useState<number | null>(null)

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
  // FILTER FAQS
  // ============================================================

  const filteredFaqs = faqData.filter(
    (item) =>
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase())
  )

  // ============================================================
  // TOGGLE FAQ
  // ============================================================

  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id)
  }

  // ============================================================
  // LOADING SCREEN
  // ============================================================

  if (loading) {
    return <HelpLoadingScreen />
  }

  // ============================================================
  // PAGE
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
                    Help Center
                  </h1>

                  <span className="hidden items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#800000]/50 md:flex">

                    <CircleHelp className="h-3 w-3" />

                    Support

                  </span>

                </div>

                <p className="truncate text-[11px] text-gray-500 sm:text-sm">
                  Student Support & Guidance
                </p>

              </div>

            </div>

            {/* ==================================================
                RIGHT SIDE
            ================================================== */}

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">

              {/* HELP STATUS */}

              <div className="hidden items-center gap-2 px-3 text-xs text-gray-400 md:flex">

                <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />

                Support Available

              </div>

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
                  Support Center Online
                </span>

              </div>

              <h2 className="text-2xl font-bold tracking-tight text-[#800000] sm:text-3xl">
                How Can We Help?
              </h2>

              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Find answers to common questions about borrowing,
                returning, and using laboratory equipment.
              </p>

            </div>

            <div className="hidden items-center gap-2 text-xs text-gray-400 md:flex">

              <CircuitBoard className="h-4 w-4 text-[#800000]/50" />

              Laboratory Technology Platform

            </div>

          </div>

        </section>

        {/* ====================================================
            HERO SEARCH CARD
        ==================================================== */}

        <Card className="relative mb-6 overflow-hidden rounded-2xl border border-[#800000]/10 bg-white shadow-sm">

          {/* Decorative background */}

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

            <Cpu
              className="absolute bottom-8 right-10 h-8 w-8 text-[#800000]/[0.04]"
              strokeWidth={1.5}
            />

          </div>

          <CardContent className="relative p-5 sm:p-7">

            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              {/* LEFT */}

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#800000]/10 text-[#800000]">

                  <HelpCircle className="h-6 w-6" />

                </div>

                <div>

                  <h3 className="text-lg font-bold text-[#800000] sm:text-xl">
                    Search the Help Center
                  </h3>

                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-gray-500">
                    Search our frequently asked questions to quickly
                    find information about the laboratory borrowing system.
                  </p>

                </div>

              </div>

              {/* SEARCH */}

              <div className="relative w-full md:max-w-md">

                <Search
                  className="
                    absolute
                    left-3
                    top-1/2
                    h-5
                    w-5
                    -translate-y-1/2
                    text-[#800000]
                  "
                />

                <Input
                  placeholder="Search for answers..."
                  className="
                    h-11
                    rounded-xl
                    border-[#800000]/15
                    bg-white
                    pl-10
                    text-gray-800
                    shadow-sm
                    focus:border-[#800000]
                    focus:ring-[#800000]/20
                    placeholder:text-gray-400
                  "
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

              </div>

            </div>

          </CardContent>

        </Card>

        {/* ====================================================
            QUICK HELP TOPICS
        ==================================================== */}

        <section className="mb-8">

          <div className="mb-4 flex items-center gap-3">

            <div className="h-px flex-1 bg-gray-200" />

            <div className="flex items-center gap-2 px-3">

              <Activity className="h-4 w-4 text-[#800000]" />

              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#800000]/60">
                Quick Help
              </span>

            </div>

            <div className="h-px flex-1 bg-gray-200" />

          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {helpTopics.map((topic, index) => {

              const Icon = topic.icon

              return (
                <Card
                  key={index}
                  onClick={() => {
                    if (topic.title === "Contact Support") {
                      router.push("/contact")
                    }
                  }}
                  className="
                    group
                    cursor-pointer
                    overflow-hidden
                    rounded-xl
                    border
                    border-gray-100
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
                        className={`
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          ${topic.bg}
                          ${topic.color}
                          transition-transform
                          duration-200
                          group-hover:scale-105
                        `}
                      >

                        <Icon className="h-5 w-5" />

                      </div>

                      <div className="min-w-0">

                        <h3 className="font-bold text-[#800000]">
                          {topic.title}
                        </h3>

                        <p className="mt-1 text-sm leading-relaxed text-gray-500">
                          {topic.desc}
                        </p>

                      </div>

                    </div>

                  </CardContent>

                </Card>
              )
            })}

          </div>

        </section>

        {/* ====================================================
            FAQ SECTION
        ==================================================== */}

        <section className="mb-8">

          <div className="mb-4 flex items-center gap-2">

            <div className="h-6 w-1 rounded-full bg-[#800000]" />

            <MessageCircle className="h-5 w-5 text-[#800000]" />

            <h2 className="text-xl font-bold text-[#800000] sm:text-2xl">
              Frequently Asked Questions
            </h2>

          </div>

          <div className="space-y-3">

            {filteredFaqs.length > 0 ? (

              filteredFaqs.map((faq) => (

                <Card
                  key={faq.id}
                  className="
                    overflow-hidden
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    shadow-sm
                    transition-shadow
                    hover:shadow-md
                  "
                >

                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      gap-4
                      p-5
                      text-left
                      transition-colors
                      hover:bg-[#800000]/[0.02]
                      focus:outline-none
                      sm:p-6
                    "
                  >

                    <div className="flex min-w-0 items-start gap-3">

                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#800000]/5 text-[#800000]">

                        <CircleHelp className="h-4 w-4" />

                      </div>

                      <span className="font-semibold leading-relaxed text-gray-800">
                        {faq.question}
                      </span>

                    </div>

                    <ChevronDown
                      className={`
                        h-5
                        w-5
                        shrink-0
                        text-[#800000]
                        transition-transform
                        duration-300
                        ${openFaqId === faq.id ? "rotate-180" : ""}
                      `}
                    />

                  </button>

                  {openFaqId === faq.id && (

                    <div className="border-t border-gray-100 bg-[#fafafa] px-5 pb-5 pt-4 sm:px-6 sm:pb-6">

                      <div className="flex gap-3">

                        <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#FFD700]" />

                        <p className="text-sm leading-relaxed text-gray-600">
                          {faq.answer}
                        </p>

                      </div>

                    </div>

                  )}

                </Card>

              ))

            ) : (

              <Card className="rounded-xl border border-gray-200 bg-white shadow-sm">

                <CardContent className="flex flex-col items-center px-6 py-14 text-center">

                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#800000]/5 text-[#800000]/50">

                    <Search className="h-7 w-7" />

                  </div>

                  <p className="text-sm font-semibold text-gray-700">
                    No results found
                  </p>

                  <p className="mt-1 text-xs text-gray-400">

                    No answers matched{" "}

                    <span className="font-semibold text-[#800000]">
                      "{search}"
                    </span>

                  </p>

                </CardContent>

              </Card>

            )}

          </div>

        </section>

        {/* ====================================================
            CONTACT SUPPORT CARD
        ==================================================== */}

        <Card className="relative mb-6 overflow-hidden rounded-2xl border border-[#800000]/10 bg-white shadow-sm">

          <div className="pointer-events-none absolute inset-0">

            <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-[#800000]/[0.04] to-transparent" />

            <Settings
              className="absolute -bottom-12 -left-12 h-40 w-40 text-[#800000]/[0.035]"
              strokeWidth={1}
            />

            <CircuitBoard
              className="absolute bottom-6 left-32 h-9 w-9 text-[#800000]/[0.05]"
              strokeWidth={1.5}
            />

          </div>

          <CardContent className="relative flex flex-col items-center justify-between gap-6 p-6 sm:p-8 md:flex-row">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#800000] text-[#FFD700] shadow-sm">

                <Phone className="h-6 w-6" />

              </div>

              <div>

                <h3 className="text-lg font-bold text-[#800000] sm:text-xl">
                  Still need help?
                </h3>

                <p className="mt-1 max-w-xl text-sm leading-relaxed text-gray-500">
                  Our Lab-in-Charge is available during school hours
                  to assist you with borrowing and laboratory equipment concerns.
                </p>

              </div>

            </div>

            <Button
              onClick={() => router.push("/contact")}
              className="
                h-10
                w-full
                rounded-lg
                bg-[#800000]
                px-6
                text-[#FFD700]
                shadow-sm
                hover:bg-[#660000]
                sm:w-auto
              "
            >

              <Phone className="mr-2 h-4 w-4" />

              Contact Support

            </Button>

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
                Support Center Online
              </span>

            </div>

          </div>

        </footer>

      </main>

    </div>
  )
}

// ============================================================
// HELP LOADING SCREEN
// ============================================================

function HelpLoadingScreen() {
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

        <FlaskConical
          className="absolute left-[18%] top-[30%] h-8 w-8 text-[#800000]/[0.06]"
          strokeWidth={1.5}
        />

      </div>

      {/* ======================================================
          LOADING
      ====================================================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5">

        <div className="flex flex-col items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#800000] shadow-lg">

            <Spinner className="h-7 w-7 border-2 border-[#FFD700]/30 border-t-[#FFD700]" />

          </div>

          <div className="text-center">

            <p className="font-semibold text-[#800000]">
              Loading Help Center...
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Preparing student support resources...
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}