"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Zap } from 'lucide-react'
import { toast } from "sonner"
// Import from server actions instead of lib
import { hasFeatureAccess, getSubscriptionStatus } from "@/action/pricing"
import { startFreeTrial } from "@/action/subscription" // Keep this if it exists

interface FeatureGateProps {
  feature: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isStartingTrial, setIsStartingTrial] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    hasSubscription: boolean;
    isTrialing: boolean;
    isActive: boolean;
    isExpired: boolean;
    planName: string | null;
    trialDaysRemaining: number;
  } | null>(null)

  useEffect(() => {
    async function checkAccess() {
      try {
        // Use the server action to check feature access
        const access = await hasFeatureAccess()
        setHasAccess(access)

        // Get subscription status for better UX
        const status = await getSubscriptionStatus()
        setSubscriptionStatus(status)
      } catch (error) {
        console.error("Error checking feature access:", error)
        setHasAccess(false)
      } finally {
        setIsLoading(false)
      }
    }
    checkAccess()
  }, [feature])

  const handleStartTrial = async () => {
    setIsStartingTrial(true)
    try {
      const result = await startFreeTrial()
      if (result.success) {
        toast.success(result.message)
        // Refresh access status
        const access = await hasFeatureAccess()
        setHasAccess(access)
        const status = await getSubscriptionStatus()
        setSubscriptionStatus(status)
      } else {
        toast.error(result.message)
      }
    } catch  {
      toast.error("Failed to start trial")
    } finally {
      setIsStartingTrial(false)
    }
  }

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 rounded h-32"></div>
  }

  if (hasAccess) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  return (
    <Card className="border-dashed border-2 border-gray-300">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Lock className="h-6 w-6 text-gray-400" />
        </div>
        <CardTitle className="text-lg">Premium Feature</CardTitle>
        <CardDescription>
          {subscriptionStatus?.isExpired
            ? "Your trial has expired"
            : "This feature requires a Pro subscription or active trial"}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        {!subscriptionStatus?.hasSubscription ? (
          <Button
            onClick={handleStartTrial}
            disabled={isStartingTrial}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Zap className="h-4 w-4 mr-2" />
            {isStartingTrial ? "Starting Trial..." : "Start 7-Day Free Trial"}
          </Button>
        ) : subscriptionStatus?.isExpired ? (
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Zap className="h-4 w-4 mr-2" />
            Upgrade to Pro
          </Button>
        ) : (
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Zap className="h-4 w-4 mr-2" />
            {subscriptionStatus?.isTrialing
              ? `${subscriptionStatus.trialDaysRemaining} days left in trial`
              : "Manage Subscription"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}