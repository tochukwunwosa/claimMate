"use client"

import { motion } from "framer-motion"
import { Check, Star } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    price: "$29",
    yearlyPrice: "$24",
    description: "Perfect for independent adjusters getting started",
    features: [
      "Up to 50 claims/month",
      "Basic templates",
      "Email support",
      "Export to PDF",
      "7-day trial"
    ],
    cta: "Start Free Trial",
    href: "/auth/signup?plan=starter"
  },
  {
    name: "Professional",
    price: "$49",
    yearlyPrice: "$40",
    description: "For growing insurance practices",
    features: [
      "Unlimited claims",
      "Advanced templates",
      "Priority support",
      "Team collaboration (up to 3 users)",
      "Custom branding",
      "Export to PDF & Word",
      "API access"
    ],
    cta: "Start Free Trial",
    href: "/auth/signup?plan=professional",
    isPopular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    yearlyPrice: "Custom",
    description: "Custom solutions for large teams",
    features: [
      "Everything in Professional",
      "Unlimited team members",
      "Custom templates",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee"
    ],
    cta: "Contact Sales",
    href: "/contact?type=enterprise"
  }
]

export default function PricingPreview() {
  return (
    <section id="pricing" className="w-full py-24 px-4 bg-muted/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-primary mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">Start with a 7-day free trial, upgrade when you're ready</p>
            <p className="text-sm text-muted-foreground mt-2">Save up to 20% with annual billing</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`bg-background p-8 rounded-xl border ${plan.isPopular ? 'border-primary shadow-lg' : 'border-border hover:border-primary/50'
                } relative`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-primary mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-muted-foreground">/month</span>}
                </div>
                {plan.price !== "Custom" && (
                  <p className="text-sm text-emerald-600 mt-1">
                    {plan.yearlyPrice}/mo when paid yearly
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block w-full py-3 text-center font-semibold rounded-md transition-colors ${plan.isPopular
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                  }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link
            href="/pricing"
            className="text-primary hover:text-primary/80 transition-colors font-medium inline-flex items-center gap-2"
          >
            Compare all features
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
} 