"use client"

import { useState, useEffect } from "react"
import { 
  Search, LogOut, Plus, Trash2, Check, X, User, 
  Package, AlertCircle 
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

// ----------------------
// TypeScript Interfaces
// ----------------------
interface Tool {
  _id: string
  name: string
  quantity: number
  status: "available" | "low stock" | "unavailable"
}

interface CartItem {
  id: string
  name: string
  quantity: number
}

interface Request {
  _id: string
  studentName: string
  section?: string
  groupNumber?: string
  date: string
  activityTitle: string
  instructor?: string
  members?: string[]
  cart?: {
    id: string
    name: string
    quantity: number
  }[]
  status: string
}

export default function LabInChargePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const [tools, setTools] = useState<Tool[]>([])
  const [requests, setRequests] = useState<Request[]>([])

  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  const [isAddingItem, setIsAddingItem] = useState(false)
  const [newItemName, setNewItemName] = useState("")
  const [newItemQty, setNewItemQty] = useState("")

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [modalStudentName, setModalStudentName] = useState("")
  const [modalRequests, setModalRequests] = useState<Request[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const toolsRes = await fetch("/api/lab-in-charge/tools")
      const reqRes = await fetch("/api/lab-in-charge/requests")

      const toolsData = await toolsRes.json()
      const reqData = await reqRes.json()

      // Normalize tools with proper status type
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
      setRequests(Array.isArray(reqData) ? reqData : [])
    } catch (err) {
      console.error("Fetch error:", err)
      setTools([])
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/lab-in-charge")
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItemName || !newItemQty) return

    try {
      const res = await fetch("/api/lab-in-charge/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newItemName,
          quantity: parseInt(newItemQty),
        }),
      })
      const newItem = await res.json()

      const formattedItem: Tool = {
        _id: newItem._id,
        name: newItem.name,
        quantity: newItem.quantity,
        status:
          newItem.quantity === 0
            ? "unavailable"
            : newItem.quantity < 5
            ? "low stock"
            : "available",
      }

      setTools(prev => [...prev, formattedItem])
      setNewItemName("")
      setNewItemQty("")
      setIsAddingItem(false)
    } catch (err) {
      console.error("Add error:", err)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item from inventory?")) return
    try {
      await fetch(`/api/lab-in-charge/tools/${id}`, { method: "DELETE" })
      setTools(prev => prev.filter(t => t._id !== id))
    } catch (err) {
      console.error("Delete error:", err)
    }
  }

  const handleApproveRequest = async (reqId: string) => {
    try {
      await fetch(`/api/lab-in-charge/requests/${reqId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      })
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  const handleRejectRequest = async (reqId: string) => {
    try {
      await fetch(`/api/lab-in-charge/requests/${reqId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      })
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  const openModal = (studentName: string, studentRequests: Request[]) => {
    setModalStudentName(studentName)
    setModalRequests(studentRequests)
    setModalOpen(true)
  }

  const closeModal = () => setModalOpen(false)

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === "all" || tool.status === filter
    return matchesSearch && matchesFilter
  })

  const pendingCount = requests.length
  const lowStockCount = tools.filter(t => t.quantity < 5 && t.quantity > 0).length

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
            <div>
              <h1 className="text-xl font-bold text-[#800000] leading-tight">Lab In Charge</h1>
              <p className="text-xs text-gray-500">Inventory & Requests</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2 border-[#800000] text-[#800000] hover:bg-[#800000] hover:text-[#FFD700]"
          >
            <LogOut size={16} /> Log Out
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">

        {/* DASHBOARD CARDS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-white shadow-md rounded-xl border-l-4 border-[#800000] h-32 flex flex-col justify-between">
            <CardContent className="flex flex-col justify-between h-full p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-600 font-medium text-sm uppercase">Total Items</h3>
                <Package className="text-[#800000] w-5 h-5" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-[#800000]">{tools.length}</span>
                <span className="text-gray-400 text-sm mb-1">types</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md rounded-xl border-l-4 border-[#FFD700] h-32 flex flex-col justify-between">
            <CardContent className="flex flex-col justify-between h-full p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-600 font-medium text-sm uppercase">Low Stock</h3>
                <AlertCircle className="text-[#FFD700] w-5 h-5" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-[#FFD700]">{lowStockCount}</span>
                <span className="text-gray-400 text-sm mb-1">items</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md rounded-xl border-l-4 border-blue-500 h-32 flex flex-col justify-between">
            <CardContent className="flex flex-col justify-between h-full p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-600 font-medium text-sm uppercase">Pending Requests</h3>
                <User className="text-blue-500 w-5 h-5" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-blue-500">{pendingCount}</span>
                <span className="text-gray-400 text-sm mb-1">students</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* REQUESTS TABLE */}
        {requests.length > 0 && (
          <Card className="bg-white border shadow-md rounded-2xl overflow-hidden">
            <CardHeader className="bg-blue-50 border-b">
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <User size={20} /> Pending Requests
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from(
                      requests.reduce((map, req) => {
                        if (!map.has(req.studentName)) map.set(req.studentName, [] as Request[])
                        map.get(req.studentName)!.push(req)
                        return map
                      }, new Map<string, Request[]>())
                    ).map(([studentName, studentRequests]) => (
                      <tr key={studentName} className="border-b last:border-0 hover:bg-gray-50/50">
                        <td className="py-3 px-4 font-medium">{studentName}</td>
                        <td className="py-3 px-4 text-gray-500">{studentRequests[0].date}</td>
                        <td className="py-3 px-4 text-right flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-blue-600 hover:bg-blue-50"
                            onClick={() => openModal(studentName, studentRequests)}
                          >
                            View
                          </Button>
                          
                         
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* INVENTORY TABLE */}
        <Card className="bg-white border shadow-md rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[#800000]">Inventory Management</CardTitle>
            <Button 
              onClick={() => setIsAddingItem(!isAddingItem)}
              className="bg-[#800000] text-[#FFD700] hover:bg-[#660000]"
            >
              <Plus size={16} className="mr-2"/> Add New Item
            </Button>
          </CardHeader>

          {isAddingItem && (
            <CardContent className="bg-gray-50 border-b p-6 animate-in fade-in slide-in-from-top-2">
              <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                  <Input 
                    placeholder="e.g. Multimeter" 
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                  />
                </div>
                <div className="w-full sm:w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    min="0"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                    Save Item
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddingItem(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          )}

          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="relative w-full sm:w-1/2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search inventory..."
                  className="pl-9 w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <Select onValueChange={setFilter} defaultValue="all">
                <SelectTrigger className="w-full sm:w-48 border-[#800000]">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Show All</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="low stock">Low Stock</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-[#f5f5f5]">
                  <tr>
                    <th className="py-3 px-4 text-left text-[#800000] font-semibold">Tool Name</th>
                    <th className="py-3 px-4 text-left text-[#800000] font-semibold">Quantity</th>
                    <th className="py-3 px-4 text-center text-[#800000] font-semibold">Status</th>
                    <th className="py-3 px-4 text-right text-[#800000] font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTools.length > 0 ? (
                    filteredTools.map((tool) => (
                      <tr key={tool._id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-900">{tool.name}</td>
                        <td className="py-3 px-4 text-gray-600">{tool.quantity}</td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                              tool.status === "available"
                                ? "bg-green-100 text-green-700"
                                : tool.status === "low stock"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {tool.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
                            onClick={() => handleDeleteItem(tool._id)}
                            title="Delete Item"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">
                        No tools found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

     {/* MODAL */}
{modalOpen && modalRequests.length > 0 && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl overflow-y-auto max-h-[90vh]">

      <h2 className="text-xl font-bold text-[#800000] mb-4">
        Request Details
      </h2>

      {modalRequests.map((req) => (
        <div key={req._id} className="mb-6 border-b pb-4">

          {/* BASIC INFO */}
          <div className="space-y-1 text-sm mb-3">
            <p><strong>Student:</strong> {req.studentName}</p>
            <p><strong>Section:</strong> {req.section || "N/A"}</p>
            <p><strong>Group #:</strong> {req.groupNumber || "N/A"}</p>
            <p><strong>Date:</strong> {req.date}</p>
            <p><strong>Activity:</strong> {req.activityTitle}</p>
            <p><strong>Instructor:</strong> {req.instructor || "N/A"}</p>
          </div>

          {/* MEMBERS */}
          <div className="mb-3">
            <h3 className="font-semibold text-[#800000] text-sm">Members:</h3>
            {req.members && req.members.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-gray-700">
                {req.members.map((member, i) => (
                  <li key={i}>{member}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm">No members</p>
            )}
          </div>

          {/* CART */}
          <div>
            <h3 className="font-semibold text-[#800000] text-sm">Requested Items:</h3>
            {req.cart && req.cart.length > 0 ? (
              <div className="space-y-1">
                {req.cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm border-b pb-1">
                    <span>{item.name}</span>
                    <span className="text-gray-500">Qty: {item.quantity}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No items</p>
            )}
          </div>

        </div>
      ))}

      {/* ACTION BUTTONS */}
      <div className="flex gap-2 mt-4">
        <Button
          className="bg-green-600 hover:bg-green-700 w-full"
          onClick={() => {
            handleApproveRequest(modalRequests[0]._id)
            closeModal()
          }}
        >
          Approve
        </Button>

        <Button
          className="bg-red-600 hover:bg-red-700 w-full"
          onClick={() => {
            handleRejectRequest(modalRequests[0]._id)
            closeModal()
          }}
        >
          Reject
        </Button>
      </div>

      <Button
        onClick={closeModal}
        variant="outline"
        className="mt-2 w-full"
      >
        Close
      </Button>

    </div>
  </div>
)}

    </div>
  )
} 