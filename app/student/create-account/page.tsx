"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function CreateAccountPage() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">

      {/* Back Button */}
      <Button
        variant="outline"
        onClick={() => router.push("/student/login")}
        className="
          fixed
          left-6
          top-6
          border-[#800000]/20
          text-[#800000]
          hover:bg-[#800000]
          hover:text-[#FFD700]
        "
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* Create Account Card */}
      <Card className="w-full max-w-md rounded-2xl shadow-xl">

        <CardContent className="p-8">

          {/* Header */}
          <div className="mb-6 text-center">

            <div className="
              mx-auto
              mb-4
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-[#800000]
              text-[#FFD700]
            ">
              <User className="h-8 w-8" />
            </div>

            <h1 className="text-3xl font-bold text-[#800000]">
              Create Account
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Register your student account
            </p>

          </div>

          {/* Form */}
          <form className="space-y-4">

            {/* Student ID */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Student ID
              </label>

              <Input
                type="text"
                placeholder="Enter your Student ID"
                className="h-11 rounded-xl"
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Full Name
              </label>

              <Input
                type="text"
                placeholder="Enter your full name"
                className="h-11 rounded-xl"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Email Address
              </label>

              <div className="relative">
                <Mail className="
                  absolute
                  left-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-gray-400
                " />

                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="h-11 rounded-xl pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Password
              </label>

              <div className="relative">
                <Lock className="
                  absolute
                  left-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-gray-400
                " />

                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="h-11 rounded-xl pl-10 pr-10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                    hover:text-[#800000]
                  "
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Confirm Password
              </label>

              <div className="relative">
                <Lock className="
                  absolute
                  left-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-gray-400
                " />

                <Input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  className="h-11 rounded-xl pl-10 pr-10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                    hover:text-[#800000]
                  "
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Create Account Button */}
            <Button
              type="submit"
              className="
                mt-2
                h-11
                w-full
                rounded-xl
                bg-[#800000]
                text-base
                font-semibold
                text-[#FFD700]
                hover:bg-[#660000]
              "
            >
              Create Account
            </Button>

          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/student/login")}
              className="font-semibold text-[#800000] hover:underline"
            >
              Sign In
            </button>
          </p>

        </CardContent>
      </Card>
    </div>
  )
}
