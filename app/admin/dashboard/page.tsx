"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Toaster, toast } from "sonner"
import { Copy, LogOut, Trash2, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

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

export default function AdminDashboard() {
  const router = useRouter()

  const [step, setStep] = useState<1 | 2>(1)
  const [labAccounts, setLabAccounts] = useState<LIC[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])

  const [fullName, setFullName] = useState("")
  const [employeeId, setEmployeeId] = useState("")
  const [department, setDepartment] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [email, setEmail] = useState("")
  const [tempPassword, setTempPassword] = useState("")

  const [instructorName, setInstructorName] = useState("")
  const [instructorEmail, setInstructorEmail] = useState("")

  // MODAL STATE
  const [showModal, setShowModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string
    type: "lic" | "teacher"
  } | null>(null)

  useEffect(() => {
    fetchLICs()
    fetchTeachers()
  }, [])

  const fetchLICs = async () => {
    const res = await fetch("/api/admin/lics")
    const data = await res.json()
    if (res.ok) setLabAccounts(data)
  }

  const fetchTeachers = async () => {
    const res = await fetch("/api/admin/teachers")
    const data = await res.json()
    if (res.ok) setTeachers(data)
  }

  const generateTempPassword = () =>
    Math.random().toString(36).slice(-10)

  const handleNextStep = () => {
    if (!fullName || !employeeId || !department || !contactNumber) {
      toast.error("Fill all fields")
      return
    }
    setTempPassword(generateTempPassword())
    setStep(2)
  }

  const handleCreateAccount = async () => {
    if (!email) return toast.error("Email required")

    const res = await fetch("/api/admin/create-lic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        employeeId,
        department,
        contactNumber,
        email,
        tempPassword,
      }),
    })

    if (res.ok) {
      toast.success("LIC created")
      fetchLICs()
      setFullName("")
      setEmployeeId("")
      setDepartment("")
      setContactNumber("")
      setEmail("")
      setTempPassword("")
      setStep(1)
    }
  }

  const handleAddTeacher = async () => {
    if (!instructorName || !instructorEmail) {
      toast.error("Enter name and email")
      return
    }

    const res = await fetch("/api/admin/create-teacher", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: instructorName,
        email: instructorEmail,
      }),
    })

    if (res.ok) {
      toast.success("Instructor added")
      setInstructorName("")
      setInstructorEmail("")
      fetchTeachers()
    }
  }

  const openDeleteModal = (id: string, type: "lic" | "teacher") => {
    setDeleteTarget({ id, type })
    setShowModal(true)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    const url =
      deleteTarget.type === "lic"
        ? `/api/admin/delete-lic/${deleteTarget.id}`
        : `/api/admin/delete-teacher/${deleteTarget.id}`

    const res = await fetch(url, { method: "DELETE" })

    if (res.ok) {
      toast.success("Deleted successfully")
      deleteTarget.type === "lic" ? fetchLICs() : fetchTeachers()
      setShowModal(false)
      setDeleteTarget(null)
    } else {
      toast.error("Delete failed")
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/admin")
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-100 p-6">
      <Toaster />

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Image
            src="https://i.ibb.co/cbTk669/Untitled-design-removebg-preview.png"
            alt="Logo"
            width={70}
            height={70}
          />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        <Button className="bg-red-600 text-white" onClick={handleLogout}>
          <LogOut size={18} />
        </Button>
      </div>

      {/* MAIN */}
      <div className="flex gap-6 h-[calc(100%-100px)]">
        {/* LEFT */}
        <Card className="w-2/3 flex flex-col">
          <CardHeader>
            <CardTitle>Create LIC & Instructor</CardTitle>
          </CardHeader>

          <CardContent className="flex-1 overflow-auto space-y-6">
            {/* LIC */}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} />
                <Input placeholder="Employee ID" value={employeeId} onChange={e => setEmployeeId(e.target.value)} />
                <Input placeholder="Department" value={department} onChange={e => setDepartment(e.target.value)} />
                <Input placeholder="Contact" value={contactNumber} onChange={e => setContactNumber(e.target.value)} />

                <Button className="col-span-2 bg-red-600" onClick={handleNextStep}>
                  Next
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />

                <div className="flex justify-between bg-gray-200 p-2 rounded">
                  {tempPassword}
                  <Button size="sm" onClick={() => navigator.clipboard.writeText(tempPassword)}>
                    <Copy size={14} />
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setStep(1)}>Back</Button>
                  <Button className="bg-red-600" onClick={handleCreateAccount}>Create</Button>
                </div>
              </div>
            )}

            {/* TEACHER */}
            <div>
              <h2 className="font-semibold mb-2">Add Instructor</h2>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Name" value={instructorName} onChange={e => setInstructorName(e.target.value)} />
                <Input placeholder="Email" value={instructorEmail} onChange={e => setInstructorEmail(e.target.value)} />

                <Button className="col-span-2 bg-red-600" onClick={handleAddTeacher}>
                  Add Instructor
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT */}
        <div className="w-1/3 flex flex-col gap-4">
          {/* LIC LIST */}
          <Card className="flex flex-col h-1/2">
            <CardHeader>
              <CardTitle>LIC Accounts</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 overflow-auto space-y-2">
              {labAccounts.map(acc => (
                <div key={acc._id} className="flex justify-between border p-2 rounded">
                  <div>
                    <p className="font-semibold">{acc.fullName}</p>
                    <p className="text-sm">{acc.email}</p>
                  </div>
                  <Button size="sm" variant="destructive" onClick={() => openDeleteModal(acc._id, "lic")}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* TEACHERS */}
          <Card className="flex flex-col h-1/2">
            <CardHeader>
              <CardTitle>Teachers</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 overflow-auto space-y-2">
              {teachers.map(t => (
                <div key={t._id} className="flex justify-between border p-2 rounded">
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm">{t.email}</p>
                  </div>
                  <Button size="sm" variant="destructive" onClick={() => openDeleteModal(t._id, "teacher")}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* MODAL */}
      {showModal && deleteTarget && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 space-y-4 shadow-lg">
            <div className="flex justify-between">
              <h2 className="font-semibold">Confirm Delete</h2>
              <X className="cursor-pointer" onClick={() => setShowModal(false)} />
            </div>

            <p>Are you sure you want to delete this?</p>

            <div className="flex justify-end gap-2">
              <Button onClick={() => setShowModal(false)}>Cancel</Button>
              <Button className="bg-red-600 text-white" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}