"use client"
import { useMemo, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"

export default function VerificationContent() {
  const searchParams = useSearchParams()
  const email = useMemo(() => searchParams.get("email") || "", [searchParams])

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  }), [])

  const itemVariants = useMemo(() => ({
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }), [])

  useEffect(() => {
    const checkEmailInterval = setInterval(() => {
      console.log("Checking if email has been verified...")
    }, 5000)

    return () => clearInterval(checkEmailInterval)
  }, [])

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <motion.div
          variants={itemVariants}
          className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6"
        >
          <Mail className="h-8 w-8 text-primary" />
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-2xl font-bold text-primary mb-2">
          Check your email
        </motion.h1>

        <motion.p variants={itemVariants} className="text-foreground mb-6">
          {`We've sent a verification link to `}<strong>{email}</strong>
        </motion.p>

        <motion.div variants={itemVariants} className="bg-muted p-4 rounded-md mb-6">
          <h2 className="font-medium text-primary mb-2">Next steps:</h2>
          <ol className="text-left text-sm space-y-2 pl-5 list-decimal">
            <li>Check your email inbox for the verification link</li>
            <li>Click the link to verify your email address</li>
            <li>{`After verification, you'll be able to sign in to your account`}</li>
          </ol>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          <p className="text-sm text-foreground/50">
            {`Didn't receive the email? Check your spam folder or `}
            <Link href="/auth/signup" className="text-primary hover:underline font-medium">
              try again with a different email
            </Link>
          </p>

          <Link href="/auth/login">
            <Button className="cursor-pointer bg-primary text-white hover:bg-foreground">
              Go to sign in
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}
