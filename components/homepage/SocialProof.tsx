"use client"

import { motion, useAnimationControls } from "framer-motion"
import { useEffect, useRef, useState } from "react"

const testimonials = [
  {
    quote: "ClaimMate cut my claim drafting time in half. The AI understands exactly what information to include.",
    author: "John Davis",
    title: "Independent Adjuster, 15+ years",
    initials: "JD"
  },
  {
    quote: "The templates are industry-standard and the AI adapts to my writing style. Impressive tool!",
    author: "Sarah Henderson",
    title: "Claims Manager",
    initials: "SH"
  },
  {
    quote: "Perfect for handling multiple claims during storm season. The accuracy is remarkable.",
    author: "Robert Martinez",
    title: "Storm Response Team Lead",
    initials: "RM"
  },
  {
    quote: "The AI's understanding of insurance terminology is impressive. It saves me hours of work.",
    author: "Emily Chen",
    title: "Property Claims Specialist",
    initials: "EC"
  },
  {
    quote: "ClaimMate has transformed our workflow. The accuracy and speed are game-changing.",
    author: "Michael Thompson",
    title: "Agency Owner",
    initials: "MT"
  }
]

export function SocialProof() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const controls = useAnimationControls()
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const startScrolling = async () => {
      if (isHovered) return

      await controls.start({
        x: [0, -1920], // Adjust based on content width
        transition: {
          duration: 20,
          ease: "linear",
          repeat: Infinity,
        }
      })
    }

    startScrolling()
  }, [controls, isHovered])

  return (
    <section className="py-16 w-full bg-muted/50 px-4">
      <div className="max-w-7xl mx-auto px-4 overflow-hidden">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-primary mb-4">Trusted by Licensed Adjusters</h2>
          <p className="text-muted-foreground">Built with feedback from industry professionals</p>
        </div>
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            ref={scrollRef}
            className="flex gap-8 py-4"
            animate={controls}
          >
            {/* First set of testimonials */}
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={`${testimonial.author}-1`}
                className="flex-shrink-0 w-[400px] bg-background p-6 rounded-lg shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <p className="text-foreground/80 mb-4">{testimonial.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-semibold">{testimonial.initials}</span>
                  </div>
                  <div>
                    <p className="font-medium text-primary">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            {/* Duplicate testimonials for seamless loop */}
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={`${testimonial.author}-2`}
                className="flex-shrink-0 w-[400px] bg-background p-6 rounded-lg shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <p className="text-foreground/80 mb-4">{testimonial.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-semibold">{testimonial.initials}</span>
                  </div>
                  <div>
                    <p className="font-medium text-primary">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
} 