"use client"

import { motion } from "framer-motion"

const steps = [
  {
    number: 1,
    title: "Answer Questions",
    description: "Input property details through our guided questionnaire"
  },
  {
    number: 2,
    title: "AI Generation",
    description: "Our AI drafts a comprehensive claim based on your inputs"
  },
  {
    number: 3,
    title: "Review & Export",
    description: "Edit if needed and export in your preferred format"
  }
]

export function HowItWorks() {
  return (
    <section id="demo" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary mb-4">How ClaimMate Works</h2>
          <p className="text-xl text-muted-foreground">Three simple steps to perfect claims</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-primary">{step.number}</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 