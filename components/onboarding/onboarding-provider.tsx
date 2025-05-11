"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"

export type OnboardingData = {
  fullName: string
  organization: string
  role: string
  experience: string
  claimTypes: string[]
}

type OnboardingContextType = {
  currentStep: number
  totalSteps: number
  onboardingData: OnboardingData
  setCurrentStep: (step: number) => void
  updateOnboardingData: (data: Partial<OnboardingData>) => void
  saveProgress: () => Promise<void>
  completeOnboarding: () => Promise<void>
  isLoading: boolean
  userName: string
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [userName, setUserName] = useState("")
  const totalSteps = 6

  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    fullName: "",
    organization: "",
    role: "",
    experience: "",
    claimTypes: [],
  })

  const supabase = createClient()

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true)
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", session.user.id)
            .single()

          if (profile) {
            setUserName(profile.full_name || session.user.email?.split("@")[0] || "")
            setOnboardingData({
              fullName: profile.full_name || "",
              organization: profile.organization || "",
              role: profile.role || "",
              experience: profile.experience || "",
              claimTypes: profile.claim_types || [],
            })
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [supabase])

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({ ...prev, ...data }))
  }

  const saveProgress = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        console.error("No active session found")
        return
      }

      const updates = {
        id: session.user.id,
        full_name: onboardingData.fullName,
        organization: onboardingData.organization,
        role: onboardingData.role,
        experience: onboardingData.experience,
        claim_types: onboardingData.claimTypes,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("profiles").upsert(updates)

      if (error) {
        console.error("Database error saving progress:", error)
      } else {
        console.log("Onboarding progress saved successfully")
      }
    } catch (error) {
      console.error("Error saving progress:", error)
    }
  }

  const completeOnboarding = async () => {
    setIsLoading(true)
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        console.error("No active session found")
        return
      }

      const updates = {
        id: session.user.id,
        full_name: onboardingData.fullName,
        organization: onboardingData.organization,
        role: onboardingData.role,
        experience: onboardingData.experience,
        claim_types: onboardingData.claimTypes,
        onboarded: true,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("profiles").upsert(updates)

      if (error) {
        console.error("Database error completing onboarding:", error)
      } else {
        console.log("Onboarding completed successfully")
      }
    } catch (error) {
      console.error("Error completing onboarding:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        totalSteps,
        onboardingData,
        setCurrentStep,
        updateOnboardingData,
        saveProgress,
        completeOnboarding,
        isLoading,
        userName,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}
