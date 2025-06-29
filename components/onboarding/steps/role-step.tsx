"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useOnboarding } from "../onboarding-provider"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Briefcase, Users, Shield, HelpCircle } from "lucide-react"
import { RefObject } from "react"
import { buttonVariants } from "../onboarding-flow"

const roles = [
  {
    id: "independent",
    label: "Independent Adjuster",
    icon: Briefcase,
    description: "Work independently with multiple insurance companies",
  },
  {
    id: "staff",
    label: "Staff Adjuster",
    icon: Users,
    description: "Employed directly by an insurance company",
  },
  {
    id: "public",
    label: "Public Adjuster",
    icon: Shield,
    description: "Represent policyholders in claims",
  },
  {
    id: "other",
    label: "Other",
    icon: HelpCircle,
    description: "Other insurance or claims professional",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

interface RoleStepProps {
  nextButtonRef: RefObject<HTMLButtonElement | null>
  backButtonRef: RefObject<HTMLButtonElement | null>
}

export function RoleStep({ nextButtonRef, backButtonRef }: RoleStepProps) {
  const { setCurrentStep, onboardingData, updateOnboardingData, saveProgress } = useOnboarding()
  const [selectedRole, setSelectedRole] = useState(onboardingData.role || "")
  const [error, setError] = useState("")

  const handleNext = async () => {
    if (!selectedRole) {
      setError("Please select a role to continue")
      return
    }

    updateOnboardingData({ role: selectedRole })
    await saveProgress()
    setCurrentStep(4)
  }

  const handleBack = () => {
    setCurrentStep(2)
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-2xl mx-auto space-y-6 md:space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center space-y-2">
        <h2 className="text-xl md:text-2xl font-semibold text-primary">{`What's your role?`}</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Select your primary role to help us customize your experience
        </p>
      </motion.div>

      {/* Role Selection Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4"
      >
        {roles.map((role) => {
          const isSelected = selectedRole === role.id
          return (
            <motion.button
              key={role.id}
              onClick={() => {
                setSelectedRole(role.id)
                setError("")
              }}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className={`relative p-4 md:p-6 text-left rounded-xl border-2 transition-all ${isSelected
                ? "border-primary bg-primary/5"
                : "border-muted hover:border-primary/50"
                }`}
            >
              <div className="flex items-start space-x-3 md:space-x-4">
                <role.icon
                  className={`w-5 h-5 md:w-6 md:h-6 ${isSelected ? "text-primary" : "text-muted-foreground"
                    }`}
                />
                <div className="flex-1">
                  <h3
                    className={`text-sm md:text-base font-medium ${isSelected ? "text-primary" : "text-foreground"
                      }`}
                  >
                    {role.label}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">
                    {role.description}
                  </p>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary absolute top-3 md:top-4 right-3 md:right-4" />
                )}
              </div>
            </motion.button>
          )
        })}
      </motion.div>

      {error && (
        <motion.p
          variants={itemVariants}
          className="text-xs md:text-sm text-red-500 text-center"
        >
          {error}
        </motion.p>
      )}

      {/* Actions */}
      <motion.div
        variants={itemVariants}
        className="flex justify-between items-center pt-4"
      >
        <motion.div
          variants={buttonVariants.back}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Button
            onClick={handleBack}
            ref={backButtonRef}
            variant="outline"
            data-action="back"
            className="h-10 md:h-11 text-sm md:text-base border-primary text-primary hover:bg-primary hover:text-white"
          >
            Back
          </Button>
        </motion.div>

        <motion.div
          variants={buttonVariants.next}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Button
            onClick={handleNext}
            ref={nextButtonRef}
            data-action="next"
            className="h-10 md:h-11 text-sm md:text-base bg-primary text-white hover:bg-primary/90 font-medium px-6 md:px-8"
          >
            Continue
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
