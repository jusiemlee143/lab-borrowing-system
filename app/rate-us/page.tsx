"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Star,
  LogOut,
  Send,
  Activity,
  CircuitBoard,
  Cpu,
  Settings,
  MessageCircle,
  CheckCircle2,
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
// RATE PAGE
// ============================================================

export default function RatePage() {
  const router = useRouter()

  // ============================================================
  // STATE
  // ============================================================

  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [submitted, setSubmitted] = useState(false)

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
  // SUBMIT FEEDBACK
  // ============================================================

  const handleSubmit = () => {
    if (rating === 0) return

    setSubmitted(true)

    // You can connect this later to MongoDB / Firebase
    console.log({
      rating,
      feedback,
    })
  }

  // ============================================================
  // LOADING SCREEN
  // ============================================================

  if (loading) {
    return <RateLoadingScreen />
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

        <MessageCircle
          className="absolute left-[17%] top-[30%] h-8 w-8 text-[#800000]/[0.05]"
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
                    Rate Our System
                  </h1>

                  <span className="hidden items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#800000]/50 md:flex">

                    <Activity className="h-3 w-3" />

                    Feedback

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
                  Feedback System Active
                </span>

              </div>

              <h2 className="text-2xl font-bold tracking-tight text-[#800000] sm:text-3xl">
                Rate Your Experience
              </h2>

              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Share your experience with the Laboratory Borrowing System
                and help us improve the platform.
              </p>

            </div>

            <div className="hidden items-center gap-2 text-xs text-gray-400 md:flex">

              <CircuitBoard className="h-4 w-4 text-[#800000]/50" />

              Laboratory Technology Platform

            </div>

          </div>

        </section>

        {/* ====================================================
            HERO CARD
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

                <Star className="h-6 w-6" />

              </div>

              <div>

                <h3 className="text-lg font-bold text-[#800000]">
                  Your Feedback Matters ⭐
                </h3>

                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-gray-500">
                  Your feedback helps us identify areas where the Laboratory
                  Borrowing System can be improved and provides a better
                  experience for students and laboratory staff.
                </p>

              </div>

            </div>

          </CardContent>

        </Card>

        {/* ====================================================
            RATING CARD
        ==================================================== */}

        <Card className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* CARD HEADER */}

          <CardHeader className="border-b border-gray-100 bg-white">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#800000]/5 text-[#800000]">

                <Star className="h-4 w-4" />

              </div>

              <div>

                <CardTitle className="text-lg font-bold text-[#800000]">
                  System Evaluation
                </CardTitle>

                <p className="mt-1 text-sm text-gray-500">
                  Tell us about your experience using the system.
                </p>

              </div>

            </div>

          </CardHeader>

          {/* CARD CONTENT */}

          <CardContent className="p-5 sm:p-8">

            {submitted ? (

              /* ==================================================
                 SUCCESS STATE
              ================================================== */

              <div className="flex flex-col items-center justify-center py-12 text-center">

                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600">

                  <CheckCircle2 className="h-8 w-8" />

                </div>

                <h2 className="text-2xl font-bold text-[#800000]">
                  Thank You for Your Feedback!
                </h2>

                <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-500">
                  Your response has been recorded. Your feedback helps us
                  improve the Laboratory Borrowing System.
                </p>

                <div className="mt-6 flex items-center gap-2 rounded-full bg-[#800000]/5 px-4 py-2">

                  <Star className="h-4 w-4 fill-[#FFD700] text-[#FFD700]" />

                  <span className="text-sm font-semibold text-[#800000]">
                    You rated the system {rating}/5
                  </span>

                </div>

              </div>

            ) : (

              <div className="space-y-8">

                {/* ==================================================
                    STAR RATING
                ================================================== */}

                <div className="text-center">

                  <h2 className="text-xl font-bold text-[#800000]">
                    How would you rate your experience?
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Select a rating from 1 to 5 stars.
                  </p>

                  {/* STARS */}

                  <div
                    className="mt-6 flex justify-center gap-2 sm:gap-3"
                    onMouseLeave={() => setHover(0)}
                  >

                    {[1, 2, 3, 4, 5].map((star) => (

                      <button
                        key={star}
                        type="button"
                        aria-label={`Rate ${star} out of 5 stars`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        className="
                          rounded-lg
                          p-1
                          transition-transform
                          duration-200
                          hover:scale-110
                          focus:outline-none
                          focus:ring-2
                          focus:ring-[#800000]/30
                        "
                      >

                        <Star
                          className={`
                            h-9
                            w-9
                            transition-all
                            duration-200
                            sm:h-11
                            sm:w-11
                            ${
                              (hover || rating) >= star
                                ? "fill-[#FFD700] text-[#FFD700] drop-shadow-sm"
                                : "text-gray-300"
                            }
                          `}
                          strokeWidth={1.8}
                        />

                      </button>

                    ))}

                  </div>

                  {/* RATING LABEL */}

                  <div className="mt-4 h-5">

                    {(hover || rating) > 0 && (

                      <p className="text-sm font-semibold text-[#800000]">

                        {(hover || rating) === 1 && "Very Poor"}

                        {(hover || rating) === 2 && "Poor"}

                        {(hover || rating) === 3 && "Average"}

                        {(hover || rating) === 4 && "Good"}

                        {(hover || rating) === 5 && "Excellent"}

                      </p>

                    )}

                  </div>

                </div>

                {/* ==================================================
                    DIVIDER
                ================================================== */}

                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                {/* ==================================================
                    FEEDBACK
                ================================================== */}

                <div className="space-y-3">

                  <div className="flex items-center justify-between">

                    <label
                      htmlFor="feedback"
                      className="text-sm font-semibold text-[#800000]"
                    >
                      Additional Feedback
                    </label>

                    <span className="text-xs text-gray-400">
                      Optional
                    </span>

                  </div>

                  <textarea
                    id="feedback"
                    placeholder="Tell us what you liked or what we can improve..."
                    className="
                      min-h-[140px]
                      w-full
                      resize-y
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      p-4
                      text-sm
                      text-gray-800
                      outline-none
                      transition-all
                      placeholder:text-gray-400
                      focus:border-[#800000]/40
                      focus:ring-2
                      focus:ring-[#800000]/10
                    "
                    value={feedback}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setFeedback(e.target.value)
                    }
                  />

                  <div className="flex justify-between text-xs text-gray-400">

                    <span>
                      Help us improve the system.
                    </span>

                    <span>
                      {feedback.length} characters
                    </span>

                  </div>

                </div>

                {/* ==================================================
                    SUBMIT
                ================================================== */}

                <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

                  <p className="text-xs text-gray-400">

                    {rating === 0
                      ? "Please select a star rating."
                      : "Thank you for taking the time to rate our system."}

                  </p>

                  <Button
                    onClick={handleSubmit}
                    disabled={rating === 0}
                    className="
                      h-10
                      rounded-lg
                      bg-[#800000]
                      px-5
                      text-[#FFD700]
                      shadow-sm
                      hover:bg-[#660000]
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >

                    <Send className="mr-2 h-4 w-4" />

                    Submit Feedback

                  </Button>

                </div>

              </div>

            )}

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

function RateLoadingScreen() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fafafa]">

      {/* ======================================================
          BACKGROUND
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
          LOADING
      ====================================================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5">

        <div className="flex flex-col items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#800000] shadow-lg">

            <Spinner className="h-7 w-7 border-2 border-[#FFD700]/30 border-t-[#FFD700]" />

          </div>

          <div className="text-center">

            <p className="font-semibold text-[#800000]">
              Loading feedback page...
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