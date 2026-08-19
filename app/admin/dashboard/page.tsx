"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Activity,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Copy,
  Eye,
  GraduationCap,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  PackageCheck,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  X,
  XCircle,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Toaster, toast } from "sonner"

/* ============================================================
   TYPES
============================================================ */

interface LIC {
  _id: string
  fullName: string
  email: string
  department: string
  employeeId: string
  contactNumber?: string
}

interface Teacher {
  _id: string
  name: string
  email: string
}

interface Tool {
  _id: string
  name: string
  quantity: number
  status: string
  createdAt?: string
  updatedAt?: string
}

/*
 * The Request model has changed/expanded during development,
 * so the admin UI intentionally supports the fields that have
 * appeared in your borrowing system.
 */
interface BorrowingRequest {
  _id: string
  status?: string
  createdAt?: string
  updatedAt?: string

  studentName?: string
  studentId?: string
  section?: string
  groupNumber?: string | number

  instructor?: string
  instructorName?: string
  instructorEmail?: string

  activityTitle?: string
  purpose?: string
  laboratory?: string

  requestedDate?: string
  borrowDate?: string
  returnDate?: string
  expectedReturnDate?: string

  items?: unknown[]
  cart?: unknown[]
  tools?: unknown[]
  cartItems?: unknown[]

  rejectReason?: string
  reason?: string

  [key: string]: unknown
}

type DeleteTarget = {
  id: string
  type: "lic" | "teacher"
}

type AdminSection =
  | "dashboard"
  | "borrowing"
  | "equipment"
  | "users"
  | "instructors"

type RequestFilter =
  | "all"
  | "pending"
  | "approved"
  | "rejected"
  | "released"
  | "returned"

/* ============================================================
   HELPERS
============================================================ */

function getStringValue(
  value: unknown,
  fallback = ""
): string {
  if (typeof value === "string") return value
  if (typeof value === "number") return String(value)
  return fallback
}

function formatDate(value?: string) {
  if (!value) return "N/A"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "N/A"
  }

  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function formatDateTime(value?: string) {
  if (!value) return "N/A"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "N/A"
  }

  return date.toLocaleString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function normalizeStatus(status?: string) {
  return getStringValue(status, "pending")
    .trim()
    .toLowerCase()
}

function getStatusLabel(status?: string) {
  const normalized = normalizeStatus(status)

  switch (normalized) {
    case "approved":
      return "Approved"
    case "rejected":
      return "Rejected"
    case "released":
      return "Released"
    case "returned":
      return "Returned"
    case "pending":
      return "Pending"
    default:
      return status || "Pending"
  }
}

function getStatusClasses(status?: string) {
  const normalized = normalizeStatus(status)

  switch (normalized) {
    case "approved":
      return "bg-blue-50 text-blue-700 border-blue-100"

    case "released":
      return "bg-purple-50 text-purple-700 border-purple-100"

    case "returned":
      return "bg-green-50 text-green-700 border-green-100"

    case "rejected":
      return "bg-red-50 text-red-700 border-red-100"

    case "pending":
    default:
      return "bg-amber-50 text-amber-700 border-amber-100"
  }
}

function getRequestStudent(request: BorrowingRequest) {
  return (
    getStringValue(request.studentName) ||
    getStringValue(request.studentId) ||
    "Unknown Student"
  )
}

function getRequestInstructor(request: BorrowingRequest) {
  return (
    getStringValue(request.instructorName) ||
    getStringValue(request.instructor) ||
    "N/A"
  )
}

function getRequestItems(request: BorrowingRequest): unknown[] {
  const possibleArrays = [
    request.items,
    request.cart,
    request.tools,
    request.cartItems,
  ]

  for (const value of possibleArrays) {
    if (Array.isArray(value)) {
      return value
    }
  }

  return []
}

function getItemName(item: unknown) {
  if (typeof item === "string") return item

  if (
    typeof item === "object" &&
    item !== null
  ) {
    const obj = item as Record<string, unknown>

    return (
      getStringValue(obj.name) ||
      getStringValue(obj.toolName) ||
      getStringValue(obj.title) ||
      "Equipment"
    )
  }

  return "Equipment"
}

function getItemQuantity(item: unknown) {
  if (
    typeof item === "object" &&
    item !== null
  ) {
    const obj = item as Record<string, unknown>

    return (
      getStringValue(obj.quantity) ||
      getStringValue(obj.qty) ||
      "1"
    )
  }

  return "1"
}

/* ============================================================
   COMPONENT
============================================================ */

export default function AdminDashboard() {
  const router = useRouter()

  /* ==========================================================
     NAVIGATION
  ========================================================== */

  const [activeSection, setActiveSection] =
    useState<AdminSection>("dashboard")

  const [isSectionLoading, setIsSectionLoading] = useState(false)

  const handleSectionChange = (section: AdminSection) => {
    if (section === activeSection) return

    setIsSectionLoading(true)
    setActiveSection(section)

    window.setTimeout(() => {
      setIsSectionLoading(false)
    }, 350)
  }

  /* ==========================================================
     ACCOUNT DATA
  ========================================================== */

  const [labAccounts, setLabAccounts] = useState<LIC[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])

  const [isLoadingLICs, setIsLoadingLICs] = useState(true)
  const [isLoadingTeachers, setIsLoadingTeachers] =
    useState(true)

  /* ==========================================================
     EQUIPMENT DATA
  ========================================================== */

  const [tools, setTools] = useState<Tool[]>([])
  const [isLoadingTools, setIsLoadingTools] =
    useState(true)

  const [toolSearch, setToolSearch] = useState("")

  /* ==========================================================
     REQUEST DATA
  ========================================================== */

  const [requests, setRequests] = useState<
    BorrowingRequest[]
  >([])

  const [isLoadingRequests, setIsLoadingRequests] =
    useState(true)

  const [requestSearch, setRequestSearch] =
    useState("")

  const [requestFilter, setRequestFilter] =
    useState<RequestFilter>("all")

  const [selectedRequest, setSelectedRequest] =
    useState<BorrowingRequest | null>(null)

  /* ==========================================================
     LIC FORM
  ========================================================== */

  const [step, setStep] = useState<1 | 2>(1)

  const [fullName, setFullName] = useState("")
  const [employeeId, setEmployeeId] = useState("")
  const [department, setDepartment] = useState("")
  const [contactNumber, setContactNumber] =
    useState("")

  const [email, setEmail] = useState("")
  const [tempPassword, setTempPassword] =
    useState("")

  const [isCreatingLIC, setIsCreatingLIC] =
    useState(false)

  /* ==========================================================
     INSTRUCTOR FORM
  ========================================================== */

  const [instructorName, setInstructorName] =
    useState("")

  const [instructorEmail, setInstructorEmail] =
    useState("")

  const [isAddingTeacher, setIsAddingTeacher] =
    useState(false)

  /* ==========================================================
     DELETE
  ========================================================== */

  const [deleteTarget, setDeleteTarget] =
    useState<DeleteTarget | null>(null)

  const [showDeleteModal, setShowDeleteModal] =
    useState(false)

  const [isDeleting, setIsDeleting] =
    useState(false)

  /* ==========================================================
     LOGOUT
  ========================================================== */

  const [isLoggingOut, setIsLoggingOut] =
    useState(false)

  /* ==========================================================
     SECTION TITLE
  ========================================================== */

  const sectionTitle = {
    dashboard: "Admin Dashboard",
    borrowing: "Borrowing Records",
    equipment: "Equipment",
    users: "Users",
    instructors: "Instructors",
  }[activeSection]

  /* ==========================================================
     FETCH LIC ACCOUNTS
  ========================================================== */

  const fetchLICs = useCallback(async () => {
    setIsLoadingLICs(true)

    try {
      const res = await fetch("/api/admin/lics", {
        method: "GET",
        cache: "no-store",
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(
          data?.message ||
            "Failed to load LIC accounts."
        )
      }

      setLabAccounts(
        Array.isArray(data) ? data : []
      )
    } catch (error) {
      console.error(
        "Failed to fetch LIC accounts:",
        error
      )

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load LIC accounts."
      )
    } finally {
      setIsLoadingLICs(false)
    }
  }, [])

  /* ==========================================================
     FETCH TEACHERS
  ========================================================== */

  const fetchTeachers = useCallback(async () => {
    setIsLoadingTeachers(true)

    try {
      const res = await fetch(
        "/api/admin/teachers",
        {
          method: "GET",
          cache: "no-store",
        }
      )

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(
          data?.message ||
            "Failed to load instructors."
        )
      }

      setTeachers(
        Array.isArray(data) ? data : []
      )
    } catch (error) {
      console.error(
        "Failed to fetch teachers:",
        error
      )

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load instructors."
      )
    } finally {
      setIsLoadingTeachers(false)
    }
  }, [])

  /* ==========================================================
     FETCH TOOLS
  ========================================================== */

  const fetchTools = useCallback(async () => {
    setIsLoadingTools(true)

    try {
      const res = await fetch(
        "/api/lab-in-charge/tools",
        {
          method: "GET",
          cache: "no-store",
        }
      )

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(
          data?.message ||
            "Failed to load equipment."
        )
      }

      setTools(
        Array.isArray(data) ? data : []
      )
    } catch (error) {
      console.error(
        "Failed to fetch tools:",
        error
      )

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load equipment."
      )
    } finally {
      setIsLoadingTools(false)
    }
  }, [])

  /* ==========================================================
     FETCH REQUESTS
  ========================================================== */

  const fetchRequests = useCallback(async () => {
    setIsLoadingRequests(true)

    try {
      const res = await fetch(
        "/api/lab-in-charge/requests",
        {
          method: "GET",
          cache: "no-store",
        }
      )

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(
          data?.message ||
            "Failed to load borrowing records."
        )
      }

      setRequests(
        Array.isArray(data) ? data : []
      )
    } catch (error) {
      console.error(
        "Failed to fetch requests:",
        error
      )

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load borrowing records."
      )
    } finally {
      setIsLoadingRequests(false)
    }
  }, [])

  /* ==========================================================
     INITIAL LOAD
  ========================================================== */

  useEffect(() => {
    void Promise.all([
      fetchLICs(),
      fetchTeachers(),
      fetchTools(),
      fetchRequests(),
    ])
  }, [
    fetchLICs,
    fetchTeachers,
    fetchTools,
    fetchRequests,
  ])

  /* ==========================================================
     REFRESH EVERYTHING
  ========================================================== */

  const refreshAll = async () => {
    await Promise.all([
      fetchLICs(),
      fetchTeachers(),
      fetchTools(),
      fetchRequests(),
    ])

    toast.success("Dashboard data refreshed.")
  }

  /* ==========================================================
     PASSWORD GENERATOR
  ========================================================== */

  const generateTempPassword = () => {
    const characters =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789"

    let password = ""

    for (let i = 0; i < 10; i++) {
      password += characters.charAt(
        Math.floor(
          Math.random() * characters.length
        )
      )
    }

    return password
  }

  /* ==========================================================
     EMAIL VALIDATION
  ========================================================== */

  const isValidEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      value
    )
  }

  /* ==========================================================
     LIC STEP 1
  ========================================================== */

  const handleNextStep = () => {
    if (
      !fullName.trim() ||
      !employeeId.trim() ||
      !department.trim() ||
      !contactNumber.trim()
    ) {
      toast.error(
        "Please complete all required fields."
      )

      return
    }

    if (contactNumber.length !== 11) {
      toast.error(
        "Contact number must contain 11 digits."
      )

      return
    }

    if (!contactNumber.startsWith("09")) {
      toast.error(
        "Please enter a valid Philippine mobile number starting with 09."
      )

      return
    }

    setTempPassword(generateTempPassword())
    setStep(2)
  }

  /* ==========================================================
     CREATE LIC
  ========================================================== */

  const handleCreateAccount = async () => {
    if (!email.trim()) {
      toast.error("Email address is required.")
      return
    }

    if (!isValidEmail(email.trim())) {
      toast.error(
        "Please enter a valid email address."
      )

      return
    }

    if (!tempPassword) {
      toast.error(
        "Temporary password is missing."
      )

      return
    }

    if (isCreatingLIC) return

    setIsCreatingLIC(true)

    try {
      const res = await fetch(
        "/api/admin/create-lic",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: fullName.trim(),
            employeeId: employeeId.trim(),
            department: department.trim(),
            contactNumber:
              contactNumber.trim(),
            email: email
              .trim()
              .toLowerCase(),
            tempPassword,
          }),
        }
      )

      const data = await res.json().catch(
        () => null
      )

      if (!res.ok) {
        toast.error(
          data?.message ||
            "Failed to create LIC account."
        )

        return
      }

      toast.success(
        "LIC account created successfully."
      )

      await fetchLICs()

      setFullName("")
      setEmployeeId("")
      setDepartment("")
      setContactNumber("")
      setEmail("")
      setTempPassword("")
      setStep(1)
    } catch (error) {
      console.error(
        "Create LIC error:",
        error
      )

      toast.error(
        "Something went wrong while creating the LIC account."
      )
    } finally {
      setIsCreatingLIC(false)
    }
  }

  /* ==========================================================
     ADD TEACHER
  ========================================================== */

  const handleAddTeacher = async () => {
    if (!instructorName.trim()) {
      toast.error(
        "Instructor name is required."
      )

      return
    }

    if (!instructorEmail.trim()) {
      toast.error(
        "Instructor email is required."
      )

      return
    }

    if (
      !isValidEmail(instructorEmail.trim())
    ) {
      toast.error(
        "Please enter a valid instructor email."
      )

      return
    }

    if (isAddingTeacher) return

    setIsAddingTeacher(true)

    try {
      const res = await fetch(
        "/api/admin/create-teacher",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: instructorName.trim(),
            email: instructorEmail
              .trim()
              .toLowerCase(),
          }),
        }
      )

      const data = await res.json().catch(
        () => null
      )

      if (!res.ok) {
        toast.error(
          data?.message ||
            "Failed to add instructor."
        )

        return
      }

      toast.success(
        "Instructor added successfully."
      )

      setInstructorName("")
      setInstructorEmail("")

      await fetchTeachers()
    } catch (error) {
      console.error(
        "Add instructor error:",
        error
      )

      toast.error(
        "Something went wrong while adding the instructor."
      )
    } finally {
      setIsAddingTeacher(false)
    }
  }

  /* ==========================================================
     DELETE MODAL
  ========================================================== */

  const openDeleteModal = (
    id: string,
    type: "lic" | "teacher"
  ) => {
    setDeleteTarget({
      id,
      type,
    })

    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    if (isDeleting) return

    setShowDeleteModal(false)
    setDeleteTarget(null)
  }

  /* ==========================================================
     DELETE RECORD
  ========================================================== */

  const handleDelete = async () => {
    if (!deleteTarget || isDeleting) return

    setIsDeleting(true)

    try {
      const url =
        deleteTarget.type === "lic"
          ? `/api/admin/delete-lic/${deleteTarget.id}`
          : `/api/admin/delete-teacher/${deleteTarget.id}`

      const res = await fetch(url, {
        method: "DELETE",
      })

      const data = await res.json().catch(
        () => null
      )

      if (!res.ok) {
        toast.error(
          data?.message ||
            "Failed to delete record."
        )

        return
      }

      toast.success(
        deleteTarget.type === "lic"
          ? "LIC account deleted successfully."
          : "Instructor deleted successfully."
      )

      if (deleteTarget.type === "lic") {
        await fetchLICs()
      } else {
        await fetchTeachers()
      }

      setShowDeleteModal(false)
      setDeleteTarget(null)
    } catch (error) {
      console.error(
        "Delete error:",
        error
      )

      toast.error(
        "Something went wrong while deleting the record."
      )
    } finally {
      setIsDeleting(false)
    }
  }

  /* ==========================================================
     LOGOUT
  ========================================================== */

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })
    } catch (error) {
      console.error(
        "Logout error:",
        error
      )
    } finally {
      router.push("/admin")
    }
  }

  /* ==========================================================
     COPY PASSWORD
  ========================================================== */

  const copyPassword = async () => {
    if (!tempPassword) return

    try {
      await navigator.clipboard.writeText(
        tempPassword
      )

      toast.success(
        "Temporary password copied."
      )
    } catch (error) {
      console.error(
        "Copy password error:",
        error
      )

      toast.error(
        "Unable to copy password."
      )
    }
  }

  /* ==========================================================
     SIDEBAR BUTTON
  ========================================================== */

  const sidebarButtonClass = (
    section: AdminSection
  ) => {
    const isActive =
      activeSection === section

    return `
      flex w-full items-center gap-3
      rounded-xl
      px-3 py-2.5
      text-sm
      transition
      ${
        isActive
          ? "bg-[#800000]/[0.07] font-semibold text-[#800000]"
          : "text-gray-500 hover:bg-gray-50 hover:text-[#800000]"
      }
    `
  }

  /* ==========================================================
     STATISTICS
  ========================================================== */

  const requestStats = useMemo(() => {
    const stats = {
      total: requests.length,
      pending: 0,
      approved: 0,
      rejected: 0,
      released: 0,
      returned: 0,
    }

    requests.forEach((request) => {
      const status =
        normalizeStatus(request.status)

      if (
        status === "pending"
      ) {
        stats.pending++
      } else if (
        status === "approved"
      ) {
        stats.approved++
      } else if (
        status === "rejected"
      ) {
        stats.rejected++
      } else if (
        status === "released"
      ) {
        stats.released++
      } else if (
        status === "returned"
      ) {
        stats.returned++
      }
    })

    return stats
  }, [requests])

  const totalEquipmentQuantity =
    useMemo(
      () =>
        tools.reduce(
          (total, tool) =>
            total +
            Number(tool.quantity || 0),
          0
        ),
      [tools]
    )

  const lowStockTools = useMemo(
    () =>
      tools.filter(
        (tool) =>
          Number(tool.quantity) > 0 &&
          Number(tool.quantity) < 5
      ),
    [tools]
  )

  const unavailableTools = useMemo(
    () =>
      tools.filter(
        (tool) =>
          Number(tool.quantity) === 0
      ),
    [tools]
  )

  /* ==========================================================
     FILTERED TOOLS
  ========================================================== */

  const filteredTools = useMemo(() => {
    const query =
      toolSearch.trim().toLowerCase()

    if (!query) return tools

    return tools.filter((tool) =>
      [
        tool.name,
        tool.status,
        String(tool.quantity),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    )
  }, [tools, toolSearch])

  /* ==========================================================
     FILTERED REQUESTS
  ========================================================== */

  const filteredRequests = useMemo(() => {
    const query =
      requestSearch.trim().toLowerCase()

    return requests.filter((request) => {
      const status =
        normalizeStatus(request.status)

      if (
        requestFilter !== "all" &&
        status !== requestFilter
      ) {
        return false
      }

      if (!query) return true

      const searchableText = [
        request._id,
        request.studentName,
        request.studentId,
        request.section,
        request.groupNumber,
        request.activityTitle,
        request.purpose,
        request.instructorName,
        request.instructor,
        request.status,
        request.rejectReason,
        request.reason,
      ]
        .map((value) =>
          getStringValue(value)
        )
        .join(" ")
        .toLowerCase()

      return searchableText.includes(query)
    })
  }, [
    requests,
    requestSearch,
    requestFilter,
  ])

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f6f6f6] text-gray-900">
      <Toaster
        position="top-right"
        richColors
        closeButton
      />

      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <aside className="hidden w-[250px] shrink-0 border-r border-gray-200 bg-white lg:flex lg:flex-col">
        {/* LOGO */}

        <div className="flex h-20 items-center gap-3 border-b border-gray-100 px-6">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white">
            <Image
              src="/logo/OfficialLogo.png"
              alt="Lab Borrowing System"
              width={70}
              height={70}
              priority
              className="h-full w-full object-contain"
            />
          </div>

          <div>
            <p className="text-sm font-bold text-[#800000]">
              Lab Borrowing
            </p>

            <p className="text-xs text-gray-400">
              Administration
            </p>
          </div>
        </div>

        {/* NAVIGATION */}

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
            Main Menu
          </p>

          <div className="space-y-1">
            <button
              type="button"
              onClick={() =>
                handleSectionChange(
                  "dashboard"
                )
              }
              className={sidebarButtonClass(
                "dashboard"
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </button>

            <button
              type="button"
              onClick={() =>
                handleSectionChange(
                  "borrowing"
                )
              }
              className={sidebarButtonClass(
                "borrowing"
              )}
            >
              <ClipboardList className="h-4 w-4" />
              Borrowing Records
            </button>

            <button
              type="button"
              onClick={() =>
                handleSectionChange(
                  "equipment"
                )
              }
              className={sidebarButtonClass(
                "equipment"
              )}
            >
              <BriefcaseBusiness className="h-4 w-4" />
              Equipment
            </button>
          </div>

          <p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
            Management
          </p>

          <div className="space-y-1">
            <button
              type="button"
              onClick={() =>
                handleSectionChange("users")
              }
              className={sidebarButtonClass(
                "users"
              )}
            >
              <Users className="h-4 w-4" />
              Users
            </button>

            <button
              type="button"
              onClick={() =>
                handleSectionChange(
                  "instructors"
                )
              }
              className={sidebarButtonClass(
                "instructors"
              )}
            >
              <GraduationCap className="h-4 w-4" />
              Instructors
            </button>
          </div>
        </div>

        {/* ADMIN ACCOUNT */}

        <div className="border-t border-gray-100 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-gray-50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#800000] text-[#FFD700]">
              <ShieldCheck className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-gray-800">
                Administrator
              </p>

              <p className="truncate text-[10px] text-gray-400">
                System Admin
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            variant="outline"
            className="
              h-10
              w-full
              rounded-xl
              border-gray-200
              text-gray-600
              hover:border-red-200
              hover:bg-red-50
              hover:text-red-600
            "
          >
            <LogOut className="mr-2 h-4 w-4" />

            {isLoggingOut
              ? "Signing Out..."
              : "Sign Out"}
          </Button>
        </div>
      </aside>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* HEADER */}

        <header className="flex h-20 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-5 sm:px-8">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white">
              <Image
                src="/logo/OfficialLogo.png"
                alt="Lab Borrowing System"
                width={60}
                height={60}
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          <div>
            <div className="hidden items-center gap-2 text-xs text-gray-400 sm:flex">
              <span>
                Administration
              </span>

              <span>/</span>

              <span className="text-[#800000]">
                {sectionTitle.replace(
                  "Admin Dashboard",
                  "Dashboard"
                )}
              </span>
            </div>

            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              {sectionTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 sm:flex">
              <span className="h-2 w-2 rounded-full bg-green-500" />

              <span className="text-xs font-medium text-green-700">
                System Online
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={refreshAll}
              className="
                rounded-xl
                border-gray-200
                text-gray-500
                hover:border-[#800000]/20
                hover:bg-[#800000]/5
                hover:text-[#800000]
              "
            >
              <RefreshCw className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="
                rounded-xl
                border-gray-200
                text-gray-500
                hover:border-red-200
                hover:bg-red-50
                hover:text-red-600
                lg:hidden
              "
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* CONTENT */}

        <div className="relative flex-1 overflow-auto">
          {isSectionLoading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white px-7 py-6 shadow-lg">
                <Loader2 className="h-7 w-7 animate-spin text-[#800000]" />
                <span className="text-sm font-medium text-gray-600">Loading...</span>
              </div>
            </div>
          )}

          <div className="mx-auto w-full max-w-[1500px] p-5 sm:p-7 lg:p-8">

            {/* ==================================================
                DASHBOARD
            ================================================== */}

            {activeSection ===
              "dashboard" && (
              <>
                <div className="mb-6">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-[#800000]" />

                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#800000]">
                      System Overview
                    </span>
                  </div>

                  <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                    Welcome back, Administrator
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Monitor laboratory personnel,
                    equipment, and borrowing
                    activity from one centralized
                    workspace.
                  </p>
                </div>

                {/* TOP STATS */}

                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {/* LIC */}

                  <Card className="rounded-2xl border-gray-200 shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-400">
                            LIC Accounts
                          </p>

                          <p className="mt-1 text-3xl font-bold">
                            {labAccounts.length}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Laboratory personnel
                          </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#800000]/10 text-[#800000]">
                          <ShieldCheck className="h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* INSTRUCTORS */}

                  <Card className="rounded-2xl border-gray-200 shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-400">
                            Instructors
                          </p>

                          <p className="mt-1 text-3xl font-bold">
                            {teachers.length}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Registered instructors
                          </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFD700]/20 text-[#800000]">
                          <GraduationCap className="h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* EQUIPMENT */}

                  <Card className="rounded-2xl border-gray-200 shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-400">
                            Equipment
                          </p>

                          <p className="mt-1 text-3xl font-bold">
                            {tools.length}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {totalEquipmentQuantity} total units
                          </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <BriefcaseBusiness className="h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* PENDING */}

                  <Card className="rounded-2xl border-gray-200 shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-400">
                            Pending Requests
                          </p>

                          <p className="mt-1 text-3xl font-bold">
                            {requestStats.pending}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Awaiting LIC action
                          </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                          <Clock3 className="h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* SECONDARY STATS */}

                <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <Card className="rounded-2xl border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                      <p className="text-xs text-gray-400">
                        Total Requests
                      </p>

                      <p className="mt-1 text-2xl font-bold">
                        {requestStats.total}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                      <p className="text-xs text-gray-400">
                        Active Borrowings
                      </p>

                      <p className="mt-1 text-2xl font-bold text-purple-600">
                        {requestStats.released}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                      <p className="text-xs text-gray-400">
                        Low Stock
                      </p>

                      <p className="mt-1 text-2xl font-bold text-amber-600">
                        {lowStockTools.length}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                      <p className="text-xs text-gray-400">
                        Unavailable
                      </p>

                      <p className="mt-1 text-2xl font-bold text-red-600">
                        {unavailableTools.length}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* MAIN DASHBOARD GRID */}

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                  {/* RECENT REQUESTS */}

                  <Card className="rounded-2xl border-gray-200 shadow-sm">
                    <CardHeader className="border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">
                            Recent Borrowing Requests
                          </CardTitle>

                          <p className="mt-0.5 text-xs text-gray-400">
                            Latest activity in the borrowing system
                          </p>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() =>
                            setActiveSection(
                              "borrowing"
                            )
                          }
                          className="text-xs text-[#800000] hover:bg-[#800000]/5"
                        >
                          View All
                          <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4">
                      {isLoadingRequests ? (
                        <div className="flex min-h-[300px] items-center justify-center">
                          <Loader2 className="h-7 w-7 animate-spin text-[#800000]" />
                        </div>
                      ) : requests.length ===
                        0 ? (
                        <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                          <ClipboardList className="mb-3 h-8 w-8 text-gray-300" />

                          <p className="text-sm font-semibold text-gray-600">
                            No borrowing records
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Borrowing requests will
                            appear here.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {requests
                            .slice(0, 6)
                            .map(
                              (
                                request
                              ) => (
                                <div
                                  key={
                                    request._id
                                  }
                                  className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3"
                                >
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#800000]/10 text-[#800000]">
                                    <ClipboardList className="h-4 w-4" />
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold">
                                      {getRequestStudent(
                                        request
                                      )}
                                    </p>

                                    <p className="truncate text-xs text-gray-400">
                                      {getStringValue(
                                        request.activityTitle
                                      ) ||
                                        "Borrowing Request"}
                                    </p>

                                    <p className="mt-1 text-[10px] text-gray-400">
                                      {formatDateTime(
                                        request.createdAt
                                      )}
                                    </p>
                                  </div>

                                  <span
                                    className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getStatusClasses(
                                      request.status
                                    )}`}
                                  >
                                    {getStatusLabel(
                                      request.status
                                    )}
                                  </span>
                                </div>
                              )
                            )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* INVENTORY STATUS */}

                  <Card className="rounded-2xl border-gray-200 shadow-sm">
                    <CardHeader className="border-b border-gray-100">
                      <div>
                        <CardTitle className="text-base">
                          Inventory Status
                        </CardTitle>

                        <p className="mt-0.5 text-xs text-gray-400">
                          Equipment requiring attention
                        </p>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4">
                      {lowStockTools.length ===
                        0 &&
                      unavailableTools.length ===
                        0 ? (
                        <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                            <CheckCircle2 className="h-6 w-6" />
                          </div>

                          <p className="text-sm font-semibold text-gray-700">
                            Inventory looks good
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            No equipment is currently
                            low in stock or unavailable.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {[
                            ...unavailableTools,
                            ...lowStockTools,
                          ]
                            .slice(0, 8)
                            .map(
                              (tool) => (
                                <div
                                  key={
                                    tool._id
                                  }
                                  className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3"
                                >
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFD700]/20 text-[#800000]">
                                    <BriefcaseBusiness className="h-4 w-4" />
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold">
                                      {
                                        tool.name
                                      }
                                    </p>

                                    <p className="text-xs text-gray-400">
                                      {
                                        tool.quantity
                                      }{" "}
                                      unit
                                      {tool.quantity !==
                                      1
                                        ? "s"
                                        : ""}{" "}
                                      remaining
                                    </p>
                                  </div>

                                  <span
                                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                                      Number(
                                        tool.quantity
                                      ) ===
                                      0
                                        ? "bg-red-50 text-red-600"
                                        : "bg-amber-50 text-amber-700"
                                    }`}
                                  >
                                    {Number(
                                      tool.quantity
                                    ) ===
                                    0
                                      ? "Unavailable"
                                      : "Low Stock"}
                                  </span>
                                </div>
                              )
                            )}

                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              handleSectionChange(
                                "equipment"
                              )
                            }
                            className="mt-2 h-10 w-full rounded-xl text-xs"
                          >
                            View Equipment
                            <ArrowRight className="ml-2 h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {/* ==================================================
                BORROWING RECORDS
            ================================================== */}

            {activeSection ===
              "borrowing" && (
              <div>
                <div className="mb-6">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-[#800000]" />

                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#800000]">
                      Records
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                        Borrowing Records
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        Monitor and review laboratory borrowing transactions.
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={fetchRequests}
                      disabled={
                        isLoadingRequests
                      }
                      className="h-10 rounded-xl"
                    >
                      <RefreshCw
                        className={`mr-2 h-4 w-4 ${
                          isLoadingRequests
                            ? "animate-spin"
                            : ""
                        }`}
                      />
                      Refresh
                    </Button>
                  </div>
                </div>

                {/* STATUS FILTERS */}

                <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                  {(
                    [
                      "all",
                      "pending",
                      "approved",
                      "rejected",
                      "released",
                      "returned",
                    ] as RequestFilter[]
                  ).map(
                    (filter) => {
                      const count =
                        filter ===
                        "all"
                          ? requestStats.total
                          : requestStats[
                              filter
                            ]

                      return (
                        <button
                          key={
                            filter
                          }
                          type="button"
                          onClick={() =>
                            setRequestFilter(
                              filter
                            )
                          }
                          className={`rounded-xl border px-3 py-3 text-left transition ${
                            requestFilter ===
                            filter
                              ? "border-[#800000]/20 bg-[#800000]/5"
                              : "border-gray-200 bg-white hover:bg-gray-50"
                          }`}
                        >
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            {filter ===
                            "all"
                              ? "All"
                              : filter}
                          </p>

                          <p className="mt-1 text-xl font-bold text-gray-900">
                            {count}
                          </p>
                        </button>
                      )
                    }
                  )}
                </div>

                <Card className="rounded-2xl border-gray-200 shadow-sm">
                  <CardHeader className="border-b border-gray-100">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <CardTitle className="text-base">
                          All Requests
                        </CardTitle>

                        <p className="text-xs text-gray-400">
                          {filteredRequests.length}{" "}
                          record
                          {filteredRequests.length !==
                          1
                            ? "s"
                            : ""}{" "}
                          found
                        </p>
                      </div>

                      <div className="relative w-full lg:w-[320px]">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                        <Input
                          value={
                            requestSearch
                          }
                          onChange={(
                            e
                          ) =>
                            setRequestSearch(
                              e.target
                                .value
                            )
                          }
                          placeholder="Search requests..."
                          className="h-10 rounded-xl pl-9"
                        />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0">
                    {isLoadingRequests ? (
                      <div className="flex min-h-[400px] items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-[#800000]" />
                      </div>
                    ) : filteredRequests.length ===
                      0 ? (
                      <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
                        <ClipboardList className="mb-3 h-10 w-10 text-gray-300" />

                        <p className="text-sm font-semibold text-gray-600">
                          No records found
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Try changing your search or filter.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                          <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/70">
                              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                Borrower
                              </th>

                              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                Instructor
                              </th>

                              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                Activity
                              </th>

                              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                Date
                              </th>

                              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                Status
                              </th>

                              <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                Action
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {filteredRequests.map(
                              (
                                request
                              ) => (
                                <tr
                                  key={
                                    request._id
                                  }
                                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
                                >
                                  <td className="px-5 py-4">
                                    <p className="text-sm font-semibold text-gray-800">
                                      {getRequestStudent(
                                        request
                                      )}
                                    </p>

                                    <p className="mt-0.5 text-xs text-gray-400">
                                      {getStringValue(
                                        request.section
                                      )
                                        ? `Section ${getStringValue(
                                            request.section
                                          )}`
                                        : getStringValue(
                                            request.studentId
                                          ) ||
                                          "Student"}
                                    </p>
                                  </td>

                                  <td className="px-5 py-4">
                                    <p className="text-sm text-gray-700">
                                      {getRequestInstructor(
                                        request
                                      )}
                                    </p>
                                  </td>

                                  <td className="max-w-[220px] px-5 py-4">
                                    <p className="truncate text-sm text-gray-700">
                                      {getStringValue(
                                        request.activityTitle
                                      ) ||
                                        getStringValue(
                                          request.purpose
                                        ) ||
                                        "Borrowing Request"}
                                    </p>

                                    <p className="mt-0.5 text-[10px] text-gray-400">
                                      ID:{" "}
                                      {request._id.slice(
                                        -8
                                      )}
                                    </p>
                                  </td>

                                  <td className="px-5 py-4">
                                    <p className="text-xs text-gray-600">
                                      {formatDate(
                                        request.createdAt
                                      )}
                                    </p>
                                  </td>

                                  <td className="px-5 py-4">
                                    <span
                                      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getStatusClasses(
                                        request.status
                                      )}`}
                                    >
                                      {getStatusLabel(
                                        request.status
                                      )}
                                    </span>
                                  </td>

                                  <td className="px-5 py-4 text-right">
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        setSelectedRequest(
                                          request
                                        )
                                      }
                                      className="h-8 rounded-lg text-xs"
                                    >
                                      <Eye className="mr-1.5 h-3.5 w-3.5" />
                                      View
                                    </Button>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ==================================================
                EQUIPMENT
            ================================================== */}

            {activeSection ===
              "equipment" && (
              <div>
                <div className="mb-6">
                  <div className="flex items-center gap-2">
                    <BriefcaseBusiness className="h-4 w-4 text-[#800000]" />

                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#800000]">
                      Inventory
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                        Equipment
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        View laboratory equipment and current inventory status.
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={fetchTools}
                      disabled={isLoadingTools}
                      className="h-10 rounded-xl"
                    >
                      <RefreshCw
                        className={`mr-2 h-4 w-4 ${
                          isLoadingTools
                            ? "animate-spin"
                            : ""
                        }`}
                      />
                      Refresh
                    </Button>
                  </div>
                </div>

                {/* EQUIPMENT STATS */}

                <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <Card className="rounded-2xl border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                      <p className="text-xs text-gray-400">
                        Equipment Types
                      </p>

                      <p className="mt-1 text-2xl font-bold">
                        {tools.length}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                      <p className="text-xs text-gray-400">
                        Total Units
                      </p>

                      <p className="mt-1 text-2xl font-bold">
                        {totalEquipmentQuantity}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                      <p className="text-xs text-gray-400">
                        Low Stock
                      </p>

                      <p className="mt-1 text-2xl font-bold text-amber-600">
                        {lowStockTools.length}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                      <p className="text-xs text-gray-400">
                        Unavailable
                      </p>

                      <p className="mt-1 text-2xl font-bold text-red-600">
                        {unavailableTools.length}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="rounded-2xl border-gray-200 shadow-sm">
                  <CardHeader className="border-b border-gray-100">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <CardTitle className="text-base">
                          Equipment Inventory
                        </CardTitle>

                        <p className="text-xs text-gray-400">
                          {filteredTools.length}{" "}
                          equipment
                          {filteredTools.length !==
                          1
                            ? " items"
                            : " item"}
                        </p>
                      </div>

                      <div className="relative w-full sm:w-[300px]">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                        <Input
                          value={toolSearch}
                          onChange={(e) =>
                            setToolSearch(
                              e.target
                                .value
                            )
                          }
                          placeholder="Search equipment..."
                          className="h-10 rounded-xl pl-9"
                        />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4">
                    {isLoadingTools ? (
                      <div className="flex min-h-[400px] items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-[#800000]" />
                      </div>
                    ) : filteredTools.length ===
                      0 ? (
                      <div className="flex min-h-[350px] flex-col items-center justify-center text-center">
                        <BriefcaseBusiness className="mb-3 h-10 w-10 text-gray-300" />

                        <p className="text-sm font-semibold text-gray-600">
                          No equipment found
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Try another search.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {filteredTools.map(
                          (tool) => {
                            const quantity =
                              Number(
                                tool.quantity ||
                                  0
                              )

                            const isUnavailable =
                              quantity ===
                              0

                            const isLowStock =
                              quantity >
                                0 &&
                              quantity <
                                5

                            return (
                              <div
                                key={
                                  tool._id
                                }
                                className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 transition hover:border-[#800000]/20 hover:bg-white"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#800000]/10 text-[#800000]">
                                    <BriefcaseBusiness className="h-5 w-5" />
                                  </div>

                                  <span
                                    className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
                                      isUnavailable
                                        ? "border-red-100 bg-red-50 text-red-600"
                                        : isLowStock
                                          ? "border-amber-100 bg-amber-50 text-amber-700"
                                          : "border-green-100 bg-green-50 text-green-700"
                                    }`}
                                  >
                                    {isUnavailable
                                      ? "Unavailable"
                                      : isLowStock
                                        ? "Low Stock"
                                        : "Available"}
                                  </span>
                                </div>

                                <h3 className="mt-4 truncate text-sm font-bold text-gray-800">
                                  {
                                    tool.name
                                  }
                                </h3>

                                <div className="mt-3 flex items-end justify-between">
                                  <div>
                                    <p className="text-[10px] uppercase tracking-wider text-gray-400">
                                      Quantity
                                    </p>

                                    <p className="mt-0.5 text-2xl font-bold">
                                      {
                                        quantity
                                      }
                                    </p>
                                  </div>

                                  <PackageCheck className="h-5 w-5 text-gray-300" />
                                </div>
                              </div>
                            )
                          }
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ==================================================
                USERS
            ================================================== */}

            {activeSection ===
              "users" && (
              <div>
                <div className="mb-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#800000]" />

                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#800000]">
                      Management
                    </span>
                  </div>

                  <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                    Users
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Create and manage laboratory-in-charge accounts.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                  {/* CREATE LIC */}

                  <Card className="rounded-2xl border-gray-200 shadow-sm">
                    <CardHeader className="border-b border-gray-100 pb-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#800000] text-[#FFD700]">
                          <UserPlus className="h-5 w-5" />
                        </div>

                        <div>
                          <CardTitle className="text-base">
                            Create LIC Account
                          </CardTitle>

                          <p className="mt-0.5 text-xs text-gray-400">
                            Add laboratory personnel
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-5 sm:p-6">
                      {step === 1 ? (
                        <div className="space-y-4">
                          <Input
                            value={
                              fullName
                            }
                            onChange={(
                              e
                            ) =>
                              setFullName(
                                e.target
                                  .value
                              )
                            }
                            placeholder="Full Name"
                            className="h-11 rounded-xl"
                          />

                          <Input
                            value={
                              employeeId
                            }
                            onChange={(
                              e
                            ) =>
                              setEmployeeId(
                                e.target
                                  .value
                              )
                            }
                            placeholder="Employee ID"
                            className="h-11 rounded-xl"
                          />

                          <Input
                            value={
                              department
                            }
                            onChange={(
                              e
                            ) =>
                              setDepartment(
                                e.target
                                  .value
                              )
                            }
                            placeholder="Department"
                            className="h-11 rounded-xl"
                          />

                          <Input
                            value={
                              contactNumber
                            }
                            onChange={(
                              e
                            ) => {
                              const value =
                                e.target.value.replace(
                                  /\D/g,
                                  ""
                                )

                              setContactNumber(
                                value.slice(
                                  0,
                                  11
                                )
                              )
                            }}
                            placeholder="09XXXXXXXXX"
                            inputMode="numeric"
                            maxLength={
                              11
                            }
                            className="h-11 rounded-xl"
                          />

                          <Button
                            type="button"
                            onClick={
                              handleNextStep
                            }
                            className="h-11 w-full rounded-xl bg-[#800000] text-[#FFD700] hover:bg-[#660000]"
                          >
                            Continue
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Input
                            type="email"
                            value={
                              email
                            }
                            onChange={(
                              e
                            ) =>
                              setEmail(
                                e.target
                                  .value
                              )
                            }
                            placeholder="employee@school.edu"
                            className="h-11 rounded-xl"
                          />

                          <div className="rounded-xl border border-[#FFD700]/40 bg-[#FFD700]/10 p-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-[#800000]">
                              Temporary Password
                            </p>

                            <div className="mt-1 flex items-center justify-between gap-3">
                              <p className="break-all font-mono font-bold">
                                {
                                  tempPassword
                                }
                              </p>

                              <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                onClick={
                                  copyPassword
                                }
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                setStep(
                                  1
                                )
                              }
                              disabled={
                                isCreatingLIC
                              }
                              className="h-11 flex-1 rounded-xl"
                            >
                              Back
                            </Button>

                            <Button
                              type="button"
                              onClick={
                                handleCreateAccount
                              }
                              disabled={
                                isCreatingLIC
                              }
                              className="h-11 flex-1 rounded-xl bg-[#800000] text-[#FFD700] hover:bg-[#660000]"
                            >
                              {isCreatingLIC
                                ? "Creating..."
                                : "Create Account"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* LIC LIST */}

                  <Card className="rounded-2xl border-gray-200 shadow-sm">
                    <CardHeader className="border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">
                            LIC Accounts
                          </CardTitle>

                          <p className="text-xs text-gray-400">
                            Laboratory-in-Charge users
                          </p>
                        </div>

                        <span className="rounded-full bg-[#800000]/10 px-3 py-1 text-xs font-bold text-[#800000]">
                          {
                            labAccounts.length
                          }
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="max-h-[650px] overflow-y-auto p-4">
                      {isLoadingLICs ? (
                        <div className="flex min-h-[300px] items-center justify-center">
                          <Loader2 className="h-7 w-7 animate-spin text-[#800000]" />
                        </div>
                      ) : labAccounts.length ===
                        0 ? (
                        <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                          <Users className="mb-3 h-8 w-8 text-gray-300" />

                          <p className="text-sm font-semibold text-gray-600">
                            No LIC accounts
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Create your first LIC account.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {labAccounts.map(
                            (acc) => (
                              <div
                                key={
                                  acc._id
                                }
                                className="rounded-xl border border-gray-100 bg-gray-50/60 p-3"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#800000] font-bold text-[#FFD700]">
                                    {acc.fullName
                                      .charAt(
                                        0
                                      )
                                      .toUpperCase()}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold">
                                      {
                                        acc.fullName
                                      }
                                    </p>

                                    <p className="truncate text-xs text-gray-400">
                                      {
                                        acc.email
                                      }
                                    </p>

                                    <div className="mt-1 flex flex-wrap gap-1.5">
                                      <span className="rounded-md bg-white px-2 py-0.5 text-[10px] text-gray-500">
                                        {
                                          acc.employeeId
                                        }
                                      </span>

                                      <span className="rounded-md bg-white px-2 py-0.5 text-[10px] text-gray-500">
                                        {
                                          acc.department
                                        }
                                      </span>
                                    </div>
                                  </div>

                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    onClick={() =>
                                      openDeleteModal(
                                        acc._id,
                                        "lic"
                                      )
                                    }
                                    className="h-8 w-8 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* ==================================================
                INSTRUCTORS
            ================================================== */}

            {activeSection ===
              "instructors" && (
              <div>
                <div className="mb-6">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-[#800000]" />

                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#800000]">
                      Management
                    </span>
                  </div>

                  <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                    Instructors
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Manage instructors available for borrower slips.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                  {/* ADD INSTRUCTOR */}

                  <Card className="rounded-2xl border-gray-200 shadow-sm">
                    <CardHeader className="border-b border-gray-100 pb-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFD700]/20 text-[#800000]">
                          <GraduationCap className="h-5 w-5" />
                        </div>

                        <div>
                          <CardTitle className="text-base">
                            Add Instructor
                          </CardTitle>

                          <p className="mt-0.5 text-xs text-gray-400">
                            Register teaching staff
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 p-5 sm:p-6">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-600">
                          Instructor Name
                        </label>

                        <Input
                          value={
                            instructorName
                          }
                          onChange={(
                            e
                          ) =>
                            setInstructorName(
                              e.target
                                .value
                            )
                          }
                          placeholder="Full name"
                          className="h-11 rounded-xl"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-600">
                          Email Address
                        </label>

                        <Input
                          type="email"
                          value={
                            instructorEmail
                          }
                          onChange={(
                            e
                          ) =>
                            setInstructorEmail(
                              e.target
                                .value
                            )
                          }
                          placeholder="instructor@school.edu"
                          className="h-11 rounded-xl"
                        />
                      </div>

                      <Button
                        type="button"
                        onClick={
                          handleAddTeacher
                        }
                        disabled={
                          isAddingTeacher
                        }
                        className="h-11 w-full rounded-xl bg-[#800000] font-semibold text-[#FFD700] hover:bg-[#660000]"
                      >
                        <Plus className="mr-2 h-4 w-4" />

                        {isAddingTeacher
                          ? "Adding..."
                          : "Add Instructor"}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* INSTRUCTOR LIST */}

                  <Card className="rounded-2xl border-gray-200 shadow-sm">
                    <CardHeader className="border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">
                            Registered Instructors
                          </CardTitle>

                          <p className="text-xs text-gray-400">
                            Teaching staff
                          </p>
                        </div>

                        <span className="rounded-full bg-[#FFD700]/25 px-3 py-1 text-xs font-bold text-[#800000]">
                          {
                            teachers.length
                          }
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="max-h-[650px] overflow-y-auto p-4">
                      {isLoadingTeachers ? (
                        <div className="flex min-h-[300px] items-center justify-center">
                          <Loader2 className="h-7 w-7 animate-spin text-[#800000]" />
                        </div>
                      ) : teachers.length ===
                        0 ? (
                        <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                          <GraduationCap className="mb-3 h-8 w-8 text-gray-300" />

                          <p className="text-sm font-semibold text-gray-600">
                            No instructors
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Add an instructor using the form.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {teachers.map(
                            (teacher) => (
                              <div
                                key={
                                  teacher._id
                                }
                                className="rounded-xl border border-gray-100 bg-gray-50/60 p-3"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFD700]/25 font-bold text-[#800000]">
                                    {teacher.name
                                      .charAt(
                                        0
                                      )
                                      .toUpperCase()}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold">
                                      {
                                        teacher.name
                                      }
                                    </p>

                                    <div className="mt-1 flex items-center gap-1.5">
                                      <Mail className="h-3 w-3 text-gray-400" />

                                      <p className="truncate text-xs text-gray-400">
                                        {
                                          teacher.email
                                        }
                                      </p>
                                    </div>
                                  </div>

                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    onClick={() =>
                                      openDeleteModal(
                                        teacher._id,
                                        "teacher"
                                      )
                                    }
                                    className="h-8 w-8 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ======================================================
          REQUEST DETAILS MODAL
      ====================================================== */}

      {selectedRequest && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (
              e.target ===
              e.currentTarget
            ) {
              setSelectedRequest(null)
            }
          }}
        >
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_25px_80px_rgba(0,0,0,0.18)]">
            {/* HEADER */}

            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#800000]/10 text-[#800000]">
                  <ClipboardList className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-sm font-bold">
                    Borrowing Request
                  </h2>

                  <p className="text-[10px] text-gray-400">
                    ID:{" "}
                    {selectedRequest._id}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  setSelectedRequest(null)
                }
                className="h-8 w-8 rounded-lg"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* CONTENT */}

            <div className="flex-1 overflow-y-auto p-5">
              {/* STATUS */}

              <div className="mb-5 flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Current Status
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {getStatusLabel(
                      selectedRequest.status
                    )}
                  </p>
                </div>

                <span
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                    selectedRequest.status
                  )}`}
                >
                  {getStatusLabel(
                    selectedRequest.status
                  )}
                </span>
              </div>

              {/* BORROWER */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Student / Borrower
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {getRequestStudent(
                      selectedRequest
                    )}
                  </p>

                  {getStringValue(
                    selectedRequest.studentId
                  ) && (
                    <p className="mt-1 text-xs text-gray-400">
                      ID:{" "}
                      {getStringValue(
                        selectedRequest.studentId
                      )}
                    </p>
                  )}
                </div>

                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Instructor
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {getRequestInstructor(
                      selectedRequest
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Section
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {getStringValue(
                      selectedRequest.section
                    ) ||
                      "N/A"}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Group
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {getStringValue(
                      selectedRequest.groupNumber
                    ) ||
                      "N/A"}
                  </p>
                </div>
              </div>

              {/* ACTIVITY */}

              <div className="mt-4 rounded-xl border border-gray-100 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Activity / Purpose
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-800">
                  {getStringValue(
                    selectedRequest.activityTitle
                  ) ||
                    getStringValue(
                      selectedRequest.purpose
                    ) ||
                    "N/A"}
                </p>
              </div>

              {/* ITEMS */}

              <div className="mt-4 rounded-xl border border-gray-100 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Requested Equipment
                  </p>

                  <span className="text-[10px] text-gray-400">
                    {
                      getRequestItems(
                        selectedRequest
                      ).length
                    }{" "}
                    item
                    {getRequestItems(
                      selectedRequest
                    ).length !==
                    1
                      ? "s"
                      : ""}
                  </span>
                </div>

                {getRequestItems(
                  selectedRequest
                ).length === 0 ? (
                  <p className="text-xs text-gray-400">
                    No equipment details available.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {getRequestItems(
                      selectedRequest
                    ).map(
                      (
                        item,
                        index
                      ) => (
                        <div
                          key={
                            `${getItemName(
                              item
                            )}-${index}`
                          }
                          className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                        >
                          <p className="text-xs font-medium text-gray-700">
                            {getItemName(
                              item
                            )}
                          </p>

                          <span className="text-xs font-bold text-gray-600">
                            ×{" "}
                            {getItemQuantity(
                              item
                            )}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* DATES */}

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Request Date
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {formatDateTime(
                      selectedRequest.createdAt
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Requested Borrow Date
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {formatDate(
                      selectedRequest.requestedDate ||
                        selectedRequest.borrowDate
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Expected Return
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {formatDate(
                      selectedRequest.expectedReturnDate ||
                        selectedRequest.returnDate
                    )}
                  </p>
                </div>
              </div>

              {/* REJECTION */}

              {(
                getStringValue(
                  selectedRequest.rejectReason
                ) ||
                getStringValue(
                  selectedRequest.reason
                )
              ) && (
                <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />

                    <p className="text-xs font-bold text-red-700">
                      Rejection / Reason
                    </p>
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-red-600">
                    {getStringValue(
                      selectedRequest.rejectReason
                    ) ||
                      getStringValue(
                        selectedRequest.reason
                      )}
                  </p>
                </div>
              )}
            </div>

            {/* FOOTER */}

            <div className="flex shrink-0 justify-end border-t border-gray-100 bg-gray-50/70 px-5 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setSelectedRequest(null)
                }
                className="h-10 rounded-xl"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          DELETE MODAL
      ====================================================== */}

      {showDeleteModal &&
        deleteTarget && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
            onMouseDown={(e) => {
              if (
                e.target ===
                e.currentTarget
              ) {
                closeDeleteModal()
              }
            }}
          >
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_25px_80px_rgba(0,0,0,0.18)]">
              {/* HEADER */}

              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <Trash2 className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-gray-900">
                      Confirm Deletion
                    </h2>

                    <p className="text-xs text-gray-400">
                      This action cannot be undone.
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={
                    closeDeleteModal
                  }
                  disabled={
                    isDeleting
                  }
                  className="h-8 w-8 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* CONTENT */}

              <div className="p-5">
                <p className="text-sm leading-relaxed text-gray-600">
                  Are you sure you want to
                  delete this{" "}
                  <span className="font-semibold text-gray-900">
                    {deleteTarget.type ===
                    "lic"
                      ? "LIC account"
                      : "instructor"}
                  </span>
                  ?
                </p>

                <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3">
                  <p className="text-xs leading-relaxed text-red-700">
                    Deleting this record will
                    permanently remove it from
                    the system.
                  </p>
                </div>
              </div>

              {/* FOOTER */}

              <div className="flex flex-col-reverse gap-2 border-t border-gray-100 bg-gray-50/70 px-5 py-4 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={
                    closeDeleteModal
                  }
                  disabled={
                    isDeleting
                  }
                  className="h-10 rounded-xl"
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  onClick={
                    handleDelete
                  }
                  disabled={
                    isDeleting
                  }
                  className="h-10 rounded-xl bg-red-600 px-5 font-semibold text-white hover:bg-red-700"
                >
                  {isDeleting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}

                  {isDeleting
                    ? "Deleting..."
                    : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}