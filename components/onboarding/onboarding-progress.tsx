"use client"

import { useOnboarding } from "./onboarding-provider"

export function OnboardingProgress() {
  const { currentStep, totalSteps } = useOnboarding()
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-[#203F30]">
          Step {currentStep} of {totalSteps}
        </p>
        <p className="text-sm text-[#666666]">{Math.round(progress)}% Complete</p>
      </div>

      <div className="w-full h-2 bg-[#F4F4F4] rounded-full overflow-hidden">
        <div className="h-full bg-[#9CCA46] transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
