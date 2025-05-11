import type { ReactNode } from "react"
import { OnboardingProvider } from "@/components/onboarding/onboarding-provider"

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <OnboardingProvider>{children}</OnboardingProvider>
    </div>
  )
}
