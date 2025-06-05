"use client"

import { motion } from "framer-motion"
import { WaitlistForm } from "@/components/homepage/waitlist-form"

export function WaitlistSection() {
  return (
    <motion.section
      id="waitlist"
      className="py-24 px-4 bg-muted w-full"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-xl mx-auto text-center">
        <motion.h2
          className="text-3xl font-bold text-primary mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Join the Future of Claims Processing
        </motion.h2>
        <p className="text-lg text-muted-foreground mb-8">
          Be among the first to experience AI-powered claims drafting. Limited spots available for beta access.
        </p>
        <WaitlistForm />
      </div>
    </motion.section>
  )
} 