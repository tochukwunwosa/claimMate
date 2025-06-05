"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import {
  Zap,
  FileText,
  Shield,
  Clock,
  PenTool,
  Cloud,
  History,
  Users,
  LayoutTemplate
} from "lucide-react"

interface Feature {
  icon: ReactNode
  title: string
  description: string
  highlight?: boolean
}

const features: Feature[] = [
  {
    icon: <Zap className="h-6 w-6 text-primary" aria-hidden="true" />,
    title: "AI-Powered Drafting",
    description: "Generate comprehensive claims in minutes using our advanced AI that understands insurance terminology.",
    highlight: true
  },
  {
    icon: <LayoutTemplate className="h-6 w-6 text-primary" aria-hidden="true" />,
    title: "Industry-Standard Templates",
    description: "Access pre-built templates that follow insurance industry best practices and compliance requirements.",
    highlight: true
  },
  {
    icon: <PenTool className="h-6 w-6 text-primary" aria-hidden="true" />,
    title: "Smart Editor",
    description: "Easily customize and refine AI-generated claims with our intuitive editing interface.",
    highlight: true
  },
  {
    icon: <FileText className="h-6 w-6 text-primary" aria-hidden="true" />,
    title: "Multiple Export Formats",
    description: "Export your claims in PDF, Word, or other formats that work best for your workflow.",
  },
  {
    icon: <Shield className="h-6 w-6 text-primary" aria-hidden="true" />,
    title: "Secure Storage",
    description: "Your claims data is encrypted and stored securely in the cloud, accessible only to you.",
  },
  {
    icon: <Clock className="h-6 w-6 text-primary" aria-hidden="true" />,
    title: "Version History",
    description: "Track changes and maintain a complete history of your claim drafts.",
  },
  {
    icon: <Cloud className="h-6 w-6 text-primary" aria-hidden="true" />,
    title: "Cloud Sync",
    description: "Access your claims from any device, with automatic saving and syncing.",
  },
  {
    icon: <History className="h-6 w-6 text-primary" aria-hidden="true" />,
    title: "Claim Templates",
    description: "Save and reuse your most common claim formats as templates.",
  },
  {
    icon: <Users className="h-6 w-6 text-primary" aria-hidden="true" />,
    title: "Collaboration Tools",
    description: "Share claims with team members and collect feedback in one place.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="w-full py-24 px-4 bg-muted/30" aria-labelledby="features-heading">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            id="features-heading"
            className="text-3xl font-bold text-primary mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Powerful Features for Modern Adjusters
          </motion.h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to streamline your claims process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              className={`flex flex-col p-6 rounded-xl ${feature.highlight
                ? 'bg-primary/10 border border-primary/20'
                : 'bg-background border border-border'
                }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{
                y: -5,
                transition: { type: "spring", stiffness: 300 }
              }}
              aria-label={feature.title}
            >
              <div className={`mb-4 p-3 rounded-lg inline-flex ${feature.highlight
                ? 'bg-primary/20'
                : 'bg-muted'
                }`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
