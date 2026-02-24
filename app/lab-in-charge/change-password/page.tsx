"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ id: string; mustChangePassword: boolean } | null>(null);

  // ✅ Load the logged-in LIC user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("licUser");
    if (!storedUser) {
      alert("Please log in first");
      router.push("/lab-in-charge/login");
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, newPassword }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        alert(data.message || "Failed to change password");
        return;
      }

      alert("Password changed successfully!");

      // ✅ Update localStorage user to reset mustChangePassword
      const updatedUser = { ...user, mustChangePassword: false };
      localStorage.setItem("licUser", JSON.stringify(updatedUser));

      router.push("/lab-in-charge/dashboard");
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fffaf8] p-4">
      <h1 className="text-2xl font-bold text-[#800000] mb-6">Change Password</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="password"
          placeholder="New Password"
          className="border p-3 rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="border p-3 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Change Password"}
        </Button>
      </form>
    </div>
  );
}