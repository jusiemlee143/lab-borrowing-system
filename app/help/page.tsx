// File path: app/help/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Search, LogOut, ChevronDown, MessageCircle, BookOpen, Phone, ArrowRight } from "lucide-react"
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

// --- DATA: FAQ Items ---
const faqData = [
  {
    id: 1,
    question: "How do I borrow a laboratory tool?",
    answer: "To borrow a tool, log in to the Student Dashboard, search for the equipment you need, verify its availability, and click the 'Borrower Slip' button. Fill out the form and submit it to the Lab-in-Charge."
  },
  {
    id: 2,
    question: "What should I do if the tool I need is unavailable?",
    answer: "If a tool shows as 'Unavailable', it means all units are currently checked out. Please check back periodically, or contact the Lab-in-Charge directly to inquire about the expected return date."
  },
  {
    id: 3,
    question: "How long can I keep the borrowed equipment?",
    answer: "Standard borrowing period is typically 3 days. Extensions may be granted depending on demand. Please return items on time to avoid penalties."
  },
  {
    id: 4,
    question: "Who do I contact if I accidentally damage equipment?",
    answer: "Report any damage immediately to the Lab-in-Charge. Do not attempt to fix it yourself. Honest reporting helps us maintain safety for all students."
  },
  {
    id: 5,
    question: "Where can I find my borrowing history?",
    answer: "Your active and past borrowing slips can be viewed in the 'My Slip' section of your dashboard."
  }
]

// --- DATA: Quick Help Topics ---
const helpTopics = [
  {
    title: "Borrowing Process",
    icon: BookOpen,
    color: "text-blue-600",
    bg: "bg-blue-50",
    desc: "Step-by-step guide on how to request items."
  },
  {
    title: "Returning Items",
    icon: ArrowRight,
    color: "text-green-600",
    bg: "bg-green-50",
    desc: "Procedures for returning equipment safely."
  },
  {
    title: "Contact Support",
    icon: Phone,
    color: "text-orange-600",
    bg: "bg-orange-50",
    desc: "Get direct help from the Lab-in-Charge."
  }
]

export default function HelpPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [openFaqId, setOpenFaqId] = useState<number | null>(null)

  // Simulate page load for spinner (matches base code)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  // Filter FAQs based on search input
  const filteredFaqs = faqData.filter((item) =>
    item.question.toLowerCase().includes(search.toLowerCase()) ||
    item.answer.toLowerCase().includes(search.toLowerCase())
  )

  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id)
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
            <h1 className="text-xl font-bold text-[#800000]">Help Center</h1>
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
        
        {/* HERO SEARCH CARD */}
        <Card className="bg-[#800000] text-white border-none shadow-xl rounded-2xl relative overflow-hidden">
          {/* Decorative background circle */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full pointer-events-none" />
          
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl md:text-3xl font-bold">How can we help you?</CardTitle>
          </CardHeader>
          <CardContent className="max-w-2xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#800000]" />
              <Input
                placeholder="Search for answers (e.g., 'borrowing', 'late return')..."
                className="pl-10 w-full h-12 text-[#800000] bg-white border-none shadow-sm focus:ring-2 focus:ring-[#FFD700] placeholder:text-[#800000]/70"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* QUICK TOPICS GRID */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {helpTopics.map((topic, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer border-l-4 border-[#800000]"
            >
              <CardContent className="p-6 flex items-start gap-4">
                <div className={`p-3 rounded-lg ${topic.bg} ${topic.color} group-hover:scale-110 transition-transform duration-300`}>
                  <topic.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-[#800000] text-lg">{topic.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{topic.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ SECTION */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="text-[#800000]" />
            <h2 className="text-2xl font-bold text-[#800000]">Frequently Asked Questions</h2>
          </div>

          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <Card key={faq.id} className="overflow-hidden border shadow-sm">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors focus:outline-none"
                >
                  <span className="font-semibold text-lg text-gray-800">{faq.question}</span>
                  <ChevronDown 
                    className={`text-[#800000] transition-transform duration-300 ${openFaqId === faq.id ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                {openFaqId === faq.id && (
                  <div className="px-6 pb-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-100 mt-2">
                    {faq.answer}
                  </div>
                )}
              </Card>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              No results found for "<span className="font-semibold text-[#800000]">{search}</span>"
            </div>
          )}
        </div>

        {/* CONTACT SUPPORT CARD */}
        <Card className="bg-gradient-to-r from-gray-50 to-white border border-[#800000] border-dashed">
          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-[#800000] rounded-full text-[#FFD700] shadow-lg">
                <Phone size={28} fill="currentColor" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#800000]">Still need help?</h3>
                <p className="text-gray-600">Our Lab-in-Charge is available during school hours.</p>
              </div>
            </div>
            <Button 
              onClick={() => router.push("/contact")} 
              className="bg-[#800000] text-[#FFD700] hover:bg-[#660000] px-8 py-6 text-lg shadow-md"
            >
              Contact Support
            </Button>
          </CardContent>
        </Card>

      </main>
    </div>
  )
}