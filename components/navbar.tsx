"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Features", href: "#features" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#waitlist" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
        }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="relative size-10 overflow-hidden flex items-center">
            <Image 
              src="/logos/ClaimMate-logo-icon-removebg.png" 
              alt="ClaimMate Logo." 
            width={80}
            height={80}
              priority 
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <ul className="flex space-x-6">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="text-[#1A1A1A] hover:text-[#203F30] font-medium transition-colors">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="#waitlist">
            <Button className="cursor-pointer bg-[#DBFB1E] text-[#203F30] hover:bg-[#9CCA46] font-semibold transition-colors">
              Join the Waitlist
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button className="cursor-pointer md:hidden text-[#203F30] focus:outline-none" onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-lg h-screen"
          >
            <div className="container mx-auto px-4 py-4">
              <ul className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="block w-fit py-2 text-[#1A1A1A] hover:text-[#203F30] font-medium transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
                <li className="pt-2">
                  <Link href="#waitlist" onClick={() => setIsOpen(false)} className="block w-full">
                    <Button className="cursor-pointer w-full bg-[#DBFB1E] text-[#203F30] hover:bg-[#9CCA46] font-semibold transition-colors">
                      Join the Waitlist
                    </Button>
                  </Link>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
