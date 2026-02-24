"use client"

import { useState, useEffect } from "react"
import { Mail, MapPin, Phone, Send, LogOut, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"

export default function ContactPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })

  // Simulate page load for spinner (matches base code)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      alert("Message sent successfully! We will get back to you shortly.")
      setIsSubmitting(false)
      setFormData({ name: "", email: "", message: "" })
    }, 1500)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fffaf8]">
        <Spinner className="w-12 h-12 text-[#800000]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fffaf8]">
      {/* HEADER (Matches Base Code) */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 max-w-7xl mx-auto gap-4">
          <div className="flex items-center gap-3">
            <img
              src="https://i.ibb.co/cbTk669/Untitled-design-removebg-preview.png"
              alt="logo"
              className="w-14 h-14 object-contain"
            />
            <h1 className="text-xl font-bold text-[#800000]">Contact Us</h1>
          </div>

          <Button
            onClick={() => router.push("/")} 
            variant="outline"
            className="flex items-center gap-2 border-[#800000] text-[#800000] hover:bg-[#800000] hover:text-[#FFD700]"
          >
            <LogOut size={16} />
            Exit
          </Button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-8">
        
        {/* HERO TITLE */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold text-[#800000]">Get in Touch</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions about borrowing equipment or reporting an issue? We're here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* LEFT: CONTACT FORM (Takes up 2 columns) */}
          <div className="md:col-span-2">
            <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-[#800000]">
                <CardTitle className="text-[#FFD700]">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#800000]">Full Name</label>
                    <Input
                      name="name"
                      placeholder="John Doe"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-white text-[#800000] border-gray-300 focus:ring-[#FFD700]"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#800000]">Email Address</label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="student@university.edu"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-white text-[#800000] border-gray-300 focus:ring-[#FFD700]"
                    />
                  </div>

                  {/* Message Textarea */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#800000]">Message</label>
                    <textarea
                      name="message"
                      placeholder="How can we help you?"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-[#800000] placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    ></textarea>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#800000] text-[#FFD700] hover:bg-[#660000] h-12 text-lg font-semibold"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: CONTACT INFO (Takes up 1 column) */}
          <div className="space-y-6">
            
            {/* Email Card */}
            <Card className="border-l-4 border-[#800000] shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 bg-[#800000] text-[#FFD700] rounded-full">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[#800000]">Email Us</h3>
                  <p className="text-sm text-gray-600 mt-1">support@lab-system.edu</p>
                  <p className="text-xs text-gray-400 mt-1">We reply within 24 hours</p>
                </div>
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card className="border-l-4 border-[#800000] shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 bg-[#800000] text-[#FFD700] rounded-full">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[#800000]">Location</h3>
                  <p className="text-sm text-gray-600 mt-1">Engineering Building,<br/>Room 304, Main Campus</p>
                </div>
              </CardContent>
            </Card>

            {/* Phone Card */}
            <Card className="border-l-4 border-[#800000] shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 bg-[#800000] text-[#FFD700] rounded-full">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[#800000]">Call Us</h3>
                  <p className="text-sm text-gray-600 mt-1">+1 (555) 123-4567</p>
                  <p className="text-xs text-gray-400 mt-1">Mon-Fri, 8am - 5pm</p>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Note */}
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
              <p className="text-xs text-red-600 font-semibold">
                For urgent equipment damage, please contact the Lab-in-Charge immediately.
              </p>
            </div>

          </div>
        </div>

      </main>
    </div>
  )
}