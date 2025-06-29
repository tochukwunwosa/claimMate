"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import Logo from "./Logo"
interface NavType {
  name: string;
  href: string;
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

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

  const navItems: NavType[] = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#demo" },
    { name: "Pricing", href: "/pricing" },
  ]

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.98 },
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-150 ${scrolled ? "bg-white shadow-md py-2 border-b border-border" : "bg-transparent py-4"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Logo/>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-20">
          <ul className="group flex space-x-6">
            {navItems.map((item) => (
              <li key={item.name} className='cursor-pointer'>
                <Link
                  href={pathname === "/" ? item.href : `/#${item.href.replace(/^#/, "")}`}
                  className="group-hover:text-primary/50 text-foreground hover:text-primary font-medium transition-colors"
                >
                  {item.name}
                </Link>


              </li>
            ))}
          </ul>
        </nav>
        {/* auth */}
        <motion.a
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          className="px-4 py-2 bg-secondary text-primary font-semibold rounded-md hover:bg-secondary/90 transition-colors"
          href="#waitlist"
        >
          Try ClaimMate Free
        </motion.a>


        {/* Mobile Menu Button */}
        <button className="cursor-pointer md:hidden text-primary focus:outline-none" onClick={toggleMenu} aria-label="Toggle menu">
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
            className="md:hidden bg-white min-h-screen"
          >
            <div className="container mx-auto px-4 py-4">
              <ul className="group flex flex-col space-y-4">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="group-hover:text-primary/50  block w-fit py-2 text-foreground hover:text-primary font-medium transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}

                <li className="pt-2 ">

                  {/* auth */}
                  <motion.a
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    className="px-4 py-2 bg-secondary text-primary font-semibold rounded-md hover:bg-secondary/90 transition-colors"
                    href="#waitlist"
                  >
                    Try ClaimMate Free
                  </motion.a>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

