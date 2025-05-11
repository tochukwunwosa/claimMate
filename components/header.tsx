"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AuthButton } from "@/components/auth/auth-button"

export default function Header() {
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="relative h-10 w-40 flex items-center">
            {/* Logo placeholder - replace with your actual logo */}
            <div className="bg-[#203F30] text-white font-bold px-3 py-2 rounded-md">ClaimMate</div>
            {/* Uncomment and use this when you have a logo image */}
            {/* <Image 
              src="/logo.png" 
              alt="ClaimMate" 
              fill 
              style={{ objectFit: "contain" }} 
              priority 
            /> */}
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
         
          <AuthButton />
        </nav>

        
      </div>

    </header>
  )
}
