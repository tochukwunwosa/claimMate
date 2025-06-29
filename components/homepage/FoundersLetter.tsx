"use client"

import { motion } from "framer-motion"
import Image from 'next/image'

export function FoundersLetter() {
  return (
    <section className="w-full py-24 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="bg-background rounded-xl p-8 md:p-12 shadow-lg border border-border"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="size-28 flex-shrink-0">
              <Image
                src="/images/founder-1032x1536.png"
                width={1032}
                height={1536}
                alt="Tochukwu Nwosa, Founder of ClaimMate."
                className="rounded-full size-full object-cover object-top"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">A Letter from Our Founder</h2>
              <div className="prose prose-lg text-muted-foreground">
                <p className="mb-4">
                  Dear Fellow Insurance Professional,
                </p>
                <p className="mb-4">
                  {`As a former insurance adjuster, I've experienced firsthand the challenges of drafting detailed property claims. The hours spent formatting documents, ensuring compliance, and maintaining consistency across claims were overwhelming. I knew there had to be a better way.`}
                </p>
                <p className="mb-4">
                 {` That's why I created ClaimMate. Our mission is to empower independent adjusters with AI technology that understands the nuances of insurance claims. We're not just building software; we're transforming the way claims are processed, making it faster, more accurate, and less stressful.`}
                </p>
                <p className="mb-4">
                  Every feature in ClaimMate is designed with your workflow in mind, backed by extensive feedback from active adjusters. We understand that time saved on paperwork means more time serving your clients and growing your business.
                </p>
                <p className="mb-6">
                  {`Thank you for considering ClaimMate. We're committed to supporting independent adjusters like you with tools that make a real difference in your daily work.`}
                </p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-semibold text-primary">Tochukwu Nwosa</p>
                    <p className="text-sm text-muted-foreground">Founder & CEO, ClaimMate</p>
                  </div>
                  <Image
                    src="/images/signature.png"
                    width={120}
                    height={60}
                    alt="Founder's Signature"
                    className="opacity-80"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 