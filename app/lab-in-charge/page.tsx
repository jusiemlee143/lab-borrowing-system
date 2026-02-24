"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoginForm from "@/components/ui/login";

export default function LoginPage() {
  const router = useRouter();

  const handleExit = () => {
    router.push("/");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString().trim();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const res = await fetch("/api/auth/lic-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (!res.ok) {
        alert(data?.message || "Login failed");
        return;
      }

      // 🛡️ safety check
      if (!data) {
        alert("Invalid server response");
        return;
      }

      const user = {
        userId: data.userId,
        fullName: data.fullName,
        email: data.email,
        mustChangePassword: data.mustChangePassword,
      };

      localStorage.setItem("licUser", JSON.stringify(user));

      // ✅ redirect logic
      if (user.mustChangePassword) {
        router.push("/lab-in-charge/change-password");
      } else {
        router.push("/lab-in-charge/dashboard");
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fffaf8]">
      <header className="w-full h-20 bg-white shadow-md flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <img
            src="https://i.ibb.co/cbTk669/Untitled-design-removebg-preview.png"
            alt="logo"
            className="h-12 w-12 object-contain"
          />
          <h1 className="text-xl font-bold text-[#800000]">LIC Login</h1>
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

      {/* ✅ IMPORTANT */}
      <LoginForm onSubmit={handleSubmit} />
    </div>
  );
}