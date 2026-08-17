"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Mail,
  MapPin,
  Phone,
  Send,
  LogOut,
  Loader2,
  Activity,
  CircuitBoard,
  Cpu,
  Settings,
  FlaskConical,
  Wrench,
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
// CONTACT PAGE
// ============================================================

export default function ContactPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ============================================================
  // FORM STATE
  // ============================================================

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

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
  // FORM CHANGE
  // ============================================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // ============================================================
  // FORM SUBMIT
  // ============================================================

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      alert(
        "Message sent successfully! We will get back to you shortly."
      )

      setIsSubmitting(false)

      setFormData({
        name: "",
        email: "",
        message: "",
      })
    }, 1500)
  }

  // ============================================================
  // LOADING SCREEN
  // ============================================================

  if (loading) {
    return <ContactLoadingScreen />
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
                    Contact Us
                  </h1>

                  <span className="hidden items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#800000]/50 md:flex">

                    <Activity className="h-3 w-3" />

                    Support

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
                  Support Available
                </span>

              </div>

              <h2 className="text-2xl font-bold tracking-tight text-[#800000] sm:text-3xl">
                Get in Touch
              </h2>

              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Have questions about borrowing equipment or reporting
                an issue? Our laboratory support team is here to help.
              </p>

            </div>

            <div className="hidden items-center gap-2 text-xs text-gray-400 md:flex">

              <CircuitBoard className="h-4 w-4 text-[#800000]/50" />

              Laboratory Technology Platform

            </div>

          </div>

        </section>

        {/* ====================================================
            WELCOME / SUPPORT CARD
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
                  Laboratory Support 👋
                </h3>

                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-gray-500">
                  Need assistance with borrowing equipment, returning
                  items, or reporting an issue? Send us a message and
                  the Lab-in-Charge can assist you.
                </p>

              </div>

            </div>

          </CardContent>

        </Card>

        {/* ====================================================
            CONTACT CONTENT
        ==================================================== */}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* ==================================================
              CONTACT FORM
          ================================================== */}

          <div className="lg:col-span-2">

            <Card className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

              {/* CARD HEADER */}

              <CardHeader className="border-b border-gray-100 bg-white">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#800000]/5 text-[#800000]">

                    <Send className="h-5 w-5" />

                  </div>

                  <div>

                    <CardTitle className="text-lg font-bold text-[#800000]">
                      Send us a Message
                    </CardTitle>

                    <p className="mt-1 text-sm text-gray-500">
                      Fill out the form below and we'll get back to you.
                    </p>

                  </div>

                </div>

              </CardHeader>

              {/* FORM */}

              <CardContent className="p-5 sm:p-7">

                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >

                  {/* NAME */}

                  <div className="space-y-2">

                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-[#800000]"
                    >
                      Full Name
                    </label>

                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="
                        h-11
                        rounded-xl
                        border-gray-200
                        bg-white
                        text-gray-800
                        placeholder:text-gray-400
                        focus:border-[#800000]
                        focus:ring-[#800000]/20
                      "
                    />

                  </div>

                  {/* EMAIL */}

                  <div className="space-y-2">

                    <label
                      htmlFor="email"
                      className="text-sm font-semibold text-[#800000]"
                    >
                      Email Address
                    </label>

                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="student@university.edu"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="
                        h-11
                        rounded-xl
                        border-gray-200
                        bg-white
                        text-gray-800
                        placeholder:text-gray-400
                        focus:border-[#800000]
                        focus:ring-[#800000]/20
                      "
                    />

                  </div>

                  {/* MESSAGE */}

                  <div className="space-y-2">

                    <label
                      htmlFor="message"
                      className="text-sm font-semibold text-[#800000]"
                    >
                      Message
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      placeholder="How can we help you?"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="
                        flex
                        min-h-[140px]
                        w-full
                        resize-y
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        px-3
                        py-3
                        text-sm
                        text-gray-800
                        placeholder:text-gray-400
                        focus:outline-none
                        focus:border-[#800000]
                        focus:ring-2
                        focus:ring-[#800000]/20
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    />

                  </div>

                  {/* SUBMIT */}

                  <div className="flex justify-end">

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="
                        h-11
                        rounded-lg
                        bg-[#800000]
                        px-6
                        text-[#FFD700]
                        shadow-sm
                        hover:bg-[#660000]
                        disabled:opacity-60
                      "
                    >

                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />

                          Send Message
                        </>
                      )}

                    </Button>

                  </div>

                </form>

              </CardContent>

            </Card>

          </div>

          {/* ==================================================
              CONTACT INFORMATION
          ================================================== */}

          <div className="space-y-4">

            {/* EMAIL */}

            <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">

              <CardContent className="p-5">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#800000]/10 text-[#800000]">

                    <Mail className="h-5 w-5" />

                  </div>

                  <div className="min-w-0">

                    <h3 className="font-bold text-[#800000]">
                      Email Us
                    </h3>

                    <p className="mt-1 break-all text-sm text-gray-600">
                      support@lab-system.edu
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      We reply within 24 hours
                    </p>

                  </div>

                </div>

              </CardContent>

            </Card>

            {/* LOCATION */}

            <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">

              <CardContent className="p-5">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#800000]/10 text-[#800000]">

                    <MapPin className="h-5 w-5" />

                  </div>

                  <div>

                    <h3 className="font-bold text-[#800000]">
                      Location
                    </h3>

                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      Engineering Building,
                      <br />
                      Room 304, Main Campus
                    </p>

                  </div>

                </div>

              </CardContent>

            </Card>

            {/* PHONE */}

            <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">

              <CardContent className="p-5">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#800000]/10 text-[#800000]">

                    <Phone className="h-5 w-5" />

                  </div>

                  <div>

                    <h3 className="font-bold text-[#800000]">
                      Call Us
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                      +1 (555) 123-4567
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Mon-Fri, 8am - 5pm
                    </p>

                  </div>

                </div>

              </CardContent>

            </Card>

            {/* SUPPORT STATUS */}

            <Card className="rounded-2xl border border-green-200 bg-green-50/70 shadow-sm">

              <CardContent className="p-5">

                <div className="flex items-start gap-3">

                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />

                  <div>

                    <h3 className="text-sm font-bold text-green-700">
                      Support Available
                    </h3>

                    <p className="mt-1 text-xs leading-relaxed text-green-600/80">
                      The Lab-in-Charge is available during regular
                      school hours to assist with laboratory equipment.
                    </p>

                  </div>

                </div>

              </CardContent>

            </Card>

            {/* EMERGENCY NOTE */}

            <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-center">

              <p className="text-xs font-semibold leading-relaxed text-red-600">
                For urgent equipment damage, please contact the
                Lab-in-Charge immediately.
              </p>

            </div>

          </div>

        </div>

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
                Support Ready
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

function ContactLoadingScreen() {
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
              Loading contact page...
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Preparing laboratory support...
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}