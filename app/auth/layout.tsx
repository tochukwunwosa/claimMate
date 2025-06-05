"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Logo from "@/components/Logo"
import { FileText, Shield, Sparkles, Users } from "lucide-react"

interface Feature {
  title: string
  description: string
  icon: React.ElementType
}

const features: Feature[] = [
  {
    title: "AI-Powered Drafting",
    description: "Generate professional claim documents in minutes with advanced AI assistance.",
    icon: Sparkles,
  },
  {
    title: "Smart Templates",
    description: "Access a library of customizable templates that adapt to your needs.",
    icon: FileText,
  },
  {
    title: "Team Collaboration",
    description: "Work seamlessly with your team in real-time on complex claims.",
    icon: Users,
  },
  {
    title: "Secure & Compliant",
    description: "Enterprise-grade security with full compliance and audit trails.",
    icon: Shield,
  },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isVerification = pathname.includes("verification")
  const isResetPassword = pathname.includes("reset-password")
  const isError = pathname.includes("error")

  // Don't show the layout for verification, reset password, or error pages
  if (isVerification || isResetPassword || isError) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2" aria-label="Auth layout">
      {/* Left side - Auth form */}
      <div className="flex flex-col justify-center px-4 py-10 sm:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center mb-8"
          >
            <Logo/>
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
              aria-label="Back to home"
            >
              ← Back to home
            </Link>
          </motion.div>

          {/* Auth form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            aria-label="Auth form"
          >
            {children}
          </motion.div>
        </div>
      </div>

      {/* Right side - Features showcase */}
      <div className="hidden lg:flex relative bg-primary/90 overflow-hidden">
        <div className="relative flex flex-col justify-center px-12 py-10">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Transform Your Claims Process
              </h2>
              <p className="text-lg text-white/90">
                Join successful insurance adjusters who save 5+ hours per week with ClaimMate.
              </p>
            </div>

            <div className="grid gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-white/80">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-8">
              <blockquote className="text-lg text-white/90 italic">
                "ClaimMate has completely transformed how we handle claims. The time savings and
                professional output are incredible."
              </blockquote>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center" >
                  {/* <Image src={'/logos/claimmate-logo-sm.png'} width={40} height={40} alt="ClaimMate logo" className='size-8' /> */}
                  <span className="text-white text-lg font-bold">SJ</span>
                </div>
                <div>
                  <div className="text-white font-medium">Sarah Johnson</div>
                  <div className="text-white/70 text-sm">Claims Manager at InsureTech</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 