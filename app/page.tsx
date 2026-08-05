"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, LogOut, Trash2, Eye, EyeOff, GraduationCap, Lock, IdCard } from "lucide-react"

// Types
type CartItem = {
  id: string
  name: string
  quantity: number
}

type Tool = {
  _id: string
  name: string
  quantity: number
  status: string
}

type Teacher = {
  _id: string
  name: string
  email: string
}

type StudentUser = {
  _id: string
  idNumber: string
  name: string
  section: string
  email: string
}

// ─── DEFAULT CREDENTIALS (temporary, remove when backend is ready) ───
const DEFAULT_STUDENT: StudentUser = {
  _id: "std_001",
  idNumber: "2024-00001",
  name: "Juan Dela Cruz",
  section: "H1",
  email: "juan.delacruz@email.com",
}
const DEFAULT_ID = "2024-00001"
const DEFAULT_PASS = "student123"

export default function BorrowerSlipPage() {
  const router = useRouter()

  // ─── Auth States ───
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [student, setStudent] = useState<StudentUser | null>(null)
  const [idNumber, setIdNumber] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState("")

  // ─── Form States ───
  const [date, setDate] = useState("")
  const [name, setName] = useState("")
  const [section, setSection] = useState("")
  const [groupNumber, setGroupNumber] = useState("")
  const [activityTitle, setActivityTitle] = useState("")
  const [instructor, setInstructor] = useState("")
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [members, setMembers] = useState<string[]>([""])
  const [cart, setCart] = useState<CartItem[]>([])
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const stored = localStorage.getItem("student_session")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setStudent(parsed)
        setIsAuthenticated(true)
      } catch {
        localStorage.removeItem("student_session")
      }
    }
  }, [])

  // Auto-date
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    setDate(today)
  }, [])

  // Pre-fill name & section after login
  useEffect(() => {
    if (isAuthenticated && student) {
      setName(student.name)
      setSection(student.section || "")
    }
  }, [isAuthenticated, student])

  // Fetch teachers dynamically
  useEffect(() => {
    if (!isAuthenticated) return
    const fetchTeachers = async () => {
      try {
        const res = await fetch("/api/admin/teachers")
        const data = await res.json()
        setTeachers(data)
      } catch (err) {
        console.error("Failed to fetch teachers:", err)
        setTeachers([])
      }
    }
    fetchTeachers()
  }, [isAuthenticated])

  // Fetch tools from backend
  useEffect(() => {
    if (!isAuthenticated) return
    const fetchTools = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/lab-in-charge/tools")
        const data = await res.json()
        const normalized = Array.isArray(data)
          ? data.map((t: any) => ({
              _id: t._id || t.id,
              name: t.name,
              quantity: t.quantity,
              status: t.quantity === 0 ? "unavailable" : "available",
            }))
          : []
        setTools(normalized)
      } catch (err) {
        console.error("Failed to fetch tools:", err)
        setTools([])
      } finally {
        setLoading(false)
      }
    }
    fetchTools()
  }, [isAuthenticated])

  // ─── Login Handler (DEFAULT / HARDCODED) ───
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setLoginLoading(true)

    if (!idNumber.trim() || !password.trim()) {
      setLoginError("Please enter both ID number and password.")
      setLoginLoading(false)
      return
    }

    // Simulate a short delay for realism
    setTimeout(() => {
      if (idNumber.trim() === DEFAULT_ID && password === DEFAULT_PASS) {
        setStudent(DEFAULT_STUDENT)
        setIsAuthenticated(true)
        localStorage.setItem("student_session", JSON.stringify(DEFAULT_STUDENT))
        setIdNumber("")
        setPassword("")
      } else {
        setLoginError("Invalid ID number or password. Try the default credentials below.")
      }
      setLoginLoading(false)
    }, 600)
  }

  // ─── Logout Handler ───
  const handleLogout = () => {
    setIsAuthenticated(false)
    setStudent(null)
    setCart([])
    setMembers([""])
    setName("")
    setSection("")
    setGroupNumber("")
    setActivityTitle("")
    setInstructor("")
    localStorage.removeItem("student_session")
  }

  // Available tools with cart-adjusted display quantity
  const availableTools = tools.map((tool) => {
    const inCart = cart.find((c) => c.id === tool._id)
    return {
      ...tool,
      displayQuantity: tool.quantity - (inCart ? inCart.quantity : 0),
    }
  })

  // Add to cart
  const addToCart = (tool: Tool) => {
    const inCart = cart.find((c) => c.id === tool._id)
    const currentQty = inCart ? inCart.quantity : 0
    if (currentQty + 1 > tool.quantity) {
      alert("Out of stock!")
      return
    }
    setCart((prev) => {
      if (inCart) {
        return prev.map((c) =>
          c.id === tool._id ? { ...c, quantity: c.quantity + 1 } : c
        )
      }
      return [...prev, { id: tool._id, name: tool.name, quantity: 1 }]
    })
  }

  // Update quantity
  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) return
    const tool = tools.find((t) => t._id === id)
    if (!tool) return
    if (qty > tool.quantity) {
      alert("Out of stock!")
      return
    }
    setCart((prev) =>
      prev.map((c) => (c.id === id ? { ...c, quantity: qty } : c))
    )
  }

  // Remove from cart
  const removeItem = (id: string) => setCart((prev) => prev.filter((c) => c.id !== id))

  // Members
  const addMember = () => setMembers((p) => [...p, ""])
  const updateMember = (i: number, v: string) => {
    const copy = [...members]
    copy[i] = v
    setMembers(copy)
  }
  const deleteMember = (i: number) => {
    if (members.length === 1) return
    setMembers((prev) => prev.filter((_, idx) => idx !== i))
  }

  // Submit borrower slip as request
  const handleSubmit = async () => {
    if (!name || !section || !groupNumber || !activityTitle || !instructor) {
      alert("Please fill all fields.")
      return
    }
    if (cart.length === 0) {
      alert("Select at least one tool.")
      return
    }

    const payload = {
      studentId: student?._id,
      idNumber: student?.idNumber,
      name,
      section,
      groupNumber,
      date,
      activityTitle,
      instructor,
      members,
      cart,
    }

    try {
      const res = await fetch("/api/student/borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Submission failed")
      alert("Borrower slip submitted successfully!")
      setCart([])
      router.push("/student")
    } catch (err) {
      console.error(err)
      alert("Failed to submit. Try again.")
    }
  }

  // ─── LOGIN SCREEN ───
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fffaf8] flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <img
              src="https://i.ibb.co/cbTk669/Untitled-design-removebg-preview.png"
              alt="logo"
              className="w-24 h-24 object-contain"
            />
            <h1 className="text-2xl font-bold text-[#800000]">Student Portal</h1>
            <p className="text-sm text-gray-500">Sign in to access the Borrower Slip form</p>
          </div>

          {/* Login Card */}
          <Card className="shadow-xl rounded-2xl border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-[#800000] text-lg">Log In</CardTitle>
              <CardDescription>Enter your student credentials below</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-5">
                {/* ID Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <IdCard size={14} className="text-[#800000]" />
                    ID Number
                  </label>
                  <Input
                    placeholder="e.g. 2024-00001"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="h-11"
                    autoComplete="username"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Lock size={14} className="text-[#800000]" />
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 pr-10"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {loginError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">
                    {loginError}
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full h-11 bg-[#800000] text-[#FFD700] hover:bg-[#660000] font-semibold rounded-xl transition-all"
                >
                  {loginLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-t-transparent border-[#FFD700] rounded-full animate-spin" />
                      Logging in...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <GraduationCap size={16} />
                      Log In
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Default Credentials Box */}
          <Card className="bg-amber-50 border border-amber-200 rounded-2xl">
            <CardContent className="p-4 space-y-2">
              <p className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                🔑 Default Test Credentials
              </p>
              <div className="bg-white/70 rounded-lg p-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID Number:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIdNumber(DEFAULT_ID)
                      navigator.clipboard?.writeText(DEFAULT_ID)
                    }}
                    className="font-mono font-bold text-[#800000] hover:underline cursor-pointer"
                    title="Click to autofill"
                  >
                    {DEFAULT_ID}
                  </button>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Password:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setPassword(DEFAULT_PASS)
                      navigator.clipboard?.writeText(DEFAULT_PASS)
                    }}
                    className="font-mono font-bold text-[#800000] hover:underline cursor-pointer"
                    title="Click to autofill"
                  >
                    {DEFAULT_PASS}
                  </button>
                </div>
              </div>
              <p className="text-xs text-amber-600">
                Click on the values above to autofill. This is temporary and will be replaced with real authentication.
              </p>
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400">
            Contact your administrator if you forgot your credentials.
          </p>
        </div>
      </div>
    )
  }

  // ─── LOADING SCREEN ───
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fffaf8]">
        <div className="w-12 h-12 border-4 border-t-[#800000] border-gray-200 rounded-full animate-spin"></div>
      </div>
    )
  }

  // ─── MAIN BORROWER SLIP SCREEN ───
  return (
    <div className="min-h-screen bg-[#fffaf8] p-4 sm:p-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <Card className="shadow-lg rounded-2xl">
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 p-6">
            <div className="flex items-center gap-4 min-w-0">
              <img
                src="https://i.ibb.co/cbTk669/Untitled-design-removebg-preview.png"
                alt="logo"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0"
              />
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-[#800000] leading-tight">
                  STUDENT&apos;S BORROWER SLIP
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs sm:text-sm text-gray-500 truncate">
                    Logged in as <span className="font-semibold text-gray-700">{student?.name}</span> &middot; {student?.idNumber}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                onClick={() => router.push("/student")}
                className="gap-2 border-[#800000] text-[#800000] hover:bg-[#800000] hover:text-[#FFD700] flex-1 md:flex-none"
              >
                <LogOut size={16} /> Exit
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="gap-2 border-red-400 text-red-500 hover:bg-red-500 hover:text-white flex-1 md:flex-none"
              >
                <LogOut size={16} /> Log Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* STUDENT INFO */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-[#800000]">Student Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Select onValueChange={setSection} value={section}>
              <SelectTrigger>
                <SelectValue placeholder="Select Section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="H1">H1</SelectItem>
                <SelectItem value="H2">H2</SelectItem>
                <SelectItem value="H3">H3</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Group #"
              value={groupNumber}
              onChange={(e) => setGroupNumber(e.target.value)}
            />
            <Input type="date" value={date} disabled />
            <div className="sm:col-span-2 lg:col-span-4">
              <Input
                placeholder="Activity Title"
                value={activityTitle}
                onChange={(e) => setActivityTitle(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* AVAILABLE TOOLS */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-[#800000]">Available Tools</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {availableTools.map((tool) => (
              <div
                key={tool._id}
                className="border rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold">{tool.name}</p>
                  <p className="text-xs text-gray-500">
                    Stock: {tool.displayQuantity}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => addToCart(tool)}
                  className="bg-[#800000] text-[#FFD700] hover:bg-[#660000]"
                  disabled={tool.displayQuantity <= 0}
                >
                  Add
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* CART */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-[#800000]">Selected Tools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cart.length === 0 && (
              <p className="text-sm text-gray-500">No tools selected yet.</p>
            )}
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap sm:flex-nowrap items-center gap-3 border rounded-xl p-3"
              >
                <div className="flex-1 font-medium min-w-[120px]">
                  {item.name}
                </div>
                <Input
                  type="number"
                  className="w-24"
                  value={item.quantity}
                  onChange={(e) => updateQty(item.id, Number(e.target.value))}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="text-red-500" size={16} />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* MEMBERS */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-[#800000]">Name of Members</CardTitle>
            <Button
              onClick={addMember}
              className="bg-[#800000] text-[#FFD700]"
            >
              <Plus size={16} /> Add Name
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {members.map((m, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input
                  placeholder={`Member ${i + 1}`}
                  value={m}
                  onChange={(e) => updateMember(i, e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={members.length === 1}
                  onClick={() => deleteMember(i)}
                >
                  <Trash2
                    size={16}
                    className={
                      members.length === 1 ? "text-gray-300" : "text-red-500"
                    }
                  />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* INSTRUCTOR & SUBMIT */}
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Select onValueChange={setInstructor} value={instructor}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Select Instructor" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((t) => (
                  <SelectItem key={t._id} value={t._id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleSubmit}
              className="w-full sm:w-auto bg-[#800000] text-[#FFD700] hover:bg-[#660000]"
            >
              SUBMIT
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}