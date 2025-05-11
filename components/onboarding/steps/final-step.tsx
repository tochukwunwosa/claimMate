"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useOnboarding } from "../onboarding-provider"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export function FinalStep() {
  const { completeOnboarding, isLoading, setCurrentStep } = useOnboarding()
  const [isCompleting, setIsCompleting] = useState(false)
  const [redirectTime, setRedirectTime] = useState(0)
  const router = useRouter()

  // Automatically run onboarding completion on mount
  useEffect(() => {
    const completeAndStartTimer = async () => {
      setIsCompleting(true)
      await completeOnboarding()
      setRedirectTime(5)
    }

    if (!isCompleting) {
      completeAndStartTimer()
    }
  }, [isCompleting, completeOnboarding])

  // Start countdown and redirect
  useEffect(() => {
    if (redirectTime === null || redirectTime <= 0) return; 
    const timer = setInterval(() => {
      setRedirectTime((prev) => {
        if (prev > 1) return prev - 1; 
        clearInterval(timer); 
        return 0; 
      });
    }, 1000);

    // Clear the interval on cleanup
    return () => clearInterval(timer);
  }, [redirectTime]);

  useEffect(() => {
    if (redirectTime === 0) {
      router.push("/dashboard"); 
    }
  }, [redirectTime, router]);
  
  

  const handleBack = () => {
    setCurrentStep(5)
  }

  const manuallyRedirect = () => {
    router.push("/dashboard")
  }

  return (
    <div className="space-y-8 py-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        className="flex justify-center"
      >
        <div className="bg-[#F0FFF4] rounded-full p-4">
          <CheckCircle2 className="h-16 w-16 text-[#9CCA46]" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center space-y-4"
      >
        <h2 className="text-2xl font-bold text-[#203F30]">{`Thanks! You're all set.`}</h2>
        <p className="text-[#1A1A1A] max-w-md mx-auto">
          {`Your ClaimMate account is now personalized based on your preferences. You're ready to start drafting claims more efficiently.`}
        </p>
        {redirectTime !== null && (
          <p className="text-sm text-muted-foreground">
            Redirecting to your dashboard in{" "}
            <span className="font-semibold text-[#203F30]">{redirectTime}</span> seconds...
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-[#F4F4F4] p-6 rounded-lg max-w-lg mx-auto"
      >
        <h3 className="font-semibold text-[#203F30] mb-3">{`What's next:`}</h3>
        <ul className="space-y-3 text-[#1A1A1A]">
          <li className="flex items-start">
            <span className="inline-block bg-[#DBFB1E] rounded-full w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>Explore your personalized dashboard</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block bg-[#DBFB1E] rounded-full w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>Create your first AI-powered claim draft</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block bg-[#DBFB1E] rounded-full w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>Access templates tailored to your claim types</span>
          </li>
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex justify-between"
      >
        <Button onClick={handleBack} variant="outline" className="border-[#203F30] text-[#203F30]">
          Back
        </Button>

        <Button
          onClick={manuallyRedirect}
          disabled={isLoading || isCompleting}
          className="bg-[#203F30] text-white hover:bg-[#1A1A1A] font-semibold"
        >
          {isLoading || isCompleting ? "Loading..." : "Go to Dashboard"}
        </Button>
      </motion.div>
    </div>
  )
}
