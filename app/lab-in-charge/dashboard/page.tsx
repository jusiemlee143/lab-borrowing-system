"use client"

import { useState, useEffect } from "react"
import { 
  Search, LogOut, FileText, Plus, Trash2, Check, X, User, 
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

// --- MOCK DATA ---

const initialTools = [
  { id: 1, name: "Arduino Uno", quantity: 10, status: "available" },
  { id: 2, name: "Breadboard", quantity: 5, status: "available" },
  { id: 3, name: "Ultrasonic Sensor", quantity: 2, status: "low stock" },
  { id: 4, name: "Jumper Wires", quantity: 0, status: "unavailable" },
]

const initialRequests = [
  { id: 101, studentName: "Juan Dela Cruz", item: "Arduino Uno", date: "2023-10-24" },
  { id: 102, studentName: "Maria Santos", item: "Breadboard", date: "2023-10-25" },
]

export default function LabInChargePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  
  // Inventory State
  const [tools, setTools] = useState(initialTools)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  
  // Add Item Form State
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [newItemName, setNewItemName] = useState("")
  const [newItemQty, setNewItemQty] = useState("")

  // Requests State
  const [requests, setRequests] = useState(initialRequests)

  // Simulate page load
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  // --- HANDLERS ---

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItemName || !newItemQty) return

    const qty = parseInt(newItemQty)
    const status = qty === 0 ? "unavailable" : qty < 5 ? "low stock" : "available"

    const newItem = {
      id: Date.now(),
      name: newItemName,
      quantity: qty,
      status: status,
    }

    setTools([...tools, newItem])
    setNewItemName("")
    setNewItemQty("")
    setIsAddingItem(false)
  }

  const handleDeleteItem = (id: number) => {
    if (confirm("Are you sure you want to delete this item from inventory?")) {
      setTools(tools.filter((tool) => tool.id !== id))
    }
  }

  const handleApproveRequest = (reqId: number, itemName: string) => {
    // 1. Decrease Quantity in Tools
    const updatedTools = tools.map((tool) => {
      if (tool.name === itemName) {
        const newQty = Math.max(0, tool.quantity - 1)
        let newStatus = "available"
        if (newQty === 0) newStatus = "unavailable"
        else if (newQty < 5) newStatus = "low stock"
        
        return { ...tool, quantity: newQty, status: newStatus }
      }
      return tool
    })

    // 2. Remove Request
    const updatedRequests = requests.filter((req) => req.id !== reqId)

    setTools(updatedTools)
    setRequests(updatedRequests)
    alert(`Approved 1x ${itemName}`)
  }

  const handleRejectRequest = (reqId: number) => {
    if (confirm("Reject this request?")) {
      setRequests(requests.filter((req) => req.id !== reqId))
    }
  }

  // --- FILTERS ---

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === "all" || tool.status === filter
    return matchesSearch && matchesFilter
  })

  // --- CALCULATIONS FOR STATS ---
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
            onClick={() => router.push("/")}
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
            <CardTitle className="text-2xl font-bold">Dashboard Overview</CardTitle>
          </CardHeader>
          <CardContent className="text-[#fff8e1]">
            Manage lab equipment and approve student requests efficiently.
          </CardContent>
        </Card>

        {/* STATS CARDS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total Items */}
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

          {/* Low Stock */}
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

          {/* Pending Requests */}
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

        {/* REQUESTS SECTION (New for Lab In Charge) */}
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
                      <th className="py-3 px-4">Item Requested</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req.id} className="border-b last:border-0 hover:bg-gray-50/50">
                        <td className="py-3 px-4 font-medium">{req.studentName}</td>
                        <td className="py-3 px-4">{req.item}</td>
                        <td className="py-3 px-4 text-gray-500">{req.date}</td>
                        <td className="py-3 px-4 text-right flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-600 hover:bg-green-50"
                            onClick={() => handleApproveRequest(req.id, req.item)}
                          >
                            <Check size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleRejectRequest(req.id)}
                          >
                            <X size={16} />
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

        {/* INVENTORY MANAGEMENT */}
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
          
          {/* ADD ITEM FORM (Collapsible) */}
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
            {/* SEARCH + FILTER */}
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

            {/* INVENTORY TABLE */}
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
                      <tr key={tool.id} className="border-b hover:bg-gray-50 transition-colors">
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
                            onClick={() => handleDeleteItem(tool.id)}
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
    </div>
  )
}