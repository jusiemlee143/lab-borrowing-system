import React from "react"

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={`animate-spin rounded-full border-4 border-t-[#800000] border-gray-200 w-12 h-12 ${className}`}
    ></div>
  )
}