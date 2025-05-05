"use client"

import { WaitlistForm } from "@/components/waitlist-form"
import { FeaturesSection } from "@/components/features-section"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import Image from 'next/image'

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
      <section className="flex items-center justify-between gap-12 px-4 py-20 max-w-6xl mx-auto">
        {/* Text Content */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex-1 flex flex-col items-center md:items-start text-center md:text-left"
        >
          <motion.h1
            variants={item}
            className="text-4xl md:text-3xl lg:text-5xl font-extrabold text-[#203F30] mb-4 leading-tight"
          >
            Draft Insurance Claims 10× Faster with AI
          </motion.h1>
          <motion.p
            variants={item}
            className="text-lg md:text-xl text-[#1A1A1A] mb-4"
          >
            ClaimMate helps independent agents create accurate, compliant, and professional claims — in minutes.
          </motion.p>
          <motion.p
            variants={item}
            className="text-base md:text-lg text-[#1A1A1A] mb-8"
          >
            Say goodbye to tedious paperwork and hello to intelligent automation.
          </motion.p>
          <motion.a
            href="#waitlist"
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className="px-6 py-3 bg-[#DBFB1E] text-[#203F30] font-semibold rounded-md hover:bg-[#9CCA46] transition-all shadow-md"
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
            src="/claimmate-preview.png"
            width={1024}
            height={1024}
            alt="ClaimMate preview"
            className="mx-auto"
          />
        </motion.div>
      </section>




      {/* Waitlist Form Section */}
      <motion.section
        id="waitlist"
        className="py-16 px-4 bg-[#F4F4F4]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-md mx-auto">
          <motion.h2
            className="text-2xl font-bold text-[#203F30] mb-6 text-center"
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

      {/* Footer */}
      <Footer />
    </main>
  )
}
