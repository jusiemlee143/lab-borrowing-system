"use client"

import { useEffect, useMemo, useState } from "react"

import {
  Search,
  Plus,
  Trash2,
  Package,
  Boxes,
  Database,
  ChevronLeft,
  ChevronRight,
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

import EditToolModal from "@/components/EditToolModal"
import DeleteToolDialog from "@/components/DeleteToolDialog"

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

interface ToolListProps {
  onRefresh?: () => Promise<void>
}

// ============================================================
// CONSTANTS
// ============================================================

const ITEMS_PER_PAGE = 5

// ============================================================
// COMPONENT
// ============================================================

export default function ToolList({
  onRefresh,
}: ToolListProps) {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedTool, setSelectedTool] =
    useState<Tool | null>(null)

  const [editModalOpen, setEditModalOpen] =
    useState(false)

  const [deleteOpen, setDeleteOpen] =
    useState(false)

  const [search, setSearch] =
    useState("")

  const [filter, setFilter] =
    useState("all")

  const [isAddingItem, setIsAddingItem] =
    useState(false)

  const [newItemName, setNewItemName] =
    useState("")

  const [newItemQty, setNewItemQty] =
    useState("")

  const [currentPage, setCurrentPage] =
    useState(1)

  // ============================================================
  // FETCH TOOLS
  // ============================================================

  useEffect(() => {
    fetchTools()
  }, [])

  async function fetchTools() {
    try {
      setLoading(true)

      const res = await fetch(
        "/api/lab-in-charge/tools"
      )

      const data = await res.json()

      const normalizedTools: Tool[] =
        Array.isArray(data)
          ? data.map((tool: any) => ({
              _id: tool._id,
              name: tool.name,
              quantity: tool.quantity,
              status:
                tool.quantity === 0
                  ? "unavailable"
                  : tool.quantity < 5
                  ? "low stock"
                  : "available",
            }))
          : []

      setTools(normalizedTools)
    } catch (error) {
      console.error(
        "Error fetching tools:",
        error
      )

      setTools([])

      toast.error(
        "Unable to load inventory."
      )
    } finally {
      setLoading(false)
    }
  }

  // ============================================================
  // REFRESH EVERYTHING
  // ============================================================

  async function refreshData() {
    await fetchTools()

    if (onRefresh) {
      await onRefresh()
    }
  }

  // ============================================================
  // ADD ITEM
  // ============================================================

  async function handleAddItem(
    e: React.FormEvent
  ) {
    e.preventDefault()

    if (
      !newItemName.trim() ||
      !newItemQty
    ) {
      toast.error(
        "Please fill in all fields."
      )

      return
    }

    const quantity =
      parseInt(newItemQty)

    if (
      Number.isNaN(quantity) ||
      quantity < 0
    ) {
      toast.error(
        "Please enter a valid quantity."
      )

      return
    }

    try {
      const res = await fetch(
        "/api/lab-in-charge/tools",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: newItemName.trim(),
            quantity,
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        toast.error(
          data.message ||
            "Unable to add tool."
        )

        return
      }

      await refreshData()

      toast.success(
        "Tool added successfully!"
      )

      setNewItemName("")
      setNewItemQty("")
      setIsAddingItem(false)

      setCurrentPage(1)
    } catch (error) {
      console.error(
        "Add tool error:",
        error
      )

      toast.error(
        "Unable to add tool."
      )
    }
  }

  // ============================================================
  // EDIT
  // ============================================================

  function handleEdit(tool: Tool) {
    setSelectedTool(tool)
    setEditModalOpen(true)
  }

  // ============================================================
  // DELETE
  // ============================================================

  function handleDeleteItem(tool: Tool) {
    setSelectedTool(tool)
    setDeleteOpen(true)
  }

  // ============================================================
  // FILTER
  // ============================================================

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch =
        tool.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )

      const matchesFilter =
        filter === "all" ||
        tool.status === filter

      return (
        matchesSearch &&
        matchesFilter
      )
    })
  }, [tools, search, filter])

  // ============================================================
  // RESET PAGE WHEN SEARCH / FILTER CHANGES
  // ============================================================

  useEffect(() => {
    setCurrentPage(1)
  }, [search, filter])

  // ============================================================
  // PAGINATION
  // ============================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredTools.length /
        ITEMS_PER_PAGE
    )
  )

  useEffect(() => {
    if (
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const startIndex =
    (currentPage - 1) *
    ITEMS_PER_PAGE

  const endIndex =
    startIndex + ITEMS_PER_PAGE

  const paginatedTools =
    filteredTools.slice(
      startIndex,
      endIndex
    )

  const showingFrom =
    filteredTools.length === 0
      ? 0
      : startIndex + 1

  const showingTo =
    Math.min(
      endIndex,
      filteredTools.length
    )

  // ============================================================
  // PAGE BUTTONS
  // ============================================================

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  )

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <Card className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="h-1 bg-gradient-to-r from-[#800000] via-[#FFD700] to-[#800000]" />

        <CardContent className="flex min-h-[300px] flex-col items-center justify-center">

          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#800000]/5 text-[#800000]">

            <Package className="h-6 w-6 animate-pulse" />

          </div>

          <p className="text-sm font-medium text-gray-600">
            Loading inventory...
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Please wait while the tools are loaded.
          </p>

        </CardContent>

      </Card>
    )
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <>
      <Card className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* ================================================== */}
        {/* TOP ACCENT */}
        {/* ================================================== */}

        <div className="h-1 bg-gradient-to-r from-[#800000] via-[#FFD700] to-[#800000]" />

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <CardHeader className="border-b border-gray-100 bg-white">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#800000]/5 text-[#800000]">

                  <Database className="h-4 w-4" />

                </div>

                <CardTitle className="text-lg font-bold text-[#800000]">
                  Inventory Management
                </CardTitle>

              </div>

              <p className="ml-11 mt-2 text-sm text-gray-500">
                Manage laboratory tools and available quantities.
              </p>

            </div>

            <Button
              onClick={() =>
                setIsAddingItem(
                  !isAddingItem
                )
              }
              className="
                h-10
                rounded-lg
                bg-[#800000]
                px-4
                text-[#FFD700]
                shadow-sm
                hover:bg-[#660000]
              "
            >
              <Plus className="mr-2 h-4 w-4" />

              Add New Item
            </Button>

          </div>

        </CardHeader>

        {/* ================================================== */}
        {/* ADD ITEM */}
        {/* ================================================== */}

        {isAddingItem && (
          <CardContent className="border-b border-gray-100 bg-[#fafafa] p-5">

            <form
              onSubmit={handleAddItem}
              className="grid grid-cols-1 items-end gap-4 sm:grid-cols-[1fr_150px_auto]"
            >

              <div>

                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Item Name
                </label>

                <Input
                  placeholder="e.g. Multimeter"
                  value={newItemName}
                  onChange={(e) =>
                    setNewItemName(
                      e.target.value
                    )
                  }
                  className="h-10 bg-white"
                />

              </div>

              <div>

                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Quantity
                </label>

                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  value={newItemQty}
                  onChange={(e) =>
                    setNewItemQty(
                      e.target.value
                    )
                  }
                  className="h-10 bg-white"
                />

              </div>

              <div className="flex gap-2">

                <Button
                  type="submit"
                  className="h-10 bg-green-600 hover:bg-green-700"
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
        {/* CONTENT */}
        {/* ================================================== */}

        <CardContent className="p-5">

          {/* SEARCH + FILTER */}

          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="relative w-full sm:max-w-md">

              <Search
                className="
                  absolute
                  left-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <Input
                placeholder="Search inventory..."
                className="h-10 bg-white pl-9"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>

            <Select
              value={filter}
              onValueChange={setFilter}
            >

              <SelectTrigger className="h-10 w-full border-gray-200 sm:w-48">

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

          {/* =================================================
              TABLE
          ================================================= */}

          <div className="overflow-x-auto rounded-xl border border-gray-200">

            <table className="w-full text-sm">

              <thead className="border-b border-gray-200 bg-[#fafafa]">

                <tr>

                  <th className="px-4 py-3.5 text-left font-semibold text-[#800000]">
                    Tool Name
                  </th>

                  <th className="px-4 py-3.5 text-left font-semibold text-[#800000]">
                    Quantity
                  </th>

                  <th className="px-4 py-3.5 text-center font-semibold text-[#800000]">
                    Status
                  </th>

                  <th className="px-4 py-3.5 text-right font-semibold text-[#800000]">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {paginatedTools.length > 0 ? (
                  paginatedTools.map(
                    (tool) => (
                      <tr
                        key={tool._id}
                        className="
                          border-b
                          border-gray-100
                          transition-colors
                          last:border-0
                          hover:bg-[#800000]/[0.02]
                        "
                      >

                        {/* TOOL */}

                        <td className="px-4 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#800000]/5 text-[#800000]">

                              <Package className="h-4 w-4" />

                            </div>

                            <span className="font-medium text-gray-900">
                              {tool.name}
                            </span>

                          </div>

                        </td>

                        {/* QUANTITY */}

                        <td className="px-4 py-4 text-gray-600">
                          {tool.quantity}
                        </td>

                        {/* STATUS */}

                        <td className="px-4 py-4 text-center">

                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-1.5
                              rounded-full
                              px-3
                              py-1.5
                              text-xs
                              font-semibold
                              ${
                                tool.status ===
                                "available"
                                  ? "bg-green-100 text-green-700"
                                  : tool.status ===
                                    "low stock"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }
                            `}
                          >

                            <span
                              className={`
                                h-1.5
                                w-1.5
                                rounded-full
                                ${
                                  tool.status ===
                                  "available"
                                    ? "bg-green-500"
                                    : tool.status ===
                                      "low stock"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }
                              `}
                            />

                            {tool.status}

                          </span>

                        </td>

                        {/* ACTIONS */}

                        <td className="px-4 py-4">

                          <div className="flex items-center justify-end gap-1">

                            <Button
                              variant="ghost"
                              size="sm"
                              className="
                                h-9
                                w-9
                                p-0
                                text-blue-600
                                hover:bg-blue-50
                                hover:text-blue-700
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
                                h-9
                                w-9
                                p-0
                                text-red-500
                                hover:bg-red-50
                                hover:text-red-700
                              "
                              onClick={() =>
                                handleDeleteItem(
                                  tool
                                )
                              }
                              title="Delete Tool"
                            >

                              <Trash2 className="h-4 w-4" />

                            </Button>

                          </div>

                        </td>

                      </tr>
                    )
                  )
                ) : (

                  <tr>

                    <td
                      colSpan={4}
                      className="py-12 text-center"
                    >

                      <div className="flex flex-col items-center">

                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">

                          <Package className="h-5 w-5 text-gray-400" />

                        </div>

                        <p className="font-medium text-gray-600">
                          No tools found
                        </p>

                        <p className="mt-1 text-sm text-gray-400">
                          Try changing your search or filter.
                        </p>

                      </div>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

          {/* =================================================
              PAGINATION
          ================================================= */}

          {filteredTools.length > 0 && (
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div className="text-xs text-gray-400">

                Showing{" "}
                <span className="font-medium text-gray-600">
                  {showingFrom}
                </span>{" "}
                to{" "}
                <span className="font-medium text-gray-600">
                  {showingTo}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-600">
                  {filteredTools.length}
                </span>{" "}
                tool types

              </div>

              <div className="flex items-center justify-between gap-1">

                {/* PREVIOUS */}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    currentPage === 1
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.max(
                          1,
                          page - 1
                        )
                    )
                  }
                  className="h-8 w-8 p-0"
                  title="Previous page"
                >

                  <ChevronLeft className="h-4 w-4" />

                </Button>

                {/* PAGE NUMBERS */}

                {pageNumbers.map(
                  (page) => (
                    <Button
                      key={page}
                      variant={
                        currentPage === page
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        setCurrentPage(page)
                      }
                      className={`
                        h-8
                        min-w-8
                        px-2
                        ${
                          currentPage ===
                          page
                            ? "bg-[#800000] text-[#FFD700] hover:bg-[#660000]"
                            : ""
                        }
                      `}
                    >
                      {page}
                    </Button>
                  )
                )}

                {/* NEXT */}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.min(
                          totalPages,
                          page + 1
                        )
                    )
                  }
                  className="h-8 w-8 p-0"
                  title="Next page"
                >

                  <ChevronRight className="h-4 w-4" />

                </Button>

              </div>

            </div>
          )}

          {/* DATABASE FOOTER */}

          <div className="mt-4 flex items-center justify-end gap-1 text-xs text-gray-400">

            <Boxes className="h-3.5 w-3.5" />

            Inventory Database

          </div>

        </CardContent>

      </Card>

      {/* ======================================================
          EDIT TOOL MODAL
      ====================================================== */}

      <EditToolModal
        open={editModalOpen}
        tool={selectedTool}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedTool(null)
        }}
        onSaved={refreshData}
      />

      {/* ======================================================
          DELETE TOOL DIALOG
      ====================================================== */}

      <DeleteToolDialog
        open={deleteOpen}
        tool={selectedTool}
        onClose={() => {
          setDeleteOpen(false)
          setSelectedTool(null)
        }}
        onDeleted={async () => {
          await refreshData()

          setDeleteOpen(false)
          setSelectedTool(null)
        }}
      />
    </>
  )
}