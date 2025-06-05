"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useOnboarding } from "../onboarding-provider"
import { Button } from "@/components/ui/button"
import { Home, Car, Shield, Tornado, HelpCircle, CheckCircle2 } from "lucide-react"
import { RefObject } from "react"

const claimTypes = [
  {
    id: "property",
    label: "Property",
    icon: Home,
    description: "Residential and commercial property claims",
  },
  {
    id: "auto",
    label: "Auto",
    icon: Car,
    description: "Vehicle damage and liability claims",
  },
  {
    id: "casualty",
    label: "Casualty",
    icon: Shield,
    description: "Personal injury and liability claims",
  },
  {
    id: "cat",
    label: "CAT",
    icon: Tornado,
    description: "Catastrophic and natural disaster claims",
  },
  {
    id: "other",
    label: "Other",
    icon: HelpCircle,
    description: "Other specialized claim types",
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

interface ClaimTypesStepProps {
  nextButtonRef: RefObject<HTMLButtonElement | null>
  backButtonRef: RefObject<HTMLButtonElement | null>
}

export function ClaimTypesStep({ nextButtonRef, backButtonRef }: ClaimTypesStepProps) {
  const { setCurrentStep, onboardingData, updateOnboardingData, saveProgress } = useOnboarding()
  const [selectedTypes, setSelectedTypes] = useState<string[]>(onboardingData.claimTypes || [])
  const [error, setError] = useState("")

  const handleTypeChange = (typeId: string) => {
    setSelectedTypes((prev) => {
      if (prev.includes(typeId)) {
        return prev.filter((id) => id !== typeId)
      } else {
        return [...prev, typeId]
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-2xl mx-auto space-y-6 md:space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center space-y-2">
        <h2 className="text-xl md:text-2xl font-semibold text-primary">Select Claim Types</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Choose the types of claims you commonly handle
        </p>
      </motion.div>

      {/* Claim Types Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4"
      >
        {claimTypes.map((type) => {
          const isSelected = selectedTypes.includes(type.id)
          return (
            <motion.button
              key={type.id}
              onClick={() => handleTypeChange(type.id)}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className={`relative p-4 md:p-6 text-left rounded-xl border-2 transition-all ${isSelected
                ? "border-primary bg-primary/5"
                : "border-muted hover:border-primary/50"
                }`}
            >
              <div className="flex items-start space-x-3 md:space-x-4">
                <type.icon
                  className={`w-5 h-5 md:w-6 md:h-6 ${isSelected ? "text-primary" : "text-muted-foreground"
                    }`}
                />
                <div className="flex-1">
                  <h3
                    className={`text-sm md:text-base font-medium ${isSelected ? "text-primary" : "text-foreground"
                      }`}
                  >
                    {type.label}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground mt-0.5 md:mt-1">
                    {type.description}
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

      {/* Selected Count */}
      <motion.div variants={itemVariants} className="text-center">
        <p className="text-xs md:text-sm text-muted-foreground">
          {selectedTypes.length === 0
            ? "No claim types selected"
            : `${selectedTypes.length} ${selectedTypes.length === 1 ? "type" : "types"
            } selected`}
        </p>
        {error && <p className="text-xs md:text-sm text-red-500 mt-1">{error}</p>}
      </motion.div>

      {/* Actions */}
      <motion.div
        variants={itemVariants}
        className="flex justify-between items-center pt-4"
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
  )
}
