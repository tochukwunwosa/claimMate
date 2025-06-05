"use client"

import { motion } from "framer-motion"
import { useOnboarding } from "../onboarding-provider"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Target, Clock } from "lucide-react"
import type { RefObject } from "react"

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Claims",
    description: "Draft claims faster with our intelligent AI assistant",
  },
  {
    icon: Target,
    title: "Personalized Experience",
    description: "Get recommendations tailored to your expertise",
  },
  {
    icon: Clock,
    title: "Quick Setup",
    description: "Complete your profile in less than 2 minutes",
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

interface WelcomeStepProps {
  nextButtonRef: RefObject<HTMLButtonElement | null>
}

export function WelcomeStep({ nextButtonRef }: WelcomeStepProps) {
  const { setCurrentStep, userName } = useOnboarding()

  const handleNext = () => {
    setCurrentStep(2)
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 md:space-y-8 py-2">
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center space-y-3">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
          Welcome to ClaimMate{userName ? `, ${userName}` : ""}!
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
          Let's set up your profile to help you get the most out of ClaimMate's AI-powered claims drafting tools.
        </p>
      </motion.div>

      {/* Features Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 max-w-3xl mx-auto">
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-muted/50 backdrop-blur-sm rounded-xl p-3 md:p-4 text-center space-y-2 border border-muted hover:border-primary/20 transition-colors"
          >
            <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-primary mx-auto" />
            <h3 className="font-semibold text-primary text-sm">{feature.title}</h3>
            <p className="text-xs text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Button */}
      <motion.div variants={itemVariants} className="flex justify-center">
        <Button
          onClick={handleNext}
          size="lg"
          ref={nextButtonRef}
          data-action="next"
          className="w-full md:w-auto bg-primary text-white hover:bg-primary/90 font-semibold text-base h-11 px-6 rounded-full"
        >
          Get Started
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </motion.div>
    </motion.div>
  )
}
