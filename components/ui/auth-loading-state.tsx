"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

interface AuthLoadingStateProps {
  title?: string
  message?: string
  icon?: React.ReactNode
  className?: string
}

export function AuthLoadingState({
  title = "Loading",
  message = "Please wait...",
  icon,
  className = "",
}: AuthLoadingStateProps) {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-[#F4F4F4] ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center"
      >
        {icon || <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />}
        <h2 className="text-xl font-semibold text-primary">{title}</h2>
        <p className="text-foreground mt-2">{message}</p>
      </motion.div>
    </div>
  )
}
