"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Loader2, ShieldCheck } from "lucide-react"

export default function Loading() {
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState("Verifying your authentication...")

  // Simulate the token authentication process
  useEffect(() => {
    // Start progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 5
      })
    }, 100)

    // Update messages based on progress
    const messageTimer1 = setTimeout(() => {
      setMessage("Validating your credentials...")
    }, 800)

    const messageTimer2 = setTimeout(() => {
      setMessage("Setting up your session...")
    }, 1600)

    const messageTimer3 = setTimeout(() => {
      setMessage("Redirecting to dashboard...")
    }, 2400)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(messageTimer1)
      clearTimeout(messageTimer2)
      clearTimeout(messageTimer3)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F4F4] px-4">
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
            className="w-20 h-20 bg-[#F4F4F4] rounded-full flex items-center justify-center mb-6"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <ShieldCheck className="h-10 w-10 text-[primary]" />
            </motion.div>
          </motion.div>

          <h2 className="text-2xl font-semibold text-[primary] mb-2">Authenticating</h2>
          <p className="text-foreground mb-6">{message}</p>

          {/* Progress bar */}
          <div className="w-full h-2 bg-[#F4F4F4] rounded-full mb-6 overflow-hidden">
            <motion.div initial={{ width: "0%" }} animate={{ width: `${progress}%` }} className="h-full bg-accent" />
          </div>

          <div className="flex items-center justify-center mb-4">
            <Loader2 className="h-5 w-5 text-[primary] animate-spin mr-2" />
            <span className="text-sm text-[#666666]">Please wait while we secure your session</span>
          </div>

          <p className="text-xs text-[#666666] max-w-xs">
            {` We're validating your authentication token and preparing your dashboard. You'll be redirected automatically.`}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
