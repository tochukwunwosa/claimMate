"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Loader2, Key } from "lucide-react"

interface AuthTokenLoadingProps {
  message?: string
  redirectUrl?: string
  onComplete?: () => void
  autoRedirect?: boolean
  duration?: number
}

export function AuthTokenLoading({
  message = "Authenticating your session...",
  redirectUrl = "/dashboard",
  onComplete,
  autoRedirect = true,
  duration = 3000,
}: AuthTokenLoadingProps) {
  const [progress, setProgress] = useState(0)
  const [currentMessage, setCurrentMessage] = useState(message)

  useEffect(() => {
    // Start progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 100 / (duration / 100)
      })
    }, 100)

    // Handle completion
    const completionTimer = setTimeout(() => {
      if (onComplete) {
        onComplete()
      }

      if (autoRedirect && redirectUrl) {
        window.location.href = redirectUrl
      }
    }, duration)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(completionTimer)
    }
  }, [duration, onComplete, autoRedirect, redirectUrl])

  // Update the message if provided from parent
  useEffect(() => {
    setCurrentMessage(message)
  }, [message])

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
            className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <Key className="h-10 w-10 text-primary" />
            </motion.div>
          </motion.div>

          <h2 className="text-2xl font-semibold text-primary mb-2">Secure Sign-in</h2>
          <p className="text-foreground mb-6">{currentMessage}</p>

          {/* Progress bar */}
          <div className="w-full h-2 bg-muted rounded-full mb-6 overflow-hidden">
            <motion.div initial={{ width: "0%" }} animate={{ width: `${progress}%` }} className="h-full bg-accent" />
          </div>

          <div className="flex items-center justify-center mb-4">
            <Loader2 className="h-5 w-5 text-primary animate-spin mr-2" />
            <span className="text-sm text-muted-foreground">Processing your authentication</span>
          </div>

          <p className="text-xs text-muted-foreground max-w-xs">
            {`We're securely verifying your access token and preparing your dashboard. You'll be redirected automatically.`}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
