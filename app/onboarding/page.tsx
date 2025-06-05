"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import {createClient} from '@/lib/supabase/client'
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow"

export default function OnboardingPage() {
  const supabase = createClient()
  const router = useRouter()

  // Check if user is authenticated and if onboarding is completed
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        // Redirect to login if not authenticated
        router.push("/auth/login")
        return
      }

      // Check if user has completed onboarding
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarded")
        .eq("id", session.user.id)
        .single()

      if (profile?.onboarded) {
        // Redirect to dashboard if onboarding is already completed
        router.push("/dashboard")
      }
    }

    checkAuth()
  }, [router, supabase])

  return (
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <OnboardingFlow />
        </div>
      </div>
  )
}
