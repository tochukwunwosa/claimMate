"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { Zap, FileText, Check } from "lucide-react"

interface Feature {
  icon: ReactNode
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: <Zap className="h-6 w-6 text-[#203F30]" aria-hidden="true" />,
    title: "AI Claims Assistant",
    description: "Intelligent drafting that learns from your style and preferences.",
  },
  {
    icon: <FileText className="h-6 w-6 text-[#203F30]" aria-hidden="true" />,
    title: "Export to Word/PDF",
    description: "Seamlessly export your claims to standard document formats.",
  },
  {
    icon: <Check className="h-6 w-6 text-[#203F30]" aria-hidden="true" />,
    title: "Compliance Checker",
    description: "Ensure your claims meet all regulatory requirements.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 px-4" aria-labelledby="features-heading">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          id="features-heading"
          className="text-3xl font-bold text-[#203F30] mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Coming Soon
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              className="flex flex-col items-center text-center p-6 bg-[#F4F4F4] rounded-xl shadow-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
              aria-label={feature.title}
            >
              <div className="mb-4 p-3 bg-white rounded-full shadow-md">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-[#203F30] mb-2">{feature.title}</h3>
              <p className="text-sm text-[#1A1A1A]">{feature.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
