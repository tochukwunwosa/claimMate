"use client"

import { WaitlistForm } from "@/components/waitlist-form"
import { FeaturesSection } from "@/components/features-section"
import { motion } from "framer-motion"
import Image from 'next/image'
import { generateMeta } from "@/lib/metadata"

export const metadata = generateMeta({
  path: "/",
})

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        ease: "easeOut",
        duration: 0.5,
      },
    },
  }

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.98 },
  }

  return (
    <main className="scroll-smooth min-h-screen flex flex-col">
      {/* Hero Section */}
      <section id='about' className="flex items-center justify-between gap-12 px-4 py-24 container mx-auto">
        {/* Text Content */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex-1 flex flex-col items-center md:items-start text-center md:text-left"
        >
          <motion.h1
            variants={item}
            className="text-4xl md:text-3xl lg:text-5xl font-extrabold text-primary mb-4 leading-tight"
          >
            Draft Insurance Claims 10× Faster with AI
          </motion.h1>
          <motion.p
            variants={item}
            className="text-lg md:text-xl text-foreground mb-4"
          >
            ClaimMate helps independent agents create accurate, compliant, and professional claims — in minutes.
          </motion.p>
          <motion.p
            variants={item}
            className="text-base md:text-lg text-foreground mb-8"
          >
            Say goodbye to tedious paperwork and hello to intelligent automation.
          </motion.p>
          <motion.a
            href="#waitlist"
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className="px-6 py-3 bg-secondary text-primary font-semibold rounded-md hover:bg-accent transition-all shadow-md"
          >
            🚀 Join the Waitlist Now
          </motion.a>
        </motion.div>

        {/* Image */}
        <motion.div
          className="hidden md:flex md:flex-1 overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src="/images/claimmate-hero.png"
            width={1024}
            height={1024}
            alt="ClaimMate Image"
            className="mx-auto"
          />
        </motion.div>
      </section>

      {/* Dashboard Mockup Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto">
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-center mb-12 text-primary"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Powerful Dashboard for Insurance Professionals
          </motion.h2>

          <div className="relative max-w-5xl mx-auto">
            {/* Decorative elements */}
            <motion.div
              className="absolute -z-10 w-full h-full rounded-full blur-3xl opacity-20 bg-secondary"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.2 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            />

            {/* Laptop frame */}
            <motion.div
              className="relative bg-zinc-800 rounded-t-xl pt-4 pb-6 px-4 shadow-2xl"
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {/* Laptop top bar with camera */}
              <div className="flex justify-center items-center mb-2">
                <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
              </div>

              {/* Screen with dashboard image */}
              <div className="bg-background rounded-lg overflow-hidden shadow-inner border border-zinc-700">
                <motion.div
                  initial={{ scale: 1.05, opacity: 0.8 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Image
                    src="/images/claimmate-dashboard.png"
                    width={1134}
                    height={633}
                    alt="ClaimMate dashboard interface"
                    className="w-full h-auto"
                    priority
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Laptop base */}
            <motion.div
              className="bg-zinc-700 h-4 max-w-[90%] mx-auto rounded-b-lg shadow-2xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.6 }}
            />
            <motion.div
              className="bg-zinc-800 h-1 max-w-[40%] mx-auto rounded-b-lg shadow-2xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.7 }}
            />
          </div>
        </div>
      </section>


      {/* Waitlist Form Section */}
      <motion.section
        id="waitlist"
        className="py-24 px-4 bg-muted"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-md mx-auto">
          <motion.h2
            className="text-2xl font-bold text-primary mb-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Get Early Access
          </motion.h2>
          <WaitlistForm />
        </div>
      </motion.section>

      {/* Features Preview Section */}
      <FeaturesSection />
    </main>
  )
}
