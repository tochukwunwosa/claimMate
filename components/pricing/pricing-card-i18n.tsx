"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { PricingFeatureList } from "./pricing-feature-list"
import { convertPrice, formatCurrencyPrice } from "@/lib/currency"
import { useCurrency } from "@/providers/use-currency"

interface PricingCardI18nProps {
  plan: {
    id: string
    name: string
    description: string
    is_popular?: boolean
  }
  features: string[]
  usdPrice: number
  usdSavings?: number
  isYearly: boolean
  index: number
}

export function PricingCardI18n({ plan, features, usdPrice, usdSavings = 0, isYearly, index }: PricingCardI18nProps) {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)
  const { currency, exchangeRates } = useCurrency()

  const handleStartTrial = () => {
    setIsNavigating(true)
    router.push(
      `/signup?plan=${encodeURIComponent(plan.name)}&billing=${isYearly ? "yearly" : "monthly"}&currency=${currency}`,
    )
  }

  // Convert prices to user's currency
  const localPrice = convertPrice(usdPrice, currency, exchangeRates)
  const localSavings = convertPrice(usdSavings, currency, exchangeRates)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card
        className={cn(
          "relative transition-all duration-300",
          plan.is_popular ? "border-2 border-primary shadow-lg bg-muted" : "border hover:shadow-md",
        )}
      >
        {plan.is_popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-emerald-600 text-white px-3 py-1">
              <Star className="w-3 h-3 mr-1" />
              Popular
            </Badge>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">{plan.name}</CardTitle>
              <CardDescription className="text-sm text-gray-600">{plan.description}</CardDescription>
            </div>
            <div className="text-right">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-900">
                  {formatCurrencyPrice(localPrice, currency).replace(/\.00$/, "")}
                </span>
                <span className="text-gray-500 text-sm">/mo</span>
              </div>
              {isYearly && localSavings > 0 && (
                <p className="text-xs text-emerald-600">Save {formatCurrencyPrice(localSavings, currency)}/year</p>
              )}
              {currency !== "USD" && <p className="text-xs text-gray-400">~${usdPrice.toFixed(2)} USD</p>}
            </div>
          </div>
        </CardHeader>

        <CardContent className="py-3">
          <PricingFeatureList features={features} />
        </CardContent>

        <CardFooter className="pt-3">
          <Button
            className={cn(
              "w-full text-sm",
              plan.is_popular
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-primary hover:bg-gray-800 text-white",
            )}
            onClick={handleStartTrial}
            disabled={isNavigating}
          >
            {isNavigating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Redirecting...
              </>
            ) : (
              "Start 7-Day Free Trial"
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
