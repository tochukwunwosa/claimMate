"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Loader2, ShieldCheck } from "lucide-react"

// Define quote sets as a tuple of string arrays for strong typing
const quoteSets: [string[], string[], string[]] = [
  [
    "“The best time to prepare for a claim is before you need one.”",
    "“Insurance protects your peace of mind — we help you claim it.”",
    "“Behind every claim is someone’s stress. Let’s ease it.”",
  ],
  [
    "“Relax. We won’t make you fax anything.” 📠",
    "“Claim writing that doesn’t make you want to cry.” 😅",
    "“No more toggling 10 tabs just to write one claim.”",
  ],
  [
    "“65% of agents say documentation slows them down. Not anymore.”",
    "“An average claim takes 45 minutes. ClaimMate can cut that in half.”",
    "“Save hours each week with reusable claim templates.”",
  ],
]

export default function Loading() {
  const [progress, setProgress] = useState<number>(0)
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    // Pick a random set and a random quote from that set
    const randomSet = quoteSets[Math.floor(Math.random() * quoteSets.length)]
    const randomQuote = randomSet[Math.floor(Math.random() * randomSet.length)]
    setMessage(randomQuote)

    // Progress simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 100)

    return () => clearInterval(interval)
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
              animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <ShieldCheck className="h-10 w-10 text-[#203F30]" />
            </motion.div>
          </motion.div>

          <div className="flex flex-col items-center justify-center mb-4">
            <Loader2 className="size-4 text-[#203F30] animate-spin mr-2" />           
            <p className="text-[#1A1A1A] mb-6">{message}</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-[#F4F4F4] rounded-full mb-6 overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-[#9CCA46]"
            />
          </div>

         
        </div>
      </motion.div>
    </div>
  )
}
