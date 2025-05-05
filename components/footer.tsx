"use client"

import Link from "next/link"
import { Twitter, Linkedin, Mail } from "lucide-react"
import { motion } from "framer-motion"
import Image from 'next/image'

export function Footer() {
  const socialLinks = [
    { icon: <Twitter className="h-5 w-5" />, href: "https://twitter.com", label: "Twitter" },
    { icon: <Linkedin className="h-5 w-5" />, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: <Mail className="h-5 w-5" />, href: "mailto:hello@claimmate.com", label: "Email" },
  ]

  return (
    <motion.footer
      className="bg-[#F4F4F4] py-12 px-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className='flex items-center mb-3'>
              <div className='w-10 h-10 overflow-hidden'>
                <Image src='/logos/claimmate-logo-icon-lemon-removebg.png' width={276} height={284} alt='ClaimMate logo.' className="size-full" />
              </div>
              <h3 className="text-lg font-semibold text-[#203F30]">About ClaimMate</h3>
            </div>
            <p className="text-sm text-[#1A1A1A] max-w-md">
              ClaimMate is revolutionizing the insurance claims process with AI-powered drafting tools designed
              specifically for insurance professionals. Our platform helps agents save time and improve accuracy.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col md:items-end"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-[#203F30] mb-3">Follow the build</h3>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    target="_blank"
                    className="text-[#203F30] hover:text-[#9CCA46] transition-colors"
                  >
                    {link.icon}
                    <span className="sr-only">{link.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-6">
              <p className="text-sm text-[#1A1A1A]">
                Contact:{" "}
                <motion.a
                  href="mailto:hello@claimmate.com"
                  className="text-[#203F30] hover:text-[#9CCA46]"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  hello@claimmate.com
                </motion.a>
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-8 pt-8 border-t border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-sm text-center text-[#1A1A1A]">
            &copy; {new Date().getFullYear()} ClaimMate. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  )
}
