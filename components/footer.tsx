"use client"

import Image from 'next/image'
import Link from 'next/link'
import { motion } from "framer-motion"
import { Twitter, Linkedin, Mail } from "lucide-react"

export default function Footer() {
  const socialLinks = [
    { icon: <Twitter className="h-5 w-5" />, href: "https://twitter.com", label: "Twitter" },
    { icon: <Linkedin className="h-5 w-5" />, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: <Mail className="h-5 w-5" />, href: "mailto:hello@claimmate.com", label: "Email" },
  ]

  const navGroups = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "/pricing" },
        { name: "How it Works", href: "#demo" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", href: "/blog" },
        { name: "Documentation", href: "/docs" },
        { name: "Support", href: "/support" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
      ],
    },
  ]

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-12 px-4 bg-background border-t border-border"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='col-span-2'
          >
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/logos/ClaimMate-logo-icon-removebg.png"
                width={32}
                height={32}
                alt="ClaimMate Logo"
                className="w-8 h-8"
              />
              <span className="text-lg font-bold text-primary">ClaimMate</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              AI-powered claims drafting for independent insurance adjusters.
            </p>
          </motion.div>

          {/* Navigation Groups */}
          {navGroups.map((group, i) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
            >
              <h4 className="font-semibold text-primary mb-4">{group.title}</h4>
              <ul className="group flex flex-col space-y-4">
                {group.links.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="group-hover:text-primary/50 block w-fit py-2 text-muted-foreground hover:text-primary font-medium transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Socials and Contact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-primary mb-3">Follow the build</h3>
            <div className="group flex space-x-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  target="_blank"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="group-hover:text-primary/50 text-muted-foreground hover:text-secondary transition-colors"
                >
                  {link.icon}
                  <span className="sr-only">{link.label}</span>

                </motion.a>
              ))}
            </div>

            <div className="mt-6 group">
              <p className="text-sm text-foreground">
                Contact:{" "}
                <motion.a
                  href="mailto:getclaimmate@gmail.com"
                  className="group-hover:text-primary/50 text-muted-foreground hover:text-accent"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  getclaimmate@gmail.com
                </motion.a>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          className="mt-8 pt-8 border-t border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p className="text-sm text-center text-muted-foreground">
            &copy; {new Date().getFullYear()} ClaimMate. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  )
}
