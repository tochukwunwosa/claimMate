"use client"

import { Check, Minus } from "lucide-react"
import { motion } from "framer-motion"
import React, { useState } from "react"

interface Plan {
  name: string
}

interface PricingComparisonProps {
  plans: Plan[]
}

const featureCategories = [
  {
    name: "Core Features",
    features: [
      { name: "Claims per month", starter: "50", professional: "Unlimited", enterprise: "Unlimited" },
      { name: "Document templates", starter: "Basic", professional: "Advanced", enterprise: "Custom" },
      { name: "Export formats", starter: "PDF", professional: "PDF & Word", enterprise: "All formats" },
      { name: "AI assistance", starter: true, professional: true, enterprise: true },
    ]
  },
  {
    name: "Team & Collaboration",
    features: [
      { name: "Team members", starter: "1", professional: "Up to 3", enterprise: "Unlimited" },
      { name: "Shared templates", starter: false, professional: true, enterprise: true },
      { name: "Role-based access", starter: false, professional: true, enterprise: true },
      { name: "Team analytics", starter: false, professional: true, enterprise: true },
    ]
  },
  {
    name: "Support & Training",
    features: [
      { name: "Support level", starter: "Email", professional: "Priority", enterprise: "Dedicated" },
      { name: "Response time", starter: "48 hours", professional: "24 hours", enterprise: "4 hours" },
      { name: "Training sessions", starter: false, professional: "1 session", enterprise: "Unlimited" },
      { name: "Custom onboarding", starter: false, professional: false, enterprise: true },
    ]
  },
  {
    name: "Advanced Features",
    features: [
      { name: "Custom branding", starter: false, professional: true, enterprise: true },
      { name: "API access", starter: false, professional: true, enterprise: true },
      { name: "Custom integrations", starter: false, professional: false, enterprise: true },
      { name: "SLA guarantee", starter: false, professional: false, enterprise: true },
    ]
  }
]

export function PricingComparison({ plans }: PricingComparisonProps) {
  const [showAll, setShowAll] = useState(false)
  const visibleCategories = showAll ? featureCategories : featureCategories.slice(0, 2)

  return (
    <div className="mt-16 px-4 sm:px-6 lg:px-8">
      <h3 className="text-2xl font-bold text-primary mb-8 text-center">Compare Plans</h3>

      <div className="w-full overflow-x-auto border rounded-lg shadow-sm">
        <table className="min-w-[600px] w-full text-sm md:text-base">
          <thead className="bg-muted">
            <tr className="border-b">
              <th className="py-4 px-6 text-left min-w-[180px]"></th>
              {plans.map((plan) => (
                <th
                  key={plan.name}
                  className="py-4 px-6 text-center min-w-[140px] text-primary font-medium"
                >
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleCategories.map((category, categoryIndex) => (
              <React.Fragment key={category.name}>
                <motion.tr
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: categoryIndex * 0.1 }}
                >
                  <td colSpan={4} className="py-3 px-6 bg-muted/50 font-semibold text-primary">
                    {category.name}
                  </td>
                </motion.tr>
                {category.features.map((feature, featureIndex) => (
                  <motion.tr
                    key={feature.name}
                    className="border-b"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: categoryIndex * 0.1 + featureIndex * 0.05
                    }}
                  >
                    <td className="py-4 px-6 text-muted-foreground">{feature.name}</td>
                    <td className="py-4 px-6 text-center">{renderFeatureValue(feature.starter)}</td>
                    <td className="py-4 px-6 text-center">{renderFeatureValue(feature.professional)}</td>
                    <td className="py-4 px-6 text-center">{renderFeatureValue(feature.enterprise)}</td>
                  </motion.tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="text-sm text-primary hover:underline"
        >
          {showAll ? "Show Less" : "Show More"}
        </button>
      </div>
    </div>
  )
}

function renderFeatureValue(value: string | boolean) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="w-5 h-5 text-primary mx-auto" />
    ) : (
      <Minus className="w-5 h-5 text-muted-foreground mx-auto" />
    )
  }
  return <span className="text-muted-foreground">{value}</span>
}
