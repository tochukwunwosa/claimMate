"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Lightbulb } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function NotificationCards() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true)

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("onboarded")
          .eq("id", user.id)
          .single()
        setHasCompletedOnboarding(data?.onboarded)
      }
    }

    checkOnboardingStatus()
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {!hasCompletedOnboarding && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-800">Complete your profile</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Finish setting up your profile to unlock all features.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <Lightbulb className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">New feature: Templates</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Speed up your workflow with our new claim templates.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
