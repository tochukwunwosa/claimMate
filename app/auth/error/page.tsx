// File: /app/auth/error/page.tsx or /auth/error/page.tsx

"use client"

import { Suspense } from "react"
import LoadingSpinner from "@/components/ui/loading-spinner"
import AuthErrorContent from "./auth-error-content"

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><LoadingSpinner /></div>}>
      <AuthErrorContent />
    </Suspense>
  )
}
