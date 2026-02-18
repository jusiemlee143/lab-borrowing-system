"use client"

import Image from "next/image"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fffaf8] flex">
      {/* ✅ DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 bg-[#800000] text-[#FFD700] flex-col fixed h-full shadow-xl">
        <LogoSection />
        <SidebarMenu />
      </aside>

      {/* ✅ MOBILE SIDEBAR (SHADCN SHEET) */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" className="bg-[#800000]">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 bg-[#800000] text-[#FFD700]">
            <LogoSection />
            <SidebarMenu />
          </SheetContent>
        </Sheet>
      </div>

      {/* ✅ MAIN CONTENT */}
      <main className="flex-1 md:ml-64 p-6 md:p-10 w-full">
        {/* HERO */}
        <section className="text-center bg-white rounded-2xl shadow-lg p-8 md:p-12 border">
          <Badge className="mb-4 bg-[#FFD700] text-[#800000]">
            Lab Management
          </Badge>

          <h1 className="text-3xl md:text-4xl font-bold text-[#800000] mb-4">
            Lab Borrowing System
          </h1>

          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Manage student and lab-in-charge accounts, track borrowed items,
            and streamline laboratory operations efficiently.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/student">
            <Button className="bg-[#800000] hover:bg-[#660000] w-full sm:w-auto">
            Student
            </Button>
            </Link>

            <Button
              variant="outline"
              className="border-[#800000] text-[#800000]"
            >
              Lab-in-Charge
            </Button>
          </div>
        </section>

        <Separator className="my-10" />

        {/* FEATURES */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="Help"
            desc="Access guides and FAQs to navigate the system smoothly."
          />
          <FeatureCard
            title="Rate Us"
            desc="Provide feedback about the lab borrowing system."
          />
          <FeatureCard
            title="Contact"
            desc="Reach out for support or inquiries anytime."
          />
        </section>
      </main>
    </div>
  )
}

/* ================= COMPONENTS ================= */

function LogoSection() {
  return (
    <div className="flex items-center justify-center h-28 border-b border-[#FFD700] bg-white">
      <Image
        src="https://i.ibb.co/cbTk669/Untitled-design-removebg-preview.png"
        alt="Logo"
        width={90}
        height={70}
        className="object-contain"
      />
    </div>
  )
}

function SidebarMenu() {
  const menu = [
    { name: "Student", href: "#" },
    { name: "Lab-in-Charge", href: "#" },
    { name: "Help", href: "#" },
    { name: "Rate Us", href: "#" },
    { name: "About", href: "#" },
    { name: "Contact", href: "#" },
  ]

  return (
    <nav className="flex-1 flex flex-col mt-6 px-3 gap-1">
      {menu.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className="px-4 py-2 rounded-lg font-medium hover:bg-[#FFD700] hover:text-[#800000] transition"
        >
          {item.name}
        </Link>
      ))}
    </nav>
  )
}

function FeatureCard({
  title,
  desc,
}: {
  title: string
  desc: string
}) {
  return (
    <Card className="rounded-2xl border shadow-sm hover:shadow-xl transition duration-300">
      <CardContent className="p-6 text-center">
        <h3 className="font-bold text-[#800000] text-lg mb-2">
          {title}
        </h3>
        <p className="text-gray-600 text-sm">{desc}</p>
      </CardContent>
    </Card>
  )
}
