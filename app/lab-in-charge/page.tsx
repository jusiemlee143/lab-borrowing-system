"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import LoginForm from "@/components/ui/login"

export default function LoginPage() {
  const router = useRouter()

  const handleExit = () => {
    router.push("/")
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email")
    const password = formData.get("password")

    console.log("Email:", email)
    console.log("Password:", password)

    // TODO: Add authentication logic here

    // Redirect to dashboard
    router.push("/lab-in-charge/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fffaf8]">
      
      {/* HEADER */}
      <header className="w-full h-20 bg-white shadow-md flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <img
            src="https://i.ibb.co/cbTk669/Untitled-design-removebg-preview.png"
            alt="logo"
            className="h-12 w-12 object-contain"
          />
          <h1 className="text-xl font-bold text-[#800000]">
            LIC Login
          </h1>
        </div>

        <Button
          onClick={handleExit}
          variant="outline"
          className="flex items-center gap-2 border-[#800000] text-[#800000] hover:bg-[#800000] hover:text-[#FFD700]"
        >
          <LogOut size={16} />
          Exit
        </Button>
      </header>

      <LoginForm onSubmit={handleSubmit} />
    </div>
  )
}