"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useOnboarding } from "./onboarding-provider"
import { OnboardingProgress } from "./onboarding-progress"
import { BasicInfoStep } from "./steps/basic-info-step"
import { RoleStep } from "./steps/role-step"
import { ExperienceStep } from "./steps/experience-step"
import { ClaimTypesStep } from "./steps/claim-types-step"
import { FinalStep } from "./steps/final-step"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { WelcomeStep } from "./steps/welcome-step"

// Motion variants with swipe direction
const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
}

const buttonVariants = {
  back: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { x: -20, opacity: 0 }
  },
  next: {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { x: 20, opacity: 0 }
  }
}

export function OnboardingFlow() {
  const { currentStep, isLoading, saveProgress } = useOnboarding()
  const nextButtonRef = useRef<HTMLButtonElement>(null)
  const backButtonRef = useRef<HTMLButtonElement>(null)

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
        return <WelcomeStep nextButtonRef={nextButtonRef} />
      case 2:
        return <BasicInfoStep nextButtonRef={nextButtonRef} />
      case 3:
        return <RoleStep nextButtonRef={nextButtonRef} backButtonRef={backButtonRef} />
      case 4:
        return <ExperienceStep nextButtonRef={nextButtonRef} backButtonRef={backButtonRef} />
      case 5:
        return <ClaimTypesStep nextButtonRef={nextButtonRef} backButtonRef={backButtonRef} />
      case 6:
        return <FinalStep nextButtonRef={nextButtonRef} />
      default:
        return <WelcomeStep nextButtonRef={nextButtonRef} />
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <LoadingSpinner size={8} />
        {/* <p className="text-muted-foreground animate-pulse">
          Loading your profile...
        </p> */}
      </div>
    )
  }

  return (
    <div className="relative bg-white rounded-xl shadow-sm min-h-[calc(100vh-8rem)] md:min-h-0">
      {/* Progress Bar */}
      <div className="sticky top-0 z-10 px-4 md:px-6 py-2 bg-white/95 backdrop-blur-md border-b shadow-sm">
        <OnboardingProgress />
      </div>

      {/* Step Content */}
      <div className="pt-8 pb-8 px-4 md:px-6">
        <AnimatePresence
          mode="wait"
          custom={currentStep}
        >
          <motion.div
            key={currentStep}
            custom={currentStep}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="w-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// Export button variants for use in step components
export { buttonVariants }