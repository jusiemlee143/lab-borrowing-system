"use client"

import RequestsManager from "@/components/requests/RequestsManager"
import EditToolModal from "@/components/EditToolModal"
import DeleteToolDialog from "@/components/DeleteToolDialog"
import { useState, useEffect } from "react"
import {
  Search,
  LogOut,
  Plus,
  Trash2,
  User,
  Package,
  AlertCircle,
  Cpu,
  CircuitBoard,
  Database,
  Boxes,
  Activity,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
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

import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"

// ============================================================
// TYPES
// ============================================================

interface Tool {
  _id: string
  name: string
  quantity: number
  status: "available" | "low stock" | "unavailable"
}

interface DashboardStats {
  totalTools: number
  availableTools: number
  lowStock: number
  unavailable: number

  pending: number
  approved: number
  released: number
  returned: number
  rejected: number

  borrowedToday: number
  returnedToday: number
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function LabInChargePage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)

  const [tools, setTools] = useState<Tool[]>([])
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const [stats, setStats] = useState<DashboardStats>({
    totalTools: 0,
    availableTools: 0,
    lowStock: 0,
    unavailable: 0,

    pending: 0,
    approved: 0,
    released: 0,
    returned: 0,
    rejected: 0,

    borrowedToday: 0,
    returnedToday: 0,
  })

  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  const [isAddingItem, setIsAddingItem] = useState(false)
  const [newItemName, setNewItemName] = useState("")
  const [newItemQty, setNewItemQty] = useState("")

  // ============================================================
  // FETCH DATA
  // ============================================================

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      const [toolsRes, dashboardRes] = await Promise.all([
        fetch("/api/lab-in-charge/tools"),
        fetch("/api/lab-in-charge/dashboard"),
      ])

      const toolsData = await toolsRes.json()
      const dashboardData = await dashboardRes.json()

      const normalizedTools: Tool[] = Array.isArray(toolsData)
        ? toolsData.map((t: any) => ({
            _id: t._id,
            name: t.name,
            quantity: t.quantity,
            status:
              t.quantity === 0
                ? "unavailable"
                : t.quantity < 5
                ? "low stock"
                : "available",
          }))
        : []

      setTools(normalizedTools)

      setStats({
        totalTools: dashboardData?.totalTools ?? normalizedTools.length,
        availableTools: dashboardData?.availableTools ?? 0,
        lowStock: dashboardData?.lowStock ?? 0,
        unavailable: dashboardData?.unavailable ?? 0,
        pending: dashboardData?.pending ?? 0,
        approved: dashboardData?.approved ?? 0,
        released: dashboardData?.released ?? 0,
        returned: dashboardData?.returned ?? 0,
        rejected: dashboardData?.rejected ?? 0,
        borrowedToday: dashboardData?.borrowedToday ?? 0,
        returnedToday: dashboardData?.returnedToday ?? 0,
      })
    } catch (err) {
      console.error("Fetch error:", err)
      setTools([])
      toast.error("Unable to load dashboard data.")
    } finally {
      setLoading(false)
    }
  }

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    })

    router.push("/lab-in-charge")
  }

  // ============================================================
  // ADD ITEM
  // ============================================================

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newItemName.trim() || !newItemQty) {
      toast.error("Please fill in all fields.")
      return
    }

    const quantity = parseInt(newItemQty)

    if (Number.isNaN(quantity) || quantity < 0) {
      toast.error("Please enter a valid quantity.")
      return
    }

    try {
      const res = await fetch("/api/lab-in-charge/tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newItemName.trim(),
          quantity,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || "Unable to add tool.")
        return
      }

      await fetchData()

      toast.success("Tool added successfully!")

      setNewItemName("")
      setNewItemQty("")
      setIsAddingItem(false)
    } catch (err) {
      console.error(err)
      toast.error("Unable to add tool.")
    }
  }

  // ============================================================
  // EDIT / DELETE
  // ============================================================

  const handleEdit = (tool: Tool) => {
    setSelectedTool(tool)
    setEditModalOpen(true)
  }

  const handleDeleteItem = (tool: Tool) => {
    setSelectedTool(tool)
    setDeleteOpen(true)
  }

  // ============================================================
  // FILTER
  // ============================================================

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesFilter =
      filter === "all" || tool.status === filter

    return matchesSearch && matchesFilter
  })

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#800000] flex items-center justify-center shadow-lg">
            <Cpu className="w-6 h-6 text-[#FFD700] animate-pulse" />
          </div>

          <Spinner />

          <p className="text-sm text-gray-500">
            Loading laboratory dashboard...
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
      {/* TECHNOLOGY BACKGROUND */}
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

        <div className="max-w-[1500px] mx-auto px-5 sm:px-7 lg:px-10">

          <div className="h-[76px] flex items-center justify-between gap-4">

            {/* ================= LEFT ================= */}

            <div className="flex items-center gap-3 min-w-0">

              {/* LOGO */}

              <div
                className="
                  relative
                  w-[54px]
                  h-[54px]
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
                  className="relative z-10 w-[43px] h-[43px] object-contain"
                />

              </div>

              {/* TITLE */}

              <div className="min-w-0">

                <div className="flex items-center gap-2">

                  <h1 className="text-lg sm:text-xl font-bold text-[#800000] truncate">
                    Lab-in-Charge
                  </h1>

                  <span className="hidden sm:flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#800000]/50 font-semibold">
                    <Activity className="w-3 h-3" />
                    Dashboard
                  </span>

                </div>

                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Inventory & Request Management
                </p>

              </div>

            </div>

            {/* ================= RIGHT ================= */}

            <div className="flex items-center gap-2">

              <Button
                variant="ghost"
                onClick={fetchData}
                className="
                  hidden sm:flex
                  h-9
                  px-3
                  text-gray-500
                  hover:text-[#800000]
                  hover:bg-[#800000]/5
                "
                title="Refresh dashboard"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="
                  h-9
                  px-3 sm:px-4
                  flex
                  items-center
                  gap-2
                  border-[#800000]/20
                  text-[#800000]
                  hover:bg-[#800000]
                  hover:text-[#FFD700]
                  rounded-lg
                "
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">
                  Log Out
                </span>
              </Button>

            </div>

          </div>

        </div>

        {/* GOLD ACCENT LINE */}

        <div className="h-[2px] bg-gradient-to-r from-[#800000] via-[#FFD700] to-[#800000]" />

      </header>

      {/* ====================================================== */}
      {/* MAIN */}
      {/* ====================================================== */}

      <main className="relative max-w-[1500px] mx-auto px-5 sm:px-7 lg:px-10 py-7">

        {/* ==================================================== */}
        {/* PAGE INTRO */}
        {/* ==================================================== */}

        <section className="mb-7">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

            <div>

              <div className="flex items-center gap-2 mb-2">

                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />

                <span className="text-xs font-semibold text-green-600">
                  System Ready
                </span>

              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#800000]">
                Laboratory Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Monitor laboratory inventory and manage student borrowing requests.
              </p>

            </div>

            <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
              <CircuitBoard className="w-4 h-4 text-[#800000]/50" />
              Laboratory Technology Platform
            </div>

          </div>

        </section>

        {/* ==================================================== */}
        {/* INVENTORY STATS */}
        {/* ==================================================== */}

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

          <DashboardStat
            title="Total Tools"
            value={tools.length}
            label="tool types"
            icon={<Package className="w-5 h-5" />}
            accent="maroon"
          />

          <DashboardStat
            title="Available"
            value={stats.availableTools}
            label="items"
            icon={<Boxes className="w-5 h-5" />}
            accent="green"
          />

          <DashboardStat
            title="Low Stock"
            value={stats.lowStock}
            label="items"
            icon={<AlertCircle className="w-5 h-5" />}
            accent="gold"
          />

          <DashboardStat
            title="Unavailable"
            value={stats.unavailable}
            label="items"
            icon={<Package className="w-5 h-5" />}
            accent="red"
          />

        </section>

        {/* ==================================================== */}
        {/* REQUEST STATS */}
        {/* ==================================================== */}

        <section className="mb-8">

          <div className="flex items-center gap-3 mb-4">

            <div className="h-px flex-1 bg-gray-200" />

            <div className="flex items-center gap-2 px-3">

              <Activity className="w-4 h-4 text-[#800000]" />

              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#800000]/60">
                Request Activity
              </span>

            </div>

            <div className="h-px flex-1 bg-gray-200" />

          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">

            <SmallStat
              title="Pending"
              value={stats.pending}
              label="requests"
              icon={<User className="w-4 h-4" />}
              iconClass="text-blue-600 bg-blue-50"
            />

            <SmallStat
              title="Approved"
              value={stats.approved}
              label="requests"
              icon={<ShieldCheck className="w-4 h-4" />}
              iconClass="text-green-600 bg-green-50"
            />

            <SmallStat
              title="Released"
              value={stats.released}
              label="borrowed"
              icon={<Package className="w-4 h-4" />}
              iconClass="text-indigo-600 bg-indigo-50"
            />

            <SmallStat
              title="Returned"
              value={stats.returned}
              label="completed"
              icon={<RefreshCw className="w-4 h-4" />}
              iconClass="text-purple-600 bg-purple-50"
            />

            <SmallStat
              title="Rejected"
              value={stats.rejected}
              label="requests"
              icon={<AlertCircle className="w-4 h-4" />}
              iconClass="text-red-600 bg-red-50"
            />

          </div>

        </section>

        {/* ==================================================== */}
        {/* TODAY */}
        {/* ==================================================== */}

        <section className="grid grid-cols-2 gap-4 mb-8 max-w-xl">

          <TodayCard
            title="Borrowed Today"
            value={stats.borrowedToday}
            icon={<Package className="w-5 h-5" />}
            accent="cyan"
          />

          <TodayCard
            title="Returned Today"
            value={stats.returnedToday}
            icon={<RefreshCw className="w-5 h-5" />}
            accent="emerald"
          />

        </section>

        {/* ==================================================== */}
        {/* REQUEST MANAGER */}
        {/* ==================================================== */}

        <section className="mb-8">

          <div className="flex items-center gap-2 mb-4">

            <div className="w-1 h-6 rounded-full bg-[#800000]" />

            <h2 className="text-xl font-bold text-[#800000]">
              Borrowing Requests
            </h2>

          </div>

          <RequestsManager />

        </section>

        {/* ==================================================== */}
        {/* INVENTORY */}
        {/* ==================================================== */}

        <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

          {/* CARD HEADER */}

          <CardHeader className="border-b border-gray-100 bg-white">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div>

                <div className="flex items-center gap-2">

                  <div className="w-9 h-9 rounded-lg bg-[#800000]/5 text-[#800000] flex items-center justify-center">
                    <Database className="w-4 h-4" />
                  </div>

                  <CardTitle className="text-lg font-bold text-[#800000]">
                    Inventory Management
                  </CardTitle>

                </div>

                <p className="text-sm text-gray-500 mt-2 ml-11">
                  Manage laboratory tools and available quantities.
                </p>

              </div>

              <Button
                onClick={() => setIsAddingItem(!isAddingItem)}
                className="
                  bg-[#800000]
                  text-[#FFD700]
                  hover:bg-[#660000]
                  rounded-lg
                  h-10
                  px-4
                  shadow-sm
                "
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Item
              </Button>

            </div>

          </CardHeader>

          {/* ================================================== */}
          {/* ADD ITEM FORM */}
          {/* ================================================== */}

          {isAddingItem && (

            <CardContent className="bg-[#fafafa] border-b border-gray-100 p-5">

              <form
                onSubmit={handleAddItem}
                className="grid grid-cols-1 sm:grid-cols-[1fr_150px_auto] gap-4 items-end"
              >

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Item Name
                  </label>

                  <Input
                    placeholder="e.g. Multimeter"
                    value={newItemName}
                    onChange={(e) =>
                      setNewItemName(e.target.value)
                    }
                    className="h-10 bg-white"
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Quantity
                  </label>

                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    value={newItemQty}
                    onChange={(e) =>
                      setNewItemQty(e.target.value)
                    }
                    className="h-10 bg-white"
                  />

                </div>

                <div className="flex gap-2">

                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 h-10"
                  >
                    Save
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setIsAddingItem(false)
                    }
                    className="h-10"
                  >
                    Cancel
                  </Button>

                </div>

              </form>

            </CardContent>

          )}

          {/* ================================================== */}
          {/* INVENTORY CONTENT */}
          {/* ================================================== */}

          <CardContent className="p-5">

            {/* SEARCH + FILTER */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

              <div className="relative w-full sm:max-w-md">

                <Search
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    h-4
                    w-4
                    text-gray-400
                  "
                />

                <Input
                  placeholder="Search inventory..."
                  className="pl-9 h-10 bg-white"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

              <Select
                onValueChange={setFilter}
                defaultValue="all"
              >

                <SelectTrigger className="w-full sm:w-48 h-10 border-gray-200">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>

                <SelectContent>

                  <SelectItem value="all">
                    Show All
                  </SelectItem>

                  <SelectItem value="available">
                    Available
                  </SelectItem>

                  <SelectItem value="low stock">
                    Low Stock
                  </SelectItem>

                  <SelectItem value="unavailable">
                    Unavailable
                  </SelectItem>

                </SelectContent>

              </Select>

            </div>

            {/* ================================================= */}
            {/* TABLE */}
            {/* ================================================= */}

            <div className="overflow-x-auto rounded-xl border border-gray-200">

              <table className="w-full text-sm">

                <thead className="bg-[#fafafa] border-b border-gray-200">

                  <tr>

                    <th className="py-3.5 px-4 text-left text-[#800000] font-semibold">
                      Tool Name
                    </th>

                    <th className="py-3.5 px-4 text-left text-[#800000] font-semibold">
                      Quantity
                    </th>

                    <th className="py-3.5 px-4 text-center text-[#800000] font-semibold">
                      Status
                    </th>

                    <th className="py-3.5 px-4 text-right text-[#800000] font-semibold">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredTools.length > 0 ? (

                    filteredTools.map((tool) => (

                      <tr
                        key={tool._id}
                        className="
                          border-b
                          border-gray-100
                          last:border-0
                          hover:bg-[#800000]/[0.02]
                          transition-colors
                        "
                      >

                        <td className="py-4 px-4">

                          <div className="flex items-center gap-3">

                            <div className="w-9 h-9 rounded-lg bg-[#800000]/5 text-[#800000] flex items-center justify-center">
                              <Package className="w-4 h-4" />
                            </div>

                            <span className="font-medium text-gray-900">
                              {tool.name}
                            </span>

                          </div>

                        </td>

                        <td className="py-4 px-4 text-gray-600">
                          {tool.quantity}
                        </td>

                        <td className="py-4 px-4 text-center">

                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-1.5
                              px-3
                              py-1.5
                              rounded-full
                              text-xs
                              font-semibold
                              ${
                                tool.status === "available"
                                  ? "bg-green-100 text-green-700"
                                  : tool.status === "low stock"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }
                            `}
                          >

                            <span
                              className={`
                                w-1.5
                                h-1.5
                                rounded-full
                                ${
                                  tool.status === "available"
                                    ? "bg-green-500"
                                    : tool.status === "low stock"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }
                              `}
                            />

                            {tool.status}

                          </span>

                        </td>

                        <td className="py-4 px-4">

                          <div className="flex items-center justify-end gap-1">

                            <Button
                              variant="ghost"
                              size="sm"
                              className="
                                text-blue-600
                                hover:text-blue-700
                                hover:bg-blue-50
                                h-9
                                w-9
                                p-0
                              "
                              onClick={() =>
                                handleEdit(tool)
                              }
                              title="Edit Tool"
                            >
                              ✏️
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="
                                text-red-500
                                hover:text-red-700
                                hover:bg-red-50
                                h-9
                                w-9
                                p-0
                              "
                              onClick={() =>
                                handleDeleteItem(tool)
                              }
                              title="Delete Tool"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>

                          </div>

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>

                      <td
                        colSpan={4}
                        className="py-12 text-center"
                      >

                        <div className="flex flex-col items-center">

                          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
                            <Package className="w-5 h-5 text-gray-400" />
                          </div>

                          <p className="font-medium text-gray-600">
                            No tools found
                          </p>

                          <p className="text-sm text-gray-400 mt-1">
                            Try changing your search or filter.
                          </p>

                        </div>

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

            {/* TABLE FOOTER */}

            <div className="flex items-center justify-between mt-4 text-xs text-gray-400">

              <span>
                Showing {filteredTools.length} of {tools.length} tool types
              </span>

              <div className="flex items-center gap-1">
                <Boxes className="w-3.5 h-3.5" />
                Inventory Database
              </div>

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
                System Ready
              </span>

            </div>

          </div>

        </footer>

      </main>

      {/* ====================================================== */}
      {/* EDIT TOOL MODAL */}
      {/* ====================================================== */}

      <EditToolModal
        open={editModalOpen}
        tool={selectedTool}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedTool(null)
        }}
        onSaved={fetchData}
      />

      {/* ====================================================== */}
      {/* DELETE TOOL DIALOG */}
      {/* ====================================================== */}

      <DeleteToolDialog
        open={deleteOpen}
        tool={selectedTool}
        onClose={() => {
          setDeleteOpen(false)
          setSelectedTool(null)
        }}
        onDeleted={async () => {
          await fetchData()
          setDeleteOpen(false)
          setSelectedTool(null)
        }}
      />

    </div>
  )
}

// ============================================================
// DASHBOARD STAT
// ============================================================

function DashboardStat({
  title,
  value,
  label,
  icon,
  accent,
}: {
  title: string
  value: number
  label: string
  icon: React.ReactNode
  accent: "maroon" | "green" | "gold" | "red"
}) {
  const styles = {
    maroon: {
      border: "border-[#800000]/15",
      iconBg: "bg-[#800000]/5",
      iconColor: "text-[#800000]",
      value: "text-[#800000]",
    },
    green: {
      border: "border-green-200",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      value: "text-green-600",
    },
    gold: {
      border: "border-[#FFD700]/40",
      iconBg: "bg-[#FFD700]/10",
      iconColor: "text-[#b88600]",
      value: "text-[#b88600]",
    },
    red: {
      border: "border-red-200",
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      value: "text-red-600",
    },
  }

  const style = styles[accent]

  return (
    <Card
      className={`
        bg-white
        border
        ${style.border}
        rounded-xl
        shadow-sm
        hover:shadow-md
        transition-shadow
      `}
    >
      <CardContent className="p-5">

        <div className="flex items-center justify-between">

          <span className="text-sm font-medium text-gray-500">
            {title}
          </span>

          <div
            className={`
              w-9
              h-9
              rounded-lg
              ${style.iconBg}
              ${style.iconColor}
              flex
              items-center
              justify-center
            `}
          >
            {icon}
          </div>

        </div>

        <div className="flex items-end gap-2 mt-4">

          <span
            className={`
              text-2xl
              sm:text-3xl
              font-bold
              ${style.value}
            `}
          >
            {value}
          </span>

          <span className="text-xs text-gray-400 mb-1">
            {label}
          </span>

        </div>

      </CardContent>
    </Card>
  )
}

// ============================================================
// SMALL REQUEST STAT
// ============================================================

function SmallStat({
  title,
  value,
  label,
  icon,
  iconClass,
}: {
  title: string
  value: number
  label: string
  icon: React.ReactNode
  iconClass: string
}) {
  return (
    <Card className="bg-white border border-gray-100 rounded-xl shadow-sm">

      <CardContent className="p-4">

        <div className="flex items-center justify-between">

          <span className="text-sm font-medium text-gray-500">
            {title}
          </span>

          <div
            className={`
              w-8
              h-8
              rounded-lg
              flex
              items-center
              justify-center
              ${iconClass}
            `}
          >
            {icon}
          </div>

        </div>

        <div className="flex items-end gap-2 mt-3">

          <span className="text-2xl font-bold text-gray-800">
            {value}
          </span>

          <span className="text-xs text-gray-400 mb-1">
            {label}
          </span>

        </div>

      </CardContent>

    </Card>
  )
}

// ============================================================
// TODAY CARD
// ============================================================

function TodayCard({
  title,
  value,
  icon,
  accent,
}: {
  title: string
  value: number
  icon: React.ReactNode
  accent: "cyan" | "emerald"
}) {
  const styles = {
    cyan: {
      bg: "bg-cyan-50",
      text: "text-cyan-600",
      border: "border-cyan-100",
    },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-100",
    },
  }

  const style = styles[accent]

  return (
    <Card
      className={`
        bg-white
        border
        ${style.border}
        rounded-xl
        shadow-sm
      `}
    >

      <CardContent className="p-5">

        <div className="flex items-center gap-3">

          <div
            className={`
              w-10
              h-10
              rounded-lg
              ${style.bg}
              ${style.text}
              flex
              items-center
              justify-center
            `}
          >
            {icon}
          </div>

          <div>

            <p className="text-sm text-gray-500">
              {title}
            </p>

            <p
              className={`
                text-2xl
                font-bold
                ${style.text}
              `}
            >
              {value}
            </p>

          </div>

        </div>

      </CardContent>

    </Card>
  )
}