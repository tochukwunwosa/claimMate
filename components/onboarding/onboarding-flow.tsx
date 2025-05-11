"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useOnboarding } from "./onboarding-provider"
import { OnboardingProgress } from "./onboarding-progress"
import { BasicInfoStep } from "./steps/basic-info-step"
import { RoleStep } from "./steps/role-step"
import { ExperienceStep } from "./steps/experience-step"
import { ClaimTypesStep } from "./steps/claim-types-step"
import { FinalStep } from "./steps/final-step"
import  LoadingSpinner  from "@/components/ui/loading-spinner"
import { WelcomeStep } from "./steps/welcome-step"

export function OnboardingFlow() {
  const { currentStep, isLoading, saveProgress } = useOnboarding()

  // Auto-save when step changes
  useEffect(() => {
    const saveData = async () => {
      if (currentStep > 1) {
        await saveProgress()
      }
    }

    saveData()
  }, [currentStep, saveProgress])

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep /> 
      case 2:
        return <BasicInfoStep />
      case 3:
        return <RoleStep />
      case 4:
        return <ExperienceStep />
      case 5:
        return <ClaimTypesStep />
      case 6:
        return <FinalStep />
      default:
        return <WelcomeStep />
    }
  }
  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size={8} text="Loading your profile..." />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
      <OnboardingProgress />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mt-8"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
