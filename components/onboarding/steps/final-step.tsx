"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useOnboarding } from "../onboarding-provider"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight, Sparkles, Target, Zap } from "lucide-react"
import { RefObject } from "react"

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Dashboard",
    description: "Access your personalized claims workspace",
  },
  {
    icon: Target,
    title: "Smart Templates",
    description: "Use templates tailored to your claim types",
  },
  {
    icon: Zap,
    title: "Quick Actions",
    description: "Create your first AI-powered claim draft",
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

const checkmarkVariants = {
  hidden: { scale: 0, opacity: 0 },
  show: {
    scale: [0, 1.2, 1],
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}

interface FinalStepProps {
  nextButtonRef: RefObject<HTMLButtonElement | null>
}

export function FinalStep({ nextButtonRef }: FinalStepProps) {
  const { completeOnboarding, isLoading, setCurrentStep } = useOnboarding()
  const [isCompleting, setIsCompleting] = useState(false)
  const [redirectTime, setRedirectTime] = useState<number | null>(null)
  const router = useRouter()

  // Complete onboarding once
  useEffect(() => {
    const completeAndStart = async () => {
      setIsCompleting(true)
      await completeOnboarding()
      setRedirectTime(5)
    }

    if (!isCompleting) {
      completeAndStart()
    }
  }, [isCompleting, completeOnboarding])

  // Countdown logic
  useEffect(() => {
    if (redirectTime === null || redirectTime <= 0) return

    const timer = setTimeout(() => {
      setRedirectTime((prev) => (prev !== null ? prev - 1 : null))
    }, 1000)

    return () => clearTimeout(timer)
  }, [redirectTime])

  // Redirect to dashboard when timer hits 0
  useEffect(() => {
    if (redirectTime === 0 && isCompleting) {
      router.push("/dashboard")
    }
  }, [redirectTime, isCompleting, router])

  const handleBack = () => {
    setCurrentStep(5)
  }

  const manuallyRedirect = () => {
    router.push("/dashboard")
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-2xl mx-auto space-y-6 md:space-y-8"
    >
      {/* Success Animation */}
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <div className="relative w-16 h-16 md:w-24 md:h-24 mx-auto">
          <motion.div
            variants={checkmarkVariants}
            className="relative w-full h-full flex items-center justify-center"
          >
            <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16 text-emerald-500" />
          </motion.div>
        </div>
        <h2 className="text-xl md:text-2xl font-semibold text-primary">
          Setup Complete!
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
          Your profile is ready. You'll be redirected to your personalized dashboard in{" "}
          <span className="text-primary font-medium">{redirectTime}</span> seconds.
        </p>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-6"
      >
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-muted/50 backdrop-blur-sm rounded-xl p-4 md:p-6 text-center space-y-2 md:space-y-3 border border-muted"
          >
            <feature.icon className="w-5 h-5 md:w-8 md:h-8 text-primary mx-auto" />
            <h3 className="text-sm md:text-base font-semibold text-primary">{feature.title}</h3>
            <p className="text-xs md:text-sm text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Actions */}
      <motion.div
        variants={itemVariants}
        className="flex justify-between items-center pt-4"
      >
        <Button
          onClick={manuallyRedirect}
          ref={nextButtonRef}
          disabled={isLoading || isCompleting}
          data-action="next"
          className="h-10 md:h-11 text-sm md:text-base bg-primary text-white hover:bg-primary/90 font-medium px-6 md:px-8"
        >
          {isLoading || isCompleting ? (
            "Setting up..."
          ) : (
            <>
              Go to Dashboard
              <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  )
}
