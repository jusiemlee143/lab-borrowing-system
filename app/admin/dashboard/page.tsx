"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Toaster, toast } from "sonner"
import { Camera, Copy } from "lucide-react"
import Image from "next/image"

export default function AdminDashboard() {
  const [step, setStep] = useState<1 | 2 | 3>(1)

  // Step 1: Personal Info
  const [fullName, setFullName] = useState("")
  const [employeeId, setEmployeeId] = useState("")
  const [department, setDepartment] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [profilePic, setProfilePic] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  // Step 2: Account Info (Temp password)
  const [email, setEmail] = useState("")
  const [tempPassword, setTempPassword] = useState("")

  const [labAccounts, setLabAccounts] = useState<any[]>([])

  // Generate temporary password
  const generateTempPassword = (length = 10) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%"
    return Array.from({ length }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("")
  }

  // Handle next step: validate personal info
  const handleNextStep = () => {
    if (!fullName || !employeeId || !department || !contactNumber) {
      toast.error("Please fill in all personal information fields")
      return
    }
    setStep(2)
    setTempPassword(generateTempPassword()) // Generate temp password for step 2
  }

  // Handle next step: validate account info
  const handleNextToConfirm = () => {
    if (!email) {
      toast.error("Please enter an email")
      return
    }
    if (labAccounts.some(acc => acc.email === email)) {
      toast.error("Email already exists")
      return
    }
    setStep(3)
  }

  // Handle account creation
  const handleCreateAccount = () => {
    const newAccount = {
      fullName,
      employeeId,
      department,
      contactNumber,
      email,
      password: tempPassword,
      profilePic,
      preview,
    }

    setLabAccounts([...labAccounts, newAccount])
    toast.success(`Lab-in-Charge account created for ${fullName}`)

    // Reset all fields
    setFullName("")
    setEmployeeId("")
    setDepartment("")
    setContactNumber("")
    setProfilePic(null)
    setPreview(null)
    setEmail("")
    setTempPassword("")
    setStep(1)
  }

  const handleProfilePic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setProfilePic(file)
    setPreview(URL.createObjectURL(file))
  }

  return (
    <div className="min-h-screen bg-[#fffaf8] p-6 flex flex-col items-center">
      <Toaster richColors position="top-right" />

      {/* Logo */}
      <div className="flex justify-center mb-4">
        <Image
          src="https://i.ibb.co/cbTk669/Untitled-design-removebg-preview.png"
          alt="Logo"
          width={100}
          height={100}
          className="object-contain"
        />
      </div>

      <h1 className="text-3xl font-bold text-[#800000] mb-6 text-center">
        Admin Dashboard
      </h1>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl">
        {/* Form Card */}
        <Card className="w-full md:w-1/2 rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {step === 1
                ? "Step 1: Personal Information"
                : step === 2
                ? "Step 2: Account Credentials"
                : "Step 3: Confirm & Create"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {step === 1 && (
              <div className="space-y-3">
                <div className="flex flex-col items-center gap-2">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile Preview"
                      className="w-24 h-24 rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300 text-gray-400">
                      <Camera size={24} />
                    </div>
                  )}
                  <label className="cursor-pointer bg-[#800000] text-[#FFD700] px-3 py-1 rounded-md flex items-center gap-2 hover:bg-[#660000]">
                    <Camera size={16} />
                    <span className="text-sm">Add Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePic}
                    />
                  </label>
                </div>
                <Input
                  placeholder="Full Name"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                />
                <Input
                  placeholder="Employee ID"
                  value={employeeId}
                  onChange={e => setEmployeeId(e.target.value)}
                />
                <Input
                  placeholder="Department / Section"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                />
                <Input
                  placeholder="Contact Number"
                  value={contactNumber}
                  onChange={e =>
                    setContactNumber(e.target.value.replace(/\D/g, "").slice(0, 11))
                  }
                />
                <Button
                  className="bg-[#800000] text-[#FFD700] w-full hover:bg-[#660000]"
                  onClick={handleNextStep}
                >
                  Next
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <Input
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <div className="bg-gray-100 p-2 rounded-md flex justify-between items-center text-sm text-gray-700">
                  Temporary Password: <span className="font-mono">{tempPassword}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(tempPassword)
                      toast.success("Temporary password copied!")
                    }}
                  >
                    <Copy size={16} />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="bg-gray-400 text-white w-full hover:bg-gray-500"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    className="bg-[#800000] text-[#FFD700] w-full hover:bg-[#660000]"
                    onClick={handleNextToConfirm}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <h2 className="font-semibold text-gray-700">Confirm Details:</h2>
                <div className="space-y-1">
                  <p>
                    <span className="font-semibold">Full Name:</span> {fullName}
                  </p>
                  <p>
                    <span className="font-semibold">Employee ID:</span> {employeeId}
                  </p>
                  <p>
                    <span className="font-semibold">Department:</span> {department}
                  </p>
                  <p>
                    <span className="font-semibold">Contact:</span> {contactNumber}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span> {email}
                  </p>
                  <p>
                    <span className="font-semibold">Temporary Password:</span> {tempPassword}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="bg-gray-400 text-white w-full hover:bg-gray-500"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </Button>
                  <Button
                    className="bg-[#800000] text-[#FFD700] w-full hover:bg-[#660000]"
                    onClick={handleCreateAccount}
                  >
                    Create Account
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Existing Accounts */}
        <Card className="w-full md:w-1/2 rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Existing Lab-in-Charge Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
            {labAccounts.length === 0 ? (
              <p className="text-gray-500 text-sm">No Lab-in-Charge accounts yet.</p>
            ) : (
              <ul className="space-y-2">
                {labAccounts.map((acc, idx) => (
                  <li
                    key={idx}
                    className="flex flex-col p-3 bg-[#fffaf8] border rounded-lg shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      {acc.preview ? (
                        <img
                          src={acc.preview}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                          <Camera size={16} />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-semibold">{acc.fullName}</span>
                        <span className="text-sm text-gray-600">{acc.email} | {acc.department}</span>
                        <span className="text-sm text-gray-500">
                          ID: {acc.employeeId} | Contact: {acc.contactNumber}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
