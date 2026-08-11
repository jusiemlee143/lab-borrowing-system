"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Plus,
  Trash2,
  LogOut,
  UserRound,
  Users,
  Package,
  ClipboardList,
  CalendarDays,
  GraduationCap,
  Send,
  Minus,
} from "lucide-react"

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

// ============================================================
// TYPES
// ============================================================

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

// ============================================================
// MAIN PAGE
// ============================================================

export default function BorrowerSlipPage() {
  const router = useRouter()

  // ==========================================================
  // STUDENT INFORMATION
  // ==========================================================

  const [date, setDate] = useState("")
  const [name, setName] = useState("")
  const [section, setSection] = useState("")
  const [groupNumber, setGroupNumber] = useState("")
  const [activityTitle, setActivityTitle] = useState("")
  const [instructor, setInstructor] = useState("")

  // ==========================================================
  // MEMBERS
  // ==========================================================

  // Start with 4 member slots instead of only one.
  // Students can immediately type into multiple fields.
  const [members, setMembers] = useState<string[]>([
    "",
    "",
    "",
    "",
  ])

  // ==========================================================
  // TOOLS
  // ==========================================================

  const [cart, setCart] = useState<CartItem[]>([])
  const [tools, setTools] = useState<Tool[]>([])

  // ==========================================================
  // TEACHERS
  // ==========================================================

  const [teachers, setTeachers] = useState<Teacher[]>([])

  // ==========================================================
  // LOADING
  // ==========================================================

  const [loading, setLoading] = useState(true)

  // ==========================================================
  // SUBMITTING
  // ==========================================================

  const [submitting, setSubmitting] = useState(false)

  // ==========================================================
  // AUTO DATE
  // ==========================================================

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    setDate(today)
  }, [])

  // ==========================================================
  // FETCH TEACHERS
  // ==========================================================

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await fetch("/api/admin/teachers")
        const data = await res.json()

        setTeachers(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Failed to fetch teachers:", err)
        setTeachers([])
      }
    }

    fetchTeachers()
  }, [])

  // ==========================================================
  // FETCH TOOLS
  // ==========================================================

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true)

        const res = await fetch("/api/lab-in-charge/tools")
        const data = await res.json()

        const normalized: Tool[] = Array.isArray(data)
          ? data.map((t: any) => ({
              _id: t._id || t.id,
              name: t.name,
              quantity: t.quantity,
              status:
                t.quantity === 0
                  ? "unavailable"
                  : "available",
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

  // ============================================================
  // AVAILABLE TOOLS
  // ============================================================

  const availableTools = tools.map((tool) => {
    const inCart = cart.find(
      (item) => item.id === tool._id
    )

    return {
      ...tool,
      displayQuantity:
        tool.quantity - (inCart ? inCart.quantity : 0),
    }
  })

  // ============================================================
  // ADD TOOL
  // ============================================================

  const addToCart = (tool: Tool) => {
    const inCart = cart.find(
      (item) => item.id === tool._id
    )

    const currentQty = inCart
      ? inCart.quantity
      : 0

    if (currentQty + 1 > tool.quantity) {
      alert("Out of stock!")
      return
    }

    setCart((prev) => {
      if (inCart) {
        return prev.map((item) =>
          item.id === tool._id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      }

      return [
        ...prev,
        {
          id: tool._id,
          name: tool.name,
          quantity: 1,
        },
      ]
    })
  }

  // ============================================================
  // UPDATE TOOL QUANTITY
  // ============================================================

  const updateQty = (
    id: string,
    qty: number
  ) => {
    if (qty <= 0) return

    const tool = tools.find(
      (item) => item._id === id
    )

    if (!tool) return

    if (qty > tool.quantity) {
      alert("Out of stock!")
      return
    }

    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: qty,
            }
          : item
      )
    )
  }

  // ============================================================
  // REMOVE TOOL
  // ============================================================

  const removeItem = (id: string) => {
    setCart((prev) =>
      prev.filter((item) => item.id !== id)
    )
  }

  // ============================================================
  // MEMBERS
  // ============================================================

  const updateMember = (
    index: number,
    value: string
  ) => {
    setMembers((prev) => {
      const updated = [...prev]
      updated[index] = value
      return updated
    })
  }

  const addMember = () => {
    setMembers((prev) => [
      ...prev,
      "",
    ])
  }

  const removeMember = (
    index: number
  ) => {
    // Keep at least one member field.
    if (members.length === 1) return

    setMembers((prev) =>
      prev.filter(
        (_, memberIndex) =>
          memberIndex !== index
      )
    )
  }

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async () => {
    if (
      !name ||
      !section ||
      !groupNumber ||
      !activityTitle ||
      !instructor
    ) {
      alert(
        "Please complete all required student information."
      )
      return
    }

    if (cart.length === 0) {
      alert("Please select at least one tool.")
      return
    }

    setSubmitting(true)

    const cleanedMembers = members
      .map((member) => member.trim())
      .filter(Boolean)

    const payload = {
      name,
      section,
      groupNumber,
      date,
      activityTitle,
      instructor,
      members: cleanedMembers,
      cart,
    }

    try {
      const res = await fetch(
        "/api/student/borrow",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(payload),
        }
      )

      if (!res.ok) {
        throw new Error(
          "Submission failed"
        )
      }

      alert(
        "Borrower slip submitted successfully!"
      )

      setCart([])

      router.push("/student")
    } catch (err) {
      console.error(err)

      alert(
        "Failed to submit borrower slip. Please try again."
      )
    } finally {
      setSubmitting(false)
    }
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">

          <div className="w-12 h-12 rounded-xl bg-[#800000] flex items-center justify-center shadow-lg">
            <ClipboardList className="w-6 h-6 text-[#FFD700] animate-pulse" />
          </div>

          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#800000] rounded-full animate-spin" />

          <p className="text-sm text-gray-500">
            Loading borrower slip...
          </p>

        </div>
      </div>
    )
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-800 relative overflow-x-hidden">

      {/* ====================================================== */}
      {/* BACKGROUND */}
      {/* ====================================================== */}

      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(#800000 1px, transparent 1px),
            linear-gradient(90deg, #800000 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
        }}
      />

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#800000]/10 shadow-sm">

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

          <div className="min-h-[76px] flex items-center justify-between gap-4">

            {/* LEFT */}

            <div className="flex items-center gap-3 min-w-0">

              <div
                className="
                  relative
                  w-12
                  h-12
                  sm:w-14
                  sm:h-14
                  shrink-0
                  rounded-xl
                  bg-white
                  border
                  border-[#FFD700]/70
                  shadow-sm
                  flex
                  items-center
                  justify-center
                  overflow-hidden
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

                <img
                  src="/logo/OfficialLogo.png"
                  alt="Lab Borrowing System Logo"
                  className="relative z-10 w-10 h-10 sm:w-11 sm:h-11 object-contain"
                />

              </div>

              <div className="min-w-0">

                <div className="flex items-center gap-2">

                  <h1 className="text-base sm:text-xl font-bold text-[#800000] truncate">
                    Student Borrower Slip
                  </h1>

                </div>

                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Laboratory Tool Borrowing Request
                </p>

              </div>

            </div>

            {/* RIGHT */}

            <Button
              variant="outline"
              onClick={() =>
                router.push("/student")
              }
              className="
                h-9
                px-3 sm:px-4
                rounded-lg
                border-[#800000]/20
                text-[#800000]
                hover:bg-[#800000]
                hover:text-[#FFD700]
                shrink-0
              "
            >
              <LogOut className="w-4 h-4" />

              <span className="hidden sm:inline">
                Exit
              </span>
            </Button>

          </div>

        </div>

        <div className="h-[2px] bg-gradient-to-r from-[#800000] via-[#FFD700] to-[#800000]" />

      </header>

      {/* ====================================================== */}
      {/* MAIN */}
      {/* ====================================================== */}

      <main className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-7">

        {/* ==================================================== */}
        {/* PAGE INTRO */}
        {/* ==================================================== */}

        <section className="mb-7">

          <div className="flex items-start gap-3">

            <div className="w-1 h-12 rounded-full bg-[#800000] shrink-0" />

            <div>

              <div className="flex items-center gap-2 mb-1">

                <ClipboardList className="w-4 h-4 text-[#800000]" />

                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#800000]/60">
                  Borrowing Request
                </span>

              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#800000]">
                Student Borrower Slip
              </h2>

              <p className="mt-1 text-sm text-gray-500 max-w-2xl">
                Complete the information below and select
                the laboratory tools required for your
                activity.
              </p>

            </div>

          </div>

        </section>

        {/* ==================================================== */}
        {/* STUDENT INFORMATION */}
        {/* ==================================================== */}

        <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-6">

          <CardHeader className="border-b border-gray-100 bg-white">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-[#800000]/5 text-[#800000] flex items-center justify-center">
                <UserRound className="w-5 h-5" />
              </div>

              <div>

                <CardTitle className="text-lg font-bold text-[#800000]">
                  Student Information
                </CardTitle>

                <p className="text-sm text-gray-500 mt-0.5">
                  Enter the details for this borrowing request.
                </p>

              </div>

            </div>

          </CardHeader>

          <CardContent className="p-5 sm:p-6">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* NAME */}

              <div className="lg:col-span-2">

                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Student Name
                </label>

                <Input
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="h-10 bg-white"
                />

              </div>

              {/* SECTION */}

              <div>

                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Section
                </label>

                <Select
                  value={section}
                  onValueChange={setSection}
                >

                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>

                  <SelectContent>

                    <SelectItem value="H1">
                      H1
                    </SelectItem>

                    <SelectItem value="H2">
                      H2
                    </SelectItem>

                    <SelectItem value="H3">
                      H3
                    </SelectItem>

                  </SelectContent>

                </Select>

              </div>

              {/* GROUP */}

              <div>

                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Group Number
                </label>

                <Input
                  type="number"
                  min="1"
                  placeholder="Group #"
                  value={groupNumber}
                  onChange={(e) =>
                    setGroupNumber(
                      e.target.value
                    )
                  }
                  className="h-10 bg-white"
                />

              </div>

              {/* DATE */}

              <div>

                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Date
                </label>

                <div className="relative">

                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                  <Input
                    type="date"
                    value={date}
                    disabled
                    className="h-10 pl-9 bg-gray-50"
                  />

                </div>

              </div>

              {/* ACTIVITY */}

              <div className="sm:col-span-2 lg:col-span-3">

                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Activity Title
                </label>

                <Input
                  placeholder="Enter laboratory activity title"
                  value={activityTitle}
                  onChange={(e) =>
                    setActivityTitle(
                      e.target.value
                    )
                  }
                  className="h-10 bg-white"
                />

              </div>

            </div>

          </CardContent>

        </Card>

        {/* ==================================================== */}
        {/* AVAILABLE TOOLS */}
        {/* ==================================================== */}

        <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-6">

          <CardHeader className="border-b border-gray-100">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-[#800000]/5 text-[#800000] flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>

              <div>

                <CardTitle className="text-lg font-bold text-[#800000]">
                  Available Tools
                </CardTitle>

                <p className="text-sm text-gray-500 mt-0.5">
                  Select the tools required for your activity.
                </p>

              </div>

            </div>

          </CardHeader>

          <CardContent className="p-5 sm:p-6">

            {availableTools.length === 0 ? (

              <div className="py-10 text-center">

                <Package className="w-8 h-8 text-gray-300 mx-auto mb-3" />

                <p className="text-sm font-medium text-gray-500">
                  No tools available
                </p>

              </div>

            ) : (

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

                {availableTools.map(
                  (tool) => (

                    <div
                      key={tool._id}
                      className="
                        group
                        border
                        border-gray-200
                        rounded-xl
                        p-4
                        flex
                        items-center
                        justify-between
                        gap-4
                        hover:border-[#800000]/20
                        hover:shadow-sm
                        transition-all
                      "
                    >

                      <div className="min-w-0">

                        <p className="font-semibold text-gray-800 truncate">
                          {tool.name}
                        </p>

                        <div className="flex items-center gap-2 mt-1">

                          <span
                            className={`
                              w-1.5
                              h-1.5
                              rounded-full
                              ${
                                tool.displayQuantity > 0
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }
                            `}
                          />

                          <span className="text-xs text-gray-500">
                            {tool.displayQuantity} available
                          </span>

                        </div>

                      </div>

                      <Button
                        size="sm"
                        onClick={() =>
                          addToCart(tool)
                        }
                        disabled={
                          tool.displayQuantity <=
                          0
                        }
                        className="
                          h-9
                          px-3
                          rounded-lg
                          bg-[#800000]
                          text-[#FFD700]
                          hover:bg-[#660000]
                          disabled:bg-gray-200
                          disabled:text-gray-400
                          shrink-0
                        "
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </Button>

                    </div>

                  )
                )}

              </div>

            )}

          </CardContent>

        </Card>

        {/* ==================================================== */}
        {/* SELECTED TOOLS */}
        {/* ==================================================== */}

        <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-6">

          <CardHeader className="border-b border-gray-100">

            <div className="flex items-center justify-between gap-3">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-[#800000]/5 text-[#800000] flex items-center justify-center">
                  <ClipboardList className="w-5 h-5" />
                </div>

                <div>

                  <CardTitle className="text-lg font-bold text-[#800000]">
                    Selected Tools
                  </CardTitle>

                  <p className="text-sm text-gray-500 mt-0.5">
                    Review the tools you want to borrow.
                  </p>

                </div>

              </div>

              {cart.length > 0 && (

                <span className="hidden sm:inline-flex items-center rounded-full bg-[#800000]/5 text-[#800000] px-3 py-1 text-xs font-semibold">
                  {cart.length}{" "}
                  {cart.length === 1
                    ? "tool"
                    : "tools"}
                </span>

              )}

            </div>

          </CardHeader>

          <CardContent className="p-5 sm:p-6">

            {cart.length === 0 ? (

              <div className="border border-dashed border-gray-200 rounded-xl py-10 text-center">

                <Package className="w-8 h-8 text-gray-300 mx-auto mb-3" />

                <p className="font-medium text-gray-500">
                  No tools selected
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Add tools from the available tools section above.
                </p>

              </div>

            ) : (

              <div className="space-y-2">

                {cart.map((item) => (

                  <div
                    key={item.id}
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      border
                      border-gray-200
                      px-3
                      py-3
                      bg-white
                    "
                  >

                    <div className="w-9 h-9 rounded-lg bg-[#800000]/5 text-[#800000] flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">

                      <p className="font-medium text-gray-800 truncate">
                        {item.name}
                      </p>

                    </div>

                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQty(
                          item.id,
                          Number(
                            e.target.value
                          )
                        )
                      }
                      className="w-20 h-9 text-center"
                    />

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        removeItem(
                          item.id
                        )
                      }
                      className="
                        h-9
                        w-9
                        rounded-lg
                        text-gray-400
                        hover:text-red-600
                        hover:bg-red-50
                      "
                      title="Remove tool"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                  </div>

                ))}

              </div>

            )}

          </CardContent>

        </Card>

        {/* ==================================================== */}
        {/* MEMBERS */}
        {/* ==================================================== */}

        <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-6">

          {/* MEMBER HEADER */}

          <CardHeader className="border-b border-gray-100">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-[#800000]/5 text-[#800000] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>

                <div>

                  <CardTitle className="text-lg font-bold text-[#800000]">
                    Group Members
                  </CardTitle>

                  <p className="text-sm text-gray-500 mt-0.5">
                    Enter the names of your group members.
                  </p>

                </div>

              </div>

              {/* MEMBER COUNT */}

              <div className="flex items-center gap-2">

                <span className="text-xs text-gray-400">
                  Members
                </span>

                <span className="min-w-8 h-8 px-2 rounded-lg bg-[#800000]/5 text-[#800000] flex items-center justify-center text-sm font-bold">
                  {members.length}
                </span>

              </div>

            </div>

          </CardHeader>

          {/* MEMBER CONTENT */}

          <CardContent className="p-5 sm:p-6">

            {/* HELPER MESSAGE */}

            <div className="mb-5 rounded-xl bg-[#fafafa] border border-gray-100 px-4 py-3">

              <div className="flex items-start gap-3">

                <div className="w-8 h-8 rounded-lg bg-[#FFD700]/20 text-[#9a7800] flex items-center justify-center shrink-0">
                  <UserRound className="w-4 h-4" />
                </div>

                <div>

                  <p className="text-sm font-medium text-gray-700">
                    Add your group members
                  </p>

                  <p className="text-xs text-gray-500 mt-0.5">
                    You can fill in the available fields below.
                    Add more rows only if your group needs them.
                  </p>

                </div>

              </div>

            </div>

            {/* MEMBER GRID */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              {members.map(
                (member, index) => (

                  <div
                    key={index}
                    className="
                      group
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      p-3
                      transition-all
                      hover:border-[#800000]/20
                      hover:shadow-sm
                    "
                  >

                    {/* NUMBER */}

                    <div className="
                      w-9
                      h-9
                      rounded-lg
                      bg-[#800000]/5
                      text-[#800000]
                      flex
                      items-center
                      justify-center
                      text-xs
                      font-bold
                      shrink-0
                    ">
                      {index + 1}
                    </div>

                    {/* INPUT */}

                    <div className="flex-1 min-w-0">

                      <Input
                        placeholder={`Member ${index + 1} full name`}
                        value={member}
                        onChange={(e) =>
                          updateMember(
                            index,
                            e.target.value
                          )
                        }
                        className="
                          h-9
                          border-0
                          shadow-none
                          px-1
                          focus-visible:ring-0
                          bg-transparent
                        "
                      />

                    </div>

                    {/* REMOVE */}

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        removeMember(
                          index
                        )
                      }
                      disabled={
                        members.length === 1
                      }
                      className="
                        h-8
                        w-8
                        rounded-lg
                        text-gray-300
                        hover:text-red-600
                        hover:bg-red-50
                        disabled:opacity-30
                        shrink-0
                      "
                      title="Remove member"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>

                  </div>

                )
              )}

            </div>

            {/* ADD MORE */}

            <div className="mt-4 flex justify-center">

              <Button
                type="button"
                variant="outline"
                onClick={addMember}
                className="
                  h-9
                  px-4
                  rounded-lg
                  border-[#800000]/20
                  text-[#800000]
                  hover:bg-[#800000]/5
                  hover:border-[#800000]/30
                "
              >
                <Plus className="w-4 h-4" />
                Add another member
              </Button>

            </div>

          </CardContent>

        </Card>

        {/* ==================================================== */}
        {/* INSTRUCTOR + SUBMIT */}
        {/* ==================================================== */}

        <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

          <CardContent className="p-5 sm:p-6">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              {/* INSTRUCTOR */}

              <div className="w-full lg:max-w-md">

                <div className="flex items-center gap-2 mb-2">

                  <GraduationCap className="w-4 h-4 text-[#800000]" />

                  <label className="text-sm font-semibold text-gray-700">
                    Instructor
                  </label>

                </div>

                <Select
                  value={instructor}
                  onValueChange={setInstructor}
                >

                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Select your instructor" />
                  </SelectTrigger>

                  <SelectContent>

                    {teachers.map(
                      (teacher) => (

                        <SelectItem
                          key={teacher._id}
                          value={teacher._id}
                        >
                          {teacher.name}
                        </SelectItem>

                      )
                    )}

                  </SelectContent>

                </Select>

              </div>

              {/* SUBMIT */}

              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="
                  w-full
                  lg:w-auto
                  min-w-[180px]
                  h-11
                  px-6
                  rounded-xl
                  bg-[#800000]
                  text-[#FFD700]
                  hover:bg-[#660000]
                  shadow-sm
                  font-semibold
                "
              >

                {submitting ? (

                  <>
                    <div className="w-4 h-4 border-2 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin" />

                    Submitting...
                  </>

                ) : (

                  <>
                    <Send className="w-4 h-4" />

                    Submit Borrower Slip
                  </>

                )}

              </Button>

            </div>

          </CardContent>

        </Card>

        {/* ==================================================== */}
        {/* FOOTER */}
        {/* ==================================================== */}

        <footer className="py-8">

          <div className="h-px bg-gradient-to-r from-transparent via-[#800000]/10 to-transparent" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 text-xs text-gray-400">

            <p>
              Laboratory Borrowing Management System
            </p>

            <div className="flex items-center gap-2">

              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />

              <span>
                Ready to submit
              </span>

            </div>

          </div>

        </footer>

      </main>

    </div>
  )
}