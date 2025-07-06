"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"

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
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const animationFrame = useRef<number>(0)
  const [isHovered, setIsHovered] = useState(false)
  const speed = 0.5 // pixels per frame (~30px/sec @60fps)

  useEffect(() => {
    const scroll = () => {
      if (!containerRef.current || !contentRef.current) return

      const content = contentRef.current

      if (!isHovered) {
        // Move content to the left
        const currentX = parseFloat(content.style.transform.replace("translateX(", "").replace("px)", "")) || 0
        const newX = currentX - speed

        // If we scrolled past the first full loop, reset without visual jump
        if (Math.abs(newX) >= content.scrollWidth / 2) {
          content.style.transform = `translateX(0px)`
        } else {
          content.style.transform = `translateX(${newX}px)`
        }
      }

      animationFrame.current = requestAnimationFrame(scroll)
    }

    animationFrame.current = requestAnimationFrame(scroll)

    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current)
    }
  }, [isHovered])

  return (
    <section className="py-20 w-full bg-muted/50 border-t border-muted">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-2">Trusted by Licensed Adjusters</h2>
          <p className="text-muted-foreground text-lg">Built with feedback from industry professionals</p>
        </div>

        <div
          ref={containerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative overflow-hidden"
        >
          <div
            ref={contentRef}
            className="flex gap-6 py-6"
            style={{ width: "max-content", transform: "translateX(0px)", willChange: "transform" }}
          >
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <motion.div
                key={`${testimonial.author}-${index}`}
                className="flex-shrink-0 w-[360px] bg-background border border-muted rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % testimonials.length) * 0.1 }}
              >
                <p className="text-muted-foreground mb-4 italic">“{testimonial.quote}”</p>
                <div className="flex items-center gap-3 mt-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">{testimonial.initials}</span>
                  </div>
                  <div>
                    <p className="font-medium text-primary">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
