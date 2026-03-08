// File path: app/rate/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Star, LogOut, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"

export default function RatePage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = () => {
    if (rating === 0) return

    setSubmitted(true)

    // You can connect this later to MongoDB / Firebase
    console.log({
      rating,
      feedback,
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fffaf8]">
        <Spinner className="w-12 h-12 text-[#800000]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fffaf8]">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 max-w-7xl mx-auto gap-4">

          <div className="flex items-center gap-3">
            <img
              src="https://i.ibb.co/cbTk669/Untitled-design-removebg-preview.png"
              alt="logo"
              className="w-14 h-14 object-contain"
            />
            <h1 className="text-xl font-bold text-[#800000]">
              Rate Our System
            </h1>
          </div>

          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="flex items-center gap-2 border-[#800000] text-[#800000] hover:bg-[#800000] hover:text-[#FFD700]"
          >
            <LogOut size={16} />
            Exit
          </Button>

        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-4xl mx-auto p-6 md:p-10">

        {/* HERO CARD */}
        <Card className="bg-[#800000] text-white border-none shadow-xl rounded-2xl mb-8 relative overflow-hidden">

          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full pointer-events-none" />

          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Your Feedback Matters
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-white/90">
              Help us improve the Laboratory Borrowing System by sharing your experience.
            </p>
          </CardContent>

        </Card>

        {/* RATING CARD */}
        <Card className="shadow-lg border-l-4 border-[#800000]">
          <CardContent className="p-8 space-y-6">

            {submitted ? (
              <div className="text-center py-10">
                <h2 className="text-2xl font-bold text-[#800000]">
                  Thank you for your feedback!
                </h2>
                <p className="text-gray-600 mt-2">
                  Your response helps us improve the borrowing system.
                </p>
              </div>
            ) : (
              <>

                {/* STAR RATING */}
                <div className="text-center space-y-4">

                  <h2 className="text-xl font-semibold text-[#800000]">
                    Rate your experience
                  </h2>

                  <div className="flex justify-center gap-2">

                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={36}
                        className={`cursor-pointer transition ${
                          (hover || rating) >= star
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                      />
                    ))}

                  </div>
                </div>

                {/* FEEDBACK TEXTAREA */}
                <div className="space-y-2">

                  <label className="font-semibold text-[#800000]">
                    Additional Feedback
                  </label>

                  <textarea
                    placeholder="Tell us what we can improve..."
                    className="w-full min-h-[120px] rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-[#800000]"
                    value={feedback}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setFeedback(e.target.value)
                    }
                  />

                </div>

                {/* SUBMIT BUTTON */}
                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmit}
                    className="bg-[#800000] text-[#FFD700] hover:bg-[#660000] flex items-center gap-2"
                  >
                    <Send size={16} />
                    Submit Feedback
                  </Button>
                </div>

              </>
            )}

          </CardContent>
        </Card>

      </main>
    </div>
  )
}