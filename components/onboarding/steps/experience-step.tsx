"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useOnboarding } from "../onboarding-provider"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

type ExperienceLevel = {
  id: string;
  label: string
}

const experienceLevels: ExperienceLevel[] = [
  { id: "less-than-1", label: "< 1 year" },
  { id: "1-3", label: "1–3 years" },
  { id: "3-5", label: "3–5 years" },
  { id: "5-plus", label: "5+ years" },
]

export function ExperienceStep() {
  const { setCurrentStep, onboardingData, updateOnboardingData, saveProgress } = useOnboarding()
  const [selectedExperience, setSelectedExperience] = useState(onboardingData.experience || "")
  const [error, setError] = useState("")

  const handleNext = async () => {
    if (!selectedExperience) {
      setError("Please select your experience level to continue")
      return
    }

    updateOnboardingData({ experience: selectedExperience })
    await saveProgress()
    setCurrentStep(5)
  }

  const handleBack = () => {
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
        <h2 className="text-2xl font-bold text-[#203F30] mb-2">How many years have you worked in claims?</h2>
        <p className="text-[#1A1A1A]">{`We'll adjust our tools based on your experience level.`}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-lg mx-auto"
      >
        <RadioGroup
          value={selectedExperience}
          onValueChange={(value) => {
            setSelectedExperience(value)
            setError("")
          }}
          className="flex flex-col space-y-3"
        >
          {experienceLevels.map((level) => (
            <div key={level.id} className="flex items-center space-x-3">
              <RadioGroupItem value={level.id} id={level.id} />
              <Label htmlFor={level.id} className="text-[#1A1A1A] font-medium cursor-pointer">
                {level.label}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-between"
      >
        <Button onClick={handleBack} variant="outline" className="border-[#203F30] text-[#203F30]">
          Back
        </Button>

        <Button onClick={handleNext} className="bg-[#203F30] text-white hover:bg-[#1A1A1A]">
          Continue
        </Button>
      </motion.div>
    </div>
  )
}
