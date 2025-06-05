"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useOnboarding } from "../onboarding-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, User } from "lucide-react"
import { RefObject } from "react"
import { buttonVariants } from "../onboarding-flow"

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

interface BasicInfoStepProps {
  nextButtonRef: RefObject<HTMLButtonElement | null>
}

export function BasicInfoStep({ nextButtonRef }: BasicInfoStepProps) {
  const { setCurrentStep, onboardingData, updateOnboardingData, saveProgress } = useOnboarding()
  const [fullName, setFullName] = useState(onboardingData.fullName || "")
  const [organization, setOrganization] = useState(onboardingData.organization || "")
  const [error, setError] = useState("")

  const handleNext = async () => {
    if (!fullName.trim()) {
      setError("Please enter your full name to continue")
      return
    }

    updateOnboardingData({
      fullName: fullName.trim(),
      organization: organization.trim(),
    })
    await saveProgress()
    setCurrentStep(3)
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-lg mx-auto space-y-6 md:space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center space-y-2">
        <h2 className="text-xl md:text-2xl font-semibold text-primary">Tell us about yourself</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          This information helps us personalize your experience
        </p>
      </motion.div>

      {/* Form */}
      <motion.div variants={itemVariants} className="space-y-4 md:space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value)
                setError("")
              }}
              placeholder="John Doe"
              className={`pl-9 md:pl-10 h-10 md:h-11 text-sm md:text-base ${error ? "border-red-500" : ""}`}
            />
          </div>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>

        {/* Organization */}
        <div className="space-y-2">
          <Label htmlFor="organization" className="text-sm font-medium">
            Organization (Optional)
          </Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
            <Input
              id="organization"
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="Company name"
              className="pl-9 md:pl-10 h-10 md:h-11 text-sm md:text-base"
            />
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div variants={itemVariants} className="flex justify-end pt-4">
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
            className="w-full md:w-auto bg-primary text-white hover:bg-primary/90 font-medium px-6 md:px-8 h-10 md:h-11 text-sm md:text-base"
          >
            Continue
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
