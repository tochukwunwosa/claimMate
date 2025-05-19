"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
import AnimatedDots from '@/components/ui/animated-dots'

const quoteSets: [string[], string[], string[]] = [
  [
    "“The best time to prepare for a claim is before you need one.”",
    "“Insurance protects your peace of mind — we help you claim it.”",
    "“Behind every claim is someone’s stress. Let’s ease it.”",
  ],
  [
    "“Relax. We won’t make you fax anything.”",
    "“Claim writing that doesn’t make you want to cry.”",
    "“No more toggling 10 tabs just to write one claim.”",
  ],
  [
    "“65% of agents say documentation slows them down. Not anymore.”",
    "“An average claim takes 45 minutes. ClaimMate can cut that in half.”",
    "“Save hours each week with reusable claim templates.”",
  ],
]

export default function DashboardLoader() {
  const [message, setMessage] = useState("")
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    const randomSet = quoteSets[Math.floor(Math.random() * quoteSets.length)]
    const randomQuote = randomSet[Math.floor(Math.random() * randomSet.length)]
    setMessage(randomQuote)
  }, [])

  useEffect(() => {
    const delayMessage = setTimeout(() => {
      setShowMessage(true)
    }, 10000) // 10 seconds delay before showing the message

    return () => clearTimeout(delayMessage)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-8 max-w-md w-full"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-full flex flex-col items-center justify-center mb-4">

            <Loader2 className="size-4 text-[#203F30] animate-spin mr-2" />
            <AnimatePresence>
              <motion.p
                className="text-[#1A1A1A] mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.6 }}
              >
                {showMessage ?  message :  <AnimatedDots text={'Loading dashboard'}/>}
              </motion.p>             
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
