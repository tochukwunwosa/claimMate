"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getPlans } from "@/action/pricing"
import { calculateAnnualSavings, getPlanFeatures, getPlanPrice } from "@/lib/pricing"
import { PricingToggle } from "@/components/pricing/pricing-toggle"
import { PricingCard } from "@/components/pricing/pricing-card"
import { PricingFAQ } from "@/components/pricing/pricing-faq"
import { PricingComparison } from "@/components/pricing/pricing-comparison"
import { PricingTestimonials } from "@/components/pricing/pricing-testimonial"
import { PricingPromo } from "@/components/pricing/pricing-promo"

export function PricingCards() {
  const [isYearly, setIsYearly] = useState(false)
  const [plans, setPlans] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPlans() {
      try {
        const plansData = await getPlans()
        setPlans(plansData)
      } catch (error) {
        console.error("Failed to fetch plans:", error)
        toast.error("Failed to load pricing plans")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlans()
  }, [])

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-primary mb-2">Choose Your Plan</h2>
        <p className="text-foreground mb-4">No free tier. Just transparent value.</p>

        {/* Billing Toggle */}
        <PricingToggle isYearly={isYearly} setIsYearly={setIsYearly} />
      </div>

      {/* Pricing Cards */}
      <div className="space-y-4">
        {plans.map((plan, index) => {
          const features = getPlanFeatures(plan)
          const currentPrice = getPlanPrice(plan, isYearly)
          const savings = calculateAnnualSavings(plan.monthly_price, plan.yearly_price)

          return (
            <PricingCard
              key={plan.id}
              plan={plan}
              features={features}
              currentPrice={currentPrice}
              savings={savings}
              isYearly={isYearly}
              index={index}
            />
          )
        })}
      </div>

      {/* Promo Code */}
      <PricingPromo />

      {/* Trial Info */}
      <div className="text-center mt-6 p-4 bg-muted rounded-lg">
        <p className="text-sm text-gray-600 mb-2">
          <strong className="text-primary">7-Day Free Trial</strong>
        </p>
        <p className="text-xs text-gray-500">No credit card required • Cancel anytime • Full Pro access</p>
      </div>

      {/* Testimonials */}
      <PricingTestimonials />

      {/* Feature Comparison */}
      <PricingComparison plans={plans} />

      {/* FAQ */}
      <PricingFAQ />
    </div>
  )
}
