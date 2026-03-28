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
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, LogOut, Trash2 } from "lucide-react"

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

export default function BorrowerSlipPage() {
  const router = useRouter()
  const [date, setDate] = useState("")
  const [name, setName] = useState("")
  const [section, setSection] = useState("")
  const [groupNumber, setGroupNumber] = useState("")
  const [activityTitle, setActivityTitle] = useState("")
  const [instructor, setInstructor] = useState("")
  const [members, setMembers] = useState<string[]>([""])
  const [cart, setCart] = useState<CartItem[]>([])
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)

  // Auto-date
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    setDate(today)
  }, [])

  // Fetch tools from backend
  useEffect(() => {
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
  }, [])

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

      // Clear cart after submission
      setCart([])
      router.push("/student") // redirect to dashboard
    } catch (err) {
      console.error(err)
      alert("Failed to submit. Try again.")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fffaf8]">
        <div className="w-12 h-12 border-4 border-t-[#800000] border-gray-200 rounded-full animate-spin"></div>
      </div>
    )
  }

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
              <h1 className="text-lg sm:text-2xl font-bold text-[#800000] leading-tight">
                STUDENT'S BORROWER SLIP
              </h1>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/student")}
              className="gap-2 border-[#800000] text-[#800000] hover:bg-[#800000] hover:text-[#FFD700] w-full md:w-auto"
            >
              <LogOut size={16} /> Exit
            </Button>
          </CardContent>
        </Card>

        {/* STUDENT INFO */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-[#800000]">Student Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Select onValueChange={setSection}>
              <SelectTrigger><SelectValue placeholder="Select Section" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="H1">H1</SelectItem>
                <SelectItem value="H2">H2</SelectItem>
                <SelectItem value="H3">H3</SelectItem>
              </SelectContent>
            </Select>
            <Input type="number" placeholder="Group #" value={groupNumber} onChange={(e) => setGroupNumber(e.target.value)} />
            <Input type="date" value={date} disabled />
            <div className="sm:col-span-2 lg:col-span-4">
              <Input placeholder="Activity Title" value={activityTitle} onChange={(e) => setActivityTitle(e.target.value)} />
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
              <div key={tool._id} className="border rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{tool.name}</p>
                  <p className="text-xs text-gray-500">Stock: {tool.displayQuantity}</p>
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
            {cart.length === 0 && <p className="text-sm text-gray-500">No tools selected yet.</p>}
            {cart.map((item) => (
              <div key={item.id} className="flex flex-wrap sm:flex-nowrap items-center gap-3 border rounded-xl p-3">
                <div className="flex-1 font-medium min-w-[120px]">{item.name}</div>
                <Input type="number" className="w-24" value={item.quantity} onChange={(e) => updateQty(item.id, Number(e.target.value))} />
                <Button size="icon" variant="ghost" onClick={() => removeItem(item.id)}>
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
            <Button onClick={addMember} className="bg-[#800000] text-[#FFD700]">
              <Plus size={16} /> Add Name
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {members.map((m, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input placeholder={`Member ${i + 1}`} value={m} onChange={(e) => updateMember(i, e.target.value)} />
                <Button type="button" variant="ghost" size="icon" disabled={members.length === 1} onClick={() => deleteMember(i)}>
                  <Trash2 size={16} className={members.length === 1 ? "text-gray-300" : "text-red-500"} />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* INSTRUCTOR & SUBMIT */}
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Select onValueChange={setInstructor}>
              <SelectTrigger className="w-full sm:w-64"><SelectValue placeholder="Select Instructor" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Instructor A">Instructor A</SelectItem>
                <SelectItem value="Instructor B">Instructor B</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSubmit} className="w-full sm:w-auto bg-[#800000] text-[#FFD700] hover:bg-[#660000]">
              SUBMIT
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}