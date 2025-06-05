"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Clock, Zap, CreditCard } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { getSubscriptionStatus } from "@/action/pricing"
import { upgradeToPaid } from "@/action/subscription"
import { toast } from "sonner"

export function TrialBanner() {
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    hasSubscription: boolean
    isTrialing: boolean
    isActive: boolean
    isExpired: boolean
    planName: string | null
    trialDaysRemaining: number
  } | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [isUpgrading, setIsUpgrading] = useState(false)

  useEffect(() => {
    async function fetchSubscriptionStatus() {
      try {
        const status = await getSubscriptionStatus()
        setSubscriptionStatus(status)
      } catch (error) {
        console.error("Failed to fetch subscription status:", error)
      }
    }

    fetchSubscriptionStatus()
  }, [])

  const handleUpgrade = async () => {
    if (!subscriptionStatus?.planName) return

    setIsUpgrading(true)
    try {
      const result = await upgradeToPaid(subscriptionStatus.planName)
      if (result.success) {
        toast.success(result.message)
        // Refresh subscription status
        const newStatus = await getSubscriptionStatus()
        setSubscriptionStatus(newStatus)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Failed to upgrade subscription")
    } finally {
      setIsUpgrading(false)
    }
  }

  // Don't show banner if user doesn't have a subscription or is not trialing
  if (!subscriptionStatus?.isTrialing || !isVisible) {
    return null
  }

  const { trialDaysRemaining, planName } = subscriptionStatus

  // Determine urgency level and styling
  const getUrgencyLevel = (days: number) => {
    if (days <= 1) return "critical"
    if (days <= 2) return "urgent"
    if (days <= 4) return "warning"
    return "info"
  }

  const urgency = getUrgencyLevel(trialDaysRemaining)

  const urgencyConfig = {
    critical: {
      bgColor: "bg-red-50 border-red-200",
      textColor: "text-red-800",
      badgeColor: "bg-red-100 text-red-800",
      buttonColor: "bg-red-600 hover:bg-red-700",
      icon: Clock,
      message: "Your trial expires today!",
    },
    urgent: {
      bgColor: "bg-orange-50 border-orange-200",
      textColor: "text-orange-800",
      badgeColor: "bg-orange-100 text-orange-800",
      buttonColor: "bg-orange-600 hover:bg-orange-700",
      icon: Clock,
      message: `Only ${trialDaysRemaining} day${trialDaysRemaining === 1 ? "" : "s"} left in your trial`,
    },
    warning: {
      bgColor: "bg-yellow-50 border-yellow-200",
      textColor: "text-yellow-800",
      badgeColor: "bg-yellow-100 text-yellow-800",
      buttonColor: "bg-yellow-600 hover:bg-yellow-700",
      icon: Zap,
      message: `${trialDaysRemaining} days left in your trial`,
    },
    info: {
      bgColor: "bg-blue-50 border-blue-200",
      textColor: "text-blue-800",
      badgeColor: "bg-blue-100 text-blue-800",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      icon: Zap,
      message: `${trialDaysRemaining} days left in your trial`,
    },
  }

  const config = urgencyConfig[urgency]
  const IconComponent = config.icon

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <Card className={cn("border-l-4 shadow-sm", config.bgColor)}>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-full", config.badgeColor)}>
                <IconComponent className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className={cn("font-medium text-sm", config.textColor)}>{config.message}</p>
                  <Badge variant="outline" className={cn("text-xs", config.badgeColor)}>
                    {planName} Trial
                  </Badge>
                </div>
                <p className="text-xs text-gray-600">
                  Upgrade now to continue enjoying unlimited access to all features
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className={cn("text-white text-xs", config.buttonColor)}
                onClick={handleUpgrade}
                disabled={isUpgrading}
              >
                {isUpgrading ? (
                  "Upgrading..."
                ) : (
                  <>
                    <CreditCard className="w-3 h-3 mr-1" />
                    Upgrade Now
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
