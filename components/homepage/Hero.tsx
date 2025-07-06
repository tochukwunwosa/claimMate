"use client"

import { motion } from "framer-motion"
import Image from 'next/image'

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.98 },
}

export function Hero() {
  return (
    <section className="pt-32 pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
              },
            },
          }}
          initial="hidden"
          animate="show"
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: {
                opacity: 1,
                y: 0,
                transition: {
                  ease: "easeOut",
                  duration: 0.5,
                },
              },
            }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary mb-6 leading-tight"
          >
            Draft Insurance Claims 10× Faster with AI
          </motion.h1>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: {
                opacity: 1,
                y: 0,
                transition: {
                  ease: "easeOut",
                  duration: 0.5,
                },
              },
            }}
            className="text-xl text-foreground/80 mb-8"
          >
            ClaimMate helps independent adjusters create accurate, client-ready claims in minutes — not hours.
          </motion.p>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: {
                opacity: 1,
                y: 0,
                transition: {
                  ease: "easeOut",
                  duration: 0.5,
                },
              },
            }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.a
              href="/auth/signup"
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="px-8 py-4 bg-secondary text-primary font-semibold rounded-md hover:bg-secondary/90 transition-colors text-lg"
            >
              Try ClaimMate Free
            </motion.a>
            <p className="text-sm text-muted-foreground mt-2">No credit card required • Free during beta</p>
          </motion.div>
        </motion.div>

        {/* Hero Demo */}
        <motion.div
          className="relative rounded-xl overflow-hidden shadow-2xl border border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-black rounded-md p-4">
            <Image
              src="/images/claimmate-dashboard.png"
              width={1920}
              height={1080}
              alt="ClaimMate Interface Demo"
              className="w-full"
              priority
            />
          </div>
          {/* <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" /> */}
        </motion.div>
      </div>
    </section>
  )
} 