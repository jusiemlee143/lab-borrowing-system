"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface LoginFormProps {
  className?: string
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
}

export default function LoginForm({
  className,
  onSubmit,
}: LoginFormProps) {
  return (
    <section className={`flex-1 w-full flex items-center justify-center ${className ?? ""}`}>
      <div className="w-full max-w-md px-6">
        <Card className="w-full">
          <CardContent className="p-8">
            <form className="space-y-6" onSubmit={onSubmit}>
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
                  <Input id="email" name="email" type="email" required />
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input id="password" name="password" type="password" required />
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
  )
}