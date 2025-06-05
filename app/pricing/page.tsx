"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Loader2, Calculator, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { getPlans } from "@/action/pricing"
import { rois, benefits, faqs } from "@/const/pricing"
import { PricingToggle } from "@/components/pricing/pricing-toggle"
import { PricingCard } from "@/components/pricing/pricing-card"
import { PricingFAQ } from "@/components/pricing/pricing-faq"
import { PricingComparison } from "@/components/pricing/pricing-comparison"
import { PricingPromo } from "@/components/pricing/pricing-promo"
import { calculateAnnualSavings, getPlanFeatures, getPlanPrice } from "@/lib/pricing"
import { SocialProof } from "@/components/homepage/SocialProof"

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true) // Default to yearly for better value
  const [selectedPlan, setSelectedPlan] = useState("Professional")
  const [plans, setPlans] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedROI, setSelectedROI] = useState(1) // Default to middle ROI option

  useEffect(() => {
    async function fetchPlans() {
      try {
        const plansData = await getPlans()
        setPlans(plansData)
        // Set the popular plan as selected by default
        const popularPlan = plansData.find((plan) => plan.is_popular)
        if (popularPlan) {
          setSelectedPlan(popularPlan.name)
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error)
        toast.error("Failed to load pricing plans")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlans()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const selectedRoiData = rois[selectedROI]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
              <Zap className="w-3 h-3 mr-1" />
              30-Day Money-Back Guarantee
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
              Invest in your <span className="text-emerald-600">success</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Join successful insurance adjusters who save 5+ hours per week with ClaimMate.
              Choose the plan that fits your growth.
            </p>
          </motion.div>

          {/* ROI Calculator Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-6 mt-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-600" />
                Your Monthly ROI
              </h3>
              <Badge variant="outline" className="text-emerald-600">
                Based on {selectedRoiData.claims} claims/month
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time saved:</span>
                <span className="font-medium">{selectedRoiData.claims * selectedRoiData.hoursPerClaim} hours</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Value of time:</span>
                <span className="font-medium">${selectedRoiData.hourlyRate}/hour</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-semibold">Monthly savings:</span>
                <span className="font-bold text-emerald-600">${selectedRoiData.monthlySavings}</span>
              </div>
            </div>
            <Button
              variant="link"
              className="w-full mt-4 text-emerald-600 hover:text-emerald-700"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See pricing details
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                variants={itemVariants}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Choose the plan that grows with you
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                All plans include a 7-day free trial. No credit card required.
              </p>
              <div className="flex items-center justify-center gap-4 mb-8">
                <Badge variant="outline" className="py-1 px-3">
                  30-day money-back guarantee
                </Badge>
                <Badge variant="outline" className="py-1 px-3">
                  Cancel anytime
                </Badge>
                <Badge variant="outline" className="py-1 px-3">
                  Instant access
                </Badge>
              </div>
              <PricingToggle isYearly={isYearly} setIsYearly={setIsYearly} />
            </motion.div>
          </div>

          {/* Pricing Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {plans.map((plan, index) => {
              const features = getPlanFeatures(plan)
              const currentPrice = getPlanPrice(plan, isYearly)
              const savings = calculateAnnualSavings(plan.monthly_price, plan.yearly_price)

              return (
                <PricingCard
                  isLoading={isLoading}
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
          </motion.div>

          {/* Promo Code */}
          <PricingPromo />
        </div>
      </section>

      {/* Testimonials */}
      <SocialProof />

      {/* Feature Comparison */}
      <section className="py-24 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <PricingComparison plans={plans} />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <PricingFAQ />
        </div>
      </section>
    </div>
  )
}
