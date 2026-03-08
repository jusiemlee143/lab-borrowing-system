// File path: app/about/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Info, LogOut, Target, Eye, Cpu, ClipboardList, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"

export default function AboutPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

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
            <h1 className="text-xl font-bold text-[#800000]">About the System</h1>
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
      <main className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-8">

        {/* HERO */}
        <Card className="bg-[#800000] text-white border-none shadow-xl rounded-2xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full pointer-events-none" />

          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold">
              Laboratory Borrowing System
            </CardTitle>
          </CardHeader>

          <CardContent className="max-w-3xl">
            <p className="text-white/90 leading-relaxed">
              The Laboratory Borrowing System is designed to streamline the process
              of borrowing laboratory tools and equipment. It allows students to
              easily request items while enabling lab administrators to monitor
              availability, manage borrowing slips, and maintain organized records.
            </p>
          </CardContent>
        </Card>

        {/* MISSION & VISION */}
        <div className="grid gap-6 md:grid-cols-2">

          <Card className="border-l-4 border-[#800000] shadow-sm">
            <CardContent className="p-6 flex gap-4">
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                <Target size={24} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#800000]">Our Mission</h3>
                <p className="text-gray-600 mt-1">
                  To provide an efficient and reliable system for managing
                  laboratory equipment borrowing, ensuring students and faculty
                  have quick and organized access to necessary tools.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-[#800000] shadow-sm">
            <CardContent className="p-6 flex gap-4">
              <div className="p-3 rounded-lg bg-green-50 text-green-600">
                <Eye size={24} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#800000]">Our Vision</h3>
                <p className="text-gray-600 mt-1">
                  To modernize laboratory resource management through digital
                  solutions that promote transparency, accountability, and
                  efficiency in academic environments.
                </p>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* FEATURES */}
        <div className="space-y-4">

          <div className="flex items-center gap-2">
            <Info className="text-[#800000]" />
            <h2 className="text-2xl font-bold text-[#800000]">
              System Features
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            <Card className="hover:shadow-md transition-shadow border-l-4 border-[#800000]">
              <CardContent className="p-6 flex gap-4">
                <Cpu className="text-blue-600" size={26} />
                <div>
                  <h3 className="font-bold text-[#800000]">
                    Equipment Monitoring
                  </h3>
                  <p className="text-sm text-gray-600">
                    Track available and borrowed laboratory tools in real time.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow border-l-4 border-[#800000]">
              <CardContent className="p-6 flex gap-4">
                <ClipboardList className="text-green-600" size={26} />
                <div>
                  <h3 className="font-bold text-[#800000]">
                    Borrowing Slip System
                  </h3>
                  <p className="text-sm text-gray-600">
                    Generate and manage borrowing requests digitally.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow border-l-4 border-[#800000]">
              <CardContent className="p-6 flex gap-4">
                <Shield className="text-orange-600" size={26} />
                <div>
                  <h3 className="font-bold text-[#800000]">
                    Secure Management
                  </h3>
                  <p className="text-sm text-gray-600">
                    Ensures proper tracking and accountability of laboratory
                    resources.
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

      </main>
    </div>
  )
}