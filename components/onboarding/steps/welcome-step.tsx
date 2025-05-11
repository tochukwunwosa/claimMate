"use client"

import { motion } from "framer-motion"
import { useOnboarding } from "../onboarding-provider"
import { Button } from "@/components/ui/button"

export function WelcomeStep() {
  const { setCurrentStep, userName } = useOnboarding()

  const handleNext = () => {
    setCurrentStep(2)
  }

  return (
    <div className="space-y-8 py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold text-[#203F30]">Welcome to ClaimMate{userName ? `, ${userName}` : ""}!</h1>

        <p className="text-lg text-[#1A1A1A] max-w-lg mx-auto">
         {` Let's set up your profile to help you get the most out of ClaimMate's AI-powered claims drafting tools.`}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-[#F4F4F4] p-6 rounded-lg max-w-lg mx-auto"
      >
        <h2 className="font-semibold text-[#203F30] mb-3">What to expect:</h2>
        <ul className="space-y-2 text-[#1A1A1A]">
          <li className="flex items-start">
            <span className="inline-block bg-[#DBFB1E] rounded-full w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>A few quick questions about your role and experience</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block bg-[#DBFB1E] rounded-full w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>Personalized dashboard setup based on your needs</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block bg-[#DBFB1E] rounded-full w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>Takes less than 2 minutes to complete</span>
          </li>
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center"
      >
        <Button
          onClick={handleNext}
          className="bg-[#DBFB1E] text-[#203F30] hover:bg-[#9CCA46] font-semibold text-lg h-auto"
        >
          Get Started
        </Button>
      </motion.div>
    </div>
  )
}
