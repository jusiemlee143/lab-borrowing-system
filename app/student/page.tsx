"use client"

import { useState, useEffect } from "react"
import { Search, LogOut, FileText } from "lucide-react"
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
import { Spinner } from "@/components/ui/spinner" // ShadCN Spinner

const toolsData = [
  { id: 1, name: "Arduino Uno", quantity: 10, status: "available" },
  { id: 2, name: "Breadboard", quantity: 0, status: "unavailable" },
  { id: 3, name: "Ultrasonic Sensor", quantity: 5, status: "available" },
]

export default function StudentPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  // Simulate page load for spinner
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800) // Adjust delay if needed
    return () => clearTimeout(timer)
  }, [])

  const filteredTools = toolsData.filter((tool) => {
    const matchesSearch = tool.name
      .toLowerCase()
      .includes(search.toLowerCase())
    const matchesFilter = filter === "all" || tool.status === filter
    return matchesSearch && matchesFilter
  })

  if (loading) {
    // Show full-page loading spinner
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
            <h1 className="text-xl font-bold text-[#800000]">Student Dashboard</h1>
          </div>

          <Button
            onClick={() => router.push("/")} // Navigate to landing page
            variant="outline"
            className="flex items-center gap-2 border-[#800000] text-[#800000] hover:bg-[#800000] hover:text-[#FFD700]"
          >
            <LogOut size={16} />
            Exit
          </Button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* WELCOME CARD */}
        <Card className="bg-[#800000] text-[#FFD700] border-none shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Welcome, Students 👋</CardTitle>
          </CardHeader>
          <CardContent className="text-[#fff8e1]">
            Browse and borrow your lab tools and equipment efficiently.
          </CardContent>
        </Card>

        {/* STATS CARDS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total Tools */}
          <Card className="bg-white shadow-md rounded-xl border-l-4 border-[#800000] h-32 flex flex-col justify-between">
            <CardContent className="flex flex-col justify-between h-full">
              <h3 className="text-[#800000] font-bold text-lg">Total Tools</h3>
              <div className="flex items-center justify-end gap-2">
                <span className="text-gray-600 text-sm">{toolsData.length}</span>
                <span className="w-3 h-3 rounded-full bg-[#800000]"></span>
              </div>
            </CardContent>
          </Card>

          {/* Available */}
          <Card className="bg-white shadow-md rounded-xl border-l-4 border-[#FFD700] h-32 flex flex-col justify-between">
            <CardContent className="flex flex-col justify-between h-full">
              <h3 className="text-[#FFD700] font-bold text-lg">Available</h3>
              <div className="flex items-center justify-end gap-2">
                <span className="text-gray-600 text-sm">
                  {toolsData.filter((t) => t.status === "available").length}
                </span>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
              </div>
            </CardContent>
          </Card>

          {/* Unavailable */}
          <Card className="bg-white shadow-md rounded-xl border-l-4 border-red-500 h-32 flex flex-col justify-between">
            <CardContent className="flex flex-col justify-between h-full">
              <h3 className="text-red-500 font-bold text-lg">Unavailable</h3>
              <div className="flex items-center justify-end gap-2">
                <span className="text-gray-600 text-sm">
                  {toolsData.filter((t) => t.status === "unavailable").length}
                </span>
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SEARCH + FILTER + BORROWER SLIP */}
        <Card className="bg-white border shadow-md rounded-2xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* LEFT: SEARCH */}
              <div className="relative w-full sm:w-1/2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tools..."
                  className="pl-9 w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* RIGHT: FILTER + BORROWER SLIP */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-stretch sm:items-center">
                <Select onValueChange={setFilter} defaultValue="all">
                  <SelectTrigger className="w-full sm:w-48 border-[#800000]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Show All</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="gap-2 w-full sm:w-auto bg-[#800000] text-[#FFD700] hover:bg-[#660000]">
                  <FileText size={16} />
                  Borrower Slip
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TOOLS TABLE */}
        <Card className="bg-white border shadow-md overflow-x-auto rounded-2xl">
          <CardHeader>
            <CardTitle className="text-[#800000]">Tools & Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse table-fixed min-w-[400px] sm:min-w-full">
                <thead className="bg-[#f5f5f5]">
                  <tr>
                    <th className="py-3 px-2 text-left text-[#800000] w-1/2">Tool</th>
                    <th className="py-3 px-2 text-left text-[#800000] w-1/4">Quantity</th>
                    <th className="py-3 px-2 text-center text-[#800000] w-1/4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTools.map((tool) => (
                    <tr key={tool.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium">{tool.name}</td>
                      <td className="py-3 px-2">{tool.quantity}</td>
                      <td className="py-3 px-2 text-center">
                        <span
                          className={`inline-block w-full px-2 py-1 rounded-full text-xs font-medium ${
                            tool.status === "available"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {tool.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
