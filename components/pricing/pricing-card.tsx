"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Star, Check, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { PricingFeatureList } from "./pricing-feature-list"
import { formatPrice } from "@/lib/pricing"

interface PricingCardProps {
  plan: {
    id: string
    name: string
    description: string
    is_popular?: boolean
  }
  features: string[]
  currentPrice: number
  savings?: number
  isYearly: boolean
  index: number;
  isLoading: boolean;
}

export function PricingCard({ plan, features, currentPrice, savings = 0, isYearly, index, isLoading }: PricingCardProps) {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  const handleStartTrial = () => {
    setIsNavigating(true)
    router.push(
      `/signup?plan=${encodeURIComponent(plan.name)}&billing=${isYearly ? "yearly" : "monthly"}`,
    )
  }

  const isEnterprise = plan.name === "Enterprise"
  const formattedPrice = isEnterprise ? "Custom" : formatPrice(currentPrice)
  const monthlyPrice = isEnterprise ? "Custom" : `$${(currentPrice / 100).toFixed(2)}`

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card
        className={cn(
          "relative transition-all duration-300 ",
          plan.is_popular ? "border-2 border-primary shadow-lg bg-muted" : "border hover:shadow-md",
        )}
      >
        {plan.is_popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-5">
            <Badge className="bg-emerald-600 text-white px-3 py-1 hover:bg-emerald-600 transition-colors">
              <Star className="w-3 h-3 mr-1" />
              Most Popular
            </Badge>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">{plan.name}</CardTitle>
              <CardDescription className="text-sm text-gray-600 mt-1">{plan.description}</CardDescription>
            </div>
            <div className="text-right">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-900">{monthlyPrice}</span>
                {!isEnterprise && <span className="text-gray-500 text-sm">/mo</span>}
              </div>
              {isYearly && savings > 0 && (
                <div className="mt-1">
                  <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                    Save ${savings / 100}/year
                  </Badge>
                </div>
              )}
              {!isEnterprise && (
                <p className="text-xs text-gray-500 mt-1">
                  {isYearly ? "Billed annually" : "Monthly billing"}
                </p>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="py-3">
          <PricingFeatureList features={features} showAll={true} />
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-6">
          <Button
            className={cn(
              "w-full font-semibold",
              plan.is_popular
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : isEnterprise
                  ? "bg-primary hover:bg-primary/90"
                  : "bg-primary/10 hover:bg-primary/20 text-primary"
            )}
            onClick={handleStartTrial}
            disabled={isNavigating}
          >
            {isNavigating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : isEnterprise ? (
              "Contact Sales"
            ) : (
              "Start Free Trial"
            )}
            {!isNavigating && !isEnterprise && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
          {!isEnterprise && (
            <p className="text-xs text-center text-muted-foreground">
              7-day free trial • No credit card required
            </p>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
