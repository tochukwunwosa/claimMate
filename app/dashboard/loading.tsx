"use client"

import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center">
        <Loader2 className="size-8 text-[#203F30] animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-[#203F30]">Loading Dashboard</h2>
        <p className="text-[#1A1A1A] mt-2">Please wait while we prepare your dashboard...</p>
      </div>
    </div>
  )
}
