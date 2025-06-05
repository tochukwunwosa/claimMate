"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

interface PricingToggleProps {
  isYearly: boolean
  setIsYearly: (value: boolean) => void
}

export function PricingToggle({ isYearly, setIsYearly }: PricingToggleProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="bg-muted p-1 rounded-full flex items-center">
        <button
          onClick={() => setIsYearly(false)}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${!isYearly
              ? "bg-white text-primary shadow-sm"
              : "text-muted-foreground hover:text-primary"
            }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setIsYearly(true)}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isYearly
              ? "bg-white text-primary shadow-sm"
              : "text-muted-foreground hover:text-primary"
            }`}
        >
          Yearly
        </button>
      </div>
      {isYearly && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">
            Save up to 20% with yearly billing
          </Badge>
        </motion.div>
      )}
    </div>
  )
}
