"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useOnboarding } from "../onboarding-provider"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle2 } from "lucide-react"
import { RefObject } from "react"

type ExperienceLevel = {
  id: string
  label: string
  description: string
  years: string
}

const experienceLevels: ExperienceLevel[] = [
  {
    id: "less-than-1",
    label: "Getting Started",
    description: "New to the industry",
    years: "< 1 year",
  },
  {
    id: "1-3",
    label: "Building Experience",
    description: "Growing your expertise",
    years: "1–3 years",
  },
  {
    id: "3-5",
    label: "Established Professional",
    description: "Solid industry knowledge",
    years: "3–5 years",
  },
  {
    id: "5-plus",
    label: "Seasoned Expert",
    description: "Deep industry expertise",
    years: "5+ years",
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

interface ExperienceStepProps {
  nextButtonRef: RefObject<HTMLButtonElement | null>
  backButtonRef: RefObject<HTMLButtonElement | null>
}

export function ExperienceStep({ nextButtonRef, backButtonRef }: ExperienceStepProps) {
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-2xl mx-auto space-y-6 md:space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center space-y-2">
        <h2 className="text-xl md:text-2xl font-semibold text-primary">Your Experience Level</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Help us understand your expertise in claims adjustment
        </p>
      </motion.div>

      {/* Experience Selection */}
      <motion.div variants={itemVariants} className="space-y-3 md:space-y-4">
        {experienceLevels.map((level, index) => {
          const isSelected = selectedExperience === level.id
          return (
            <motion.button
              key={level.id}
              onClick={() => {
                setSelectedExperience(level.id)
                setError("")
              }}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className={`w-full p-4 md:p-6 text-left rounded-xl border-2 transition-all ${isSelected
                  ? "border-primary bg-primary/5"
                  : "border-muted hover:border-primary/50"
                }`}
            >
              <div className="flex items-center space-x-3 md:space-x-4">
                {/* Timeline Connector */}
                <div className="relative flex flex-col items-center">
                  <div
                    className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${index < experienceLevels.length - 1
                        ? "mb-1 md:mb-2"
                        : ""
                      } ${isSelected ? "bg-primary" : "bg-muted-foreground/30"
                      }`}
                  />
                  {index < experienceLevels.length - 1 && (
                    <div
                      className={`w-0.5 h-full absolute top-4 md:top-5 ${isSelected ? "bg-primary" : "bg-muted-foreground/30"
                        }`}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3
                        className={`text-sm md:text-base font-medium ${isSelected ? "text-primary" : "text-foreground"
                          }`}
                      >
                        {level.label}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground mt-0.5 md:mt-1">
                        {level.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1.5 md:space-x-2 text-xs md:text-sm text-muted-foreground">
                      <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      <span>{level.years}</span>
                    </div>
                  </div>
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
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
