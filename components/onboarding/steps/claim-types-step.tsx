"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useOnboarding } from "../onboarding-provider"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const claimTypes = [
  { id: "property", label: "Property" },
  { id: "auto", label: "Auto" },
  { id: "casualty", label: "Casualty" },
  { id: "cat", label: "CAT" },
  { id: "other", label: "Other" },
]

export function ClaimTypesStep() {
  const { setCurrentStep, onboardingData, updateOnboardingData, saveProgress } = useOnboarding()
  const [selectedTypes, setSelectedTypes] = useState<string[]>(onboardingData.claimTypes || [])
  const [error, setError] = useState("")

  const handleTypeChange = (typeId: string, checked: boolean) => {
    setSelectedTypes((prev) => {
      if (checked) {
        return [...prev, typeId]
      } else {
        return prev.filter((id) => id !== typeId)
      }
    })
    setError("")
  }

  const handleNext = async () => {
    if (selectedTypes.length === 0) {
      setError("Please select at least one claim type to continue")
      return
    }

    updateOnboardingData({ claimTypes: selectedTypes })
    await saveProgress()
    setCurrentStep(6)
  }

  const handleBack = () => {
    setCurrentStep(4)
  }

  return (
    <div className="space-y-8 py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-[#203F30] mb-2">What types of claims do you handle?</h2>
        <p className="text-[#1A1A1A]">{`Select all that apply. We'll customize your templates accordingly.`}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-lg mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {claimTypes.map((type) => (
            <div key={type.id} className="flex items-center space-x-3">
              <Checkbox
                id={type.id}
                checked={selectedTypes.includes(type.id)}
                onCheckedChange={(checked) => handleTypeChange(type.id, checked === true)}
              />
              <Label htmlFor={type.id} className="text-[#1A1A1A] font-medium cursor-pointer">
                {type.label}
              </Label>
            </div>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
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
