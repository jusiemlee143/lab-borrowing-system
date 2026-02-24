"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Toaster, toast } from "sonner"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  

  const handleLogin = async () => {
  setLoading(true);
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(`Welcome, ${data.role.toUpperCase()}!`);

      // Store JWT token
      localStorage.setItem("token", data.token);

      // Redirect based on role
      if (data.role === "admin") router.push("/admin/dashboard");
      else if (data.role === "lic") router.push("/lic/dashboard");
    } else {
      toast.error(data.message || "Invalid credentials");
    }
  } catch (err) {
    console.error(err);
    toast.error("Server error");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffaf8] px-4">
      <Toaster richColors position="top-right" />

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="https://i.ibb.co/cbTk669/Untitled-design-removebg-preview.png"
            alt="Logo"
            className="w-32 h-32 object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-[#800000]">
          Admin Login
        </h1>
        <p className="text-sm text-center text-gray-500">
          Enter your credentials to access the admin dashboard
        </p>

        {/* Login Form */}
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full pr-10"
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <Button
            className="w-full bg-[#800000] text-[#FFD700] hover:bg-[#660000]"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </div>
      </div>
    </div>
  )
}
