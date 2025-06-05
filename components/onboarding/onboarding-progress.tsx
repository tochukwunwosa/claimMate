"use client"

import { useOnboarding } from "./onboarding-provider"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

const steps = [
  { title: "Welcome", description: "Get started" },
  { title: "Profile", description: "Basic information" },
  { title: "Role", description: "Your position" },
  { title: "Experience", description: "Your expertise" },
  { title: "Claims", description: "Type selection" },
  { title: "Complete", description: "Final setup" },
]

export function OnboardingProgress() {
  const { currentStep, totalSteps } = useOnboarding()
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="space-y-2">
      {/* Progress Text */}
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-primary">
          Step {currentStep} of {totalSteps}
        </p>
        <p className="text-sm text-muted-foreground">
          {Math.round(progress)}% Complete
        </p>
      </div>

      {/* Progress Steps */}
      <div className="relative">
        {/* Background Track */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-muted" />

        {/* Progress Bar */}
        <motion.div
          className="absolute top-5 left-0 h-0.5 bg-primary"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />

        {/* Step Indicators */}
        <div className="relative z-10 flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = currentStep > index + 1
            const isCurrent = currentStep === index + 1

            return (
              <div
                key={step.title}
                className="flex flex-col items-center"
              >
                {/* Step Circle */}
                <motion.div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 ${isCompleted
                    ? "bg-primary border-primary"
                    : isCurrent
                      ? "bg-white border-primary"
                      : "bg-white border-muted"
                    }`}
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.2 : 1,
                    transition: { type: "spring", stiffness: 500, damping: 30 },
                  }}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  ) : (
                    <span
                      className={`text-xs md:text-sm font-medium ${isCurrent ? "text-primary" : "text-muted-foreground"
                        }`}
                    >
                      {index + 1}
                    </span>
                  )}
                </motion.div>

                {/* Step Label - Hidden on Mobile */}
                <div className="mt-2 text-center hidden md:block">
                  <p
                    className={`text-xs font-medium ${isCurrent ? "text-primary" : "text-muted-foreground"
                      }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
