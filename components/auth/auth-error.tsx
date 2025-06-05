"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AuthErrorProps {
  title?: string
  message?: string
  redirectUrl?: string
  redirectLabel?: string
}

export default function AuthError({
  title = "Authentication Error",
  message = "We encountered an issue while processing your authentication. Please try again.",
  redirectUrl = "/auth/login",
  redirectLabel = "Back to Login",
}: AuthErrorProps) {
  // Log the error for debugging purposes
  useEffect(() => {
    console.error("Auth error:", { title, message })
  }, [title, message])

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full"
      >
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6"
          >
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </motion.div>

          <h2 className="text-2xl font-semibold text-primary mb-2">{title}</h2>
          <p className="text-foreground mb-8">{message}</p>

          <Link href={redirectUrl}>
            <Button className="bg-primary text-white hover:bg-foreground">{redirectLabel}</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
