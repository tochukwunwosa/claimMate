"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useOnboarding } from "../onboarding-provider"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle2 } from "lucide-react"

const roles = [
  { id: "independent", label: "Independent Adjuster" },
  { id: "staff", label: "Staff Adjuster" },
  { id: "public", label: "Public Adjuster" },
  { id: "other", label: "Other" },
]

export function RoleStep() {
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
    <div className="space-y-8 py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-[#203F30] mb-2">What best describes your role?</h2>
        <p className="text-[#1A1A1A]">This helps us tailor ClaimMate to your specific needs.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-lg mx-auto"
      >
        <RadioGroup
          value={selectedRole}
          onValueChange={(value) => {
            setSelectedRole(value)
            setError("")
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {roles.map((role) => (
            <div key={role.id} className="relative">
              <RadioGroupItem value={role.id} id={role.id} className="peer sr-only" />
              <Label
                htmlFor={role.id}
                className="flex flex-col items-center justify-center h-20 rounded-lg border-2 border-[#E2E8F0] bg-white p-4 hover:bg-[#F4F4F4] hover:border-[#9CCA46] cursor-pointer transition-all peer-checked:border-[#203F30] peer-checked:bg-[#F4F4F4] peer-focus:ring-2 peer-focus:ring-[#9CCA46]"
              >
                {selectedRole === role.id && <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-[#203F30]" />}
                <span className="mt-2 font-medium text-[#203F30]">{role.label}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>

        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
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
