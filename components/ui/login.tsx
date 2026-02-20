"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()

  return (
    <div
      className={cn(
        "fixed inset-0 flex flex-col bg-[#fffaf8]",
        className
      )}
      {...props}
    >
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
          onClick={() => router.push("/")}
          variant="outline"
          className="flex items-center gap-2 border-[#800000] text-[#800000] hover:bg-[#800000] hover:text-[#FFD700]"
        >
          <LogOut size={16} />
          Exit
        </Button>
      </header>

      {/* FORM SECTION */}
      <section className="flex-1 w-full flex items-center justify-center">
        <div className="w-full max-w-md px-6">
          <Card className="w-full">
            <CardContent className="p-8">
              <form className="space-y-6">
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-bold text-[#800000]">
                    Welcome back
                  </h1>
                  <p className="text-gray-500">
                    Login to your LIC account
                  </p>
                </div>

                <FieldGroup className="space-y-4">
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </Field>

                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">
                        Password
                      </FieldLabel>
                      <a
                        href="#"
                        className="ml-auto text-sm text-[#800000] hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input id="password" type="password" required />
                  </Field>

                  <Field>
                    <Button
                      type="submit"
                      className="w-full bg-[#800000] hover:bg-[#660000] text-[#FFD700]"
                    >
                      Login
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}