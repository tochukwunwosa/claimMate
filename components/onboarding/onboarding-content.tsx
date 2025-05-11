"use client"

import { createContext, useContext } from "react"

const OnboardingContext = createContext(undefined)

export function useOnboardingContext() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error("useOnboardingContext must be used within an OnboardingProvider")
  }
  return context
}
