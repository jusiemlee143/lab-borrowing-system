"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Activity,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  Copy,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  Plus,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  X,
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
}

interface Teacher {
  _id: string
  name: string
  email: string
}

type DeleteTarget = {
  id: string
  type: "lic" | "teacher"
}

/* ============================================================
   COMPONENT
============================================================ */

export default function AdminDashboard() {
  const router = useRouter()

  /* ==========================================================
     STATE
  ========================================================== */

  const [step, setStep] = useState<1 | 2>(1)

  const [labAccounts, setLabAccounts] = useState<LIC[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])

  const [isLoadingLICs, setIsLoadingLICs] = useState(true)
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(true)

  const [fullName, setFullName] = useState("")
  const [employeeId, setEmployeeId] = useState("")
  const [department, setDepartment] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [email, setEmail] = useState("")
  const [tempPassword, setTempPassword] = useState("")

  const [instructorName, setInstructorName] = useState("")
  const [instructorEmail, setInstructorEmail] = useState("")

  const [showModal, setShowModal] = useState(false)

  const [deleteTarget, setDeleteTarget] =
    useState<DeleteTarget | null>(null)

  const [isCreatingLIC, setIsCreatingLIC] = useState(false)
  const [isAddingTeacher, setIsAddingTeacher] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

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
          data?.message || "Failed to load LIC accounts."
        )
      }

      setLabAccounts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch LIC accounts:", error)

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
      const res = await fetch("/api/admin/teachers", {
        method: "GET",
        cache: "no-store",
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(
          data?.message || "Failed to load instructors."
        )
      }

      setTeachers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch teachers:", error)

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
     INITIAL LOAD
  ========================================================== */

  useEffect(() => {
    void Promise.all([fetchLICs(), fetchTeachers()])
  }, [fetchLICs, fetchTeachers])

  /* ==========================================================
     PASSWORD GENERATOR
  ========================================================== */

  const generateTempPassword = () => {
    const characters =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789"

    let password = ""

    for (let i = 0; i < 10; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * characters.length)
      )
    }

    return password
  }

  /* ==========================================================
     VALIDATION
  ========================================================== */

  const isValidEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
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
      toast.error("Please complete all required fields.")
      return
    }

    if (contactNumber.length !== 11) {
      toast.error("Contact number must contain 11 digits.")
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
      toast.error("Please enter a valid email address.")
      return
    }

    if (!tempPassword) {
      toast.error("Temporary password is missing.")
      return
    }

    if (isCreatingLIC) return

    setIsCreatingLIC(true)

    try {
      const res = await fetch("/api/admin/create-lic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          employeeId: employeeId.trim(),
          department: department.trim(),
          contactNumber: contactNumber.trim(),
          email: email.trim().toLowerCase(),
          tempPassword,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        toast.error(
          data?.message || "Failed to create LIC account."
        )
        return
      }

      toast.success("LIC account created successfully.")

      await fetchLICs()

      setFullName("")
      setEmployeeId("")
      setDepartment("")
      setContactNumber("")
      setEmail("")
      setTempPassword("")
      setStep(1)
    } catch (error) {
      console.error("Create LIC error:", error)

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
      toast.error("Instructor name is required.")
      return
    }

    if (!instructorEmail.trim()) {
      toast.error("Instructor email is required.")
      return
    }

    if (!isValidEmail(instructorEmail.trim())) {
      toast.error("Please enter a valid instructor email.")
      return
    }

    if (isAddingTeacher) return

    setIsAddingTeacher(true)

    try {
      const res = await fetch("/api/admin/create-teacher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: instructorName.trim(),
          email: instructorEmail.trim().toLowerCase(),
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        toast.error(
          data?.message || "Failed to add instructor."
        )
        return
      }

      toast.success("Instructor added successfully.")

      setInstructorName("")
      setInstructorEmail("")

      await fetchTeachers()
    } catch (error) {
      console.error("Add instructor error:", error)

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

    setShowModal(true)
  }

  const closeDeleteModal = () => {
    if (isDeleting) return

    setShowModal(false)
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

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        toast.error(
          data?.message || "Failed to delete record."
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

      setShowModal(false)
      setDeleteTarget(null)
    } catch (error) {
      console.error("Delete error:", error)

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
      console.error("Logout error:", error)
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
      await navigator.clipboard.writeText(tempPassword)

      toast.success("Temporary password copied.")
    } catch (error) {
      console.error("Copy password error:", error)

      toast.error("Unable to copy password.")
    }
  }

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

        <div className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
            Main Menu
          </p>

          <div className="space-y-1">
            <button
              type="button"
              className="
                flex w-full items-center gap-3
                rounded-xl
                bg-[#800000]/[0.07]
                px-3 py-2.5
                text-sm font-semibold
                text-[#800000]
              "
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </button>

            <button
              type="button"
              className="
                flex w-full items-center gap-3
                rounded-xl
                px-3 py-2.5
                text-sm
                text-gray-500
                transition
                hover:bg-gray-50
                hover:text-[#800000]
              "
            >
              <ClipboardList className="h-4 w-4" />
              Borrowing Records
            </button>

            <button
              type="button"
              className="
                flex w-full items-center gap-3
                rounded-xl
                px-3 py-2.5
                text-sm
                text-gray-500
                transition
                hover:bg-gray-50
                hover:text-[#800000]
              "
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
              className="
                flex w-full items-center gap-3
                rounded-xl
                px-3 py-2.5
                text-sm
                text-gray-500
                transition
                hover:bg-gray-50
                hover:text-[#800000]
              "
            >
              <Users className="h-4 w-4" />
              Users
            </button>

            <button
              type="button"
              className="
                flex w-full items-center gap-3
                rounded-xl
                px-3 py-2.5
                text-sm
                text-gray-500
                transition
                hover:bg-gray-50
                hover:text-[#800000]
              "
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

            {isLoggingOut ? "Signing Out..." : "Sign Out"}
          </Button>
        </div>
      </aside>

      {/* ======================================================
          MAIN AREA
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
              <span>Administration</span>

              <span>/</span>

              <span className="text-[#800000]">
                Dashboard
              </span>
            </div>

            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Admin Dashboard
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

        {/* ====================================================
            CONTENT
        ==================================================== */}

        <div className="flex-1 overflow-auto">
          <div className="mx-auto w-full max-w-[1500px] p-5 sm:p-7 lg:p-8">
            {/* WELCOME */}

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
                Manage laboratory personnel and instructors
                from one centralized workspace.
              </p>
            </div>

            {/* ==================================================
                STATISTICS
            ================================================== */}

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {/* LIC */}

              <Card className="rounded-2xl border-gray-200 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        LIC Accounts
                      </p>

                      <p className="mt-1 text-3xl font-bold text-gray-900">
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

                      <p className="mt-1 text-3xl font-bold text-gray-900">
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

              {/* TOTAL */}

              <Card className="rounded-2xl border-gray-200 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Managed Users
                      </p>

                      <p className="mt-1 text-3xl font-bold text-gray-900">
                        {labAccounts.length +
                          teachers.length}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Personnel records
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Users className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* STATUS */}

              <Card className="rounded-2xl border-gray-200 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        System Status
                      </p>

                      <p className="mt-1 text-xl font-bold text-green-600">
                        Operational
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        All services running
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ==================================================
                MAIN GRID
            ================================================== */}

            <div className="grid min-h-0 grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              {/* =================================================
                  LEFT COLUMN
              ================================================= */}

              <div className="flex min-h-0 flex-col gap-6">
                {/* CREATE LIC */}

                <Card className="rounded-2xl border-gray-200 shadow-sm">
                  <CardHeader className="border-b border-gray-100 pb-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#800000] text-[#FFD700]">
                          <UserPlus className="h-5 w-5" />
                        </div>

                        <div>
                          <CardTitle className="text-base">
                            Create LIC Account
                          </CardTitle>

                          <p className="mt-0.5 text-xs text-gray-400">
                            Add a new laboratory-in-charge
                            account
                          </p>
                        </div>
                      </div>

                      <div className="hidden items-center gap-1.5 sm:flex">
                        <div
                          className={`h-2 w-8 rounded-full ${
                            step === 1
                              ? "bg-[#800000]"
                              : "bg-gray-200"
                          }`}
                        />

                        <div
                          className={`h-2 w-8 rounded-full ${
                            step === 2
                              ? "bg-[#800000]"
                              : "bg-gray-200"
                          }`}
                        />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-5 sm:p-6">
                    {/* STEP 1 */}

                    {step === 1 && (
                      <div className="space-y-5">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            Personal Information
                          </p>

                          <p className="mt-0.5 text-xs text-gray-400">
                            Enter the employee information below.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {/* FULL NAME */}

                          <div className="space-y-1.5 sm:col-span-2">
                            <label
                              htmlFor="lic-full-name"
                              className="text-xs font-semibold text-gray-600"
                            >
                              Full Name
                            </label>

                            <Input
                              id="lic-full-name"
                              value={fullName}
                              onChange={(e) =>
                                setFullName(e.target.value)
                              }
                              placeholder="e.g. Juan Dela Cruz"
                              className="h-11 rounded-xl border-gray-200 bg-gray-50/50"
                            />
                          </div>

                          {/* EMPLOYEE ID */}

                          <div className="space-y-1.5">
                            <label
                              htmlFor="employee-id"
                              className="text-xs font-semibold text-gray-600"
                            >
                              Employee ID
                            </label>

                            <Input
                              id="employee-id"
                              value={employeeId}
                              onChange={(e) =>
                                setEmployeeId(e.target.value)
                              }
                              placeholder="Employee ID"
                              className="h-11 rounded-xl border-gray-200 bg-gray-50/50"
                            />
                          </div>

                          {/* DEPARTMENT */}

                          <div className="space-y-1.5">
                            <label
                              htmlFor="department"
                              className="text-xs font-semibold text-gray-600"
                            >
                              Department
                            </label>

                            <Input
                              id="department"
                              value={department}
                              onChange={(e) =>
                                setDepartment(e.target.value)
                              }
                              placeholder="Department"
                              className="h-11 rounded-xl border-gray-200 bg-gray-50/50"
                            />
                          </div>

                          {/* CONTACT */}

                          <div className="space-y-1.5 sm:col-span-2">
                            <label
                              htmlFor="contact-number"
                              className="text-xs font-semibold text-gray-600"
                            >
                              Contact Number
                            </label>

                            <Input
                              id="contact-number"
                              value={contactNumber}
                              onChange={(e) => {
                                const value =
                                  e.target.value.replace(
                                    /\D/g,
                                    ""
                                  )

                                setContactNumber(
                                  value.slice(0, 11)
                                )
                              }}
                              placeholder="09XXXXXXXXX"
                              inputMode="numeric"
                              maxLength={11}
                              className="h-11 rounded-xl border-gray-200 bg-gray-50/50"
                            />

                            <p className="text-[10px] text-gray-400">
                              {contactNumber.length}/11 digits
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-end pt-1">
                          <Button
                            type="button"
                            onClick={handleNextStep}
                            className="
                              h-11
                              rounded-xl
                              bg-[#800000]
                              px-6
                              font-semibold
                              text-[#FFD700]
                              hover:bg-[#660000]
                            "
                          >
                            Continue

                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* STEP 2 */}

                    {step === 2 && (
                      <div className="space-y-5">
                        <div>
                          <div className="mb-1 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />

                            <p className="text-sm font-semibold text-gray-800">
                              Account Details
                            </p>
                          </div>

                          <p className="text-xs text-gray-400">
                            Complete the login information for{" "}
                            <span className="font-medium text-gray-600">
                              {fullName}
                            </span>
                            .
                          </p>
                        </div>

                        {/* EMAIL */}

                        <div className="space-y-1.5">
                          <label
                            htmlFor="lic-email"
                            className="flex items-center gap-2 text-xs font-semibold text-gray-600"
                          >
                            <Mail className="h-3.5 w-3.5 text-[#800000]" />
                            Email Address
                          </label>

                          <Input
                            id="lic-email"
                            type="email"
                            value={email}
                            onChange={(e) =>
                              setEmail(e.target.value)
                            }
                            placeholder="employee@school.edu"
                            className="h-11 rounded-xl border-gray-200 bg-gray-50/50"
                          />
                        </div>

                        {/* PASSWORD */}

                        <div className="rounded-xl border border-[#FFD700]/40 bg-[#FFD700]/10 p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="text-xs font-bold uppercase tracking-wider text-[#800000]">
                                Temporary Password
                              </p>

                              <p className="mt-1 break-all font-mono text-lg font-bold tracking-wider text-gray-800">
                                {tempPassword}
                              </p>

                              <p className="mt-1 text-[11px] text-gray-500">
                                Give this password to the LIC
                                for their first login.
                              </p>
                            </div>

                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              onClick={copyPassword}
                              className="shrink-0 rounded-lg border-[#800000]/20"
                            >
                              <Copy className="h-4 w-4 text-[#800000]" />
                            </Button>
                          </div>
                        </div>

                        {/* ACTIONS */}

                        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setStep(1)}
                            disabled={isCreatingLIC}
                            className="h-11 rounded-xl"
                          >
                            Back
                          </Button>

                          <Button
                            type="button"
                            onClick={handleCreateAccount}
                            disabled={isCreatingLIC}
                            className="
                              h-11
                              rounded-xl
                              bg-[#800000]
                              px-6
                              font-semibold
                              text-[#FFD700]
                              hover:bg-[#660000]
                            "
                          >
                            {isCreatingLIC
                              ? "Creating..."
                              : "Create LIC Account"}

                            {!isCreatingLIC && (
                              <ArrowRight className="ml-2 h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* =================================================
                    ADD INSTRUCTOR
                ================================================= */}

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
                          Register an instructor for borrower
                          slips.
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-5 sm:p-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {/* NAME */}

                      <div className="space-y-1.5">
                        <label
                          htmlFor="instructor-name"
                          className="text-xs font-semibold text-gray-600"
                        >
                          Instructor Name
                        </label>

                        <Input
                          id="instructor-name"
                          value={instructorName}
                          onChange={(e) =>
                            setInstructorName(e.target.value)
                          }
                          placeholder="Full name"
                          className="h-11 rounded-xl border-gray-200 bg-gray-50/50"
                        />
                      </div>

                      {/* EMAIL */}

                      <div className="space-y-1.5">
                        <label
                          htmlFor="instructor-email"
                          className="text-xs font-semibold text-gray-600"
                        >
                          Email Address
                        </label>

                        <Input
                          id="instructor-email"
                          type="email"
                          value={instructorEmail}
                          onChange={(e) =>
                            setInstructorEmail(e.target.value)
                          }
                          placeholder="instructor@school.edu"
                          className="h-11 rounded-xl border-gray-200 bg-gray-50/50"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button
                        type="button"
                        onClick={handleAddTeacher}
                        disabled={isAddingTeacher}
                        className="
                          h-11
                          w-full
                          rounded-xl
                          bg-[#800000]
                          px-6
                          font-semibold
                          text-[#FFD700]
                          hover:bg-[#660000]
                          sm:w-auto
                        "
                      >
                        <Plus className="mr-2 h-4 w-4" />

                        {isAddingTeacher
                          ? "Adding..."
                          : "Add Instructor"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* =================================================
                  RIGHT COLUMN
              ================================================= */}

              <div className="grid min-h-0 grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-1">
                {/* =================================================
                    LIC ACCOUNTS
                ================================================= */}

                <Card className="flex min-h-[350px] flex-col rounded-2xl border-gray-200 shadow-sm xl:h-[calc(50vh-70px)] xl:min-h-[360px]">
                  <CardHeader className="border-b border-gray-100 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#800000]/10 text-[#800000]">
                          <ShieldCheck className="h-5 w-5" />
                        </div>

                        <div>
                          <CardTitle className="text-sm">
                            LIC Accounts
                          </CardTitle>

                          <p className="text-[11px] text-gray-400">
                            Laboratory-in-Charge users
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full bg-[#800000]/10 px-2.5 py-1 text-xs font-bold text-[#800000]">
                        {labAccounts.length}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="min-h-0 flex-1 overflow-y-auto p-4">
                    {isLoadingLICs ? (
                      <div className="flex h-full min-h-[220px] flex-col items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#800000]" />

                        <p className="mt-3 text-xs text-gray-400">
                          Loading LIC accounts...
                        </p>
                      </div>
                    ) : labAccounts.length === 0 ? (
                      <div className="flex h-full min-h-[220px] flex-col items-center justify-center text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                          <Users className="h-5 w-5" />
                        </div>

                        <p className="text-sm font-semibold text-gray-600">
                          No LIC accounts
                        </p>

                        <p className="mt-1 max-w-[220px] text-xs text-gray-400">
                          Create your first laboratory-in-charge
                          account using the form.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {labAccounts.map((acc) => (
                          <div
                            key={acc._id}
                            className="
                              group
                              rounded-xl
                              border
                              border-gray-100
                              bg-gray-50/60
                              p-3
                              transition
                              hover:border-[#800000]/20
                              hover:bg-[#800000]/[0.025]
                            "
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#800000] text-sm font-bold text-[#FFD700]">
                                {acc.fullName
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-gray-800">
                                  {acc.fullName}
                                </p>

                                <p className="truncate text-xs text-gray-400">
                                  {acc.email}
                                </p>

                                <div className="mt-1 flex flex-wrap gap-1.5">
                                  <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                                    {acc.employeeId}
                                  </span>

                                  <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                                    {acc.department}
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
                                className="
                                  h-8
                                  w-8
                                  shrink-0
                                  rounded-lg
                                  text-gray-400
                                  hover:bg-red-50
                                  hover:text-red-600
                                "
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* =================================================
                    INSTRUCTORS
                ================================================= */}

                <Card className="flex min-h-[350px] flex-col rounded-2xl border-gray-200 shadow-sm xl:h-[calc(50vh-70px)] xl:min-h-[360px]">
                  <CardHeader className="border-b border-gray-100 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD700]/20 text-[#800000]">
                          <GraduationCap className="h-5 w-5" />
                        </div>

                        <div>
                          <CardTitle className="text-sm">
                            Instructors
                          </CardTitle>

                          <p className="text-[11px] text-gray-400">
                            Registered teaching staff
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full bg-[#FFD700]/25 px-2.5 py-1 text-xs font-bold text-[#800000]">
                        {teachers.length}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="min-h-0 flex-1 overflow-y-auto p-4">
                    {isLoadingTeachers ? (
                      <div className="flex h-full min-h-[220px] flex-col items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#800000]" />

                        <p className="mt-3 text-xs text-gray-400">
                          Loading instructors...
                        </p>
                      </div>
                    ) : teachers.length === 0 ? (
                      <div className="flex h-full min-h-[220px] flex-col items-center justify-center text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                          <GraduationCap className="h-5 w-5" />
                        </div>

                        <p className="text-sm font-semibold text-gray-600">
                          No instructors
                        </p>

                        <p className="mt-1 max-w-[220px] text-xs text-gray-400">
                          Add an instructor to make them available
                          on borrower slips.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {teachers.map((teacher) => (
                          <div
                            key={teacher._id}
                            className="
                              group
                              rounded-xl
                              border
                              border-gray-100
                              bg-gray-50/60
                              p-3
                              transition
                              hover:border-[#FFD700]/40
                              hover:bg-[#FFD700]/[0.04]
                            "
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFD700]/25 text-sm font-bold text-[#800000]">
                                {teacher.name
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-gray-800">
                                  {teacher.name}
                                </p>

                                <div className="mt-1 flex items-center gap-1.5">
                                  <Mail className="h-3 w-3 shrink-0 text-gray-400" />

                                  <p className="truncate text-xs text-gray-400">
                                    {teacher.email}
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
                                className="
                                  h-8
                                  w-8
                                  shrink-0
                                  rounded-lg
                                  text-gray-400
                                  hover:bg-red-50
                                  hover:text-red-600
                                "
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ======================================================
          DELETE MODAL
      ====================================================== */}

      {showModal && deleteTarget && (
        <div
          className="
            fixed inset-0 z-[100]
            flex items-center justify-center
            bg-black/30
            p-4
            backdrop-blur-sm
          "
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeDeleteModal()
            }
          }}
        >
          <div
            className="
              w-full
              max-w-md
              overflow-hidden
              rounded-2xl
              border
              border-gray-200
              bg-white
              shadow-[0_25px_80px_rgba(0,0,0,0.18)]
            "
          >
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
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="h-8 w-8 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* CONTENT */}

            <div className="p-5">
              <p className="text-sm leading-relaxed text-gray-600">
                Are you sure you want to delete this{" "}
                <span className="font-semibold text-gray-900">
                  {deleteTarget.type === "lic"
                    ? "LIC account"
                    : "instructor"}
                </span>
                ?
              </p>

              <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3">
                <p className="text-xs leading-relaxed text-red-700">
                  Deleting this record will permanently remove
                  it from the system.
                </p>
              </div>
            </div>

            {/* FOOTER */}

            <div className="flex flex-col-reverse gap-2 border-t border-gray-100 bg-gray-50/70 px-5 py-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="h-10 rounded-xl"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="
                  h-10
                  rounded-xl
                  bg-red-600
                  px-5
                  font-semibold
                  text-white
                  hover:bg-red-700
                "
              >
                <Trash2 className="mr-2 h-4 w-4" />

                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}