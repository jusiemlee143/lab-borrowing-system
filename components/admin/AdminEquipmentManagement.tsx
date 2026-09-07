"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Boxes,
  CheckCircle2,
  Edit3,
  Eye,
  PackagePlus,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
  AlertTriangle,
  PackageCheck,
  PackageX,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";

// ============================================================
// API
// ============================================================
// Admin and Lab-In-Charge use the SAME Tool collection.
//
// This admin page must use the ADMIN tools API.
// The backend route is:
// /api/admin/tools
//
// The Tool model is shared, so anything created by the LIC
// side or Admin side will appear in the same inventory.
// ============================================================

const TOOLS_API = "/api/admin/tools";

// ============================================================
// TYPES
// ============================================================

interface Tool {
  _id: string;
  name: string;
  quantity: number;
  status: "available" | "low stock" | "unavailable";
  createdAt?: string;
  updatedAt?: string;
}

interface ToolFormData {
  name: string;
  quantity: string;
}

// ============================================================
// SAFE API RESPONSE
// ============================================================

async function getApiResponse(response: Response) {
  const contentType =
    response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return await response.json();
  }

  const text = await response.text();

  console.error("Non-JSON API response:", text);

  throw new Error(
    `Server returned an invalid response (${response.status}).`
  );
}

// ============================================================
// COMPONENT
// ============================================================

export default function AdminEquipmentManagement() {
  const [tools, setTools] = useState<Tool[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [creating, setCreating] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [selectedTool, setSelectedTool] =
    useState<Tool | null>(null);

  const [editingTool, setEditingTool] =
    useState<Tool | null>(null);

  const [deletingTool, setDeletingTool] =
    useState<Tool | null>(null);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [toolForm, setToolForm] =
    useState<ToolFormData>({
      name: "",
      quantity: "",
    });

  const [editForm, setEditForm] =
    useState<ToolFormData>({
      name: "",
      quantity: "",
    });

  // ============================================================
  // FETCH TOOLS
  // ============================================================

  const fetchTools = async () => {
    try {
      setRefreshing(true);

      const response = await fetch(
        TOOLS_API,
        {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        }
      );

      const data =
        await getApiResponse(response);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to fetch equipment."
        );
      }

      // --------------------------------------------------------
      // /api/admin/tools returns the array directly.
      //
      // We still support { tools: [...] } in case the route
      // is changed later.
      // --------------------------------------------------------

      if (Array.isArray(data)) {
        setTools(data);
      } else if (
        Array.isArray(data?.tools)
      ) {
        setTools(data.tools);
      } else {
        console.warn(
          "Unexpected tools API response:",
          data
        );

        setTools([]);
      }
    } catch (error) {
      console.error(
        "Equipment fetch error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load equipment."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    fetchTools();
  }, []);

  // ============================================================
  // FORM INPUT
  // ============================================================

  const handleCreateInputChange = (
    field: keyof ToolFormData,
    value: string
  ) => {
    if (field === "quantity") {
      const digitsOnly =
        value.replace(/\D/g, "");

      setToolForm((previous) => ({
        ...previous,
        quantity: digitsOnly,
      }));

      return;
    }

    setToolForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleEditInputChange = (
    field: keyof ToolFormData,
    value: string
  ) => {
    if (field === "quantity") {
      const digitsOnly =
        value.replace(/\D/g, "");

      setEditForm((previous) => ({
        ...previous,
        quantity: digitsOnly,
      }));

      return;
    }

    setEditForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // ============================================================
  // RESET CREATE FORM
  // ============================================================

  const resetCreateForm = () => {
    setToolForm({
      name: "",
      quantity: "",
    });
  };

  // ============================================================
  // OPEN CREATE
  // ============================================================

  const openCreateModal = () => {
    resetCreateForm();
    setShowCreateModal(true);
  };

  // ============================================================
  // CREATE TOOL
  // ============================================================

  const handleCreateTool = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const name =
      toolForm.name.trim();

    const quantity =
      Number(toolForm.quantity);

    if (!name) {
      toast.error(
        "Please enter the equipment name."
      );
      return;
    }

    if (
      toolForm.quantity === "" ||
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      toast.error(
        "Please enter a valid quantity."
      );
      return;
    }

    try {
      setCreating(true);

      const response = await fetch(
        TOOLS_API,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            quantity,
          }),
        }
      );

      const data =
        await getApiResponse(response);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to create equipment."
        );
      }

      toast.success(
        "Equipment added successfully."
      );

      setShowCreateModal(false);

      resetCreateForm();

      await fetchTools();
    } catch (error) {
      console.error(
        "Create equipment error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to add equipment."
      );
    } finally {
      setCreating(false);
    }
  };

  // ============================================================
  // OPEN EDIT
  // ============================================================

  const openEditTool = (
    tool: Tool
  ) => {
    setSelectedTool(null);

    setEditForm({
      name: tool.name,
      quantity: String(
        tool.quantity
      ),
    });

    setEditingTool(tool);
  };

  // ============================================================
  // UPDATE TOOL
  // ============================================================

  const handleUpdateTool = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!editingTool) {
      return;
    }

    const name =
      editForm.name.trim();

    const quantity =
      Number(editForm.quantity);

    if (!name) {
      toast.error(
        "Please enter the equipment name."
      );
      return;
    }

    if (
      editForm.quantity === "" ||
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      toast.error(
        "Please enter a valid quantity."
      );
      return;
    }

    try {
      setSavingEdit(true);

      const response = await fetch(
        TOOLS_API,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            id: editingTool._id,
            name,
            quantity,
          }),
        }
      );

      const data =
        await getApiResponse(response);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to update equipment."
        );
      }

      toast.success(
        "Equipment updated successfully."
      );

      setEditingTool(null);

      await fetchTools();
    } catch (error) {
      console.error(
        "Update equipment error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update equipment."
      );
    } finally {
      setSavingEdit(false);
    }
  };

  // ============================================================
  // DELETE TOOL
  // ============================================================

  const handleDeleteTool = async () => {
    if (!deletingTool) {
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch(
        `${TOOLS_API}?id=${encodeURIComponent(
          deletingTool._id
        )}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data =
        await getApiResponse(response);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to delete equipment."
        );
      }

      toast.success(
        "Equipment deleted successfully."
      );

      setDeletingTool(null);

      await fetchTools();
    } catch (error) {
      console.error(
        "Delete equipment error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete equipment."
      );
    } finally {
      setDeleting(false);
    }
  };

  // ============================================================
  // FILTER
  // ============================================================

  const filteredTools =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase();

      if (!query) {
        return tools;
      }

      return tools.filter(
        (tool) =>
          tool.name
            .toLowerCase()
            .includes(query) ||
          tool.status
            .toLowerCase()
            .includes(query)
      );
    }, [
      tools,
      searchQuery,
    ]);

  // ============================================================
  // STATISTICS
  // ============================================================

  const totalItems =
    tools.reduce(
      (total, tool) =>
        total + tool.quantity,
      0
    );

  const availableTools =
    tools.filter(
      (tool) =>
        tool.status ===
        "available"
    ).length;

  const lowStockTools =
    tools.filter(
      (tool) =>
        tool.status ===
        "low stock"
    ).length;

  const unavailableTools =
    tools.filter(
      (tool) =>
        tool.status ===
        "unavailable"
    ).length;

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (
    date?: string
  ) => {
    if (!date) {
      return "—";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "—";
    }

    return parsedDate.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <EquipmentLoading />
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <>
      <div className="space-y-7">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <div className="mb-2 flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />

                <span className="text-xs font-semibold text-green-600">
                  Inventory System Active
                </span>

              </div>

              <h2 className="text-2xl font-bold tracking-tight text-[#800000] sm:text-3xl">
                Equipment Management
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                Manage laboratory equipment,
                quantities, availability, and
                inventory status.
              </p>

              <p className="mt-2 text-[11px] text-gray-400">
                Inventory is shared with the
                Lab-in-Charge equipment system.
              </p>
            </div>

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={fetchTools}
                disabled={refreshing}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#800000]/10 bg-white px-4 py-2.5 text-sm font-medium text-[#800000] shadow-sm transition hover:border-[#800000]/20 hover:bg-[#800000]/5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    refreshing
                      ? "animate-spin"
                      : ""
                  }`}
                />

                {refreshing
                  ? "Refreshing..."
                  : "Refresh"}
              </button>

              <button
                type="button"
                onClick={
                  openCreateModal
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#800000] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#650000] hover:shadow-md"
              >
                <Plus className="h-4 w-4" />

                Add Equipment
              </button>

            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* STATISTICS */}
        {/* ================================================== */}

        <section>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <EquipmentStatCard
              title="Equipment Types"
              value={tools.length}
              label="registered"
              icon={
                <Boxes className="h-5 w-5" />
              }
              accent="maroon"
            />

            <EquipmentStatCard
              title="Total Items"
              value={totalItems}
              label="units in inventory"
              icon={
                <PackageCheck className="h-5 w-5" />
              }
              accent="gold"
            />

            <EquipmentStatCard
              title="Low Stock"
              value={lowStockTools}
              label="equipment types"
              icon={
                <AlertTriangle className="h-5 w-5" />
              }
              accent="orange"
            />

            <EquipmentStatCard
              title="Unavailable"
              value={unavailableTools}
              label="out of stock"
              icon={
                <PackageX className="h-5 w-5" />
              }
              accent="gray"
            />

          </div>
        </section>

        {/* ================================================== */}
        {/* INVENTORY DIRECTORY */}
        {/* ================================================== */}

        <section>

          <div className="mb-4 flex items-center gap-3">

            <div className="h-6 w-1 rounded-full bg-[#800000]" />

            <div className="flex items-center gap-2">

              <Boxes className="h-4 w-4 text-[#800000]" />

              <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[#800000]/70">
                Equipment Inventory
              </h2>

            </div>

            <div className="h-px flex-1 bg-gradient-to-r from-[#800000]/10 to-transparent" />

          </div>

          <Card className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

            <CardContent className="p-0">

              {/* TOOLBAR */}

              <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">

                <div className="relative w-full sm:max-w-md">

                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    value={
                      searchQuery
                    }
                    onChange={(
                      event
                    ) =>
                      setSearchQuery(
                        event.target
                          .value
                      )
                    }
                    placeholder="Search equipment..."
                    className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-9 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#800000]/30 focus:bg-white focus:ring-2 focus:ring-[#800000]/5"
                  />

                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() =>
                        setSearchQuery(
                          ""
                        )
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}

                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400">

                  <Activity className="h-3.5 w-3.5" />

                  <span>
                    {
                      filteredTools.length
                    }{" "}
                    {filteredTools.length ===
                    1
                      ? "equipment"
                      : "equipment types"}{" "}
                    shown
                  </span>

                </div>

              </div>

              {/* TABLE */}

              {filteredTools.length >
              0 ? (
                <EquipmentTable
                  tools={
                    filteredTools
                  }
                  onView={
                    setSelectedTool
                  }
                  onEdit={
                    openEditTool
                  }
                  onDelete={
                    setDeletingTool
                  }
                />
              ) : (
                <EquipmentEmptyState
                  hasSearch={Boolean(
                    searchQuery.trim()
                  )}
                  onClearSearch={() =>
                    setSearchQuery(
                      ""
                    )
                  }
                  onAdd={
                    openCreateModal
                  }
                />
              )}

            </CardContent>

          </Card>

        </section>

        {/* ================================================== */}
        {/* INVENTORY NOTE */}
        {/* ================================================== */}

        <Card className="overflow-hidden rounded-xl border border-[#800000]/10 bg-white shadow-sm">

          <CardContent className="p-0">

            <div className="flex flex-col gap-4 border-l-4 border-[#800000] bg-[#800000]/[0.025] p-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#800000]/5 text-[#800000]">

                  <Boxes className="h-5 w-5" />

                </div>

                <div>

                  <p className="font-semibold text-[#800000]">
                    Shared Inventory
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    This inventory is shared with
                    the Lab-in-Charge equipment
                    management system. Changes made
                    here affect the same laboratory
                    tool records.
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-green-600">

                <span className="h-2 w-2 rounded-full bg-green-500" />

                {availableTools} available

              </div>

            </div>

          </CardContent>

        </Card>

      </div>

      {/* ================================================== */}
      {/* CREATE MODAL */}
      {/* ================================================== */}

      {showCreateModal && (
        <CreateEquipmentModal
          form={toolForm}
          loading={creating}
          onChange={
            handleCreateInputChange
          }
          onSubmit={
            handleCreateTool
          }
          onClose={() => {
            if (!creating) {
              setShowCreateModal(
                false
              );
              resetCreateForm();
            }
          }}
        />
      )}

      {/* ================================================== */}
      {/* DETAILS MODAL */}
      {/* ================================================== */}

      {selectedTool && (
        <EquipmentDetailsModal
          tool={selectedTool}
          formatDate={
            formatDate
          }
          onClose={() =>
            setSelectedTool(null)
          }
          onEdit={() =>
            openEditTool(
              selectedTool
            )
          }
        />
      )}

      {/* ================================================== */}
      {/* EDIT MODAL */}
      {/* ================================================== */}

      {editingTool && (
        <EditEquipmentModal
          tool={editingTool}
          form={editForm}
          loading={savingEdit}
          onChange={
            handleEditInputChange
          }
          onSubmit={
            handleUpdateTool
          }
          onClose={() => {
            if (!savingEdit) {
              setEditingTool(
                null
              );
            }
          }}
        />
      )}

      {/* ================================================== */}
      {/* DELETE CONFIRMATION */}
      {/* ================================================== */}

      {deletingTool && (
        <DeleteEquipmentModal
          tool={deletingTool}
          loading={deleting}
          onConfirm={
            handleDeleteTool
          }
          onClose={() => {
            if (!deleting) {
              setDeletingTool(
                null
              );
            }
          }}
        />
      )}
    </>
  );
}

// ============================================================
// CREATE EQUIPMENT MODAL
// ============================================================

function CreateEquipmentModal({
  form,
  loading,
  onChange,
  onSubmit,
  onClose,
}: {
  form: ToolFormData;
  loading: boolean;
  onChange: (
    field: keyof ToolFormData,
    value: string
  ) => void;
  onSubmit: (
    event: React.FormEvent
  ) => void;
  onClose: () => void;
}) {
  return (
    <ModalOverlay
      onClose={onClose}
      disabled={loading}
    >
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-[#800000]/10 bg-white shadow-2xl">

        <ModalHeader
          icon={
            <PackagePlus className="h-5 w-5" />
          }
          title="Add Equipment"
          subtitle="Shared Inventory"
          onClose={onClose}
          disabled={loading}
        />

        <form
          onSubmit={onSubmit}
        >
          <div className="space-y-5 p-5">

            <div className="rounded-xl border border-[#800000]/10 bg-[#800000]/[0.025] p-4">

              <p className="text-xs font-semibold text-[#800000]">
                Add New Equipment
              </p>

              <p className="mt-1 text-[11px] leading-5 text-gray-500">
                This equipment will be added to
                the shared laboratory inventory
                used by the Lab-in-Charge.
              </p>

            </div>

            <FormField
              label="Equipment Name"
              required
            >
              <input
                type="text"
                value={
                  form.name
                }
                onChange={(
                  event
                ) =>
                  onChange(
                    "name",
                    event.target
                      .value
                  )
                }
                placeholder="e.g. Digital Multimeter"
                disabled={loading}
                className={
                  inputClassName
                }
              />
            </FormField>

            <FormField
              label="Quantity"
              required
            >
              <input
                type="text"
                inputMode="numeric"
                value={
                  form.quantity
                }
                onChange={(
                  event
                ) =>
                  onChange(
                    "quantity",
                    event.target
                      .value
                  )
                }
                placeholder="e.g. 10"
                disabled={loading}
                className={
                  inputClassName
                }
              />

              <p className="mt-1.5 text-[10px] text-gray-400">
                0 = unavailable, 1–4 = low stock,
                5 or more = available
              </p>
            </FormField>

          </div>

          <ModalFooter
            loading={loading}
            submitLabel="Add Equipment"
            loadingLabel="Adding..."
            submitIcon={
              <Plus className="h-4 w-4" />
            }
            onClose={onClose}
          />
        </form>

      </div>
    </ModalOverlay>
  );
}

// ============================================================
// EDIT EQUIPMENT MODAL
// ============================================================

function EditEquipmentModal({
  tool,
  form,
  loading,
  onChange,
  onSubmit,
  onClose,
}: {
  tool: Tool;
  form: ToolFormData;
  loading: boolean;
  onChange: (
    field: keyof ToolFormData,
    value: string
  ) => void;
  onSubmit: (
    event: React.FormEvent
  ) => void;
  onClose: () => void;
}) {
  return (
    <ModalOverlay
      onClose={onClose}
      disabled={loading}
    >
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-[#800000]/10 bg-white shadow-2xl">

        <ModalHeader
          icon={
            <Edit3 className="h-5 w-5" />
          }
          title="Edit Equipment"
          subtitle="Shared Inventory"
          onClose={onClose}
          disabled={loading}
        />

        <form
          onSubmit={onSubmit}
        >
          <div className="max-h-[70vh] overflow-y-auto p-5">

            <div className="mb-5 rounded-xl border border-[#800000]/10 bg-[#800000]/[0.025] p-3">

              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Editing Equipment
              </p>

              <p className="mt-1 text-sm font-semibold text-[#800000]">
                {tool.name}
              </p>

            </div>

            <div className="space-y-4">

              <FormField
                label="Equipment Name"
                required
              >
                <input
                  type="text"
                  value={
                    form.name
                  }
                  onChange={(
                    event
                  ) =>
                    onChange(
                      "name",
                      event.target
                        .value
                    )
                  }
                  disabled={loading}
                  className={
                    inputClassName
                  }
                />
              </FormField>

              <FormField
                label="Quantity"
                required
              >
                <input
                  type="text"
                  inputMode="numeric"
                  value={
                    form.quantity
                  }
                  onChange={(
                    event
                  ) =>
                    onChange(
                      "quantity",
                      event.target
                        .value
                    )
                  }
                  disabled={loading}
                  className={
                    inputClassName
                  }
                />

                <p className="mt-1.5 text-[10px] text-gray-400">
                  The equipment status will be
                  updated automatically.
                </p>
              </FormField>

            </div>

            <div className="mt-5 rounded-xl border border-[#FFD700]/30 bg-[#FFD700]/[0.06] p-4">

              <div className="flex items-start gap-3">

                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#8a6b00]" />

                <div>

                  <p className="text-xs font-semibold text-[#8a6b00]">
                    Shared Inventory Notice
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-gray-500">
                    Changes made here affect the
                    same equipment records used by
                    the Lab-in-Charge.
                  </p>

                </div>

              </div>

            </div>

          </div>

          <ModalFooter
            loading={loading}
            submitLabel="Save Changes"
            loadingLabel="Saving..."
            submitIcon={
              <CheckCircle2 className="h-4 w-4" />
            }
            onClose={onClose}
          />

        </form>

      </div>
    </ModalOverlay>
  );
}

// ============================================================
// DELETE MODAL
// ============================================================

function DeleteEquipmentModal({
  tool,
  loading,
  onConfirm,
  onClose,
}: {
  tool: Tool;
  loading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <ModalOverlay
      onClose={onClose}
      disabled={loading}
    >
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-red-100 bg-white shadow-2xl">

        <div className="border-b border-red-100 bg-red-50/60 px-5 py-4">

          <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">

                <AlertTriangle className="h-5 w-5" />

              </div>

              <div>

                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Shared Inventory
                </p>

                <h3 className="mt-0.5 text-base font-bold text-red-700">
                  Delete Equipment
                </h3>

              </div>

            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>

          </div>

        </div>

        <div className="p-5">

          <div className="rounded-xl border border-red-100 bg-red-50/50 p-4">

            <p className="text-sm font-semibold text-gray-800">
              Are you sure you want to delete:
            </p>

            <p className="mt-2 rounded-lg bg-white px-3 py-2 text-sm font-bold text-[#800000]">
              {tool.name}
            </p>

          </div>

          <div className="mt-4 flex items-start gap-3">

            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

            <p className="text-xs leading-5 text-gray-500">
              This will permanently remove this
              equipment from the shared inventory.
              It will also no longer be available
              to the Lab-in-Charge.
            </p>

          </div>

        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-gray-100 bg-gray-50/50 px-5 py-4 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Equipment
              </>
            )}
          </button>

        </div>

      </div>
    </ModalOverlay>
  );
}

// ============================================================
// EQUIPMENT TABLE
// ============================================================

function EquipmentTable({
  tools,
  onView,
  onEdit,
  onDelete,
}: {
  tools: Tool[];
  onView: (tool: Tool) => void;
  onEdit: (tool: Tool) => void;
  onDelete: (tool: Tool) => void;
}) {
  return (
    <div className="overflow-x-auto">

      <table className="w-full min-w-[800px] text-left">

        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/70">

            <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
              Equipment
            </th>

            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
              Quantity
            </th>

            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
              Status
            </th>

            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
              Added
            </th>

            <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
              Actions
            </th>

          </tr>
        </thead>

        <tbody className="divide-y divide-gray-50">

          {tools.map(
            (tool) => (
              <tr
                key={
                  tool._id
                }
                className="group transition hover:bg-[#800000]/[0.018]"
              >

                <td className="px-5 py-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#800000]/5 text-[#800000]">

                      <Boxes className="h-4 w-4" />

                    </div>

                    <div className="min-w-0">

                      <p className="truncate text-sm font-semibold text-gray-800">
                        {tool.name}
                      </p>

                      <p className="text-xs text-gray-400">
                        Laboratory Equipment
                      </p>

                    </div>

                  </div>

                </td>

                <td className="px-4 py-4">

                  <span className="text-sm font-bold text-gray-700">
                    {tool.quantity}
                  </span>

                  <span className="ml-1 text-xs text-gray-400">
                    units
                  </span>

                </td>

                <td className="px-4 py-4">

                  <ToolStatusBadge
                    status={
                      tool.status
                    }
                  />

                </td>

                <td className="px-4 py-4">

                  <span className="text-xs text-gray-500">
                    {formatDateStatic(
                      tool.createdAt
                    )}
                  </span>

                </td>

                <td className="px-5 py-4 text-right">

                  <div className="flex items-center justify-end gap-1.5">

                    <button
                      type="button"
                      onClick={() =>
                        onView(
                          tool
                        )
                      }
                      title="View"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-[#800000]/20 hover:bg-[#800000]/5 hover:text-[#800000]"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onEdit(
                          tool
                        )
                      }
                      title="Edit"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onDelete(
                          tool
                        )
                      }
                      title="Delete"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>

                  </div>

                </td>

              </tr>
            )
          )}

        </tbody>

      </table>

    </div>
  );
}

// ============================================================
// STATUS BADGE
// ============================================================

function ToolStatusBadge({
  status,
}: {
  status: Tool["status"];
}) {
  if (
    status ===
    "available"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-600">

        <CheckCircle2 className="h-3 w-3" />

        Available

      </span>
    );
  }

  if (
    status ===
    "low stock"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFD700]/10 px-2.5 py-1 text-[10px] font-semibold text-[#8a6b00]">

        <AlertTriangle className="h-3 w-3" />

        Low Stock

      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-semibold text-red-600">

      <PackageX className="h-3 w-3" />

      Unavailable

    </span>
  );
}

// ============================================================
// EQUIPMENT DETAILS MODAL
// ============================================================

function EquipmentDetailsModal({
  tool,
  formatDate,
  onClose,
  onEdit,
}: {
  tool: Tool;
  formatDate: (
    date?: string
  ) => string;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <ModalOverlay
      onClose={onClose}
      disabled={false}
    >
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-[#800000]/10 bg-white shadow-2xl">

        <ModalHeader
          icon={
            <Boxes className="h-5 w-5" />
          }
          title={tool.name}
          subtitle="Equipment Details"
          onClose={onClose}
          disabled={false}
        />

        <div className="max-h-[70vh] overflow-y-auto p-5">

          <div className="mb-5">

            <ToolStatusBadge
              status={
                tool.status
              }
            />

          </div>

          <div className="grid gap-3 sm:grid-cols-2">

            <DetailItem
              label="Equipment Name"
              value={
                tool.name
              }
            />

            <DetailItem
              label="Quantity"
              value={`${tool.quantity} units`}
            />

            <DetailItem
              label="Current Status"
              value={
                getStatusLabel(
                  tool.status
                )
              }
            />

            <DetailItem
              label="Registered"
              value={formatDate(
                tool.createdAt
              )}
            />

            <DetailItem
              label="Last Updated"
              value={formatDate(
                tool.updatedAt
              )}
            />

          </div>

          <div className="mt-5 rounded-xl border border-[#800000]/10 bg-[#800000]/[0.025] p-4">

            <div className="flex items-start gap-3">

              <PackageCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#800000]" />

              <div>

                <p className="text-xs font-semibold text-[#800000]">
                  Shared Inventory
                </p>

                <p className="mt-1 text-[11px] leading-5 text-gray-500">
                  This equipment belongs to the
                  same inventory used by the
                  Lab-in-Charge system.
                </p>

              </div>

            </div>

          </div>

        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-gray-100 bg-gray-50/50 px-5 py-4 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
          >
            Close
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#800000] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#650000]"
          >
            <Edit3 className="h-4 w-4" />

            Edit Equipment

          </button>

        </div>

      </div>
    </ModalOverlay>
  );
}

// ============================================================
// DETAIL ITEM
// ============================================================

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3.5">

      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
        {label}
      </p>

      <p className="mt-1.5 break-words text-sm font-medium text-gray-700">
        {value || "—"}
      </p>

    </div>
  );
}

// ============================================================
// STAT CARD
// ============================================================

function EquipmentStatCard({
  title,
  value,
  label,
  icon,
  accent,
}: {
  title: string;
  value: number | string;
  label: string;
  icon: React.ReactNode;
  accent:
    | "maroon"
    | "gold"
    | "orange"
    | "gray";
}) {
  const styles = {
    maroon: {
      border:
        "border-[#800000]/15",
      iconBg:
        "bg-[#800000]/5",
      iconColor:
        "text-[#800000]",
      value:
        "text-[#800000]",
    },

    gold: {
      border:
        "border-[#FFD700]/40",
      iconBg:
        "bg-[#FFD700]/10",
      iconColor:
        "text-[#b88600]",
      value:
        "text-[#b88600]",
    },

    orange: {
      border:
        "border-orange-100",
      iconBg:
        "bg-orange-50",
      iconColor:
        "text-orange-600",
      value:
        "text-orange-600",
    },

    gray: {
      border:
        "border-gray-100",
      iconBg:
        "bg-gray-50",
      iconColor:
        "text-gray-500",
      value:
        "text-gray-600",
    },
  };

  const style =
    styles[accent];

  return (
    <Card
      className={`rounded-xl border bg-white ${style.border} shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
    >
      <CardContent className="p-5">

        <div className="flex items-center justify-between gap-3">

          <span className="text-sm font-medium text-gray-500">
            {title}
          </span>

          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${style.iconBg} ${style.iconColor}`}
          >
            {icon}
          </div>

        </div>

        <div className="mt-4 flex items-end gap-2">

          <span
            className={`text-2xl font-bold sm:text-3xl ${style.value}`}
          >
            {value}
          </span>

          <span className="mb-1 text-xs text-gray-400">
            {label}
          </span>

        </div>

      </CardContent>
    </Card>
  );
}

// ============================================================
// EMPTY STATE
// ============================================================

function EquipmentEmptyState({
  hasSearch,
  onClearSearch,
  onAdd,
}: {
  hasSearch: boolean;
  onClearSearch: () => void;
  onAdd: () => void;
}) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">

      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">

        {hasSearch ? (
          <Search className="h-6 w-6" />
        ) : (
          <Boxes className="h-6 w-6" />
        )}

      </div>

      <h3 className="text-sm font-semibold text-gray-700">

        {hasSearch
          ? "No equipment found"
          : "No equipment available"}

      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-gray-400">

        {hasSearch
          ? "No equipment matches your current search."
          : "There are currently no equipment items in the inventory."}

      </p>

      <div className="mt-4 flex items-center gap-2">

        {hasSearch ? (
          <button
            type="button"
            onClick={
              onClearSearch
            }
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-100"
          >
            Clear Search
          </button>
        ) : (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-[#800000] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#650000]"
          >
            <Plus className="h-3.5 w-3.5" />

            Add Equipment
          </button>
        )}

      </div>

    </div>
  );
}

// ============================================================
// FORM FIELD
// ============================================================

function FormField({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>

      <label className="mb-1.5 block text-xs font-semibold text-gray-600">

        {label}

        {required && (
          <span className="ml-1 text-[#800000]">
            *
          </span>
        )}

      </label>

      {children}

    </div>
  );
}

// ============================================================
// INPUT STYLE
// ============================================================

const inputClassName = `
  h-10
  w-full
  rounded-lg
  border
  border-gray-200
  bg-gray-50
  px-3
  text-sm
  text-gray-700
  outline-none
  transition
  placeholder:text-gray-400
  focus:border-[#800000]/30
  focus:bg-white
  focus:ring-2
  focus:ring-[#800000]/5
  disabled:cursor-not-allowed
  disabled:opacity-60
`;

// ============================================================
// MODAL OVERLAY
// ============================================================

function ModalOverlay({
  children,
  onClose,
  disabled,
}: {
  children: React.ReactNode;
  onClose: () => void;
  disabled: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-[2px]">

      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        disabled={disabled}
        className="absolute inset-0 cursor-default"
      />

      {children}

    </div>
  );
}

// ============================================================
// MODAL HEADER
// ============================================================

function ModalHeader({
  icon,
  title,
  subtitle,
  onClose,
  disabled,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClose: () => void;
  disabled: boolean;
}) {
  return (
    <div className="border-b border-gray-100 bg-[#800000]/[0.025] px-5 py-4">

      <div className="flex items-center justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#800000]/5 text-[#800000]">

            {icon}

          </div>

          <div>

            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              {subtitle}
            </p>

            <h3 className="mt-0.5 text-base font-bold text-[#800000]">
              {title}
            </h3>

          </div>

        </div>

        <button
          type="button"
          onClick={onClose}
          disabled={disabled}
          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
        >
          <X className="h-5 w-5" />
        </button>

      </div>

    </div>
  );
}

// ============================================================
// MODAL FOOTER
// ============================================================

function ModalFooter({
  loading,
  submitLabel,
  loadingLabel,
  submitIcon,
  onClose,
}: {
  loading: boolean;
  submitLabel: string;
  loadingLabel: string;
  submitIcon: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col-reverse gap-2 border-t border-gray-100 bg-gray-50/50 px-5 py-4 sm:flex-row sm:justify-end">

      <button
        type="button"
        onClick={onClose}
        disabled={loading}
        className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#800000] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#650000] disabled:opacity-60"
      >

        {loading ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />

            {loadingLabel}
          </>
        ) : (
          <>
            {submitIcon}

            {submitLabel}
          </>
        )}

      </button>

    </div>
  );
}

// ============================================================
// FORMAT DATE
// ============================================================

function formatDateStatic(
  date?: string
) {
  if (!date) {
    return "—";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "—";
  }

  return parsedDate.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

// ============================================================
// STATUS LABEL
// ============================================================

function getStatusLabel(
  status: Tool["status"]
) {
  if (
    status ===
    "available"
  ) {
    return "Available";
  }

  if (
    status ===
    "low stock"
  ) {
    return "Low Stock";
  }

  return "Unavailable";
}

// ============================================================
// LOADING
// ============================================================

function EquipmentLoading() {
  return (
    <div className="space-y-7">

      <section>

        <div className="animate-pulse">

          <div className="mb-2 h-3 w-28 rounded bg-gray-200" />

          <div className="h-8 w-64 rounded bg-gray-200" />

          <div className="mt-2 h-4 w-full max-w-2xl rounded bg-gray-100" />

        </div>

      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {Array.from({
          length: 4,
        }).map(
          (_, index) => (
            <Card
              key={index}
              className="rounded-xl border border-gray-100 shadow-sm"
            >
              <CardContent className="p-5">

                <div className="animate-pulse">

                  <div className="flex justify-between">

                    <div className="h-4 w-24 rounded bg-gray-100" />

                    <div className="h-9 w-9 rounded-lg bg-gray-100" />

                  </div>

                  <div className="mt-4 h-8 w-16 rounded bg-gray-100" />

                </div>

              </CardContent>
            </Card>
          )
        )}

      </div>

      <Card className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">

        <CardContent className="p-0">

          <div className="border-b border-gray-100 p-5">

            <div className="h-10 w-full max-w-md animate-pulse rounded-lg bg-gray-100" />

          </div>

          <div className="space-y-4 p-5">

            {Array.from({
              length: 5,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className="flex animate-pulse items-center gap-4"
                >

                  <div className="h-9 w-9 rounded-lg bg-gray-100" />

                  <div className="flex-1">

                    <div className="h-3 w-40 rounded bg-gray-100" />

                    <div className="mt-2 h-2.5 w-56 rounded bg-gray-100" />

                  </div>

                  <div className="hidden h-6 w-20 rounded-full bg-gray-100 sm:block" />

                  <div className="h-8 w-20 rounded-lg bg-gray-100" />

                </div>
              )
            )}

          </div>

        </CardContent>

      </Card>

    </div>
  );
}