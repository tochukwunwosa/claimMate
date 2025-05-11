"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useOnboarding } from "../onboarding-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function BasicInfoStep() {
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
    <div className="space-y-8 py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-[#203F30] mb-2">{`Let's get to know you`}</h2>
        <p className="text-[#1A1A1A]">{`We'll use this information to personalize your ClaimMate experience.`}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-lg mx-auto space-y-6"
      >
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-[#1A1A1A]">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value)
              setError("")
            }}
            placeholder="Enter your full name"
            className="border-[#E2E8F0] focus:border-[#9CCA46] focus:ring-[#9CCA46]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="organization" className="text-[#1A1A1A]">
            Organization
          </Label>
          <Input
            id="organization"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder="Enter your company or organization (optional)"
            className="border-[#E2E8F0] focus:border-[#9CCA46] focus:ring-[#9CCA46]"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end"
      >
        <Button onClick={handleNext} className="bg-[#203F30] text-white hover:bg-[#1A1A1A]">
          Continue
        </Button>
      </motion.div>
    </div>
  )
}
