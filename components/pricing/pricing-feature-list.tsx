"use client"

import { Check } from "lucide-react"
import { motion } from "framer-motion"

interface PricingFeatureListProps {
  features: string[]
  showAll?: boolean
}

export function PricingFeatureList({ features, showAll = false }: PricingFeatureListProps) {
  const displayFeatures = showAll ? features : features.slice(0, 4)
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
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      {displayFeatures.map((feature, featureIndex) => (
        <motion.div
          key={featureIndex}
          variants={itemVariants}
          className="flex items-start gap-3 group"
        >
          <div className="rounded-full p-1 bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
            <Check className="w-3 h-3 flex-shrink-0" />
          </div>
          <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
            {feature}
          </span>
        </motion.div>
      ))}
      {!showAll && features.length > 4 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs text-muted-foreground ml-7"
        >
          +{features.length - 4} more features
        </motion.p>
      )}
    </motion.div>
  )
}
