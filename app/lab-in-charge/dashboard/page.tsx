"use client"
import RequestsManager from "@/components/requests/RequestsManager";
import EditToolModal from "@/components/EditToolModal";
import DeleteToolDialog from "@/components/DeleteToolDialog";
import { useState, useEffect } from "react"
import { 
  Search, LogOut, Plus, Trash2, User, 
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
import { toast } from "sonner"

// ----------------------
// TypeScript Interfaces
// ----------------------
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




export default function LabInChargePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const [tools, setTools] = useState<Tool[]>([])
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  
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
  const [deleteOpen, setDeleteOpen] = useState(false)
  

  // Modal state
  
  
  

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const toolsRes = await fetch("/api/lab-in-charge/tools")
      const dashboardRes = await fetch("/api/lab-in-charge/dashboard")
      

      const toolsData = await toolsRes.json()
      const dashboardData = await dashboardRes.json()
      

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
      setStats(dashboardData)
     
    } catch (err) {
      console.error("Fetch error:", err)
      setTools([])
      
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/lab-in-charge")
  }

  const handleAddItem = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!newItemName.trim() || !newItemQty) {
    toast.error("Please fill in all fields.");
    return;
  }

  try {
    const res = await fetch("/api/lab-in-charge/tools", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newItemName.trim(),
        quantity: parseInt(newItemQty),
      }),
    });

    // Read the response from the API
    const data = await res.json();

    // If the server returned an error (duplicate tool, etc.)
    if (!res.ok) {
      toast.error(data.message || "Unable to add tool.");
      return;
    }

    // Refresh inventory
    await fetchData();

    // Show success only if the tool was actually added
    toast.success("Tool added successfully!");

    // Clear form
    setNewItemName("");
    setNewItemQty("");
    setIsAddingItem(false);

  } catch (err) {
    console.error(err);
    toast.error("Unable to add tool.");
  }
  }
    const handleEdit = (tool: Tool) => {
    setSelectedTool(tool)
    setEditModalOpen(true)
  }

  const handleDeleteItem = (tool: Tool) => {
  setSelectedTool(tool);
  setDeleteOpen(true);
};



  

  
  

  

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === "all" || tool.status === filter
    return matchesSearch && matchesFilter
  })


  

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
                <span className="text-3xl font-bold text-[#FFD700]">{stats.lowStock}</span>
                <span className="text-gray-400 text-sm mb-1">items</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md rounded-xl border-l-4 border-blue-500 h-32 flex flex-col justify-between">
  <CardContent className="flex flex-col justify-between h-full p-6">
    <div className="flex items-center justify-between">
      <h3 className="text-gray-600 font-medium text-sm uppercase">
        Pending
      </h3>

      <User className="text-blue-500 w-5 h-5" />
    </div>

    <div className="flex items-end gap-2">
      <span className="text-3xl font-bold text-blue-500">
        {stats.pending}
      </span>

      <span className="text-gray-400 text-sm mb-1">
        requests
      </span>
    </div>
  </CardContent>
</Card>

          <Card className="bg-white shadow-md rounded-xl border-l-4 border-green-500 h-32 flex flex-col justify-between">
  <CardContent className="flex flex-col justify-between h-full p-6">
    <div className="flex items-center justify-between">
      <h3 className="text-gray-600 font-medium text-sm uppercase">
        Approved
      </h3>
      <User className="text-green-500 w-5 h-5" />
    </div>

    <div className="flex items-end gap-2">
      <span className="text-3xl font-bold text-green-500">
        {stats.approved}
      </span>
      <span className="text-gray-400 text-sm mb-1">requests</span>
    </div>
  </CardContent>
</Card>

<Card className="bg-white shadow-md rounded-xl border-l-4 border-indigo-500 h-32 flex flex-col justify-between">
  <CardContent className="flex flex-col justify-between h-full p-6">
    <div className="flex items-center justify-between">
      <h3 className="text-gray-600 font-medium text-sm uppercase">
        Released
      </h3>
      <Package className="text-indigo-500 w-5 h-5" />
    </div>

    <div className="flex items-end gap-2">
      <span className="text-3xl font-bold text-indigo-500">
        {stats.released}
      </span>
      <span className="text-gray-400 text-sm mb-1">borrowed</span>
    </div>
  </CardContent>
</Card>

<Card className="bg-white shadow-md rounded-xl border-l-4 border-purple-500 h-32 flex flex-col justify-between">
  <CardContent className="flex flex-col justify-between h-full p-6">
    <div className="flex items-center justify-between">
      <h3 className="text-gray-600 font-medium text-sm uppercase">
        Returned
      </h3>
      <Package className="text-purple-500 w-5 h-5" />
    </div>

    <div className="flex items-end gap-2">
      <span className="text-3xl font-bold text-purple-500">
        {stats.returned}
      </span>
      <span className="text-gray-400 text-sm mb-1">completed</span>
    </div>
  </CardContent>
</Card>

<Card className="bg-white shadow-md rounded-xl border-l-4 border-red-500 h-32 flex flex-col justify-between">
  <CardContent className="flex flex-col justify-between h-full p-6">
    <div className="flex items-center justify-between">
      <h3 className="text-gray-600 font-medium text-sm uppercase">
        Rejected
      </h3>
      <AlertCircle className="text-red-500 w-5 h-5" />
    </div>

    <div className="flex items-end gap-2">
      <span className="text-3xl font-bold text-red-500">
        {stats.rejected}
      </span>
      <span className="text-gray-400 text-sm mb-1">requests</span>
    </div>
  </CardContent>
</Card>

<Card className="bg-white shadow-md rounded-xl border-l-4 border-cyan-500 h-32 flex flex-col justify-between">
  <CardContent className="flex flex-col justify-between h-full p-6">
    <div className="flex items-center justify-between">
      <h3 className="text-gray-600 font-medium text-sm uppercase">
        Borrowed Today
      </h3>
      <Package className="text-cyan-500 w-5 h-5" />
    </div>

    <div className="flex items-end gap-2">
      <span className="text-3xl font-bold text-cyan-500">
        {stats.borrowedToday}
      </span>
      <span className="text-gray-400 text-sm mb-1">today</span>
    </div>
  </CardContent>
</Card>

<Card className="bg-white shadow-md rounded-xl border-l-4 border-emerald-500 h-32 flex flex-col justify-between">
  <CardContent className="flex flex-col justify-between h-full p-6">
    <div className="flex items-center justify-between">
      <h3 className="text-gray-600 font-medium text-sm uppercase">
        Returned Today
      </h3>
      <Package className="text-emerald-500 w-5 h-5" />
    </div>

    <div className="flex items-end gap-2">
      <span className="text-3xl font-bold text-emerald-500">
        {stats.returnedToday}
      </span>
      <span className="text-gray-400 text-sm mb-1">today</span>
    </div>
  </CardContent>
</Card>
        </div>

        <RequestsManager />

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
  <div className="flex justify-end gap-2">

    <Button
      variant="ghost"
      size="sm"
      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2"
      onClick={() => handleEdit(tool)}
      title="Edit Tool"
    >
      ✏️
    </Button>

    <Button
      variant="ghost"
      size="sm"
      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
      onClick={() => handleDeleteItem(tool)}
      title="Delete Tool"
    >
      <Trash2 size={16} />
    </Button>

  </div>
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

        <EditToolModal
        open={editModalOpen}
        tool={selectedTool}
        onClose={() => setEditModalOpen(false)}
        onSaved={fetchData}
        
/>
<DeleteToolDialog
  open={deleteOpen}
  tool={selectedTool}
  onClose={() => {
    setDeleteOpen(false);
    setSelectedTool(null);
  }}
  onDeleted={async () => {
    await fetchData();
    setDeleteOpen(false);
    setSelectedTool(null);
  }}
/>
      </main>

 

    </div>
  )
} 